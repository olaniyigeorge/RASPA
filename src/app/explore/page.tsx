import type { Metadata } from "next";
import Link from "next/link";
import { Map, SearchX } from "lucide-react";
import { Suspense } from "react";
import { ExploreFilters } from "@/components/listings/explore-filters";
import { PropertyGrid } from "@/components/listings/property-card";
import { Container, EmptyState, LinkButton, PageHeader } from "@/components/ui";
import { discovery } from "@/modules/discovery";
import { getCurrentUser } from "@/modules/identity";
import { searchListings, type ListingPurpose, type PropertyType } from "@/modules/listings";

export const metadata: Metadata = { title: "Explore properties" };

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ExplorePage({ searchParams }: Props) {
  const p = await searchParams;
  const num = (v?: string) => (v && !Number.isNaN(Number(v)) ? Number(v) : undefined);

  const filters = {
    purpose: p.purpose as ListingPurpose | undefined,
    type: p.type as PropertyType | undefined,
    city: p.city,
    q: p.q,
    minPrice: num(p.minPrice),
    maxPrice: num(p.maxPrice),
    ...(p.verified === "1" && { statuses: ["VERIFIED" as const] }),
  };

  const properties = await searchListings(filters, 48);

  // search/filter history feeds recommendations
  const user = await getCurrentUser();
  if (user && (filters.q || filters.city || filters.purpose || filters.type || filters.minPrice || filters.maxPrice)) {
    await discovery.record(user.id, {
      kind: filters.q ? "SEARCH" : "FILTER",
      query: filters.q,
      city: filters.city,
      filters: { type: filters.type, purpose: filters.purpose, minPrice: filters.minPrice, maxPrice: filters.maxPrice },
    });
  }

  return (
    <Container className="py-10">
      <PageHeader
        title="Explore properties"
        description={`${properties.length} ${properties.length === 1 ? "listing" : "listings"}. Verified listings appear first.`}
        actions={
          <LinkButton href="/explore/map" variant="outline" size="sm">
            <Map className="size-4" /> Map view
          </LinkButton>
        }
      />
      <div className="mt-6">
        <Suspense>
          <ExploreFilters />
        </Suspense>
      </div>
      <div className="mt-8">
        {properties.length === 0 ? (
          <EmptyState
            icon={<SearchX className="size-5" />}
            title="No properties match these filters"
            description="Try widening your price range or clearing a filter."
            action={<Link href="/explore" className="text-sm font-medium text-brand-700 hover:underline">Clear all filters</Link>}
          />
        ) : (
          <PropertyGrid properties={properties.map((x) => ({ ...x, price: x.price.toString() }))} />
        )}
      </div>
    </Container>
  );
}
