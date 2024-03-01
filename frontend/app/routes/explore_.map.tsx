// *use client*;


import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin, 
    InfoWindow

} from "@vis.gl/react-google-maps"
import { useState } from "react"

export default function ExploreMaps() {
    const position = {lat:7.253290442692144, lng:5.195946395286964}
    const [MarkerOpen, setMarkerOpen] = useState<boolean>(false)
    return (
        <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY}>
            <div className="w-full h-screen ">
                <Map 
                    zoom={10} 
                    center={position}
                >
                <AdvancedMarker position={position}>
                        <Pin>@</Pin>
                    </AdvancedMarker>
                
                    {MarkerOpen && <InfoWindow position={position} onCloseClick={() => {setMarkerOpen(!MarkerOpen)}}> 
                        <p> This marker</p>
                    </InfoWindow>}
            
                </Map>
            </div>
        </APIProvider>

    )
}


