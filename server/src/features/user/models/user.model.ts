import { Schema, model, InferSchemaType } from "mongoose";
import env from "#config/env.js";
import { EMAIL_REGEX, USERNAME_REGEX } from "#constants/regex.js";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, "Please enter a valid email address."],
    },

    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
      index: true,
      trim: true,
      match: [USERNAME_REGEX, "Username contains invalid characters."],
    },

    avatarUrl: {
      type: String,
      default: env.DEFAULT_USER_AVATAR,
    },

    accountStatus: {
      type: String,
      enum: {
        values: ["active", "suspended", "deactivated"],
        message: "Invalid account status.",
      },
      default: "active",
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

export type User = InferSchemaType<typeof UserSchema>;

const UserModel = model("User", UserSchema);

export default UserModel;
