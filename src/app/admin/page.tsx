import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { ActionButton } from "@/components/shared/action-button";
import { Alert, Badge, Card, CardBody, CardHeader, Container, EmptyState, PageHeader, Stat, StatusBadge } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { getCurrentUser } from "@/modules/identity";
import { listContractorApplications, listTasksAwaitingReview, signedEvidenceUrl } from "@/modules/media";
import { listSublistingsAwaitingApproval } from "@/modules/rentals";
import { listClaimsForReview } from "@/modules/verification";
import { prisma } from "@/shared/infrastructure/prisma";

export const metadata: Metadata = { title: "Admin console" };

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") notFound();

  const [claims, tasks, applications, sublistings, failedPayouts] = await Promise.all([
    listClaimsForReview(),
    listTasksAwaitingReview(),
    listContractorApplications(),
    listSublistingsAwaitingApproval(),
    prisma.payout.count({ where: { status: "FAILED" } }),
  ]);

  // claims in one dispute are shown together so staff can pick between the listers
  const disputes = new Map<string, typeof claims>();
  for (const c of claims) if (c.disputeId) disputes.set(c.disputeId, [...(disputes.get(c.disputeId) ?? []), c]);
  const undisputed = claims.filter((c) => !c.disputeId);

  const evidenceLinks = (c: (typeof claims)[number]) => (
    <div className="flex flex-wrap gap-2">
      {c.evidence.map((e) => (
        <a key={e.id} href={signedEvidenceUrl(e.publicId, e.resourceType)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-canvas px-3 py-1 text-xs font-medium ring-1 ring-inset ring-line hover:ring-brand-300">
          {e.type.replaceAll("_", " ").toLowerCase()} <ExternalLink className="size-3" />
        </a>
      ))}
    </div>
  );

  return (
    <Container size="lg" className="space-y-8 py-10">
      <PageHeader title="Admin console" description="Verification, disputes, contractor work and rental takeovers." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Claims to review" value={claims.length} />
        <Stat label="Disputes" value={disputes.size} />
        <Stat label="Tasks to approve" value={tasks.length} />
        <Stat label="Failed payouts" value={failedPayouts} hint={failedPayouts ? "Check Paystack balance / bank details" : undefined} />
      </div>

      {disputes.size > 0 && (
        <Card>
          <CardHeader title="Duplicate claims" description="Several listers claimed the same address. Pick who is the rightful lister; the others are rejected and suspended." />
          <CardBody className="space-y-5">
            {[...disputes.entries()].map(([disputeId, group]) => (
              <div key={disputeId} className="rounded-card border border-danger-600/20 bg-danger-50/40 p-4">
                <p className="mb-3 flex items-center gap-2 text-sm font-medium text-danger-700"><AlertTriangle className="size-4" /> {group[0].property.address}, {group[0].property.city}</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {group.map((c) => (
                    <div key={c.id} className="space-y-3 rounded-control border border-line bg-surface p-4">
                      <div className="flex items-center justify-between"><p className="font-medium">{c.claimant.name ?? c.claimant.email}</p><Badge tone="brand">{c.capacity.toLowerCase()}</Badge></div>
                      {evidenceLinks(c)}
                      <ActionButton url={`/api/admin/disputes/${disputeId}`} body={{ winningClaimId: c.id }} confirm="Choose this lister as the rightful claimant? The other claims will be rejected." size="sm">Choose this lister</ActionButton>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader title="Ownership claims" />
        {undisputed.length === 0 ? (
          <CardBody><EmptyState title="Queue is clear" /></CardBody>
        ) : (
          <div className="divide-y divide-line">
            {undisputed.map((c) => {
              const noCofo = !c.evidence.some((e) => e.type === "COFO");
              return (
                <div key={c.id} className="space-y-3 px-6 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Link href={`/property/${c.property.id}`} className="font-semibold hover:text-brand-700">{c.property.title}</Link>
                      <p className="text-sm text-ink-muted">{c.claimant.name ?? c.claimant.email} · {c.capacity.toLowerCase()}</p>
                    </div>
                    <div className="flex items-center gap-2">{noCofo && <Badge tone="warning">No CofO: critical review</Badge>}<StatusBadge status={c.status} /></div>
                  </div>
                  {evidenceLinks(c)}
                  <div className="flex flex-wrap gap-2">
                    {c.status === "SUBMITTED" && <ActionButton url={`/api/admin/claims/${c.id}`} body={{ action: "start_review" }} variant="outline" size="sm">Start review</ActionButton>}
                    {c.status === "UNDER_REVIEW" && (
                      <ActionButton url={`/api/admin/claims/${c.id}`} body={{ action: "approve", criticalReview: noCofo }} size="sm"
                        confirm={noCofo ? "There is no CofO on this claim. Confirm you have critically reviewed the other evidence?" : undefined}>
                        Approve{noCofo ? " (critical review)" : ""}
                      </ActionButton>
                    )}
                    <ActionButton url={`/api/admin/claims/${c.id}`} body={{ action: "reject" }} promptNote="Reason for rejection (shown to the lister)" variant="danger" size="sm">Reject</ActionButton>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card>
        <CardHeader title="Rental takeovers awaiting approval" description="The renter has paid. Commission is released once the owner and you have both approved." />
        {sublistings.length === 0 ? (
          <CardBody><EmptyState title="Nothing waiting" /></CardBody>
        ) : (
          <div className="divide-y divide-line">
            {sublistings.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div>
                  <p className="font-medium">{s.property.title}</p>
                  <p className="text-sm text-ink-muted">Commission {formatCurrency(s.commissionAmount.toString())} · owner {s.ownerApprovedAt ? "approved" : "pending"}</p>
                  {s.requiresCriticalReview && <Badge tone="warning" className="mt-1">Tenant-listed, no verified CofO</Badge>}
                </div>
                {s.platformApprovedAt ? <StatusBadge status="APPROVED" /> : (
                  <ActionButton url={`/api/admin/sublistings/${s.id}`} body={{ criticalReviewPassed: s.requiresCriticalReview }} size="sm"
                    confirm={s.requiresCriticalReview ? "This tenant listed the property without a verified CofO. Confirm a critical review passed?" : undefined}>
                    Approve
                  </ActionButton>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <CardHeader title="Contractor work to approve" description="Approving releases the contractor's payout." />
        {tasks.length === 0 ? (
          <CardBody><EmptyState title="No submitted work" /></CardBody>
        ) : (
          <div className="divide-y divide-line">
            {tasks.map((t) => (
              <div key={t.id} className="space-y-3 px-6 py-4">
                <div className="flex items-center justify-between"><p className="font-medium">{t.kind.replaceAll("_", " ").toLowerCase()} · {t.property.title}</p><p className="font-semibold">{formatCurrency(t.payoutAmount.toString())}</p></div>
                <div className="flex flex-wrap gap-2">{t.media.map((m) => <a key={m.id} href={m.url} target="_blank" rel="noreferrer" className="rounded-full bg-canvas px-3 py-1 text-xs ring-1 ring-inset ring-line hover:ring-brand-300">{m.kind.toLowerCase()} ↗</a>)}</div>
                <div className="flex gap-2">
                  <ActionButton url={`/api/admin/capture-tasks/${t.id}`} body={{ action: "approve" }} size="sm">Approve & pay</ActionButton>
                  <ActionButton url={`/api/admin/capture-tasks/${t.id}`} body={{ action: "reject" }} promptNote="What needs fixing?" variant="outline" size="sm">Send back</ActionButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <CardHeader title="Contractor applications" />
        {applications.length === 0 ? (
          <CardBody><EmptyState title="No pending applications" /></CardBody>
        ) : (
          <div className="divide-y divide-line">
            {applications.map((c) => (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div>
                  <p className="font-medium">{c.user.name ?? c.user.email}</p>
                  <p className="text-sm text-ink-muted">{c.skills.map((s) => s.replaceAll("_", " ").toLowerCase()).join(", ")} · {c.city ?? "-"}</p>
                </div>
                <div className="flex gap-2">
                  <ActionButton url={`/api/admin/contractors/${c.id}`} body={{ status: "ACTIVE" }} size="sm">Activate</ActionButton>
                  <ActionButton url={`/api/admin/contractors/${c.id}`} body={{ status: "SUSPENDED" }} variant="outline" size="sm">Decline</ActionButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Alert tone="info">Property management plans are configured in the database (<code>management_plans</code>). Link each to a Paystack plan code for recurring billing.</Alert>
    </Container>
  );
}
