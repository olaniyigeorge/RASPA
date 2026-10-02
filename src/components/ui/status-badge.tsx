import { BadgeCheck, CircleDashed, Clock3, ShieldAlert } from "lucide-react";
import { Badge, type Tone } from "./badge";

// One place that decides how every domain status looks.
const MAP: Record<string, { label: string; tone: Tone }> = {
  // listings
  DRAFT: { label: "Draft", tone: "neutral" },
  UNVERIFIED: { label: "Unverified", tone: "warning" },
  VERIFIED: { label: "Verified", tone: "success" },
  UNDER_OFFER: { label: "Under offer", tone: "info" },
  RENTED: { label: "Rented", tone: "neutral" },
  SOLD: { label: "Sold", tone: "neutral" },
  SUSPENDED: { label: "Suspended", tone: "danger" },
  ARCHIVED: { label: "Archived", tone: "neutral" },
  // claims
  SUBMITTED: { label: "Submitted", tone: "info" },
  UNDER_REVIEW: { label: "In review", tone: "info" },
  DISPUTED: { label: "Disputed", tone: "danger" },
  APPROVED: { label: "Approved", tone: "success" },
  REJECTED: { label: "Rejected", tone: "danger" },
  // capture tasks / contractors
  AWAITING_PAYMENT: { label: "Awaiting payment", tone: "warning" },
  OPEN: { label: "Open", tone: "brand" },
  CLAIMED: { label: "In progress", tone: "info" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
  APPLIED: { label: "Applied", tone: "info" },
  ACTIVE: { label: "Active", tone: "success" },
  // payments / payouts / rentals
  PENDING: { label: "Pending", tone: "warning" },
  PROCESSING: { label: "Processing", tone: "info" },
  SUCCESSFUL: { label: "Successful", tone: "success" },
  PAID: { label: "Paid", tone: "success" },
  FAILED: { label: "Failed", tone: "danger" },
  REFUNDED: { label: "Refunded", tone: "neutral" },
  LISTED: { label: "Listed", tone: "brand" },
  RENTER_PAID: { label: "Renter paid", tone: "info" },
  COMMISSION_PAID: { label: "Commission paid", tone: "success" },
  // tickets / subscriptions
  IN_PROGRESS: { label: "In progress", tone: "info" },
  RESOLVED: { label: "Resolved", tone: "success" },
  PAST_DUE: { label: "Past due", tone: "danger" },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const s = MAP[status] ?? { label: status.replaceAll("_", " ").toLowerCase(), tone: "neutral" as Tone };
  return <Badge tone={s.tone} className={className}>{s.label}</Badge>;
}

/** Listing verification gets an icon: it is the platform's central trust signal. */
export function VerificationBadge({ status, className }: { status: string; className?: string }) {
  if (status === "VERIFIED") return <Badge tone="success" className={className} icon={<BadgeCheck className="size-3.5" />}>Verified</Badge>;
  if (status === "UNVERIFIED") return <Badge tone="warning" className={className} icon={<Clock3 className="size-3.5" />}>Unverified</Badge>;
  if (status === "SUSPENDED") return <Badge tone="danger" className={className} icon={<ShieldAlert className="size-3.5" />}>Suspended</Badge>;
  return <Badge tone="neutral" className={className} icon={<CircleDashed className="size-3.5" />}>Draft</Badge>;
}
