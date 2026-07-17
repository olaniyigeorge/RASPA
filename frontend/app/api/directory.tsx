import { getUrl } from "./util";






export async function fetchServiceLocations(lat: string, lng: string) {
    const baseApiUrl = getUrl("service-locations");
    const apiUrl = `${baseApiUrl}?lat=${lat}&lng=${lng}}`;
    const requestOptions: RequestInit = {
      method: 'GET',
      redirect: 'follow'
    };
  
    console.log("Fetching: ", apiUrl)
    const response = await fetch(apiUrl, requestOptions);
  
    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }
  
    return response.json();
  }