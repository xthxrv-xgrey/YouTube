import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../services/cloudinary.service.js";
import jwt from "jsonwebtoken";

// @desc Get current user
// @route GET /api/v1/users/me
// @access Private
export const getCurrentUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new ApiError(401, "Unauthorized");
  }
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token.");
  }
  const user = await User.findById(decoded._id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "User fetched successfully.", user));
});

// @desc Update current user
// @route PATCH /api/v1/users/me
// @access Private
export const updateCurrentUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, username, channelDescription, country } =
    req.body;

  const updateFields = {};
  if (firstName) updateFields.firstName = firstName;
  if (lastName) updateFields.lastName = lastName;
  if (username) updateFields.username = username;
  if (channelDescription) updateFields.channelDescription = channelDescription;
  if (country) updateFields.country = country;

  if (Object.keys(updateFields).length === 0) {
    throw new ApiError(400, "At least one field is required.");
  }

  const existingUser = await User.findOne({ username });
  if (existingUser && !existingUser._id.equals(req.user._id)) {
    throw new ApiError(400, "Username already exists.");
  }

  const user = await User.findByIdAndUpdate(req.user._id, updateFields, {
    new: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "User updated successfully.", user));
});

// @desc Update current user avatar
// @route PATCH /api/v1/users/me/avatar
// @access Private
export const updateCurrentUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required.");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(500, "Failed to upload avatar to Cloudinary.");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: avatar.url,
    },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Avatar updated successfully.", user));
});

// @desc Update current user avatar
// @route PATCH /api/v1/users/me/avatar
// @access Private
export const updateCurrentBanner = asyncHandler(async (req, res) => {
  const bannerLocalPath = req.file?.path;

  if (!bannerLocalPath) {
    throw new ApiError(400, "Banner file is required.");
  }

  const banner = await uploadOnCloudinary(bannerLocalPath);

  if (!banner.url) {
    throw new ApiError(500, "Failed to upload banner to Cloudinary.");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      channelBanner: banner.url,
    },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Banner updated successfully.", user));
});
