// Standalone safety check for src/utils/urlSafety.js.
// There is no unit-test runner in this repo, so this is a plain node script:
//   node scripts/url-safety-check.mjs
// It exercises the URL allowlist and the text segmentation directly and exits
// non-zero on any failure. Output is English on purpose: raw terminal output
// mangles Hebrew.

import {
  BIDI_CONTROL_CODE_POINTS,
  safeHttpUrl,
  splitTextIntoSegments,
} from "../src/utils/urlSafety.js";

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

// Compact view of a segmentation: links as "[text](href)", text as-is.
function shape(text) {
  return splitTextIntoSegments(text).map((s) =>
    s.type === "link" ? `[${s.value}](${s.href})` : s.value
  );
}

console.log("--- safeHttpUrl: allowlist ---");
check("http URL allowed", safeHttpUrl("http://example.com"), "http://example.com/");
check("https URL allowed", safeHttpUrl("https://example.com/a?b=1#c"), "https://example.com/a?b=1#c");
check("javascript: rejected", safeHttpUrl("javascript:alert(1)"), null);
check("mixed-case JaVaScRiPt: rejected", safeHttpUrl("JaVaScRiPt:alert(1)"), null);
check("tab-split java\\tscript: rejected", safeHttpUrl("java\tscript:alert(1)"), null);
check("newline-split java\\nscript: rejected", safeHttpUrl("java\nscript:alert(1)"), null);
check("NUL-split java\\0script: rejected", safeHttpUrl("java\u0000script:alert(1)"), null);
check("leading whitespace javascript: rejected", safeHttpUrl("  javascript:alert(1)"), null);
check("data: rejected", safeHttpUrl("data:text/html,<script>"), null);
check("vbscript: rejected", safeHttpUrl("vbscript:msgbox(1)"), null);
check("file: rejected", safeHttpUrl("file:///C:/Windows/win.ini"), null);
check("protocol-relative //evil.com rejected", safeHttpUrl("//evil.com"), null);
check("non-string rejected", safeHttpUrl(null), null);

console.log("");
console.log("--- safeHttpUrl: bare www. gets OUR https:// ---");
// The scheme in every expected value below is one this module wrote, not one
// the input carried. That is the whole property being checked.
check("www. host allowed as https", safeHttpUrl("www.example.com"), "https://www.example.com/");
check("WWW. uppercase allowed as https", safeHttpUrl("WWW.EXAMPLE.COM"), "https://www.example.com/");
check(
  "www. with path and query allowed",
  safeHttpUrl("www.example.com/path?q=1"),
  "https://www.example.com/path?q=1"
);
// The scheme wins: these carry one of their own, so nothing is prepended and the
// allowlist judges them exactly as it did before www. was ever supported.
check("javascript:www.evil.com still rejected", safeHttpUrl("javascript:www.evil.com"), null);
check("data:www.evil.com still rejected", safeHttpUrl("data:www.evil.com"), null);
check("//www.evil.com still rejected", safeHttpUrl("//www.evil.com"), null);
// The boundary must be a real one. "www." appears inside both of these, and
// neither is a host the author wrote.
check("wwww.example.com rejected", safeHttpUrl("wwww.example.com"), null);
check("xwww.example.com rejected", safeHttpUrl("xwww.example.com"), null);

console.log("");
console.log("--- safeHttpUrl: bidi controls rejected ---");
// Each of these is invisible and reverses the reading order of what follows, so
// the label a reader sees can disagree with the host the click resolves to.
//
// The list is GENERATED from Unicode, not typed out. The previous version of
// this file typed out 7 code points while the module's regex covered 11 and
// Unicode defines 12 \u2014 and it passed 85/85, which proved nothing at all about
// the three-way gap. A hand-written table can only test the cases its author
// already thought of; that is exactly the failure being fixed. node supports
// \p{Bidi_Control}, so the authority is asked directly.
const BIDI = [];
for (let cp = 0; cp <= 0x10ffff; cp += 1) {
  if (/\p{Bidi_Control}/u.test(String.fromCodePoint(cp))) BIDI.push(cp);
}
const hex = (cp) => `U+${cp.toString(16).toUpperCase().padStart(4, "0")}`;

