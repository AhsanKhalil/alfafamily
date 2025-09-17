import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import UserInformation from "@/models/UserInformation";

export async function GET() {
  try {
    await dbConnect();
    const items = await UserInformation.find({}).populate("UserId");
    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const created = await UserInformation.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
