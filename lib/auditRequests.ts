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

// Vercel only allows writes to /tmp in production
const storageDir = process.env.VERCEL ? path.join("/tmp", "ymm-storage") : path.join(process.cwd(), "storage");
export const auditWorkbookPath = path.join(storageDir, "audit-requests.xlsx");
const sheetName = "Audit Requests";

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

export function appendAuditRequest(input: AuditRequestInput) {
  ensureWorkbook();
  const workbook = readWorkbook();
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1, defval: "" });
  const record = createRecord(input);

  rows.push(recordToRow(record));
  workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(rows);
  writeWorkbook(workbook);

  return record;
}

export function readAuditRequests() {
  ensureWorkbook();
  const workbook = readWorkbook();
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1, defval: "" }).slice(1);

  return rows
    .filter((row) => row.some(Boolean))
    .map(rowToRecord)
    .sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt));
}

function ensureWorkbook() {
  if (!existsSync(storageDir)) {
    mkdirSync(storageDir, { recursive: true });
  }

  if (!existsSync(auditWorkbookPath)) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([headers]);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    writeWorkbook(workbook);
  }
}

function readWorkbook() {
  const file = readFileSync(auditWorkbookPath);
  return XLSX.read(file, { type: "buffer" });
}

function writeWorkbook(workbook: XLSX.WorkBook) {
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  writeFileSync(auditWorkbookPath, buffer);
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

function rowToRecord(row: string[]): AuditRequestRecord {
  return {
    id: row[0] ?? "",
    submittedAt: row[1] ?? "",
    status: normalizeStatus(row[2]),
    name: row[3] ?? "",
    businessName: row[4] ?? "",
    businessType: row[5] ?? "",
    facebookPage: row[6] ?? "",
    contact: row[7] ?? "",
    problem: row[8] ?? "",
    package: row[9] ?? "",
    budget: row[10] ?? "",
    improvements: row[11] ? row[11].split(",").map((item) => item.trim()).filter(Boolean) : [],
    adminNotes: row[12] ?? "",
    followUpDate: row[13] ?? ""
  };
}

function normalizeStatus(status: string): AuditRequestRecord["status"] {
  if (status === "Contacted" || status === "Audit Booked" || status === "Won" || status === "Not Fit") {
    return status;
  }

  return "New";
}
