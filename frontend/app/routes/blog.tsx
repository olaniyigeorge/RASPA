import { motion } from "framer-motion";

export default function Blog() {


    return <div className="p-10 flex justify-around gap-4 w-full h-screen items-center text-3xl">
        <motion.div
            initial={{ scale: 0 }}
            animate= {{ scale: [1.1,1]}}
            exit={{opacity:0}}
            transition={{ease: "easeInOut", duration: 1}}
        className="bg-red-500 flex text-white justify-center items-center rounded-lg h-full w-1/2">
            Blog
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
}