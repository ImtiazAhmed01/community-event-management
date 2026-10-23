import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { EventModel } from "@/models";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const event = await EventModel.findOne({ id });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (err: unknown) {
    console.error("Error fetching event:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const updateData = await req.json();
    const updated = await EventModel.findOneAndUpdate({ id }, updateData, { new: true });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error("Error updating event:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    await EventModel.findOneAndDelete({ id });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Error deleting event:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
