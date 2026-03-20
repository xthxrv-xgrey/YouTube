import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
    notificationLevel: {
      type: String,
      enum: ["all", "highlights", "none"],
      default: "all",
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
