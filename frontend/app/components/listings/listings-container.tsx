import PropertyCard, { akure_property, IProperty } from "../property-card";




export default function ListingContainier(props: IProperty[]) {

    // const listings = {...props}

    // console.log(listings)


    return <div className="w-full md:w-4/5 md:grid grid-cols-3 gap-3 justify-between">
    {/* Map over akure_property array and render PropertyCard components      md:flex md:flex-grow md:space-x-3 md:items-start w-3/5 px-2 h-auto */}
    {/* Make sure akure_property is defined and is an array of IProperty objects */}
    {/* Example: */}
    {akure_property.map((property: IProperty) => (
        <PropertyCard key={property.address} {...property} />
    ))} 

</div>
}