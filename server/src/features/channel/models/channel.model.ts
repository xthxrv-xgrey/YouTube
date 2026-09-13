import { Schema, model } from "mongoose";
import env from "#config/env.js";
import { CHANNEL_HANDLE_REGEX } from "#constants/regex.js";

const ChannelSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },

    handle: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: [CHANNEL_HANDLE_REGEX, "Invalid channel handle"],
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    avatar: {
      type: String,
      default: env.DEFAULT_CHANNEL_AVATAR,
      trim: true,
    },

    banner: {
      type: String,
      default: env.DEFAULT_CHANNEL_BANNER,
      trim: true,
    },

    subscriberCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    videoCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    country: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    links: [
      {
        title: {
          type: String,
          trim: true,
          maxlength: 50,
        },

        url: {
          type: String,
          trim: true,
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChannelModel = model("Channel", ChannelSchema);

export default ChannelModel;
