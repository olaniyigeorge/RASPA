import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "~/components/header";
import PropertyTypeCard, { property_types, PTCP } from "~/components/property-type-card";

export const meta: MetaFunction = () => {
  return [
    { title: "Rent A Space Akure" },
    { name: "description", content: "Welcome to RASP, Akure!" },
  ];
};

export default function Index() {
  const [selectedButton, setSelectedButton] = useState<string>('buy');

  const handleButtonClick = (button: string) => {
    setSelectedButton(button);
  };

  
  return (
    <div className="w-full h-full">
      <div id="Land" className="w-full h-auto md:h-screen bg-purple-500  bg-blend-multiply  bg-[url('/images/rendering-house-model.png')] ">
    
          <Header />

        <div className="w-full h-auto">
          <div className="mt-20 md:mt-36 md:ml-10 items-start space-y-4">
            <h1 className="w-full md:w-2/3  text-center md:text-start  text-3xl sm:text-7xl font-extrabold text-white ">
              Discover Spaces That Suit Your Needs
            </h1>
            <h2 className="mx-2 text-white text-center md:text-start  text-xl md:text-2xl font-medium">
              Connecting renters, buyers, and investors to 
              available properties
            </h2>
          </div>
          

          <div className="w-full flex justify-center p-2 h-16 mt-4">
            <div className="w-4/6 md:w-1/2 p-2 flex items-center space-x-2 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
              <button
                className={`p-2 flex-grow justify-center items-center rounded-full transition-all ${
                  selectedButton === 'buy' ? 'bg-white shadow-md font-bold' : ''
                }`}
                onClick={() => handleButtonClick('buy')}
              >
                Buy
              </button>
              <button
                className={`p-2 flex-grow justify-center items-center rounded-full transition-all ${
                  selectedButton === 'sell' ? 'bg-white shadow-md font-bold' : 'bg-transparent'
                }`}
                onClick={() => handleButtonClick('sell')}
              >
                Sell
              </button>
              <button
                className={`p-2  flex-grow justify-center items-center rounded-full transition-all ${
                  selectedButton === 'rent' ? 'bg-white shadow-md font-bold' : 'bg-transparent'
                }`}
                onClick={() => handleButtonClick('rent')}
              >
                Rent
              </button>
              <button
                className={`p-2 flex-grow justify-center items-center rounded-full transition-all ${
                  selectedButton === 'invest' ? 'bg-white shadow-md font-bold' : 'bg-transparent'
                }`}
                onClick={() => handleButtonClick('invest')}
              >
                Invest
              </button>
            </div>
          </div>   

          <div id="search-bar" className="w-full flex justify-center mt-4 p-2 h-16">
            <div className="w-5/6 md:w-2/3 flex items-center space-x-2  rounded-full">
            <input type="text" className="w-full h-full flex-1 p-3 ring-0 active:ring-0 rounded-full active:border-none" placeholder="Search for street name, city, property type, zip code... "/>
            <button
              className="border-2 text-xs md:text-md border-white shadow-md bg-purple-600 rounded-full text-white text-bold h-full  p-2 md:px-5 "
              // On click contruct a url with search params and useNavigate to it
              onClick={() => handleButtonClick('invest')}
            >
              Search
            </button>
            </div>
          </div> 
        </div>

          <div className="w-full flex mb-10 md:mb-0 justify-end">
              <Link to="/#property-types" className="flex justify-center items-center mr-5 rounded-full p-3 text-white text-xl hover:text-purple-600 hover:bg-white">
                  ^
              </Link>
          </div>
      </div>

      <div id="property-types" className="flex-col justify-center mt-8">
        <div className="p-3 w-full flex-col justify-center items-center">
          <h1 className="text-3xl flex justify-center font-bold"> Explore The Luxuries Of RASPA</h1>
          <h1 className="text-purple-600 font-semibold flex justify-center"> Explore The Luxuries Of RASPA</h1>
        </div>

        <div className="md:flex md:flex-grow md:space-x-3 md:items-start w-full px-2 h-auto">
          {property_types.map((type: PTCP) => (
              <PropertyTypeCard  key={type.title} {...type} />
          ))}
        </div>
      </div>

      <div className="flex-col justify-center mt-4">
        <div className="p-3">
          <h1 className="text-3xl font-bold"> New Listed Homes In RASP Akure, Nigeria </h1>
        </div>

        <div className="p-3 h-40">
          Property type cards
        </div>

        <span className="flex justify-end text-rasppurple">
          View all...
        </span>

      </div>

      <div className="flex-col justify-center">
        <div className="p-3">
          <h1 className="text-3xl font-bold"> See how RASP can help you  </h1>
        </div>

        <div className="p-3 h-40">
          Service Desciption Cards
        </div>
      </div>

      <div id="our-mission" className="flex-col justify-center h-40">
        <img 
          className="p-3"
          src=""
          alt="our-mission"
        />

        <div className="md:flex">
          <p>RASPA</p>
          <p>RASP is your one-stop website, empowering you to seamlessly buy, sell, rent a home, and invest in properties, offering a comprehensive platform for all your real estate needs</p>
          
        </div>
      </div>

      <div id="newsletter-signup" className="flex-col justify-center h-20">
        <p>Sign up for exciting updates on RASPA</p>

        <div className="md:flex">
          Email form for newsletter
        </div>
      </div>

      <div id="footer" className="bg-purple-600 w-full h-40">
        <div className="bg-rasppurple">
            Footer
        </div>

      </div>
      
    </div>
  );
}
