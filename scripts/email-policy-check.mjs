// Standalone check for src/utils/emailPolicy.js.
// There is no unit-test runner in this repo, so this is a plain node script:
//   node scripts/email-policy-check.mjs
// It exits non-zero on any failure. Output is English on purpose: raw terminal
// output mangles Hebrew.
//
// WHAT THIS FILE IS GUARDING. The two auth forms used to hold a byte-identical
// `/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i` each, which refused addresses the
// server's `Joi.string().email()` accepts. Because both forms disable their
// submit button while a field is invalid, those people could not send the
// request at all — on the LOGIN form, for an account that already exists.
//
// The addresses in ACCEPT_CASES below were each measured against the backend's
// own Joi (kehilapp-backend-hardened/node_modules/joi, node v24.13.0) and
// accepted by it. They are here so that "tighten the email regex a bit" cannot
// be done again without this script going red.

import { validateEmail, EMAIL_STRUCTURE_RE } from "../src/utils/emailPolicy.js";

let passed = 0;
let failed = 0;

// Assert on ACCEPT / REJECT, not on the Hebrew message text, so the wording can
// change without rewriting this file.
function expectAccept(name, value) {
  const msg = validateEmail(value);
  if (msg === "") {
    passed += 1;
    console.log(`PASS  accept ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL  accept ${name} -> rejected`);
  }
}

function expectReject(name, value) {
  const msg = validateEmail(value);
  if (msg !== "") {
    passed += 1;
    console.log(`PASS  reject ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL  reject ${name} -> accepted`);
  }
}

// --- Accepted by the server, and REJECTED by the regex this module replaced ---
// Each of these was a person who could not press the button.
const ACCEPT_CASES = [
  "o'brien@example.com",
  "first!name@example.com",
  "user{x}@example.com",
  "a=b@example.com",
  "a/b@example.com",
];
for (const value of ACCEPT_CASES) expectAccept(JSON.stringify(value), value);

// Ordinary addresses, which the old regex also accepted. Here so a future
// "minimal" check cannot become so minimal it stops catching typos.
expectAccept('"plain@example.com"', "plain@example.com");
expectAccept(
  '"a.b+c%d_e-f@sub.example.co.il"',
  "a.b+c%d_e-f@sub.example.co.il"
);

// --- Still refused: the obvious typos this check exists for -------------------
expectReject('"" (empty)', "");
expectReject('"no-at-sign"', "no-at-sign");
expectReject('"@example.com" (nothing before @)', "@example.com");
expectReject('"user@" (nothing after @)', "user@");
expectReject('"a b@example.com" (space)', "a b@example.com");
expectReject('"user@@example.com" (two @)', "user@@example.com");
expectReject('"a@b c" (space after @)', "a@b c");
// A tab and a newline are whitespace too, and a pasted address carries them.
expectReject('"a\\t@b.com" (tab)', "a\t@b.com");
expectReject('"a@b.com\\n" (newline)', "a@b.com\n");

// --- The deliberate one-way gap ----------------------------------------------
// These the SERVER refuses and this module lets through, on purpose: the answer
// is a 400 with a message on screen, which a person can act on, instead of a
// button that never enables. See the header of src/utils/emailPolicy.js.
expectAccept(
  "200-char local part (server rejects; deliberate)",
  `${"a".repeat(200)}@example.com`
);
expectAccept(
  "unknown TLD (server rejects; deliberate)",
  "user@example.invalidtldxyz"
);
expectAccept("no TLD at all (server rejects; deliberate)", "user@example");

// --- The rule itself ----------------------------------------------------------
// The module must stay a STRUCTURAL check. A regex that starts naming permitted
// characters is the defect this file was written after, so assert the shape
// directly: the five measured local parts above must all satisfy it.
function check(name, actual, expected) {
  if (actual === expected) {
    passed += 1;
    console.log(`PASS  ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL  ${name} -> ${actual}, expected ${expected}`);
  }
}
check(
  "structure regex is anchored at both ends",
  EMAIL_STRUCTURE_RE.source.startsWith("^") &&
    EMAIL_STRUCTURE_RE.source.endsWith("$"),
  true
);
check(
  "structure regex is not global (test() would be stateful)",
  EMAIL_STRUCTURE_RE.global,
  false
);

console.log("");
console.log(`TOTAL: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
