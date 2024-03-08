
export function isServer(): boolean {
    return typeof document === 'undefined'
  }

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
const apiDomain: string = getEnvVar('API_DOMAIN');

// Function to construct a full URL
export function getUrl(path: string): string {

    return `${apiDomain}/${api_paths[path]}`;
  };




// Define api_paths object
const api_paths: Record<string, string> = {
    'context': 'accounts/user-context/',
    'sign-in': 'accounts/auth/login/',
    'sign-in-refresh': 'accounts/auth/login/refresh/',
    'sign-up': 'accounts/users/',
    'developed-properties': 'api/developed-properties/',
    'service-locations': 'directory/service-locations'
  };