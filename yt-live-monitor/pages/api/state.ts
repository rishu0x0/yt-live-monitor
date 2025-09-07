// pages/api/state.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getState, getEvents } from "./_storage";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const VIDEO_ID = process.env.YT_VIDEO_ID!;
  const state = await getState(VIDEO_ID);
  const events = await getEvents(VIDEO_ID, 100);
  return res.json({ state, events });
}
