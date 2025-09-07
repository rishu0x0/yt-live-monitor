// pages/api/_storage.ts
import { getCollection, getEventsCollection } from "./_mongo";

export type StreamStateDoc = {
  _id: string; // videoId
  videoId: string;
  startTime: string | null;
  threadMessageId?: string;
  threadSubject?: string;
  updatedAt: string;
};

export async function getState(videoId: string): Promise<StreamStateDoc | null> {
  const col = await getCollection();
  const doc = await col.findOne({ _id: videoId });
  return doc as StreamStateDoc | null;
}

export async function setStartTime(videoId: string, dt: Date | null) {
  const col = await getCollection();
  if (dt === null) {
    await col.deleteOne({ _id: videoId });
    return;
  }
  const payload: StreamStateDoc = {
    _id: videoId,
    videoId,
    startTime: dt.toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await col.updateOne({ _id: videoId }, { $set: payload }, { upsert: true });
}

export async function setThreadInfo(videoId: string, messageId: string, subject?: string) {
  const col = await getCollection();
  await col.updateOne(
    { _id: videoId },
    { $set: { threadMessageId: messageId, threadSubject: subject || `Live — ${videoId}`,
      updatedAt: new Date().toISOString() } },
    { upsert: true }
  );
}

// Events (audit)
export type EventDoc = {
  _id?: any;
  videoId: string;
  type: "started" | "reset" | "email" | "auto-start" | "youtube-check";
  messageId?: string;
  subject?: string;
  timestamp: string;
  meta?: any;
};

export async function addEvent(evt: EventDoc) {
  const col = await getEventsCollection();
  await col.insertOne(evt);
}

export async function getEvents(videoId: string, limit = 50) {
  const col = await getEventsCollection();
  const docs = await col.find({ videoId }).sort({ timestamp: -1 }).limit(limit).toArray();
  return docs as EventDoc[];
}
