import React from "react";
import SearchMessages from "@features/searchMessages/components/SearchMessages/SearchMessages";

const HeroSection = () => {
  // TODO: get custom kibbutz image url
  let KibbutzCustomImage = "https://i.ibb.co/4V5rWFr/image2.png";

  return (
    <div
      className="h-[270px] sm:h-[40vh] w-full rounded-b-3xl bg-cover bg-center flex flex-col items-center mb-10 justify-end"
      style={{
        backgroundImage: `url(${KibbutzCustomImage})`,
      }}
    >
      <h1 className="text-6xl font-semibold mb-2 text-white pt-8">
        הודעות הקיבוץ
      </h1>
      <SearchMessages />
    </div>
  );
};

export default HeroSection;
