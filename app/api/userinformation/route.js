import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import UserInformation from "@/models/UserInformation";
import fs from "fs";
import path from "path";


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

/* export async function POST(req) {
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
 */

export async function POST(req) {
  try {
    await dbConnect();
     const user = await authMiddleware(req);
      if (!user) {
        return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
      }
    const body = await req.json();

    const { userId, whatsAppNo1, mobileNo1, address1, email, imagePath } = body;

    if (!imagePath || !fs.existsSync(imagePath)) {
      return NextResponse.json({ error: "Invalid or missing image path" }, { status: 400 });
    }

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // Generate unique filename
    const fileName = `${Date.now()}-${path.basename(imagePath)}`;
    const destPath = path.join(uploadDir, fileName);

    // Copy image to uploads folder
    fs.copyFileSync(imagePath, destPath);

    const dbPath = `/uploads/${fileName}`;

    // Save in MongoDB
    await UserInformation.create({
      userId,
      whatsAppNo1,
      mobileNo1,
      address1,
      email,
      profilePic: dbPath,
    });

    return NextResponse.json({ message: "User info saved successfully" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
