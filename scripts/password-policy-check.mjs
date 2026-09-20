// Standalone check for src/utils/passwordPolicy.js.
// There is no unit-test runner in this repo, so this is a plain node script:
//   node scripts/password-policy-check.mjs
// It exercises the password length policy directly and exits non-zero on any
// failure. Output is English on purpose: raw terminal output mangles Hebrew.
//
// The boundaries below are the ones the SERVER enforces
// (kehilapp-backend-hardened/src/apps/auth/entryPoints/authValidation.js:8 and
// :17 — Joi.string().min(8).max(128)). The point of this file is that the two
// auth forms cannot silently narrow that window again: 24 characters is the
// length of the seeded demo password, and under the old 8-20 client rule it was
// rejected, which left the login button permanently disabled.

import { randomBytes } from "node:crypto";

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  validatePassword,
} from "../src/utils/passwordPolicy.js";

let passed = 0;
let failed = 0;

// We assert on ACCEPT / REJECT rather than on the Hebrew message text, so the
// wording can be reworded without rewriting this file. The message itself is
// checked separately below, for the one property that actually matters: it must
// name the bound that rejected the input.
function expectAccept(name, value) {
  const msg = validatePassword(value);
  if (msg === "") {
    passed += 1;
    console.log(`PASS  ${name} (len=${value.length}) -> accepted`);
  } else {
    failed += 1;
    console.log(`FAIL  ${name} (len=${value.length}) -> rejected: ${msg}`);
  }
}

function expectReject(name, value) {
  const msg = validatePassword(value);
  if (msg !== "") {
    passed += 1;
    console.log(`PASS  ${name} (len=${value.length}) -> rejected`);
  } else {
    failed += 1;
    console.log(`FAIL  ${name} (len=${value.length}) -> accepted`);
  }
}

function check(name, actual, expected) {
  if (actual === expected) {
    passed += 1;
    console.log(`PASS  ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL  ${name}`);
    console.log(`        expected: ${JSON.stringify(expected)}`);
    console.log(`        actual:   ${JSON.stringify(actual)}`);
  }
}

const rep = (n) => "a".repeat(n);

console.log("--- policy constants mirror the server ---");
check("PASSWORD_MIN_LENGTH is 8", PASSWORD_MIN_LENGTH, 8);
check("PASSWORD_MAX_LENGTH is 128", PASSWORD_MAX_LENGTH, 128);

console.log("");
console.log("--- lower bound ---");
expectReject("empty string", "");
expectReject("7 characters", rep(7));
expectAccept("exactly 8 characters", rep(8));

console.log("");
console.log("--- the window that used to be closed at 20 ---");
expectAccept("20 characters", rep(20));
expectAccept("21 characters (the old ceiling + 1)", rep(21));

console.log("");
console.log("--- the real seeded demo password shape ---");
// scripts/seedDemo.js builds it as randomBytes(18).toString('base64url').
// Generated here rather than hard-coded, so this case keeps testing the real
// shape (length AND alphabet) if the seed's byte count ever changes.
const seeded = randomBytes(18).toString("base64url");
check("seeded demo password is 24 chars", seeded.length, 24);
expectAccept("seeded demo password (randomBytes(18).base64url)", seeded);
// The exact string the browser check used, so this file records it too.
expectAccept("the measured demo password", "REDACTED-ROTATED-CREDENTIAL");

console.log("");
console.log("--- upper bound ---");
expectAccept("exactly 128 characters", rep(128));
expectReject("129 characters", rep(129));

console.log("");
console.log("--- the message names the bound that actually failed ---");
// This is the half of the bug that hid the other half: the old single message
// said "at least 8 characters" no matter which end was broken, so a 24-character
// password was reported as too short.
check(
  "too-short message mentions the minimum",
  validatePassword(rep(7)).includes(String(PASSWORD_MIN_LENGTH)),
  true
);
check(
  "too-long message mentions the maximum",
  validatePassword(rep(129)).includes(String(PASSWORD_MAX_LENGTH)),
  true
);
// Substring matching cannot separate these two ("128" contains "8"), so the
// property asserted is the one that broke: the two ends must not produce the
// SAME sentence.
check(
  "too-long and too-short are different messages",
  validatePassword(rep(129)) !== validatePassword(rep(7)),
  true
);

console.log("");
console.log(`TOTAL: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
