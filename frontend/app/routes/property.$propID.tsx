import { BookmarkIcon, InboxIcon, PaperAirplaneIcon, ServerIcon } from "@heroicons/react/24/outline";
import { json, LoaderFunctionArgs } from "@remix-run/node"
import { Link, useLoaderData, useParams } from "@remix-run/react"
import { useState } from "react";

import { akure_property } from "~/data";


export default function ThisProperty() {
    const data = useLoaderData<typeof loader>();
    const [selectedLandMark, setSelectedLandMark] = useState('')
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false)


    let id: any
     
    if (data.id) {
        id = data.id
    } else {
        id =1
    }
    const description = akure_property[id].description;
    const isLongDescription = description.length > 120;

    console.log(id)

    return <div className="w-full gap-3 py-2 flex flex-col-reverse md:flex-row transition-all ease-in-out duration-300  container mx-auto justify-between ">
        <div className="w-full md:w-3/5  space-y-4 rounded-md">    
            <div className="w-full flex flex-col justify-between items-start gap-2 rounded-md h-[400px]">
                <div className="w-full border rounded-md h-4/5">
                    <img src="/images/frame-16.png" className="object-cover rounded-md w-full h-full "/>
                </div>
                <div className="flex gap-2 w-full h-1/5">
                    {
                        ['neighbouhood', 'market', 'schools', 'gyms', 'parks'].map((lm) => (
                        <div className="rounded-md flex justify-center items-center w-full h-full border" onClick={() => {}}>
                            <img src="/images/frame-16.png" className="object-cover rounded-md w-full h-full "/>
                        </div>
                        ))
                    }
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex gap-2 overflow-auto">
                    {
                        ['neighbouhood', 'market', 'schools', 'gyms', 'parks'].map((lm) => (
                        <button 
                            key={lm} 
                            className={`p-2 rounded-md  capitalize ${lm == selectedLandMark.toLowerCase() ? 'bg-purple-700 text-white' : 'text-gray-800 bg-gray-200'}  `} 
                            onClick={() => {setSelectedLandMark(lm)}}
                            > 
                            {lm} 
                        </button>
                        ))
                    }
                </div>

                <div className="w-full min-h-[180px] overflow-auto rounded-lg">
                    <iframe
                        width="600"
                        height="450"
                        className="border rounded-lg w-full h-full md:flex border-gray-300"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyA7qx8ah0ZVIv43KxUPPspBRG1-fwY6jOU
                            &q=Akure,+Ondo+state+NG">
                    </iframe>
                </div>

            </div>
        </div>
        
        <div className="gap-2 w-full flex flex-col md:w-2/5 ">
            <div className="flex w-auto justify-between items-start rounded-md">
                <div className="">
                    <h1 className="text-2xl text-gray-800 font-bold">
                        {akure_property[id].property_name}
                    </h1>
                    <p className="font-medium text-gray-700">
                        {akure_property[id].address}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-gray-100 p-2 rounded">
                        <BookmarkIcon className="pointer-cursor rounded w-3 h-3 text-purple-700 font-bold" />
                    </button>
                    <button className="bg-gray-100 p-2 rounded">
                        <PaperAirplaneIcon className="pointer-cursor rounded w-3 h-3 text-purple-700 font-bold" />
                    </button>
                </div>
            </div>

            <div className="flex py-1 gap-2 rounded-md">
                {[12, 34, '232 sqft'].map((num) => (
                    <span className="flex gap-1 p-1 bg-gray-200 text-xs justify-around items-center text-gray-700 rounded-lg">
                        <ServerIcon className="w-3 h-3 text-gray-800 " />
                        
                        <span className="">
                            {num}
                        </span>
                    </span>
                    
                ))}
    
            </div>

            <div className="flex py-2 justify-between items-baseline w-full">
                <div className="">
                    <span className="flex font-medium items-baseline text-gray-900">
                        ₦<p className="font-bold text-purple-800 text-2xl"> {akure_property[id].price}</p> <p>/year</p>
                    </span>
                </div>
                <div className="flex space-x-2">
                    <Link to="" className="p-2 text-white rounded  bg-purple-700 font-medium">
                        Rent
                    </Link>
                    <Link to="" className="p-2 text-purple-900 rounded  bg-purple-100 font-medium">
                        View 3D Tour
                    </Link>
                </div>
            </div>

            
            <div className="w-full">
                <span className="flex justify-between items-center">
                    <h2 className="font-bold text-xl text-gray-800"> Overview</h2>
                    <p className="font-medium italic underline text-xs text-purple-700">{akure_property[id].agent}</p>
                </span>
                
                <span className="text-wrap flex text-gray-700">
                    {isLongDescription ? (
                        !showFullDescription ? (
                            <p className="transition ease-in-out line-clamp-2 duration-2000">
                                {description.slice(0, 100)}
                                <button
                                    className="text-sm text-purple-700"
                                    onClick={() => setShowFullDescription(true)}
                                >
                                    read more
                                </button>
                            </p>
                        ) : (
                            <p className="transition ease-in-out duration-2000">
                                {description}
                                <button
                                    className="text-sm text-purple-700"
                                    onClick={() => setShowFullDescription(false)}
                                >
                                    hide
                                </button>
                            </p>
                        )
                    ) : (
                        <p className="transition ease-in-out duration-2000">
                            {description}
                        </p>
                    )}
                </span>
            </div>


            <div className="space-y-2">
                <h2 className="font-bold text-xl text-gray-800"> Property Amenities & Features</h2>
                <div className="grid w-full grid-cols-2 gap-3">
                    {
                        [
                            {"id": 1, "type": "flooring", "name": "Hardwood/Tile",},
                            {"id": 1, "type": "type", "name": "residential"},
                            {"id": 1, "type": "utilities", "name": "45"},
                            {"id": 1, "type": "pets", "name": "Cats/Dogs Allowed"},
                            {"id": 1, "type": "health", "name": "In-house Gym"},
                            {"id": 1, "type": "security", "name": "Fenced, Gated"},
                            {"id": 1, "type": "health", "name": "In-house Gym"},

                        ].map((num) => (
                        
                            <span className="flex rounded gap-2 items-center">
                                <button className="rounded border  p-2 bg-gray-200">
                                    <InboxIcon className="w-4 h-4 text-gray-700 " />
                                </button>
                                
                                <div className="tracking-tight leading-tight">
                                    <p className="text-gray-500 capitalize">{num.type}</p>
                                    <p className="text-gray-700 capitalize font-medium">{num.name}</p>
                                </div>
                                
                            </span>
                        
                    ))}
                </div>
            </div>

            <div className="w-full rounded-lg bg-gray-300">
                <p className=" ">
                    Size: {akure_property[id].size} meters square
                </p>
            </div>

            <div className="w-full min-h-[100px] rounded-lg bg-gray-100">
                <img src="/image/ad/promo1.png" className="w-full h-full object-cover rounded-lg"/>
            </div>
        </div>
        
    </div>
} 




export async function loader({request, params}: LoaderFunctionArgs) {
    // console.log(request)
    console.log(params.propID)
    const id = params.propID
    
    
    return json({id})
}