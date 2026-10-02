"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface MapPoint {
  id: string;
  slug: string;
  title: string;
  lat: number;
  lng: number;
  price: string;
  currency: string;
}

export function ExploreMapClient({ points }: { points: MapPoint[] }) {
  // The interactive map is not built yet (it needs a Mapbox/Google key). Until then this
  // is a list of geocoded listings; lat/lng are already wired through for the map.
  return (
    <ul className="space-y-3">
      {points.map((point) => (
        <li key={point.id}>
          <Link
            href={`/property/${point.slug}`}
            className="flex items-center justify-between gap-4 rounded-card border border-line bg-surface p-4 shadow-card transition-colors hover:border-brand-300"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-600"><MapPin className="size-4.5" /></span>
              <div>
                <p className="font-medium text-ink">{point.title}</p>
                <p className="text-xs text-ink-subtle">{point.lat.toFixed(4)}, {point.lng.toFixed(4)}</p>
              </div>
            </div>
            <p className="font-semibold text-ink">{formatCurrency(point.price, point.currency)}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
