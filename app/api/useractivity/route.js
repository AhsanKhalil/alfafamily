import dbConnect from "@/lib/mongodb";
import UserActivityLog from "@/models/UserActivityLog";

export async function GET(req) {
  try {
    await dbConnect();

    // Get userId from query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "User ID required" }, { status: 400 });
    }

    // Fetch logs for this user
    const logs = await UserActivityLog.find({ userId }).sort({ datetime: -1 });

    return Response.json({ logs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
