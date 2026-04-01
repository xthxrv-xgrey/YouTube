import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const userSchema = new mongoose.Schema(
  {
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
      unique: [true, "Username already exists"],
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
      unique: [true, "Email already exists"],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is invalid"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dfndzxbvm/image/upload/v1774013509/user-pfp-default_vm1pzx.jpg",
    },
    banner: {
      type: String,
      default:
        "https://res.cloudinary.com/dfndzxbvm/image/upload/v1774013489/channel-banner-default_lacjyo.png",
    },
    channelDescription: {
      type: String,
      trim: true,
      default: "",
      maxlength: [
        1000,
        "Channel description must be at most 1000 characters long",
      ],
    },
    subscribersCount: {
      type: Number,
      default: 0,
    },
    videosCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  if (this.password.startsWith("$2b$")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (session) {
  return jwt.sign(
    { _id: this._id, sessionId: session._id },
    config.ACCESS_TOKEN_SECRET,
    {
      expiresIn: config.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY,
  });
};

export const User = mongoose.model("User", userSchema);
