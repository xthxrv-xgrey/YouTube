import { emailProvider } from "./email.provider.js";
import {
  emailVerificationOtpHtml,
  emailVerificationSuccessHtml,
  passwordChangeSuccessHtml,
  passwordResetOtpHtml,
  passwordResetSuccessHtml,
} from "./index.js";
import { loginSuccessHtml } from "./templates/new-login.email.js";

/**
 * Sends an email verification OTP.
 */
export const sendEmailVerificationOTP = async (
  email: string,
  otp: string
): Promise<boolean> => {
  try {
    await emailProvider.sendEmail({
      to: email,
      subject: "Verify your email address",
      html: emailVerificationOtpHtml(otp),
    });

    return true;
  } catch {
    return false;
  }
};

/**
 * Sends a confirmation email after successful email verification.
 */
export const sendEmailVerificationSuccess = async (
  email: string,
  name: string
): Promise<boolean> => {
  try {
    await emailProvider.sendEmail({
      to: email,
      subject: "Email verified successfully",
      html: emailVerificationSuccessHtml(name),
    });

    return true;
  } catch {
    return false;
  }
};

/**
 * Sends a security notification after a successful login.
 */
export const sendNewLoginEmail = async (
  email: string,
  name: string,
  device: string,
  browser: string,
  ip: string
): Promise<boolean> => {
  try {
    await emailProvider.sendEmail({
      to: email,
      subject: "New sign-in detected",
      html: loginSuccessHtml(name, device, browser, ip),
    });

    return true;
  } catch {
    return false;
  }
};

/**
 * Sends a confirmation email after an authenticated password change.
 */
export const sendPasswordChangeSuccess = async (
  email: string,
  name: string
): Promise<boolean> => {
  try {
    await emailProvider.sendEmail({
      to: email,
      subject: "Your password has been changed",
      html: passwordChangeSuccessHtml(name),
    });

    return true;
  } catch {
    return false;
  }
};

/**
 * Sends a password reset OTP.
 */
export const sendPasswordResetOTP = async (
  email: string,
  otp: string
): Promise<boolean> => {
  try {
    await emailProvider.sendEmail({
      to: email,
      subject: "Reset your password",
      html: passwordResetOtpHtml(otp),
    });

    return true;
  } catch {
    return false;
  }
};

/**
 * Sends a confirmation email after a successful password reset.
 */
export const sendPasswordResetSuccess = async (
  email: string,
  name: string
): Promise<boolean> => {
  try {
    await emailProvider.sendEmail({
      to: email,
      subject: "Your password has been reset",
      html: passwordResetSuccessHtml(name),
    });

    return true;
  } catch {
    return false;
  }
};
