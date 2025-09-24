export const runtime = "nodejs";

import dbConnect from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";
import Company from "@/models/Company";
import { authMiddleware } from "@/lib/auth";

export async function GET(req) {
  await dbConnect();

  const user = await authMiddleware(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }

  try {
    // Fetch all vehicles for the user's company
    const vehicles = await Vehicle.find({ companyid: user.companyid }).populate("companyid", "name");

    return new Response(JSON.stringify(vehicles), { status: 200 });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch vehicles" }), { status: 500 });
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

    console.log('Company: '+user.companyid);
    // Always enforce the companyid from the token
    const created = await Vehicle.create({
      ...body,
      companyid: user.companyid,
    });

    return new Response(JSON.stringify(created), { status: 201 });
  } catch (err) {
    console.error("Error creating vehicle:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
