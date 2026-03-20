import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, fullName, country } = req.body;

  // 🔍 Field-wise validation
  if (!username) {
    throw new ApiError(400, "Username is required");
  }

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  if (!fullName) {
    throw new ApiError(400, "Full name is required");
  }

  // 🔍 Optional validations
  if (username.length < 3) {
    throw new ApiError(400, "Username must be at least 3 characters long");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // 🔍 Check existing user
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    if (existingUser.username === username) {
      throw new ApiError(400, "Username already taken");
    }
    if (existingUser.email === email) {
      throw new ApiError(400, "Email already registered");
    }
  }

  // 👤 Create user (password hashed in schema)
  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    fullName,
    country,
  });

  // ✅ Convert to object & remove password (no extra DB call)
  const createdUser = user.toObject();
  delete createdUser.password;

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export { registerUser };
