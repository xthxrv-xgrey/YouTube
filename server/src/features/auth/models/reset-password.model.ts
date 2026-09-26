import { Schema, model } from "mongoose";
import { VERIFICATION_TTL } from "#constants/auth.js";

const ResetPasswordSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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

ResetPasswordSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: VERIFICATION_TTL }
);

const ResetPasswordModel = model("ResetPassword", ResetPasswordSchema);

export default ResetPasswordModel;
