
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PoolingRequest from "@/models/PoolingRequest";
import { authMiddleware } from "@/lib/auth";
import Employee from "@/models/Employee";
import Vehicle from "@/models/Vehicle";

// GET all pooling requests with filters
export async function GET(req) {
  try {
    await dbConnect();

    // const user = await authMiddleware(req);
    // if (!user) {
    //   return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    // }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");
    const fromLocation = searchParams.get("from");
    const toLocation = searchParams.get("to");
    const date = searchParams.get("date");

    // Build query filters
    const query = {};
    if (status) query.status = status;
    if (userId) query.userId = userId;
    if (fromLocation) query.fromLocation = { $regex: fromLocation, $options: "i" };
    if (toLocation) query.toLocation = { $regex: toLocation, $options: "i" };
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.departureTime = { $gte: startDate, $lt: endDate };
    }

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

    // const user = await authMiddleware(req);
    // if (!user) {
    //   return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    // }

    const body = await req.json();

    // Validation
    if (!body.pickupLocation || !body.dropoffLocation) {
      return NextResponse.json(
        { error: "From and To locations are required" },
        { status: 400 }
      );
    }

    // Set defaults
    if (!body.availableSeats && body.totalSeats) {
      body.availableSeats = body.totalSeats;
    }

    

        const userId =  body.userId; //"68e8054a1dada86a5dbb1226";//typeof window !== "undefined" ? localStorage.getItem("userId") : null;


console.log("userId from localStorage:", userId);
        req.userId=userId;
    
    body.userId = req.userId;
    body.status = body.status || "active";


    const vehicle = await Vehicle.findOne({ owner: req.userId});
    
    if (!vehicle) {
      return NextResponse.json({ error: "No vehicle found for this user" }, { status: 404 });
    }

    const poolingRequest = await PoolingRequest.create({
      ...body,
      userId : userId,
      vehicleId: vehicle._id
    });
    
    const populatedRequest = await PoolingRequest.findById(poolingRequest._id)
      .populate("userId", "firstName lastName email");
      //.populate("vehicleId", "plateNumber model");

    return NextResponse.json({
      success: true,
      data: populatedRequest
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}


