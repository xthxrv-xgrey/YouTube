import mongoose from "mongoose";
import bcrypt from "bcrypt";

const unverifiedUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+$/,
      "Username must contain only letters, numbers, and underscores",
    ],
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [30, "Username must be at most 30 characters long"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is invalid"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },

  otp: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 120,
    index: true,
  },
});

unverifiedUserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

const UnverifiedUser = mongoose.model("UnverifiedUser", unverifiedUserSchema);
export { UnverifiedUser };
