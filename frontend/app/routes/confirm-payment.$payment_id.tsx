import {  CheckCircleIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { Payment } from "~/api/interfaces";
import { fetchData, getUrl } from "~/api/util";
import { useCurrentUserContext } from "~/api/auth";






export default function ConfirmPayment() {
    const loaderData = useLoaderData<typeof loader>()
    const ctx = useCurrentUserContext()
    const payment = loaderData.payment
    const status = loaderData.payment?.status
    console.log(loaderData.payment)


    return <div className="w-full h-screen flex justify-center items-center  bg-purple-100">

        <span className="rounded-lg shadow bg-white bg-opacity-40 text-xl w-full sm:w-3/5  sm:flex justify-center   text-gray-800 transition ease-in- out transform duration-3000 animate-fadeIn items-center  absolute ">

                <Form  method="post" className="w-full flex flex-col text-gray-800space-y-2 p-3">
                    <>
                    <div className="sm:flex w-full justify-between items-center">
                        <div className="w-full sm:w-1/2">
                            <div className="flex flex-col">
                                <p>Payer</p>
                                <input type="text" name="payer" placeholder={`${payment.payer}`} className=" border-0 outline-none p-2 ring-0 w-full rounded-md bg-white font-medium text-lg text-purple-600" />
                            </div>
                            <div className="flex flex-col">
                                <p>Amount</p>
                                <input type="text" name="amount" placeholder={`${payment.amount}`} className=" border-0 outline-none p-2 ring-0 rounded-md bg-white font-medium text-lg text-purple-600" />
                            </div>
                            <div className="flex flex-col">
                                <p>Payment Provider</p>
                                <input type="text" name="payment_provider" placeholder={`${payment.payment_provider}`} className=" border-0 outline-none p-2 ring-0 rounded-md bg-white font-medium text-lg text-purple-600" />
                            </div>
                            <div className="flex flex-col">
                                <p>Datetime</p>
                                <input type="date" name="date" placeholder={`${payment.date}`} className=" border-0 outline-none p-2 ring-0 rounded-md bg-white font-medium text-lg text-purple-600" />
                            </div>
                            <div className="flex flex-col">
                                <p>Status</p>
                                <input type="text" name="status" placeholder={`${payment.status}`} className=" border-0 outline-none p-2 ring-0 rounded-md bg-white font-medium text-lg text-purple-600" />
                            </div>
                        </div>
                        <span className="w-full animate-pulse sm:w-1/2">
                                {
                                    status === "pending" ? (
                                        <CheckCircleIcon className="text-blue-600 animate-pulse rounded-full w-full h-full object-cover transition ease-in-out transform duration-4000 font-medium text-2xl" />
                                    ) : status === "failed" ? (
                                        <XMarkIcon className="text-white animate-pulse rounded-full w-full h-full object-cover bg-red-600 transition ease-in-out transform duration-4000 font-medium text-2xl" />
                                    ) : status === "successfull" ? (
                                        <CheckCircleIcon className="text-green-600 animate-pulse rounded-full w-full h-full object-cover transition ease-in-out transform duration-4000 font-medium text-2xl" />
                                    )  : status === "denied" ? (
                                        <XMarkIcon className="text-red-600 animate-pulse rounded-full w-full h-full object-cover  transition ease-in-out transform duration-4000 font-medium text-2xl" />
                                    ) : null
                                }
                        </span>
                    </div>

                    
                        {ctx ? (<div className="w-full flex  justify-between items-center">

                                    <button type="submit" value="Edit" className="p-2 border rounded-md bg-green-600 text-white cursor-pointer"> Edit </button> 
                                    <Link to="/sign-out" className="p-2 border rounded-md bg-red-500 text-white"> sign out</Link>
      
                        </div>) :
                        ""
                        }




    
                    </>
                </Form>

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

    let payment: Payment | any

    console.log("res: ", paymentResponse)

    if (paymentResponse.status == 200) {
        payment = paymentResponse.body
    }
    
    console.log("Payment: ", paymentResponse.body)
    return ({payment})

}


