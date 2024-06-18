import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { Form, Link, Outlet, useActionData, useLoaderData, useParams } from "@remix-run/react"
import { akure_property } from "~/data";



export default function PaymentPlanRent() {
    const params = useParams()
    const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    
    let id: any
     
    if (loaderData.listing_id) {
        id = loaderData.listing_id
    } else {
        id =1
    }
    console.log(id)

    return <>


        <div className="w-full h-screen bg-purple-50 flex justify-center items-center ">
            <div className="bg-white shadow flex w-1/2 h-[500px] rounded-lg ">
                <div className="w-1/2 flex flex-col p-10 border-r">
                    <div className="">
                        <h1 className="text-3xl font-bold">
                            {akure_property[id].property_name}
                        </h1>


                        <p className=" ">
                            Address: {akure_property[id].address}
                        </p>

                        <p className=" ">
                            Price: {akure_property[id].price} Naira
                        </p>
                        <p className=" ">
                            Size: {akure_property[id].size} meters square
                        </p>
                        <p className=" ">
                            Listed by: {akure_property[id].agent}
                        </p>
                        <p className=" ">
                            Amenities: {akure_property[id].amenities}
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
    
    
    return json({listing_id})
}



export async function action({request,}: ActionFunctionArgs) {
    const currUrl = new URL(request.url)

    return {}
  }