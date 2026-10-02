import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { BadgeCheck, Check, ExternalLink, Handshake, Settings2 } from "lucide-react";
import { ActionButton } from "@/components/shared/action-button";
import { MediaPanel } from "@/components/listing-manager/media-panel";
import { VerificationPanel } from "@/components/listing-manager/verification-panel";
import { Alert, Card, CardBody, CardHeader, Container, LinkButton, PageHeader, StatusBadge, VerificationBadge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/modules/identity";
import { prisma } from "@/shared/infrastructure/prisma";

export const metadata: Metadata = { title: "Manage listing" };

const STEPS = [
  { key: "DRAFT", label: "Created" },
  { key: "UNVERIFIED", label: "Proof submitted" },
  { key: "VERIFIED", label: "Verified" },
];

export default async function ListingManagerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/accounts?callbackUrl=/dashboard/listings/${id}`);

  const listing = await prisma.property.findUnique({
    where: { id },
    include: {
      media: { select: { kind: true } },
      claims: { orderBy: { createdAt: "desc" }, take: 1 },
      captureTasks: { orderBy: { createdAt: "desc" }, take: 5 },
      sublistings: { where: { tenantId: user.id }, orderBy: { createdAt: "desc" }, take: 3 },
    },
  });
  if (!listing || (listing.listerId !== user.id && user.role !== "ADMIN")) notFound();

  const claim = listing.claims[0];
  const counts = { PHOTO: 0, VIDEO: 0, SCAN_3D: 0 };
  for (const m of listing.media) counts[m.kind as keyof typeof counts]++;

  const stepIndex = listing.status === "DRAFT" ? 0 : listing.status === "VERIFIED" ? 2 : 1;
  const canSubmitProof = !claim || claim.status === "REJECTED";
  const canRelist = listing.purpose === "RENT" && listing.listerCapacity === "TENANT" && (listing.status === "UNVERIFIED" || listing.status === "VERIFIED");

  return (
    <Container size="lg" className="space-y-6 py-10">
      <PageHeader
        title={listing.title}
        description={`${listing.address}, ${listing.city}`}
        actions={
          <>
            <LinkButton href={`/property/${listing.slug}`} variant="outline" size="sm"><ExternalLink className="size-4" /> View public page</LinkButton>
            <LinkButton href={`/dashboard/listings/${listing.id}/management`} variant="secondary" size="sm"><Settings2 className="size-4" /> Management</LinkButton>
          </>
        }
      />

      <Card>
        <CardBody>
          <ol className="flex items-center">
            {STEPS.map((s, i) => (
              <li key={s.key} className={cn("flex items-center", i < STEPS.length - 1 && "flex-1")}>
                <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold", i <= stepIndex ? "bg-brand-600 text-white" : "bg-line text-ink-subtle")}>
                  {i < stepIndex ? <Check className="size-4" /> : i + 1}
                </span>
                <span className={cn("ml-2 hidden text-sm font-medium sm:block", i <= stepIndex ? "text-ink" : "text-ink-subtle")}>{s.label}</span>
                {i < STEPS.length - 1 && <span className={cn("mx-3 h-0.5 flex-1 rounded", i < stepIndex ? "bg-brand-600" : "bg-line")} />}
              </li>
            ))}
          </ol>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Proof of ownership" description="Verification is what earns the green badge and priority in search." action={<VerificationBadge status={listing.status} />} />
        <CardBody className="space-y-4">
          {listing.status === "VERIFIED" && <Alert tone="success" title="This listing is verified"><span className="flex items-center gap-1.5"><BadgeCheck className="size-4" /> {listing.cofoVerified ? "Backed by a verified CofO." : "Approved after critical review (no CofO on file)."}</span></Alert>}
          {claim && listing.status !== "VERIFIED" && (
            <div className="flex items-center gap-3 text-sm">Latest submission: <StatusBadge status={claim.status} /></div>
          )}
          {claim?.status === "DISPUTED" && <Alert tone="danger" title="Another lister has claimed this address">Our team is comparing the documents and will contact you. You don&apos;t need to do anything.</Alert>}
          {claim?.status === "REJECTED" && <Alert tone="danger" title="Submission rejected">{claim.reviewNote ?? "Please review the feedback and submit again."}</Alert>}
          {claim && ["SUBMITTED", "UNDER_REVIEW"].includes(claim.status) && <Alert tone="info">Your documents are with our review team. We&apos;ll update this page as soon as there&apos;s a decision.</Alert>}
          {canSubmitProof && listing.status !== "VERIFIED" && <VerificationPanel propertyId={listing.id} capacity={listing.listerCapacity} />}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Photos, video & 3D" description="Great media means fewer wasted viewings. Follow the specs shown on each card." />
        <CardBody className="space-y-4">
          <MediaPanel propertyId={listing.id} counts={counts} />
          {listing.captureTasks.length > 0 && (
            <div className="space-y-2 border-t border-line pt-4">
              <p className="text-sm font-medium">Professional capture requests</p>
              {listing.captureTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm">
                  <span>{t.kind.replaceAll("_", " ").toLowerCase()}</span><StatusBadge status={t.status} />
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {canRelist && (
        <Card>
          <CardHeader title="Moving out?" description="Re-list your rental so the next tenant can take over directly. You earn a commission once they pay and we and the owner approve." />
          <CardBody className="space-y-3">
            {listing.sublistings.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><Handshake className="size-4 text-brand-600" /> Commission {Number(s.commissionAmount).toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 })}</span>
                <StatusBadge status={s.status} />
              </div>
            ))}
            {!listing.sublistings.some((s) => ["LISTED", "RENTER_PAID", "APPROVED"].includes(s.status)) && (
              <ActionButton url="/api/sublistings" body={{ propertyId: listing.id }}>Re-list for takeover</ActionButton>
            )}
            <p className="text-xs text-ink-subtle">Need to set up where we pay you? <Link href="/accounts/profile" className="text-brand-700 hover:underline">Add your payout account</Link>.</p>
          </CardBody>
        </Card>
      )}
    </Container>
  );
}
