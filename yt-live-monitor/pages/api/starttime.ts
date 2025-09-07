// pages/api/starttime.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { setStartTime, getState, setThreadInfo, addEvent } from "./_storage";
import { sendMail } from "./_mailer";
import { buildStreamEmail, formatDuration } from "./_emailTemplate";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = (req.headers["authorization"] || req.headers["Authorization"]) as string | undefined;
  if (!process.env.AUTH_TOKEN) return res.status(500).json({ error: "AUTH_TOKEN not configured" });
  if (!token || token !== `Bearer ${process.env.AUTH_TOKEN}`) return res.status(401).json({ error: "Unauthorized" });
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const VIDEO_ID = process.env.YT_VIDEO_ID!;
  const now = new Date();
  await setStartTime(VIDEO_ID, now);
  const state = await getState(VIDEO_ID);
  const streamUrl = `${process.env.APP_BASE_URL || `https://youtube.com/watch?v=`}${VIDEO_ID}`;
  const elapsed = formatDuration(0);
  const html = buildStreamEmail({ videoId: VIDEO_ID, elapsed, streamUrl, startTime: now.toISOString(), status: "started" });
  try {
    let messageId = state?.threadMessageId;
    let subject = state?.threadSubject || `Live started — ${VIDEO_ID}`;
    if (!messageId) {
      const sent = await sendMail({ subject, html });
      messageId = sent.messageId;
      if (messageId) {
        await setThreadInfo(VIDEO_ID, messageId, subject);
      }
    } else {
      await sendMail({ subject, html, inReplyTo: messageId, references: [messageId] });
    }
    await addEvent({ videoId: VIDEO_ID, type: "reset", messageId, subject, timestamp: new Date().toISOString(), meta: { resetBy: "AUTH_TOKEN" } });
    return res.json({ message: "startTime reset & email sent", startTime: now.toISOString(), messageId });
  } catch (err: any) {
    await addEvent({ videoId: VIDEO_ID, type: "reset", timestamp: new Date().toISOString(), meta: { error: err.message } });
    return res.status(500).json({ error: err.message || String(err) });
  }
}
