export const runtime = 'nodejs'

import dbConnect from "@/lib/mongodb";
import ApiUser from "@/models/ApiUser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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


  console.log("userId:", user._id);
console.log("username:", user.username);
console.log("process.env.JWT_SECRET:", process.env.JWT_SECRET);


  const token = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );

  return new Response(JSON.stringify({ token }), { status: 200 });
}
