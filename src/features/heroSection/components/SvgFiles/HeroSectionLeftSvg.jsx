import React from "react";

const HeroSectionLeftSvg = ({ imgfile }) => {
  // width="926"
  // height="489"
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 926 489"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g filter="url(#filter0_d_397_1762)">
        <path
          d="M911.5 165.188C911.5 343.41 643.734 470.338 394.279 470.338C48.823 456.754 -117.571 339.599 -102.992 85.8786C-75.1232 -88.2702 180.445 98.2424 429.9 98.2424C679.355 98.2424 911.5 -13.0342 911.5 165.188Z"
          fill="url(#pattern0)"
          shapeRendering="crispEdges"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_397_1762"
          x="-118.305"
          y="0.523131"
          width="1044.24"
          height="487.642"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood
            floodOpacity="0"
            result="BackgroundImageFix"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="3.39579" />
          <feGaussianBlur stdDeviation="7.21605" />
          <feComposite
            in2="hardAlpha"
            operator="out"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_397_1762"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_397_1762"
            result="shape"
          />
        </filter>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_397_1762"
            transform="matrix(0.00130095 0 0 0.00287929 0.0209338 -0.38198)"
          />
        </pattern>
        <image
          id="image0_397_1762"
          width="768"
          height="512"
          xlinkHref="../../img/image1.png"
        />
      </defs>
    </svg>
  );
};

export default HeroSectionLeftSvg;
