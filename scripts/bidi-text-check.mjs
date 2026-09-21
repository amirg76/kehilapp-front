// Standalone safety check for src/utils/bidiText.js.
// There is no unit-test runner in this repo, so this is a plain node script:
//   node scripts/bidi-text-check.mjs
// It exits non-zero on any failure. Output is English on purpose: raw terminal
// output mangles Hebrew.
//
// EVERY hostile character below is written with String.fromCodePoint and never
// pasted in as a literal. Two reasons. They are invisible, so a pasted one is
// unreviewable — you cannot see it in a diff and you cannot count them. And an
// earlier agent on this project pasted 22 real invisible characters into source
// files; eslint's no-irregular-whitespace catches only some of those, so the
// mistake is cheap to make and expensive to find. Building them here also means
// the test names can spell out which code point each case is about.

import {
  hasBidiControls,
  labelText,
  stripBidiControls,
} from "../src/utils/bidiText.js";
import { BIDI_CONTROL_CODE_POINTS } from "../src/utils/urlSafety.js";

let passed = 0;
let failed = 0;

function check(name, actual, expected) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    passed += 1;
    console.log(`PASS  ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL  ${name}`);
    console.log(`        expected: ${e}`);
    console.log(`        actual:   ${a}`);
  }
}

const cp = (...points) => String.fromCodePoint(...points);
const hex = (n) => `U+${n.toString(16).toUpperCase().padStart(4, "0")}`;

// ---------------------------------------------------------------------------
console.log("--- the list is SHARED with urlSafety.js, not copied ---");

// bidiText.js imports BIDI_CONTROL_CODE_POINTS instead of declaring its own.
// These two assertions are what would fail if somebody "inlined" the list back
// into bidiText.js and then let one of the two drift — which is exactly how
// U+061C went missing the first time.
check(
  "urlSafety exports 12 code points",
  BIDI_CONTROL_CODE_POINTS.length,
  12
);

// Independent of both lists: ask node's own Unicode tables. If Unicode ever
// grows a thirteenth Bidi_Control character, this fails and the shared list has
// to be updated once, in urlSafety.js, and both policies follow.
const fromUnicode = [];
for (let c = 0; c <= 0x10ffff; c += 1) {
  if (/\p{Bidi_Control}/u.test(String.fromCodePoint(c))) fromUnicode.push(c);
}
check(
  "shared list === node's own \\p{Bidi_Control} set",
  [...BIDI_CONTROL_CODE_POINTS].sort((a, b) => a - b),
  fromUnicode
);

// ---------------------------------------------------------------------------
console.log("\n--- each of the twelve code points is stripped ---");

for (const point of fromUnicode) {
  // A realistic title: Hebrew, then the control, then Hebrew.
  check(
    `${hex(point)} removed from a title`,
    stripBidiControls(`הודעה${cp(point)}חשובה`),
    "הודעהחשובה"
  );
  check(`${hex(point)} detected by hasBidiControls`, hasBidiControls(cp(point)), true);
}

// The specific attack from the brief, spelled out end to end.
const RLO = 0x202e;
check(
  `${hex(RLO)} in a filename-style title`,
  stripBidiControls(`invoice${cp(RLO)}gnp.exe`),
  "invoicegnp.exe"
);
check(
  "several controls in one string, all removed",
  stripBidiControls(`${cp(0x2066)}a${cp(0x202e)}b${cp(0x061c)}c${cp(0x2069)}`),
  "abc"
);

// ---------------------------------------------------------------------------
console.log("\n--- a title that is ONLY a bidi character ---");

check("lone RLO strips to empty string", stripBidiControls(cp(RLO)), "");
check("lone ALM (U+061C) strips to empty string", stripBidiControls(cp(0x061c)), "");
check(
  "a title of nothing but controls strips to empty string",
  stripBidiControls(fromUnicode.map((p) => cp(p)).join("")),
  ""
);
check("…and labelText agrees", labelText(cp(RLO)), "");

// ---------------------------------------------------------------------------
console.log("\n--- ORDER: strip before collapsing whitespace ---");

