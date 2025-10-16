import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PoolingRequest from "@/models/PoolingRequest";
import { authMiddleware } from "@/lib/auth";
import Vehicle from "@/models/Vehicle";

// GET all pooling requests with filters (show only today's if no date filter)
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");
    const fromLocation = searchParams.get("from");
    const toLocation = searchParams.get("to");
    const date = searchParams.get("date");

    const query = {};

    if (status) query.status = status;
    if (userId) query.userId = userId;
    if (fromLocation)
      query.fromLocation = { $regex: fromLocation, $options: "i" };
    if (toLocation) query.toLocation = { $regex: toLocation, $options: "i" };

    // 🗓️ Filter by date — if "date" is provided, use that; otherwise, only today's requests
    let startDate, endDate;
    if (date) {
      startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Default to current date
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    }

query.poolTime = { $gte: startDate, $lte: endDate };

    const poolingRequests = await PoolingRequest.find(query)
      .populate("userId", "firstName lastName email phoneNumber profileImage")
      .populate("vehicleId", "plateNumber model make color")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: poolingRequests.length,
      data: poolingRequests
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST - Create new pooling request
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { userId, pickupLocation, dropoffLocation, totalSeats } = body;

    // Validation
    if (!pickupLocation || !dropoffLocation) {
      return NextResponse.json(
        { error: "Pickup and dropoff locations are required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Set default available seats
    if (!body.availableSeats && totalSeats) {
      body.availableSeats = totalSeats;
    }

    // Find vehicle for user
    const vehicle = await Vehicle.findOne({ owner: userId });
    if (!vehicle) {
      return NextResponse.json(
        { error: "No vehicle found for this user" },
        { status: 404 }
      );
    }

    // Create pooling request
    const poolingRequest = await PoolingRequest.create({
      ...body,
      userId,
      vehicleId: vehicle._id,
      status: body.status || "active"
    });

    const populatedRequest = await PoolingRequest.findById(poolingRequest._id)
      .populate("userId", "firstName lastName email phoneNumber")
      .populate("vehicleId", "plateNumber model make color");

    return NextResponse.json(
      {
        success: true,
        message: "Pooling request created successfully",
        data: populatedRequest
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
