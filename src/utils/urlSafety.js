// URL safety for turning plain text into clickable links.
//
// This module is deliberately free of React and of JSX so it can be exercised
// directly by a plain `node` script (see scripts/url-safety-check.mjs). It
// answers exactly one question: "given this run of characters, may it become an
// <a href>, and if so with what href?".
//
// This repo already shipped an XSS through a `javascript:` link once. The rule
// below is therefore an ALLOWLIST, not a blocklist: a candidate becomes a link
// only if the URL parser says its protocol is http: or https:. Everything else
// — javascript:, data:, vbscript:, file:, protocol-relative //evil.com, and any
// scheme nobody has thought of yet — falls through to plain text.
//
// Do NOT "optimise" this into a /^javascript:/i test. That check is defeated by
// leading whitespace, embedded tabs/newlines/NUL bytes, mixed case and HTML
// entities; the URL parser strips exactly those characters before resolving the
// scheme, which is why we ask it instead of guessing.
//
// BARE `www.` ADDRESSES. People write "www.example.com" without a scheme and
// expect a link. They get one — but the scheme is supplied BY US, never read
// from the author's text: a candidate that begins with `www.` and carries no
// scheme of its own has a literal "https://" prepended and is then handed to
// the SAME new URL() + allowlist below as everything else. There is deliberately
// no second, shorter path for it, because a path that skips the allowlist is a
// path that stops being protected. The consequence is that `javascript:www.x`
// and `data:www.x` are unaffected: they carry their own scheme, so nothing is
// prepended and the allowlist rejects them exactly as it did before.

/** The only protocols that may ever become an anchor. */
export const ALLOWED_PROTOCOLS = Object.freeze(["http:", "https:"]);

// Unicode bidirectional formatting controls. These are invisible: they change
// the DIRECTION the following characters are laid out in, not the characters
// themselves. In a link they separate what the reader sees from where the click
// goes — the label can be made to read "…example.com" while the href resolves to
// evil.example.com — which is the same deception the userinfo check below
// blocks, done with a code point instead of an "@".
//
// This board is Hebrew and renders RTL, so a run of right-to-left text is the
// normal case and a reversed label does not look wrong; the usual visual cue
// that something is off is simply absent here. An unterminated override (an
// LRO/RLO with no PDF) also leaks past the end of the link and flips the
// direction of the rest of the message.
//
// U+061C is the Arabic letter mark; U+200E/200F are the LTR/RTL marks;
// U+202A-U+202E are the embedding and override set; U+2066-U+2069 are the
// newer isolates.
//
// This list is the COMPLETE set of code points with the Unicode Bidi_Control
// property, and that is a measured claim, not an assumption. Measured with
// node v24.13.0:
//   for (let c = 0; c <= 0x10FFFF; c++) if (/\p{Bidi_Control}/u.test(...)) \u2026
//   -> 12 code points: U+061C U+200E U+200F U+202A U+202B U+202C U+202D
//      U+202E U+2066 U+2067 U+2068 U+2069
// U+061C was missing from the earlier hand-written list. It is a strong-RTL
// character, so leaving it out left exactly the hole the rest of the list
// closes.
//
// WHY NOT /\p{Bidi_Control}/u DIRECTLY. It would be one token and could never
// drift. It is not used because this file has just been burned by the opposite
// bet: a lookbehind here survived into the built bundle and would have thrown
// at module load on Safari before 16.4 \u2014 a blank application, not a broken
// feature. Unicode property escapes are a different feature with a different
// (earlier) support story, but nothing in this repo can RUN a 2021 Safari, so
// that support story cannot be measured here, only recited. An explicit
// character class needs no engine feature at all. Drift is prevented instead by
// scripts/url-safety-check.mjs, which enumerates \p{Bidi_Control} on node \u2014 an
// engine we do run \u2014 and fails if this class and that enumeration disagree.
const BIDI_CONTROL_RE = /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/;

