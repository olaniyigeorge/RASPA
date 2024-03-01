// AUTH
export type UserContext = {
    id: string;
    display_name: string;
    profile_picture: string;
    is_job_hunting: boolean;
    is_student: boolean;
    is_instructor: boolean;
    is_hirer: boolean;
    is_organisation: boolean;
    is_wisp_operator: boolean;
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

