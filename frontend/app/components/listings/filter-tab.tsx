import { useEffect, useState } from "react";




export default function ListingsFilter() {
    const [selectedAction, setSelectedAction] = useState<string>('sale')
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [minPrice, setMinPrice] = useState<number>(0)
    const [maxPrice, setMaxPrice] = useState<number>(500000)
    const [size, setSize] = useState<number>()


    const baseEndpoint = "/api/listings/?property__size=&price=&property__features__name=&property__type=&property__features__count=&listing_type=&price__lte=&price__gte="


    // Gets filter options and generates endpoint
    // search-query, city(location), action(rent,sale,invest), size, min-price, max-price

    const filterEndpoint = `/api/listings/?property__size=${size}&price=${""}&property__features__name=${""}&property__type=${""}&property__features__count=${""}&listing_type=${selectedAction}&price__lte=&${""}price__gte=${""}`
    const handleButtonClick = (button: string) => {
        setSelectedAction(button);
      };

    useEffect(() => {

    const filterEndpoint = `/api/listings/?property__size=${size}&price=${""}&property__features__name=${""}&property__type=${""}&property__features__count=${""}&listing_type=${selectedAction}&price__lte=&${""}price__gte=${""}`

    }, [selectedAction, searchQuery, minPrice, maxPrice, size])

    return <>

      <div id="listing-filters" className="p-4 text-sm md:text-md ">
        <span className="w-full flex space-x-3 justify-start items-center">
          <h1 className="text-xl font-medium text-gray-900">
            Filter your search result
          </h1>

          <p className="text-xs">{filterEndpoint}</p>
        </span>
            
        <section className=" w-full text-gray-800  border-b border-gray-200 py-1 md:flex justify-start space-y-1 md:space-y-0 md:space-x-10 items-center ">
            <input type="text" placeholder="Search properties" className="border  border-purple-300 focus:outline-purple-600 p-2 rounded h-10 w-full md:w-[400px] "/>
            

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
      </div>
    </>
}


interface filterParams {
  property__size: string;
  price?: string;
  property__features__name: string;
  property__type: string;
  property__features__count: string;
  listing_type: string;
  price__lte: string;
  price__gte: string;

}

function constructFilterEndpoint(props: filterParams) {
  
}
