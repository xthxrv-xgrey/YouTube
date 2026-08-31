import bcrypt from "bcrypt";
import crypto from "crypto";

const SALT_ROUNDS = 12;

/**
 * Generates a cryptographically secure 6-digit OTP.
 */
export const generateOTP = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * Hashes an OTP using bcrypt.
 */
export const hashOTP = async (otp: string): Promise<string> => {
  return bcrypt.hash(otp, SALT_ROUNDS);
};

/**
 * Compares a plain OTP with a hashed OTP.
 */
export const compareOTP = async (
  otp: string,
  hashedOTP: string
): Promise<boolean> => {
  return bcrypt.compare(otp, hashedOTP);
};
