import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    channelBanner: {
      type: String,
    },
    channelDescription: {
      type: String,
      trim: true,
    },
    subscriberCount: {
      type: Number,
      default: 0,
    },
    videoCount: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    country: {
      type: String,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
