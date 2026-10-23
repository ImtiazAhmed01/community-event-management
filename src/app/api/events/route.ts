import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { EventModel } from "@/models";
import { INITIAL_EVENTS } from "@/lib/seedData";

export async function GET() {
  try {
    await connectDB();
    let events = await EventModel.find({}).sort({ eventDate: 1 });
    
    // Auto-seed initial events if collection is empty
    if (!events || events.length === 0) {
      await EventModel.insertMany(INITIAL_EVENTS);
      events = await EventModel.find({}).sort({ eventDate: 1 });
    }

    return NextResponse.json(events);
  } catch (err: unknown) {
    console.warn("MongoDB fetch fallback to initial data:", err);
    return NextResponse.json(INITIAL_EVENTS);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const newEvent = await EventModel.create({
      ...data,
      id: data.id || "evt-" + Date.now().toString()
    });
    return NextResponse.json(newEvent, { status: 201 });
  } catch (err: unknown) {
    console.error("MongoDB create event error:", err);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
