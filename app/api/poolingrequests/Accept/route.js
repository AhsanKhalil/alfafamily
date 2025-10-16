import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PoolingRequest from "@/models/PoolingRequest";
import PoolingRequestMember from "@/models/PoolingRequestMember";
import { authMiddleware } from "@/lib/auth";

export async function PATCH(req) {
  try {
    await dbConnect();

    const user = await authMiddleware(req);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { poolingRequestId, riderId } = body;

    if (!poolingRequestId || !riderId) {
      return NextResponse.json(
        { error: "poolingRequestId and riderId are required" },
        { status: 400 }
      );
    }

    // ✅ 1. Find pooling request
    const poolingRequest = await PoolingRequest.findById(poolingRequestId);
    if (!poolingRequest) {
      return NextResponse.json(
        { error: "Pooling request not found" },
        { status: 404 }
      );
    }

    // ✅ 2. Find rider membership
    const member = await PoolingRequestMember.findOne({
      poolingRequestId,
      userId: riderId
    });

    if (!member) {
      return NextResponse.json(
        { error: "Rider request not found" },
        { status: 404 }
      );
    }

    if (member.status === "accepted") {
      return NextResponse.json(
        { error: "This request is already accepted" },
        { status: 400 }
      );
    }

    // ✅ 3. Update statuses
    member.status = "accepted";
    await member.save();

    // Decrement available seats for driver
    poolingRequest.availableSeats =
      poolingRequest.availableSeats - member.seatsBooked;

    if (poolingRequest.availableSeats <= 0) {
      poolingRequest.availableSeats = 0;
      poolingRequest.status = "filled";
    }

    await poolingRequest.save();

    const updatedMember = await PoolingRequestMember.findById(member._id)
      .populate("userId", "firstName lastName email phoneNumber")
      .populate("poolingRequestId", "pickupLocation dropoffLocation poolTime");

    return NextResponse.json({
      success: true,
      message: "Ride accepted successfully",
      data: {
        member: updatedMember,
        poolingRequest
      }
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
