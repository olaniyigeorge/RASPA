import { LoaderFunctionArgs } from "@remix-run/node"
import { Outlet } from "@remix-run/react"
import Header from "~/components/header"




export default function Property() {


    return <>
        <Header mode={'light'} />


        <div className="">
            <Outlet />
        </div>
        
    </>
} 




export async function loader({request,}: LoaderFunctionArgs) {
    

    return {}
}