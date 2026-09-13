import ApiError from "#core/errors/ApiError.js";
import UserModel from "#features/user/models/user.model.js";
import { sendNewLoginEmail } from "#integrations/email/email.service.js";
import { verifPassword } from "#features/auth/utils/password.util.js";

interface LoginUserInput {
  identifier: string;
  password: string;
}

export const loginUser = async (input: LoginUserInput) => {
  const { identifier, password } = input;

  const user = await UserModel.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select("+passwordHash");

  if (!user) throw new ApiError(404, "User not found");

  const matchPassword = await verifPassword(password, user.passwordHash);

  if (!matchPassword) throw new ApiError(401, "Invalid credentials");

  await sendNewLoginEmail(user.email, user.name ?? "User");

  const safeUser = user.toObject();
  const { passwordHash, ...userWithoutPassword } = safeUser;

  return { safeUser: userWithoutPassword };
};
