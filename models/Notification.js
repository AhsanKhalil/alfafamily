import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  Name: String,
  Detail: String,
  Unread: {
    type: Boolean,
    default: true,
  },
  CreatedOn: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
