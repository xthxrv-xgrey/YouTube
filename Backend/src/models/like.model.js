import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "targetType",
    },
    targetType: {
      type: String,
      enum: ["video", "comment", "liveStream"],
    },
    value: {
      type: Number,
      enum: [1, -1],
    },
  },
  { timestamps: true },
);

export const Like = mongoose.model("Like", likeSchema);
