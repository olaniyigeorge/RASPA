import { NotFoundError } from "../../../shared/kernel/errors";
import {
  assertCanManage,
  assertValidLister,
  markVerified,
  normalizeAddress,
  revokeVerification,
  slugify,
  submit,
  suspend,
  type ListerCapacity,
  type ListingPurpose,
  type OwnerDetails,
  type PropertyType,
} from "../domain/listing";
import type { ListingRepository, NewListing } from "../domain/listing-repository";

interface Actor {
  id: string;
  role: string;
}

export interface CreateListingInput {
  title: string;
  slug?: string;
  description: string;
  type: PropertyType;
  purpose: ListingPurpose;
  price: number;
  currency?: string;
  address: string;
  city: string;
  state: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
  latitude?: number;
  longitude?: number;
  capacity: ListerCapacity;
  owner?: OwnerDetails;
}

export const makeListingUseCases = (repo: ListingRepository) => {
  const load = async (id: string) => {
    const listing = await repo.findById(id);
    if (!listing) throw new NotFoundError("Listing");
    return listing;
  };

  return {
    async create(actor: Actor, input: CreateListingInput) {
      const owner = input.capacity === "OWNER" ? null : (input.owner ?? null);
      assertValidLister(input.capacity, owner);

      const draft: NewListing = {
        slug: input.slug ?? slugify(input.title, Math.random().toString(36).slice(2, 8)),
        title: input.title,
        description: input.description,
        type: input.type,
        purpose: input.purpose,
        price: input.price,
        currency: input.currency ?? "NGN",
        address: input.address,
        addressKey: normalizeAddress(input.address, input.city, input.state),
        city: input.city,
        state: input.state,
        bedrooms: input.bedrooms,
        bathrooms: input.bathrooms,
        areaSqm: input.areaSqm,
        latitude: input.latitude,
        longitude: input.longitude,
        listerId: actor.id,
        listerCapacity: input.capacity,
        ownerUserId: input.capacity === "OWNER" ? actor.id : null,
        owner,
      };
      return repo.create(draft);
    },

    async update(actor: Actor, id: string, patch: Partial<Omit<CreateListingInput, "capacity" | "owner">>) {
      assertCanManage(await load(id), actor);
      const { slug: _ignored, ...rest } = patch;
      void _ignored; // slugs are stable once issued
      await repo.update(id, rest);
    },

    async remove(actor: Actor, id: string) {
      assertCanManage(await load(id), actor);
      await repo.delete(id);
    },

    /** DRAFT -> UNVERIFIED. The verification context calls this when a claim is submitted. */
    async submitForVerification(actor: Actor, id: string) {
      const listing = await load(id);
      assertCanManage(listing, actor);
      if (listing.status === "DRAFT") await repo.save(submit(listing));
    },

    async markVerified(id: string, opts: { cofoVerified: boolean; ownerUserId?: string | null }) {
      await repo.save(markVerified(await load(id), opts));
    },

    async revokeVerification(id: string) {
      await repo.save(revokeVerification(await load(id)));
    },

    async suspend(id: string) {
      await repo.save(suspend(await load(id)));
    },

    get: load,
  };
};
