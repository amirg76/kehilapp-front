import React from "react";
import HeroSectionLeftSvg from "./SvgFiles/HeroSectionLeftSvg";
import HeroSectionRightSvg from "./SvgFiles/HeroSectionRightSvg";
import logoKisufim from "../img/logo-kibbuttz-transpert.png"

const HeroSection = () => {
  return (
    <div className="relative h-[50vh] flex justify-between">
      {/* <div className="w-[10em] h-[5em]"> */}
      <img
        className="mt-10 object-cover w-[10em] h-[5em]"
        src={logoKisufim}
        alt="Your Company"
      />
     <div>
        <div className="absolute bottom-0 left-[60%] h-1/2 w-2/5 z-10">
          <HeroSectionRightSvg imgfile="tree.png" />
        </div>
        <div className="h-full relative bottom-0 left-0">
          <HeroSectionLeftSvg imgfile="eat.png" />
      </div>
     </div>
    </div>
  );
};

export default HeroSection;
