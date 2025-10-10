import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Employee from "@/models/Employee";
import Role from "@/models/Role";
import Vehicle from "@/models/Vehicle";

export async function GET(req, context) {
  const params = await context.params; // ✅ Await only params
  await dbConnect();

  try {
    console.log("Fetching user with ID:", params.id);

    const user = await User.findById(params.id)
      .populate({ path: "employeeId", model: Employee })
      .populate({ path: "roleId", model: Role })
      .populate({ path: "vehicleId", model: Vehicle });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
