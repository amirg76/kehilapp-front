import React from "react";
import { domToReact } from "html-react-parser";
import { splitTextIntoSegments } from "./urlSafety";
import { highlightText } from "./highlight";
import { stripBidiControls } from "./bidiText";

// Turn a run of PLAIN TEXT into React nodes, with http(s) URLs rendered as
// anchors and the search term still highlighted inside them.
//
// Two rules hold this together:
//
// 1. No HTML is built here. Every node is a React element and every piece of
//    user text is a React string child, which React escapes. There is no
//    dangerouslySetInnerHTML anywhere on this path, so a message body cannot
//    introduce markup by being linkified.
//
// 2. Linkification is the OUTER layer and highlighting the INNER one. The URL
//    scanner needs the text run intact; if search highlighting ran first it
//    would already have chopped "https://example.com" into
//    ["https://ex", <mark>amp</mark>, "le.com"] and no URL would be found.
//    Going the other way round composes cleanly: we split on URLs first, then
//    highlight inside each resulting segment — including inside the link label
//    — so a search term inside a URL and a URL inside highlighted text both
//    still work.

// Matches the styling TextPreview already gives to editor-authored links.
const LINK_CLASS = "underline text-blue-500 break-words";

export function renderTextWithLinks(text, searchTerm = "") {
  const segments = splitTextIntoSegments(text);
  if (segments.length === 0) return null;

  return segments.map((segment, i) => {
    if (segment.type !== "link") {
      // Plain text: identical to what the board rendered before this feature.
      return (
        <React.Fragment key={i}>
          {highlightText(segment.value, searchTerm)}
        </React.Fragment>
      );
    }

    return (
      <a
        key={i}
        href={segment.href}
        target="_blank"
        // noopener: without it the opened page gets a live window.opener handle
        // back to this tab and can navigate it somewhere else (reverse
        // tabnabbing) — e.g. to a look-alike login page — while the reader is
        // looking at the other tab. noreferrer keeps the board's URL out of the
        // destination's referrer log and covers older browsers that ignore
        // noopener. This is not stylistic noise; do not delete it.
        rel="noopener noreferrer"
        className={LINK_CLASS}
      >
        {highlightText(segment.value, searchTerm)}
      </a>
    );
  });
}

// True when this text node already sits inside an editor-authored <a>. Such
// text must not be scanned for URLs again — nesting an anchor inside an anchor
// is invalid HTML and would let the inner href disagree with the outer one.
function isInsideAnchor(domNode) {
  let node = domNode.parent;
  while (node) {
    if (node.name === "a") return true;
    node = node.parent;
  }
  return false;
}

// Editor-authored tags that get Tailwind styling, and the classes each one
// gets. These strings are the ones TextPreview used to splice in as HTML; they
// are reproduced verbatim so the board looks the same.
//
// The styling used to be applied by running five
// `.replace(/<tag(.*?)<\/tag>/g, …)` passes over the SANITISED HTML STRING and
// re-parsing the result. That was not a live hole — measured in a real browser
// with this project's DOMPurify build, `<` and `>` inside an attribute value
// come back as `&lt;`/`&gt;`, so a `</a>` smuggled into a class attribute
// cannot survive to be cut by the regex and no extra anchor is produced.
// It is replaced because the safety of that code depended on a third-party
// serializer's escaping rather than on anything in this repo, and nothing here
// would have failed if that behaviour ever changed. Styling parsed NODES needs
// no such assumption: a class is a React prop on a real element, and a string
// of markup is never rebuilt.
//
// A Map, not an object literal, so the lookup below cannot reach an inherited
// key: `({}).constructor` is truthy and would be handed to className, whereas
// `new Map().get("constructor")` is undefined. DOMPurify's ALLOWED_TAGS makes
// that unreachable today, but the point of this refactor is not to rest on it.
const STYLED_TAGS = new Map([
  ["a", "underline text-blue-500"],
  ["strong", "font-bold"],
  ["h1", "text-4xl font-semibold"],
  ["h2", "text-3xl font-semibold"],
  ["h3", "text-2xl font-semibold"],
]);

// Options for html-react-parser over an ALREADY-SANITISED message body. We
// replace text nodes with React elements and wrap styled tags in a React
// <span> — never with an HTML string — so nothing here can reintroduce markup.
export function messageBodyParserOptions(searchTerm = "") {
  // Nodes already handed to domToReact() below. Without this the wrapper would
  // match its own child on the recursive pass and recurse forever. A WeakSet is
  // per-options-object, i.e. per parse() call, so nothing leaks between renders.
  const wrapped = new WeakSet();

  const options = {
    replace(domNode) {
      if (domNode.type === "text") {
        // BIDI CONTROLS COME OFF HERE, and here only, for the whole body.
        //
        // WHY AT THE TEXT NODE. The body is author-authored HTML: sanitised by
        // DOMPurify in TextPreview, then parsed once into React nodes. Stripping
        // by running a .replace() over the sanitised HTML STRING would put this
        // module back on the pattern the repo deliberately removed — see the
        // STYLED_TAGS note below and TextPreview's header — where correctness
        // depended on a third-party serializer's attribute escaping rather than
        // on anything here. A text node's `data` carries no markup at all, so
        // there is no such question: what is removed can only be text.
        //
        // WHY THIS HOOK AND NOT A SECOND ONE. Every run of author text in a
        // body reaches the screen through this branch — plain runs on their way
        // to renderTextWithLinks(), and runs inside an editor-authored <a> on
        // their way to highlightText(). One strip above the fork covers both; a
        // second mechanism somewhere else would be one more thing to keep in
        // step with this one.
        //
        // This does NOT weaken urlSafety.js. splitTextIntoSegments() still
        // rejoins its segment values to the string it was handed verbatim; that
        // string is now simply the cleaned run. A URL that carried a bidi
        // control is still refused a link there — the control is gone by the
        // time the scanner sees the text, so what is left is judged on its own
        // merits like any other candidate, and safeHttpUrl's own bidi refusal
        // stays exactly as it was for every other caller.
        const raw = domNode.data;
        if (!raw) return undefined;

        const value = stripBidiControls(raw);
        // A run that was NOTHING BUT bidi controls must return an element, not
        // undefined. `undefined` means "I decline to replace this node", and
        // html-react-parser then renders the ORIGINAL text node — i.e. the
        // controls would survive precisely in the case this code exists for.
        // An empty fragment renders nothing and removes them.
        if (!value) return <></>;

        if (isInsideAnchor(domNode)) {
          // Already a link: highlight only, never linkify again.
          return <>{highlightText(value, searchTerm)}</>;
        }
        // Plain run: linkify (outer) with highlighting composed inside it.
        return <>{renderTextWithLinks(value, searchTerm)}</>;
      }

      const className = STYLED_TAGS.get(domNode.name);
      if (!className || wrapped.has(domNode)) return undefined;

      // WRAP rather than add the class to the element itself. The old string
      // chain wrapped (`<span class="…"><a …>…</a></span>`), and wrapping is
      // what reproduces it exactly: the element keeps any class the editor gave
      // it instead of having it merged or overwritten, and an <h1> stays a block
      // box inside the same inline span it sat in before. Putting the class on
      // the element would change both of those, which is a visual change, not a
      // refactor.
      wrapped.add(domNode);
      return (
        <span className={className}>{domToReact([domNode], options)}</span>
      );
    },
  };

  return options;
}
