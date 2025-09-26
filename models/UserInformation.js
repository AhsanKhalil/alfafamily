import mongoose from "mongoose";

const UserInformationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  profilePic: String,
  whatsAppNo1: String,
  whatsAppNo2: String,
  mobileNo1: String,
  mobileNo2: String,
  address1: String,
  address2: String,
  email: String,
});

export default mongoose.models.UserInformation || mongoose.model("UserInformation", UserInformationSchema);
