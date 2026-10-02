import type { Listing, ListingPurpose, ListingStatus, ListerCapacity, OwnerDetails, PropertyType } from "./listing";

export interface NewListing {
  slug: string;
  title: string;
  description: string;
  type: PropertyType;
  purpose: ListingPurpose;
  price: number;
  currency: string;
  address: string;
  addressKey: string;
  city: string;
  state: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
  latitude?: number;
  longitude?: number;
  listerId: string;
  listerCapacity: ListerCapacity;
  ownerUserId: string | null;
  owner: OwnerDetails | null;
}

export interface ListingRepository {
  findById(id: string): Promise<Listing | null>;
  create(input: NewListing): Promise<Listing>;
  /** Persists the mutable lifecycle fields of the aggregate. */
  save(listing: Listing): Promise<void>;
  update(id: string, patch: Partial<Omit<NewListing, "listerId" | "listerCapacity">>): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface ListingSearch {
  purpose?: ListingPurpose;
  type?: PropertyType;
  city?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  statuses?: ListingStatus[];
}
