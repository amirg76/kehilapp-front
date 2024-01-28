import React from "react";
import SearchMessages from "@features/searchMessages/components/SearchMessages/SearchMessages";

const HeroSection = () => {
  return (
    <div
      className="h-[270px] sm:h-[40vh] w-full rounded-b-3xl bg-cover bg-center flex flex-col items-center mb-10 justify-end"
      style={{
        backgroundImage:
          "url(https://i.ibb.co/0mfdBtk/42243380990100408272no.jpg)",
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
