import { UserIcon } from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";



export default function Header() {


    return <header className="flex justify-between items-center w-full h-auto  py-3 px-4 sm:px-8 shadow">
        <Link to="/" className="text-white">
            <img className="h-10 w-auto" src="images/rasp-logo-white.png" alt="rasp" />
        </Link>

        <span className="text-white space-x-4">
            <Link className="  sm:text-md transition-ease hover:border-b transition-all" to="/about-us"> About </Link>
            <Link className="  sm:text-md transition-ease hover:border-b transition-all" to="/blog"> Blog </Link>
            <Link className="  sm:text-md transition-ease hover:border-b transition-all" to="/contact"> Contact</Link>
            <Link className="  sm:text-md transition-ease hover:border-b transition-all" to="/explore/map/?action=buy&search="> Explore</Link>
        </span> 

        <span className="flex items-center ">
            <Link to="/login" className="mx-2 h-auto flex  text-sm items-start text-start text-white ">Get Started</Link>
            <span className="w-8 h-8 border-2 border-black rounded-full p-1">
                <UserIcon className="w-full h-full text-black" />
            </span>
        </span>



    </header>
}