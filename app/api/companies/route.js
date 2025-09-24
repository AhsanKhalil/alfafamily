// app/api/companies/route.js
export const runtime = "nodejs"; // Force Node runtime

import dbConnect from "@/lib/mongodb";
import Company from "@/models/Company";
import { authMiddleware } from "@/lib/auth";

export async function GET(req) {
  await dbConnect();

  const user = await authMiddleware(req);
  if (!user) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });

  const companies = await Company.find();
  return new Response(JSON.stringify(companies), { status: 200 });
}

export async function POST(req) {
  await dbConnect();

  const user = await authMiddleware(req);
  if (!user) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });

  const body = await req.json();

  // Always assign companyId from token to prevent spoofing
  const company = new Company({
    ...body,
    _id: user.companyid || undefined,
  });

  await company.save();
  return new Response(JSON.stringify(company), { status: 201 });
}
