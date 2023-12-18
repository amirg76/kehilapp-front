import React from "react";
import image1 from '../../img/image1.png'
import image2 from '../../img/image2.png'

const HeroSectionRightSvg = ({ imgfile }) => {
  // width="486"
  // height="297"
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 486 297"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g filter="url(#filter0_d_397_1763)">
        <path
          d="M471.833 173.5C471.833 267.915 313.273 279.986 198.586 279.986C83.8986 279.986 14.0332 169.096 14.0332 74.6806C14.0332 -19.7343 117.497 17.6402 232.184 17.6402C346.871 17.6402 471.833 79.0847 471.833 173.5Z"
          fill="url(#pattern0)"
          shapeRendering="crispEdges"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_397_1763"
          x="0.693978"
          y="0.14219"
          width="484.479"
          height="296.322"
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
          <feOffset dy="3.13864" />
          <feGaussianBlur stdDeviation="6.66961" />
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
            result="effect1_dropShadow_397_1763"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_397_1763"
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
            xlinkHref="#image0_397_1763"
            transform="matrix(0.00135459 0 0 0.00240322 -0.0347893 -0.219413)"
          />
        </pattern>
        <image
          id="image0_397_1763"
          width="768"
          height="512"
          // xlinkHref={`img/${imgfile}`}
          xlinkHref={image2}
        />
      </defs>
    </svg>
  );
};

export default HeroSectionRightSvg;
