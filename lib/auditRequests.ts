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

// Each record = its own blob file — no overwrite possible
const RECORD_PREFIX = "ymm-data/record-";

let blobAvailable: boolean | null = null;

async function hasBlob(): Promise<boolean> {
  if (blobAvailable !== null) return blobAvailable;
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    blobAvailable = false;
    return false;
  }
  try {
    const { list } = await import("@vercel/blob");
    await list({ prefix: RECORD_PREFIX, limit: 1 });
    blobAvailable = true;
  } catch {
    blobAvailable = false;
  }
  console.log("hasBlob =>", blobAvailable);
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
  const record = createRecord(input);
  console.log("appendAuditRequest: saving", record.id);

  // Save to Blob with ZERO CDN cache
  if (await hasBlob()) {
    const { put } = await import("@vercel/blob");
    const blobPath = `${RECORD_PREFIX}${record.id}.json`;
    const result = await put(blobPath, JSON.stringify(record), {
      access: "public",
      contentType: "application/json",
      cacheControlMaxAge: 0    // disable CDN caching
    });
    console.log("Blob put OK:", result.pathname);
  }

  // Always update local /tmp too
  const localRecords = readLocalRecords();
  localRecords.push(record);
  ensureDir();
  writeFileSync(jsonPath, JSON.stringify(localRecords, null, 2), "utf-8");
  syncExcel(localRecords);
  console.log("Local save OK:", localRecords.length, "records");

  return record;
}

export async function readAuditRequests(): Promise<AuditRequestRecord[]> {
  // Check local /tmp first (instant, always fresh for same instance)
  const local = readLocalRecords();
  if (local.length > 0) {
    console.log("readAuditRequests: returning", local.length, "from local");
    return local;
  }

  // Cross-instance fallback: load from Blob
  if (await hasBlob()) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: RECORD_PREFIX });
      console.log("Blob list found:", blobs.length, "files");

      if (blobs.length > 0) {
        const results = await Promise.allSettled(
          blobs.map(async (b) => {
            const res = await fetch(b.url, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json() as Promise<AuditRequestRecord>;
          })
        );

        const records: AuditRequestRecord[] = [];
        for (const result of results) {
          if (result.status === "fulfilled" && result.value?.id) {
            records.push(result.value);
          } else if (result.status === "rejected") {
            console.log("Blob fetch failed:", result.reason);
          }
        }

        const sorted = records.sort(
          (a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt)
        );
        console.log("readAuditRequests: returning", sorted.length, "from Blob");

        // Sync local for faster next read
        if (sorted.length > 0) {
          try {
            ensureDir();
            writeFileSync(jsonPath, JSON.stringify(sorted, null, 2), "utf-8");
          } catch { /* best effort */ }
        }

        return sorted;
      }
    } catch (err) {
      console.error("Blob read error:", err);
    }
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
