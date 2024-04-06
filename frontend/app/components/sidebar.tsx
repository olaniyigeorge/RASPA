import { Link, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";



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
          className={`fixed top-0 left-0 bg-white text-gray-900 h-screen w-[300px] duration-500 z-50 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Link
            to="/"
            className="w-full flex items-center p-4  justify-start "
          >
            <img src="images/rasp-logo-purple.png" alt="logo" className="w-auto h-12 " />
          </Link>
  
          <section className="w-full border mt-20 grid grid-rows-2 gap-2 grid-flow-col ">
            <div className="p-2 bg-gray-100 rounded w-20 h-20">Map</div>
            <div className="p-2 bg-gray-100 rounded w-20 h-20">Explore</div>
            <div className="p-2 bg-gray-100 rounded w-20 h-20">This</div>

 
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