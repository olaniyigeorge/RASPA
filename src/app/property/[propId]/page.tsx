import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyBySlugOrId } from "@/lib/properties";
import { formatCurrency } from "@/lib/utils";

interface PropertyPageProps {
  params: Promise<{ propId: string }>;
}

const PLAN_LINKS = [
  { href: "buy-now", label: "Buy now" },
  { href: "installments", label: "Installments" },
  { href: "invest", label: "Invest" },
  { href: "rent", label: "Rent" },
];

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { propId } = await params;
  const property = await getPropertyBySlugOrId(propId);

  if (!property) notFound();

  const [heroImage, ...restImages] = property.images;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-2 sm:grid-cols-4 sm:grid-rows-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 sm:col-span-2 sm:row-span-2">
          {heroImage && (
            <Image src={heroImage.url} alt={property.title} fill className="object-cover" />
          )}
        </div>
        {restImages.slice(0, 4).map((img) => (
          <div key={img.id} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
            <Image src={img.url} alt={img.alt ?? property.title} fill className="object-cover" />
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
            {property.purpose} · {property.type}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">{property.title}</h1>
          <p className="mt-1 text-gray-500">
            {property.address}, {property.city}, {property.state}
          </p>

          <div className="mt-6 flex gap-6 text-sm text-gray-600">
            {property.bedrooms !== null && <span>{property.bedrooms} bedrooms</span>}
            {property.bathrooms !== null && <span>{property.bathrooms} bathrooms</span>}
            {property.areaSqm && <span>{property.areaSqm.toString()} sqm</span>}
          </div>

          <p className="mt-6 whitespace-pre-line text-gray-700">{property.description}</p>

          {property.amenities.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900">Amenities</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map(({ amenity }) => (
                  <span
                    key={amenity.id}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                  >
                    {amenity.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-gray-100 p-6 shadow-sm">
          <p className="text-2xl font-bold text-purple-700">
            {formatCurrency(property.price.toString(), property.currency)}
          </p>
          <p className="mt-1 text-sm text-gray-500">Listed by {property.agent.name}</p>

          <div className="mt-6 grid grid-cols-2 gap-2">
            {PLAN_LINKS.map((plan) => (
              <Link
                key={plan.href}
                href={`/property/${property.slug}/payment-plans/${plan.href}`}
                className="rounded-xl border border-gray-200 py-2 text-center text-sm font-medium text-gray-700 hover:border-purple-400 hover:text-purple-700"
              >
                {plan.label}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
