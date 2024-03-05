

interface Action {
    type: string;
}

interface Amenity {
    type: string;
}
export interface IProperty {
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
        <div className="w-full h-full rounded-lg relative">
            <img src={property.cover_image} alt="" className="" />

            <div className="">
                <p>{property.property_name}</p>
                <p>{property.amenities.length}</p>
                <p>{property.address}</p>
                <p>{property.agent}</p>
            </div>

            <p className="absolute p-2 top-1 left-1 rounded-md bg-white shadow">Action</p>
            <p className="absolute p-2 top-1 right-1 rounded-md bg-white shadow">City</p>

        </div>
    </>
}


export const akure_property = [
    {
        cover_image: "images/residential-properties.png",
        property_name: "Olukayode Complex",
        price: 150000,
        action: "rent",
        address: "Oba Adesida road",
        agent: "Zalasoft",
        amenities: "Fenced, Gated",
    },
    {
        cover_image: "images/commercial-properties.png",
        property_name: "RealPlus",
        price: 1000000,
        action: "rent",
        address: "Adj High Court",
        agent: "Faye Property",
        amenities: "Fenced, Gated",
    },
    {
        cover_image: "images/industrial-properties.png",
        property_name: "RayBus",
        price: 50000000,
        action: "sale",
        address: "Opp Mobil filling station, Arakale",
        agent: "The King Condos",
        amenities: "Fenced, Gated",
    },
]