import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Camera } from "lucide-react";
import { Badge, Card, CardBody, CardHeader, Container, LinkButton, PageHeader } from "@/components/ui";
import { getCurrentUser } from "@/modules/identity";
import { prisma } from "@/shared/infrastructure/prisma";
import { PayoutForm } from "./payout-form";

export const metadata: Metadata = { title: "Profile & payouts" };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/accounts");

  const [account, contractor] = await Promise.all([
    prisma.payoutAccount.findUnique({ where: { userId: user.id } }),
    prisma.contractor.findUnique({ where: { userId: user.id } }),
  ]);

  return (
    <Container size="md" className="space-y-6 py-10">
      <PageHeader title="Profile & payouts" />

      <Card>
        <CardHeader title="Account" />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          {[["Name", user.name ?? "-"], ["Email", user.email], ["Phone", user.phone ?? "-"]].map(([k, v]) => (
            <div key={k}><p className="text-xs uppercase tracking-wide text-ink-subtle">{k}</p><p className="mt-1">{v}</p></div>
          ))}
          <div><p className="text-xs uppercase tracking-wide text-ink-subtle">Role</p><div className="mt-1"><Badge tone="brand">{user.role.toLowerCase()}</Badge></div></div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Payout account" description="Where we send your tenant commissions and contractor earnings." />
        <CardBody>
          {account && <p className="mb-4 text-sm text-ink-muted">Current account: <span className="font-medium text-ink">{account.accountName}</span> · •••• {account.accountNumber.slice(-4)}</p>}
          <PayoutForm />
        </CardBody>
      </Card>

      {user.role !== "ADMIN" && (
        <Card>
          <CardHeader title="Work with us" description="Videographers, drone operators and 3D scanners earn per property captured." />
          <CardBody>
            <LinkButton href="/contractor" variant="outline"><Camera className="size-4" /> {contractor ? "Contractor dashboard" : "Become a contractor"}</LinkButton>
          </CardBody>
        </Card>
      )}
    </Container>
  );
}
