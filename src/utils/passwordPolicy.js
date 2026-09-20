// Password length policy, shared by the login and the register forms.
//
// WHY THIS FILE EXISTS
// Both forms used to carry a byte-identical `/^.{8,20}$/` of their own, and the
// two copies disagreed with the server. The server's auth validation
// (kehilapp-backend-hardened/src/apps/auth/entryPoints/authValidation.js:8 for
// login and :17 for register) accepts `Joi.string().min(8).max(128)` — so the
// client was rejecting, before any request left the browser, passwords the
// server would have accepted.
//
// THE BUG THAT CAUSED. The seeded demo password is produced by
// `randomBytes(18).toString('base64url')` (scripts/seedDemo.js), which is 24
// characters. Over 20, so the login form's own rule marked the field invalid,
// the submit button never left its disabled state, and no demo account could
// sign in to the resident app at all. Password managers and passphrases hit the
// same wall on the register form.
//
// This module is deliberately free of React and of JSX so it can be exercised
// directly by a plain `node` script — see scripts/password-policy-check.mjs.
//
// KEEP THESE NUMBERS EQUAL TO THE SERVER'S. They are not a UX preference; they
// are a mirror of what the API will accept. If authValidation.js changes, change
// them here too, in this one place, rather than in each form.

/** Minimum accepted password length — mirrors Joi `.min(8)` on the server. */
export const PASSWORD_MIN_LENGTH = 8;

/**
 * Maximum accepted password length — mirrors Joi `.max(128)` on the server.
 * The server's comment gives the reasoning: bcrypt only reads the first 72
 * bytes, so 128 is generous while still rejecting absurdly large inputs early.
 */
export const PASSWORD_MAX_LENGTH = 128;

/**
 * Validate a password field's value.
 *
 * Returns the Hebrew error message to show, or "" when the value is acceptable.
 * The empty string (not null) is the "valid" answer on purpose: both forms treat
 * `null` as "not yet validated" and keep their submit button disabled while any
 * field is still null.
 *
 * Each failure names the bound it actually broke. The previous single message
 * said only "at least 8 characters" — so a person holding a 24-character
 * password was told it was too short, which is exactly why the real cause (the
 * 20-character ceiling) stayed invisible.
 *
 * @param {string} value raw field value
 * @returns {string} error message, or "" if valid
 */
export function validatePassword(value) {
  if (!value || !value.length) return "שדה חובה";
  if (value.length < PASSWORD_MIN_LENGTH)
    return `הסיסמא צריכה להכיל לפחות ${PASSWORD_MIN_LENGTH} תווים`;
  if (value.length > PASSWORD_MAX_LENGTH)
    return `הסיסמא יכולה להכיל עד ${PASSWORD_MAX_LENGTH} תווים`;
  return "";
}
