// AUTH
export type UserContext = {
    id: string;
    display_name: string;
    first_name: string;
    last_name: string,
    email: string;
    username: string | null,
    is_staff: boolean,
    is_verified: boolean,
}


export type authCred = {
    email: string,
    password: string,
}

export type Payment = {
    id: string;
    payer: string;
    amount: number;
    status: string;
    payment_provider: string;
    date: string;
}


export type USERProviderProps = {
  children: React.ReactNode
  usrContext: UserContext | null
}


export type Amenity = {
  id: string;
  type: string;
  name: string;
}



export type Feature = {
  id: string;

  name: string;
  count: number;
  size: number;
  property: string;
  images: string[];

}

export type Property = {
  id: string;
  name: string;
  type: string;
  size: number;
  actions: string;
  propertyImages: { image: string; }[];
  description: string;
  owner: ownerType | null;
  manager: ownerType | null;
  latitude: string;
  longitude: string;
  address: string;
  amenities: Amenity[];
  features: Feature[];

}
export type ownerType = { 
  id: string; 
  display_name: string; 
}
export type PropertyListing = {
  id: string;
  listing_type: string;
  price: number;
  property: Property;
}



const dtx: any = {
  "id": "1d2b9022-51e1-43c7-9d65-e9957b5614b8",
  "listing_type": "rent",
  "price": 1400000.0,
  "property": {
      "id": "1511a4d6-e9fa-42d5-9281-8835042b48c5",
      "name": "Zalasoft Residentials Alagbaka",
      "type": "residential",
      "size": 1400.0,
      "actions": "001",
      "propertyImages": [
          {
              "image": "/media/property-images/industrial-properties.png"
          },
          {
              "image": "/images/frame-16.png"
          }
      ],
      "description": "A very conducive two bedroom flat with POP all through in Alagabka GRA with three toilets, water heater installed, water running, kitchen cabinets, wardrobe, tiled all through, floored compound, fenced, gated and just three appartments in the compound",
      "owner": {
          "id": "eb4184f5-833d-4720-bc86-4ba2469c21a2",
          "display_name": "Bellz"
      },
      "manager": {
          "id": "431807a6-5e5e-4dd1-ab01-0d83e78a1dac",
          "display_name": "Zalasoft"
      },
      "latitude": "3.324354200000000",
      "longitude": "7.124534200000000",
      "address": "Off Alagbaka GRA, Akure",
      "amenities": [
          {
              "id": "0cd3986b-c575-4108-bb0e-4d62c93f1ee1",
              "type": "Flooring",
              "name": "Hardwood/Tiles"
          },
          {
              "id": "12b3a0fb-a1b8-4713-9dad-3c51ace5c44d",
              "type": "Type",
              "name": "Residential"
          },
          {
              "id": "28e0a22c-2b82-42a0-98a5-8572934d0e62",
              "type": "Security",
              "name": "Gated"
          },
          {
              "id": "3c05c5cb-fb75-4be1-9e22-05f9347b455b",
              "type": "Flooring",
              "name": "Paved Compound"
          },
          {
              "id": "43720521-8cbb-457a-8005-ed105e38a6e1",
              "type": "Security",
              "name": "Fenced, Gated"
          },
          {
              "id": "6bab47a0-ff50-48fb-8470-4574ebd507b2",
              "type": "Pet",
              "name": "Cats/Dogs Allowed"
          },
          {
              "id": "8940dc04-1064-47da-8c7e-f3697df0e0c4",
              "type": "Health",
              "name": "In-House Gym"
          },
          {
              "id": "e1e789df-d30d-4815-91ef-7ebe9b1ddf8b",
              "type": "Proximity",
              "name": "Road facing"
          }
      ],
      "features": [
          {
              "id": "589cb874-a006-4e47-82e3-c8cb2e214ef5",
              "name": "bdr",
              "count": 2,
              "size": 400.0,
              "property": "1511a4d6-e9fa-42d5-9281-8835042b48c5",
              "images": []
          },
          {
              "id": "08ee6ada-f265-48e5-bd8c-49c23a18202b",
              "name": "btr",
              "count": 3,
              "size": 0.0,
              "property": "1511a4d6-e9fa-42d5-9281-8835042b48c5",
              "images": []
          }
      ]
  }
}