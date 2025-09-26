import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import UserInformation from "@/models/UserInformation";

export async function GET() {
  try {
    await dbConnect();
    const user = await authMiddleware(req);
      if (!user) {
        return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
      }
    const items = await UserInformation.find({}).populate("UserId");
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
    const created = await UserInformation.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
