import { Link } from "@remix-run/react";


interface Action {
    type: string;
}

interface Amenity {
    type: string;
}
export interface IProperty {
    id: string;
    cover_image: string;
    property_name: string;
    price: number;
    action: string; // Action[];
    address: string;
    agent: string;
    amenities: string; // Amenity[]
}


export default function PropertyCard(props: IProperty){
    const property = {...props}
    
    return <>
        <Link to={`/property/${property.id}`} className="w-full h-full rounded-lg relative border shadow p-1">
            <p className="absolute p-2 top-2 left-2 rounded-md bg-white capitalize shadow">{property.action}</p>
            <p className="absolute p-2 top-2 right-2 rounded-md bg-white shadow">City</p>
            
            <img src={property.cover_image} alt="" className="h-60 w-full" />

            <div className="">
                <p className="">{property.property_name}</p>
                <p className="">{property.amenities.length}</p>
                <p className="">{property.address}</p>
                <p className="">{property.agent}</p>
            </div>

            
        </Link>
    </>
}


export const akure_property = [
    {
        id: "rasp-1",
        cover_image: "images/frame-15.png",
        property_name: "Olukayode Complex",
        price: 150000,
        action: "rent",
        address: "Oba Adesida road",
        agent: "Zalasoft",
        amenities: "Fenced, Gated",
    },
    {
        id: "rasp-2",
        cover_image: "images/frame-16.png",
        property_name: "RealPlus",
        price: 1000000,
        action: "rent",
        address: "Adj High Court",
        agent: "Faye Property",
        amenities: "Fenced, Gated",
    },
    {
        id: "rasp-3",
        cover_image: "images/frame-17.png",
        property_name: "RayBus",
        price: 50000000,
        action: "sale",
        address: "Opp Mobil filling station, Arakale",
        agent: "The King Condos",
        amenities: "Fenced, Gated",
    },
]