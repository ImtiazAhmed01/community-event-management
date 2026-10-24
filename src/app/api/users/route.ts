import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { UserModel } from "@/models";
import { DEMO_USERS } from "@/lib/seedData";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const id = searchParams.get("id");

    await connectDB();

    if (email) {
      const user = await UserModel.findOne({ email });
      if (user) return NextResponse.json(user);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (id) {
      const user = await UserModel.findOne({ id });
      if (user) return NextResponse.json(user);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const allUsers = await UserModel.find({});
    return NextResponse.json(allUsers);
  } catch (err: unknown) {
    console.warn("MongoDB fetch users fallback:", err);
    return NextResponse.json(DEMO_USERS);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const existing = await UserModel.findOne({ email: data.email });
    if (existing) {
      // Update existing
      const updated = await UserModel.findOneAndUpdate(
        { email: data.email },
        { $set: data },
        { new: true }
      );
      return NextResponse.json(updated);
    }

    const newUser = await UserModel.create({
      ...data,
      id: data.id || "usr-" + Date.now().toString()
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (err: unknown) {
    console.error("MongoDB create user error:", err);
    return NextResponse.json({ error: "Failed to create or update user in database" }, { status: 500 });
  }
}
