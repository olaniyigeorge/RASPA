import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { ActionFunctionArgs, DataFunctionArgs, LinksFunction, LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { useSubmit, useNavigate  } from "@remix-run/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "~/components/footer";
import Header from "~/components/header";
import NewsLetterForm from "~/components/news-letter";
import PropertyCard, { akure_property, IProperty } from "~/components/property-card";
import PropertyTypeCard, { property_types, PTCP } from "~/components/property-type-card";
import ServiceDescriptionCard, { IService, our_services } from "~/components/service-description-cards";
import { storage } from "~/session.server";
export const meta: MetaFunction = () => {
  
  return [
    { title: "Rent A Space Akure" },
    { name: "description", content: "Welcome to RASP, Akure!" },
  ];
};


export const links: LinksFunction = () => [
  // { rel: "stylesheet", href: styles },
];

export default function Landing() {
  const navigate = useNavigate();
  const [selectedButton, setSelectedButton] = useState<string>('buy');
  const [searchQuery, setSearchQUery] = useState<string>("")
  const submit = useSubmit()
  // console.log(selectedButton)
  // console.log(searchQuery)
  
  function handleSearch() {
    console.log("Handling search")

    try {
      const formData = new FormData();
      // TODO if selectedButton not in ['buy','sell','invest','rent'] raise error
      const selectedButton = (formData.get("action") || "").toString();
      const searchQuery = (formData.get("search") || "").toString();
      console.log("Values appended to formData")

      // submit(formData, { method: 'post', replace: true })
      const en = `/explore/map/?action=${selectedButton}&search=${searchQuery}/`

      console.log("Redirecting to: ", en)
      // console log constructed url 
      // ....and redirect to it
    
      return redirect(en);
    } catch {
      console.log("Error submitting form")
    }
  }

  const handleButtonClick = (button: string) => {
    setSelectedButton(button);
  };

  
  return (
    <div className="w-full h-full">
      <div id="Land" className="w-full h-auto md:h-screen  bg-blend-multiply  bg-[url('/images/rendering-house-model.png')] ">
        <div className="w-full relative h-full bg-gradient-to-r from-purple-800 bg-blend-overlay  big-[url('/images/landed-properties.png')">

          <Header />

          <div className="w-full h-auto">
            <div className="mt-20 md:mt-36 md:ml-10 items-start space-y-4">
              <h1 className="w-full md:w-2/3 text-center tracking-tighter drop-shadow-lg md:text-start text-5xl md:text-7xl font-extrabold  text-white ">
                Discover Spaces That Suit Your Needs
              </h1>
              <h2 className="mx-2 text-white text-md md:text-lg text-center md:text-start">
                Connecting renters, buyers, and investors to 
                available properties
              </h2>
            </div>
            

            <div className="w-full flex justify-center p-2 h-16 mt-4">
              <div className="w-4/6 md:w-1/2 p-2 flex items-center space-x-2 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
                <button
                  className={`p-2 flex-grow  justify-center items-center rounded-full transition-all ${
                    selectedButton === 'buy' ? 'bg-white shadow-md font-bold' : 'font-medium '
                  }`}
                  onClick={() => handleButtonClick('buy')}
                >
                  Buy
                </button>
                <button
                  className={`p-2 flex-grow justify-center items-center rounded-full transition-all ${
                    selectedButton === 'sell' ? 'bg-white shadow-md font-bold' : 'font-medium bg-transparent'
                  }`}
                  onClick={() => handleButtonClick('sell')}
                >
                  Sell
                </button>
                <button
                  className={`p-2  flex-grow  justify-center items-center rounded-full transition-all ${
                    selectedButton === 'rent' ? 'bg-white shadow-md font-bold' : 'font-medium bg-transparent'
                  }`}
                  onClick={() => handleButtonClick('rent')}
                >
                  Rent
                </button>
                <button
                  className={`p-2 flex-grow  justify-center items-center rounded-full transition-all ${
                    selectedButton === 'invest' ? 'bg-white shadow-md font-bold' : 'font-medium bg-transparent'
                  }`}
                  onClick={() => handleButtonClick('invest')}
                >
                  Invest
                </button>
              </div>
            </div>   

            <div id="search-bar" className="w-full flex justify-center mt-4 p-2 h-16">
              <form  className="bg-white w-5/6 md:w-2/3 flex items-center rounded-full">
              <input 
                type="text" 
                onChange={(e) => {setSearchQUery(e.target.value)}} 
                className="w-full h-full text-sm md:text-md flex-1 p-3 focus:outline-none ring-0 active:ring-0 rounded-full active:border-none" placeholder="Search for street name, city, property type, zip code... "/>
              <button
                className="border-2 text-xs md:text-md border-white bg-purple-600 hover:bg-purple-800 rounded-full text-white text-bold h-full  px-3 md:px-5 "
                // On click contruct a url with search params and useNavigate to it
                onClick={() =>  handleSearch()}
              >
                Search
              </button>
              </form>
            </div> 
          </div>

          <div className="md:absolute bottom-3 right-3 w-full flex mb-10 md:mb-0 justify-end">
              <Link to="/#property-types" className="flex justify-center items-center mr-5 rounded-full p-3 text-white text-xl transition ease-in hover:bg-white">
                  <ChevronDownIcon className="w-8 h-8 flex text-purple-600 border-2 rounded-full border-white items-center" />
              </Link>
          </div>
        </div>
      </div>

      <div id="property-types" className="flex-col font-sans justify-center py-10">
        <div className="p-3 w-full flex-col justify-center items-center">
          <h1 className="text-3xl  flex justify-center font-bold"> Explore The Luxuries Of RASPA</h1>
          <h1 className="text-purple-600 font-semibold flex justify-center"> Explore The Luxuries Of RASPA</h1>
        </div>

        <div className="md:flex md:flex-grow md:space-x-3 md:items-start w-full px-2 h-auto">
          {property_types.map((type: PTCP) => (
              <PropertyTypeCard  key={type.title} {...type} />
          ))}
        </div>
      </div>

      <div className="flex-col justify-center py-10">
        <div className="p-3 w-full flex justify-center mb-5">
          <h1 className="text-3xl font-bold"> New Listed Homes In RASP Akure, Nigeria </h1>
        </div>

        <div className="md:flex md:flex-grow md:space-x-3 md:items-start w-full px-2 h-auto">
          {akure_property.map((property: IProperty) => (
            <PropertyCard key={property.address} {...property} />
          ))}
        </div>

        <Link to="/explore?search=Akure" className="text-sm italic text-purple-600 flex justify-end text-rasppurple">
          View all...
        </Link>

      </div>

      <div className="flex-col justify-center bg-purple-50 pt-2 pb-5">
        <div className="p-3 flex justify-center items-center">
          <h1 className="text-3xl font-bold"> See how RASP can help you  </h1>
        </div>

        <div className="md:flex space-y-2 md:space-y-0 md:flex-grow md:space-x-3 md:items-start w-full px-2 h-auto">
          {our_services.map((service: IService) => (
            <ServiceDescriptionCard key={service.url} {...service} />
          ))}
        </div>
      </div>

      <div id="our-mission" className="my-5 p-3 flex-col justify-center space-y-3">
        <img 
          className=""
          src="/images/our-mission.png"
          alt="our-mission"
        />

        <div className="< flex items-center space-x-3 p-3">
          <div className="< w-1/4 flex justify-center items-center">
            <h1 className="text-3xl md:text-5xl font-bold drop-shadow border-b border-purple-600 text-purple-600">RASPA</h1>
          </div>  
          
          <p className="< tracking-wide w-3/4 text-lg text-gray-800">RASP is your one-stop website, empowering you to seamlessly buy, sell, rent a home, and invest in properties, offering a comprehensive platform for all your real estate needs</p>
          
        </div>
      </div>

      <div id="newsletter-signup" className="w-full flex-col justify-center py-20 ">
        <div className="flex w-full justify-center p-2">
          <p className="text-purple-600 text-xl md:text-3xl font-medium">Sign up for exciting updates on RASPA</p>
        </div>

        <div className="flex w-full justify-center">
          <NewsLetterForm />
        </div>
      </div>

      <div id="footer" className="bg-purple-600 w-full h-40">
        <Footer />
      </div>
      
    </div>
  );
}



export async function action({request,}: ActionFunctionArgs) {
  const currUrl = new URL(request.url)
  const form = await request.formData()
  // const destination: string = currUrl.searchParams.get('destination') ?? '/'
  const action = (form.get("action") || "").toString();
  const search = (form.get("search") || "").toString();
  
  // const en = `https://wta-api-build.onrender.com/directory/service-locations/?action=${action}&search=${search}`
  const en = `/explore/map/?action=${action}&search=${search}`

  console.log("Redirecting to: ", en)
  // console log constructed url 
  // ....and redirect to it

  return redirect(en)
}