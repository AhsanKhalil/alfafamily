import mongoose from "mongoose";
import Employee from "./Employee";  
import Role from "./Role";          
import Vehicle from "./Vehicle";

const UserSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  userId: { type: String, required: true, unique: true },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true }, 
  userName: { type: String, required: true },
  password: { type: String, required: true },
  cnic: String,
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }, // 🚗 link to vehicle
  isActive: { type: Boolean, default: true }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
