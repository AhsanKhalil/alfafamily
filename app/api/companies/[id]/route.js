// app/api/companies/[id]/route.js
export const runtime = "nodejs";

import dbConnect from "@/lib/mongodb";
import Company from "@/models/Company";
import { authMiddleware } from "@/lib/auth";

export async function GET(req, { params }) {
  await dbConnect();
  const user = await authMiddleware(req);
  if (!user) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });

  const { id } = params;

  // Ensure the user can only access their company
  if (user.companyid && id !== user.companyid) {
    return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });
  }

  const company = await Company.findById(id);
  if (!company) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });

  return new Response(JSON.stringify(company), { status: 200 });
}

export async function PATCH(req, { params }) {
  await dbConnect();
  const user = await authMiddleware(req);
  if (!user) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });

  const { id } = params;

  if (user.companyid && id !== user.companyid) {
    return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });
  }

  const body = await req.json();
  const updated = await Company.findByIdAndUpdate(id, body, { new: true });
  return new Response(JSON.stringify(updated), { status: 200 });
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const user = await authMiddleware(req);
  if (!user) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });

  const { id } = params;

  if (user.companyid && id !== user.companyid) {
    return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });
  }

  await Company.findByIdAndDelete(id);
  return new Response(JSON.stringify({ message: "Deleted" }), { status: 200 });
}
