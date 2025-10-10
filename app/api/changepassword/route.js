import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { userId, oldPassword, newPassword } = await req.json();

    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Old password is incorrect" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
