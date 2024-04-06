import { LoaderFunctionArgs } from "@remix-run/node"
import { useParams } from "@remix-run/react"


export default function PaymentPlanBuyNow() {

    const params = useParams()


    return <>
        <div className="w-full h-screen flex justify-center items-center ">
            <div className="bg-purple-500 w-1/2 h-[500px] rounded-lg ">
                <p className="p-10 text-white"> Buy {params.propID}</p>
            </div>
        </div>
    
    </>

}



export async function loader({request,}: LoaderFunctionArgs) {
    console.log(` --- ${request.url} ------`)
    // get listing id from url, return listing attr
    return {}
}