import React, { useEffect, useRef, useState } from "react";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { highlightHtml } from "@utils/highlight";
/////--///

// Message bodies are authored in a rich-text editor and stored as raw HTML, then
// rendered here. Without sanitising first, a message could carry a
// `javascript:` link (verified to survive html-react-parser + React) that runs
// on click and — since the auth token lives in localStorage — steals it. Every
// body is scrubbed through DOMPurify before any styling or parsing touches it.
const ALLOWED_TAGS = ["a", "strong", "em", "u", "b", "i", "br", "p", "ul", "ol", "li", "h1", "h2", "h3", "span"];
const sanitize = (dirty, extraTags = []) =>
  DOMPurify.sanitize(dirty ?? "", {
    // Allow only the formatting the editor actually produces.
    ALLOWED_TAGS: [...ALLOWED_TAGS, ...extraTags],
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
  // Function to process HTML content and apply styles to anchor tags
  const processHtmlContent = () => {
    const replacedHtml = sanitize(txt)
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

    // Wrap the searched term in <mark> inside text nodes only (the input is
    // already sanitized and the term is regex-escaped), then run one more
    // DOMPurify pass — now permitting <mark> — so nothing can slip through.
    const highlighted = searchTerm
      ? sanitize(highlightHtml(replacedHtml, searchTerm), ["mark"])
      : replacedHtml;

    return parse(highlighted);
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


