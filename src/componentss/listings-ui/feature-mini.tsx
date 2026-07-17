
import { InboxIcon, ServerIcon } from "@heroicons/react/24/outline";
import { Amenity, Feature } from "~/api/interfaces";


export default function FeatureMiniCard(feature: Feature) {


    return <span className="flex gap-1 p-1 bg-gray-200 text-xs justify-around items-center text-gray-700 rounded-lg">
            {featureIcons[feature.name]}
            
            <span className="">
                {feature.count}
            </span>
    </span>
}




export function SizeMiniCard(size?: number | undefined) {


    return <span className="flex gap-1 p-1 bg-gray-200 text-xs justify-around items-center text-gray-700 rounded-lg">
            <ServerIcon className="w-3 h-3 text-gray-800 " />
            
            <span className="">
                {size} sqmtrs
            </span>
    </span>
}






const featureIcons: Record<string, JSX.Element> = {
    bdr: <ServerIcon className="w-3 h-3 text-blue-800 " />,
    blg: <ServerIcon className="w-3 h-3 text-red-800 " />,
    btr: <ServerIcon className="w-3 h-3 text-green-800 " />,
    flr: <ServerIcon className="w-3 h-3 text-gray-800 " />,
    phone: <ServerIcon className="w-3 h-3 text-gray-800 " />,
    
  }
  