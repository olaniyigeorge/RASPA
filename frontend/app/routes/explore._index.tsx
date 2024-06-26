import Header from "~/components/header";
import PropertyCard from "~/components/property-card";
import { AnimatePresence, motion } from "framer-motion";
import { IProperty } from "~/components/property-card";         
import ListingContainier from "~/components/listings/listings-container";
import ListingsFilter from "~/components/listings/filter-tab";
import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useEffect, useState } from "react";
import { useActionData, useLoaderData, useLocation } from "@remix-run/react";
import { akure_property } from "~/data";
import { fetchData, fetcherProps, getUrl } from "~/api/util";
import { action } from "./explore";

export default function ExploreIndex() {
    const data = useLoaderData<typeof loader>();
    const location = useLocation()


    const mapOpen = false
    return (
            <div className="w-full flex flex-col justify-between items-center">
                <ListingsFilter />
            
                <div id="properties" className="w-full  flex justify-between px-2">
                    <ListingContainier listings={data?.listings} />
                    
                    {
                        mapOpen ? (
                            <iframe
                                width="600"
                                height="450"
                                className="border hidden lg:flex border-gray-300"
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyA7qx8ah0ZVIv43KxUPPspBRG1-fwY6jOU
                                    &q=Akure,+Ondo+state+NG">
                            </iframe>

                        ) :
                        ""
                    }                
                </div>
            </div>

    );
}


export async function loader({request, params}: LoaderFunctionArgs) {
    const currUrl = new URL(request.url)
    // Get filters
    const search: string = currUrl.searchParams.get('search') ?? ''
    const property__size: string = currUrl.searchParams.get('property__size') ?? ''
    const property__type: string = currUrl.searchParams.get('property__type') ?? ''
    const price__lte: string = currUrl.searchParams.get('price__lte') ?? ''
    const price__gte: string = currUrl.searchParams.get('price__gte') ?? ''
    const listing_type: string = currUrl.searchParams.get('listing_type') ?? ''
    
    const f = `?search=${search}&property__size=${property__size}&property__type=${property__type}&listing_type=${listing_type}&price__lte=${price__lte}&price__gte=${price__gte}&`

    // console.log("Fetching: ", getUrl('listings', f))
    const args: fetcherProps = {
        data_type: "listings",
        endpoint: getUrl('listings', f), 
        method: 'GET',  
    }
    let listings: {}
    let listings_response = await fetchData(args);

    if (listings_response.status !== 200) {
        listings = []
    }
    else {
        listings = listings_response.body
    }
    
    return json({listings})
}


