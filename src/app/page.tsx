import Link from "next/link";
import { PropertyCard } from "@/components/property/property-card";
import { PropertySearch } from "@/components/property/property-search";
import { getFeaturedProperties } from "@/lib/properties";
// TODO: these still live at repo-root /components — move into src/components
// (or adjust the alias) before this will resolve.
import { PropertyTypeCard } from "@/components/property-type-card";
import { ServiceDescriptionCard } from "@/components/service-description-cards";
import { NewsLetterForm } from "@/components/news-letter";
import { property_types, our_services } from "@/components/data";

interface Property {
  id: string;
  price: number;
  [key: string]: any;
}

export default async function HomePage() {
  const featured: Property[] = await getFeaturedProperties(6);

  return (
    <div className="w-full">
      <PropertySearch />

      <div id="property-types" className="flex-col font-sans justify-center py-10">
        <div className="p-3 w-full flex-col justify-center items-center">
          <h1 className="text-3xl flex justify-center font-bold">
            Explore The Luxuries Of RASPA
          </h1>
        </div>

        <div className="md:flex md:flex-grow md:space-x-3 md:items-start w-full px-2 h-auto">
          {property_types.map((type: any) => (
            <PropertyTypeCard key={type.title} {...type} />
          ))}
        </div>
      </div>

      <div className="flex-col justify-center py-10">
        <div className="p-3 w-full flex justify-center mb-5">
          <h1 className="text-3xl font-bold">Newly Listed Properties</h1>
        </div>

        {featured.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-400 mx-2">
            No properties yet — run the seed script or add one from the
            dashboard.
          </p>
        ) : (
          <div className="md:grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 md:items-start w-full overflow-x-auto px-2 h-auto">
            {featured.map((property: Property) => (
              <PropertyCard
                key={property.id}
                property={
                  { ...property, price: property.price.toString() } as any
                }
              />
            ))}
          </div>
        )}

        <Link
          href="/explore"
          className="text-sm italic text-purple-600 flex justify-end px-2"
        >
          View all...
        </Link>
      </div>

      <div className="flex-col justify-center bg-purple-50 py-10">
        <div className="p-3 flex justify-center items-center">
          <h1 className="text-3xl font-bold">See how RASP can help you</h1>
        </div>

        <div className="md:flex space-y-2 md:space-y-0 md:flex-grow md:space-x-3 md:items-start w-full px-2 h-auto">
          {our_services.map((service: any) => (
            <ServiceDescriptionCard key={service.url} {...service} />
          ))}
        </div>
      </div>

      <div id="our-mission" className="my-5 p-3 flex-col justify-center space-y-3">
        <img src="/images/our-mission.png" alt="our-mission" />

        <div className="flex items-center space-x-3 p-3">
          <div className="w-1/4 flex justify-center items-center">
            <h1 className="text-3xl md:text-5xl font-bold drop-shadow border-b border-purple-600 text-purple-600">
              RASPA
            </h1>
          </div>

          <p className="tracking-wide w-3/4 text-lg text-gray-800">
            RASP is your one-stop website, empowering you to seamlessly buy,
            sell, rent a home, and invest in properties, offering a
            comprehensive platform for all your real estate needs
          </p>
        </div>
      </div>

      <div id="newsletter-signup" className="w-full flex-col justify-center py-20">
        <div className="flex w-full justify-center p-2">
          <p className="text-purple-600 text-xl md:text-3xl font-medium">
            Sign up for exciting updates on RASPA
          </p>
        </div>

        <div className="flex w-full justify-center">
          <NewsLetterForm />
        </div>
      </div>
    </div>
  );
}