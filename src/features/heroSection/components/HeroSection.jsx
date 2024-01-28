import React from "react";
import SearchMessages from "@features/searchMessages/components/SearchMessages/SearchMessages";

const HeroSection = () => {
  return (
    <div className="h-[270px] sm:h-[40vh] w-full bg-hero rounded-b-3xl bg-cover bg-center flex flex-col items-center mb-10 justify-end">
      <h1 className="text-6xl font-semibold mb-2 text-white pt-8">
        הודעות הקיבוץ
      </h1>
      <SearchMessages/>
    </div>
  );
};

export default HeroSection;
