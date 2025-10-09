import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PoolingRequestMember from "@/models/PoolingRequestMember";
import PoolingRequest from "@/models/PoolingRequest";
import { authMiddleware } from "@/lib/auth";

// GET single member
export async function GET(req, { params }) {
  try {
    await dbConnect();

    const user = await authMiddleware(req);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = params;
    const member = await PoolingRequestMember.findById(id)
      .populate("userId", "firstName lastName email phoneNumber profileImage")
      .populate({
        path: "poolingRequestId",
        populate: {
          path: "userId vehicleId"
        }
      });

    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: member
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT - Update member (status, rating, etc.)
export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const user = await authMiddleware(req);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const member = await PoolingRequestMember.findById(id);
    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    // Get pooling request to check ownership
    const poolingRequest = await PoolingRequest.findById(member.poolingRequestId);

    // Only ride owner can accept/reject, member can cancel
    if (body.status === "accepted" || body.status === "rejected") {
      if (poolingRequest.userId.toString() !== user.userId) {
        return NextResponse.json(
          { error: "Only ride owner can accept/reject members" },
          { status: 403 }
        );
      }

      // If accepting, update available seats
      if (body.status === "accepted") {
        const newAvailableSeats = poolingRequest.availableSeats - member.seatsBooked;
        if (newAvailableSeats < 0) {
          return NextResponse.json(
            { error: "Not enough seats available" },
            { status: 400 }
          );
        }
        poolingRequest.availableSeats = newAvailableSeats;
        await poolingRequest.save();
      }
    } else if (body.status === "cancelled") {
      // Member can cancel their own request
      if (member.userId.toString() !== user.userId) {
        return NextResponse.json(
          { error: "Can only cancel your own booking" },
          { status: 403 }
        );
      }

      // If was accepted, restore seats
      if (member.status === "accepted") {
        poolingRequest.availableSeats += member.seatsBooked;
        await poolingRequest.save();
      }
    }

    // Update rating/review (only the member can do this)
    if (body.rating || body.review) {
      if (member.userId.toString() !== user.userId) {
        return NextResponse.json(
          { error: "Can only rate your own experience" },
          { status: 403 }
        );
      }
    }

    const updated = await PoolingRequestMember.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )
      .populate("userId", "firstName lastName email")
      .populate("poolingRequestId", "fromLocation toLocation");

    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// DELETE member
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const user = await authMiddleware(req);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = params;
    const member = await PoolingRequestMember.findById(id);

    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    // Only member or ride owner can delete
    const poolingRequest = await PoolingRequest.findById(member.poolingRequestId);
    const isOwner = poolingRequest.userId.toString() === user.userId;
    const isMember = member.userId.toString() === user.userId;

    if (!isOwner && !isMember) {
      return NextResponse.json(
        { error: "Unauthorized to delete this member" },
        { status: 403 }
      );
    }

    // If member was accepted, restore seats
    if (member.status === "accepted") {
      poolingRequest.availableSeats += member.seatsBooked;
      await poolingRequest.save();
    }

    await PoolingRequestMember.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Member removed successfully"
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



// export async function GET(req, { params }) {
//   try {
//     await dbConnect();
//     const item = await PoolingRequestMember.findById(params.id).populate("RequestId UserId");
//     if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
//     return NextResponse.json(item);
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function PUT(req, { params }) {
//   try {
//     await dbConnect();
//     const body = await req.json();
//     const updated = await PoolingRequestMember.findByIdAndUpdate(params.id, body, { new: true });
//     if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
//     return NextResponse.json(updated);
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 400 });
//   }
// }

// export async function DELETE(req, { params }) {
//   try {
//     await dbConnect();
//     const deleted = await PoolingRequestMember.findByIdAndDelete(params.id);
//     if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
//     return NextResponse.json({ message: "Deleted" });
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
