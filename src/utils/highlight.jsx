// Shared visual style for a matched search term. Kept in one place so every
// caller of highlightText() — message titles and message bodies alike — looks
// identical. This literal class string is picked up by Tailwind's content
// scanner (src/**/*.{js,jsx}).
export const MARK_CLASS =
  "kh-mark rounded-[3px] px-[1px] bg-yellow-200 text-inherit dark:bg-yellow-500/40 dark:text-yellow-50";

// Escape a user-typed term so it can't smuggle regex metacharacters (e.g. a
// lone "(" or ".*") into the RegExp we build from it.
export function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Highlight a PLAIN-TEXT string (e.g. a message title) by returning an array of
// React nodes with matches wrapped in <mark>. No HTML is ever injected here —
// React escapes every string child — so this path cannot introduce XSS.
export function highlightText(text, term) {
  const str = text == null ? "" : String(text);
  const t = (term || "").trim();
  if (!t) return str;

  const re = new RegExp(`(${escapeRegExp(t)})`, "gi");
  const parts = str.split(re);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className={MARK_CLASS}>
        {part}
      </mark>
    ) : (
      part
    )
  );
}

// There is deliberately no HTML-string highlighter here. Highlighting a message
// body happens on parsed React nodes (src/utils/linkify.jsx); a version that
// spliced <mark> into markup with a regex existed, lost its last caller when
// that move happened, and was removed rather than left as a tempting shortcut
// back to rewriting HTML by string surgery.
