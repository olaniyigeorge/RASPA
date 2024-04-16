import { UserContext } from "./api/interfaces";
import { getUrl } from "./api/util";
import { currentToken } from "./session.server";


/**
 * Confirms server side has access to the api for the connected user
 * @param request The http request
 * @returns string "0" = Has no access, "1" = Has access, "2" = Token has to be refreshed
 */
export async function hasAccess(request: Request): Promise<string> {
  const token: string  = await currentToken(request);

  // Return 0 if token doesn't exist or is null ---- console.log("Checking token anonymity")
  if (!token || token === 'anonymous') {
    return "0"; // Token is anonymous, return false, 0
  }

  // Ping authenticated endpoint to check for token validity ---- console.log("Checking token validity")
  try {
    // Ping an API endpoint with an auth request (context)
    const userContextResponse = await fetch(getUrl('context'), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (userContextResponse.ok) {
      console.log("Token valid")
      return "1";
    } else if (userContextResponse.status === 404) {
      console.log("User not found");
      return "0";
    } else if (userContextResponse.status === 401) {
      console.log("Unauthorized: Token expired");
        return "2";  
    } else {
      console.log(`Other cases ${userContextResponse.status}`)
      return "0";
    }

  } catch (error) {
    console.log('Error checking token validity: Network error');
    return "0";
  }


}



/**
 * Gets the user's data server context
 * @param request The http request
 * @returns The user's data server context
 */

export async function getContext(request: Request): Promise<UserContext | null> {
  const token = await currentToken(request);
  
  if (token === 'anonymous') {
    return null;
  }

  try {
    const response = await fetch(getUrl('context'), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const userContext = await response.json() as UserContext;
      return userContext;
    }

    // Handle other status codes if needed
    console.error(`Error fetching user context. Status: ${response.status}`);
    return null;
  } catch (error) {
    console.log('Error fetching user context:', "FetchError");
    return null;
  }
}



export async function isAnonymous(request: Request): Promise<boolean> {
  return (await currentToken(request)) === 'anonymous'
}


type AuthCheckResult = Promise<boolean>
