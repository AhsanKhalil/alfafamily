import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Permission from "@/models/Permission";

export async function GET() {
  try {
    await dbConnect();
    const items = await Permission.find({});
    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const created = await Permission.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
