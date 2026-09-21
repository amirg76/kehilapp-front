// Standalone render check for src/utils/linkify.jsx.
//   node scripts/render-check.mjs
// Bundles the REAL source with esbuild (already present as a vite dependency),
// runs it through html-react-parser exactly as TextPreview does, and renders the
// result with react-dom/server so we can assert on the actual HTML React emits.
// This is what proves rel="noopener noreferrer" really lands on every anchor and
// that a rejected scheme really stays inert text.

import { build } from "esbuild";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const entry = `
  import parse from "html-react-parser";
  import { renderToStaticMarkup } from "react-dom/server";
  import { messageBodyParserOptions } from "./src/utils/linkify.jsx";
  export function render(html, term) {
    return renderToStaticMarkup(parse(html, messageBodyParserOptions(term)));
  }
`;

const result = await build({
  stdin: { contents: entry, resolveDir: process.cwd(), loader: "js" },
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
  jsx: "automatic",
  logLevel: "silent",
});

const module_ = { exports: {} };
// eslint-disable-next-line no-new-func
new Function("require", "module", "exports", result.outputFiles[0].text)(
  require,
  module_,
  module_.exports
);
const { render } = module_.exports;

let passed = 0;
let failed = 0;

function expect(name, actual, predicate, describe) {
  if (predicate(actual)) {
    passed += 1;
    console.log(`PASS  ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL  ${name}  (${describe})`);
    console.log(`        got: ${actual}`);
  }
}

const has = (needle) => (out) => out.includes(needle);
const lacks = (needle) => (out) => !out.includes(needle);

let out;

out = render("<p>go to https://example.com now</p>", "");
console.log(`\n[1] ${out}`);
expect("anchor created for https", out, has('href="https://example.com/"'), "href missing");
expect("target=_blank present", out, has('target="_blank"'), "target missing");
expect("rel=noopener noreferrer present", out, has('rel="noopener noreferrer"'), "rel missing");

out = render("<p>click javascript:alert(1) here</p>", "");
console.log(`\n[2] ${out}`);
expect("javascript: produces no anchor", out, lacks("<a "), "an anchor was created");
expect("javascript: text preserved verbatim", out, has("javascript:alert(1)"), "text changed");

out = render("<p>data:text/html,&lt;script&gt; and //evil.com</p>", "");
console.log(`\n[3] ${out}`);
expect("data:/protocol-relative produce no anchor", out, lacks("<a "), "an anchor was created");

// Composition: a search term that falls INSIDE the URL.
out = render("<p>see https://example.com/report</p>", "example");
console.log(`\n[4] ${out}`);
expect("search term inside a URL is highlighted", out, has("<mark"), "no mark rendered");
expect("…and it is inside the anchor", out, (o) => o.indexOf("<a ") < o.indexOf("<mark"), "mark is outside the anchor");
expect("…and the anchor href is intact", out, has('href="https://example.com/report"'), "href broken by highlighting");

// Composition: a URL inside text that also contains the term elsewhere.
out = render("<p>update: https://example.com/update is live</p>", "update");
console.log(`\n[5] ${out}`);
expect("term outside the URL is highlighted too", out, (o) => (o.match(/<mark/g) || []).length >= 2, "expected 2+ marks");

// Editor-authored anchors are highlighted but never re-linkified.
out = render('<p><a href="https://example.com/a">https://example.com/a</a></p>', "example");
console.log(`\n[6] ${out}`);
expect("no nested anchor inside an existing link", out, (o) => (o.match(/<a /g) || []).length === 1, "anchor was nested");
expect("existing link still highlighted", out, has("<mark"), "no mark rendered");

// Plain text with no URL must be untouched.
out = render("<p>אין כאן קישור</p>", "");
console.log(`\n[7] ${out}`);
expect("plain text unchanged", out, (o) => o === "<p>אין כאן קישור</p>", "markup changed");

// Two URLs, trailing period.
out = render("<p>http://a.example.com and https://b.example.com/x.</p>", "");
console.log(`\n[8] ${out}`);
expect("two anchors rendered", out, (o) => (o.match(/<a /g) || []).length === 2, "expected 2 anchors");
expect("both carry rel", out, (o) => (o.match(/rel="noopener noreferrer"/g) || []).length === 2, "rel missing on one");
expect("trailing period left outside the link", out, has("</a>."), "period swallowed");

// --- editor styling, now applied on parsed nodes instead of by string rewrite.
// These assertions are the whole reason the old .replace() chain in
// TextPreview.jsx could be deleted: they pin the rendered shape it produced.

out = render('<p><a href="https://example.com">link</a></p>', "");
console.log(`\n[9] ${out}`);
expect("anchor wrapped in styled span", out, has('<span class="underline text-blue-500">'), "wrapper span missing");
expect("…with the anchor still inside it", out, has('<span class="underline text-blue-500"><a '), "anchor not inside the wrapper");
expect("…and the href untouched", out, has('href="https://example.com"'), "href changed");

out = render("<p><strong>bold</strong></p>", "");
console.log(`\n[10] ${out}`);
expect("strong wrapped in font-bold span", out, has('<span class="font-bold"><strong>bold</strong></span>'), "strong styling missing");

out = render("<h1>one</h1><h2>two</h2><h3>three</h3>", "");
console.log(`\n[11] ${out}`);
expect("h1 styled", out, has('<span class="text-4xl font-semibold"><h1>one</h1></span>'), "h1 styling missing");
expect("h2 styled", out, has('<span class="text-3xl font-semibold"><h2>two</h2></span>'), "h2 styling missing");
expect("h3 styled", out, has('<span class="text-2xl font-semibold"><h3>three</h3></span>'), "h3 styling missing");

