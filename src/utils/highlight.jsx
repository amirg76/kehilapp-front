// Shared visual style for a matched search term. Kept in one place so the
// plain-text (React node) path and the rich-text (HTML string) path look
// identical. These literal class strings are picked up by Tailwind's content
// scanner (src/**/*.{js,jsx}), so they are safe to inject as an HTML attribute.
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

// Highlight an ALREADY-SANITIZED HTML string by inserting <mark> only inside
// text segments (never inside a tag). The term is regex-escaped and the matched
// text comes verbatim from the sanitized input, so no new markup is introduced
// beyond the fixed <mark class="…"> wrapper. Callers must still run the result
// back through DOMPurify (with `mark` allowed) as a belt-and-braces final pass.
export function highlightHtml(html, term) {
  const source = html == null ? "" : String(html);
  const t = (term || "").trim();
  if (!t) return source;

  const re = new RegExp(escapeRegExp(t), "gi");
  // Split into tag tokens (<…>) and text tokens; only text tokens are touched.
  return source
    .split(/(<[^>]+>)/g)
    .map((token) =>
      token.startsWith("<")
        ? token
        : token.replace(re, (m) => `<mark class="${MARK_CLASS}">${m}</mark>`)
    )
    .join("");
}
