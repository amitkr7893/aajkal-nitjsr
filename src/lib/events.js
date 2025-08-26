import { connectToDatabase } from "./mongodb";
import { ObjectId } from "mongodb";

let cachedEvents = null; // in-memory cache
let lastFetchTime = null; // optional, to track cache timing

// GET - Fetch events (cached)
export async function getEvents() {
  if (cachedEvents) {
    // console.log("✅ Serving events from cache"); // log cache hit
    return cachedEvents;
  }

//   console.log("🤦‍♂️ Fetching events from MongoDB"); // log DB fetch
  const db = await connectToDatabase();

  const events = await db.collection("events")
    .find({})
    .sort({ date: 1 })
    .toArray();

  cachedEvents = events.map(event => ({
    ...event,
    _id: event._id.toString()
  }));
  lastFetchTime = new Date();

  return cachedEvents;
}

// Clear cache manually
export function clearEventCache() {
  cachedEvents = null;
//   console.log("♻️ Event cache cleared");
}

// POST - Create new event
export async function createEvent(data) {
  const db = await connectToDatabase();
  const res = await db.collection("events").insertOne(data);
  clearEventCache(); // invalidate cache after adding
  return res;
}

// DELETE - Remove event by ID
export async function deleteEventById(id) {
  if (!id) throw new Error("Missing ID");
  const db = await connectToDatabase();
  const res = await db.collection("events").deleteOne({ _id: new ObjectId(id) });
  clearEventCache(); // invalidate cache after deleting
  return res;
}

// PUT - Update event by ID
export async function updateEventById(id, updateData) {
  if (!id) throw new Error("Missing ID");
  if (!ObjectId.isValid(id)) throw new Error("Invalid ID format");

  const db = await connectToDatabase();
  const res = await db.collection("events").updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
  clearEventCache(); // invalidate cache after updating
  return res;
}
