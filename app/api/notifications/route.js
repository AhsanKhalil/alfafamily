// âœ… app/api/notification/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 });
  }

  await dbConnect();

  try {
    const unreadCount = await Notification.countDocuments({ userId, Unread: true });

    const notifications = await Notification.find({ userId })
      .sort({ CreatedOn: -1 })
      .limit(6)
      .lean();

    return NextResponse.json({ success: true, notifications, unreadCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 });
  }

  await dbConnect();

  try {
    await Notification.updateMany({ userId, Unread: true }, { $set: { Unread: false } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}