/**
 * The bidi code points this module refuses, as an array, so the check script can
 * compare them against Unicode's own \p{Bidi_Control} set instead of against a
 * second hand-written list that could drift the same way the first one did.
 */
export const BIDI_CONTROL_CODE_POINTS = Object.freeze([
  0x061c, 0x200e, 0x200f, 0x202a, 0x202b, 0x202c, 0x202d, 0x202e, 0x2066,
  0x2067, 0x2068, 0x2069,
]);

// Characters that commonly trail a URL in prose but are not part of it.
// Includes the Hebrew geresh/gershayim because message bodies are Hebrew.
const TRAILING_PUNCTUATION = ".,;:!?׳״'\"…»›";

const CLOSERS = { ")": "(", "]": "[", "}": "{" };

// A bare `www.` host: the one form we are willing to supply a scheme for.
// ANCHORED, so it can never fire on the tail of a string that carries a scheme
// of its own — `javascript:www.evil.com` does not match this and therefore gets
// nothing prepended. `wwww.` and `xwww.` do not match it either.
const BARE_WWW_RE = /^www\./i;

// A "candidate" is anything that even LOOKS like it carries a scheme, plus the
// protocol-relative form, plus a bare `www.` host. We match generously on
// purpose: every candidate is then judged by safeHttpUrl(), so the allowlist —
// not the regex — is what decides. A stricter regex (e.g. /https?:\/\//) would
// make the allowlist vacuous and would quietly stop protecting us the day
// someone loosens it.
//
// The `www.` branch is LAST on purpose. Alternation is tried in order at each
// position, so `javascript:www.evil.com` is still claimed whole by the first
// branch and rejected by the allowlist; were the branches swapped, the scheme
// would be left behind as plain text and `www.evil.com` would become a link.
// The `i` flag is what lets `WWW.EXAMPLE.COM` match; the other two branches
// already spell both cases out and are unaffected by it.
//
// The `www.` branch needs a left boundary, and it is not decoration. Without one
// the "www." sitting inside `wwww.example.com`, `xwww.example.com`,
// `a.www.example.com` or the address `user@www.example.com` would be pulled out
// and linked — part of somebody's word or e-mail turned into a link to a host
// they never wrote. So the match is refused when the preceding character could
// still belong to a name: a letter, a digit, or any of . _ % + @ -.
//
// That boundary used to be a LOOKBEHIND, `(?<![A-Za-z0-9._%+@-])`, and it had to
// go. Measured on the built bundle before this change:
//   $ grep -c "(?<!" build/assets/*.js
//   1
// The lookbehind survived the build verbatim, inside a module-level
// `new RegExp(...)`. An engine without lookbehind support — Safari before 16.4,
// which is every iOS 15 and earlier device — throws SyntaxError WHILE THE MODULE
// LOADS. That is not a feature that degrades; it is a blank page for the whole
// application. Those devices are a confirmed target here: this board serves an
// evacuated community whose population skews old, and so do its phones.
//
// The replacement is a CAPTURING GROUP that consumes the boundary character
// instead of peeking at it: group 1 is either the start of the string (empty) or
// the one character before the host, and group 2 is the candidate itself.
// splitTextIntoSegments() must therefore emit group 1 back as ordinary text and
// treat group 2 — not match[0] — as the candidate; it does, and the round-trip
// cases in scripts/url-safety-check.mjs are what hold it to that. `^` is safe
// without the `m` flag: it can only match at index 0, which is the case the
// lookbehind covered by having nothing to look at.
//
// Consuming rather than peeking is behaviourally identical HERE because the
// other two branches run to the next whitespace, so the character preceding a
// `www.` candidate is never inside a previous match.
const CANDIDATE_RE =
  /[A-Za-z][A-Za-z0-9+.-]*:[^\s]*|\/\/[^\s]+|(^|[^A-Za-z0-9._%+@-])(www\.[^\s]*)/gi;

