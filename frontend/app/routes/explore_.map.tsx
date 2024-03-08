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
import { useMemo, useState } from "react"
import { LoaderFunctionArgs } from "react-router"
import { getEnvVar, isServer } from "~/api/util"

type LatLngLiteral = google.maps.LatLngLiteral

export default function ExploreMaps() {
    // const position = { lat: 7.256, lng: 5.206 }
    const center = useMemo<LatLngLiteral>(() => ({ lat: 6.7874652, lng: 3.3836684 }), [])
    const [MarkerOpen, setMarkerOpen] = useState<boolean>(false)
    const GOOGLE_API_KEY = getEnvVar('GOOGLE_MAPS_API_KEY')
    const GOOGLE_MAP_ID= getEnvVar('GOOGLE_MAP_ID')
    console.log(GOOGLE_API_KEY)
    console.log(GOOGLE_MAP_ID)


    // const response = fetch(ep, {method: 'get'})
    // const tokenRefreshResponse = await fetch(ep, {
    //     method: 'GET',
    // });

    // console.log(response)


    console.log("isServer(): ", isServer())
    if (!isServer()) {       
        return (
        <APIProvider apiKey={GOOGLE_API_KEY}>
            <div className="w-full h-screen ">
                <Map 
                    zoom={8.5} 
                    center={center}
                    mapId= {GOOGLE_MAP_ID}
                >
                
                <AdvancedMarker position={center}>
                    <Pin />
                </AdvancedMarker>    
                

                </Map>
            </div>
        </APIProvider>

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