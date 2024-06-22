import { json } from "@remix-run/node";
import { PropertyListing } from "~/api/interfaces";
import { akure_property } from "~/data";
import PropertyCard from "../property-card";



type ListingContainerProps = {
    listings: PropertyListing[];
  };


export default function ListingContainer({listings }: any){
    

    return <div className="w-full py-1 space-y-2 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 justify-between">
    {
        listings.map((property: PropertyListing) => (
            <PropertyCard key={property.id} {...property} />
        ))
    } 

    </div>
    
}