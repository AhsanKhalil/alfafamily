import mongoose from "mongoose";

const UserActivityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventPerformed: String,
  activityDetail: String,
  ipAddress: String,
  datetime: { type: Date, default: Date.now },
  deviceInfo: String
});

export default mongoose.models.UserActivityLog || mongoose.model("UserActivityLog", UserActivityLogSchema);
