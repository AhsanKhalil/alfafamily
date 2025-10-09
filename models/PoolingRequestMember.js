import mongoose from "mongoose";
import User from  "./User.js";
import PoolingRequest from "./PoolingRequest.js";

const PoolingRequestMemberSchema = new mongoose.Schema({
 poolingRequestId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: PoolingRequest,
     required: true,
   },
 userId: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
 seatsBooked: Number,
 joinedOn: { type: Date, default: Date.now },
 status: String,
 isPrimaryRider: { type: Boolean, default: false },
 notes: String,
 isaccepted: { type: Boolean, default: false }, 
});

export default mongoose.models.PoolingRequestMember || mongoose.model("PoolingRequestMember", PoolingRequestMemberSchema);

