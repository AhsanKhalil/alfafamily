import dbConnect from "@/lib/mongodb";
import PoolingRequest from "@/models/PoolingRequest";
import PoolingRequestMember from "@/models/PoolingRequestMember";
import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  try {
    await dbConnect();

    // ✅ Await params for dynamic route
    const { id } = await context.params;
    const body = await req.json();
    const { status, riderId } = body;

    if (!riderId) {
      return NextResponse.json({ message: "riderId is required" }, { status: 400 });
    }

    const poolingRequest = await PoolingRequest.findById(id);
    if (!poolingRequest) {
      return NextResponse.json({ message: "Pooling request not found" }, { status: 404 });
    }

    // Check if rider already exists
    let member = await PoolingRequestMember.findOne({
      poolingRequestId: id,
      userId: riderId,
    });

    // ✅ Accept ride
    if (status === "accepted") {
      if (poolingRequest.availableSeats <= 0) {
        return NextResponse.json({ message: "No seats available" }, { status: 400 });
      }

      if (member) {
        return NextResponse.json({ message: "Already accepted this request" }, { status: 200 });
      }

      // Create new PoolingRequestMember entry
      member = await PoolingRequestMember.create({
        poolingRequestId: id,
        userId: riderId,
        seatsBooked: 1,
        status: "accepted",
        isaccepted: true,
      });

      poolingRequest.availableSeats -= 1;
      if (poolingRequest.availableSeats === 0) poolingRequest.status = "full";
      await poolingRequest.save();

      return NextResponse.json({
        message: "Ride accepted successfully",
        member,
        poolingRequest,
      });
    }

    // ✅ Cancel ride
    if (status === "cancelled") {
      if (!member) {
        return NextResponse.json({ message: "No active booking found" }, { status: 404 });
      }

      member.status = "cancelled";
      member.isaccepted = false;
      await member.save();

      poolingRequest.availableSeats += 1;
      if (poolingRequest.status === "full") poolingRequest.status = "active";
      await poolingRequest.save();

      return NextResponse.json({
        message: "Ride cancelled successfully",
        member,
        poolingRequest,
      });
    }

    return NextResponse.json({ message: "Invalid status action" }, { status: 400 });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
