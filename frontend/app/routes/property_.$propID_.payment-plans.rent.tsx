import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { Form, Link, useActionData, useLoaderData, useParams } from "@remix-run/react"
import { akure_property } from "~/data";



export default function PaymentPlanRent() {
    const params = useParams()
    const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const last  = loaderData?.listing_id.slice([-1]) ?? "get"

    const id = Number(last) - 1

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

                <div className="w-1/2 p-2 flex flex-col gap-3">
                    <Form  method="post" className="flex flex-col gap-2">
                        <input type='text' name="bid" className="p-2" placeholder="Type in here" />
                        <input type='text' hidden name="price" value={akure_property[id].price} className="p-2" placeholder="Type in here" />
                        <button type='submit' className="rounded-md py-1 px-2 bg-yellow-500 text-gray-800 border"> Rent: {params.propID} </button> 
                    </Form>  

                    <Link to={`/property/${akure_property[id].id}/payment-plans/installments`} className="rounded-md py-1 px-2 bg-gray-200 text-gray-800"> Pay in installments </Link>                  
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
    const form = await request.formData()
    
    const bid = (form.get("bid") || "").toString();
    const price = (form.get("price") || "").toString();
    console.log("Bid:", bid)
    console.log("Price: ", price)
    
    return {}
  }