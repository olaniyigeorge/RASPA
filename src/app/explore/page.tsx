import Link from "next/link";
import { PropertyCard } from "@/components/property/property-card";
import { listProperties, type PropertyFilters } from "@/lib/properties";
import { cn } from "@/lib/utils";
import { ListingPurpose } from "../../../prisma/prisma-client";


const PURPOSE_TABS: { label: string; value?: ListingPurpose }[] = [
  { label: "All" },
  { label: "Buy", value: "SALE" },
  { label: "Rent", value: "RENT" },
  { label: "Invest", value: "INVEST" },
  { label: "Installments", value: "INSTALLMENT" },
];

interface ExplorePageProps {
  searchParams: Promise<{ purpose?: string; type?: string; city?: string; q?: string }>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;

  const filters: PropertyFilters = {
    purpose: params.purpose as ListingPurpose | undefined,
    city: params.city,
    q: params.q,
  };

  const properties = await listProperties(filters);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Explore properties</h1>
        <Link
          href="/explore/map"
          className="text-sm font-medium text-purple-700 hover:underline"
        >
          View on map →
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {PURPOSE_TABS.map((tab) => {
          const isActive = params.purpose === tab.value || (!params.purpose && !tab.value);
          const href = tab.value ? `/explore?purpose=${tab.value}` : "/explore";
          return (
            <Link
              key={tab.label}
              href={href}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                isActive
                  ? "border-purple-700 bg-purple-700 text-white"
                  : "border-gray-200 text-gray-600 hover:border-purple-300"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        {properties.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-400">
            No properties match these filters yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={{ ...property, price: property.price.toString() }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