// The wrapper must not swallow the element's own class (the old chain kept it,
// because it wrapped the matched markup verbatim).
out = render('<p><strong class="ql-size-large">x</strong></p>', "");
console.log(`\n[12] ${out}`);
expect("editor's own class preserved under the wrapper", out, has('<strong class="ql-size-large">'), "author class lost");

// Styling must compose with the text layers, not replace them: an editor anchor
// still gets highlighted and still is not re-linkified, and a bare URL inside a
// styled heading still becomes one anchor.
out = render('<p><a href="https://example.com/a">https://example.com/a</a></p>', "example");
console.log(`\n[13] ${out}`);
expect("styled anchor still highlighted", out, has("<mark"), "no mark rendered");
expect("styled anchor not nested", out, (o) => (o.match(/<a /g) || []).length === 1, "anchor was nested");

out = render("<h2>see https://example.com now</h2>", "");
console.log(`\n[14] ${out}`);
expect("URL inside a styled heading is linkified once", out, (o) => (o.match(/<a /g) || []).length === 1, "expected exactly 1 anchor");
expect("…and that anchor carries rel", out, has('rel="noopener noreferrer"'), "rel missing");
expect("…and the heading styling is still there", out, has('<span class="text-3xl font-semibold">'), "h2 styling missing");

// Unstyled allowed tags must pass through untouched — no stray wrappers.
out = render("<p><em>x</em><u>y</u></p>", "");
console.log(`\n[15] ${out}`);
expect("unstyled tags get no wrapper", out, (o) => o === "<p><em>x</em><u>y</u></p>", "markup changed");

// Nesting: a styled tag inside another styled tag must be wrapped exactly once
// each. This is what would loop forever if the recursion guard were dropped.
out = render('<h3><strong>t</strong></h3>', "");
console.log(`\n[16] ${out}`);
expect("nested styled tags wrapped once each", out, (o) => (o.match(/<span /g) || []).length === 2, "expected exactly 2 wrapper spans");
expect("…in the right order", out, has('<span class="text-2xl font-semibold"><h3><span class="font-bold"><strong>t</strong></span></h3></span>'), "nesting shape changed");

// --- bidi controls are stripped at the TEXT-NODE hook (src/utils/bidiText.js).
// Written with String.fromCodePoint, never pasted: these characters are
// invisible, so a literal one in this file would be unreviewable — and an
// earlier agent on this project pasted 22 real invisible characters into source
// by doing exactly that.
const cpt = (...points) => String.fromCodePoint(...points);
const RLO = 0x202e; // RIGHT-TO-LEFT OVERRIDE
const ALM = 0x061c; // ARABIC LETTER MARK — the one an earlier list missed
const BIDI_RE = /\p{Bidi_Control}/u;
const noBidi = (o) => !BIDI_RE.test(o);

out = render(`<p>הודעה${cpt(RLO)}חשובה</p>`, "");
console.log(`\n[17] ${JSON.stringify(out)}`);
expect("RLO gone from a rendered body", out, noBidi, "a bidi control survived");
expect("…and the surrounding text is intact", out, has("הודעהחשובה"), "text changed beyond the control");

// A text node made of NOTHING but controls. This is the case that fails if the
// hook returns undefined for an empty strip result: html-react-parser would
// then render the original node and the controls would survive.
out = render(`<p>${cpt(RLO, ALM, 0x2066)}</p>`, "");
console.log(`\n[18] ${JSON.stringify(out)}`);
expect("a text node of only controls renders as nothing", out, (o) => o === "<p></p>", "node not emptied");

// Inside an editor-authored anchor the text takes the OTHER branch of the same
// hook (highlight only, never re-linkified). It must be cleaned too.
out = render(`<p><a href="https://example.com">קישור${cpt(RLO)}כאן</a></p>`, "");
console.log(`\n[19] ${JSON.stringify(out)}`);
expect("RLO gone from an editor anchor's label", out, noBidi, "a bidi control survived");
expect("…anchor still rendered once", out, (o) => (o.match(/<a /g) || []).length === 1, "anchor lost or nested");

// All twelve at once, across several tags and a search term, so the strip is
// proven on the styled/highlighted path too.
const allTwelve = [0x061c, 0x200e, 0x200f, 0x202a, 0x202b, 0x202c, 0x202d,
  0x202e, 0x2066, 0x2067, 0x2068, 0x2069].map((p) => cpt(p)).join("x");
out = render(`<h2>${allTwelve}</h2><p><strong>${allTwelve}</strong></p>`, "x");
console.log(`\n[20] ${JSON.stringify(out)}`);
expect("all twelve gone from a styled body", out, noBidi, "a bidi control survived");
expect("…and the search term still highlighted", out, has("<mark"), "no mark rendered");

// A URL carrying a control. safeHttpUrl() REFUSES such a candidate, and that is
// unchanged — but the control is now removed before the scanner sees the run,
// so what it judges is an ordinary URL. The point of this case is that the
// label and the href name the SAME host, which is what the whole urlSafety
// mismatch rule exists to guarantee; nothing is spoofable here.
out = render(`<p>see https://exam${cpt(RLO)}ple.com now</p>`, "");
console.log(`\n[21] ${JSON.stringify(out)}`);
expect("no control left anywhere in the output", out, noBidi, "a bidi control survived");
expect("href is the clean host", out, has('href="https://example.com/"'), "href wrong");
expect("…and the visible label is the same host", out, has(">https://example.com</a>"), "label/href disagree");

// Ordinary Hebrew must still come through byte-for-byte — the strip must not be
// touching anything but the twelve.
out = render("<p>אין כאן קישור</p>", "");
console.log(`\n[22] ${out}`);
expect("ordinary Hebrew still unchanged", out, (o) => o === "<p>אין כאן קישור</p>", "markup changed");

console.log("");
console.log(`TOTAL: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
