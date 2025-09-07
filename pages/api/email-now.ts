// pages/api/email-now.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getState, addEvent } from "./_storage";
import { sendMail } from "./_mailer";
import { buildStreamEmail, formatDuration } from "./_emailTemplate";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = (req.headers["authorization"] || req.headers["Authorization"]) as string | undefined;
  if (!process.env.AUTH_TOKEN) return res.status(500).json({ error: "AUTH_TOKEN not configured" });
  if (!token || token !== `Bearer ${process.env.AUTH_TOKEN}`) return res.status(401).json({ error: "Unauthorized" });
  const VIDEO_ID = process.env.YT_VIDEO_ID!;
  const state = await getState(VIDEO_ID);
  if (!state?.startTime) return res.status(400).json({ error: "Start time not set" });
  try {
    const start = new Date(state.startTime);
    const now = new Date();
    const elapsed = formatDuration(now.getTime() - start.getTime());
    const streamUrl = `${process.env.APP_BASE_URL || `https://youtube.com/watch?v=`}${VIDEO_ID}`;
    const html = buildStreamEmail({ videoId: VIDEO_ID, elapsed, streamUrl, startTime: start.toISOString(), status: "update" });
    if (!state.threadMessageId) {
      const subject = `Live update — ${VIDEO_ID}`;
      const sent = await sendMail({ subject, html });
      await addEvent({ videoId: VIDEO_ID, type: "email", messageId: sent.messageId, subject, timestamp: new Date().toISOString(), meta: { method: "email-now" } });
      // save thread root
      const { setThreadInfo } = await import("./_storage");
      await setThreadInfo(VIDEO_ID, sent.messageId, subject);
      return res.json({ message: "email sent (new thread)", messageId: sent.messageId });
    } else {
      const subject = state.threadSubject || `Live update — ${VIDEO_ID}`;
      const sent = await sendMail({ subject, html, inReplyTo: state.threadMessageId, references: [state.threadMessageId] });
      await addEvent({ videoId: VIDEO_ID, type: "email", messageId: sent.messageId, subject, timestamp: new Date().toISOString(), meta: { inReplyTo: state.threadMessageId } });
      return res.json({ message: "email sent (reply)", messageId: sent.messageId });
    }
  } catch (err: any) {
    await addEvent({ videoId: VIDEO_ID, type: "email", timestamp: new Date().toISOString(), meta: { error: err.message } });
    return res.status(500).json({ error: err.message || String(err) });
  }
}
