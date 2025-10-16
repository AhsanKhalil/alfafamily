import dbConnect from "@/lib/mongodb";
import UserActivityLog from "@/models/UserActivityLog";

export async function logUserActivity({ userId, eventPerformed, activityDetail, ipAddress, deviceInfo }) {
  try {
    await dbConnect();
    const log = new UserActivityLog({
      userId,
      eventPerformed,
      activityDetail,
      ipAddress: ipAddress || "Unknown IP",
      deviceInfo: deviceInfo || "Unknown Device",
    });
    await log.save();
    console.log("Activity Logged:", eventPerformed);
  } catch (error) {
    console.error("Error logging user activity:", error);
  }
}
