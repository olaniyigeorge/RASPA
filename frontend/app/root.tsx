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
import { fetchNewAccessToken, useCurrentUserContext, UserContextProvider } from "./api/auth";
import { UserContext } from "./api/interfaces";
import { fetchData, fetcherProps, getUrl } from "./api/util";
import { getContext, hasAccess } from "./auth.server";
import { currentRefreshToken, currentToken, enableAuthenticableServerApiRequests, storage } from "./session.server";
import { DomWrapper } from "./ui/dom-wrapper";
import { AppLoader } from "./ui/app-loader";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: tailwindStyles},
];

export default function App() {
  const data = useLoaderData<typeof loader>()

  return (
          <DomWrapper
            scripts={
              <script
                dangerouslySetInnerHTML={{
                  __html: `window.ENV = ${JSON.stringify(data.ENVT)}`,
                }}
              />
            }
          >
            <UserContextProvider usrContext={data.ctx}>
              {!data && <AppLoader />}
            
              {data && (
                    <Outlet />
              )}

            </UserContextProvider>
          </DomWrapper>
  )
};


export async function loader({request,}: LoaderFunctionArgs){
    console.log("Loading.......")
    const ENVT = {
      APP_COOKIE_NAME: process.env.APP_COOKIE_NAME,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
      GOOGLE_MAP_ID: process.env.GOOGLE_MAP_ID,
      APP_SECRET: process.env.APP_SECRET,
    }
    
    let ctx: UserContext | null = null;
    const current_token = await currentToken(request);
    
    // Token is anonymous, set userContext to null
    if (!current_token || current_token == 'anonymous') {
      ctx = null
    }

    console.log("Check token validity by fetching context with current token");
    const ctx_response = await fetchData(
          {
              endpoint: getUrl('context'), 
              method: 'GET',
              token:  current_token
          });

    console.log("Context Response: ", ctx_response.status)
    if (ctx_response.status == 200) {
      ctx = ctx_response.body
    }
    else if (ctx_response.status == 401) {

      console.log("Attempting token refresh.........")
      const refreshToken = await currentRefreshToken(request);

      // console.log("RT: ", refreshToken)

      if (refreshToken && refreshToken !== 'anonymous') {
        const fetchNewAccessResponse = await fetchNewAccessToken(refreshToken);

        if (fetchNewAccessResponse === null) {
          return json({ ctx, ENVT})
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
      // if (refreshToken && refreshToken !== 'anonymous') {
      //   // const refresh_args: fetcherProps = {
      //   //   endpoint: getUrl('sign-in-refresh'), 
      //   //   method: 'POST',
      //   //   body:  JSON.stringify({'refresh': refreshToken}),
      //   // }
      //   // const refresh_response = await fetchData(refresh_args);
      //   const fetchNewAccessResponse = await fetchNewAccessToken(refreshToken);

      //   console.log("New token: ", fetchNewAccessResponse)

      //   if (fetchNewAccessResponse === null) {
      //     return redirect("");
      //   }

      //   //Use the new access token in subsequent requests if needed
      //   const session = await enableAuthenticableServerApiRequests(request, {
      //     token: fetchNewAccessResponse,
      //     refresh: refreshToken,
      //   });

      //   return redirect("/", {
      //     headers: {
      //       "Set-Cookie": await storage.commitSession(session),
      //     },
      //   });
      // } 
    }
    else {
      ctx = null
    }


    return json({ ctx, ENVT})
}