// Everything that ends the authority component of a URL. "\" is in the list
// because the WHATWG parser treats a backslash in a special-scheme URL as a "/",
// so "https://example.com\evil" has host example.com and path \evil; cutting on
// "/" alone would read the whole tail as the written host and report a mismatch
// that is not one.
const AUTHORITY_END_RE = /[/\\?#]/;

// A scheme followed by "//", as WRITTEN. Deliberately requires the slashes: the
// written host can only be located in a string that actually has an authority
// component to locate it in.
const WRITTEN_SCHEME_RE = /^[A-Za-z][A-Za-z0-9+.-]*:\/\//;

/**
 * The host exactly as the AUTHOR typed it, before any parser touched it.
 *
 * Extracted by string surgery on purpose — running the candidate through a
 * second parser would apply the same normalisations we are trying to detect, and
 * the comparison would always succeed. So: drop the scheme and its "//", cut at
 * the first character that ends the authority, then drop a trailing ":port".
 *
 * Callers must have established that there is no userinfo before trusting this
 * (safeHttpUrl checks parsed.username/password first); with userinfo present the
 * "user@" part would be read as if it were the host.
 *
 * Returns null when there is no authority to read, which safeHttpUrl treats as a
 * refusal — "https:example.com" is a real form the parser accepts and turns into
 * https://example.com/, but a host we cannot see as written is a host we cannot
 * vouch for.
 *
 * @param {string} candidate the string handed to new URL(), scheme included
 * @returns {string|null}
 */
function writtenHost(candidate) {
  const schemeMatch = WRITTEN_SCHEME_RE.exec(candidate);
  if (!schemeMatch) return null;

  const afterScheme = candidate.slice(schemeMatch[0].length);
  const end = afterScheme.search(AUTHORITY_END_RE);
  const authority = end === -1 ? afterScheme : afterScheme.slice(0, end);
  if (authority === "") return null;

  // A port is not part of the host and is compared against parsed.hostname,
  // which never carries one. An IPv6 literal ends in "]", so this cannot eat
  // into one.
  return authority.replace(/:\d*$/, "");
}

function countChar(str, ch) {
  let n = 0;
  for (let i = 0; i < str.length; i += 1) if (str[i] === ch) n += 1;
  return n;
}

// Split a raw match into the URL itself and the punctuation that follows it in
// the sentence, so "see https://example.com." does not swallow the full stop
// and "(https://example.com)" does not swallow the closing paren — while a URL
// that legitimately ends in a balanced ")" (Wikipedia-style) keeps it.
function splitTrailingPunctuation(raw) {
  let core = raw;
  for (;;) {
    const last = core[core.length - 1];
    if (!last) break;
    if (TRAILING_PUNCTUATION.includes(last)) {
      core = core.slice(0, -1);
      continue;
    }
    if (CLOSERS[last]) {
      const body = core.slice(0, -1);
      if (countChar(body, CLOSERS[last]) <= countChar(body, last)) {
        core = body;
        continue;
      }
    }
    break;
  }
  return { core, tail: raw.slice(core.length) };
}

/**
 * Return a safe href for `raw`, or null if it must stay plain text.
 * A bare `www.` host gets "https://" supplied by this function (see the header
 * note); every other input is judged exactly as written.
 * @param {unknown} raw
 * @returns {string|null} the normalised absolute URL, or null
 */
export function safeHttpUrl(raw) {
  if (typeof raw !== "string" || raw === "") return null;

  // Control characters (NUL, tab, CR, LF, …) are stripped by the URL parser and
  // are the classic way of smuggling "java\tscript:" past a naive filter. They
  // never belong in a link we render, so refuse outright.
  // eslint-disable-next-line no-control-regex
  if (/[ -]/.test(raw)) return null;

  // Bidi controls: REJECT the whole candidate rather than strip them and link
  // what is left. Three reasons, in order of weight:
  //   1. splitTextIntoSegments() guarantees that joining the segment values
  //      reproduces the input verbatim. Stripping would break that guarantee —
  //      the reader would be shown a label the author never typed.
  //   2. A stripped label is still not the author's text, so we would be
  //      guessing which address was meant. Refusing leaves the characters on
  //      screen as ordinary text, where React escapes them and there is no
  //      anchor to click.
  //   3. It matches how this module already treats control characters directly
  //      above: an unrenderable character in a link is a reason to decline the
  //      link, not to repair it.
  // Measured before this check existed (node, this module):
  //   safeHttpUrl("https://evil.example.com/\u202emoc.elpmaxe")
  //     -> "https://evil.example.com/%E2%80%AEmoc.elpmaxe", host evil.example.com
  // Note the href came back percent-encoded while the LABEL keeps the literal
  // U+202E, because the label is the raw matched text. That gap is the attack.
  //
  // PERCENT-ENCODED forms (%E2%80%AE and friends) are deliberately NOT rejected.
  // They are not bidi controls at render time: new URL() leaves them encoded,
  // the label is the author's raw text, and React prints the nine literal
  // characters "%E2%80%AE". Nothing is reversed, so there is nothing to spoof.
  // Rejecting them would only break ordinary links whose path is percent-encoded.
  if (BIDI_CONTROL_RE.test(raw)) return null;

  // The ONLY place a scheme is ever added, and it is a literal — never anything
  // taken from `raw`. Everything else, including the result of this line, goes
  // through the identical parse and allowlist below.
  const candidate = BARE_WWW_RE.test(raw) ? `https://${raw}` : raw;

  let parsed;
  try {
    // No base URL on purpose: a base would resolve "//evil.com" and bare paths
    // into real links. Without one, anything that is not already absolute
    // throws and is rejected.
    parsed = new URL(candidate);
  } catch {
    return null;
  }

  if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) return null;

  // USERINFO. "https://www.paypal.com@evil.example.com" is not a link to PayPal:
  // everything before the "@" is a username, and the host is evil.example.com.
  // The label shows the trusted name and the browser goes elsewhere. Measured
  // before this check existed (node, this module):
  //   safeHttpUrl("https://www.paypal.com@evil.example.com")
  //     -> "https://www.paypal.com@evil.example.com/", host evil.example.com
  //   safeHttpUrl("www.bank-hapoalim.co.il@evil.example.com/login")
  //     -> "https://www.bank-hapoalim.co.il@evil.example.com/login", host evil.example.com
  // The bare-`www.` branch widened this: a string that starts with a trusted
  // Israeli bank's domain and carries no scheme at all now reaches new URL().
  //
  // We ask the PARSED url, not the raw text. A string search for "@" would be
  // both wrong and unsafe: "@" is legal in a path ("/@handle") and in a query,
  // and it can be percent-encoded, while the parser has already decided which
  // "@" — if any — separates userinfo from host. Nothing legitimate on a
  // community board needs credentials embedded in a link, so both fields must
  // be empty.
  if (parsed.username !== "" || parsed.password !== "") return null;

  // LABEL/TARGET MISMATCH — the general case of what the userinfo check above
  // catches in one specific shape.
  //
  // The label a reader sees is the author's RAW text (splitTextIntoSegments
  // emits `core` verbatim). The href is whatever the URL parser made of it. When
  // those two name different hosts, the reader is shown one site and sent to
  // another. This vector did not exist before messages could contain links at
  // all: free text was never turned into an anchor.
  //
  // Measured against this module before this check existed (node):
  // (code points written out rather than pasted in: three of the four are
  // invisible or near-invisible, which is the whole point of them, and a literal
  // one in this comment is an eslint no-irregular-whitespace error besides.)
  //   "https://[U+0430]pple.com"
  //     -> ACCEPTED, host xn--pple-43d.com                (Cyrillic a)
  //   "www.[U+0440][U+0430]ypal.com"
  //     -> ACCEPTED, host www.xn--ypal-43d9g.com          (Cyrillic r, a)
  //   "https://evil.example[U+200B].com"
  //     -> ACCEPTED, host evil.example.com                (zero width space, dropped)
  //   "https://example.com[U+3002]evil.example.com"
  //     -> ACCEPTED, host example.com.evil.example.com    (ideographic full stop)
  // Four different mechanisms — Cyrillic homoglyphs punycoded, an invisible
  // character silently dropped, an ideographic full stop silently turned into a
  // label separator — and ONE rule closes all of them, because they are all the
  // same event: the parser produced a host the author did not write.
  //
  // So: compare the host as written against the host that came out, case-folded
  // (a host is case-insensitive and "EXAMPLE.COM" is nobody's deception), and
  // refuse on any other difference. Deliberately not a list of dangerous
  // characters — a list needs extending every time Unicode or the URL spec grows
  // one more, and the two that were missing here are exactly why.
  //
  // Refuse, do not repair. Same call already made for bidi controls and for the
  // same reason: splitTextIntoSegments guarantees that the segment values rejoin
  // to the input verbatim, so rewriting the label to match the href would put
  // text on screen that the author never typed. Rejected candidates stay plain
  // text, which React escapes and nobody can click.
  //
  // ACCEPTED COST, stated plainly: a genuinely internationalised domain — Hebrew
  // or Arabic script, anything under `.ישראל` — will no longer become a link,
  // because the parser punycodes it and the written host therefore differs.
  // That is the intended trade, not an oversight. On a Hebrew board a reader
  // cannot tell a real Hebrew domain from a homograph of one, so the honest
  // answer for both is plain text. The address is still fully readable; it just
  // is not clickable. The same rule also declines obfuscated IP literals
  // ("http://0x7f.1", which the parser resolves to 127.0.0.1) — also deliberate.
  const written = writtenHost(candidate);
  if (written === null) return null;
  if (written.toLowerCase() !== parsed.hostname.toLowerCase()) return null;

  return parsed.href;
}

