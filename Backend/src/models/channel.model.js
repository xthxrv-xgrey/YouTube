import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    handle: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    subscriberCount: {
      type: Number,
      default: 0,
    },
    videoCount: {
      type: Number,
      default: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
    },
    memberships: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
    },
  },
  { timestamps: true },
);

export const Channel = mongoose.model("Channel", channelSchema);
