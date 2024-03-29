import { motion } from "framer-motion";
import Header from "~/components/header";

export default function Blog() {


    return <>
    <Header mode={'light'} />
    <div className="p-10 flex justify-around gap-4 w-full h-auto items-center text-3xl">
        <motion.div
            initial={{ scale: 0 }}
            animate= {{ scale: [1.1,1]}}
            exit={{opacity:0}}
            transition={{ease: "easeInOut", duration: 1}}
            className="w-1/2 text-7xl  text-gray-900 font-extrabold flex justify-center items-center rounded-lg h-full ">
            <h1 className="tracking-tighter leading-tight">
                Stay Informed, Stay Ahead: Explore Our <span className="text-purple-700">Real Estate</span> Blog
            </h1>
        </motion.div>  

        <motion.div
            initial={{ scale: 0 }}
            animate= {{ scale: [1.7,1]}}
            exit={{opacity:0}}
            transition={{ease: "easeInOut", duration: 1}}
            className="bg-purple- flex text-white justify-center items-center rounded-lg h-full w-1/2"
        >
            <img src={`images/rasp-logo-purple.png`} alt="logo" />
        </motion.div>
    </div>
    </>
}