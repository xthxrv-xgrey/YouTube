import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "targetType",
    },
    targetType: {
      type: String,
      enum: ["Video", "Comment", "Channel", "User", "LiveStream"],
    },
    reason: {
      type: String,
      enum: ["Spam", "Harassment", "Hate Speech", "Copyright", "Other"],
    },
    details: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Resolved", "Rejected"],
      default: "Pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewdAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const Report = mongoose.model("Report", reportSchema);
