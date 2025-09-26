import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  userId: { type: String, required: true, unique: true },
 // roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
 roleId: { type: String, required: true },
  userName: { type: String, required: true },
  password: { type: String, required: true },
  cnic: String,
  isActive: { type: Boolean, default: true }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
