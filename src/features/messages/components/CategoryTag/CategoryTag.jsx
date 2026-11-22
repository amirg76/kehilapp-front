import React from "react";
import CategoryIcon from "@components/ui/CategoryIcon/CategoryIcon";

// The API stores a category's colour as a hex code ("#2563EB", seedDemo.js and
// the live data, checked 22.11.2026), but this tag only knew the theme's colour
// NAMES below. A hex matched none, the bubble drew with no fill, and the title
// sat on the bare card: dark-on-light by luck in light mode, invisible in dark.
const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
// For a category with no usable colour, so the title is never on bare card.
const FALLBACK_FILL = "#64748b";
const DARK_TEXT = "#111827";

const luminanceOf = (hex) => {
  const h = hex.length === 4 ? hex.replace(/[0-9a-f]/gi, (c) => c + c) : hex;
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

// White or near-black, whichever reads better on this fill. Several of the
// seeded colours (amber, teal, cyan) give white text under 4.5:1.
const textOn = (hex) => {
  const l = luminanceOf(hex);
  const onWhite = 1.05 / (l + 0.05);
  const onDark = (l + 0.05) / (luminanceOf(DARK_TEXT) + 0.05);
  return onWhite >= onDark ? "#ffffff" : DARK_TEXT;
};

const CategoryTag = ({ category }) => {
  const { color, title, isInSkeleton = false } = category;

  const fillColors = {
    categoryBlue: "fill-categoryBlue",
    categoryGreen: "fill-categoryGreen",
    categoryTurquoise: "fill-categoryTurquoise",
    categoryOrange: "fill-categoryOrange",
    categoryPurple: "fill-categoryPurple",
    categoryYellow: "fill-categoryYellow",
    categoryDarkGreen: "fill-categoryDarkGreen",
    categoryPink: "fill-categoryPink",
    categoryYellow1: "fill-categoryYellow1",
    skeleton: "fill-[#94a3b8]",
  };
  // Own keys only: fillColors["constructor"] is a function, not a class.
  // (hasOwnProperty.call, as in utils/urgency.js: Object.hasOwn needs Safari 15.4+.)
  const namedFill = Object.prototype.hasOwnProperty.call(fillColors, color) ? fillColors[color] : undefined;
  // A named theme colour keeps its class and its text colours as they were
  // (white icon, inherited title). Anything else is drawn from the hex.
  const hexFill = namedFill ? null : HEX.test(color || "") ? color : FALLBACK_FILL;
  const textColor = hexFill ? textOn(hexFill) : undefined;

  return (
    // On a phone the card is 16px from the screen edge, so -17px put the
    // bubble 8px past it and the whole page scrolled sideways (measured at
    // 390px, 22.11.2026). It hangs off the card corner from sm: up, as before.
    <div className="h-[50px] relative left-[-8px] sm:left-[-17px] bottom-[15px]">
      <div className="flex items-center justify-center relative top-[38px] text-center">
        {!isInSkeleton ? (
          <>
            <CategoryIcon categoryTitle={title} color={textColor || "white"} />
            <h6 className="font-semibold text-[13px] mr-1" style={textColor ? { color: textColor } : undefined}>{title}</h6>
          </>
        ) : (
          <div className="my-2"></div>
        )}
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="106"
        height="69"
        viewBox="0 0 106 69"
        fill="none"
      >
        <path
          className={namedFill}
          style={hexFill ? { fill: hexFill } : undefined}
          d="M54.9591 47.641C25.3107 39.6967 -4.54148 54.9671 1.80278 31.29C8.14704 7.61291 37.3249 -5.14106 66.9734 2.80322C96.6218 10.7475 110.376 35.0052 104.032 58.6823C97.688 82.3594 84.6076 55.5852 54.9591 47.641Z"
          // fill={color}
        />
      </svg>
    </div>
  );
};

export default CategoryTag;
