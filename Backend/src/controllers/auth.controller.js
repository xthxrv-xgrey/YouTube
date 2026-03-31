import { config } from "../config/config.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { hashToken } from "../utils/hashToken.js";
import jwt from "jsonwebtoken";
import * as emailService from "../services/email.service.js";
import { User } from "../models/user.model.js";
import { Session } from "../models/session.model.js";
import { UnverifiedUser } from "../models/unverifiedUser.model.js";

const validatePassword = (password) => {
  if (password.length < 6 || password.length > 30) {
    throw new ApiError(
      400,
      "Password must be between 6 and 30 characters long",
    );
  }
  if (!/^\w+$/.test(password)) {
    throw new ApiError(
      400,
      "Password must contain only letters, numbers, and underscores",
    );
  }
};

const validateUsername = (username) => {
  if (username.length < 3 || username.length > 30) {
    throw new ApiError(
      400,
      "Username must be between 3 and 30 characters long",
    );
  }
  if (!/^\w+$/.test(username)) {
    throw new ApiError(
      400,
      "Username must contain only letters, numbers, and underscores",
    );
  }
};

const validateEmail = (email) => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "Email is invalid");
  }
};

const sendOtp = async (email) => {
  const otp = emailService.generateOtp();
  await emailService.sendEmail(
    email,
    "Verify Your Email",
    "Your OTP is: " + otp,
    emailService.getOtpHtml(otp),
  );
  return otp;
};

const setRefreshTokenCookie = (refreshToken, res) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const updateRefreshToken = async (refreshToken, session, res) => {
  session.refreshToken = hashToken(refreshToken);
  await session.save({ validateBeforeSave: false });
  setRefreshTokenCookie(refreshToken, res);
};

// @desc Register a new unverified user and send OTP to the user's email
// @route POST /api/v1/auth/register
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  validatePassword(password);
  validateUsername(username);
  validateEmail(email);

  const existingUserWithSameUsername = await User.findOne({ username });
  if (existingUserWithSameUsername) {
    throw new ApiError(400, "User with this username already exists");
  }

  const existingUserWithSameEmail = await User.findOne({ email });
  if (existingUserWithSameEmail) {
    throw new ApiError(400, "User with this email already exists");
  }

  const existingUnverifiedUser = await UnverifiedUser.findOne({ email });
  if (existingUnverifiedUser) {
    throw new ApiError(
      400,
      "OTP already sent. Try again after a few minutes or use resend.",
    );
  }

  const otp = await sendOtp(email);
  const hashedOtp = hashToken(otp);

  await UnverifiedUser.create({
    username,
    email,
    password,
    otp: hashedOtp,
  });

  return res.status(200).json(new ApiResponse(200, "OTP sent successfully."));
});

// @desc Verify the unverified user's OTP and create a new user
// @route POST /api/v1/auth/verify-user
// @access Public
export const verifyUser = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) throw new ApiError(400, "All fields are required.");

  const unverifiedUser = await UnverifiedUser.findOne({ email });
  if (!unverifiedUser) {
    throw new ApiError(400, "OTP expired or not found. Please register again.");
  }

  if (unverifiedUser.otp !== hashToken(otp)) {
    throw new ApiError(400, "Invalid OTP.");
  }

  const user = await User.create({
    username: unverifiedUser.username,
    email: unverifiedUser.email,
    password: unverifiedUser.password,
  });

  await UnverifiedUser.deleteOne({ email });

  const refreshToken = user.generateRefreshToken();

  const session = await Session.create({
    userId: user._id,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    refreshToken: hashToken(refreshToken),
  });

  setRefreshTokenCookie(refreshToken, res);
  const accessToken = user.generateAccessToken(session);

  const safeUser = user.toObject();
  delete safeUser.password;

  return res.status(201).json(
    new ApiResponse(201, "User verified successfully.", {
      safeUser,
      accessToken,
    }),
  );
});

// @desc Login user
// @route POST /api/v1/auth/login
// @access Public
export const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password)
    throw new ApiError(400, "All fields are required.");

  const identifierNormalized = identifier.toLowerCase();

  const user = await User.findOne({
    $or: [{ username: identifierNormalized }, { email: identifierNormalized }],
  }).select("+password");

  if (!user) throw new ApiError(400, "Invalid credentials.");

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) throw new ApiError(400, "Invalid credentials.");

  const refreshToken = user.generateRefreshToken();

  const session = await Session.create({
    userId: user._id,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    refreshToken: hashToken(refreshToken),
  });

  setRefreshTokenCookie(refreshToken, res);
  const accessToken = user.generateAccessToken(session);

  const safeUser = user.toObject();
  delete safeUser.password;

  return res.status(200).json(
    new ApiResponse(200, "Logged in successfully.", {
      safeUser,
      accessToken,
    }),
  );
});

// @desc Logout user
// @route POST /api/v1/auth/logout
// @access Private
export const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) throw new ApiError(401, "Unauthorized access.");

  await Session.findOneAndDelete({ refreshToken: hashToken(refreshToken) });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json(new ApiResponse(200, "Logged out successfully."));
});

// @desc Logout all sessions
// @route POST /api/v1/auth/logout-all
// @access Private
export const logoutAll = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) throw new ApiError(401, "Unauthorized access.");

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token.");
  }

  if (!decoded?._id) throw new ApiError(401, "Invalid refresh token.");

  await Session.deleteMany({ userId: decoded._id });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Logged out of all sessions successfully."));
});

// @desc Refresh access token
// @route POST /api/v1/auth/refresh
// @access Private
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) throw new ApiError(401, "Unauthorized access.");

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token.");
  }

  if (!decoded?._id) throw new ApiError(401, "Invalid refresh token.");

  const user = await User.findById(decoded._id);
  if (!user) throw new ApiError(401, "Invalid refresh token.");

  const session = await Session.findOne({
    userId: user._id,
    refreshToken: hashToken(refreshToken),
  });

  if (!session) {
    await Session.deleteMany({ userId: user._id });
    throw new ApiError(
      401,
      "Token reuse detected. All sessions have been revoked.",
    );
  }

  const newRefreshToken = user.generateRefreshToken();
  await updateRefreshToken(newRefreshToken, session, res);
  const accessToken = user.generateAccessToken(session);

  const safeUser = user.toObject();
  delete safeUser.password;

  return res.status(200).json(
    new ApiResponse(200, "Tokens refreshed successfully.", {
      safeUser,
      accessToken,
    }),
  );
});
