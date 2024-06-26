import {  CheckCircleIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Payment } from "~/api/interfaces";
import { fetchData, getUrl } from "~/api/util";






export default function ConfirmPayment() {
    const loaderData = useLoaderData<typeof loader>()
    const status = loaderData.payment?.status
    console.log(loaderData.payment)


    return <div className="w-full h-screen relative z-1000 flex justify-center items-center bg-opacity-60 bg-purple-100">

        <span className="rounded-full  text-xl font-medium text-white  flex justify-center   w-[200px] h-[200px] text-white font-medium  transition ease-in- out transform duration-3000 animate-fadeIn items-center  absolute ">
            
            {/* {
                if (status == "pending")  {
                    <CheckCircleIcon className="text-white font-medium text-2xl" />
                }
                else {
                    ""
                } 
            }           */}

            {
                status == "pending" ? (
                    <CheckCircleIcon className="text-green-600 rounded-full w-full object-cover  transition ease-in- out transform duration-4000 animate-fadeIn font-medium text-2xl" />
                )
                :
                (
                    <XMarkIcon className="text-white rounded-full w-full object-cover bg-red-600 transition ease-in- out transform duration-4000 animate-fadeIn font-medium text-2xl"/>
                )
            } 

        </span>
    
    </div>
}




export async function loader({request, params}: LoaderFunctionArgs) {


    const payment_id = params.payment_id
    console.log("EP: ",  getUrl("payments", `${payment_id}`))
    const paymentResponse = await fetchData({
                        endpoint: getUrl("payments", `${payment_id}`),
                        method: "GET",
                        })

    let payment: any

    console.log("res: ", paymentResponse)

    if (paymentResponse.status == 200) {
        payment = paymentResponse.body
    }
    
    console.log("Payment: ", paymentResponse.body)
    return ({payment})

}


