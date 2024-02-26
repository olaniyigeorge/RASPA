import type { MetaFunction } from "@remix-run/node";
import PropertyTypeCard, { property_types, PTCP } from "~/components/property-type-card";

export const meta: MetaFunction = () => {
  return [
    { title: "Rent A Space Akure" },
    { name: "description", content: "Welcome to RASP, Akure!" },
  ];
};

export default function Index() {
  return (
    <div className="w-full h-full">
      <div id="Land" className="w-full h-screen bg-purple-600">
        <p> This is RASPA</p>

      </div>

      <div className="flex-col justify-center mt-4">
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
