import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { Form, Link, Outlet, useActionData, useLoaderData, useParams } from "@remix-run/react"
import { PropertyListing } from "~/api/interfaces";
import { fetchData, fetcherProps, getUrl } from "~/api/util";
import { akure_property } from "~/data";
import property from "./property";



export default function PaymentPlanLayout() {
    const params = useParams()
    const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    
    const property: PropertyListing = loaderData?.property

    return <>


        <div className="w-full h-screen bg-purple-50 flex justify-center items-center ">
            <div className="bg-white shadow flex w-1/2 h-[500px] rounded-lg ">
                <div className="w-1/2 flex flex-col p-10 border-r">
                    <div className="">
                        <h1 className="text-3xl font-bold">
                            {property.property.name}
                        </h1>


                        <p className=" ">
                            Address: {property.property.address}
                        </p>

                        <p className=" ">
                            Price: {property.price} Naira
                        </p>
                        <p className=" ">
                            Size: {property.property.size} meters square
                        </p>
                        <p className=" ">
                            Listed by: {property.property.manager?.display_name}
                        </p>
                        <p className=" ">
                            Amenities: {property.property.manager?.display_name}
                        </p>


                    </div>
        
                </div>

                <div className="w-1/2 bg-white  p-2 flex flex-col gap-3">
                    <Outlet />
                </div>
                
            </div>
        </div>
    
    </>

}




export async function loader({request, params}: LoaderFunctionArgs) {
    // console.log(request)
    const listing_id = params.propID

    const args: fetcherProps = {
        endpoint: getUrl('listings', `${listing_id}`),
        method: 'GET',  
    } 
    console.log("FetchProps: ", args)
    const property = await fetchData(args);
        
    return json({property})
}



export async function action({request,}: ActionFunctionArgs) {
    const currUrl = new URL(request.url)

    return {}
  }