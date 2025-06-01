// src/app/api/events/route.js
import { connectToDatabase }  from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectToDatabase() ;
    // const db = client.db("aajkal");
    const events = await db.collection("events").find().sort({ date: 1 }).toArray();
    return Response.json(events);
  } catch (error) {
    console.error("GET /api/events error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = await connectToDatabase() ;
    // const db = client.db("aajkal");
    const data = await request.json();
    const res = await db.collection("events").insertOne(data);
    return Response.json(res);
  } catch (error) {
    console.error("POST /api/events error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
