import { Link, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { MapIcon } from "@heroicons/react/24/outline";


interface Props {
    isOpen: boolean;
    toggleSidebar: () => void;
  }


export default function Sidebar({ isOpen, toggleSidebar }: Props)  {
    const urlLocation = useLocation();
    const currentUrl = urlLocation.pathname;
  
    const [activeLink, setActiveLink] = useState<null | string>(null);

    // useEffect(() => {
    //   toggleSidebar();
    // }, [activeLink, currentUrl]);
  
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black opacity-70 z-40 cursor-pointer"
            onClick={toggleSidebar}
          ></div>
        )}
        <section
          className={`fixed top-0 left-0 bg-white duration-500 text-gray-900 h-screen w-[300px] z-50 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Link
            to="/"
            className="w-full flex items-center p-4  justify-start "
          >
            <img src="images/rasp-logo-purple.png" alt="logo" className="w-auto h-12 " />
          </Link>
  
          <section className="w-full  mt-16 grid grid-rows-2 gap-2 justify-around grid-flow-col ">
            <Link to="/explore/map" className="p-2 bg-gray-100 flex justify-center items-center rounded w-24 h-24">Residential</Link>
            <Link to="/explore" className="p-2 bg-gray-100 flex justify-center items-center rounded w-24 h-24">Industrial</Link>
            <Link to="/explore" className="p-2 bg-gray-100 flex justify-center items-center rounded w-24 h-24">Commercial</Link>
            <Link to="/explore/map" className="p-2 bg-gray-100 flex justify-center items-center rounded w-24 h-24">Land</Link>
          </section>

          <section className="w-full  mt-16 grid grid-rows-2 justify-around gap-2 grid-flow-col ">
            <Link to="/explore/map" className="p-2 bg-gray-100 rounded w-20 h-20">
              <MapIcon className="w-5 h-5 text-purple-600" />
              Map
            </Link>
            <Link to="/explore" className="p-2 bg-gray-100 rounded w-20 h-20">Explore</Link>
            <Link to="explore/map" className="p-2 bg-gray-100 rounded w-20 h-20">This</Link>
            <Link to="explore/map" className="p-2 bg-gray-100 rounded w-20 h-20">This</Link>
          </section>
        </section>
      </>
    );
  };


  
const sideBarCardData = [
    {
      id: 1,
      link: "/explore/map",
      linkText: "Explore Map",
    },
    {
      id: 2,
      link: "/explore",
      linkText: "Explore",
    },]