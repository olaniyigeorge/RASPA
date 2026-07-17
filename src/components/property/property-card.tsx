import Link from "next/link";
import Image from "next/image";
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
  bedrooms?: number | null;
  bathrooms?: number | null;
  images: { url: string; alt?: string | null }[];
}

export function PropertyCard({ property }: { property: PropertyCardData }) {
  const image = property.images[0];

  return (
    <Link
      href={`/property/${property.slug}`}
      className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? property.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No image yet
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-purple-700">
          {property.purpose}
        </span>
      </div>

      <div className="p-4">
        <p className="truncate text-base font-semibold text-gray-900">{property.title}</p>
        <p className="mt-1 text-sm text-gray-500">
          {property.city}, {property.state}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-bold text-purple-700">
            {formatCurrency(property.price, property.currency)}
          </p>
          {(property.bedrooms || property.bathrooms) && (
            <p className="text-xs text-gray-500">
              {property.bedrooms ? `${property.bedrooms} bd` : ""}
              {property.bedrooms && property.bathrooms ? " · " : ""}
              {property.bathrooms ? `${property.bathrooms} ba` : ""}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
