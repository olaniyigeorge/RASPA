"use client";

import Link from "next/link";
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
  // TODO: swap this list-fallback for an actual map (react-map-gl + Mapbox,
  // or @react-google-maps/api). Kept dependency-free so the scaffold builds
  // without an API key. Coordinates are already wired up via lat/lng below.
  return (
    <div className="mx-auto h-full max-w-3xl overflow-y-auto px-6 py-10">
      <p className="mb-4 text-sm text-gray-500">
        Map integration pending — showing {points.length} geocoded properties.
      </p>
      <ul className="space-y-3">
        {points.map((point) => (
          <li key={point.id}>
            <Link
              href={`/property/${point.slug}`}
              className="flex items-center justify-between rounded-xl border border-gray-100 p-4 hover:border-purple-300"
            >
              <div>
                <p className="font-medium text-gray-900">{point.title}</p>
                <p className="text-xs text-gray-400">
                  {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                </p>
              </div>
              <p className="font-semibold text-purple-700">
                {formatCurrency(point.price, point.currency)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
