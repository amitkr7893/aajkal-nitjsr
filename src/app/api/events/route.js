import { getEvents, createEvent, deleteEventById, updateEventById } from "@/lib/events";

export async function GET() {
  try {
    const events = await getEvents(); // Cached fetch
    // console.log(`GET /api/events returned ${events.length} events`);
    return Response.json(events);
  } catch (error) {
    console.error("GET /api/events error:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const res = await createEvent(data);
    // console.log(`POST /api/events added event with id: ${res.insertedId}`);
    return Response.json(res);
  } catch (error) {
    console.error("POST /api/events error:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    const res = await deleteEventById(id);

    if (res.deletedCount === 0) return new Response("Event not found", { status: 404 });

    // console.log(`DELETE /api/events removed event with id: ${id}`);
    return new Response("Event deleted", { status: 200 });
  } catch (error) {
    console.error("DELETE /api/events error:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...updateData } = await request.json();

    const res = await updateEventById(id, updateData);

    if (res.matchedCount === 0) return new Response("Event not found", { status: 404 });

    // console.log(`PUT /api/events updated event with id: ${id}`);
    return new Response("Event updated", { status: 200 });
  } catch (error) {
    console.error("PUT /api/events error:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}
