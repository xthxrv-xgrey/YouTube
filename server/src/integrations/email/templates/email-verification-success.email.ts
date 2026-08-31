export const emailVerificationSuccessHtml = (name: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Email verified successfully</title>
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
            Email verified successfully 🎉
          </h1>

          <p>
            Hi ${name},
          </p>

          <p>
            Your email address has been successfully verified.
            Your account is now ready to use.
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
              You're all set!
            </span>
          </div>

          <p>
            You can now sign in and start using your account.
          </p>

          <p style="color: #71717a; font-size: 14px;">
            If you didn't create this account, please contact us immediately.
          </p>

          <p style="color: #71717a; font-size: 14px;">
            This is an automated email. Please do not reply.
          </p>
        </div>
      </body>
    </html>
  `;
};
