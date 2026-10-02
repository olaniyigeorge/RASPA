import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Briefcase } from "lucide-react";
import { Badge, Card, CardBody, Container, EmptyState, LinkButton, PageHeader } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { getCurrentUser } from "@/modules/identity";
import { prisma } from "@/shared/infrastructure/prisma";

export const metadata: Metadata = { title: "Your portfolio" };

const PLAN_LABEL: Record<string, string> = { BUY_NOW: "Purchase", INSTALLMENTS: "Installments", INVEST: "Investment", RENT: "Rent" };

export default async function PortfolioPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/accounts");

  const items = await prisma.portfolioItem.findMany({
    where: { userId: user.id },
    include: { property: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <Container size="lg" className="space-y-6 py-10">
      <PageHeader title="Your portfolio" description="Properties you're buying, renting or investing in." />
      {items.length === 0 ? (
        <EmptyState icon={<Briefcase className="size-5" />} title="No active plans yet" description="When you pay for a property it appears here with your progress." action={<LinkButton href="/explore">Explore properties</LinkButton>} />
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const paid = item.totalPaid.toNumber();
            const due = item.totalDue.toNumber();
            const pct = due ? Math.min(100, Math.round((paid / due) * 100)) : 0;
            return (
              <Link key={item.id} href={`/property/${item.property.slug}`} className="block">
                <Card className="transition-colors hover:border-brand-300">
                  <CardBody>
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{item.property.title}</p>
                      <Badge tone="brand">{PLAN_LABEL[item.planType] ?? item.planType}</Badge>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-brand-50" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full rounded-full bg-brand-600" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-2 text-sm text-ink-muted">{formatCurrency(paid, item.property.currency)} of {formatCurrency(due, item.property.currency)} paid ({pct}%)</p>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </Container>
  );
}
