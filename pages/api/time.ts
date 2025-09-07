// pages/api/time.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getState } from "./_storage";
import { formatDuration } from "./_emailTemplate";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const VIDEO_ID = process.env.YT_VIDEO_ID!;
  const state = await getState(VIDEO_ID);
  if (!state?.startTime) return res.json({ running: false, message: "Start time not set" });
  const start = new Date(state.startTime);
  const now = new Date();
  const elapsed = formatDuration(now.getTime() - start.getTime());
  return res.json({ running: true, startTime: start.toISOString(), elapsed });
}
