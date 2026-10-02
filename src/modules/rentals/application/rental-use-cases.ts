import { DomainError, ForbiddenError, NotFoundError } from "../../../shared/kernel/errors";
import * as Sub from "../domain/sublisting";
import type { ListingGateway, PaymentsGateway, SublistingRepository, TenancyRepository } from "../domain/ports";

interface Actor {
  id: string;
  role: string;
  email?: string;
}

interface Deps {
  subs: SublistingRepository;
  tenancies: TenancyRepository;
  listings: ListingGateway;
  payments: PaymentsGateway;
}

export const makeRentalUseCases = (d: Deps) => {
  const load = async (id: string) => {
    const s = await d.subs.findById(id);
    if (!s) throw new NotFoundError("Re-listing");
    return s;
  };

  /** If everything required is in, release the commission to the tenant. */
  async function releaseIfReady(s: Sub.Sublisting) {
    if (!Sub.isCommissionReleasable(s)) return s;
    const released = Sub.release(s);
    await d.subs.save(released);
    if (released.incomingRenterId) {
      await d.tenancies.transfer(released.propertyId, released.tenantId, released.incomingRenterId);
    }
    await d.payments.createCommissionPayout({
      recipientId: released.tenantId,
      amount: released.commissionAmount,
      sublistingId: released.id,
    });
    return released;
  }

  return {
    /** A tenant "retweets" the place they occupy so the next renter can take over. */
    async relist(actor: Actor, propertyId: string) {
      const listing = await d.listings.get(propertyId);
      const occupies = await d.tenancies.hasActive(propertyId, actor.id);
      // a tenant who listed the property is its occupant even before any tenancy row exists
      const listedAsOccupant = listing.listerId === actor.id && listing.listerCapacity === "TENANT";
      if (!occupies && !listedAsOccupant) throw new ForbiddenError("Only the current tenant can re-list a rental");
      if (listing.purpose !== "RENT") throw new DomainError("Only rentals can be re-listed", "NOT_A_RENTAL", 422);
      if (listing.status !== "UNVERIFIED" && listing.status !== "VERIFIED") {
        throw new DomainError("Listing is not live", "LISTING_NOT_LIVE", 422);
      }
      if (await d.subs.hasOpenForTenant(propertyId, actor.id)) {
        throw new DomainError("You already have an open re-listing for this property", "ALREADY_RELISTED", 409);
      }
      if (listedAsOccupant && !occupies) await d.tenancies.start(propertyId, actor.id);

      return d.subs.create({
        propertyId,
        tenantId: actor.id,
        commissionAmount: Sub.commissionFor(listing.price),
        requiresCriticalReview: Sub.needsCriticalReview({
          tenantId: actor.id,
          listerId: listing.listerId,
          cofoVerified: listing.cofoVerified,
        }),
      });
    },

    /** The incoming renter pays; the amount is the listing's rent, decided server-side. */
    async startRenterPayment(actor: Required<Actor>, sublistingId: string) {
      const s = await load(sublistingId);
      if (s.status !== "LISTED") throw new DomainError("This re-listing is no longer available", "NOT_AVAILABLE", 409);
      if (s.tenantId === actor.id) throw new DomainError("You cannot rent your own re-listing", "SELF_RENT", 422);
      const listing = await d.listings.get(s.propertyId);
      return d.payments.initiate(actor, {
        propertyId: s.propertyId,
        planType: "RENT",
        amount: listing.price,
        sublistingId: s.id,
      });
    },

    /** Payment settled (called from the payments settlement hook). */
    async recordRenterPayment(sublistingId: string, renterId: string, paymentId: string) {
      const s = Sub.recordRenterPayment(await load(sublistingId), renterId, paymentId);
      await d.subs.save(s);
      await releaseIfReady(s);
    },

    async approveAsOwner(actor: Actor, sublistingId: string) {
      const s = await load(sublistingId);
      const listing = await d.listings.get(s.propertyId);
      if (listing.ownerUserId !== actor.id) throw new ForbiddenError("Only the property owner can approve this");
      const next = Sub.approveByOwner(s);
      await d.subs.save(next);
      return releaseIfReady(next);
    },

    async approveAsPlatform(actor: Actor, sublistingId: string, opts: { criticalReviewPassed: boolean }) {
      if (actor.role !== "ADMIN") throw new ForbiddenError("Staff only");
      const next = Sub.approveByPlatform(await load(sublistingId), opts);
      await d.subs.save(next, { platformApprovedById: actor.id });
      return releaseIfReady(next);
    },

    async cancel(actor: Actor, sublistingId: string) {
      const s = await load(sublistingId);
      if (s.tenantId !== actor.id && actor.role !== "ADMIN") throw new ForbiddenError();
      await d.subs.save(Sub.cancel(s));
    },

    /** Payout settled (called from the payments settlement hook). */
    async markCommissionPaid(sublistingId: string) {
      await d.subs.save(Sub.markCommissionPaid(await load(sublistingId)));
    },

    /** Direct (non-sublisting) rent paid: the renter becomes the tenant. */
    startTenancy: (propertyId: string, tenantId: string) => d.tenancies.start(propertyId, tenantId),

    get: load,
  };
};
