import { NextRequest, NextResponse } from "next/server";
import { generateExcelBuffer } from "@/lib/auditRequests";

export const runtime = "nodejs";

const adminPassword = process.env.ADMIN_PASSWORD ?? "YMM-d4sh-7x2k!sEcUrE";

export async function GET(request: NextRequest) {
  if (request.headers.get("x-admin-password") !== adminPassword) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const buffer = await generateExcelBuffer();

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="audit-requests.xlsx"'
    }
  });
}
