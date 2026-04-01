import mongoose from "mongoose";
import bcrypt from "bcrypt";

const unverifiedUserSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [50, "First name must be at most 50 characters long"],
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, "Last name must be at most 50 characters long"],
    },
  },

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

  country: {
    type: String,
    required: [true, "Country is required"],
    trim: true,
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

unverifiedUserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

const UnverifiedUser = mongoose.model("UnverifiedUser", unverifiedUserSchema);
export { UnverifiedUser };
