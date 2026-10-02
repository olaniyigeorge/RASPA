import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Handshake, Heart, Home, Plus, ShieldCheck, Wallet } from "lucide-react";
import { Card, CardHeader, Container, EmptyState, LinkButton, PageHeader, Stat, StatusBadge, Table, VerificationBadge } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { getCurrentUser } from "@/modules/identity";
import { prisma } from "@/shared/infrastructure/prisma";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null; // proxy redirects signed-out visitors

  const [listings, favoriteCount, paymentCount, sublistings, payouts] = await Promise.all([
    prisma.property.findMany({
      where: { listerId: user.id },
      orderBy: { createdAt: "desc" },
      include: { claims: { orderBy: { createdAt: "desc" }, take: 1, select: { status: true } } },
    }),
    prisma.favorite.count({ where: { userId: user.id } }),
    prisma.payment.count({ where: { userId: user.id } }),
    prisma.sublisting.findMany({ where: { tenantId: user.id }, orderBy: { createdAt: "desc" }, take: 5, include: { property: { select: { title: true } } } }),
    prisma.payout.findMany({ where: { recipientId: user.id }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const needsAttention = listings.filter((l) => l.status === "DRAFT" || (l.status === "UNVERIFIED" && (!l.claims[0] || l.claims[0].status === "REJECTED"))).length;

  return (
    <Container className="space-y-8 py-10">
      <PageHeader
        title={`Welcome back${user.name ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="Your listings, rentals and earnings in one place."
        actions={
          <>
            {user.role === "CONTRACTOR" && <LinkButton href="/contractor" variant="outline"><Camera className="size-4" /> Contractor tasks</LinkButton>}
            {user.role === "ADMIN" && <LinkButton href="/admin" variant="outline"><ShieldCheck className="size-4" /> Admin console</LinkButton>}
            <LinkButton href="/get-started"><Plus className="size-4" /> List a property</LinkButton>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Your listings" value={listings.length} icon={<Home className="size-5" />} hint={needsAttention ? `${needsAttention} need attention` : undefined} />
        <Stat label="Saved" value={favoriteCount} icon={<Heart className="size-5" />} />
        <Stat label="Payments made" value={paymentCount} icon={<Wallet className="size-5" />} />
        <Stat label="Re-listings" value={sublistings.length} icon={<Handshake className="size-5" />} />
      </div>

      <Card>
        <CardHeader title="Your listings" description="Complete verification to earn the green badge." />
        {listings.length === 0 ? (
          <div className="p-6"><EmptyState icon={<Home className="size-5" />} title="You haven't listed anything yet" description="Owners and current tenants can list directly, with no agent." action={<LinkButton href="/get-started">List a property</LinkButton>} /></div>
        ) : (
          <Table>
            <thead><tr><th>Property</th><th>Status</th><th>Latest proof</th><th /></tr></thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id}>
                  <td><p className="font-medium">{l.title}</p><p className="text-xs text-ink-muted">{l.city} · {formatCurrency(l.price.toString(), l.currency)}</p></td>
                  <td><VerificationBadge status={l.status} /></td>
                  <td>{l.claims[0] ? <StatusBadge status={l.claims[0].status} /> : <span className="text-ink-subtle">Not submitted</span>}</td>
                  <td className="text-right"><Link href={`/dashboard/listings/${l.id}`} className="text-sm font-medium text-brand-700 hover:underline">Manage</Link></td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {(sublistings.length > 0 || payouts.length > 0) && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="Re-listed rentals" />
            <Table>
              <tbody>
                {sublistings.map((s) => (
                  <tr key={s.id}><td className="font-medium">{s.property.title}</td><td className="text-right"><StatusBadge status={s.status} /></td></tr>
                ))}
                {sublistings.length === 0 && <tr><td className="text-ink-subtle">None</td></tr>}
              </tbody>
            </Table>
          </Card>
          <Card>
            <CardHeader title="Earnings" description="Commissions and contractor payouts" action={<Link href="/accounts/profile" className="text-sm font-medium text-brand-700 hover:underline">Payout account</Link>} />
            <Table>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id}><td>{p.kind === "TENANT_COMMISSION" ? "Commission" : "Capture task"}</td><td className="font-medium">{formatCurrency(p.amount.toString())}</td><td className="text-right"><StatusBadge status={p.status} /></td></tr>
                ))}
                {payouts.length === 0 && <tr><td className="text-ink-subtle">No payouts yet</td></tr>}
              </tbody>
            </Table>
          </Card>
        </div>
      )}
    </Container>
  );
}
