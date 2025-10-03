import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PoolingRequestMember from "@/models/PoolingRequestMember";
import PoolingRequest from "@/models/PoolingRequests";
import { authMiddleware } from "@/lib/auth";

// GET all members for pooling requests
export async function GET(req) {
  try {
    await dbConnect();

    const user = await authMiddlewa
    re(req);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const poolingRequestId = searchParams.get("poolingRequestId");
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    const query = {};
    if (poolingRequestId) query.poolingRequestId = poolingRequestId;
    if (userId) query.userId = userId;
    if (status) query.status = status;

    const members = await PoolingRequestMember.find(query)
      .populate("userId", "firstName lastName email phoneNumber profileImage")
      .populate({
        path: "poolingRequestId",
        select: "fromLocation toLocation departureTime totalSeats availableSeats",
        populate: {
          path: "userId",
          select: "firstName lastName"
        }
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST - Join a pooling request
export async function POST(req) {
  try {
    await dbConnect();

    const user = await authMiddleware(req);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { poolingRequestId, seatsBooked } = body;

    // Validate required fields
    if (!poolingRequestId || !seatsBooked) {
      return NextResponse.json(
        { error: "Pooling request ID and seats booked are required" },
        { status: 400 }
      );
    }

    // Check if pooling request exists
    const poolingRequest = await PoolingRequest.findById(poolingRequestId);
    if (!poolingRequest) {
      return NextResponse.json(
        { error: "Pooling request not found" },
        { status: 404 }
      );
    }

    // Check if request is active
    if (poolingRequest.status !== "active") {
      return NextResponse.json(
        { error: "This pooling request is not active" },
        { status: 400 }
      );
    }

    // Can't join your own request
    if (poolingRequest.userId.toString() === user.userId) {
      return NextResponse.json(
        { error: "Cannot join your own pooling request" },
        { status: 400 }
      );
    }

    // Check available seats
    if (poolingRequest.availableSeats < seatsBooked) {
      return NextResponse.json(
        { error: `Only ${poolingRequest.availableSeats} seats available` },
        { status: 400 }
      );
    }

    // Check for existing membership
    const existingMember = await PoolingRequestMember.findOne({
      poolingRequestId,
      userId: user.userId
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "You have already requested to join this ride" },
        { status: 400 }
      );
    }

    // Create member entry
    body.userId = user.userId;
    body.status = "pending";
    
    const member = await PoolingRequestMember.create(body);

    const populatedMember = await PoolingRequestMember.findById(member._id)
      .populate("userId", "firstName lastName email phoneNumber")
      .populate("poolingRequestId", "fromLocation toLocation departureTime");

    return NextResponse.json({
      success: true,
      message: "Request to join sent successfully",
      data: populatedMember
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}






// export async function GET() {
//   try {
//     await dbConnect();


//     const user = await authMiddleware(req);
//       if (!user) {
//         return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
//       }

//     const items = await PoolingRequestMember.find({}).populate("RequestId UserId");
//     return NextResponse.json(items);
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const user = await authMiddleware(req);
//       if (!user) {
//         return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
//       }

//     const body = await req.json();
//     const created = await PoolingRequestMember.create(body);
//     return NextResponse.json(created, { status: 201 });
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 400 });
//   }
// }
