import mongoose from "mongoose";

const PoolingRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  pickupLocation: String,
  dropoffLocation: String,
  poolTime: Date,
  requestTime: { type: Date, default: Date.now },
  totalSeats: Number,
  availableSeats: Number,
  status: String,
  notes: String,
  createdOn: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  modifiedOn: Date,
  modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.models.PoolingRequest || mongoose.model("PoolingRequest", PoolingRequestSchema);
