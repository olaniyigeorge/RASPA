import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { Alert, Card, CardBody, Container, VerificationBadge } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { getListingDetail } from "@/modules/listings";
import { PaymentPlanForm } from "./payment-plan-form";
import { PLAN_COPY } from "./plans";

type PlanType = keyof typeof PLAN_COPY;

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 text-sm">
      <span className="text-ink-muted">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export async function PaymentPlanDetail({ propId, planType }: { propId: string; planType: PlanType }) {
  const property = await getListingDetail(propId);
  if (!property) notFound();
  const copy = PLAN_COPY[planType];
  const price = property.price.toString();

  return (
    <Container size="md" className="py-10">
      <Link href={`/property/${property.slug}`} className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-brand-700">
        <ChevronLeft className="size-4" /> {property.title}
      </Link>
      <h1 className="mt-3 text-3xl font-semibold">{copy.title}</h1>
      <p className="mt-2 text-ink-muted">{copy.blurb}</p>

      <Card className="mt-6">
        <CardBody className="divide-y divide-line py-3">
          <div className="flex items-center justify-between py-3 text-sm">
            <span className="text-ink-muted">Property</span>
            <VerificationBadge status={property.status} />
          </div>
          <Row label="List price" value={formatCurrency(price, property.currency)} />
          {planType === "INSTALLMENTS" && property.installmentMonths && <Row label="Term" value={`${property.installmentMonths} months`} />}
          {planType === "INVEST" && property.expectedRoiPct && <Row label="Projected ROI" value={`${property.expectedRoiPct.toString()}%`} />}
          {property.minDownPaymentPct && planType !== "BUY_NOW" && planType !== "RENT" && <Row label="Minimum down payment" value={`${property.minDownPaymentPct}%`} />}
        </CardBody>
      </Card>

      {property.status !== "VERIFIED" && (
        <div className="mt-4">
          <Alert tone="warning" title="This listing is not verified yet">
            The lister has not completed proof of ownership. You can still continue, but consider waiting for verification.
          </Alert>
        </div>
      )}

      <PaymentPlanForm propertyId={property.id} planType={planType} price={price} currency={property.currency} minDownPaymentPct={property.minDownPaymentPct} />
      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-subtle">
        <ShieldCheck className="size-3.5" /> Payments are processed securely by Paystack.
      </p>
    </Container>
  );
}
