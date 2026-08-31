export const passwordChangeSuccessHtml = (name: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Password changed successfully</title>
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
            Password changed successfully
          </h1>

          <p>
            Hi ${name},
          </p>

          <p>
            Your account password was successfully changed.
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
                font-size: 20px;
                font-weight: bold;
              "
            >
              Your password is now updated.
            </span>
          </div>

          <p>
            If you made this change, no further action is required.
          </p>

          <p style="color: #71717a; font-size: 14px;">
            If you didn't change your password, please secure your account
            immediately by resetting your password.
          </p>

          <p style="color: #71717a; font-size: 14px;">
            This is an automated email. Please do not reply.
          </p>
        </div>
      </body>
    </html>
  `;
};
