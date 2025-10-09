import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import UserInformation from "@/models/UserInformation";


export async function GET(req, { params }) {
  try {
    await dbConnect();
    /* const user = await authMiddleware(req);
      if (!user) {
        return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
      }
 */    const { id } = params;

    const userInfo = await UserInformation.findOne({ userId: id });

    if (!userInfo) {
      return NextResponse.json({ message: "User info not found" }, { status: 404 });
    }

    return NextResponse.json(userInfo, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}


export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const user = await authMiddleware(req);
      if (!user) {
        return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
      }
    const body = await req.json();
    const updated = await UserInformation.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const user = await authMiddleware(req);
      if (!user) {
        return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
      }
    const deleted = await UserInformation.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
