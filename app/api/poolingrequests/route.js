
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

    const user = await authMiddleware(req);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

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

    const user = await authMiddleware(req);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();

    // Validation
    if (!body.fromLocation || !body.toLocation) {
      return NextResponse.json(
        { error: "From and To locations are required" },
        { status: 400 }
      );
    }

    // Set defaults
    if (!body.availableSeats && body.totalSeats) {
      body.availableSeats = body.totalSeats;
    }
    
    body.userId = req.userId;
    body.status = body.status || "active";


    const vehicle = await Vehicle.findOne({ userId: req.userId});
    
    if (!vehicle) {
      return NextResponse.json({ error: "No vehicle found for this user" }, { status: 404 });
    }

    const poolingRequest = await PoolingRequest.create({
      ...body,
      userId : user.userId,
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





// export async function GET(req) {
//   try {
//     await dbConnect();

//     console.log("Fetching pooling requests...");

//     const user = await authMiddleware(req);
//     if (!user) {
//       return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
//     }

//     // ✅ Parse query parameters
//     const { searchParams } = new URL(req.url);
//     const status = searchParams.get("status");
//     const userId = searchParams.get("userId");
//     const vehicleId = searchParams.get("vehicleId");

//     // ✅ Build filter dynamically
//     const filter = {};
//     if (status) filter.status = status;
//     if (userId) filter.userId = userId;
//     if (vehicleId) filter.vehicleId = vehicleId;

//     const startOfToday = new Date();
//     startOfToday.setHours(0, 0, 0, 0);

// const endOfToday = new Date();
// endOfToday.setHours(23, 59, 59, 999);

// // Query today's requests
// const items_ = await PoolingRequests.find({
//   requestTime: { $gte: startOfToday, $lte: endOfToday }
// })
//   .populate("userId", "firstName lastName email");
//   //.populate("vehicleId", "plateNumber model");

//     //const items = await PoolingRequests.find(filter)
//       //.populate("userId", "firstName lastName email")
//       //.populate("vehicleId", "plateNumber model");

//     console.log("Fetched pooling requests:", items_.length);

//     return NextResponse.json(items_, { status: 200 });
//   } catch (err) {
//     console.error("GET error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   try {
//     await dbConnect();

//     const user = await authMiddleware(req);
//     if (!user) {
//       return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
//     }

//     const body = await req.json();

//     // ✅ Ensure availableSeats defaults to totalSeats if not provided
//     if (!body.availableSeats && body.totalSeats) {
//       body.availableSeats = body.totalSeats;
//     }

//     const created = await PoolingRequests.create(body);
//     return NextResponse.json(created, { status: 201 });
//   } catch (err) {
//     console.error("POST error:", err);
//     return NextResponse.json({ error: err.message }, { status: 400 });
//   }
// }