/**
 * Split plain text into ordered segments for rendering.
 * Every character of the input appears in exactly one segment, in order, so
 * joining the segment values reproduces the input verbatim — text that is not
 * a link renders exactly as it did before.
 *
 * @param {unknown} text
 * @returns {Array<{type:"text",value:string}|{type:"link",value:string,href:string}>}
 */
export function splitTextIntoSegments(text) {
  const str = text == null ? "" : String(text);
  if (!str) return [];

  const segments = [];
  let cursor = 0;

  const pushText = (value) => {
    if (!value) return;
    const previous = segments[segments.length - 1];
    if (previous && previous.type === "text") previous.value += value;
    else segments.push({ type: "text", value });
  };

  CANDIDATE_RE.lastIndex = 0;
  let match = CANDIDATE_RE.exec(str);
  while (match !== null) {
    // The bare-`www.` branch captures the character that precedes the host (or
    // the empty string at position 0) so it does not need a lookbehind. That
    // character belongs to the author's sentence, never to the link, so it is
    // emitted as plain text and the candidate starts after it. When the other
    // two branches matched, both groups are undefined and match[0] is the whole
    // candidate, exactly as before.
    const boundary = match[2] === undefined ? "" : match[1];
    const raw = match[2] === undefined ? match[0] : match[2];
    const rawIndex = match.index + boundary.length;
    const { core, tail } = splitTrailingPunctuation(raw);
    const href = safeHttpUrl(core);

    pushText(str.slice(cursor, rawIndex));
    if (href) {
      segments.push({ type: "link", value: core, href });
      pushText(tail);
    } else {
      // Rejected: emit the candidate back as ordinary text, unchanged.
      pushText(raw);
    }
    cursor = rawIndex + raw.length;
    match = CANDIDATE_RE.exec(str);
  }

  pushText(str.slice(cursor));
  return segments;
}
