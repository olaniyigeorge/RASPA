"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import type { PaymentPlanType } from "@prisma/client";

interface PaymentPlanFormProps {
  propertyId: string;
  planType: PaymentPlanType;
  price: string;
  currency: string;
  minDownPaymentPct: number | null;
}

export function PaymentPlanForm({
  propertyId,
  planType,
  price,
  currency,
  minDownPaymentPct,
}: PaymentPlanFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dueNowAmount =
    planType === "BUY_NOW" || !minDownPaymentPct
      ? parseFloat(price)
      : (parseFloat(price) * minDownPaymentPct) / 100;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, planType, amount: dueNowAmount }),
      });

      if (res.status === 401) {
        router.push(`/accounts?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Payment initialization failed");

      // Provider (Paystack/Flutterwave) checkout URL comes back from the API
      // route once you wire up a real provider in /api/payments.
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        router.push(`/confirm-payment/${data.paymentId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-purple-700 py-3 text-sm font-semibold text-white hover:bg-purple-800 disabled:opacity-50"
      >
        {loading ? "Processing…" : `Pay ${formatCurrency(dueNowAmount, currency)} to proceed`}
      </button>
    </form>
  );
}
