import { put, list } from "@vercel/blob";
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

const BLOB_PATH = "ymm-data/audit-requests.json";
const BLOB_PREFIX = "ymm-data/";

const headers = [
  "ID",
  "Submitted At",
  "Status",
  "Name",
  "Business Name",
  "Business Type",
  "Facebook Page Link",
  "Phone / Viber / Telegram",
  "Main Marketing Problem",
  "Interested Package",
  "Monthly Marketing Budget Range",
  "Improve Areas",
  "Admin Notes",
  "Follow-up Date"
];

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

  // Upload to Vercel Blob (persists across cold starts)
  await put(BLOB_PATH, json, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false
  });

  return record;
}

export async function readAuditRequests(): Promise<AuditRequestRecord[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_PREFIX });

    // Find our data file
    const dataBlob = blobs.find((b) => b.pathname === BLOB_PATH);
    if (!dataBlob) return [];

    const response = await fetch(dataBlob.url);
    if (!response.ok) return [];

    const records: AuditRequestRecord[] = await response.json();

    return records.sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt));
  } catch {
    return [];
  }
}

export async function generateExcelBuffer(): Promise<Buffer> {
  const records = await readAuditRequests();

  const rows = [headers, ...records.map(recordToRow)];

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Audit Requests");

  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  return Buffer.from(buffer);
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
    record.id,
    record.submittedAt,
    record.status,
    record.name,
    record.businessName,
    record.businessType ?? "",
    record.facebookPage ?? "",
    record.contact,
    record.problem,
    record.package,
    record.budget,
    record.improvements.join(", "),
    record.adminNotes,
    record.followUpDate
  ];
}
