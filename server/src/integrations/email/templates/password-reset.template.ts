export const passwordResetHtml = (otp: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Reset your password</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f4f5;
          font-family: Arial, Helvetica, sans-serif;
          color: #18181b;
        "
      >
        <div
          style="
            max-width: 600px;
            margin: 40px auto;
            padding: 32px;
            background-color: #ffffff;
            border-radius: 12px;
          "
        >
          <h1 style="margin-top: 0;">
            Reset your password
          </h1>

          <p>
            We received a request to reset your password.
            Use the verification code below to continue.
          </p>

          <div
            style="
              margin: 32px 0;
              padding: 20px;
              text-align: center;
              background-color: #f4f4f5;
              border-radius: 8px;
            "
          >
            <span
              style="
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
              "
            >
              ${otp}
            </span>
          </div>

          <p>
            This code will expire shortly. If you didn't request a
            password reset, you can safely ignore this email.
          </p>

          <p style="color: #71717a; font-size: 14px;">
            For your security, never share this code with anyone.
          </p>

          <p style="color: #71717a; font-size: 14px;">
            This is an automated email. Please do not reply.
          </p>
        </div>
      </body>
    </html>
  `;
};
