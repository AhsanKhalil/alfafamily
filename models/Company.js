import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  contactNo: String,
  email: { type: String, required: true, unique: true },
  website: String,
  createdOn: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  modifiedOn: Date,
  modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isActive: { type: Boolean, default: true }
});

export default mongoose.models.Company || mongoose.model("Company", CompanySchema);
