import React from "react";
//images
import logoKisufim from "../img/logo-kibbuttz-transpert.png";
import bottomImg from "../img/image1.png";
import topImg from "../img/image2.png";

import SearchMessages from "@features/searchMessages/components/searchMessages/searchMessages";
function Hero() {
  return (
    <div className="flex flex-col">
      {/* logo */}
      <div className="">
        <img
          src={logoKisufim}
          alt="Kibbutz Logo"
          className="mt-10 ms-5 w-[35%] lg:w-[15%] aspect-[16/9]"
        />
      </div>
      <SearchMessages />
      {/* images */}
      <div className="">
        <img
          src={bottomImg}
          alt="kibbutz picture 1"
          className="bottom-clip sticky w-[60%] ms-[40%] -mt-20 hidden lg:block"
        />
        <img
          src={topImg}
          alt="kibbutz picture 2"
          className="top-clip sticky md:-mt-10 md:w-[80%] md:ms-[15%]  lg:w-[25%] lg:ms-[28%] lg:-mt-[20%]"
        />
      </div>
    </div>
  );
}

export default Hero;
