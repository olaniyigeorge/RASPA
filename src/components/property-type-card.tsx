import Image from "next/image";
import Link from "next/link";

interface PropertyTypeCardProps {
  title: string;
  description?: string;
  image: string;
  href: string;
}

export function PropertyTypeCard({
  title,
  description,
  image,
  href,
}: PropertyTypeCardProps) {
  return (
    <Link
      href={href}
      className="group relative mb-3 flex-1 overflow-hidden rounded-2xl shadow-md md:mb-0"
    >
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
        <h3 className="text-lg font-bold">{title}</h3>
        {description && (
          <p className="line-clamp-2 text-sm text-white/80">{description}</p>
        )}
      </div>
    </Link>
  );
}



















// import { Link } from "@remix-run/react";

// export interface PTCP {
//     image_src: string;
//     link_url: string;
//     title: string 
// }


// export default function PropertyTypeCard(props: PTCP) {
//     const { image_src, link_url, title } = props
//     return <div className="w-full h-full hover:text-purple-600 hover:scale-105 transition-all">
//         <Link 
//             to={link_url}
//             className="w-full h-full space-y-3">
//             <img src={image_src} alt={title} className="w-full h-full object-cover"/>
//             <p className="font-bold text-xl">{title}</p>
//         </Link>
//     </div>
// }

// export const property_types = [
//     {
//         image_src: "images/residential-properties.png", 
//         link_url: "properties/?type=residential",
//         title: "Residential Properties" 
//     },
//     {
//         image_src: "images/commercial-properties.png",
//         link_url: "properties/?type=commercial",
//         title: "Commercial Properties",
//     },
//     {
//         image_src: "images/industrial-properties.png",
//         link_url: "properties/?type=industrial",
//         title: "Industry Properties", 
//     },
//     {
//         image_src: "images/landed-properties.png",
//         link_url: "properties/?type=land",
//         title: "Landed Properties", 
//     },
// ]