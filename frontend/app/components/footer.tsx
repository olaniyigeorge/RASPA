import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { getEnvVar } from "~/api/util"
import { Breadcrumbs } from "~/ui/breadcrumbs"
import { Facebook } from "~/ui/svg/social/facebook"
import { LinkedIn } from "~/ui/svg/social/linkedIn"
import { Twitter } from "~/ui/svg/social/twitter"
import { Links, LinkSection, LinksMap } from "./link-section"





export default function Footer() {
    const [isMenuOpen, setIsMenuOpen] = useState<Record<number, boolean>>({})
    const toggleMenu = (idx: number) => {
      setIsMenuOpen({
        ...isMenuOpen,
        [idx]: !isMenuOpen[idx],
      })
    }


    return <>
        <div className=" text-white"> 
            <section className="w-full bg-purple-600 text-white">
                <div className="container mx-auto">
                    <div className="h-full w-full py-2">
                        <Breadcrumbs />
                    </div>
                    
                    <div className="border-b-0 border-t-0 px-3 pb-5 pt-5 lg:border-b lg:border-t lg:px-0">
                        <div className="hidden w-full lg:flex ">
                            {/* Company */}
                            <div className="w-full p-4 sm:w-1/2 lg:w-[25%] xl:w-1/4">
                            <LinkSection title="RASPA" />
                            </div>

                            {/* Resources */}
                            <div className="w-full p-4 sm:w-1/2 lg:w-[25%] xl:w-1/4">
                            <LinkSection title="Property_Types" />
                            </div>

                            {/* Connect */}
                            <div className="w-full p-4 sm:w-1/2 lg:w-[25%] xl:w-1/4">
                            <LinkSection title="Connect" />
                            </div>

                            {/* Popular searches */}
                            <div className="w-full p-4 sm:w-1/2 lg:w-[25%] xl:w-1/4">
                            <LinkSection title="Popular_Searches" />
                            </div>

                            
                        </div>
                        {/* Collapse Menu */}
                        <div className="flex w-full flex-col border-t-[1.5px] lg:hidden">
                            {Object.keys(LinksMap).map((title: string, idx: number) => (
                            <span
                                className="flex h-auto flex-col border-b-[1.5px] px-[2px]"
                                key={idx}
                                onClick={() => toggleMenu(idx)}
                            >
                                <span
                                className="
                                    flex
                                    w-full
                                    cursor-pointer
                                    items-center
                                    pb-2
                                    pt-2
                                    text-sm
                                    font-semibold
                                    text-white"
                                >
                                {title}
                                <span className="mr-2 flex flex-grow items-center justify-end">
                                    <svg
                                    className={`h-4 w-4 transform transition duration-200 ease-in-out ${
                                        isMenuOpen[idx] ? '-rotate-45' : 'rotate-0'
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    >
                                    <path
                                        d="M12 6v12m6-6H6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    </svg>
                                </span>
                                </span>
                                <AnimatePresence>
                                {isMenuOpen[idx] && (
                                    <motion.div
                                    animate={{ opacity: 1 }}
                                    className={`
                                            flex
                                            flex-col
                                            space-y-2
                                            px-2
                                            pb-4
                                            pt-4
                                            text-xs
                                        `}
                                    exit={{
                                        opacity: 0,
                                        height: 0,
                                    }}
                                    initial={{ opacity: 0 }}
                                    transition={{
                                        duration: 0.2,
                                        ease: [0.04, 0.62, 0.23, 0.04],
                                    }}
                                    >
                                    <Links links={LinksMap[title]} />
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </span>
                            ))}
                        </div>
                    </div>

                    {/* Branding, copyright and socials */}
                    <div className="flex flex-col items-center justify-between py-2 pt-3 md:flex-row md:py-0 md:pt-0">
                    {/* Footer Logo */}
                    <a className="w-auto" href="/">
                        <img alt="rasp" className="h-8 w-auto" src="images/rasp-logo-purple.png" />
                    </a>

                    {/* Footer Legal */}
                    <div
                        className="
                        flex
                        w-full
                        flex-col
                        items-center
                        justify-center
                        p-4
                        text-xs
                        text-white
                        md:w-auto
                        md:flex-row md:space-x-2"
                    >
                        <span className="flex w-full items-center justify-center md:w-auto">
                        &copy; 2020 - {new Date().getFullYear()} &nbsp; RASPA
                        Ltd.
                        </span>
                        <span className="flex w-full items-center justify-center md:w-auto">
                        All Rights Reserved.
                        </span>
                        <a
                        className="flex w-full items-center justify-center hover:underline md:w-auto"
                        href="/legal"
                        >
                        Legal.
                        </a>
                    </div>

                    {/* Footer Social */}
                    <div className="flex w-full items-center justify-center text-xs md:w-auto">
                        <div className="flex flex-wrap">
                        {[
                            {
                            icon: Facebook,
                            link: getEnvVar('SOCIAL_FACEBOOK'),
                            },
                            {
                            icon: Twitter,
                            link: getEnvVar('SOCIAL_TWITTER'),
                            },
                            {
                            icon: LinkedIn,
                            link: getEnvVar('SOCIAL_LINKEDIN'),
                            },
                        ].map((svg, idx: number) => (
                            <a
                            className="
                                flex
                                cursor-pointer
                                items-center
                                justify-center
                                space-x-2
                                p-2
                                text-xs
                                text-white
                                hover:text-purple-700"
                            href={svg.link}
                            key={idx}
                            >
                            <svg.icon />
                            </a>
                        ))}
                        </div>
                    </div>
                    </div>
                </div>
            </section>
        </div>

        <div className="w-full h-auto"> 
        
            <img src="images/rasp-footer-image.png" alt="rasp-service" className="w-full h-auto" />
        
        </div>
    </>

}