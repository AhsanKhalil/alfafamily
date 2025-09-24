export const runtime = "nodejs";

import dbConnect from "@/lib/mongodb";
import Employee from "@/models/Employee";
import Company from "@/models/Company";
import { authMiddleware } from "@/lib/auth";

export async function GET(req, { params }) {
  await dbConnect();

  const user = await authMiddleware(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }

  const { id } = params;

  try {
    const employee = await Employee.findById(id).populate("companyId", "name");
    if (!employee) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });

    // Check if employee belongs to user's company
    if (employee.companyId._id.toString() !== user.companyid) {
      return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });
    }

    return new Response(JSON.stringify(employee), { status: 200 });
  } catch (err) {
    console.error("Error fetching employee:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  await dbConnect();

  const user = await authMiddleware(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }

  const { id } = params;

  try {
    const body = await req.json();

    // Ensure employee belongs to user's company
    const employee = await Employee.findById(id);
    if (!employee) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    if (employee.companyId.toString() !== user.companyid) {
      return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });
    }

    // Update employee
    const updated = await Employee.findByIdAndUpdate(id, body, { new: true });
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (err) {
    console.error("Error updating employee:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();

  const user = await authMiddleware(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }

  const { id } = params;

  try {
    const employee = await Employee.findById(id);
    if (!employee) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    if (employee.companyId.toString() !== user.companyid) {
      return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });
    }

    await Employee.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: "Deleted successfully" }), { status: 200 });
  } catch (err) {
    console.error("Error deleting employee:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
