import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    thumbnailUrl: {
      type: String,
    },
    privacy: {
      type: String,
      enum: ["public", "private", "unlisted"],
      default: "public",
    },
    videoCount: {
      type: Number,
      default: 0,
    },
    videoIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true },
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
