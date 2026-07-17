"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ScrollDownAnimation from "../../componentss/scroll-down";

type ListingType = "sale" | "rent" | "investment";

export function PropertySearch() {
  const [selectedButton, setSelectedButton] = useState<ListingType>("sale");
  const [searchQuery, setSearchQuery] = useState("");

  const exploreHref = `/explore?search=${encodeURIComponent(
    searchQuery
  )}&property__size=&property__type=&listing_type=${selectedButton}&price__lte=&price__gte=`;

  return (
    <AnimatePresence>
      <div
        id="Land"
        className="w-full h-auto md:h-screen bg-blend-multiply bg-[url('/images/rendering-house-model.png')]"
      >
        <motion.div
          initial={{ opacity: 0.2, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 1 }}
          className="w-full relative h-full bg-gradient-to-r from-purple-800 bg-blend-overlay"
        >
          <div className="w-full h-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1.1, 1] }}
              exit={{ opacity: 0 }}
              transition={{ ease: "easeInOut", duration: 1 }}
              className="mt-16 w-full md:mt-36 px-2 md:px-10 items-start space-y-4"
            >
              <span className="w-full md:w-2/3 text-center text-pretty font-extrabold tracking-tighter drop-shadow-lg md:text-start text-5xl md:text-7xl text-white">
                <h1>Discover Spaces</h1>
                <p>That Suit Your Needs</p>
              </span>
              <h2 className="mx-2 text-white text-md md:text-lg text-center md:text-start">
                Connecting renters, buyers, and investors to available
                properties
              </h2>
            </motion.div>

            <div className="w-full flex justify-center p-2 h-16 mt-4">
              <div
                className="w-4/6 md:w-1/2 p-2 text-gray-800 flex items-center space-x-2 rounded-full"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
              >
                {(["sale", "rent", "investment"] as ListingType[]).map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      className={`p-2 flex-grow justify-center items-center rounded-full transition-all capitalize ${
                        selectedButton === option
                          ? "bg-white shadow-md font-bold"
                          : "font-medium"
                      }`}
                      onClick={() => setSelectedButton(option)}
                    >
                      {option === "investment" ? "Invest" : option}
                    </button>
                  )
                )}
              </div>
            </div>

            <div id="search-bar" className="w-full flex justify-center mt-4 p-2 h-16">
              <span className="bg-white w-5/6 md:w-2/3 flex items-center rounded-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full text-sm md:text-md flex-1 p-3 focus:outline-none rounded-full"
                  placeholder="Search for street name, city, property type, zip code... "
                />
                <Link
                  href={exploreHref}
                  className="flex items-center justify-center border-2 text-xs md:text-md border-white bg-purple-600 hover:bg-purple-800 rounded-full text-white font-bold h-full px-3 md:px-5"
                >
                  Search
                </Link>
              </span>
            </div>
          </div>

          <div className="md:absolute bottom-3 right-3 w-full flex mb-10 md:mb-0 justify-end">
            <span className="transition ease-in-out hover:animate-slideTtB">
              <ScrollDownAnimation scrollTopValue={300} />
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}