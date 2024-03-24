import { LoaderFunctionArgs } from "@remix-run/node"
import { Outlet } from "@remix-run/react"




export default function Property() {


    return <>
        <h1 className="text-3xl font-bold">
            Property layout
        </h1>

        <Outlet />
    </>
} 




export async function loader({request,}: LoaderFunctionArgs) {
    

    return {}
}