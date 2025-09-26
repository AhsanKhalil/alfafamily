import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String
});

export default mongoose.models.Role || mongoose.model("Role", RoleSchema);
