// AUTH
export type UserContext = {
    id: string;
    display_name: string;
    profile_picture: string;
    is_staff: boolean;
    is_verified: boolean;
  
  }


export type authCred = {
    email: string,
    password: string,
}


export type USERProviderProps = {
  children: React.ReactNode
  usrContext: UserContext | null
}

