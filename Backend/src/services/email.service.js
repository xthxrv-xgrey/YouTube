import nodemailer from "nodemailer";
import crypto from "crypto";
import { config } from "../config/config.js";

// ✅ crypto-safe OTP instead of Math.random()
export function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

export function getOtpHtml(otp, message, expiryTime) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:40px 0;">
        <tr>
            <td align="center">
                <table width="400" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; padding:32px; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                    <tr>
                        <td align="center" style="padding-bottom:16px;">
                            <h2 style="margin:0; color:#111111; font-size:22px;">Email Verification</h2>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom:12px;">
                            <p style="margin:0; color:#555555; font-size:14px;">${message} <strong> It expires in ${expiryTime}</strong>.</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding:24px 0;">
                            <span style="font-size:36px; font-weight:bold; letter-spacing:8px; color:#111111;">${otp}</span>
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            <p style="margin:0; color:#999999; font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.GOOGLE_EMAIL_USER,
    pass: config.GOOGLE_APP_PASSWORD,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("Error connecting to email server:", error.message);
  } else {
    console.log("Email server is ready to send messages");
  }
});

export const sendEmail = async (to, subject, text, html) => {
  const info = await transporter.sendMail({
    from: `"Auth App" <${config.GOOGLE_EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
  console.log("Email sent:", info.messageId);
};
