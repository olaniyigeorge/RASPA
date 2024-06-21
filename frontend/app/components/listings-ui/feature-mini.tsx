
import { InboxIcon, ServerIcon } from "@heroicons/react/24/outline";
import { Amenity, Feature } from "~/api/interfaces";


export default function FeatureMiniCard(feature: Feature) {


    return <span className="flex gap-1 p-1 bg-gray-200 text-xs justify-around items-center text-gray-700 rounded-lg">
            <ServerIcon className="w-3 h-3 text-gray-800 " />
            
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