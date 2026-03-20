import mongoose from "mongoose";

const liveStreamSchema = new mongoose.Schema(
  {
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
    },
    streamKey: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Live", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    thumbnailUrl: {
      type: String,
    },
    viewerCount: {
      type: Number,
      default: 0,
    },
    peakViewerCount: {
      type: Number,
      default: 0,
    },
    scheduledAt: {
      type: Date,
    },
    startedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const LiveStream = mongoose.model("LiveStream", liveStreamSchema);
