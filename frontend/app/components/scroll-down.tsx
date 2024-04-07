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
        <button onClick={scrollDown} className="">
            <ChevronDownIcon className="w-8 h-8 flex text-purple-600 border-2 rounded-full border-white items-center" />
        </button>
    </>

  );
};