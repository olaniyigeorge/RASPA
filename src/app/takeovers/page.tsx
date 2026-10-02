import type { Metadata } from "next";
import Link from "next/link";
import { Handshake, MapPin } from "lucide-react";
import { TakeoverCard } from "@/components/rentals/takeover-card";
import { Card, CardBody, Container, EmptyState, PageHeader, VerificationBadge } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { listOpenSublistings } from "@/modules/rentals";

export const metadata: Metadata = { title: "Rental takeovers" };

export default async function TakeoversPage() {
  const takeovers = await listOpenSublistings();
  return (
    <Container size="lg" className="py-10">
      <PageHeader
        eyebrow="Tenant to tenant"
        title="Rental takeovers"
        description="Current tenants handing over their tenancy directly, with no agent involved. Pay the rent and, once the owner and RASPA approve, the place is yours."
      />
      <div className="mt-8 space-y-4">
        {takeovers.length === 0 ? (
          <EmptyState icon={<Handshake className="size-5" />} title="No takeovers available right now" description="Check back soon, or browse all rentals." />
        ) : (
          takeovers.map((t) => (
            <Card key={t.id}>
              <CardBody className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link href={`/property/${t.propertyId}`} className="text-lg font-semibold hover:text-brand-700">{t.property.title}</Link>
                    <p className="mt-1 flex items-center gap-1 text-sm text-ink-muted"><MapPin className="size-3.5" /> {t.property.city}</p>
                  </div>
                  <VerificationBadge status={t.property.status} />
                </div>
                <TakeoverCard takeover={{ id: t.id, tenantName: t.tenant.name, rent: t.property.price.toString() }} />
                <p className="text-xs text-ink-subtle">Rent: {formatCurrency(t.property.price.toString())} per year</p>
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </Container>
  );
}
