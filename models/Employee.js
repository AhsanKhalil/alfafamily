import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  empid: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  address: String,
  contactNo: String,
  email: String,
  cnic: String,
  gender: String,
  dateOfBirth: Date,
  joiningDate: Date,
  designation: String,
  department: String,
  ipPhoneNo: String,
  createdOn: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  modifiedOn: Date,
  modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isActive: { type: Boolean, default: true }
});

export default mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