// Drift guard: the module ships an explicit character class (it must run on
// engines this repo cannot test), so the one thing that can go wrong is that
// class falling behind Unicode. Compare the two sets directly rather than trust
// that the per-code-point cases below happen to cover it.
check(
  "module's bidi list == Unicode \\p{Bidi_Control}",
  [...BIDI_CONTROL_CODE_POINTS].sort((a, b) => a - b).map(hex),
  BIDI.map(hex)
);
for (const cp of BIDI) {
  const ch = String.fromCodePoint(cp);
  check(
    `${hex(cp)} in path rejected`,
    safeHttpUrl(`https://evil.example.com/${ch}moc.elpmaxe`),
    null
  );
  check(`${hex(cp)} in host rejected`, safeHttpUrl(`https://evil${ch}.example.com`), null);
}
// The measured original report, spelled out once in full.
check(
  "RLO label-spoof (the reported case) rejected",
  safeHttpUrl("https://evil.example.com/\u202emoc.elpmaxe"),
  null
);
check("bidi in a bare www. address rejected", safeHttpUrl("www.example.com/\u202emoc.x"), null);
// Percent-encoded is NOT the same thing: new URL() keeps it encoded and the
// label shows the nine literal characters "%E2%80%AE", so nothing is reversed.
// Rejecting it would break ordinary percent-encoded paths for no gain.
check(
  "percent-encoded %E2%80%AE still allowed",
  safeHttpUrl("https://example.com/%E2%80%AEmoc.elpmaxe"),
  "https://example.com/%E2%80%AEmoc.elpmaxe"
);

console.log("");
console.log("--- safeHttpUrl: userinfo rejected ---");
// Everything before the "@" is a username, not a host. The label reads like a
// bank; the browser goes to evil.example.com.
check("user@host rejected", safeHttpUrl("https://user@example.com"), null);
check("user:pass@host rejected", safeHttpUrl("https://user:pass@example.com"), null);
check("https://trusted.com@evil.com rejected", safeHttpUrl("https://trusted.com@evil.com"), null);
check("www.trusted.com@evil.com rejected", safeHttpUrl("www.trusted.com@evil.com"), null);
check(
  "bank-lookalike userinfo rejected",
  safeHttpUrl("www.bank-hapoalim.co.il@evil.example.com/login"),
  null
);
check("https://www.paypal.com@evil.example.com rejected", safeHttpUrl("https://www.paypal.com@evil.example.com"), null);
// "@" is legal in a path and in a query. The check reads parsed.username, not
// the raw string, precisely so these keep working.
check(
  "@ in the path still allowed",
  safeHttpUrl("https://example.com/@handle"),
  "https://example.com/@handle"
);
check(
  "@ in the query still allowed",
  safeHttpUrl("https://example.com/search?q=a@b.com"),
  "https://example.com/search?q=a@b.com"
);
check(
  "@ in the fragment still allowed",
  safeHttpUrl("https://example.com/page#@anchor"),
  "https://example.com/page#@anchor"
);

console.log("");
console.log("--- safeHttpUrl: label says one host, href resolves to another ---");
// One rule covers all of these: the host AS WRITTEN must equal the host the
// parser produced, case aside. Each line below is a different mechanism for
// making those two disagree, and every one of them was ACCEPTED before that
// rule existed (measured against this module, hosts noted).
// The hostile characters are BUILT from their code points, never pasted in.
// Three of the four are invisible or all but invisible in an editor, which is
// what makes them attacks; a payload you cannot see is a payload a later edit
// can silently drop, and the test would then keep passing while testing nothing.
const cp = (...codePoints) => String.fromCodePoint(...codePoints);
const CYRILLIC_A = 0x0430; // looks exactly like ASCII "a"
const CYRILLIC_ER = 0x0440; // looks exactly like ASCII "p"
const ZERO_WIDTH_SPACE = 0x200b; // invisible, and the URL parser DELETES it
const IDEOGRAPHIC_FULL_STOP = 0x3002; // the parser reads it as a label separator

