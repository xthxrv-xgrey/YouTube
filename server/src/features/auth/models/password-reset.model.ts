import mongoose from "mongoose";

/**
 * A registration that hasn't been email-verified yet. Documents here
 * auto-expire via the TTL index below, so an abandoned signup cleans
 * itself up without any extra job.
 */
const passwordResetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Stores a bcrypt hash of the OTP — never the plaintext code.
    otpHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
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

// Automatically deletes the document once `expiresAt` is reached.
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordResetModel = mongoose.model(
  "PasswordReset",
  passwordResetSchema
);
