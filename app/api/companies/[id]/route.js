import dbConnect from "@/utils/dbConnect";
import Company from "@/models/Company";
import { authMiddleware } from "@/lib/auth";

const handler = async (req, { params }) => {
  await dbConnect();
  const { id } = params;
  const userCompanyId = req.user.companyId;

  // Ensure the company belongs to the API user
  if (id !== userCompanyId) return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });

  if (req.method === "GET") {
    const company = await Company.findById(id);
    if (!company) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    return new Response(JSON.stringify(company), { status: 200 });
  }

  if (req.method === "PATCH") {
    const updated = await Company.findByIdAndUpdate(id, req.body, { new: true });
    return new Response(JSON.stringify(updated), { status: 200 });
  }

  if (req.method === "DELETE") {
    await Company.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: "Deleted" }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
};

export default authMiddleware(handler);
