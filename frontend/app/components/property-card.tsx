import { Link } from "@remix-run/react";
import { Feature, ownerType, PropertyListing } from "~/api/interfaces";


interface Action {
    type: string;
}

interface Amenity {
    type: string;
}
export interface IProperty {
    id: string;
    cover_image: string;
    description: string;
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

export type Property = {
    id: string;
  
    name: string;
    type: string;
    size: number;
    actions: string;
    propertyImages: Object[];
    listing_type: string;
    description: string;
    owner: ownerType;
    manager: ownerType;
    property__type: string;
    latitude: string;
    longitude: string;
    address: string;
    amenities: Amenity[];
    features: Feature[];
  
  }

export default function PropertyCard(props: PropertyListing){

    const property = {...props}
    console.log("Prop: ", property)
    
    
    return <div className="shadow items-start flex flex-col justify-between bg-white relative w-full rounded-lg  p-1">
        <Link to={`/property/${property.id}`} className="w-full">
            <div className="w-full h-[180px] object-contin">
                <img src={property.listing_type} alt="" className="" />

                {
                        property?.property?.propertyImages[0] ? (
                            <img src={`http://localhost:8000${property?.property?.propertyImages[0].image}`} alt={`http://localhost:8000${property?.property?.propertyImages[0].image}`} className="w-full h-full object-fill hover:scale-[102%] rounded-lg "/>
                        )
                        :
                        <span className="flex w-full h-full justify-center bg-red-100 items-center object-filll hover:scale-[102%] rounded-lg ">
                            <p className="text-gray-800 font-medium"> No Images </p> 
                        </span>
                }  
            </div>

            <div className=" w-full space-y-1  text-gray-900 mt-2">
                <span className="w-full flex justify-between items-center ">
                    <p className="font-bold text-lg capitalize">{property.property.name}</p>
                    <p className=" text-sm">{
                    property.property.manager ? 
                    property.property.manager.display_name : "RASP"}</p>
                </span>
                
                {
                    property.property.features ? (
                    
                    <span className="flex justify-start space-x-2">
                        
                        {property.property.features.map((f: Feature) => (
                                <p className=""><b>{f.count}</b> {f.name}</p>
                        ))}
                    </span>)
                    :
                    
                    ""
                }   

                <div className="">
                    <p className="font-medium"> Address</p>
                    <p className="line-clamp-2">{property.property.address}</p>
                </div>
            </div>
                
            <div className="flex justify-between  items-center">
                <div className="">
                    <p className="font-medium">NGN {" "}{property.price}</p>
                    <p className="text-xs ">Spread payments across 6 months</p>
                </div>

                <div className=" flex flex-col text-sm gap-1 ">
                    <Link
                        className=" p-1 flex justify-center items-center w-full rounded-full bg-gray-200 hover:bg-gray-300 text-gray-900"
                        to={`/property/${property.id}/payment-plans/installments`}>
                        Pay in installments
                    </Link>

                    <Link 
                        className=" p-1 flex capitalize justify-center items-center w-full rounded-full bg-green-500 hover:bg-green-600 text-white"
                        to={
                            `/property/${property.id}/payment-plans/${
                                property.listing_type === "sale" ? "buy-now" : 
                                property.listing_type ==="rent"? "rent" : 
                                property.listing_type ==="invest"? "invest"
                                : ""}`
                            }
                    >
                        {
                                property.listing_type === "sale" ? "buy-now" : 
                                property.listing_type ==="rent"? "rent" : 
                                property.listing_type ==="invest"? "invest": ""
                        }
                    </Link>
                </div>
            </div>

            
        </Link>
        <button className="absolute  bg-purple-600 text-white p-2 top-2 z-10 left-2 rounded-md capitalize shadow">{property.listing_type}</button>
        <button className="absolute bg-purple-600 text-white p-2 top-2 z-10 right-2 rounded-md  shadow">City</button>
            
    </div>
}



