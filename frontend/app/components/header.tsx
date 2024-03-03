import { Link } from "@remix-run/react";



export default function Header() {


    return <header className="flex justify-between items-center w-full h-max-20  py-3 px-4 sm:px-8 shadow">
        <Link to="/" className="text-white font-extrabold text-2xl md:text-5xl font-mono">
            RASP
        </Link>

        <span className="text-white space-x-4">
            <Link className="  sm:text-md transition-ease hover:border-b transition-all" to="/about-us"> About </Link>
            <Link className="  sm:text-md transition-ease hover:border-b transition-all" to="/blog"> Blog </Link>
            <Link className="  sm:text-md transition-ease hover:border-b transition-all" to="/contact"> Contact</Link>
            <Link className="  sm:text-md transition-ease hover:border-b transition-all" to="/explore/map/?action=buy&search="> Explore</Link>
        </span> 

        <span className="sm:text-md text-white">
            <p>Get Started</p>
        </span>


    </header>
}