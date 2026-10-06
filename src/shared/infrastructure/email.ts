import "server-only";
import { Resend } from "resend";
import { logger } from "./logger";

export interface Email {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

let client: Resend | null = null;

/**
 * Sends through Resend when RESEND_API_KEY is set. Without a key the email is logged and
 * treated as sent, so features that email keep working before the provider is provisioned.
 */
export async function sendEmail(email: Email): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    logger.info("email not sent (RESEND_API_KEY unset)", { ...email });
    return;
  }
  client ??= new Resend(apiKey);
  const { error } = await client.emails.send({
    // Resend's shared sender works for testing; set EMAIL_FROM to an address on a verified domain.
    from: process.env.EMAIL_FROM || "RASPA <onboarding@resend.dev>",
    to: email.to,
    subject: email.subject,
    text: email.text,
    replyTo: email.replyTo,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}
