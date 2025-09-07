// pages/api/youtube-check.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getState, setStartTime, addEvent } from "./_storage";
const YT_KEY = process.env.YT_API_KEY || "";
const VIDEO_ID = process.env.YT_VIDEO_ID || "";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!YT_KEY || !VIDEO_ID) return res.status(500).json({ error: "Missing YT_API_KEY or YT_VIDEO_ID" });
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${VIDEO_ID}&key=${YT_KEY}`;
    const r = await axios.get(url);
    const items = r.data.items || [];
    if (!items.length) {
      await addEvent({ videoId: VIDEO_ID, type: "youtube-check", timestamp: new Date().toISOString(), meta: { found: false } });
      return res.status(404).json({ error: "Video not found" });
    }
    const liveDetails = items[0].liveStreamingDetails || {};
    const actualStartTime: string | undefined = liveDetails.actualStartTime;
    const currentlyLive = !!actualStartTime;
    const stored = await getState(VIDEO_ID);
    if (currentlyLive && !stored?.startTime) {
      const ts = actualStartTime ? new Date(actualStartTime) : new Date();
      await setStartTime(VIDEO_ID, ts);
      await addEvent({ videoId: VIDEO_ID, type: "auto-start", timestamp: new Date().toISOString(), meta: { actualStartTime } });
      return res.json({ message: "startTime set (auto)", startTime: ts.toISOString() });
    }
    await addEvent({ videoId: VIDEO_ID, type: "youtube-check", timestamp: new Date().toISOString(), meta: { currentlyLive, actualStartTime, storedStart: stored?.startTime ?? null } });
    return res.json({ currentlyLive, actualStartTime: actualStartTime || null, storedStartTime: stored?.startTime || null });
  } catch (err: any) {
    await addEvent({ videoId: VIDEO_ID, type: "youtube-check", timestamp: new Date().toISOString(), meta: { error: err.message } });
    return res.status(500).json({ error: err.message || String(err) });
  }
}
