// *use client*;


import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin, 
    InfoWindow

} from "@vis.gl/react-google-maps"
import { useState } from "react"
import { LoaderFunctionArgs } from "react-router"
import { getEnvVar } from "~/api/util"

export default function ExploreMaps() {
    const position = { lat: 7.256, lng: 5.206 }
    const [MarkerOpen, setMarkerOpen] = useState<boolean>(false)
    const GOOGLE_API_KEY = getEnvVar('GOOGLE_MAPS_API_KEY')
    return (
        <APIProvider apiKey={GOOGLE_API_KEY}>
            <div className="w-full h-screen ">
                <Map 
                    zoom={10} 
                    center={position}
                >
                <AdvancedMarker position={position}>
                        <Pin>@</Pin>
                </AdvancedMarker>
                {/* {selectedLocations.map(locatn => (
                    <Marker
                        position={locatn.coordinates}
                        onClick={() => setSelectedMarker(locatn)} // Set the selected marker when clicked}
                        icon={locatn.serviceIcon}
                    /> */}
                    {MarkerOpen && <InfoWindow position={position} onCloseClick={() => {setMarkerOpen(!MarkerOpen)}}> 
                        <p> This marker</p>
                    </InfoWindow>}
            
                </Map>
            </div>
        </APIProvider>

    )
}


export async function loader({request,}: LoaderFunctionArgs) {
    const currUrl = new URL(request.url)
    const action: string = currUrl.searchParams.get('action') ?? ''
    const search: string = currUrl.searchParams.get('search') ?? ''

    // if the 
    console.log(currUrl)
    return {currUrl}
}