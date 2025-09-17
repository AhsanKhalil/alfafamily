import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  otp: String,
  datetime: { type: Date, default: Date.now },
  expiryTime: Date,
  purpose: String
});

export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
