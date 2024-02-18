import React, { useEffect, useRef, useState } from "react";
import parse from "html-react-parser";

const TextPreview = ({
  txt,
  isLongTxtShown,
  toggleLongText,
  baseClasses,
  expandedClasses,
}) => {
  const containerRef = useRef(null);
  const [isOverflowed, setIsOverflowed] = useState(false);
  // Function to process HTML content and apply styles to anchor tags
  const processHtmlContent = () => {
    const replacedHtml = txt
      .replace(/<a(.*?)<\/a>/g, (match) => {
        // Replace anchor tags with span tags having Tailwind CSS styles
        return `<span class="underline text-blue-500">${match}</span>`;
      })
      .replace(/<strong(.*?)<\/strong>/g, (match) => {
        // Replace strong tags with span tags having bold styling
        return `<span class="font-bold">${match}</span>`;
      })
      .replace(/<h1(.*?)<\/h1>/g, (match) => {
        // Replace h1 tags with span tags having custom styling
        return `<span class="text-4xl font-semibold">${match}</span>`;
      })
      .replace(/<h2(.*?)<\/h2>/g, (match) => {
        // Replace h2 tags with span tags having custom styling
        return `<span class="text-3xl font-semibold">${match}</span>`;
      })
      .replace(/<h3(.*?)<\/h3>/g, (match) => {
        // Replace h3 tags with span tags having custom styling
        return `<span class="text-2xl font-semibold">${match}</span>`;
      });

    return parse(replacedHtml);
  };

  useEffect(() => {
    const container = containerRef.current;

    if (container.scrollHeight > container.clientHeight) {
      setIsOverflowed(true);
    } else {
      setIsOverflowed(false);
    }
  }, [txt]);
  //
  return (
    <section className="font-light mb-[15px]">
      <div
        className={isLongTxtShown ? expandedClasses : baseClasses}
        ref={containerRef}
      >
        {processHtmlContent()}
      </div>
      {/* {console.log(txt)} */}
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
