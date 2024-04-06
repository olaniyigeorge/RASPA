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
                <div id="listing-filters" className="p-4 text-sm md:text-md ">
                    <h1 className="text-xl font-medium text-gray-900">
                        Filter your search result
                    </h1>

                    <ListingsFilter />
                </div>
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
                    {/* <motion.div
                        // initial={{ scale: 0 }}
                        // animate={{ scale: [1.7, 1] }}
                        // exit={{ opacity: 0 }}
                        // transition={{ ease: "easeInOut", duration: 1 }}
                        className="bg-purple-200 flex w-2/5 text-white justify-center items-center rounded-lg h-full"
                    >
                        <img src="images/rasp-logo-purple.png" alt="logo" />
                    </motion.div> */}
                </div>
            </div>
        </motion.div>
    );
}
