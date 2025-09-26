import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  module: String,
  description: String
});

export default mongoose.models.Permission || mongoose.model("Permission", PermissionSchema);
