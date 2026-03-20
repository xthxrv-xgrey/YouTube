import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
    tier: {
      type: String,
      enum: ["Tier 1", "Tier 2", "Tier 3"],
      default: "Tier 1",
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Cancelled"],
      default: "Active",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    renewalDate: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const Membership = mongoose.model("Membership", membershipSchema);
