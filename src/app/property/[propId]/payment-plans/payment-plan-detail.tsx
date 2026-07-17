import { notFound } from "next/navigation";
import { getPropertyBySlugOrId } from "@/lib/properties";
import { formatCurrency } from "@/lib/utils";
import { PaymentPlanForm } from "./payment-plan-form";
import type { PaymentPlanType } from "@prisma/client";

const PLAN_COPY: Record<PaymentPlanType, { title: string; blurb: string }> = {
  BUY_NOW: {
    title: "Buy now",
    blurb: "Pay the full amount upfront and take ownership immediately.",
  },
  INSTALLMENTS: {
    title: "Installments",
    blurb: "Spread payment across a fixed number of months.",
  },
  INVEST: {
    title: "Invest",
    blurb: "Put capital into this property and earn a projected return.",
  },
  RENT: {
    title: "Rent",
    blurb: "Pay a recurring rent to occupy this property.",
  },
};

export async function PaymentPlanDetail({
  propId,
  planType,
}: {
  propId: string;
  planType: PaymentPlanType;
}) {
  const property = await getPropertyBySlugOrId(propId);
  if (!property) notFound();

  const copy = PLAN_COPY[planType];

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <p className="text-sm text-gray-400">{property.title}</p>
      <h1 className="mt-1 text-2xl font-bold text-gray-900">{copy.title}</h1>
      <p className="mt-2 text-gray-600">{copy.blurb}</p>

      <div className="mt-6 rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">List price</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(property.price.toString(), property.currency)}
          </span>
        </div>

        {planType === "INSTALLMENTS" && property.installmentMonths && (
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-gray-500">Term</span>
            <span className="font-semibold text-gray-900">
              {property.installmentMonths} months
            </span>
          </div>
        )}

        {planType === "INVEST" && property.expectedRoiPct && (
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-gray-500">Projected ROI</span>
            <span className="font-semibold text-gray-900">
              {property.expectedRoiPct.toString()}%
            </span>
          </div>
        )}

        {property.minDownPaymentPct && planType !== "BUY_NOW" && (
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-gray-500">Minimum down payment</span>
            <span className="font-semibold text-gray-900">
              {property.minDownPaymentPct}%
            </span>
          </div>
        )}
      </div>

      <PaymentPlanForm
        propertyId={property.id}
        planType={planType}
        price={property.price.toString()}
        currency={property.currency}
        minDownPaymentPct={property.minDownPaymentPct}
      />
    </div>
  );
}
