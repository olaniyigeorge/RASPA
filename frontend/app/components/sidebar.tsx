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
  
          <section className="w-full flex flex-col ">
            {sideBarCardData.map((data, index) => (
              <Link
                to={data.link}
                key={index}
                className={`w-full py-4 pl-10 duration-300 ${
                  activeLink === data.linkText
                    ? "bg-purple-200 text-purple-600 border-r-8 border-r-purple-600 hover:bg-purple-200 hover:text-white"
                    : "hover:bg-purple-200 hover:text-purple-600 hover:border-r-8 hover:border-r-purple-600"
                }`}
              >
                <section className="flex items-center gap-4">
                  <img src="images/invest-in-properties.png" className="w-5 h-5" alt="logo" />
                  <p className=""> {data.linkText} </p>
                </section>
              </Link>
            ))}
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