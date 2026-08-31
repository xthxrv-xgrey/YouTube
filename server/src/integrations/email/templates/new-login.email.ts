export const loginSuccessHtml = (
  name: string,
  device: string,
  browser: string,
  ip: string
): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>New sign-in detected</title>
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
            New sign-in detected
          </h1>

          <p>
            Hi ${name},
          </p>

          <p>
            We detected a new sign-in to your account.
          </p>

          <div
            style="
              margin: 32px 0;
              padding: 20px;
              background-color: #f4f4f5;
              border-radius: 8px;
            "
          >
            <p style="margin: 0 0 12px; font-weight: bold;">
              Sign-in details
            </p>

            <p style="margin: 8px 0;">
              <strong>Device:</strong> ${device}
            </p>

            <p style="margin: 8px 0;">
              <strong>Browser:</strong> ${browser}
            </p>

            <p style="margin: 8px 0;">
              <strong>IP address:</strong> ${ip}
            </p>
          </div>

          <p>
            If this was you, you don't need to do anything.
          </p>

          <p>
            If you don't recognize this sign-in, we recommend changing your
            password and signing out of all other devices immediately.
          </p>

          <p style="color: #71717a; font-size: 14px;">
            For your security, never share your password or verification codes
            with anyone.
          </p>

          <p style="color: #71717a; font-size: 14px;">
            This is an automated email. Please do not reply.
          </p>
        </div>
      </body>
    </html>
  `;
};
