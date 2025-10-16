import mongoose from "mongoose";
import User from  "./User.js"; // ✅ must be imported before using ref: "User"
import Vehicle from "./Vehicle.js";

const PoolingRequestSchema = new mongoose.Schema({
 userId: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
 vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: Vehicle, required: true },
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
 modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
acceptedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export default mongoose.models.PoolingRequest || mongoose.model("PoolingRequest", PoolingRequestSchema);

