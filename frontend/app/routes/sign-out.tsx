
import { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "react-router"
import { currentSession, storage } from "~/session.server";



export default function() {
    return <div className="w-full h-full text-xl font-extrabold">
               <p> Goodluck! You are not supposed to see this. </p>
    </div>
}



export async function loader({request,}: LoaderFunctionArgs){
    const session = await currentSession(request);
    
    const signout: string = await storage.destroySession(session)

    return redirect('/', {
        headers: {
          "Set-Cookie": await storage.destroySession(session),
        },
      });
}

