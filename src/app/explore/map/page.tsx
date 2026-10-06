import type { Metadata } from "next";
import { Alert, Container, LinkButton, PageHeader } from "@/components/ui";
import { searchListings } from "@/modules/listings";
import { ExploreMapClient } from "./map-client";

export const metadata: Metadata = { title: "Map view" };

export default async function ExploreMapPage() {
  const properties = await searchListings({}, 100);
  const points = properties
    .filter((p) => p.latitude && p.longitude)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      lat: Number(p.latitude),
      lng: Number(p.longitude),
      price: p.price.toString(),
      currency: p.currency,
    }));

  return (
    <Container size="lg" className="py-10">
      <PageHeader
        title="Map view"
        description={`${points.length} geocoded properties.`}
        actions={<LinkButton href="/explore" variant="outline" size="sm">List view</LinkButton>}
      />
      {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
        <div className="mt-4"><Alert tone="info">The interactive map is not configured yet. For now, here are the properties with locations.</Alert></div>
      )}
      <div className="mt-6"><ExploreMapClient points={points} /></div>
    </Container>
  );
}
