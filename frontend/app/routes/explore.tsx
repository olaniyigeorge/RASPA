import { Link } from "@remix-run/react";

export default function Explore() {


    return <div className="p-10 ">
        <span className="w-full flex justify-between">
            <h1 className="text-3xl">
                Explore
            </h1>

            <Link to="/"> Go home</Link>
        </span>
        


        <Link to="/explore/map" > Explore properties on map</Link>    
    </div>
}