// Wires cross-context reactions. Import this from any entry point that must
// react to settled money (the Paystack webhook).
import "server-only";
import { onPaymentSettled, onPayoutPaid, onSubscriptionEvent } from "../shared/kernel/settlement";
import { management } from "./management";
import { recordPortfolioPayment } from "./payments/infrastructure/portfolio";
import { media } from "./media";
import { rentals } from "./rentals";

let wired = false;

export function bootstrap() {
  if (wired) return;
  wired = true;

  // rent: either a renter taking over a re-listing, or a plain rental
  onPaymentSettled("RENT", async (p) => {
    if (p.sublistingId) await rentals.recordRenterPayment(p.sublistingId, p.userId, p.id);
    else await rentals.startTenancy(p.propertyId, p.userId);
  });
  for (const plan of ["BUY_NOW", "INSTALLMENTS", "INVEST", "RENT"] as const) {
    onPaymentSettled(plan, async (p) => {
      if (!p.sublistingId) await recordPortfolioPayment(p);
    });
  }
  onPaymentSettled("SUBSCRIPTION", async (p) => {
    if (p.subscriptionId) await management.activateFromPayment(p.subscriptionId);
  });
  onPaymentSettled("MEDIA_CAPTURE", async (p) => {
    if (p.captureTaskId) await media.openAfterPayment(p.captureTaskId);
  });

  onPayoutPaid("TENANT_COMMISSION", async (p) => {
    if (p.sublistingId) await rentals.markCommissionPaid(p.sublistingId);
  });

  onSubscriptionEvent((e) => management.onSubscriptionEvent(e));
}
