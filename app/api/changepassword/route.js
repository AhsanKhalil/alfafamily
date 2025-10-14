import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { logUserActivity } from "@/lib/logActivity";


export async function POST(req) {
  try {
    const { userId, oldPassword, newPassword } = await req.json();

    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Old password is incorrect" }, { status: 400 });
    }

    // ✅ Let model hash automatically (avoid double hashing)
    user.password = newPassword;
    await user.save();

        await logUserActivity({
      userId,
      eventPerformed: "Change Password",
      activityDetail: "User successfully changed password",
      ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("remote-addr"),
      deviceInfo: req.headers.get("user-agent"),
    });



    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
