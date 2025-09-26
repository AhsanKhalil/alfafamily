// models/ApiUser.js
import mongoose from "mongoose";

const ApiUserSchema = new mongoose.Schema({
  
  username: { type: String, required: true, unique: true },
  companyid: { type: String, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.ApiUser || mongoose.model("ApiUser", ApiUserSchema);
