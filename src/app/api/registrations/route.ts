import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { RegistrationModel } from "@/models";
import { INITIAL_REGISTRATIONS } from "@/lib/seedData";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const userId = searchParams.get("userId");

    await connectDB();
    const query: Record<string, string> = {};
    if (eventId) query.eventId = eventId;
    if (userId) query.userId = userId;

    let registrations = await RegistrationModel.find(query).sort({ createdAt: -1 });

    if ((!registrations || registrations.length === 0) && !eventId && !userId) {
      await RegistrationModel.insertMany(INITIAL_REGISTRATIONS);
      registrations = await RegistrationModel.find({}).sort({ createdAt: -1 });
    }

    return NextResponse.json(registrations);
  } catch (err: unknown) {
    console.warn("MongoDB fetch registrations fallback:", err);
    return NextResponse.json(INITIAL_REGISTRATIONS);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Check duplicate active registration in database
    const existing = await RegistrationModel.findOne({
      eventId: body.eventId,
      userId: body.userId,
      status: { $ne: "Cancelled" }
    });

    if (existing) {
      return NextResponse.json(
        { error: "You are already registered for this event." },
        { status: 400 }
      );
    }

    const newReg = await RegistrationModel.create({
      ...body,
      id: body.id || "reg-" + Date.now().toString()
    });

    return NextResponse.json(newReg, { status: 201 });
  } catch (err: unknown) {
    console.error("Error creating registration:", err);
    return NextResponse.json({ error: "Failed to create registration" }, { status: 500 });
  }
}
