// *use client*;


import { json, useLocation } from "@remix-run/react"
import {
    APIProvider,
    Map,
    Marker,
    Pin, 
    InfoWindow,
    AdvancedMarker

} from "@vis.gl/react-google-maps"
import { AnimatePresence, motion } from "framer-motion"
import { useMemo, useState } from "react"
import { LoaderFunctionArgs } from "react-router"
import { getEnvVar, isServer } from "~/api/util"

type LatLngLiteral = google.maps.LatLngLiteral

export default function ExploreMap() {
    // const position = { lat: 7.256, lng: 5.206 }
    const center = useMemo<LatLngLiteral>(() => ({ lat: 7.255280705482117, lng: 5.188536256860319 }), [])
    const [MarkerOpen, setMarkerOpen] = useState<boolean>(false)
    // const GOOGLE_API_KEY = getEnvVar('GOOGLE_MAPS_API_KEY') | "AIzaSyA7qx8ah0ZVIv43KxUPPspBRG1-fwY6jOU"
    const GOOGLE_API_KEY = "AIzaSyA7qx8ah0ZVIv43KxUPPspBRG1-fwY6jOU"
    // const GOOGLE_MAP_ID= getEnvVar('GOOGLE_MAP_ID') | "a67eb23d2ec410cd"
    const GOOGLE_MAP_ID = "a67eb23d2ec410cd"
    console.log(GOOGLE_API_KEY)
    console.log(GOOGLE_MAP_ID)

     



    console.log("isServer(): ", isServer())
    if (!isServer()) {       
        return (
        <AnimatePresence> 
            <APIProvider apiKey={GOOGLE_API_KEY}>
                <motion.div 
                    initial={{ opacity: 0.5, y: -50}}
                    animate= {{ opacity: 1, y: 0}}
                    exit={{opacity:0}}
                    transition={{ease: "easeInOut", duration: 1.5}}
                    className="w-full h-screen relative"
                    
                >
                    <Map 
                        defaultCenter={center}
                        defaultZoom={11.5}
                        mapId= {GOOGLE_MAP_ID}
                        fullscreenControl= {false}
                    >
                    
                    <div className="absolute p-2 top-16 right-10 w-[400px] h-[100px] bg-gray-950 drop-shadow rounded">
                        <div className="w-full space-x-1 flex justify-between">
                            <button className="w-full rounded-full p-2 text-white bg-purple-700">
                                Rent
                            </button>
                            <button className="w-full rounded-full p-2 text-white bg-purple-700">
                                Sale
                            </button>
                            <button className="w-full rounded-full p-2 text-white bg-purple-700">
                                Invest
                            </button>
                        </div>
                    </div>
                    <AdvancedMarker position={center}>
                        <Pin />
                    </AdvancedMarker>    
                    

                    </Map>
                </motion.div>
            </APIProvider>
        </AnimatePresence>
    )
}
}




// export async function loader({request,}: LoaderFunctionArgs) {
//     const currUrl = new URL(request.url)
//     // const action: string = currUrl.searchParams.get('lat') ?? ''
//     // const search: string = currUrl.searchParams.get('lng') ?? ''
//     // const lat: string = currUrl.searchParams.get('lat') ?? ''
//     // const lng: string = currUrl.searchParams.get('lng') ?? ''

// ``
//     const ep: string = `https://wta-api-build.onrender.com/directory/service-locations/?lat=${6.7874652}&lng=${3.3836684}`
//     console.log(ep)
//     // if the 
//     console.log(currUrl)
//     // console.log(`Action ${action}`)
//     // console.log(`Search ${search}`)


//     return {currUrl}
// }