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
                                    {place.service === "fibre" && <img src="images/fibre-pin.png" className="w-10 h-10" alt="" />}
                                    {place.service === "p2p/ptmp" && <img src="images/tower-pin.png" className="w-10 h-10" alt="" />}
                                    {place.service === "wifi" && <img src="images/wifi-pin.png" className="w-10 h-10" alt="" />}
                        </AdvancedMarker>  
                    ))}
                  
                    {/* Render InfoWindow */}
                {selectedMarker && (
                <InfoWindow
                    position={selectedMarker.coordinates}
                    onCloseClick={() => setSelectedMarker(null)} // Close the InfoWindow
                >
                    {/* Render the content inside the InfoWindow */}
                    <div className="w-60 space-y-1 rounded-lg p-1 shadow-lg">
                    <div className="flex items-start justify-between">
                        <img
                        src={selectedMarker.ispLogo}
                        alt={selectedMarker.ispName}
                        />
                        <p className="text-2xl font-medium">
                        {selectedMarker.serviceSpeed}
                        </p>
                    </div>
                    <div className="text-lg font-bold">
                        <h2>ISP: {selectedMarker.ispName}</h2>
                    </div>
                    <div className="whitespace-normal font-light">
                        <p className="sm:text-md whitespace-normal text-sm">
                        {selectedMarker.serviceDescription}
                        </p>
                    </div>
                    <div className="flex justify-around space-x-2 font-medium">
                        <button className="flex items-center justify-center space-x-1 rounded-lg bg-wtaorange p-2">
                        <img className="h-2 w-2" src="/images/contact.png" />
                        <p>Contact Us</p>
                        </button>
                        <button className="flex items-center justify-center space-x-1 rounded-lg border border-wtaorange p-2">
                        <p> Explore service</p>
                        <img className="h-2 w-2" src="/images/explore.png" />
                        </button>
                    </div>
                    </div>
                </InfoWindow>
                )}
        
            {location && (
              <Marker
                icon="images/location-marker-pin.png"
                position={location}
              />
            )}
            {coverage && service && (
              <Circle
                center={location}
                radius={coverage}
                options={circleOptions}
              />
            )}
                


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