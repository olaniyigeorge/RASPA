import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import Header from "~/components/header";
import PropertyCard, { akure_property, IProperty } from "~/components/property-card";

export default function Explore() {


    return <div className="">
        <Header mode={"light"} />

        <div className="flex p-2 ">
            <div className="md:flex md:flex-grow md:space-x-3 md:items-start w-3/5 px-2 h-auto">
                    {akure_property.map((property: IProperty) => (
                        <PropertyCard key={property.address} {...property} />
                    ))}
            </div>

            <motion.div
            initial={{ scale: 0 }}
            animate= {{ scale: [1.7,1]}}
            exit={{opacity:0}}
            transition={{ease: "easeInOut", duration: 1}}
            className="bg-purple- flex w-2/5 text-white justify-center items-center rounded-lg h-full "
            >
                <img src={`images/rasp-logo-purple.png`} alt="logo" />
            </motion.div>


        </div>

        

        <Link to="/explore/map" > Explore properties on map</Link>    
    </div>
}