import { LoaderFunctionArgs } from "@remix-run/node"




export default function ThisProperty() {


    return <>
        <h1 className="text-3xl font-bold">
            Property No. {}
        </h1>
    </>
} 




export async function loader({request,}: LoaderFunctionArgs) {
    

    return {}
}