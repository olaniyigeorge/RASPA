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
                  className={`p-2  flex-grow hover:bg-purple-600 justify-center items-center rounded-full transition-all ${
                    selectedAction === 'rent' ? 'bg-purple-600 text-white shadow-md font-medium' : ''
                  }`}
                  onClick={() => handleButtonClick('rent')}
                >
                  Rent
                </button>
                <button
                  className={`p-2 flex-grow hover:bg-purple-600 justify-center items-center rounded-full transition-all ${
                    selectedAction === 'sale' ? 'bg-purple-600 text-white shadow-md font-medium' : ' '
                  }`}
                  onClick={() => handleButtonClick('sale')}
                >
                  Sale
                </button> 
                <button
                  className={`p-2 flex-grow hover:bg-purple-600 justify-center items-center rounded-full transition-all ${
                    selectedAction === 'invest' ? 'bg-purple-600 text-white shadow-md font-medium' : ''
                  }`}
                  onClick={() => handleButtonClick('investment')}
                >
                  Invest
                </button>
              </div>
            </div>  

            <div className="w-full justify-between  text-xs md:text-sm lg:text-md flex lg:justify-start lg:space-x-10">  
                <button onMouseOver={() => {togglePropertyTypeInputVisible(true)}} onMouseOut={() => {togglePropertyTypeInputVisible(false)}}  onClick={() => {togglePropertyTypeInputVisible(!propertyTypeInputVisible)}} className="rounded-md border bg-white p-2 relative">
                    <><span className="flex items-center space-x-2 ">
                      <p>Property Type</p> 
                      <ChevronDownIcon className="w-4 h-4" />
                    </span></>
                  {propertyTypeInputVisible ?( <div  className="absolute transform  animate-fadeIn flex flex-col gap-1 justify-start translate-y-0 shadow bg-white bg-opacity-70 z-20 rounded top-10 right-0 w-full">
                  

                    
                      <p className="flex justify-start font-medium px-1" onClick={() => {setPropertyType("industrial")}}>Industrial</p>
                      <p className="flex justify-start font-medium px-1" onClick={() => {setPropertyType("commercial")}}>Commercial</p>
                      <p className="flex justify-start font-medium px-1" onClick={() => {setPropertyType("residential")}}>Residential</p>
                      <p className="flex justify-start font-medium px-1" onClick={() => {setPropertyType("land")}}>Land</p>
                      
                  
                      {/* <input type="text" className=" text-gray-900 focus:outline-none" onChange={(e) => {setSearchQuery(e.target.value)}} />                  
                     */}  
                    </div>)
                    :
                    ""}
                </button>

                <button  onMouseOver={() => {toggleSizeInput(true)}} onMouseOut={() => {toggleSizeInput(false)}}  onClick={() => {toggleSizeInput(!sizeInputVisible)}} className="rounded-md border bg-white ">
                  {sizeInputVisible ? <div className="">
                    <div onMouseOver={() => {toggleSizeInput(true)}} onMouseOut={() => {toggleSizeInput(false)}} className="">
                      <input autoFocus type="number" placeholder="Size" className="p-1 w-[30px]  text-gray-900 focus:outline-none" onChange={(e) => {setSize(e.target.value)}} />                  
                    
                    </div>
                    
                  </div>
                    :
                    <div  className="flex items-center space-x-2 p-2 ">
                    <p>Size</p> 
                    <ChevronDownIcon  className="w-4 h-4" />
                    </div>}
                </button> 

                <button onMouseOver={() => {setminPriceDropDown(true)}} onMouseOut={() => {setminPriceDropDown(false)}} onClick={() => {setminPriceDropDown(!minPriceDropDown)}} className="rounded-md border  duration-500 ease-in-out bg-white p-2 relative">
                  <div className="w-full flex justify-start space-x-2 items-center">
                    <span className={` justify-start items-center flex`}>Min Price</span>
                    
                    {/* {minPriceDropDown ? (
                      <span className={`justify-start items-center flex`}>
                        <input type="number" className="w-[25px] focus:outline-none" onChange={(e) => {setMinPrice(e.target.value)}} />
                      </span>
                    ):
                    (
                      <span className={` justify-start items-center flex`}>Min Price</span>
                    )
                    } */}
                    
                    <ChevronDownIcon  onClick={() => {setminPriceDropDown(!minPriceDropDown)}} className="w-4 h-4" />
                  </div>
                  
              

                  {minPriceDropDown? (
                    <div  className="absolute animate-fadeIn flex flex-col gap-1 transform duration-500 justify-start translate-y-0 shadow bg-opacity-70 bg-white z-20 rounded top-10 right-0 w-full">
                      <p className="flex justify-end font-medium px-1" onClick={() => {setMinPrice(0)}}> {`---`} </p>
                      <p className="flex justify-end font-medium px-1" onClick={() => {setMinPrice(25000)}}>25,000</p>
                      <p className="flex justify-end font-medium px-1" onClick={() => {setMinPrice(50000)}}>50,000</p>
                      <p className="flex justify-end font-medium px-1" onClick={() => {setMinPrice(100000)}}>100,000</p>
                      <p className="flex justify-end font-medium px-1" onClick={() => {setMinPrice(125000)}}>125,000</p>                    
                    </div>
                  ): ""}
                  
                   
                </button>
                
                <button onMouseOver={() => {setmaxPriceDropDown(true)}} onClick={() => {setmaxPriceDropDown(true)}} onMouseOut={() => {setmaxPriceDropDown(false)}} className="rounded-md border bg-white p-2 relative">
                  <div className="w-full flex justify-start space-x-2 items-center">
                    <span className={` justify-start items-center flex}`}>Max Price</span>
                    
                    {/* {maxPriceDropDown ? (
                      <span className={`justify-start items-center flex`}>
                        <input type="number" className="w-[25px] focus:outline-none" onChange={(e) => {setMaxPrice(e.target.value)}} />
                      </span>
                    ):
                    (
                      <span className={` justify-start items-center flex`}>Max Price</span>
                    )
                    }  */}
                    <ChevronUpIcon onClick={() => {setmaxPriceDropDown(!maxPriceDropDown)}} className="w-4 h-4" />
                  </div>

                  {maxPriceDropDown? (
                    <div className="absolute transform animate-fadeIn flex flex-col gap-1 justify-start translate-y-0 shadow bg-opacity-70 bg-white z-20 rounded top-10 right-0 w-full">
                      <p className="flex justify-end font-medium px-1" onClick={() => {setMaxPrice(300000)}}>300,000</p>
                      <p className="flex justify-end font-medium px-1" onClick={() => {setMaxPrice(500000)}}>500,000</p>
                      <p className="flex justify-end font-medium px-1" onClick={() => {setMaxPrice(750000)}}>750,000</p>
                      <p className="flex justify-end font-medium px-1" onClick={() => {setMaxPrice(1500000)}}>1.5m</p>
                      <p className="flex justify-end font-medium px-1" onClick={() => {setMaxPrice("")}}>Max cap</p>                    
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

