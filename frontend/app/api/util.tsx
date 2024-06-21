
export function isServer(): boolean {
  return typeof document === 'undefined'
}

const inProduction = process.env.NODE_ENV === 'production';



declare global {
  interface Window {
    ENV: { [key: string]: string }
  }
}


// Get EnvVar on server or client browser
export function getEnvVar(key: string): any {
  if (isServer()) {
    return process.env[key]
  }

  return window.ENV[key]
}

// // Get the API DOMAIN from the environment variable
// const apiDomain: string = getEnvVar('API_DOMAIN') | 'localhost:8000';
let apiDomain: string
if (inProduction) {
  apiDomain = "https://raspa-api-splu.onrender.com";}
else {
  apiDomain = 'http://localhost:8000';
}

// Function to construct a full URL
export type getUrlProps = {
  path: string;
  addOn?: string;
}

export function getUrl(path: string, addOn?: string | undefined): string {
  if (addOn) {
    return `${apiDomain}/${api_paths[path]}${addOn}/`;
  }
  return `${apiDomain}/${api_paths[path]}`;
};




// Define api_paths object
const api_paths: Record<string, string> = {
  //Auth
  'context': 'accounts/user-context/',
  'sign-in': 'accounts/auth/login/',
  'sign-in-refresh': 'accounts/auth/login/refresh/',
  'sign-up': 'accounts/users/',
  
  // API
  'developed-properties': 'api/developed-properties/',
  'service-locations': 'directory/service-locations/',

  // API - Listings
  'listings': 'api/listings/',

};



export type fetcherProps = {
  endpoint: string;
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body? : BodyInit | null | undefined
  token? : string | null;
}

export async function fetchData(args: fetcherProps) {
  const {endpoint, method, body, token} = args;
  let headers : HeadersInit | undefined
  if (token) {
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }
  else {
    headers = {
      'Content-Type': 'application/json',
    };
  }
  try {
        const fetchResponse = await fetch(endpoint, {
            method: method,
            body: body,
            headers: headers
        })

        if (fetchResponse.ok) {
          console.log("Fetch successfull")
          return await fetchResponse.json()
        }
        else {
          console.log("Fetching Error: ", fetchResponse.status)
          return null
        }
      }
  catch (error) {
      console.error('Error while hitting API:', error);
      return null;
  }

}