check(
  "Cyrillic homograph apple.com rejected",
  safeHttpUrl(`https://${cp(CYRILLIC_A)}pple.com`),
  null
); // real host was xn--pple-43d.com
check(
  "Cyrillic homograph paypal.com rejected",
  safeHttpUrl(`www.${cp(CYRILLIC_ER, CYRILLIC_A)}ypal.com`),
  null
); // real host was www.xn--ypal-43d9g.com
check(
  "zero-width space in host rejected",
  safeHttpUrl(`https://evil.example${cp(ZERO_WIDTH_SPACE)}.com`),
  null
); // U+200B is silently DROPPED -> evil.example.com
check(
  "ideographic full stop in host rejected",
  safeHttpUrl(`https://example.com${cp(IDEOGRAPHIC_FULL_STOP)}evil.example.com`),
  null
); // U+3002 becomes a label separator -> example.com.evil.example.com
// The stated, accepted cost of that rule, asserted so nobody "fixes" it later
// believing it to be a bug: a real internationalised domain is punycoded by the
// parser, so it stops being clickable. On a Hebrew board a reader cannot tell it
// apart from a homograph of itself, so both stay plain text.
check(
  "real Hebrew IDN is NOT linkified (accepted cost)",
  safeHttpUrl("https://דוגמה.ישראל"),
  null
);
// Same rule, same reason: the parser turns this into 127.0.0.1, which is not
// what the label says.
check("obfuscated IP literal rejected", safeHttpUrl("http://0x7f.1"), null);
// No authority written at all means no written host to compare. The parser
// accepts this form and produces https://example.com/; we decline it because we
// cannot see what the author wrote.
check("scheme without // rejected", safeHttpUrl("https:example.com"), null);

console.log("");
console.log("--- safeHttpUrl: ordinary hosts still linkify ---");
// The other half of the proof. A mismatch rule that rejected everything would
// also pass the block above, so the ordinary shapes are asserted explicitly.
check("plain ASCII host", safeHttpUrl("http://example.com"), "http://example.com/");
check(
  "hyphenated host",
  safeHttpUrl("https://my-host.example.co.il"),
  "https://my-host.example.co.il/"
);
check("subdomains", safeHttpUrl("https://a.b.c.example.com/x"), "https://a.b.c.example.com/x");
check("explicit port kept", safeHttpUrl("https://example.com:8443/x"), "https://example.com:8443/x");
check(
  "percent-encoded path and query",
  safeHttpUrl("https://example.com/%D7%90?q=%20"),
  "https://example.com/%D7%90?q=%20"
);
check(
  "path starting with @handle",
  safeHttpUrl("https://example.com/@handle"),
  "https://example.com/@handle"
);
check("uppercase host folds", safeHttpUrl("HTTPS://EXAMPLE.COM/A"), "https://example.com/A");
check("IPv6 literal with port", safeHttpUrl("http://[::1]:8080/x"), "http://[::1]:8080/x");
check("bare www. still linkifies", safeHttpUrl("www.example.com"), "https://www.example.com/");
check(
  "bare www. with path and port",
  safeHttpUrl("www.example.com:8080/a/b?c=1#d"),
  "https://www.example.com:8080/a/b?c=1#d"
);

