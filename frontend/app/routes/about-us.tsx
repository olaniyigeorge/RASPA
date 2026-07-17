import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";




export default function AboutUs() {


    return <div className="p-10 w-full h-screen flex flex-col justify-center">
        <Link to="/">Home</Link>
        <AnimatePresence>
            <motion.div
                animate={{ opacity: 1, x: 0}}
                className="p-10 text-sm text-white overflow-y-auto bg-gradient-to-r from-purple-900 to-purple-700 w-full rounded-r rounded-[40px] shadow"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0, x: -50}}
                transition={{ease: "easeOut", duration: 1.5}}

            >
                
                <h1 className=" text-3xl font-bold flex w-full justify-center items-center">
                    About RASP (Rent A Space)
                </h1>

                <p className="text-lg item-center text-center">At RASP, we're dedicated to facilitating seamless connections between renters, buyers, and investors and the spaces that perfectly align with their needs. Our commitment lies in simplifying the property search process and empowering our users to find their ideal spaces effortlessly. </p>


            <section className=" space-y-3">
                <div className="">
                    <h1 className="font-bold text-xl">
                    Our Vision
                    </h1>

                    <p> Our vision at RASP is to redefine the real estate experience by making it effortless and enjoyable for individuals and businesses to find their perfect spaces. We strive to be the leading platform that offers comprehensive solutions tailored to meet the diverse needs of our clients.</p>
                </div>



                <div className="">
                    <h1 className="font-bold text-xl">
                        What Sets Us Apart
                    </h1>
                
                

                        
                    <li> Extensive Listings: RASP offers a wide array of listings, ranging from residential properties to commercial spaces and investment opportunities, ensuring that there's something for everyone. </li>
                    <li> User-Centric Approach*: With a focus on user experience, our platform features intuitive search filters, detailed property descriptions, and interactive tools to enhance the search process.</li>
                    <li> Expert Support: Our team of real estate professionals is committed to providing personalized assistance and expert guidance, ensuring that our clients feel supported throughout their journey.</li>
                </div>    


                <div className="">
                    <h1 className="font-bold text-xl">
                        Why Choose RASP
                    </h1>

                    <li> Trustworthiness*: With a reputation built on reliability and integrity, RASP is the trusted choice for individuals and businesses seeking real estate solutions.
                    </li> 
                    <li> Diverse Options*: Whether you're searching for a rental property, a new home, or a lucrative investment, RASP offers a diverse range of options to suit every need and preference.
                    </li> 
                    <li> Innovation*: At RASP, we're constantly innovating and leveraging cutting-edge technology to deliver unparalleled service and convenience to our clients.
                    </li> 
                </div>
            </section>
                

            <span className="">
                Ready to find your ideal space? Explore our listings today or reach out to our team for personalized assistance. At RASP, we're committed to helping you find the perfect space that meets your requirements and exceeds your expectations.
            </span>
            </motion.div>
        </AnimatePresence>


    </div>
}





export const meta: MetaFunction = () => {

    return [
    {
      title: 'About Us: RASP',
    },
  ]
}

