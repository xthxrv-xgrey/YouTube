import { ResendEmailProvider } from "./providers/resend.provider.js";

export type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export interface EmailProvider {
  sendEmail(options: SendEmailOptions): Promise<void>;
}

/**
 * Current email provider.
 *
 * Resend is used during development.
 * This can be replaced with another provider later.
 */
export const emailProvider: EmailProvider = new ResendEmailProvider();
