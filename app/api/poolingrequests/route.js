import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PoolingRequest from "@/models/PoolingRequest";
import { authMiddleware } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await dbConnect();


    const user = await authMiddleware(req);
      if (!user) {
        return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
      }
      console.log("Fetching all pooling requests"+ PoolingRequest);
      const items = await PoolingRequest.find()
  .populate("userId", "firstName lastName email")
  .populate("vehicleId", "plateNumber model");

    
    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const user = await authMiddleware(req);
      if (!user) {
        return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
      }

    const body = await req.json();
    // ensure availableSeats default
    if (!body.availableSeats && body.totalSeats) body.availableSeats = body.totalSeats;
    const created = await PoolingRequest.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
