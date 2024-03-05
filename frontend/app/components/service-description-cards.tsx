import { Link } from "@remix-run/react";


interface IService {
    service_logo: string;
    action: string;
    description: string;
    url: string;
}




export default function ServiceDescriptionCard(props: IService) {
    const service = {...props}

    return <>
        <div className="w-full h-full rounded-lg">
            <img src={service.service_logo} alt={} className={} />

            <h1 className=""> {service.action.split(' ')[0]}</h1>

            <p> {service.description}</p>

            <Link to={service.url} className="">
                
            </Link>



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