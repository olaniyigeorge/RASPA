import { Link } from "@remix-run/react";


export interface IService {
    service_logo: string;
    action: string;
    description: string;
    url: string;
}




export default function ServiceDescriptionCard(props: IService) {
    const service = {...props}

    return <>
        <div className="w-full h-full flex-grow rounded-lg shadow-md p-2 flex-col items-center justify-center space-y-2 bg-white">
            <div className="flex w-full h-auto items-center justify-center">
                <img src={service.service_logo} alt={service.action} className="max-h-40 w-auto justify-center" />
            </div>
            <h1 className="mt-2 text-xl font-bold w-full flex justify-center"> {service.action} properties</h1>

            <p className="line-clamp-5 text-sm tracking-wide text-gray-800"> {service.description} </p>

            <span className="w-full h-auto flex justify-center items-center">
                <Link to={service.url} className="w-2/3 flex hover:scale-105 transition ease-in-out  justify-center hover:bg-purple-800 items-center mt-3 p-2 bg-purple-600 rounded-md text-white">
                    Learn More
                </Link>
            </span>



        </div>
    
    </>
}



export const our_services: IService[] = [
    {
        service_logo: "images/buy-properties.png",
        action: "Buy",
        description: "At RASP, we specialize in making your dream of home ownership a reality. With our user-friendly platform, buying a home becomes a hassle-free and rewarding experience",
        url: "/explore?action=buy",
    },
    {
        service_logo: "images/sell-properties.png",
        action: "Sell",
        description: "Explore the simplicity of selling your home with RASP. Our platform is designed to streamline the selling process, providing you with the tools and support needed to showcase and sell your property efficiently",
        url: "/explore?action=sell",
    },
    {
        service_logo: "images/rent-properties.png",
        action: "Rent",
        description: "Discover the ease of finding your perfect rental property on RASP. Whether you're seeking a temporary residence or a long-term home, our platform offers a user-friendly experience to help you find and secure the ideal rental property",
        url: "/explore?action=rent",
    },
    {
        service_logo: "images/invest-in-properties.png",
        action: "Invest in",
        description: "Unlock the potential of property investment with RASP. Our platform empowers you to explore and invest in lucrative real estate opportunities, providing the tools and information needed to make informed decisions for a successful property investment journey",
        url: "/explore?action=invest",
    },
    
]