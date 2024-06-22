import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { useFetcher } from '@remix-run/react';
import { getUrl } from "~/api/util";




export default function ListingsFilter() {
    const [selectedAction, setSelectedAction] = useState<string>('')
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [propertyType, setPropertyType] = useState<string>('')
    const [size, setSize] = useState<any>("")
    const [minPrice, setMinPrice] = useState<number | any>("")
    const [maxPrice, setMaxPrice] = useState<number | any >("")
    
    const [filterEndpoint,setfilterEndpoint] = useState<string>("");

    const [minPriceDropDown, setminPriceDropDown] = useState<boolean>(false)
    const [maxPriceDropDown, setmaxPriceDropDown] = useState<boolean>(false)
    const [sizeInputVisible, toggleSizeInput] = useState<boolean>(false)
    const [propertyTypeInputVisible, togglePropertyTypeInputVisible] = useState<boolean>(false)
    const fetcher = useFetcher();

    const baseEndpoint = "/api/listings/?search=&property__size=&price=&property__features__name=&property__type=&property__features__count=&listing_type=&price__lte=&price__gte=";

    
    useEffect(() => {
      const form = new FormData();
      form.append('search', searchQuery);
      form.append('property__size', size);
      form.append('price__lte', maxPrice);
      form.append('price__gte', minPrice);
      form.append('property__type', propertyType);
      form.append('listing_type', selectedAction);
      fetcher.submit(form, { method: 'post', action: '/explore' });
    }, [filterEndpoint]);
  


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
    }, [selectedAction, filterEndpoint, propertyType, searchQuery, minPrice, maxPrice, size]);
    // Gets filter options and generates endpoint send submit(url) to form, redirect to explore/urlsEndpoint stub
    // search-query, city(location), action(rent,sale,invest), size, min-price, max-price

    // setfilterEndpoint(`/api/listings/?search=${searchQuery}&property__size=${size}&price=${""}&property__features__name=${""}&property__type=${""}&property__features__count=${""}&listing_type=${selectedAction}&price__lte=&${maxPrice}price__gte=${minPrice}`)


    const handleButtonClick = (button: string) => {
        setSelectedAction(button);
      };

    useEffect(() => {
    const en = `?search=${searchQuery}&property__size=${size}&price=${""}&property__features__name=${""}&property__type=${propertyType}&property__features__count=${""}&listing_type=${selectedAction}&price__lte=&${maxPrice}price__gte=${minPrice}`
    const end = getUrl('listings', en)
    setfilterEndpoint(end)

    

    }, [selectedAction, filterEndpoint, propertyType, searchQuery, minPrice, maxPrice, size])

    return <div id="listing-filters" className="w-full border-b flex justify-between">

      <div className="px-4 py-1 w-full  text-sm md:text-md ">
        <span className="w-full flex space-x-3 justify-start items-center">
          <h1 className="text-xl font-medium text-gray-900">
            Filter your search result
          </h1>

          <p className="text-xs hidden text-justify">{filterEndpoint}</p>
        </span>
            
        <section className="w-full b text-gray-800   border-gray-200 py-1 lg:flex justify-start space-y-2 lg:space-y-0 lg:space-x-3 xl:space-x-10 items-center ">
            <input type="text" onChange={(e) => {setSearchQuery(e.target.value)}} placeholder="Search properties" className="border  border-purple-300 focus:outline-purple-600 p-2 rounded h-10 w-full md:w-[400px] "/>
            

            <div className="text-xs  md:text-sm lg:text-md flex justify-center ">
              <div className="p-1 bg-opacity-30 md:space-x-2 bg-white  w-2/3 lg:w-auto shadow flex items-center space-x-2 rounded-full" >            
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
                  onClick={() => handleButtonClick('investment')}
                >
                  Invest
                </button>
              </div>
            </div>  

            <div className="w-full justify-between  text-xs md:text-sm lg:text-md flex lg:justify-start lg:space-x-10">  
                <button className="rounded-md border bg-white p-2 relative">
                    <><span className="flex items-center space-x-2 ">
                      <p>Houses/Land </p> 
                      <ChevronDownIcon onClick={() => {togglePropertyTypeInputVisible(!propertyTypeInputVisible)}} className="w-4 h-4" />
                    </span></>
                  {propertyTypeInputVisible ?( <div  ref={dropdownRef} className="absolute transform duration-500 flex flex-col justify-start translate-y-0 border bg-white z-20 rounded top-10 right-0 w-full">
                  

                    
                      <p onClick={() => {setPropertyType("industrial")}}>Industrial</p>
                      <p onClick={() => {setPropertyType("commercial")}}>Commercial</p>
                      <p onClick={() => {setPropertyType("residential")}}>Residential</p>
                      <p onClick={() => {setPropertyType("land")}}>Land</p>
                      
                  
                      {/* <input type="text" className=" text-gray-900 focus:outline-none" onChange={(e) => {setSearchQuery(e.target.value)}} />                  
                     */}  
                    </div>)
                    :
                    ""}
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
                    <div ref={dropdownRef} className="absolute transform duration-500 flex flex-col justify-start translate-y-0 border bg-white z-20 rounded top-10 right-0 w-full">
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
                    <div ref={dropdownRef} className="absolute transform duration-500 flex flex-col justify-start translate-y-0 border bg-white z-20 rounded top-10 right-0 w-full">
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
    </div>
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
