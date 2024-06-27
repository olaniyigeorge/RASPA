import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import React, { useEffect } from "react";

interface ScrollDownAnimationProps {
  scrollTopValue: number;
}

export default function ScrollDownAnimation(props: ScrollDownAnimationProps) {
  const { scrollTopValue }= props
  const scrollDown = () => {
    window.scrollBy({
      top: scrollTopValue,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", scrollDown);
    };
  }, [scrollTopValue]);

  return (
    <> 
        <button onClick={scrollDown} className="w-8 h-8 flex text-white font-medium shadow rounded-full items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
          </svg>
        </button>
    </>

  );
};