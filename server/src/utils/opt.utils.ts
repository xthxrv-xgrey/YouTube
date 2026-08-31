import bcrypt from "bcrypt";
import crypto from "crypto";

import { sendEmail } from "#integrations/email/email.provider.js";
import { emailVerificationHtml } from "#integrations/email/templates/index.js";

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

/**
 * Sends an email verification OTP.
 */
export const sendEmailVerificationOTP = async (
  email: string,
  otp: string
): Promise<boolean> => {
  try {
    await sendEmail({
      to: email,
      subject: "Email Verification OTP",
      html: emailVerificationHtml(otp),
    });

    return true;
  } catch (error) {
    return false;
  }
};
