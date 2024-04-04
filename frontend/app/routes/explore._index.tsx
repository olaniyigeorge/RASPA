import Header from "~/components/header";
import PropertyCard from "~/components/property-card";
import { motion } from "framer-motion";
import { IProperty } from "~/components/property-card";

// Assuming akure_property is imported or defined elsewhere
import { akure_property } from "~/components/property-card";

export default function ExploreIndex() {
    return (
        <>
            <div className="mt-16">
                <div id="listing-filters" className="">
                    <h1 className="">
                        Filter uour search result
                    </h1>

                    <section className="p-2">
                        <input type="text" placeholder="Search properties" className="border border-white"/>
                        <button className="border bg-white text-gray-800 p-2"> Houses and Apartments </button>
                        <button className="border bg-white text-gray-800 p-2"> Location </button>
                        <button className="border bg-white text-gray-800 p-2"> Min Price </button>
                        <button className="border bg-white text-gray-800 p-2"> Max Price </button>
                    </section>
                </div>
                <div id="properties" className="bg-white flex p-2">
                    <div className="md:flex md:flex-grow md:space-x-3 md:items-start w-3/5 px-2 h-auto">
                        {/* Map over akure_property array and render PropertyCard components */}
                        {/* Make sure akure_property is defined and is an array of IProperty objects */}
                        {/* Example: */}
                        {akure_property.map((property: IProperty) => (
                            <PropertyCard key={property.address} {...property} />
                        ))} 
                    </div>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [1.7, 1] }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: "easeInOut", duration: 1 }}
                        className="bg-purple-200 flex w-2/5 text-white justify-center items-center rounded-lg h-full"
                    >
                        <img src="images/rasp-logo-purple.png" alt="logo" />
                    </motion.div>
                </div>
            </div>
        </>
    );
}
