import { InboxIcon } from "@heroicons/react/24/outline";
import { Amenity } from "~/api/interfaces";


export default function AmenityCard(amenity: Amenity) {


    return <span className="flex rounded gap-2 items-center">
            <button className="rounded border  p-2 bg-gray-200">
                <InboxIcon className="w-4 h-4 text-gray-700 " />
            </button>
            
            <div className="tracking-tight leading-tight">
                <p className="text-gray-500 capitalize">{amenity.type}</p>
                <p className="text-gray-700 capitalize font-medium">{amenity.name}</p>
            </div>
            
    </span>
}