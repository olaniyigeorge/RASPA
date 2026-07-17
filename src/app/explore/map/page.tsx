import { listProperties } from "@/lib/properties";
import { ExploreMapClient } from "./map-client";

export default async function ExploreMapPage() {
  const properties = await listProperties({}, 100);

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
    <div className="h-[calc(100vh-73px)]">
      <ExploreMapClient points={points} />
    </div>
  );
}
