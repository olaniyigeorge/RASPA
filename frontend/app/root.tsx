import { ActionFunctionArgs, json, LinksFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import stylesheet from "~/styles/tailwind.css";
import tailwindStyles from '~/styles/app.css'
import { fetchNewAccessToken, UserContextProvider } from "./api/auth";
import { UserContext } from "./api/interfaces";
import { getUrl } from "./api/util";
import { getContext, hasAccess } from "./auth.server";
import { currentRefreshToken, currentToken, enableAuthenticableServerApiRequests, storage } from "./session.server";
import { DomWrapper } from "./ui/dom-wrapper";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: tailwindStyles},
  // { rel: "stylesheet", href: styles },
  // ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
  const data = useLoaderData<typeof loader>()
  

  return (
    <DomWrapper
      scripts={
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data?.ENVR)}`,
          }}
        />
      }
    >
      <UserContextProvider usrContext={data?.userContext}>
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </UserContextProvider>
    </DomWrapper>
  )
    };





export async function loader({request,}: LoaderFunctionArgs){
  // --------
  // console.log("Loading.......")
  
  let userContext: UserContext | null = null;
  const curntToken = await currentToken(request);

  // console.log(`Got token ${curntToken}`)
  if (!curntToken || curntToken == 'anonymous') {
    // Token is anonymous, set userContext to null
    userContext = null
  }

  //console.log("Check token validity");
  try {
    // Check if the current token is still valid
    // console.log("Confirming access------");
    const accessible = await hasAccess(request);
    //console.log(`Has access: ${accessible}`)

    if (accessible == '1') {
      userContext = await getContext(request)
    }
    else if (accessible == '2') {
      // Token validation failed with 400 status, attempt fetching new access token
      //console.log("Attempting token refresh.........")
      const refreshToken = await currentRefreshToken(request);
      
      if (refreshToken && refreshToken !== 'anonymous') {
        const fetchNewAccessResponse = await fetchNewAccessToken(refreshToken);

        if (fetchNewAccessResponse === null) {
          return "0";
        }

        //Use the new access token in subsequent requests if needed
        const session = await enableAuthenticableServerApiRequests(request, {
          token: fetchNewAccessResponse,
          refresh: refreshToken,
        });

        return redirect("/", {
          headers: {
            "Set-Cookie": await storage.commitSession(session),
          },
        });
      }
    }
    else {
      //console.log("No access, user is null")
      userContext = null
    }
    
  } catch (error) {
    //console.log("Error getting context")
    userContext = null

  }

  console.log("Node env: ", process.env["NODE_ENV"])
  console.log("Cookie name: ", process.env["APP_COOKIE_NAME"])
  console.log("Cookie name: ", process.env.APP_COOKIE_NAME)

  const ENVR = {
    APP_COOKIE_NAME: process.env.APP_COOKIE_NAME,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    GOOGLE_MAP_ID: process.env.GOOGLE_MAP_ID,
    APP_SECRET: process.env.APP_SECRET,
  }

  const context_ep = getUrl('context');
  return json({
    userContext,
    ENVR,
  })
}


export async function action({request,}: ActionFunctionArgs ){
  console.log("Root action")
  return {}
}
