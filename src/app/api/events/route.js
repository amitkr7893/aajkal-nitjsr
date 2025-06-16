// src/app/api/events/route.js
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const db = await connectToDatabase();
    const events = await db.collection("events").find().sort({ date: 1 }).toArray();
    return Response.json(events);
  } catch (error) {
    console.error("GET /api/events error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = await connectToDatabase();
    const data = await request.json();
    const res = await db.collection("events").insertOne(data);
    return Response.json(res);
  } catch (error) {
    console.error("POST /api/events error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const db = await connectToDatabase();
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) return new Response("Missing ID", { status: 400 });

    const res = await db.collection("events").deleteOne({ _id: new ObjectId(id) });

    if (res.deletedCount === 0) return new Response("Event not found", { status: 404 });

    return new Response("Event deleted", { status: 200 });
  } catch (error) {
    console.error("DELETE /api/events error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const db = await connectToDatabase();
    const { id, ...updateData } = await request.json();

    if (!id) return new Response("Missing ID", { status: 400 });

    if (!ObjectId.isValid(id)) return new Response("Invalid ID format", { status: 400 });

    const res = await db.collection("events").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (res.matchedCount === 0) return new Response("Event not found", { status: 404 });

    return new Response("Event updated", { status: 200 });
  } catch (error) {
    console.error("PUT /api/events error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
