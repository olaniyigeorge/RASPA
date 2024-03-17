import { useLoadScript } from "@react-google-maps/api"
import { getEnvVar } from "~/api/util"




export default function WTADirectory() {

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: getEnvVar("GOOGLE_API_KEY"),
        libraries: ['places'],
    })

    if (!isLoaded) return <Apploader />;

    return <DirectoryMap /> 
}




function DirectoryMap() {
    
}