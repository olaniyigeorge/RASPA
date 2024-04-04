import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { Link, Outlet } from "@remix-run/react";
import { motion } from "framer-motion";
import { useState } from "react";
import Header from "~/components/header";
import PropertyCard, { akure_property, IProperty } from "~/components/property-card";
import Sidebar from "~/components/sidebar";

export default function Explore() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
      };
      
    return <>
        <section className="flex w-full duration-500">
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
    
          <section
            className={`flex flex-col flex-grow relative h-screen duration-500 ${
              isSidebarOpen ? "" : ""
            }`}
          >
            <section className="w-full flex transparent absolute z-20 top-0 left-0 items-center justify-between p-1">
                <Header mode="light" />
              <div 
                className="w-fit h-fit bg-purple-600 text-white opacity-100 rounded-lg p-2 hover:bg-purple-700"
                onClick={toggleSidebar}
              >
                {isSidebarOpen ? <ChevronDownIcon className="w-5 h-5 text-white"/>: <ChevronUpIcon className="w-5 h-5 text-white"/>}
                </div>
            </section>
    
            <section className=" bg-slate-100 top-0 left-0 relative text-purple-600 flex flex-1 justify-start items-start">
              <Outlet />
            </section>
          </section>
        </section>
      
      </>


        

    //     <Link to="/explore/map" > Explore properties on map</Link>    
    // </div>)
}