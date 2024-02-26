import { Link } from "@remix-run/react";



export default function Header() {


    return <header className="flex justify-between items-center w-full h-max-20  py-3 px-8 shadow">
        <Link to="/" className="text-white font-extrabold text-5xl font-mono">
            RASP
        </Link>

        <span className="text-white space-x-4">
            <Link to="/about-us"> About </Link>
            <Link to="/blog"> Blog </Link>
            <Link to="/contact"> Contact</Link>
        </span>

        <span className="text-white">
            <p>Get Started</p>
        </span>


    </header>
}