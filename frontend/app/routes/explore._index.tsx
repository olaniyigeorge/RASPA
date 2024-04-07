import Header from "~/components/header";
import PropertyCard from "~/components/property-card";
import { AnimatePresence, motion } from "framer-motion";
import { IProperty } from "~/components/property-card";         
import { akure_property } from "~/components/property-card";
import ListingContainier from "~/components/listings/listings-container";
import ListingsFilter from "~/components/listings/filter-tab";

export default function ExploreIndex() {
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
