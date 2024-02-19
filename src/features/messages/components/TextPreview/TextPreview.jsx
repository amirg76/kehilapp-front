import React, { useEffect, useRef, useState } from "react";
///-/////
const TextPreview = ({
  txt,
  isLongTxtShown,
  toggleLongText,
  baseClasses,
  expandedClasses,
}) => {
  const containerRef = useRef(null);
  const [isOverflowed, setIsOverflowed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    if (container.scrollHeight > container.clientHeight) {
      setIsOverflowed(true);
    } else {
      setIsOverflowed(false);
    }
  }, [txt]);

  return (
    <section className="font-light mb-[15px]">
      <p
        className={isLongTxtShown ? expandedClasses : baseClasses}
        ref={containerRef}
      >
        {txt}{" "}
      </p>
      {isOverflowed && (
        <span
          className="text-[#4870AD] cursor-pointer"
          onClick={() => toggleLongText(!isLongTxtShown)}
        >
          {isLongTxtShown ? "קרא פחות" : "קרא עוד"}
        </span>
      )}
    </section>
  );
};

export default TextPreview;

// const TextPreview = ({ txt, isLongTxtShown, toggleLongText, classes }) => {

//     if (txt.length < 90) return <section className={classes}>{txt}</section>
//     return (
//         <section className={classes}>
//             {isLongTxtShown ?
//                 <React.Fragment>
//                     {txt}
//                     <span className='text-[#4870AD]' onClick={() => toggleLongText(false)}> קרא פחות</span>
//                 </React.Fragment> :
//                 <React.Fragment>
//                     {txt.substr(0, 110)}
//                     <span className='text-[#4870AD]' onClick={() => toggleLongText(true)}> קרא עוד...</span>
//                 </React.Fragment>}
//         </section>
//     )
// }

// export default TextPreview
