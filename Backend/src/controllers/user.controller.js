import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../services/cloudinary.service.js";

// @desc Get current user
// @route GET /api/v1/users/me
// @access Private
export const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "User fetched successfully.", req.user));
});

// @desc Update current user
// @route PATCH /api/v1/users/me
// @access Private
export const updateCurrentUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, username, channelDescription, country } =
    req.body;

  if (!firstName && !lastName && !username && !channelDescription && !country) {
    throw new ApiError(400, "At least one field is required.");
  }

  const existingUser = await User.findOne({ username });
  if (existingUser && existingUser._id !== req.user._id) {
    throw new ApiError(400, "Username already exists.");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      firstName,
      lastName,
      username,
      channelDescription,
      country,
    },
    { new: true },
  );

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
export const updateCurrentUserBanner = asyncHandler(async (req, res) => {
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
      banner: banner.url,
    },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Avatar updated successfully.", user));
});
