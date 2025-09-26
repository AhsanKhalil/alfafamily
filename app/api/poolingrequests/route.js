import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import PoolingRequest from "@/models/PoolingRequest";

export async function GET() {
  try {
    await dbConnect();
    const items = await PoolingRequest.find({}).populate("UserId DriverId VehicleId");
    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    // ensure availableSeats default
    if (!body.availableSeats && body.totalSeats) body.availableSeats = body.totalSeats;
    const created = await PoolingRequest.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
