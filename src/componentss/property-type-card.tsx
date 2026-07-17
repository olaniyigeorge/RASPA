import { Link } from "@remix-run/react";

export interface PTCP {
    image_src: string;
    link_url: string;
    title: string 
}


export default function PropertyTypeCard(props: PTCP) {
    const { image_src, link_url, title } = props
    return <div className="w-full h-full hover:text-purple-600 hover:scale-105 transition-all">
        <Link 
            to={link_url}
            className="w-full h-full space-y-3">
            <img src={image_src} alt={title} className="w-full h-full object-cover"/>
            <p className="font-bold text-xl">{title}</p>
        </Link>
    </div>
}

export const property_types = [
    {
        image_src: "images/residential-properties.png", 
        link_url: "properties/?type=residential",
        title: "Residential Properties" 
    },
    {
        image_src: "images/commercial-properties.png",
        link_url: "properties/?type=commercial",
        title: "Commercial Properties",
    },
    {
        image_src: "images/industrial-properties.png",
        link_url: "properties/?type=industrial",
        title: "Industry Properties", 
    },
    {
        image_src: "images/landed-properties.png",
        link_url: "properties/?type=land",
        title: "Landed Properties", 
    },
]