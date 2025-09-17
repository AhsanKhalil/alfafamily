import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const { username, password, email, roleId } = await req.json();

  const existingUser = await User.findOne({ Username: username });
  if (existingUser) {
    return NextResponse.json({ error: "Username already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    Username: username,
    Password: hashedPassword,
    Email: email,
    RoleId: roleId,
    IsActive: true,
    CreatedOn: new Date(),
  });

  return NextResponse.json(user);
}
