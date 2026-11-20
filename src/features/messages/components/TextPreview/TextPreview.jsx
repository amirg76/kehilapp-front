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
// "s" and "blockquote" came with the Tiptap editor (strikethrough and quote
// buttons, 20.11.2026).
const ALLOWED_TAGS = ["a", "strong", "em", "u", "s", "b", "i", "br", "p", "ul", "ol", "li", "h1", "h2", "h3", "blockquote", "span"];
const sanitize = (dirty) =>
  DOMPurify.sanitize(dirty ?? "", {
    // Allow only the formatting the editor actually produces.
    ALLOWED_TAGS,
    // No `class`. A body is whatever reaches the API, not only what the editor
    // writes, and this app ships Tailwind: `<p class="fixed inset-0 z-50 ...">`
    // would let one message cover the whole screen with a fake page. The
    // editor writes no classes. Old Quill bodies carry `ql-*` ones, but every
    // ql-* content rule in Quill's stylesheet sat under `.ql-editor`
    // (react-quill 2.0.0 quill.snow.css, checked 20.11.2026) and this display
    // was never inside one, so dropping them changes nothing a reader sees.
    ALLOWED_ATTR: ["href"],
    // DOMPurify keeps data-* and aria-* even with ALLOWED_ATTR. A body could
    // then give a screen reader a different text from the one on screen
    // (aria-label, aria-hidden), announce itself (aria-live), or pose as an
    // app element (data-testid). The editor writes neither.
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
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
        className={`message-body ${isLongTxtShown ? expandedClasses : baseClasses}`}
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


