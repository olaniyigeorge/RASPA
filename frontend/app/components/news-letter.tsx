import { NewspaperIcon } from "@heroicons/react/24/solid";




export default function NewsLetterForm() {


    return <div className="w-full flex justify-center">
        
        <div className="bg-white flex w-2/3 items-center border rounded-full space-x-1 p-1">
            <NewspaperIcon className="text-purple-600 w-8 h-8 " />
            <input type="text" placeholder="Enter your email" className="focus:outline-none focus:ring-0 active:border-0 w-full h-full p-2" />
            <input type="submit" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-full" />
        </div>
    </div>
}