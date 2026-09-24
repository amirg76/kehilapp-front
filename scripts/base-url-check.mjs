// Standalone check for src/utils/baseUrl.js.
// There is no unit-test runner in this repo, so this is a plain node script:
//   node scripts/base-url-check.mjs
// It exits non-zero on any failure. Output is English on purpose: raw terminal
// output mangles Hebrew.
//
// WHAT THIS FILE IS GUARDING. The API base URL is baked into the bundle at build
// time. Built without it, the build passed and the site loaded blank. And every
// endpoint is `${BASE_URL}api/...`, so a value without a trailing slash sent
// every request to a different host. vite.config.js now refuses to build on the
// same rule the app applies; this script pins that rule.

import { normalizeBaseUrl, BASE_URL_VAR } from "../src/utils/baseUrl.js";

let passed = 0;
let failed = 0;

function expectValue(name, raw, expected) {
  let got;
  try {
    got = normalizeBaseUrl(raw);
  } catch (err) {
    failed += 1;
    console.log(`FAIL  ${name} -> threw: ${err.message}`);
    return;
  }
  if (got === expected) {
    passed += 1;
    console.log(`PASS  ${name}`);
  } else {
    failed += 1;
    console.log(
      `FAIL  ${name} -> got ${JSON.stringify(got)}, expected ${JSON.stringify(
        expected,
      )}`,
    );
  }
}

// Assert that it throws AND that the message names the variable, so the person
// reading a failed build knows which setting to fix.
function expectRefused(name, raw) {
  try {
    const got = normalizeBaseUrl(raw);
    failed += 1;
    console.log(`FAIL  ${name} -> accepted as ${JSON.stringify(got)}`);
  } catch (err) {
    if (err.message.includes(BASE_URL_VAR)) {
      passed += 1;
      console.log(`PASS  ${name}`);
    } else {
      failed += 1;
      console.log(
        `FAIL  ${name} -> threw without naming ${BASE_URL_VAR}: ${err.message}`,
      );
    }
  }
}

console.log("--- accepted, and normalised to one trailing slash ---");
expectValue(
  "https with trailing slash",
  "https://api.example.com/",
  "https://api.example.com/",
);
expectValue(
  "https WITHOUT trailing slash gets one",
  "https://api.example.com",
  "https://api.example.com/",
);
expectValue(
  "several trailing slashes collapse to one",
  "https://api.example.com///",
  "https://api.example.com/",
);
expectValue(
  "a path prefix is kept",
  "https://example.com/kehilapp",
  "https://example.com/kehilapp/",
);
expectValue(
  "local dev value",
  "http://localhost:5001/",
  "http://localhost:5001/",
);
expectValue(
  "surrounding whitespace is trimmed",
  "  https://api.example.com/  ",
  "https://api.example.com/",
);

console.log("");
console.log("--- refused ---");
expectRefused("undefined (variable not set at all)", undefined);
expectRefused("empty string", "");
expectRefused("whitespace only", "   ");
expectRefused("bare hostname, no scheme", "api.example.com");
expectRefused("non-http scheme", "ftp://api.example.com/");
expectRefused("javascript: scheme", "javascript:alert(1)");
expectRefused("a query string", "https://api.example.com/?x=1");
expectRefused("a fragment", "https://api.example.com/#top");
// The exact value the dead production branch used to look up as a variable NAME.
// As a value it is fine — the bug was the lookup, not the URL.
expectValue(
  "the old production URL is a valid value",
  "https://backend.weunity.net/",
  "https://backend.weunity.net/",
);

console.log("");
console.log("--- the returned value is the PARSED form, not the typed one ---");
// Built with String.fromCharCode, not typed: a literal backslash in this file is
// easy to lose to an editor or a shell heredoc, and the case would silently test
// something else.
const BS = String.fromCharCode(92);
expectValue(
  "backslashes (read as slashes by URL) give a clean base, not a trailing backslash",
  `https:${BS}${BS}api.example.com${BS}`,
  "https://api.example.com/",
);
// The end-to-end form of the same bug: the request the app would actually make.
{
  const base = normalizeBaseUrl(`https:${BS}${BS}api.example.com${BS}`);
  const request = new URL(`${base}api/messages`).href;
  if (request === "https://api.example.com/api/messages") {
    passed += 1;
    console.log(
      "PASS  request built from that base has a single slash before api/",
    );
  } else {
    failed += 1;
    console.log(`FAIL  request built from that base is ${request}`);
  }
}
expectValue(
  "scheme and host are lower-cased",
  "HTTPS://Api.Example.COM/",
  "https://api.example.com/",
);
expectValue(
  "a port is kept",
  "https://api.example.com:8443",
  "https://api.example.com:8443/",
);

console.log("");
console.log(`TOTAL: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
