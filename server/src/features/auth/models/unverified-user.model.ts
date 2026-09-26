import { Schema, model } from "mongoose";
import { EMAIL_REGEX, USERNAME_REGEX } from "#constants/regex.js";
import { VERIFICATION_TTL } from "#constants/auth.js";

const UnverifiedUserSchema = new Schema(
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

    passwordHash: {
      type: String,
      required: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

UnverifiedUserSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: VERIFICATION_TTL }
);

const UnverifiedUserModel = model("UnverifiedUser", UnverifiedUserSchema);

export default UnverifiedUserModel;
