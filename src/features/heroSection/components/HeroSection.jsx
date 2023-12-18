import React from "react";
import HeroSectionLeftSvg from "./SvgFiles/HeroSectionLeftSvg";
import HeroSectionRightSvg from "./SvgFiles/HeroSectionRightSvg";
const HeroSection = () => {
  return (
    <div className="relative h-fit flex justify-between  bg-[#efefef]">
      <div className="h-auto w-auto ">
        <img
          className="mt-10 bg-cover bg-no-repeat"
          src="img/logo-kibbuttz-transpert.png"
          alt="Your Company"
        />
      </div>

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
