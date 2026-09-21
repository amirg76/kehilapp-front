// Email field policy, shared by the login and the register forms.
//
// WHY THIS FILE EXISTS
// Both forms carried a byte-identical `/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i`
// of their own. Two copies of one rule in two files is exactly the shape that
// let the PASSWORD rule drift away from the server (see passwordPolicy.js), so
// this one is moved into a single module before it can do the same.
//
// THE BUG THAT REGEX CAUSED. The server accepts `Joi.string().email()`
// (kehilapp-backend-hardened/src/apps/auth/entryPoints/authValidation.js:5 for
// login, :16 for register). The client's local part allowed only `._%+-`, while
// RFC 5322 allows a much wider set. Measured with node v24.13.0 against the
// repo's own Joi (see scripts/email-policy-check.mjs):
//   "o'brien@example.com"     old client REJECT / server ACCEPT
//   "first!name@example.com"  old client REJECT / server ACCEPT
//   "user{x}@example.com"     old client REJECT / server ACCEPT
//   "a=b@example.com"         old client REJECT / server ACCEPT
//   "a/b@example.com"         old client REJECT / server ACCEPT
// The forms disable their submit button while any field is invalid, so each of
// those people met a dead button with no way forward. On the LOGIN form that is
// worse than on register: the account already exists, its owner typed their own
// correct address, and the client refused to let the request leave the browser.
// There is no workaround available to them and nothing on screen explains it.
//
// WHY A MINIMAL CHECK AND NOT A BETTER REGEX
// A more precise regex is the wrong fix, not an insufficient one. The addresses
// above are all valid, and any regex short of the RFC 5322 grammar will keep a
// list of people it silently locks out — the list just gets shorter and harder
// to find. Real validation of an email address is sending a message to it and
// seeing whether it arrives, and this system ALREADY does that: registration is
// gated on a verification link. So the client's job here is only to catch the
// obvious typo — a missing "@", a stray space — and the server (and then the
// inbox) is the authority on everything else.
//
// WHAT WE DELIBERATELY LET THROUGH TO THE SERVER
// Two measured cases go the other way: the client accepts what the server
// rejects.
//   "a"x200 + "@example.com"      client ACCEPT / server REJECT (Joi length cap)
//   "user@example.invalidtldxyz"  client ACCEPT / server REJECT (unknown TLD)
//   "user@example"                client ACCEPT / server REJECT (no TLD at all)
// These are left to the server on purpose. They cost a round trip and a "פרטי
// ההרשמה אינם תקינים" message — recoverable, and the person can see it and edit
// the field. A dead button is not recoverable. Mirroring them here would also
// mean shipping a copy of IANA's TLD list to the browser, a list that changes
// without us and would become a second source of truth that drifts — the exact
// failure this module exists to prevent.
//
// This module is deliberately free of React and of JSX so it can be exercised
// directly by a plain `node` script — see scripts/email-policy-check.mjs.

/**
 * A structural check, not a validity check.
 *
 * Exactly one "@" (neither side may contain one), something on both sides, and
 * no whitespace anywhere. That is the whole rule, and it is all the browser is
 * entitled to decide.
 */
export const EMAIL_STRUCTURE_RE = /^[^\s@]+@[^\s@]+$/;

/**
 * Validate an email field's value.
 *
 * Returns the Hebrew error message to show, or "" when the value is acceptable.
 * The empty string (not null) is the "valid" answer on purpose: both forms treat
 * `null` as "not yet validated" and keep their submit button disabled while any
 * field is still null.
 *
 * @param {string} value raw field value
 * @returns {string} error message, or "" if valid
 */
export function validateEmail(value) {
  if (!value || !value.length) return "שדה חובה";
  if (!EMAIL_STRUCTURE_RE.test(value)) return "כתובת המייל אינה תקינה";
  return "";
}
