// pages/api/_mailer.ts
import nodemailer from "nodemailer";
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "";
const TO_EMAILS = (process.env.TO_EMAILS || "").split(",").map(s => s.trim()).filter(Boolean);
if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !FROM_EMAIL || TO_EMAILS.length === 0) {
  // We'll allow calls to throw later; but warn in logs (server-side)
  console.warn("Mailer configuration incomplete. Check SMTP_* env vars and FROM_EMAIL/TO_EMAILS.");
}
export async function sendMail(opts: {
  subject: string;
  html: string;
  inReplyTo?: string | null;
  references?: string[] | null;
}) {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  const headers: any = {};
  if (opts.inReplyTo) headers["In-Reply-To"] = opts.inReplyTo;
  if (opts.references && opts.references.length) headers["References"] = opts.references.join(" ");
  const info = await transporter.sendMail({
    from: FROM_EMAIL,
    to: TO_EMAILS,
    subject: opts.subject,
    html: opts.html,
    headers,
  });
  return { messageId: info.messageId, info };
}
