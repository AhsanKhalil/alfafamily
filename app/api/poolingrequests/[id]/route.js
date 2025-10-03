import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PoolingRequest from "@/models/PoolingRequests";
import { authMiddleware } from "@/lib/auth";

// GET single pooling request by ID
export async function GET(req, { params }) {
  try {
    await dbConnect();

    const user = await authMiddleware(req);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = params;
    const poolingRequest = await PoolingRequest.findById(id)
      .populate("userId", "firstName lastName email phoneNumber profileImage")
      .populate("vehicleId", "plateNumber model make color year");

    if (!poolingRequest) {
      return NextResponse.json(
        { error: "Pooling request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: poolingRequest
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT - Update pooling request
export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const user = await authMiddleware(req);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const poolingRequest = await PoolingRequest.findById(id);
    if (!poolingRequest) {
      return NextResponse.json(
        { error: "Pooling request not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (poolingRequest.userId.toString() !== user.userId) {
      return NextResponse.json(
        { error: "Unauthorized to update this request" },
        { status: 403 }
      );
    }

    const updated = await PoolingRequest.findByIdAndUpdate(
      id,
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )
      .populate("userId", "firstName lastName email")
      .populate("vehicleId", "plateNumber model");

    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// DELETE pooling request
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const user = await authMiddleware(req);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = params;
    const poolingRequest = await PoolingRequest.findById(id);

    if (!poolingRequest) {
      return NextResponse.json(
        { error: "Pooling request not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (poolingRequest.userId.toString() !== user.userId) {
      return NextResponse.json(
        { error: "Unauthorized to delete this request" },
        { status: 403 }
      );
    }

    await PoolingRequest.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Pooling request deleted successfully"
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



// export async function GET(req, { params }) {
//   try {
//     await dbConnect();


//     const user = await authMiddleware(req);
//       if (!user) {
//         return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
//       }

//     const item = await PoolingRequest.findById(params.id).populate("UserId DriverId VehicleId");
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
//     const updated = await PoolingRequest.findByIdAndUpdate(params.id, body, { new: true });
//     if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
//     return NextResponse.json(updated);
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 400 });
//   }
// }

// export async function DELETE(req, { params }) {
//   try {
//     await dbConnect();
//     const deleted = await PoolingRequest.findByIdAndDelete(params.id);
//     if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
//     return NextResponse.json({ message: "Deleted" });
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
