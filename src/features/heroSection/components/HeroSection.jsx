import React from "react";
import HeroSectionLeftSvg from "./SvgFiles/HeroSectionLeftSvg";
import HeroSectionRightSvg from "./SvgFiles/HeroSectionRightSvg";
import logoKisufim from "../img/logo-kibbuttz-transpert.png"

const HeroSection = () => {
  return (
    <div className="relative sm:h-[50vh] flex flex-col my-5 sm:flex-row sm:justify-between md:mr-5">
      {/* <div className="w-[10em] h-[5em]"> */}
      <img
        className="object-cover w-[10em] h-[5em]"
        src={logoKisufim}
        alt="Your Company"
      />
      <div className="w-full h-full">
        <div className="w-full h-full sm:absolute bottom-0 left-[60%] sm:h-1/2 sm:w-2/5 z-10">
          <HeroSectionRightSvg imgfile="tree.png" />
        </div>
        <div className="hidden sm:block h-full relative bottom-0 left-0">
          <HeroSectionLeftSvg imgfile="eat.png" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
