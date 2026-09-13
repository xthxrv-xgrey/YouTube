import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "#constants/auth.js";

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
};

export const verifPassword = async (password: string, passwordHash: string) => {
  const match = await bcrypt.compare(password, passwordHash);
  return match;
};
