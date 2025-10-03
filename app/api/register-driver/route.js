import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Vehicle from "@/models/Vehicle";

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();

    // Validate roleId
    if (!body.roleId) throw new Error("roleId is required");
    if (!body.userId) throw new Error("userId is required");

    // Save Vehicle
    const vehicle = await Vehicle.create({ ...body.vehicle });

    // Save User
    const user = await User.create({
      employeeId: body.employeeId,
      roleId: body.roleId, // must be ObjectId
      userId: body.userId,
      userName: body.userName,
      password: body.password,
      cnic: body.cnic,
      vehicleId: vehicle._id
    });

    // Link vehicle owner
    vehicle.owner = user._id;
    await vehicle.save();

    return new Response(
      JSON.stringify({ message: "Driver registered successfully!", user, vehicle }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Register Driver Error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
