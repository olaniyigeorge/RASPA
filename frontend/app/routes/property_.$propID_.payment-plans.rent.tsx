import { LoaderFunctionArgs } from "@remix-run/node"
import { Form, Link, useParams } from "@remix-run/react"

export default function PaymentPlanRent() {
    const params = useParams()

    return <>


        <div className="w-full h-screen bg-purple-50 flex justify-center items-center ">
            <div className="bg-white shadow flex w-1/2 h-[500px] rounded-lg ">
                <div className="w-1/2 flex flex-col p-10 border-r">
                    <div className="w-full h-1/2">Images</div>
                    <div className="w-full h-1/2">Property Info: Invest in {params.propID} </div>
                </div>

                <div className="w-1/2 p-2">
                    <Form method="post">
                        <button className="rounded-md py-1 px-2 bg-red-500 text-white">Rent {params.propID}</button>
                        <Link to="" className="rounded-md py-1 px-2 bg-gray-200 text-gray-800">Pay in installments</Link>
                    </Form>
                    
                </div>
                
            </div>
        </div>
    
    </>

}



export async function loader({request,}: LoaderFunctionArgs) {


    return {}
}