import { Resend } from "resend";

import env from "#config/env.js";
import type { EmailProvider, SendEmailOptions } from "../email.provider.js";

const resend = new Resend(env.RESEND_API_KEY);

export class ResendEmailProvider implements EmailProvider {
  async sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
