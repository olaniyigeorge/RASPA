"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
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

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
// Advanced markers need a map ID; DEMO_MAP_ID works for development, set a real one for production.
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

let configured = false;

export function ExploreMapClient({ points }: { points: MapPoint[] }) {
  const [failed, setFailed] = useState(false);
  const showMap = !!API_KEY && points.length > 0 && !failed;

  return (
    <div className="space-y-6">
      {showMap && <GoogleMap points={points} onError={setFailed} />}
      <PointList points={points} />
    </div>
  );
}

function GoogleMap({ points, onError }: { points: MapPoint[]; onError: (failed: boolean) => void }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const markers: google.maps.marker.AdvancedMarkerElement[] = [];

    (async () => {
      if (!configured) {
        setOptions({ key: API_KEY, v: "weekly" });
        configured = true;
      }
      const [{ Map, InfoWindow }, { AdvancedMarkerElement }, { LatLngBounds }] = await Promise.all([
        importLibrary("maps"),
        importLibrary("marker"),
        importLibrary("core"),
      ]);
      if (cancelled || !container.current) return;

      const map = new Map(container.current, { mapId: MAP_ID, streetViewControl: false, mapTypeControl: false });
      const info = new InfoWindow();
      const bounds = new LatLngBounds();

      for (const point of points) {
        const position = { lat: point.lat, lng: point.lng };
        const marker = new AdvancedMarkerElement({ map, position, title: point.title, gmpClickable: true });
        marker.addListener("click", () => {
          info.setContent(infoContent(point));
          info.open({ map, anchor: marker });
        });
        markers.push(marker);
        bounds.extend(position);
      }

      if (points.length === 1) {
        map.setCenter(bounds.getCenter());
        map.setZoom(15);
      } else {
        map.fitBounds(bounds, 48);
      }
    })().catch(() => {
      if (!cancelled) onError(true);
    });

    return () => {
      cancelled = true;
      for (const m of markers) m.map = null;
    };
  }, [points, onError]);

  return <div ref={container} className="h-[480px] w-full overflow-hidden rounded-card border border-line bg-surface shadow-card" />;
}

/** Built from DOM nodes (not an HTML string) so listing titles cannot inject markup. */
function infoContent(point: MapPoint): HTMLElement {
  const root = document.createElement("div");
  root.style.cssText = "font: 14px/1.4 system-ui, sans-serif; max-width: 220px";
  const title = document.createElement("p");
  title.style.cssText = "font-weight: 600; margin: 0 0 4px";
  title.textContent = point.title;
  const price = document.createElement("p");
  price.style.cssText = "margin: 0 0 8px";
  price.textContent = formatCurrency(point.price, point.currency);
  const link = document.createElement("a");
  link.href = `/property/${point.slug}`;
  link.textContent = "View property";
  link.style.cssText = "color: #2563eb; font-weight: 500";
  root.append(title, price, link);
  return root;
}

function PointList({ points }: { points: MapPoint[] }) {
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
