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

// Storage paths — Vercel can write to /tmp
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

let blobAvailable: boolean | null = null;

// In-memory cache — instant reads after a write on the same instance
// (Vercel serverless keeps module state warm across invocations)
let cachedRecords: AuditRequestRecord[] | null = null;

async function hasBlob(): Promise<boolean> {
  if (blobAvailable !== null) return blobAvailable;

  // Only try Blob when BLOB_READ_WRITE_TOKEN is set
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    blobAvailable = false;
    return false;
  }

  try {
    const { list } = await import("@vercel/blob");
    await list({ prefix: "ymm-data/", limit: 1 });
    blobAvailable = true;
  } catch {
    blobAvailable = false;
  }

  return blobAvailable;
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
  const existing = await readAuditRequests();
  const record = createRecord(input);
  existing.push(record);

  const json = JSON.stringify(existing, null, 2);

  if (await hasBlob()) {
    const { put } = await import("@vercel/blob");
    await put("ymm-data/audit-requests.json", json, {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false
    });
  }

  // Update in-memory cache so reads are instant
  cachedRecords = existing;

  // Always save locally too (backup)
  ensureDir();
  writeFileSync(jsonPath, json, "utf-8");
  syncExcel(existing);

  return record;
}

export async function readAuditRequests(): Promise<AuditRequestRecord[]> {
  // Return in-memory cache immediately if available (instant, no network)
  if (cachedRecords) {
    return cachedRecords;
  }

  // Always read from Blob first (authoritative source, persistent)
  if (await hasBlob()) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "ymm-data/" });
      const dataBlob = blobs.find((b) => b.pathname === "ymm-data/audit-requests.json");

      if (dataBlob) {
        // Cache-bust to prevent Vercel CDN from returning stale empty data
        const response = await fetch(`${dataBlob.url}?t=${Date.now()}`);
        if (response.ok) {
          const records: AuditRequestRecord[] = await response.json();
          const sorted = records.sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt));

          // Warm the in-memory cache so next read is instant
          cachedRecords = sorted;

          // Sync to local so fallback has latest data too
          try {
            ensureDir();
            writeFileSync(jsonPath, JSON.stringify(sorted, null, 2), "utf-8");
          } catch { /* ignore — best effort */ }

          return sorted;
        }
      }
    } catch {
      // Blob read failed — fall through to local
    }
  }

  // Local fallback
  if (!existsSync(jsonPath)) return [];

  try {
    const raw = readFileSync(jsonPath, "utf-8");
    const records: AuditRequestRecord[] = JSON.parse(raw);
    const sorted = records.sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt));
    cachedRecords = sorted;
    return sorted;
  } catch {
    return [];
  }
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

function ensureDir() {
  if (!existsSync(storageDir)) {
    mkdirSync(storageDir, { recursive: true });
  }
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
