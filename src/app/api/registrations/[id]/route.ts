import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { RegistrationModel } from "@/models";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const updateData = await req.json();

    const updated = await RegistrationModel.findOneAndUpdate(
      { id },
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error("Error updating registration status:", err);
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
    await RegistrationModel.findOneAndDelete({ id });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Error deleting registration:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
