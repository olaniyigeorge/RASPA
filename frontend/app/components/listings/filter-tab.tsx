import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";




export default function ListingsFilter() {
    const [selectedAction, setSelectedAction] = useState<string>('sale')
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [propertyType, setPropertyType] = useState<string>('')
    const [size, setSize] = useState<number | string>()
    const [minPrice, setMinPrice] = useState<number | any>("")
    const [maxPrice, setMaxPrice] = useState<number | any >("")
    
    const [filterEndpoint,setfilterEndpoint] = useState<string>();

    const [minPriceDropDown, setminPriceDropDown] = useState<boolean>(false)
    const [maxPriceDropDown, setmaxPriceDropDown] = useState<boolean>(false)
    const [sizeInputVisible, toggleSizeInput] = useState<boolean>(false)
    const [propertyTypeInputVisible, togglePropertyTypeInputVisible] = useState<boolean>(false)


    const baseEndpoint = "/api/listings/?search=&property__size=&price=&property__features__name=&property__type=&property__features__count=&listing_type=&price__lte=&price__gte="

    const dropdownRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
      const handleClickOutsideDropdown = (event: { target: any; }) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          toggleSizeInput(false)
          togglePropertyTypeInputVisible(false)
          setminPriceDropDown(false);
          setmaxPriceDropDown(false);

        }
    };
    
      document.addEventListener('mousedown', handleClickOutsideDropdown);
    
      return () => {
        document.removeEventListener('mousedown', handleClickOutsideDropdown);
      };
    }, []);
    // Gets filter options and generates endpoint send submit(url) to form, redirect to explore/urlsEndpoint stub
    // search-query, city(location), action(rent,sale,invest), size, min-price, max-price

    setfilterEndpoint(`/api/listings/?search=${searchQuery}&property__size=${size}&price=${""}&property__features__name=${""}&property__type=${""}&property__features__count=${""}&listing_type=${selectedAction}&price__lte=&${maxPrice}price__gte=${minPrice}`)


    const handleButtonClick = (button: string) => {
        setSelectedAction(button);
      };

    useEffect(() => {
      
    setfilterEndpoint(`/api/listings/?search=&property__size=${size}&price=${""}&property__features__name=${""}&property__type=${""}&property__features__count=${""}&listing_type=${selectedAction}&price__lte=&${""}price__gte=${""}`)

    

    }, [selectedAction, filterEndpoint, searchQuery, minPrice, maxPrice, size])

    return <>

      <div id="listing-filters" className="p-4 text-sm md:text-md ">
        <span className="w-full flex space-x-3 justify-start items-center">
          <h1 className="text-xl font-medium text-gray-900">
            Filter your search result
          </h1>

          <p className="text-xs">{filterEndpoint}</p>
        </span>
            
        <section className=" w-full text-gray-800  border-b border-gray-200 py-1 md:flex justify-start space-y-1 md:space-y-0 md:space-x-10 items-center ">
            <input type="text" onChange={(e) => {setSearchQuery(e.target.value)}} placeholder="Search properties" className="border  border-purple-300 focus:outline-purple-600 p-2 rounded h-10 w-full md:w-[400px] "/>
            

            <div className="  flex justify-center mt-4">
              <div className=" p-1 flex items-center space-x-2 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>            
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
                    selectedAction === 'sale' ? 'bg-purple-600 text-white shadow-md font-medium' : ' '
                  }`}
                  onClick={() => handleButtonClick('sale')}
                >
                  Sale
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
                
                
                <button className="rounded-md border bg-white p-2">
                  {propertyTypeInputVisible ? <div className="">
                    <div ref={dropdownRef} className="">
                      <input type="text" className=" text-gray-900 focus:outline-none" onChange={(e) => {setSearchQuery(e.target.value)}} />                  
                    
                    </div>
                    
                  </div>
                    :
                    <><span className="flex items-center space-x-2 ">
                    <p>Houses/Land </p> 
                    <ChevronDownIcon onClick={() => {togglePropertyTypeInputVisible(!propertyTypeInputVisible)}} className="w-4 h-4" />
                    </span></>}
                  </button>


                <button className="rounded-md border bg-white p-2">
                  {sizeInputVisible ? <div className="">
                    <div ref={dropdownRef} className="">
                      <input type="number" className="text-gray-900 focus:outline-none" onChange={(e) => {setSize(e.target.value)}} />                  
                    
                    </div>
                    
                  </div>
                    :
                    <><span className="flex items-center space-x-2 ">
                    <p>Size</p> 
                    <ChevronDownIcon onClick={() => {toggleSizeInput(!sizeInputVisible)}} className="w-4 h-4" />
                    </span></>}
                  </button>
                  


                <button className="rounded-md border bg-white p-2 relative">
                  <div ref={dropdownRef} className="w-full flex justify-start space-x-2 items-center">
                    <span className={` justify-start items-center ${minPriceDropDown ? "hidden": "flex"}`}>Min Price</span>
  
                    <span className={`justify-start items-center  ${minPriceDropDown ? "flex": "hidden"}`}>
                      <input type="number" className="w-[12px] focus:outline-none" onChange={(e) => {setMinPrice(e.target.value)}} />
                    </span>
                    <ChevronDownIcon  onClick={() => {setminPriceDropDown(!minPriceDropDown)}} className="w-4 h-4" />
                  </div>
                  
              

                  {minPriceDropDown? (
                    <div className="absolute transform duration-500 flex flex-col justify-start translate-y-0 border bg-white z-20 rounded top-10 right-0 w-full">
                      <p onClick={() => {setMinPrice(100000)}}>100000</p>
                      <p onClick={() => {setMinPrice(200000)}}>200000</p>
                      <p onClick={() => {setMinPrice(300000)}}>300000</p>
                      <p onClick={() => {setMinPrice(15000000)}}>15000000</p>
                      <p onClick={() => {setMinPrice(30000000)}}>30000000</p>                    
                    </div>
                  ): ""}
                  
                   
                </button>
                <button className="rounded-md border bg-white p-2 relative">
                  <div className="w-full flex justify-start space-x-2 items-center">
                    <span className={` justify-start items-center ${maxPriceDropDown ? "hidden": "flex"}`}>Max Price</span>
  
                    <span className={`justify-start items-center  ${maxPriceDropDown ? "flex": "hidden"}`}>
                      <input type="number" className="w-auto focus:outline-none" onChange={(e) => {setMaxPrice(e.target.value)}} />
                    </span>
                    <ChevronUpIcon onClick={() => {setmaxPriceDropDown(!maxPriceDropDown)}} className="w-4 h-4" />
                  </div>

                  {maxPriceDropDown? (
                    <div className="absolute transform duration-500 flex flex-col justify-start translate-y-0 border bg-white z-20 rounded top-10 right-0 w-full">
                      <p onClick={() => {setMaxPrice(minPrice*1.5)}}>{minPrice*1.5}</p>
                      <p onClick={() => {setMaxPrice(200000)}}>200000</p>
                      <p onClick={() => {setMaxPrice(75000000)}}>75 million</p>
                      <p onClick={() => {setMaxPrice(150000000)}}>150 million</p>
                      <p onClick={() => {setMaxPrice("")}}>No cap</p>                    
                    </div>
                  ): ""}
                  
                   
                </button>
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
  throw new Error("Not Implemented")
}
