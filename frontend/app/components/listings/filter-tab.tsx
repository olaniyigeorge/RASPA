import { useState } from "react";




export default function ListingsFilter() {
    const [selectedAction, setSelectedAction] = useState<string>('sale')

    const baseEndpoint = "/api/listings/?property__size=&price=&property__features__name=&property__type=&property__features__count=&listing_type=&price__lte=&price__gte="


    // Gets filter options and generates endpoint
    // search-query, city(location), action(rent,sale,invest), size, min-price, max-price


    const handleButtonClick = (button: string) => {
        setSelectedAction(button);
      };


    return <>
        <section className=" w-full text-gray-800  border-b border-gray-200 py-1 md:flex justify-start space-y-1 md:space-y-0 md:space-x-10 items-center ">
            <input type="text" placeholder="Search properties" className="border  border-red-500 focus:outline-purple-600 p-2 rounded h-10 w-full md:w-[400px] border-white"/>
            

            <div className="  flex justify-center mt-4">
              <div className=" p-1 flex items-center space-x-2 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
                <button
                  className={`p-2 flex-grow  justify-center items-center rounded-full transition-all ${
                    selectedAction === 'sale' ? 'bg-purple-600 text-white shadow-md font-medium' : ' '
                  }`}
                  onClick={() => handleButtonClick('sale')}
                >
                  Buy
                </button>
                <button
                  className={`p-2 flex-grow justify-center items-center rounded-full transition-all ${
                    selectedAction === 'SALE' ? 'bg-purple-600 text-white shadow-md font-medium' : ''
                  }`}
                  onClick={() => handleButtonClick('SALE')}
                >
                  Sell
                </button>
                <button
                  className={`p-2  flex-grow  justify-center items-center rounded-full transition-all ${
                    selectedAction === 'rent' ? 'bg-purple-600 text-white shadow-md font-medium' : ''
                  }`}
                  onClick={() => handleButtonClick('rent')}
                >
                  Rent
                </button>
                <button
                  className={`p-2 flex-grow  justify-center items-center rounded-full transition-all ${
                    selectedAction === 'invest' ? 'bg-purple-600 text-white shadow-md font-medium' : ''
                  }`}
                  onClick={() => handleButtonClick('invest')}
                >
                  Invest
                </button>
              </div>
            </div>  


            <div className=" flex justify-start space-x-3 md:space-x-10 w-full ">
                <button className="rounded-md border bg-white p-2 line-clamp-1"> Houses/Land  </button>
                <button className="rounded-md border bg-white p-2"> Location </button>
                <button className="rounded-md border bg-white p-2"> Min Price </button>
                <button className="rounded-md border bg-white p-2"> Max Price </button>
            </div>
        </section>
    </>
}