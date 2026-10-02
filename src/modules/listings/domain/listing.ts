import { DomainError, ForbiddenError } from "../../../shared/kernel/errors";

// DRAFT      -> only the lister can see it
// UNVERIFIED -> public, shown with an "unverified" badge, proof of ownership pending
// VERIFIED   -> ownership proven (see the verification context)
export type ListingStatus =
  | "DRAFT"
  | "UNVERIFIED"
  | "VERIFIED"
  | "UNDER_OFFER"
  | "RENTED"
  | "SOLD"
  | "SUSPENDED"
  | "ARCHIVED";

export type ListerCapacity = "OWNER" | "TENANT";
export type PropertyType = "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "LANDED";
export type ListingPurpose = "SALE" | "RENT" | "INVEST" | "INSTALLMENT";

export interface OwnerDetails {
  name: string;
  phone?: string | null;
  email?: string | null;
}

export interface Listing {
  id: string;
  slug: string;
  title: string;
  status: ListingStatus;
  type: PropertyType;
  purpose: ListingPurpose;
  price: number;
  address: string;
  addressKey: string;
  city: string;
  state: string;
  listerId: string;
  listerCapacity: ListerCapacity;
  ownerUserId: string | null;
  owner: OwnerDetails | null;
  cofoVerified: boolean;
}

/** Statuses a seeker can see. Drafts and suspended listings are hidden. */
export const PUBLIC_STATUSES: ListingStatus[] = ["UNVERIFIED", "VERIFIED"];
export const isPubliclyVisible = (s: ListingStatus) => PUBLIC_STATUSES.includes(s);

/** Agents are not a lister role: only an owner, or an occupant naming the owner, may list. */
export function assertValidLister(capacity: ListerCapacity, owner: OwnerDetails | null) {
  if (capacity === "TENANT" && !owner?.name?.trim()) {
    throw new DomainError(
      "Tenants listing a property must provide the owner's details",
      "OWNER_DETAILS_REQUIRED",
      400
    );
  }
}

export function normalizeAddress(address: string, city: string, state: string): string {
  return [address, city, state]
    .join(" ")
    .toLowerCase()
    .replace(/\b(street|st|road|rd|avenue|ave|close|crescent|cres)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function slugify(title: string, suffix: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${base}-${suffix}`;
}

export function canManage(listing: Pick<Listing, "listerId">, user: { id: string; role: string }) {
  return listing.listerId === user.id || user.role === "ADMIN";
}

export function assertCanManage(listing: Pick<Listing, "listerId">, user: { id: string; role: string }) {
  if (!canManage(listing, user)) throw new ForbiddenError("Only the lister can modify this listing");
}

const TRANSITIONS: Record<ListingStatus, ListingStatus[]> = {
  DRAFT: ["UNVERIFIED", "ARCHIVED"],
  UNVERIFIED: ["VERIFIED", "SUSPENDED", "ARCHIVED", "UNDER_OFFER", "RENTED", "SOLD"],
  VERIFIED: ["UNVERIFIED", "SUSPENDED", "ARCHIVED", "UNDER_OFFER", "RENTED", "SOLD"],
  UNDER_OFFER: ["UNVERIFIED", "VERIFIED", "RENTED", "SOLD", "SUSPENDED"],
  RENTED: ["UNVERIFIED", "VERIFIED", "ARCHIVED"],
  SOLD: ["ARCHIVED"],
  SUSPENDED: ["UNVERIFIED", "ARCHIVED"],
  ARCHIVED: [],
};

export function transition(listing: Listing, to: ListingStatus): Listing {
  if (!TRANSITIONS[listing.status].includes(to)) {
    throw new DomainError(
      `Listing cannot move from ${listing.status} to ${to}`,
      "INVALID_LISTING_TRANSITION"
    );
  }
  return { ...listing, status: to };
}

/** Lister submits a draft: it goes live as UNVERIFIED until ownership is proven. */
export const submit = (l: Listing) => transition(l, "UNVERIFIED");

export function markVerified(l: Listing, opts: { cofoVerified: boolean; ownerUserId?: string | null }): Listing {
  return {
    ...transition(l, "VERIFIED"),
    cofoVerified: opts.cofoVerified,
    ownerUserId: opts.ownerUserId ?? l.ownerUserId,
  };
}

export const revokeVerification = (l: Listing): Listing => ({
  ...transition(l, "UNVERIFIED"),
  cofoVerified: false,
});

export const suspend = (l: Listing) => transition(l, "SUSPENDED");
