import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  userId: { type: String, required: true, unique: true },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
  password: { type: String, required: true },
  cnic: String,
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

// Pre-save hook to hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
