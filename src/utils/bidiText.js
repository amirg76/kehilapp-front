// Remove Unicode bidirectional formatting controls from author-supplied text
// before it is rendered on the resident board.
//
// This module is deliberately free of React and of JSX so it can be exercised
// directly by a plain `node` script (see scripts/bidi-text-check.mjs), the same
// arrangement urlSafety.js uses.
//
// WHAT THIS PREVENTS. Bidi controls are invisible: they change the DIRECTION
// the characters after them are laid out in, not the characters themselves. An
// approved member posts a title containing U+202E (RIGHT-TO-LEFT OVERRIDE) and
// every resident reading the board sees a title that renders differently from
// the one that is stored. This board is Hebrew and renders RTL, which removes
// the usual tell: in a left-to-right page a reversed run looks obviously wrong,
// but here a right-to-left run is the normal case, so there is nothing for the
// eye to catch. An unterminated override (an RLO/LRO with no PDF) also leaks
// past the end of the message and flips the direction of whatever the page
// draws after it. The admin panel already does this for its grid
// (kehilapp-admin-hardened/src/pages/messages/plainText.ts); the board is the
// surface with far more readers.
//
// THE CODE POINTS ARE NOT RE-DECLARED HERE. They are imported from
// urlSafety.js, which already exports the complete Bidi_Control set and whose
// header records the measurement behind it (enumerating \p{Bidi_Control} over
// the whole code space on node v24.13.0 yields exactly those twelve, U+061C
// included). A hand-written second copy in this file is exactly how U+061C went
// missing the first time, and scripts/url-safety-check.mjs already fails if that
// one list drifts from Unicode's own set — so there is one list, checked in one
// place, used by both policies.
//
// STRIP HERE, REJECT THERE. urlSafety.js REFUSES a URL candidate containing
// these characters instead of cleaning it, because splitTextIntoSegments() must
// guarantee that the segment values rejoin to the author's input verbatim: a
// stripped link label would put text on screen the author never typed, and the
// label is what the reader compares against the href. This module has the
// opposite job. A card is already a lossy summary, nothing downstream
// reconstructs the original from what it shows, and a reader needs the message
// to stay identifiable rather than to vanish. Both calls are right where they
// are made; do NOT "unify" them into one policy.
//
// WHY new RegExp AND NOT /\p{Bidi_Control}/u. urlSafety.js explains at length
// why it spells its class out rather than using a Unicode property escape: a
// lookbehind in that file survived into the built bundle and would have thrown
// at module load on Safari before 16.4 — a blank application, and this board's
// readers are an evacuated community whose phones skew old. The class built
// below needs no engine feature either; it is an ordinary character class made
// of \uXXXX escapes. Building it from the imported array rather than typing it
// out is what makes drift impossible.
import { BIDI_CONTROL_CODE_POINTS } from "./urlSafety.js";

/**
 * The shared list as a character class, e.g. "[؜‎…]". Built once at
 * module load from the imported code points.
 */
const BIDI_CONTROL_CLASS = `[${BIDI_CONTROL_CODE_POINTS.map(
  (cp) => `\\u${cp.toString(16).padStart(4, "0")}`
).join("")}]`;

// Not a module-level literal with the `g` flag shared between calls: a global
// regex carries `lastIndex`, and String.prototype.replace resets it but
// .test() does not. A fresh instance per call removes the question entirely,
// and these strings are card-sized.
const bidiControlRe = () => new RegExp(BIDI_CONTROL_CLASS, "g");

/**
 * Remove every bidi control from `value`. Everything else — Hebrew, Latin,
 * digits, punctuation, emoji, ordinary whitespace — is left exactly as typed.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function stripBidiControls(value) {
  if (value == null) return "";
  return String(value).replace(bidiControlRe(), "");
}

/**
 * True when `value` contains at least one bidi control. Used by the check
 * script and by nothing in the render path, which strips unconditionally.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function hasBidiControls(value) {
  if (value == null) return false;
  return bidiControlRe().test(String(value));
}

/**
 * Single-line label text: bidi controls removed, THEN whitespace collapsed.
 *
 * Order matters and is not cosmetic. Collapsing first would leave a control
 * character sitting between two runs of whitespace as the only thing separating
 * them; the collapse would merge the whitespace around it and the control would
 * survive into the label. Strip, then collapse. (The admin panel's gridCellText
 * documents the same ordering for the same reason.)
 *
 * @param {unknown} value
 * @returns {string}
 */
export function labelText(value) {
  return stripBidiControls(value).replace(/\s+/g, " ").trim();
}
