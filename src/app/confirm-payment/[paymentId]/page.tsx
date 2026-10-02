import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, Clock3, RotateCcw, XCircle } from "lucide-react";
import { Card, CardBody, Container, LinkButton } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { getCurrentUser } from "@/modules/identity";
import { prisma } from "@/shared/infrastructure/prisma";
import { RefreshWhilePending } from "./refresh-while-pending";

export const metadata: Metadata = { title: "Payment status" };

const STATUS = {
  PENDING: { title: "Confirming your payment…", icon: Clock3, tone: "text-warning-600 bg-warning-50" },
  PROCESSING: { title: "Processing your payment…", icon: Clock3, tone: "text-warning-600 bg-warning-50" },
  SUCCESSFUL: { title: "Payment successful", icon: CheckCircle2, tone: "text-success-600 bg-success-50" },
  FAILED: { title: "Payment failed", icon: XCircle, tone: "text-danger-600 bg-danger-50" },
  REFUNDED: { title: "Payment refunded", icon: RotateCcw, tone: "text-ink-muted bg-canvas" },
} as const;

export default async function ConfirmPaymentPage({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/accounts");

  const payment = await prisma.payment.findUnique({ where: { id: paymentId }, include: { property: true } });
  if (!payment || payment.userId !== user.id) notFound();

  const s = STATUS[payment.status];
  const waiting = payment.status === "PENDING" || payment.status === "PROCESSING";

  return (
    <Container size="md" className="py-16">
      {waiting && <RefreshWhilePending />}
      <Card className="mx-auto max-w-md text-center shadow-raised">
        <CardBody className="p-8">
          <span className={`mx-auto flex size-14 items-center justify-center rounded-full ${s.tone}`}><s.icon className="size-7" /></span>
          <h1 className="mt-5 text-2xl font-semibold">{s.title}</h1>
          <p className="mt-1 text-sm text-ink-muted">{payment.property.title}</p>
          <p className="mt-4 text-3xl font-semibold">{formatCurrency(payment.amount.toString(), payment.currency)}</p>
          <p className="mt-4 text-xs text-ink-subtle">Reference: {payment.providerRef ?? payment.id}</p>
          {waiting && <p className="mt-2 text-xs text-ink-muted">This page updates automatically once Paystack confirms.</p>}
          <div className="mt-6 flex justify-center gap-2">
            <LinkButton href="/portfolio">Go to portfolio</LinkButton>
            <LinkButton href="/dashboard" variant="outline">Dashboard</LinkButton>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
}
