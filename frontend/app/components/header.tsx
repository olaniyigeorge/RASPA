import { UserIcon } from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";



export default function Header() {


    return <header className="flex justify-between items-center w-full h-auto  py-2 md:py-3 px-4 sm:px-8 shadow">
        <Link to="/" className="text-white">
            <img className="h-10 w-auto drop-shadow" src="images/rasp-logo-white.png" alt="rasp" />
        </Link>

        <span className="text-white text-xs md:text-md space-x-1 md:space-x-4">
            <Link className="transition ease-in-out delay-100 hover:border-b " to="/about-us"> About </Link>
            <Link className="transition ease-in-out delay-100 hover:border-b " to="/blog"> Blog </Link>
            <Link className="transition ease-in-out delay-100 hover:border-b " to="/contact"> Contact</Link>
            <Link className="transition ease-in-out delay-100 hover:border-b " to="/explore/map/?action=buy&search="> Explore</Link>
        </span> 

        <span className="flex items-center ">
            <Link to="/login" className="mx-2 h-auto flex  text-xs md:text-md items-start text-start text-white ">Get Started</Link>
            <span className="w-8 h-8 border-2 border-black rounded-full p-1">
                <UserIcon className="w-full h-full text-black" />
            </span>
        </span>



    </header>
}