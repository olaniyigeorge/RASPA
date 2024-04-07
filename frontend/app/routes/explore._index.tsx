import Header from "~/components/header";
import PropertyCard from "~/components/property-card";
import { AnimatePresence, motion } from "framer-motion";
import { IProperty } from "~/components/property-card";         
import { akure_property } from "~/components/property-card";
import ListingContainier from "~/components/listings/listings-container";
import ListingsFilter from "~/components/listings/filter-tab";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useEffect, useState } from "react";
import { useLocation } from "@remix-run/react";

export default function ExploreIndex() {
    const location = useLocation()
    console.log(location.pathname)
    const [listingsURL, setListingsURL] = useState<any>()
    // useEffect(() => {
        

    // }, [listingsURL])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeIn", duration: 1 }}
        >
            <div className="mt-16">
                <ListingsFilter />
            
                <div id="properties" className="w-full md:flex space-x-2 px-2">
                    <ListingContainier {...akure_property} />
                    
                    <iframe
                        width="600"
                        height="450"
                        className="border hidden md:flex border-gray-300 w-1/5"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyA7qx8ah0ZVIv43KxUPPspBRG1-fwY6jOU
                            &q=Akure,+Ondo+state+NG">
                    </iframe>

                </div>
            </div>
        </motion.div>
    );
}





export async function action({request,}: ActionFunctionArgs) {
    const currUrl = new URL(request.url)
    const form = await request.formData()
    // const destination: string = currUrl.searchParams.get('destination') ?? '/'
    const action = (form.get("action") || "").toString();
    const search = (form.get("search") || "").toString();
    
    // const en = `https://wta-api-build.onrender.com/directory/service-locations/?action=${action}&search=${search}`
    const en = `/explore/map/?action=${action}&search=${search}`
  
    console.log("Redirecting to: ", en)
    // console log constructed url 
    // ....and redirect to it
  
    return redirect(en)
  }
