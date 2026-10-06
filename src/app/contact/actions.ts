"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { sendEmail } from "@/shared/infrastructure/email";
import { logger, reportError } from "@/shared/infrastructure/logger";
import { clientIp, rateLimitByKey } from "@/shared/infrastructure/rate-limit";
import { TooManyRequestsError } from "@/shared/kernel/errors";

export interface ContactState {
  ok: boolean;
  error?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
  /** Echoed back on failure so the form (reset by React after an action) keeps what was typed. */
  values?: { name: string; email: string; message: string };
}

const schema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(120),
  email: z.email("Enter a valid email address").max(200),
  message: z.string().trim().min(10, "Your message is a little short").max(5000),
});

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };
  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof NonNullable<ContactState["fieldErrors"]>;
      fieldErrors[field] ??= issue.message;
    }
    return { ok: false, fieldErrors, values };
  }

  try {
    await rateLimitByKey(clientIp(await headers()), { key: "contact", limit: 5, windowMs: 10 * 60_000 });
  } catch (err) {
    if (err instanceof TooManyRequestsError) return { ok: false, error: err.message, values };
    throw err;
  }

  const { name, email, message } = parsed.data;
  const contact = {
    subject: `Contact form: ${name}`,
    replyTo: email,
    text: `From: ${name} <${email}>\n\n${message}`,
  };
  const to = process.env.CONTACT_EMAIL;
  if (!to) {
    logger.warn("contact message not emailed (CONTACT_EMAIL unset)", contact);
    return { ok: true };
  }
  try {
    await sendEmail({ to, ...contact });
  } catch (err) {
    reportError(err, { message: "contact email failed" });
    return { ok: false, error: "We couldn't send your message. Please try again in a moment.", values };
  }
  return { ok: true };
}
