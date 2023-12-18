import React from "react";
import HeroSectionLeftSvg from "./SvgFiles/HeroSectionLeftSvg";
import HeroSectionRightSvg from "./SvgFiles/HeroSectionRightSvg";
import logoKisufim from "../img/logo-kibbuttz-transpert.png"

const HeroSection = () => {
  return (
    <div className="relative h-fit flex justify-between mx-3">
      {/* <div className="w-[10em] h-[5em]"> */}
        <img
          className="mt-10 object-cover w-[10em] h-[5em]"
          src={logoKisufim}
          alt="Your Company"
        />
      {/* </div> */}

      <div className="absolute bottom-0 right-[20rem]   ">
        <HeroSectionRightSvg imgfile="tree.png" />
      </div>
      <div>
        <HeroSectionLeftSvg imgfile="eat.png" />
      </div>
    </div>
  );
};

export default HeroSection;
