import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node"
import { Form, isRouteErrorResponse, Link, useActionData, useLoaderData, useParams, useRouteError } from "@remix-run/react"
import { useCurrentUserContext } from "~/api/auth";
import { fetchData, fetcherProps, getUrl } from "~/api/util";
import { akure_property } from "~/data";
import { currentToken } from "~/session.server";
import { DomWrapper } from "~/ui/dom-wrapper";
// import { loader } from "./property.$propID";



export default function PaymentPlanRent() {
    const params = useParams()
    const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    
    console.log(loaderData)
    return <>


        <div className="w-full h-screen bg-purple-50 flex justify-center items-center ">
    

                <div className="w-full flex flex-col gap-2 py-2 border">
                    <Form  method="post" className="flex flex-col gap-2 ">
                        <input type='text' name="bid" className="p-2 border" placeholder="Type in here" />
                        {/* <input type='text' hidden name="price" value="09" className="p-2" placeholder="Type in here" /> */}
                        <button type='submit' className="rounded-md py-1 px-2 bg-purple-500 text-gray-800 border"> Rent: {params.propID} </button> 
                    </Form>  

                    <Link to={`/property/--/payment-plans/installments`} className="rounded-md hidden py-1 px-2 bg-gray-200 text-gray-800  justify-center"> Pay in installments </Link>                  
                </div>

        </div>
    
    </>

}




export async function loader({request, params}: LoaderFunctionArgs) {
    console.log("Property rental loader")
    const token = await currentToken(request)
    const listing_id = params.propID

    const context_args: fetcherProps = {
        endpoint: getUrl('user-context'), 
        method: 'GET',
        token:  token
    }

    let ctx = await fetchData(context_args);


    const args: fetcherProps = {
        endpoint: getUrl('rentals'), 
        method: 'POST',  
    }
    let rental = await fetchData(args);


    
    
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



export function ErrorBoundary() {
    const error = useRouteError()
  
    console.log("Error: ", error)
    // when true, this is what used to go to `CatchBoundary`
    if (isRouteErrorResponse(error)) {
      const client: boolean = error.status >= 400 && error.status < 500
      const props = client ? { status: error.status } : {}
      //const Component = client ? Errors['400'] : Errors['500']
  
      // return (
      //   <DomWrapper>
      //     <div className="flex h-full w-full items-center justify-center">
      //       <Component {...props} />
      //     </div>
      //   </DomWrapper>
      // )
      return(
        <DomWrapper>
          <div className="flex h-full w-full text-gray-950 items-center justify-center">
            Oops!! Something happened on Sign Up.
          </div>
        </DomWrapper>
      )
    }
  
    return (
        <div className="flex h-full w-full text-red-600 items-center justify-center">
          Oops!! Something happened.
        </div>
    )
}