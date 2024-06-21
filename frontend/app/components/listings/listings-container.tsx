import { json } from "@remix-run/node";
import { PropertyListing } from "~/api/interfaces";
import { akure_property } from "~/data";
import PropertyCard from "../property-card";



type ListingContainerProps = {
    listings: PropertyListing[];
  };


export default function ListingContainer({listings }: any){
    
    // const listings = {...props}
    //console.dir(listings, { depth: null, colors: true });
    console.log("Listing...: ", listings)


    return <div className="w-full py-1 space-y-2 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 justify-between">
    {/* Map over akure_property array and render PropertyCard components      md:flex md:flex-grow md:space-x-3 md:items-start w-3/5 px-2 h-auto 
     Make sure akure_property is defined and is an array of IProperty objects
     Example: */}
    
    {
        listings.map((property: PropertyListing) => (
            <PropertyCard key={property.id} {...property} />
        ))
    } 

    </div>
    
}