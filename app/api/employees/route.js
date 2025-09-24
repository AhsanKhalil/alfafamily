import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Employee from "@/models/Employee";
import Company from "@/models/Company";


/* export async function GET() {
  try {
    await dbConnect();
    const items = await Employee.find({}).populate("CompanyId");
    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
 */
export async function GET() {
  await dbConnect();
  try {
    // 👇 Populate company name instead of only ObjectId
    const employees = await Employee.find().populate("companyId", "name");

    return new Response(JSON.stringify(employees), { status: 200 });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch employees" }),
      { status: 500 }
    );
  }
}
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const created = await Employee.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
