import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["like", "comment", "subscribe", "video"],
    },
    message: {
      type: String,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "referenceType",
    },
    referenceType: {
      type: String,
      enum: ["Video", "Comment", "Like", "Subscription"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Notification = mongoose.model("Notification", notificationSchema);
