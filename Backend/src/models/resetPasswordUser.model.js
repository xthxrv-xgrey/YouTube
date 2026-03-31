import mongoose from "mongoose";

const resetPasswordUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is invalid"],
  },

  otp: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
    index: true,
  },
});

const ResetPasswordUser = mongoose.model(
  "ResetPasswordUser",
  resetPasswordUserSchema,
);
export { ResetPasswordUser };
