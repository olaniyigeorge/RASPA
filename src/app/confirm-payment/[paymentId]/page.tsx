import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

const STATUS_COPY: Record<string, { title: string; tone: string }> = {
  PENDING: { title: "Payment pending", tone: "text-amber-600" },
  PROCESSING: { title: "Processing your payment…", tone: "text-amber-600" },
  SUCCESSFUL: { title: "Payment successful 🎉", tone: "text-green-600" },
  FAILED: { title: "Payment failed", tone: "text-red-600" },
  REFUNDED: { title: "Payment refunded", tone: "text-gray-600" },
};

export default async function ConfirmPaymentPage({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) {
  const { paymentId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/accounts");

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { property: true },
  });

  if (!payment || payment.userId !== session.user.id) notFound();

  const status = STATUS_COPY[payment.status];

  return (
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      <h1 className={`text-2xl font-bold ${status.tone}`}>{status.title}</h1>
      <p className="mt-2 text-gray-500">{payment.property.title}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">
        {formatCurrency(payment.amount.toString(), payment.currency)}
      </p>

      <p className="mt-6 text-sm text-gray-400">
        {/* Wire this up to poll GET /api/payments/[id] or a webhook-driven
            revalidation once a real provider is connected. */}
        Reference: {payment.providerRef ?? payment.id}
      </p>

      <Link
        href="/portfolio"
        className="mt-8 inline-block rounded-full bg-purple-700 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-800"
      >
        Go to portfolio
      </Link>
    </div>
  );
}
