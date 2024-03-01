import React from "react";
import { useContext } from "react";
import { authCred, UserContext, USERProviderProps } from "./interfaces";
import { getUrl } from "./util";



export async function validateCredentials(cred: authCred) {
  console.log("---- Validating cred ----")
  const { email, password } = cred;


  try {
      console.log(`Fetching: ${getUrl('sign-in')}`)
      console.log(JSON.stringify({ email, password }))
      const res = await fetch(getUrl('sign-in'), {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
          // TODO: Make ErrorResponse component with {statusCode: message} props
          console.log(`Not Ok Response: ${res.status}`);
          return false;
      }
      
      // console.log(`Res status: ${res.status}`)
      // console.log(`Response body:  ${res.body}`)
      return await res.json();
  } catch (error) {
      // console.error("Error during fetch:", error);
      return false;
  }
}


/**
 * Fetches new access token 
 * @param refreshToken a refresh token
 * @returns boolean
 */
export async function fetchNewAccessToken(refreshToken: string): Promise<string | null> {
    try {
        const tokenRefreshResponse = await fetch(getUrl('sign-in-refresh'), {
            method: 'POST',
            body: JSON.stringify({'refresh': refreshToken}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`,
            },
        });
  
        if (tokenRefreshResponse.ok) {
            // If token refresh successful, return new access token
            const responseBody = await tokenRefreshResponse.json();
            // console.log(`New access token: ${responseBody.access}`);
            return responseBody.access;
        } else {
            // Token refresh failed with a status other than 200
            console.log(`Token refresh failed with status: ${tokenRefreshResponse.status}`);
            return null;
        }
    } catch (error) {
        // Handle any unexpected errors during the fetch
        console.error('Error during token refresh:', error);
        return null;
    }
  }
  



// -----------------  
  
export const UserContextProvider: React.FunctionComponent<USERProviderProps> = props => {
  
    return (
      <CurrentUserContext.Provider value={props.usrContext}>{props.children}</CurrentUserContext.Provider>
    )
  }
  
  
  
  
export function useCurrentUserContext(): UserContext | null {
      const ctx = useContext(CurrentUserContext)
    
      if (!ctx) {
        // throw new Error('useuserContext must be used within an UserProvider')
        return null
      }
    
      return ctx
  }
    
  
  const CurrentUserContext = React.createContext<UserContext | null>(null)
  export default CurrentUserContext
  
  

  
