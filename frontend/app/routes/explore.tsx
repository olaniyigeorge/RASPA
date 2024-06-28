import { DeviceTabletIcon } from "@heroicons/react/24/solid";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { fetchData, fetcherProps } from "~/api/util";
import Footer from "~/components/footer";
import Header from "~/components/header";
import PropertyCard, { IProperty } from "~/components/property-card";
import Sidebar from "~/components/sidebar";

export default function Explore() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
      };
      
    return <div className="w-full h-screen relative bg-slate-50">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          
        <Header mode="light" />

        <button 
          className="bg-purple-600 absolute z-400 top-3 right-12 md:right-0 lg:right-[150px] text-white opacity-100 rounded-lg p-2 hover:bg-purple-700"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <DeviceTabletIcon className="w-4 h-4 rotate-90 text-white"/>: <DeviceTabletIcon className="w-4 h-5 rotate-90 text-white"/>}
        </button>
        <section className="bg-slate-50 w-full flex  ">
          <Outlet />
        </section>
      </div>
}



export async function action({request,}: ActionFunctionArgs) {
  const currUrl = new URL(request.url)

  // Get filter param values from formData
  const form = await request.formData()
  const search = (form.get("search") || "").toString();
  const property__type = (form.get("property__type") || "").toString();
  const listing_type = (form.get("listing_type") || "").toString();
  const price__gte = (form.get("price__gte") || "").toString();
  const price__lte = (form.get("price__lte") || "").toString();
  const property__size = (form.get("property__size") || "").toString();

  const f = `search=${search}&property__size=${property__size}&property__type=${property__type}&listing_type=${listing_type}&price__lte=${price__lte}&price__gte=${price__gte}`

  return redirect(`/explore?${f}`)
}

