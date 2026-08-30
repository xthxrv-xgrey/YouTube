import env from "#config/env.js";
import mongoose from "mongoose";
import { EMAIL_REGEX, USERNAME_REGEX, NAME_REGEX } from "#constants/regex.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
      match: [NAME_REGEX, "Please provide a valid name"],
    },

    lastName: {
      type: String,
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
      match: [NAME_REGEX, "Please provide a valid name"],
    },

    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        USERNAME_REGEX,
        "Username must be 3-30 characters and can only contain letters, numbers, underscores, and dots. It cannot start/end with a dot or contain consecutive dots.",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [EMAIL_REGEX, "Please provide a valid email address"],
    },

    avatar: {
      type: String,
      default: env.DEFAULT_AVATAR,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", userSchema);
