import mongoose from "mongoose";

const PoolingRequestMemberSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: "PoolingRequest", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  seatsBooked: Number,
  joinedOn: { type: Date, default: Date.now },
  status: String,
  isPrimaryRider: { type: Boolean, default: false },
  notes: String
});

export default mongoose.models.PoolingRequestMember || mongoose.model("PoolingRequestMember", PoolingRequestMemberSchema);
