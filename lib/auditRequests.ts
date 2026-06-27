import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ensureTable, hasDatabase, sql } from "@/lib/db";

export type AuditRequestInput = {
  name: string;
  businessName: string;
  businessType?: string;
  facebookPage?: string;
  contact: string;
  problem: string;
  package: string;
  budget: string;
  improvements: string[];
};

export type AuditRequestRecord = AuditRequestInput & {
  id: string;
  submittedAt: string;
  status: "New" | "Contacted" | "Audit Booked" | "Won" | "Not Fit";
  adminNotes: string;
  followUpDate: string;
};

// Local /tmp fallback for when Neon isn't connected yet
const storageDir = path.join("/tmp", "ymm-storage");
const jsonPath = path.join(storageDir, "audit-requests.json");

export function validateAuditRequest(payload: Partial<AuditRequestInput>) {
  const missing = ["name", "businessName", "contact", "problem", "package", "budget"].filter((field) => {
    const value = payload[field as keyof AuditRequestInput];
    return typeof value !== "string" || value.trim().length === 0;
  });
  if (missing.length > 0) {
    return { valid: false, message: `Missing required fields: ${missing.join(", ")}` };
  }
  return { valid: true, message: "" };
}

export async function appendAuditRequest(input: AuditRequestInput): Promise<AuditRequestRecord> {
  const record: AuditRequestRecord = {
    id: `YMM-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: "New",
    name: input.name.trim(),
    businessName: input.businessName.trim(),
    businessType: input.businessType?.trim() ?? "",
    facebookPage: input.facebookPage?.trim() ?? "",
    contact: input.contact.trim(),
    problem: input.problem.trim(),
    package: input.package.trim(),
    budget: input.budget.trim(),
    improvements: input.improvements ?? [],
    adminNotes: "",
    followUpDate: ""
  };

  if (hasDatabase()) {
    await ensureTable();
    await sql()`
      INSERT INTO audit_requests (
        id, submitted_at, status, name, business_name, business_type,
        facebook_page, contact, problem, package, budget,
        improvements, admin_notes, follow_up_date
      ) VALUES (
        ${record.id}, ${record.submittedAt}, ${record.status},
        ${record.name}, ${record.businessName}, ${record.businessType},
        ${record.facebookPage}, ${record.contact}, ${record.problem},
        ${record.package}, ${record.budget},
        ${record.improvements}, ${record.adminNotes}, ${record.followUpDate}
      )
    `;
  }

  // Always save to /tmp as backup
  const local = readLocal();
  local.push(record);
  saveLocal(local);

  return record;
}

export async function readAuditRequests(): Promise<AuditRequestRecord[]> {
  if (hasDatabase()) {
    try {
      await ensureTable();
      const rows = await sql()`
        SELECT
          id, submitted_at, status, name, business_name, business_type,
          facebook_page, contact, problem, package, budget,
          improvements, admin_notes, follow_up_date
        FROM audit_requests
        ORDER BY submitted_at DESC
      `;

      const records = (rows as Record<string, unknown>[]).map(rowToRecord);

      // Sync to /tmp
      if (records.length > 0) {
        try { saveLocal(records); } catch {}
      }

      return records;
    } catch (err) {
      console.error("Neon read failed, falling back to local:", err);
      // Fall through to local
    }
  }

  return readLocal();
}

export async function updateAuditRequestStatus(
  id: string,
  status: AuditRequestRecord["status"],
  adminNotes: string,
  followUpDate: string
): Promise<void> {
  if (hasDatabase()) {
    await ensureTable();
    await sql()`
      UPDATE audit_requests
      SET status = ${status}, admin_notes = ${adminNotes}, follow_up_date = ${followUpDate}
      WHERE id = ${id}
    `;
  }

  // Also update local
  const local = readLocal();
  const idx = local.findIndex((r) => r.id === id);
  if (idx >= 0) {
    local[idx] = { ...local[idx], status, adminNotes, followUpDate };
    saveLocal(local);
  }
}

export async function generateExcelBuffer(): Promise<Buffer> {
  const records = await readAuditRequests();
  const XLSX = await import("xlsx");

  const headers = [
    "ID", "Submitted At", "Status", "Name", "Business Name", "Business Type",
    "Facebook Page Link", "Phone / Viber / Telegram", "Main Marketing Problem",
    "Interested Package", "Monthly Marketing Budget Range", "Improve Areas",
    "Admin Notes", "Follow-up Date"
  ];

  const rows = [headers, ...records.map(recordToRow)];
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Audit Requests");
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  return Buffer.from(buffer);
}

// --- Local /tmp helpers ---

function readLocal(): AuditRequestRecord[] {
  if (!existsSync(jsonPath)) return [];
  try {
    const raw = readFileSync(jsonPath, "utf-8");
    const records: AuditRequestRecord[] = JSON.parse(raw);
    return records.sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt));
  } catch {
    return [];
  }
}

function saveLocal(records: AuditRequestRecord[]) {
  if (!existsSync(storageDir)) mkdirSync(storageDir, { recursive: true });
  writeFileSync(jsonPath, JSON.stringify(records, null, 2), "utf-8");
}

// --- Helpers ---

function rowToRecord(row: Record<string, unknown>): AuditRequestRecord {
  return {
    id: String(row.id ?? ""),
    submittedAt: String(row.submitted_at ?? ""),
    status: normalizeStatus(String(row.status ?? "")),
    name: String(row.name ?? ""),
    businessName: String(row.business_name ?? ""),
    businessType: String(row.business_type ?? ""),
    facebookPage: String(row.facebook_page ?? ""),
    contact: String(row.contact ?? ""),
    problem: String(row.problem ?? ""),
    package: String(row.package ?? ""),
    budget: String(row.budget ?? ""),
    improvements: Array.isArray(row.improvements) ? row.improvements as string[] : [],
    adminNotes: String(row.admin_notes ?? ""),
    followUpDate: String(row.follow_up_date ?? "")
  };
}

function recordToRow(record: AuditRequestRecord) {
  return [
    record.id, record.submittedAt, record.status, record.name,
    record.businessName, record.businessType ?? "", record.facebookPage ?? "",
    record.contact, record.problem, record.package, record.budget,
    record.improvements.join(", "), record.adminNotes, record.followUpDate
  ];
}

function normalizeStatus(status: string): AuditRequestRecord["status"] {
  if (status === "Contacted" || status === "Audit Booked" || status === "Won" || status === "Not Fit") {
    return status;
  }
  return "New";
}
