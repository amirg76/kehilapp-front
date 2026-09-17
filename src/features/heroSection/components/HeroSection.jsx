import React from "react";
import { getCategoryImage } from "@utils/categoryImage";

// Local default hero (no external URL — the old i.ibb.co link rendered blank
// when blocked). A scrim gradient sits over any background so the white title
// stays readable on both the light default image and the busy category covers.
const DEFAULT_HERO = "/img/main.jpg";

const HeroSection = ({ currentCategory }) => {
  const title = currentCategory?.title || "הודעות הקיבוץ";
  const backgroundImage = currentCategory?.title
    ? getCategoryImage(currentCategory.title)
    : DEFAULT_HERO;

  return (
    <div
      className="relative h-[220px] sm:h-[38vh] w-full rounded-b-3xl bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* readability scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10" />
      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-8 px-6">
        <h1 className="text-4xl sm:text-6xl font-bold text-white text-center drop-shadow-lg text-balance">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default HeroSection;
