// pages/api/_mongo.ts
import { MongoClient, Db, Collection } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "";
const DB_NAME = process.env.MONGODB_DB || "techwithjoshi";
const COLL = process.env.MONGODB_COLLECTION || "stream_states";
if (!MONGODB_URI) {
  throw new Error("Please set MONGODB_URI in env");
}
declare global {
  // eslint-disable-next-line
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}
let clientPromise: Promise<MongoClient>;
if (!(global as any)._mongoClientPromise) {
  const client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
  (global as any)._mongoClientPromise = clientPromise;
} else {
  clientPromise = (global as any)._mongoClientPromise!;
}
export async function getCollection(): Promise<Collection> {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection(COLL);
}
export async function getEventsCollection(): Promise<Collection> {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection(process.env.MONGODB_EVENTS_COLL || "stream_events");
}
