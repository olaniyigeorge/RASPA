import { motion } from "framer-motion";
import Header from "~/components/header";

export default function Blog() {


    return <>
    <Header mode={'light'} />
    <div className="p-2 md:p-10 md:flex justify-around gap-4 w-full h-auto items-center text-3xl">
        <motion.div
            initial={{opacity:0.8}}
            animate= {{ opacity:1}}
            exit={{opacity:0, }}
            transition={{ease: "easeInOut", duration: 1}}
            className="w-full md:w-1/2 text-5xl md:text-5xl  text-gray-900 font-extrabold flex justify-center items-center rounded-lg h-full "
        >
            <h1 className="text-center text-pretty  font-extrabold tracking-tighter drop-shadow md:text-start text-5xl md:text-7xl  ">
                Stay Informed, Stay Ahead: Explore Our <span className="text-purple-700">Real Estate Blog</span> 
            </h1>
        </motion.div>  

        <motion.div
            initial={{ scale: 0 }}
            animate= {{ scale: [1.7,1]}}
            exit={{opacity:0}}
            transition={{ease: "easeInOut", duration: 1}}
            className="w-full md:w-1/2 flex text-white justify-center items-center rounded-lg h-full "
        >
            <img src={`images/rasp-logo-purple.png`} alt="logo" />
        </motion.div>
    </div>

    <div className="w-full h-[600px] rounded-lg border">


    </div>
    </>
}