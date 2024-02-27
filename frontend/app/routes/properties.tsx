import { json, LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"



export default function Properties() {
    const data = useLoaderData<typeof loader>()


    return <div className="p-10 text-3xl">
        Properties
    </div>
}



export async function loader({request,}: LoaderFunctionArgs) {


    return {}
}