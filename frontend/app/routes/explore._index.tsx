import Header from "~/components/header";
import PropertyCard from "~/components/property-card";
import { AnimatePresence, motion } from "framer-motion";
import { IProperty } from "~/components/property-card";         
import { akure_property } from "~/components/property-card";

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

                    <section className="w-full border-b border-gray-200 py-3 md:flex justify-start space-y-2 md:space-y-0 md:space-x-4 items-center ">
                        <input type="text" placeholder="Search properties" className="border border-gray-500 focus:outline-purple-600 p-2 rounded h-10 w-[350px] border-white"/>
                        <div className="flex justify-start space-x-5">
                            <button className="rounded-md border bg-white text-gray-800 p-2"> Houses and Apartments </button>
                            <button className="rounded-md border bg-white text-gray-800 p-2"> Location </button>
                            <button className="rounded-md border bg-white text-gray-800 p-2"> Min Price </button>
                            <button className="rounded-md border bg-white text-gray-800 p-2"> Max Price </button>
                        </div>
                    </section>
                </div>
                <div id="properties" className="w-full flex space-x-2 px-2">
                    <div className="w-full md:w-4/5 md:grid grid-cols-3 gap-3 justify-between">
                        {/* Map over akure_property array and render PropertyCard components      md:flex md:flex-grow md:space-x-3 md:items-start w-3/5 px-2 h-auto */}
                        {/* Make sure akure_property is defined and is an array of IProperty objects */}
                        {/* Example: */}
                        {akure_property.map((property: IProperty) => (
                            <PropertyCard key={property.address} {...property} />
                        ))} 
                    </div>
                    <iframe
                        width="600"
                        height="450"
                        className="border hidden md:flex border-gray-300 w-1/5"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyA7qx8ah0ZVIv43KxUPPspBRG1-fwY6jOU
                            &q=Lagos,state+NG">
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
