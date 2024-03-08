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
import { fetchServiceLocations } from "~/api/directory"
import { getEnvVar, isServer } from "~/api/util"
import { dataa } from "~/components/data"

type LatLngLiteral = google.maps.LatLngLiteral

export default function Directory() {
    // const position = { lat: 7.256, lng: 5.206 }
    const center = useMemo<LatLngLiteral>(() => ({ lat: 6.7874652, lng: 3.3836684 }), [])
    const [MarkerOpen, setMarkerOpen] = useState<boolean>(false)
    const GOOGLE_API_KEY = getEnvVar('GOOGLE_MAPS_API_KEY')
    const GOOGLE_MAP_ID= getEnvVar('GOOGLE_MAP_ID')
    console.log(GOOGLE_API_KEY)
    console.log(GOOGLE_MAP_ID)

    const ep: string = `https://wta-api-build.onrender.com/directory/service-locations/?lat=${center.lat}&lng=${center.lng}`
    console.log("EP: ", ep)

    console.log("Data size: ", dataa.length)



    console.log("isServer(): ", isServer())
    if (!isServer()) {       
        return (
        <APIProvider apiKey={GOOGLE_API_KEY}>
            <div className="w-full h-screen ">
                <Map 
                    // zoom={12} 
                    defaultCenter={center}
                    defaultZoom={8}
                    // center={center}
                    mapId= {GOOGLE_MAP_ID}
                >
                    {dataa.map((place) => (
                        <AdvancedMarker position={{lat: parseFloat(place.latitude), lng: parseFloat(place.longitude)}}>
                                    {place.service === "fibre" && <img src="images/fibre-pin.png" className="w-5 h-5" alt="" />}
                                    {place.service === "p2p/ptmp" && <img src="images/tower-pin.png" className="w-5 h-5" alt="" />}
                                    {place.service === "wifi" && <img src="images/wifi-pin.png" className="w-5 h-5" alt="" />}
                        </AdvancedMarker>  
                    ))}
                  
                


                    {/* {MarkerOpen && <InfoWindow position={center}> 
                        <p> This marker</p>
                    </InfoWindow>} */}
                </Map>
            </div>
        </APIProvider>

    )
}
}


// export async function loader({request,}: LoaderFunctionArgs) {

//     //     try {
//     //     const sls = await fetchServiceLocations(); // Default values or use your state values
//     //     // Return the data to be used in the component
//     //     return sls;
//     //   } catch (error: any) {
//     //     console.error('Error fetching data:', error.message);
//     //     return { status: 500, error: 'Internal Server Error' };
//     //   }
//     const location = useLocation()

//     const searchParams = new URLSearchParams("directory/");
//     console.log(location)
//     console.log(searchParams.get('lat')); // Output: 7.800
//     console.log(searchParams.get('lng')); // Output: 3.8656

//     // console.log("request: ", request)

//     return json({});
// };


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