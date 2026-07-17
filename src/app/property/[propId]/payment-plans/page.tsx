import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyBySlugOrId } from "@/lib/properties";

const PLANS = [
  { href: "buy-now", label: "Buy now" },
  { href: "installments", label: "Installments" },
  { href: "invest", label: "Invest" },
  { href: "rent", label: "Rent" },
];

export default async function PaymentPlansIndexPage({
  params,
}: {
  params: Promise<{ propId: string }>;
}) {
  const { propId } = await params;
  const property = await getPropertyBySlugOrId(propId);
  if (!property) notFound();

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Choose a payment plan</h1>
      <p className="mt-1 text-gray-500">{property.title}</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {PLANS.map((plan) => (
          <Link
            key={plan.href}
            href={`/property/${property.slug}/payment-plans/${plan.href}`}
            className="rounded-xl border border-gray-200 py-4 text-center font-medium text-gray-700 hover:border-purple-400 hover:text-purple-700"
          >
            {plan.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
