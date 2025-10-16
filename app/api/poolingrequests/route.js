import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PoolingRequest from "@/models/PoolingRequest";
import Vehicle from "@/models/Vehicle";

/* 🟢 GET - Fetch all requests */
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    const query = {};

    // Optional date filter (default = today)
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.poolTime = { $gte: start, $lte: end };
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      query.poolTime = { $gte: today, $lt: tomorrow };
    }

    const poolingRequests = await PoolingRequest.find(query)
      .populate("userId", "firstName lastName email phoneNumber profileImage")
      .populate("vehicleId", "plateNumber model make color")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: poolingRequests.length,
      data: poolingRequests,
    });
  } catch (err) {
    console.error("Error fetching pooling requests:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* 🟠 POST - Create new pooling request */
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { userId, pickupLocation, dropoffLocation, totalSeats, Cost } = body;

    if (!pickupLocation || !dropoffLocation)
      return NextResponse.json({ error: "Pickup and dropoff required" }, { status: 400 });

    if (!userId)
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });

    // Find user's vehicle
    const vehicle = await Vehicle.findOne({ owner: userId });
    if (!vehicle)
      return NextResponse.json({ error: "No vehicle found for this user" }, { status: 404 });

    // ✅ Create new request (default cost = 1000)
    const poolingRequest = await PoolingRequest.create({
      ...body,
      vehicleId: vehicle._id,
      status: body.status || "active",
      Cost: Cost || 1000,
    });

    const populated = await PoolingRequest.findById(poolingRequest._id)
      .populate("userId", "firstName lastName email phoneNumber")
      .populate("vehicleId", "plateNumber model make color");

    return NextResponse.json(
      {
        success: true,
        message: "Pooling request created successfully",
        data: populated,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating pooling request:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

/* 🟣 GET_STATS - Summary endpoint */
export async function GET_STATS() {
  try {
    await dbConnect();

    const total = await PoolingRequest.countDocuments();
    const active = await PoolingRequest.countDocuments({ status: "active" });
    const completed = await PoolingRequest.countDocuments({ status: "pending" });
    const cancelled = await PoolingRequest.countDocuments({ status: "cancelled" });

    return NextResponse.json({
      success: true,
      stats: {
        total,
        active,
        completed,
        cancelled,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
