import React, { useEffect, useRef, useState } from "react";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { messageBodyParserOptions } from "@utils/linkify";
/////--///

// Message bodies are authored in a rich-text editor and stored as raw HTML, then
// rendered here. Without sanitising first, a message could carry a
// `javascript:` link (verified to survive html-react-parser + React) that runs
// on click and — since the auth token lives in localStorage — steals it. Every
// body is scrubbed through DOMPurify before any styling or parsing touches it.
const ALLOWED_TAGS = ["a", "strong", "em", "u", "b", "i", "br", "p", "ul", "ol", "li", "h1", "h2", "h3", "span"];
const sanitize = (dirty) =>
  DOMPurify.sanitize(dirty ?? "", {
    // Allow only the formatting the editor actually produces.
    ALLOWED_TAGS,
    ALLOWED_ATTR: ["href", "class"],
    // Drop javascript:/data: URLs; keep normal links.
    ALLOWED_URI_REGEXP: /^(?:https?|mailto|tel):/i,
  });

const TextPreview = ({
  txt,
  isLongTxtShown,
  toggleLongText,
  baseClasses,
  expandedClasses,
  searchTerm = "",
}) => {
  const containerRef = useRef(null);
  const [isOverflowed, setIsOverflowed] = useState(false);
  // Sanitise, then parse ONCE. Everything that used to be done to the HTML
  // string in between — wrapping <a>/<strong>/<h1..h3> in styled spans, and
  // before that injecting <mark> for the search term — now happens on the
  // parsed React nodes in messageBodyParserOptions(). Two reasons, in order:
  //
  // 1. Styling by regex over markup made this component's correctness depend on
  //    DOMPurify escaping `<` inside attribute values. Measured in a real
  //    browser with this project's DOMPurify build, it does, and no live hole
  //    existed — but nothing in this repo would have failed if that ever
  //    stopped being true. On parsed nodes a class is a React prop; no markup
  //    string is ever rebuilt, so the question does not arise.
  // 2. Linkification has to see each text run whole: a <mark> inserted mid-URL
  //    would hide the URL from the scanner.
  //
  // See src/utils/linkify.jsx for the styling map and the layer ordering.
  const processHtmlContent = () =>
    parse(sanitize(txt), messageBodyParserOptions(searchTerm));

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
    <section className="font-light mb-[15px] text-slate-700 dark:text-slate-200">
      <div
        className={isLongTxtShown ? expandedClasses : baseClasses}
        ref={containerRef}
      >
        {processHtmlContent()}
      </div>
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


