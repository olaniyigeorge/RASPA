"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import type { PLAN_COPY } from "./plans";

interface Props {
  propertyId: string;
  planType: keyof typeof PLAN_COPY;
  price: string;
  currency: string;
  minDownPaymentPct: number | null;
}

export function PaymentPlanForm({ propertyId, planType, price, currency, minDownPaymentPct }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // the server decides the final amount; this only labels the button
  const dueNow =
    planType === "BUY_NOW" || planType === "RENT" || !minDownPaymentPct
      ? parseFloat(price)
      : (parseFloat(price) * minDownPaymentPct) / 100;

  async function pay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, planType, amount: dueNow }),
      });
      if (res.status === 401) {
        router.push(`/accounts?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Payment could not be started");
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 space-y-3">
      {error && <Alert tone="danger">{error}</Alert>}
      <Button size="lg" className="w-full" onClick={pay} loading={loading}>
        Pay {formatCurrency(dueNow, currency)}
      </Button>
    </div>
  );
}
