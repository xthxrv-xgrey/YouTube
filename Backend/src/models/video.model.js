import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    privacy: {
      type: String,
      enum: ["public", "private", "unlisted"],
      default: "public",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Video = mongoose.model("Video", videoSchema);
