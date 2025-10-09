import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();

    if (!body.roleId) throw new Error("roleId is required");
    if (!body.userId) throw new Error("userId is required");

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Save User
    const user = await User.create({
      employeeId: body.employeeId,
      roleId: body.roleId,
      userId: body.userId,
      userName: body.userName,
      password: body.password,
      cnic: body.employeeData?.cnic || "",
      createdOn: new Date(),
    });

    return new Response(
      JSON.stringify({ message: "Rider registered successfully!", user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Register Rider Error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
