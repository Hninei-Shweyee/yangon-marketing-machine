import nodemailer from "nodemailer";
import type { AuditRequestInput } from "./auditRequests";

function getSmtpConfig() {
  const host = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return { host, port, user, pass };
}

export async function sendAuditNotification(record: AuditRequestInput): Promise<boolean> {
  const config = getSmtpConfig();

  if (!config) {
    console.warn("Email skipped: SMTP_USER and SMTP_PASS env vars not set");
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass }
  });

  const to = process.env.NOTIFICATION_EMAIL ?? "business@yangonmarketingmachine.com";

  const improvements = record.improvements.length > 0 ? record.improvements.join(", ") : "None selected";

  try {
    await transporter.sendMail({
      from: config.user,
      to,
      subject: `🔔 New Audit Request: ${record.businessName} — ${record.package}`,
      text: [
        "=== New YMM Audit Request ===",
        "",
        `Name: ${record.name}`,
        `Business: ${record.businessName}${record.businessType ? ` (${record.businessType})` : ""}`,
        `Contact: ${record.contact}`,
        `Facebook: ${record.facebookPage ?? "N/A"}`,
        `Package: ${record.package}`,
        `Budget: ${record.budget}`,
        `Improvements: ${improvements}`,
        "",
        "Problem:",
        record.problem,
        "",
        "— Yangon Marketing Machine"
      ].join("\n")
    });

    console.log(`Audit notification sent to ${to} for ${record.businessName}`);
    return true;
  } catch (error) {
    console.error("Failed to send audit notification email", error);
    return false;
  }
}
