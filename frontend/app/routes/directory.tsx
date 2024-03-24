// *use client*;


import { Circle } from "@react-google-maps/api"
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
import { dataa, serviceLocation } from "~/components/data"

type LatLngLiteral = google.maps.LatLngLiteral

export default function Directory() {
    // const position = { lat: 7.256, lng: 5.206 }
    const center = useMemo<LatLngLiteral>(() => ({ lat: 6.7874652, lng: 3.3836684 }), [])
    const [selectedLocation, setSelectedLocation] = useState<serviceLocation | null>(null)
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
                    defaultZoom={11}
                    // center={center}
                    mapId= {GOOGLE_MAP_ID}
                > 
                    {dataa.map((place) => (
                        <AdvancedMarker 
                            onClick={() => setSelectedLocation(place)}
                            position={{lat: parseFloat(place.latitude), lng: parseFloat(place.longitude)}}>
                                    {place.service === "fibre" && <img src="images/fibre-pin.png" className="w-10 h-10" alt="" />}
                                    {place.service === "p2p/ptmp" && <img src="images/tower-pin.png" className="w-10 h-10" alt="" />}
                                    {place.service === "wifi" && <img src="images/wifi-pin.png" className="w-10 h-10" alt="" />}
                        </AdvancedMarker>  
                    ))}
                  
                    {/* Render InfoWindow */}
                    {selectedLocation !== null && (
                        <InfoWindow
                            position={{lat:parseFloat(selectedLocation.latitude), lng:parseFloat(selectedLocation.longitude)}}
                            onCloseClick={() => setSelectedLocation(null)} // Close the InfoWindow
                        >
                            {/* Render the content inside the InfoWindow */}
                            <div className="w-60 space-y-1 rounded-lg p-1 shadow-lg">
                            <div className="flex items-start justify-between">
                                <img
                                src={selectedLocation.sl_operator_info.brand_logo}
                                alt={selectedLocation.sl_operator_info.name}
                                />
                                <p className="text-2xl font-medium">
                                {selectedLocation.speed}
                                </p>
                            </div>
                            <div className="text-lg font-bold">
                                <h2>ISP: {selectedLocation.sl_operator_info.name}</h2>
                            </div>
                            <div className="whitespace-normal font-light">
                                <p className="sm:text-md whitespace-normal text-sm">
                                {selectedLocation.description}
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
                            position={center}
                        />
                    )}

                    {selectedLocation && (
                        <Circle
                            center={center}
                            radius={
                                selectedLocation.service === "fibre" ? 5000 :
                                selectedLocation.service === "p2p/ptmp" ? 8000 :
                                selectedLocation.service === "wifi" ? 3000 : 3000  // Set a default value if none of the conditions match
                            }
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




const circleOptions = { 
    fillColor: '#FBC02D',
    fillOpacity: 0.1,
    zIndex: 2,
    strokeColor: '#FC911F',
    clickable: false,
    editable: false,
    draggable: false,
    visible: true,
    strokeWeight: 2,
  }
  

