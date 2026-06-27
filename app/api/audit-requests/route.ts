import { NextRequest, NextResponse } from "next/server";
import {
  appendAuditRequest,
  readAuditRequests,
  updateAuditRequestStatus,
  validateAuditRequest
} from "@/lib/auditRequests";
import { sendAuditNotification } from "@/lib/email";

export const runtime = "nodejs";

const adminPassword = process.env.ADMIN_PASSWORD ?? "YMM-d4sh-7x2k!sEcUrE";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const validation = validateAuditRequest(payload);

    if (!validation.valid) {
      return NextResponse.json({ message: validation.message }, { status: 400 });
    }

    const record = await appendAuditRequest({
      name: payload.name,
      businessName: payload.businessName,
      businessType: payload.businessType,
      facebookPage: payload.facebookPage,
      contact: payload.contact,
      problem: payload.problem,
      package: payload.package,
      budget: payload.budget,
      improvements: Array.isArray(payload.improvements) ? payload.improvements : []
    });

    // Send email notification (non-blocking fire-and-forget)
    sendAuditNotification({
      name: payload.name,
      businessName: payload.businessName,
      businessType: payload.businessType,
      facebookPage: payload.facebookPage,
      contact: payload.contact,
      problem: payload.problem,
      package: payload.package,
      budget: payload.budget,
      improvements: Array.isArray(payload.improvements) ? payload.improvements : []
    }).catch((err) => console.error("Email notification failed:", err));

    return NextResponse.json({ message: "Audit request saved", record }, { status: 201 });
  } catch (error) {
    console.error("Audit request save failed", error);
    return NextResponse.json({ message: "Could not save audit request" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (request.headers.get("x-admin-password") !== adminPassword) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ requests: await readAuditRequests() });
}

export async function PATCH(request: NextRequest) {
  if (request.headers.get("x-admin-password") !== adminPassword) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status, adminNotes, followUpDate } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ message: "id and status are required" }, { status: 400 });
    }

    await updateAuditRequestStatus(id, status, adminNotes ?? "", followUpDate ?? "");

    return NextResponse.json({ message: "Status updated" });
  } catch (error) {
    console.error("Status update failed", error);
    return NextResponse.json({ message: "Could not update status" }, { status: 500 });
  }
}