// This is the case that fails if labelText collapses first. "a  <RLO>  b" has
// the control sitting between two runs of whitespace; collapse-then-strip would
// merge each run to a single space, leaving "a <RLO> b", and the strip would
// then leave "a  b" — or, done in the wrong order entirely, leave the control
// in the label. Strip-then-collapse gives "a b" and nothing invisible.
check(
  "control between two runs of whitespace does not survive",
  labelText(`a  ${cp(RLO)}  b`),
  "a b"
);
check(
  "…and the result contains no control at all",
  hasBidiControls(labelText(`a  ${cp(RLO)}  b`)),
  false
);
check(
  "control surrounded by tabs/newlines",
  labelText(`a\t\n${cp(0x202b)}\n\tb`),
  "a b"
);
check(
  "leading and trailing controls plus whitespace are trimmed away",
  labelText(`  ${cp(0x200f)} שלום ${cp(0x200e)}  `),
  "שלום"
);

// stripBidiControls must NOT collapse whitespace — the <h1> keeps the author's
// spacing, and only labelText is allowed to touch it.
check(
  "stripBidiControls leaves whitespace exactly as typed",
  stripBidiControls(`a  ${cp(RLO)}  b`),
  "a    b"
);

// ---------------------------------------------------------------------------
console.log("\n--- ordinary text passes through untouched ---");

const untouched = [
  "שלום לכולם, יש הודעה חדשה בלוח",
  "Ordinary English announcement text",
  "מפגש Zoom ביום שלישי at 19:00 בחדר האוכל",
  "מחיר: 1,250.50 ש\"ח (כולל מע\"מ) — 15%!",
  "דוא\"ל: board@example.com; טל' 08-1234567",
  "אמוג'י נשאר: 📌 ✅ 🎉",
  "line one\nline two\ttabbed",
  "גרש ׳ וגרשיים ״ עברים",
];
for (const text of untouched) {
  check(`unchanged ${JSON.stringify(text)}`, stripBidiControls(text), text);
  check(`no controls reported in ${JSON.stringify(text)}`, hasBidiControls(text), false);
}

// Near misses: characters that are invisible or exotic but are NOT Bidi_Control
// and must therefore survive. Removing these would be the module quietly
// growing a second, unmeasured policy.
check(
  "zero-width space (U+200B) is not stripped",
  stripBidiControls(`a${cp(0x200b)}b`),
  `a${cp(0x200b)}b`
);
check(
  "zero-width joiner (U+200D) is not stripped",
  stripBidiControls(`a${cp(0x200d)}b`),
  `a${cp(0x200d)}b`
);
check(
  "Hebrew niqqud (U+05B0) is not stripped",
  stripBidiControls(`שָ${cp(0x05b0)}לום`),
  `שָ${cp(0x05b0)}לום`
);
check(
  "U+2065 and U+206A, the code points adjacent to the isolate block, survive",
  stripBidiControls(`${cp(0x2065)}x${cp(0x206a)}`),
  `${cp(0x2065)}x${cp(0x206a)}`
);

// ---------------------------------------------------------------------------
console.log("\n--- empty and missing input ---");

check("undefined -> empty string", stripBidiControls(undefined), "");
check("null -> empty string", stripBidiControls(null), "");
check("empty string -> empty string", stripBidiControls(""), "");
check("undefined via labelText -> empty string", labelText(undefined), "");
check("null via labelText -> empty string", labelText(null), "");
check("hasBidiControls(undefined) is false", hasBidiControls(undefined), false);
check("hasBidiControls(null) is false", hasBidiControls(null), false);
// A non-string is coerced, not thrown on: the API sends whatever it sends.
check("a number is coerced, not thrown on", stripBidiControls(42), "42");

// ---------------------------------------------------------------------------
console.log("\n--- repeated calls are not stateful ---");

// A module-level /g regex would carry lastIndex and make the SECOND identical
// call disagree with the first. bidiText.js builds a fresh instance per call;
// this is what holds it to that.
const sample = `x${cp(RLO)}y`;
check("first hasBidiControls call", hasBidiControls(sample), true);
check("second hasBidiControls call agrees", hasBidiControls(sample), true);
check("third hasBidiControls call agrees", hasBidiControls(sample), true);
check("strip is idempotent", stripBidiControls(stripBidiControls(sample)), "xy");

console.log("");
console.log(`TOTAL: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
