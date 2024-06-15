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


export default function PropertyCard(props: IProperty){
    const property = {...props}
    
    return <div className="shadow items-start flex flex-col justify-between bg-white relative w-full rounded-lg  p-1">
        <Link to={`/property/${property.id}`} className="w-full">
            <div className="w-full h-[180px] object-contin">
                <img src={property.cover_image} alt="" className="w-full h-full object-filll hover:scale-[102%] rounded-lg " />
            </div>

            <div className=" w-full space-y-1  text-gray-900 mt-2">
                <span className="w-full flex justify-between items-center ">
                    <p className="font-bold text-lg">{property.property_name}</p>
                    <p className=" text-sm">{property.agent}</p>
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
                                property.action === "sale" ? "buy-now" : 
                                property.action ==="rent"? "rent" : 
                                property.action ==="invest"? "invest"
                                : ""}`
                            }
                    >
                        {
                                property.action === "sale" ? "buy-now" : 
                                property.action ==="rent"? "rent" : 
                                property.action ==="invest"? "invest": ""
                        }
                    </Link>
                </div>
            </div>

            
        </Link>
        <button className="absolute  bg-purple-600 text-white p-2 top-2 z-10 left-2 rounded-md capitalize shadow">{property.action}</button>
        <button className="absolute bg-purple-600 text-white p-2 top-2 z-10 right-2 rounded-md  shadow">City</button>
            
    </div>
}







{/* <Link to={`/property/${property.id}`} className="shadow bg-white w-full md:w-[350px] h-[400px] rounded-lg relative  p-1">
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
                        <p className="text-xs ">Spread payments across 6 months</p>
                    </div>

                    <div className="w-[150px] flex flex-col text-sm gap-1 ">
                        <Link
                            className=" p-1 flex justify-center items-center w-full rounded-full bg-gray-200 hover:bg-gray-300 text-gray-900"
                            to={`/property/${property.id}/payment-plans/installments`}>
                            Pay in installments
                        </Link>
 
                        <Link 
                            className=" p-1 flex capitalize justify-center items-center w-full rounded-full bg-green-500 hover:bg-green-600 text-white"
                            to={
                                `/property/${property.id}/payment-plans/${
                                    property.action === "sale" ? "buy-now" : 
                                    property.action ==="rent"? "rent" : 
                                    property.action ==="invest"? "invest"
                                    : ""}`
                                }
                        >
                            {
                                    property.action === "sale" ? "buy-now" : 
                                    property.action ==="rent"? "rent" : 
                                    property.action ==="invest"? "invest": ""
                            }
                        </Link>
                    </div>
                </div>

                
            </div> 

            <button className="absolute  bg-purple-600 text-white p-2 md:top-2 z-10 md:left-2 rounded-md capitalize shadow">{property.action}</button>
            <button className="absolute bg-purple-600 text-white p-2 md:top-2 z-10 md:right-2 rounded-md  shadow">City</button>
            
        </Link>
 */}