console.log("");
console.log("--- splitTextIntoSegments: rejected candidates stay plain text ---");
check("bidi candidate stays plain text", shape("see https://evil.example.com/\u202emoc.x"), [
  "see https://evil.example.com/\u202emoc.x",
]);
check("userinfo candidate stays plain text", shape("see https://www.paypal.com@evil.example.com"), [
  "see https://www.paypal.com@evil.example.com",
]);
check("bare www. userinfo candidate stays plain text", shape("www.bank-hapoalim.co.il@evil.example.com/login"), [
  "www.bank-hapoalim.co.il@evil.example.com/login",
]);
const HOMOGRAPH_TEXT = `see https://${cp(CYRILLIC_A)}pple.com now`;
check("homograph candidate stays plain text", shape(HOMOGRAPH_TEXT), [HOMOGRAPH_TEXT]);
const ZWSP_TEXT = `https://evil.example${cp(ZERO_WIDTH_SPACE)}.com`;
check("zero-width-space candidate stays plain text", shape(ZWSP_TEXT), [ZWSP_TEXT]);
check("@ in a path still becomes a link", shape("see https://example.com/@handle"), [
  "see ",
  "[https://example.com/@handle](https://example.com/@handle)",
]);

console.log("");
console.log("--- splitTextIntoSegments: rendering ---");
check(
  "plain http URL becomes a link",
  shape("go to http://example.com now"),
  ["go to ", "[http://example.com](http://example.com/)", " now"]
);
check(
  "plain https URL becomes a link",
  shape("https://example.com/path"),
  ["[https://example.com/path](https://example.com/path)"]
);
check("javascript:alert(1) stays plain text", shape("click javascript:alert(1)"), [
  "click javascript:alert(1)",
]);
check("JaVaScRiPt:alert(1) stays plain text", shape("JaVaScRiPt:alert(1)"), [
  "JaVaScRiPt:alert(1)",
]);
check("java\\tscript:alert(1) stays plain text", shape("java\tscript:alert(1)"), [
  "java\tscript:alert(1)",
]);
check("java\\nscript:alert(1) stays plain text", shape("java\nscript:alert(1)"), [
  "java\nscript:alert(1)",
]);
check("leading-whitespace javascript: stays plain text", shape("  javascript:alert(1)"), [
  "  javascript:alert(1)",
]);
check("data:text/html stays plain text", shape("data:text/html,<script>"), [
  "data:text/html,<script>",
]);
check("//evil.com stays plain text", shape("visit //evil.com today"), [
  "visit //evil.com today",
]);
check("bare www.example.com becomes a link", shape("see www.example.com"), [
  "see ",
  "[www.example.com](https://www.example.com/)",
]);
check("WWW.EXAMPLE.COM becomes a link", shape("WWW.EXAMPLE.COM"), [
  "[WWW.EXAMPLE.COM](https://www.example.com/)",
]);
check(
  "www. with path and query becomes a link",
  shape("www.example.com/path?q=1"),
  ["[www.example.com/path?q=1](https://www.example.com/path?q=1)"]
);
check("javascript:www.evil.com stays plain text", shape("javascript:www.evil.com"), [
  "javascript:www.evil.com",
]);
check("data:www.evil.com stays plain text", shape("data:www.evil.com"), [
  "data:www.evil.com",
]);
check("//www.evil.com stays plain text", shape("visit //www.evil.com today"), [
  "visit //www.evil.com today",
]);
check(
  "Hebrew on both sides of a www. address",
  shape("בקרו ב- www.example.com ותהנו"),
  [
    "בקרו ב- ",
    "[www.example.com](https://www.example.com/)",
    " ותהנו",
  ]
);
check(
  "trailing period after a www. address is not swallowed",
  shape("פרטים www.example.com."),
  [
    "פרטים ",
    "[www.example.com](https://www.example.com/)",
    ".",
  ]
);
check("wwww.example.com stays plain text", shape("wwww.example.com"), [
  "wwww.example.com",
]);
check("xwww.example.com stays plain text", shape("xwww.example.com"), [
  "xwww.example.com",
]);
// The left boundary of the bare-`www.` branch is a consumed capturing group now,
// not a lookbehind (see CANDIDATE_RE). These four are what that change has to
// keep identical: the boundary character must come back as text, position 0 must
// still match with nothing in front of it, and two addresses in one line must
// not shadow each other.
check("www. at the very start still becomes a link", shape("www.example.com now"), [
  "[www.example.com](https://www.example.com/)",
  " now",
]);
check("boundary character is not swallowed", shape("(www.example.com)"), [
  "(",
  "[www.example.com](https://www.example.com/)",
  ")",
]);
check("user@www. stays plain text", shape("mail user@www.example.com please"), [
  "mail user@www.example.com please",
]);
check("two www. addresses in one line", shape("a www.a.example.com b www.b.example.com c"), [
  "a ",
  "[www.a.example.com](https://www.a.example.com/)",
  " b ",
  "[www.b.example.com](https://www.b.example.com/)",
  " c",
]);
check(
  "Hebrew on both sides of a URL",
  shape("\u05D1\u05E7\u05E8\u05D5 \u05D1- https://example.com \u05D5\u05EA\u05D4\u05E0\u05D5"),
  [
    "\u05D1\u05E7\u05E8\u05D5 \u05D1- ",
    "[https://example.com](https://example.com/)",
    " \u05D5\u05EA\u05D4\u05E0\u05D5",
  ]
);
check(
  "trailing period is not swallowed",
  shape("\u05E4\u05E8\u05D8\u05D9\u05DD https://example.com."),
  ["\u05E4\u05E8\u05D8\u05D9\u05DD ", "[https://example.com](https://example.com/)", "."]
);
check(
  "trailing closing paren is not swallowed",
  shape("(https://example.com)"),
  ["(", "[https://example.com](https://example.com/)", ")"]
);
check(
  "balanced paren inside a URL is kept",
  shape("https://en.wikipedia.org/wiki/Foo_(bar)"),
  [
    "[https://en.wikipedia.org/wiki/Foo_(bar)](https://en.wikipedia.org/wiki/Foo_(bar))",
  ]
);
check(
  "two URLs in one message",
  shape("http://a.example.com and https://b.example.com/x"),
  [
    "[http://a.example.com](http://a.example.com/)",
    " and ",
    "[https://b.example.com/x](https://b.example.com/x)",
  ]
);
check(
  "text with no URL at all",
  shape("\u05D0\u05D9\u05DF \u05DB\u05D0\u05DF \u05E7\u05D9\u05E9\u05D5\u05E8 \u05D1\u05DB\u05DC\u05DC"),
  ["\u05D0\u05D9\u05DF \u05DB\u05D0\u05DF \u05E7\u05D9\u05E9\u05D5\u05E8 \u05D1\u05DB\u05DC\u05DC"]
);
check("empty text", shape(""), []);
check(
  "ordinary prose with a colon is untouched",
  shape("Note: meeting at 10:30"),
  ["Note: meeting at 10:30"]
);

console.log("");
console.log("--- round-trip: every character survives ---");
const roundTripCases = [
  "go to http://example.com now",
  "javascript:alert(1)",
  "(https://example.com), and https://b.example.com.",
  "\u05E9\u05DC\u05D5\u05DD https://example.com/\u05D0 \u05E2\u05D5\u05DC\u05DD",
  "no url here",
  "see www.example.com.",
  "wwww.example.com and xwww.example.com",
  "mail user@www.example.com please",
  "see https://www.paypal.com@evil.example.com",
  "www.bank-hapoalim.co.il@evil.example.com/login",
  `https://${cp(CYRILLIC_A)}pple.com and www.${cp(CYRILLIC_ER, CYRILLIC_A)}ypal.com`,
  `https://example.com${cp(IDEOGRAPHIC_FULL_STOP)}evil.example.com`,
  "(www.example.com) www.b.example.com.",
];
for (const input of roundTripCases) {
  const joined = splitTextIntoSegments(input)
    .map((s) => s.value)
    .join("");
  // Links may legitimately re-render the punctuation split off, so compare the
  // concatenated segment VALUES (not hrefs) with the original input.
  check(`round-trip ${JSON.stringify(input)}`, joined, input);
}

console.log("");
console.log(`TOTAL: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
