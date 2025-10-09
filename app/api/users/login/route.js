import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await dbConnect();

  try {
    const { userId, password } = await req.json();

    if (!userId || !password) {
      return new Response(JSON.stringify({ error: "User ID and password required" }), { status: 400 });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid User ID or password" }), { status: 401 });
    }
console.log(password);
console.log(user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: "Invalid User ID or password" }), { status: 401 });
    }

    return new Response(JSON.stringify({ message: "Login successful", user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Login error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
