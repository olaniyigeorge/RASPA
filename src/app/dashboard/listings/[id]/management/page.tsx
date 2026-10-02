import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, ClipboardList } from "lucide-react";
import Link from "next/link";
import { ActionButton } from "@/components/shared/action-button";
import { Card, CardBody, CardHeader, Container, EmptyState, PageHeader, Stat, StatusBadge, Table } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { getCurrentUser } from "@/modules/identity";
import { management } from "@/modules/management";
import { prisma } from "@/shared/infrastructure/prisma";
import { DomainError } from "@/shared/kernel/errors";
import { TicketForm } from "./ticket-form";

export const metadata: Metadata = { title: "Property management" };

const CATEGORY: Record<string, string> = { DISPUTE: "Dispute", BILL: "Bill", WASTE: "Waste", UTILITY: "Utility", MAINTENANCE: "Maintenance", OTHER: "Other" };

export default async function ManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/accounts?callbackUrl=/dashboard/listings/${id}/management`);

  const property = await prisma.property.findUnique({ where: { id }, select: { id: true, title: true } });
  if (!property) notFound();

  const dash = await management.dashboard(user, id).catch((e) => {
    if (e instanceof DomainError && e.status === 403) return null;
    throw e;
  });
  if (!dash) notFound();
  const plans = dash.entitled ? [] : await management.listPlans();

  return (
    <Container size="lg" className="space-y-6 py-10">
      <Link href={`/dashboard/listings/${id}`} className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-brand-700"><ChevronLeft className="size-4" /> {property.title}</Link>
      <PageHeader title="Property management" description="Bills, utilities, waste, disputes and maintenance for this property, handled in one place." />

      {!dash.entitled ? (
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.id}>
              <CardBody className="flex h-full flex-col">
                <p className="font-semibold">{p.name}</p>
                <p className="mt-2 text-3xl font-semibold">{formatCurrency(p.amount.toString())}<span className="text-sm font-normal text-ink-subtle"> /{p.interval === "MONTHLY" ? "mo" : p.interval === "QUARTERLY" ? "qtr" : "yr"}</span></p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-ink-muted">{p.features.map((f) => <li key={f}>✓ {f}</li>)}</ul>
                <ActionButton url={`/api/properties/${id}/management`} body={{ action: "subscribe", planCode: p.code }} className="mt-5 w-full">Subscribe</ActionButton>
              </CardBody>
            </Card>
          ))}
          {plans.length === 0 && <p className="text-sm text-ink-muted">No plans are available yet.</p>}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Subscription" value={<StatusBadge status={dash.subscription?.status ?? "ACTIVE"} />} hint={dash.subscription?.currentPeriodEnd ? `Renews ${dash.subscription.currentPeriodEnd.toLocaleDateString("en-NG")}` : undefined} />
            <Stat label="Open items" value={dash.tickets.filter((t) => t.status !== "RESOLVED").length} />
            <Stat label="Outstanding" value={formatCurrency(dash.outstanding)} hint="Bills and charges not yet resolved" />
          </div>

          <Card>
            <CardHeader title="Log something" description="Raise a bill, utility issue, waste pickup, dispute or maintenance job." />
            <CardBody><TicketForm propertyId={id} /></CardBody>
          </Card>

          <Card>
            <CardHeader title="Activity" />
            {dash.tickets.length === 0 ? (
              <CardBody><EmptyState icon={<ClipboardList className="size-5" />} title="Nothing logged yet" /></CardBody>
            ) : (
              <Table>
                <thead><tr><th>Item</th><th>Type</th><th>Amount</th><th>Status</th><th /></tr></thead>
                <tbody>
                  {dash.tickets.map((t) => (
                    <tr key={t.id}>
                      <td><p className="font-medium">{t.title}</p>{t.description && <p className="text-xs text-ink-muted">{t.description}</p>}</td>
                      <td>{CATEGORY[t.category]}</td>
                      <td>{t.amountDue ? formatCurrency(t.amountDue.toString()) : "-"}</td>
                      <td><StatusBadge status={t.status} /></td>
                      <td className="text-right">
                        {t.status !== "RESOLVED" && <ActionButton url={`/api/management/tickets/${t.id}`} method="PATCH" body={{ status: "RESOLVED" }} size="sm" variant="outline">Resolve</ActionButton>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </>
      )}
    </Container>
  );
}
