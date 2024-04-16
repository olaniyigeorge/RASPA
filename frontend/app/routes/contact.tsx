import { Link } from "@remix-run/react";

export default function Contact() {


    return <div className="p-10 w-full h-full ">
        
        
        
        <Link to="/">
            Go Back
        </Link>
        
        <div className="">
            <div className="w-full flex justify-center items-center">
                <h1 className="text-3xl">
                    Socials
                </h1>            
            </div>
            
            <div className="md:flex transition-1000 transform duration gap-3 space-y-3 md:space-y-0 flex-grow w-full justify-between items-center">
                <div className="rounded-md bg-gray-50 border w-full">
                    Uh huh!!!
                </div>
                <div className="rounded-md bg-gray-50 border w-full">
                    Uh huh!!!
                </div>
                <div className="rounded-md bg-gray-50 border w-full">
                    Uh huh!!!
                </div>
            </div>
        </div>
        
        
        <div className="mt-10"> 
            <div className="w-full flex justify-center items-center">
                <h1 className="text-3xl">
                    Developers
                </h1>            
            </div>
            
            <div className="md:flex transition gap-3 space-y-3 md:space-y-0  w-full justify-between items-center">
                <div className="rounded-md shadow flex justify-between p-2 gap-1 items-start bg-gray-50 border w-full md:1/3">
                    <img src="images/memoji.png" alt="" className="rounded-full w-1/2 h-auto" />
                    <div className="w-1/2 text-wrap h-full flex flex-col">
                        <h2 className="font-bold text-xl">Olaniyi George</h2>
                        <p className="text-wrap w-full ">
                            cfcfcvevccccrfrrvrvrvrvrvrvvdwrrvvrr
                            cfcfcvevccccrfrrvrvrvrvrvrvv
                        </p>
                        <span className="flex w-full  space-x-1">
                            <Link to="https://github.com/olaniyigeorge" className="flex items-center justify-between space-x-1">
                                <img alt="github-logo" src="images/github.png" className="rounded-full w-4 h-4 bg-gray-200"/>
                                <p className="text-sm sm:text-md text-purple-700">Github</p>
                            </Link>

                            <Link to="https://linkedin.com/in/abeleje-olaniyi-069863169/" className="flex items-center justify-between space-x-1">
                                <img alt="linkedin-logo" src="images/linkedin.png" className="rounded-full flex justify-center items-center w-4 h-4 bg-gray-200"/>
                                <p className="text-sm sm:text-md text-purple-700">LinkedIn</p>
                            </Link>

                            <Link to="mailto:olaniyigeorge77@gmail.com" className="flex items-center justify-between space-x-1">
                                <img alt="mail-logo" src="images/mail.png" className="rounded-full w-4 h-4 bg-gray-200" />
                                <p className="text-sm sm:text-md text-purple-700">Mail</p>
                            </Link>
                        </span>
                    </div>
                </div>
                <div className="rounded-md h-auto  bg-gray-50 border w-full">
                    Uh huh!!!
                </div>
                <div className="rounded-md h-auto bg-gray-50 border w-full">
                    Uh huh!!!
                </div>
            </div>
        </div>

    </div>
}