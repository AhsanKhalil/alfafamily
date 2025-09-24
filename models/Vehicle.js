import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema({
  type: String,
  name: String,
  model: String,
  color: String,
  registrationNo: String,
  seatCount: Number,
  picture: String,
  companyid: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  isActive: { type: Boolean, default: true },
  createdOn: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  modifiedOn: Date,
  modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.models.Vehicle || mongoose.model("Vehicle", VehicleSchema);
