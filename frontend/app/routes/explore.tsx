import { Link } from "@remix-run/react";
import Header from "~/components/header";

export default function Explore() {


    return <div className="">
        <Header mode={"light"} />
        <span className="w-full flex justify-between">
            <h1 className="text-3xl">
                Explore
            </h1>

            <Link to="/"> Go home</Link>
        </span>
        


        <Link to="/explore/map" > Explore properties on map</Link>    
    </div>
}