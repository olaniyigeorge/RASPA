import Image from "next/image";
import Link from "next/link";
import { Box, MapPin, Video, BedDouble, Bath } from "lucide-react";
import { VerificationBadge } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

export interface PropertyCardData {
  id: string;
  slug: string;
  title: string;
  city: string;
  state: string;
  price: number | string;
  currency: string;
  purpose: string;
  status: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  media: { kind: string; url: string }[];
}

const PURPOSE_LABEL: Record<string, string> = {
  SALE: "For sale",
  RENT: "For rent",
  INVEST: "Invest",
  INSTALLMENT: "Installments",
};

export function PropertyCard({ property: p }: { property: PropertyCardData }) {
  const cover = p.media.find((m) => m.kind === "PHOTO");
  const hasVideo = p.media.some((m) => m.kind === "VIDEO");
  const hasScan = p.media.some((m) => m.kind === "SCAN_3D");

  return (
    <Link
      href={`/property/${p.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card transition-all hover:-translate-y-0.5 hover:shadow-raised"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
        {cover ? (
          <Image
            src={cover.url}
            alt={p.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink-subtle">No photos yet</div>
        )}
        <div className="absolute left-3 top-3">
          <VerificationBadge status={p.status} className="bg-surface/95 backdrop-blur" />
        </div>
        {(hasVideo || hasScan) && (
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {hasVideo && (
              <span className="flex items-center gap-1 rounded-full bg-ink/75 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                <Video className="size-3.5" /> Video
              </span>
            )}
            {hasScan && (
              <span className="flex items-center gap-1 rounded-full bg-ink/75 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                <Box className="size-3.5" /> 3D
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{PURPOSE_LABEL[p.purpose] ?? p.purpose}</p>
        <h3 className="mt-1 line-clamp-1 text-base font-semibold text-ink">{p.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
          <MapPin className="size-3.5 shrink-0" />
          {p.city}, {p.state}
        </p>
        <div className="mt-auto flex items-end justify-between pt-4">
          <p className="text-lg font-semibold text-ink">
            {formatCurrency(p.price, p.currency)}
            {p.purpose === "RENT" && <span className="text-sm font-normal text-ink-subtle"> /yr</span>}
          </p>
          <p className="flex items-center gap-3 text-xs text-ink-muted">
            {p.bedrooms ? (
              <span className="flex items-center gap-1"><BedDouble className="size-3.5" />{p.bedrooms}</span>
            ) : null}
            {p.bathrooms ? (
              <span className="flex items-center gap-1"><Bath className="size-3.5" />{p.bathrooms}</span>
            ) : null}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function PropertyGrid({ properties }: { properties: PropertyCardData[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {properties.map((p, i) => (
        <div key={p.id} className="animate-fade-up" style={{ "--i": Math.min(i, 8) } as React.CSSProperties}>
          <PropertyCard property={p} />
        </div>
      ))}
    </div>
  );
}
