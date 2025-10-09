import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");
    const userId = searchParams.get("userId");

    if (!employeeId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing parameters" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const existing = await User.findOne({
      $or: [
        { employeeId },
        { userId }
      ]
    });

    return new Response(
      JSON.stringify({ exists: !!existing }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
