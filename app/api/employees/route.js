export const runtime = "nodejs";

import dbConnect from "@/lib/mongodb";
import Employee from "@/models/Employee";
import Company from "@/models/Company";
import { authMiddleware } from "@/lib/auth";

export async function GET(req) {
  await dbConnect();

  // const user = await authMiddleware(req);
  // if (!user) {
  //   return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  // }

  try {
    // Fetch all employees for the user's company
    //const employees = await Employee.find({ companyId: user.companyid }).populate("companyId", "name");
        const employees = await Employee.find();

    return new Response(JSON.stringify(employees), { status: 200 });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch employees" }), { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  const user = await authMiddleware(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }

  try {
    const body = await req.json();

    // Always enforce the companyId from the token
    const created = await Employee.create({
      ...body,
      companyId: user.companyid,
    });

    return new Response(JSON.stringify(created), { status: 201 });
  } catch (err) {
    console.error("Error creating employee:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
