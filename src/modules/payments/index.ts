// Public API of the payments context.
import { listings } from "../listings";
import { makePaymentUseCases } from "./application/payment-use-cases";
import { paystackGateway } from "./infrastructure/paystack-gateway";
import {
  prismaPaymentRepository,
  prismaPayoutAccountRepository,
  prismaPayoutRepository,
} from "./infrastructure/prisma-repositories";

export type { InitiatePaymentInput } from "./application/payment-use-cases";

export const payments = makePaymentUseCases({
  payments: prismaPaymentRepository,
  payouts: prismaPayoutRepository,
  accounts: prismaPayoutAccountRepository,
  gateway: paystackGateway,
  appUrl: process.env.APP_URL ?? process.env.AUTH_URL ?? "http://localhost:3000",
  async listingPrice(propertyId) {
    const l = await listings.get(propertyId);
    return { price: l.price, currency: "NGN" };
  },
});
