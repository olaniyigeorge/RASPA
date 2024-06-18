import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node"
import { Form, Link, useActionData, useLoaderData, useParams } from "@remix-run/react"
import { akure_property } from "~/data"


export default function PaymentPlanBuyNow() {
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
        <div className="w-full h-screen p-2 bg-white  flex justify-center items-center ">
            <div className="w-full flex flex-col gap-2">
                    <Form  method="post" className="flex flex-col gap-2">
                        <input type='text' name="bid" className="p-2" placeholder="Type in here" />
                        <input type='text' hidden name="price" value={akure_property[id].price} className="p-2" placeholder="Type in here" />
                        <button type='submit' className="rounded-md py-1 px-2 bg-green-500 text-gray-800 border"> Buy: {params.propID} </button> 
                    </Form>  

                    <Link to={`/property/${akure_property[id].id}/payment-plans/installments`} className="rounded-md py-1 px-2 bg-gray-200 text-gray-800 flex justify-center"> Pay in installments </Link>                  
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