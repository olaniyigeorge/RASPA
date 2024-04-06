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
    size: number;
    bdr: number;
    btr: number;
    action: string; // Action[];
    address: string;
    agent: string;
    amenities: string; // Amenity[]
}


export default function PropertyCard(props: IProperty){
    const property = {...props}
    
    return <>
        <Link to={`/property/${property.id}`} className="shadow bg-white w-full md:w-[350px] h-[400px] rounded-lg relative  p-1">
            <div className="h-[200px] w-full">
                <img src={property.cover_image} alt="" className="hover:scale-[102%] rounded-lg h-[200px] w-full" />
            </div>

            <div className="h-auto w-full space-y-1 text-gray-900 mt-2">
                <span className="flex justify-between items-center space-x-2">
                    <p className="w-2/3 font-bold text-lg">{property.property_name}</p>
                    <p className="w-1/3 text-sm">{property.agent}</p>
                </span>
                
                <span className="flex justify-start space-x-2">
                    <p className=""><b>{property.size}</b> sqft</p>
                    <p className=""><b>{property.bdr}</b> Bedrooms</p>
                    <p className=""><b>{property.btr}</b> Bathrooms</p>
                </span>

                <div className="">
                    <p className="font-medium"> Address</p>
                    <p className="line-clamp-2">{property.address}</p>
                </div>
                
                <div className="flex justify-between items-center">
                    <div className="w-[200px]">
                        <p className="font-medium">NGN {" "}{property.price}</p>
                        <p className="text-sm">Spread payments across 6 months</p>
                    </div>

                    <div className="w-[150px] flex flex-col text-sm gap-1 ">
                        <Link
                            className=" p-1 flex justify-center items-center w-full rounded-full bg-gray-200 hover:bg-gray-300 text-gray-900"
                            to={`/property/${property.id}/payment-plans/installments`}>
                            Pay in installments
                        </Link>
 
                        <Link 
                            className=" p-1 flex justify-center items-center w-full rounded-full bg-green-500 hover:bg-green-600 text-white"
                            to={`/property/${property.id}/payment-plans/buy-now`}>
                            Buy Now
                        </Link>
                    </div>
                </div>

                
            </div> 

            <button className="absolute shadow bg-purple-600 text-white p-2 md:top-2 z-10 md:left-2 rounded-md capitalize shadow">{property.action}</button>
            <button className="absolute shadow bg-purple-600 text-white p-2 md:top-2 z-10 md:right-2 rounded-md  shadow">City</button>
            
        </Link>
    </>
}


export const akure_property = [
    {
        id: "rasp-1",
        cover_image: "images/frame-15.png",
        property_name: "Olukayode Complex",
        price: 150000,
        size: 1250,
        bdr: 5,
        btr: 4,
        action: "sale",
        address: "Oba Adesida road",
        agent: "Zalasoft",
        amenities: "Fenced, Gated",
    },
    {
        id: "rasp-2",
        cover_image: "images/frame-16.png",
        property_name: "RealPlus",
        price: 1000000,
        size: 1250,
        bdr: 5,
        btr: 4,
        action: "sale",
        address: "Adj High Court",
        agent: "Faye Property",
        amenities: "Fenced, Gated",
    },
    {
        id: "rasp-3",
        cover_image: "images/frame-17.png",
        property_name: "RayBus",
        price: 50000000,
        size: 1250,
        bdr: 5,
        btr: 4,
        action: "sale",
        address: "Opp Mobil filling station, Arakale",
        agent: "The King Condos",
        amenities: "Fenced, Gated",
    },
    {
        id: "rasp-4",
        cover_image: "images/frame-17.png",
        property_name: "Olukayode House",
        price: 150000000,
        size: 1250,
        bdr: 5,
        btr: 4,
        action: "sale",
        address: "No.2, Oba Adesida road, Akure",
        agent: "Zalasoft",
        amenities: "floored compound, gated",
    },
]