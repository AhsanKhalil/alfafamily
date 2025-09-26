export const runtime = "nodejs";

import dbConnect from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";
import Company from "@/models/Company";
import { authMiddleware } from "@/lib/auth";

export async function GET(req, { params }) {
  await dbConnect();

  const user = await authMiddleware(req);
  if (!user) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });

  const { id } = params;

  try {
    const vehicle = await Vehicle.findById(id).populate("companyid", "name");
    if (!vehicle) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });

    // Check if vehicle belongs to user's company
    if (vehicle.companyid._id.toString() !== user.companyid) {
      return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });
    }

    return new Response(JSON.stringify(vehicle), { status: 200 });
  } catch (err) {
    console.error("Error fetching vehicle:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  await dbConnect();

  const user = await authMiddleware(req);
  if (!user) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });

  const { id } = params;

  try {
    const body = await req.json();

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    if (vehicle.companyid.toString() !== user.companyid) {
      return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });
    }

    const updated = await Vehicle.findByIdAndUpdate(id, body, { new: true });
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    console.error("Error updating vehicle:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();

  const user = await authMiddleware(req);
  if (!user) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });

  const { id } = params;

  try {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    if (vehicle.companyid.toString() !== user.companyid) {
      return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });
    }

    await Vehicle.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: "Deleted successfully" }), { status: 200 });
  } catch (err) {
    console.error("Error deleting vehicle:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
