import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

/* export async function POST(req) {
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
} */


  export async function POST(req) {
    try {
      await dbConnect();
  
      const body = await req.json();
  
      // Validate required fields
      if (!body.userName && !body.username && !body.userId) {
        return NextResponse.json({ error: "username/userName/userId is required" }, { status: 400 });
      }
      if (!body.password) {
        return NextResponse.json({ error: "password is required" }, { status: 400 });
      }
  
      // Convert isActive if coming as "1"/"0"
      if (typeof body.isActive === "string") {
        body.isActive = body.isActive === "1" || body.isActive.toLowerCase() === "true";
      }
  
      // Hash the password
      const saltRounds = 10;
      const hashed = await bcrypt.hash(body.password, saltRounds);
      body.password = hashed; // replace plain with hashed
  
      // Create user
      const created = await User.create(body);
  
      return NextResponse.json(
        { message: "User created successfully" },
        { status: 201 }
      );
    } catch (err) {
      // handle duplicate key error (unique indexes)
      if (err.code === 11000) {
        // find which field caused duplicate
        const duplicateKey = Object.keys(err.keyValue || {}).join(", ");
        return NextResponse.json({ error: `Duplicate value for: ${duplicateKey}` }, { status: 400 });
      }
  
      console.error("User create error:", err);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  }
  