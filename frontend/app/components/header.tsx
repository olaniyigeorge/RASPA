import { Bars3Icon } from "@heroicons/react/24/outline";
import { UserIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";
import { useState } from "react";



export default function Header() {
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)



    return <header className="w-full h-auto shadow">
        <div className="hidden md:flex w-full  justify-between py-3 px-8 items-center ">
            <Link to="/" className="text-white">
                <img className="h-10 w-auto drop-shadow" src="images/rasp-logo-white.png" alt="rasp" />
            </Link>

            <span className="hidden md:flex text-white text-xs md:text-md space-x-1 md:space-x-4">
                <Link className="transition ease-in-out delay-100 hover:border-b " to="/about-us"> About </Link>
                <Link className="transition ease-in-out delay-100 hover:border-b " to="/blog"> Blog </Link>
                <Link className="transition ease-in-out delay-100 hover:border-b " to="/contact"> Contact</Link>
                <Link className="transition ease-in-out delay-100 hover:border-b " to="/explore"> Explore</Link>
            </span> 

            <span className="hidden md:flex items-center ">
                <Link to="/login" className="mx-2 h-auto flex  text-xs md:text-md items-start text-start text-white ">Get Started</Link>
                <span className="w-8 h-8 border-2 border-black rounded-full p-1">
                    <UserIcon className="w-full h-full text-black" />
                </span>
            </span>
        </div>
        
        {/* Mobile header  TODO:  {dropdownOpen ? style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)'}}}*/}
        <div className="flex md:hidden w-full  px-4  py-2   justify-between items-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
            <Link to="/" className="text-white">
                <img className="h-10 w-auto drop-shadow" src="images/rasp-logo-white.png" alt="rasp" />
            </Link>


            {/* Dropdown menu control */}
            <span className=""> 
                { dropdownOpen ? 
                    <XMarkIcon className="drop-shadow w-8 h-8 text-white" onClick={() => setDropdownOpen(!dropdownOpen)} /> 
                    :
                    <Bars3Icon className="drop-shadow w-8 h-8 text-white" onClick={() => setDropdownOpen(!dropdownOpen)} />
                }
                
                
            </span>

        </div>

        <div className={`${dropdownOpen ? 'block' : 'hidden' } w-full h-auto z-20 `} style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
                <div className="w-full py-2 px-4 flex justify-between  items-center">
                    <Link to="/login" className="h-auto flex  text-xs md:text-md items-start text-start font-medium text-purple-600 ">Get Started</Link>
                    <span className="w-8 h-8 border-2 border-black rounded-full p-1">
                        <UserIcon className="w-full h-full text-black" />
                    </span>
                </div>
            
                <div className="w-full ml-4 flex-col justify-center items-center space-y-2 ">
                    <Link className="block transition ease-in-out delay-100 hover:font-bold hover:scale-105 " to="/about-us"> About </Link>
                    <Link className="block transition ease-in-out delay-100 hover:font-bold hover:scale-105 " to="/blog"> Blog </Link>
                    <Link className="block transition ease-in-out delay-100 hover:font-bold hover:scale-105 " to="/contact"> Contact</Link>
                    <Link className="block transition ease-in-out delay-100 hover:font-bold hover:scale-105 " to="/explore"> Explore</Link>
                </div>
        </div>



    </header>
}