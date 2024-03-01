import { Link } from "@remix-run/react";



export default function Header() {


    return <header className="flex justify-between items-center w-full h-max-20  py-3 px-4 sm:px-8 shadow">
        <Link to="/" className="text-white font-extrabold text-2xl md:text-5xl font-mono">
            RASP
        </Link>

        <span className="text-white space-x-4">
            <Link className="p-2 text-xs md:text-md hover:underline transition-all" to="/about-us"> About </Link>
            <Link className="p-2 text-xs md:text-md hover:underline transition-all" to="/blog"> Blog </Link>
            <Link className="p-2 text-xs md:text-md hover:underline transition-all" to="/contact"> Contact</Link>
            <Link className="p-2 text-xs md:text-md hover:underline transition-all" to="/explore/map/?action=buy&search="> Explore</Link>
        </span> 

        <span className="text-xs md:text-md text-white">
            <p>Get Started</p>
        </span>


    </header>
}