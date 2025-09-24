export const runtime = "nodejs";

import dbConnect from "@/lib/mongodb";
import ApiUser from "@/models/ApiUser";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(req) {
  const { username, password } = await req.json();
  await dbConnect();

  const user = await ApiUser.findOne({ username });
  if (!user || !user.isActive) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
  }

  // Generate JWT using jose
  const token = await new SignJWT({
    userId: user._id.toString(),
    companyid: user.companyid || null,
    username: user.username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  return new Response(JSON.stringify({ token }), { status: 200 });
}
