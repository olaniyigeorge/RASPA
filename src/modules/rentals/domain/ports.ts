import type { Sublisting } from "./sublisting";

export interface SublistingRepository {
  create(i: {
    propertyId: string;
    tenantId: string;
    commissionAmount: number;
    requiresCriticalReview: boolean;
  }): Promise<Sublisting>;
  findById(id: string): Promise<Sublisting | null>;
  save(s: Sublisting, extra?: { platformApprovedById?: string }): Promise<void>;
  hasOpenForTenant(propertyId: string, tenantId: string): Promise<boolean>;
}

export interface TenancyRepository {
  hasActive(propertyId: string, tenantId: string): Promise<boolean>;
  /** Moves occupancy from the outgoing tenant to the incoming renter. */
  transfer(propertyId: string, fromTenantId: string, toTenantId: string): Promise<void>;
  start(propertyId: string, tenantId: string): Promise<void>;
}

export interface ListingFacts {
  id: string;
  listerId: string;
  listerCapacity: "OWNER" | "TENANT";
  ownerUserId: string | null;
  cofoVerified: boolean;
  status: string;
  purpose: string;
  price: number;
}

export interface ListingGateway {
  get(id: string): Promise<ListingFacts>;
}

export interface PaymentsGateway {
  initiate(
    actor: { id: string; email: string },
    i: { propertyId: string; planType: "RENT"; amount: number; sublistingId: string }
  ): Promise<{ paymentId: string; authorizationUrl: string }>;
  createCommissionPayout(i: { recipientId: string; amount: number; sublistingId: string }): Promise<void>;
}
