import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import * as XLSX from "xlsx";

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

// /tmp for fast same-instance reads on Vercel
const storageDir = process.env.VERCEL
  ? path.join("/tmp", "ymm-storage")
  : path.join(process.cwd(), "storage");

const jsonPath = path.join(storageDir, "audit-requests.json");
const xlsxPath = path.join(storageDir, "audit-requests.xlsx");
const sheetName = "Audit Requests";

const headers = [
  "ID", "Submitted At", "Status", "Name", "Business Name", "Business Type",
  "Facebook Page Link", "Phone / Viber / Telegram", "Main Marketing Problem",
  "Interested Package", "Monthly Marketing Budget Range", "Improve Areas",
  "Admin Notes", "Follow-up Date"
];

// Each booking = its own immutable Blob file → no race condition, no overwrites
const RECORD_PREFIX = "ymm-data/record-";

function hasBlob(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

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
  const record = createRecord(input);

  // Upload as individual immutable blob (no race condition possible)
  if (hasBlob()) {
    const { put } = await import("@vercel/blob");
    await put(`${RECORD_PREFIX}${record.id}.json`, JSON.stringify(record), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      cacheControlMaxAge: 0
    });
  }

  // Update local /tmp for fast same-instance reads
  const local = readLocalRecords();
  local.push(record);
  ensureDir();
  writeFileSync(jsonPath, JSON.stringify(local, null, 2), "utf-8");
  syncExcel(local);

  return record;
}

export async function readAuditRequests(): Promise<AuditRequestRecord[]> {
  // Fast path: same instance as write → /tmp has latest
  const local = readLocalRecords();
  if (local.length > 0) return local;

  // Slow path: new instance → load all records from Blob
  if (hasBlob()) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: RECORD_PREFIX });

      if (blobs.length > 0) {
        const results = await Promise.allSettled(
          blobs.map((b) =>
            fetch(b.url, { cache: "no-store" }).then((r) => r.json())
          )
        );

        const records: AuditRequestRecord[] = [];
        for (const r of results) {
          if (r.status === "fulfilled" && r.value?.id) {
            records.push(r.value);
          }
        }

        const sorted = records.sort(
          (a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt)
        );

        // Warm /tmp for next read on this instance
        if (sorted.length > 0) {
          try {
            ensureDir();
            writeFileSync(jsonPath, JSON.stringify(sorted, null, 2), "utf-8");
          } catch {}
        }

        return sorted;
      }
    } catch {}
  }

  return [];
}

export async function generateExcelBuffer(): Promise<Buffer> {
  const records = await readAuditRequests();
  const rows = [headers, ...records.map(recordToRow)];
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  return Buffer.from(buffer);
}

function readLocalRecords(): AuditRequestRecord[] {
  if (!existsSync(jsonPath)) return [];
  try {
    const raw = readFileSync(jsonPath, "utf-8");
    const records: AuditRequestRecord[] = JSON.parse(raw);
    return records.sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt));
  } catch {
    return [];
  }
}

function ensureDir() {
  if (!existsSync(storageDir)) mkdirSync(storageDir, { recursive: true });
}

function syncExcel(records: AuditRequestRecord[]) {
  const rows = [headers, ...records.map(recordToRow)];
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  ensureDir();
  writeFileSync(xlsxPath, Buffer.from(buffer));
}

function createRecord(input: AuditRequestInput): AuditRequestRecord {
  return {
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
}

function recordToRow(record: AuditRequestRecord) {
  return [
    record.id, record.submittedAt, record.status, record.name,
    record.businessName, record.businessType ?? "", record.facebookPage ?? "",
    record.contact, record.problem, record.package, record.budget,
    record.improvements.join(", "), record.adminNotes, record.followUpDate
  ];
}
