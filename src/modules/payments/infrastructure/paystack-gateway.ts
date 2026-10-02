import { createHmac, timingSafeEqual } from "node:crypto";
import type { PaymentGateway } from "../domain/ports";

const BASE = "https://api.paystack.co";

async function call<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => null)) as { status?: boolean; message?: string; data?: T } | null;
  if (!res.ok || !json?.status) {
    throw new Error(`Paystack ${path} failed: ${json?.message ?? res.status}`);
  }
  return json.data as T;
}

export const paystackGateway: PaymentGateway = {
  async initialize({ email, amountKobo, reference, callbackUrl, plan, metadata }) {
    const data = await call<{ authorization_url: string }>("/transaction/initialize", {
      email,
      amount: amountKobo,
      reference,
      callback_url: callbackUrl,
      metadata,
      ...(plan && { plan }),
    });
    return { authorizationUrl: data.authorization_url };
  },

  verifyWebhookSignature(rawBody, signature) {
    if (!signature || !process.env.PAYSTACK_SECRET_KEY) return false;
    const expected = createHmac("sha512", process.env.PAYSTACK_SECRET_KEY).update(rawBody).digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    return a.length === b.length && timingSafeEqual(a, b);
  },

  async createRecipient({ name, accountNumber, bankCode }) {
    const data = await call<{ recipient_code: string }>("/transferrecipient", {
      type: "nuban",
      name,
      account_number: accountNumber,
      bank_code: bankCode,
      currency: "NGN",
    });
    return { recipientCode: data.recipient_code };
  },

  async transfer({ amountKobo, recipientCode, reference, reason }) {
    await call("/transfer", {
      source: "balance",
      amount: amountKobo,
      recipient: recipientCode,
      reference,
      reason,
    });
  },
};
