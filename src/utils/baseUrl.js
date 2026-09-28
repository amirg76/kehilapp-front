// The API base URL rule, in one place.
//
// Imported by the app (src/utils/envUtils.js) AND by the build (vite.config.js),
// so the build refuses exactly what the app would fail on — the same shared-rule
// pattern as passwordPolicy.js and emailPolicy.js.
//
// WHY THE BUILD HAS TO KNOW. The value is baked into the bundle at build time.
// Built without it, `vite build` succeeded and the app threw on its first import,
// before React rendered anything: a blank page in production, from a green build.
//
// WHY THE TRAILING SLASH. apiConstants.js builds every endpoint as
// `${BASE_URL}api/...`. Without the slash, `https://api.example.com` becomes
// `https://api.example.comapi/messages` — a different host, every request.

export const BASE_URL_VAR = "VITE_REACT_APP_BASE_URL";

/**
 * Returns the base URL with exactly one trailing slash, or throws an Error whose
 * message names the variable and says what was wrong. Pure: no import.meta, no
 * process.env, so node scripts and the browser can both call it.
 *
 * Two accepted forms: an absolute http(s) origin (optionally with a path), or a
 * root-relative path such as "/" for same-origin deployments.
 */
export function normalizeBaseUrl(raw) {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value) {
    throw new Error(
      `${BASE_URL_VAR} is not set. It is the address of the kehilapp API, ` +
        `e.g. https://api.example.com/ — the app cannot reach anything without it.`,
    );
  }

  // A root-relative path — "/" or "/some/prefix/" — means "same origin as the
  // page": the browser resolves `/api/messages` against wherever the site was
  // loaded from. This is what a deployment behind one reverse proxy wants, and
  // it is the ONLY form that lets a single built image serve any domain; an
  // absolute URL bakes the host into the bundle.
  //
  // The check does not enumerate disguises. Two merge gates in a row found one
  // each ("//host", then "/\host" — browsers read a backslash as a slash), and
  // the third would have been a tab or newline, which browsers strip before
  // parsing, so "/<TAB>/host" is "//host" too. Instead the value is resolved the
  // way a browser would, against a placeholder origin, and accepted only if it
  // is STILL on that origin. Any spelling that reaches another host — known or
  // not yet — fails the same test. The returned path is the parser's normalised
  // form, which is what the browser will use anyway.
  if (value.startsWith("/")) {
    const PLACEHOLDER = "http://same-origin.invalid";
    let resolved;
    try {
      resolved = new URL(value, PLACEHOLDER);
    } catch {
      throw new Error(
        `${BASE_URL_VAR}=${value} is not a path a browser can resolve.`,
      );
    }
    if (resolved.origin !== PLACEHOLDER) {
      throw new Error(
        `${BASE_URL_VAR}=${JSON.stringify(
          value,
        )} would be read by the browser as ` +
          `another host (${resolved.host}). Use "/" for same-origin, or a full ` +
          `https:// URL.`,
      );
    }
    if (resolved.search || resolved.hash) {
      throw new Error(
        `${BASE_URL_VAR}=${value} has a query or fragment; endpoints are appended ` +
          `after it, so it must end at the path.`,
      );
    }
    // The origin check above judges the VALUE. The consumer does not use the
    // value: it builds `${result}api/...` as a fresh string and hands that to
    // the browser. "/.//evil.com" passes the origin check (its dot segment is
    // removed and two empty segments are left), resolves to a pathname of
    // "//evil.com", and the fresh string "//evil.com/api/..." is a
    // protocol-relative URL — another host again. So the check that matters is
    // on the RESULT, exactly as it will be used.
    const result = resolved.pathname.replace(/\/+$/, "") + "/";
    if (new URL(`${result}api/probe`, PLACEHOLDER).origin !== PLACEHOLDER) {
      throw new Error(
        `${BASE_URL_VAR}=${JSON.stringify(value)} resolves to the path ` +
          `${JSON.stringify(
            result,
          )}, which a browser would read as another host ` +
          `once an endpoint is appended. Use "/" for same-origin.`,
      );
    }
    return result;
  }

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(
      `${BASE_URL_VAR}=${value} is not an absolute URL. Include the scheme, ` +
        `e.g. https://api.example.com/ — or use "/" for same-origin.`,
    );
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`${BASE_URL_VAR}=${value} must be http or https.`);
  }
  // A query or fragment would land in the middle of every endpoint path.
  if (parsed.search || parsed.hash) {
    throw new Error(
      `${BASE_URL_VAR}=${value} has a query or fragment; endpoints are appended ` +
        `after it, so it must end at the path.`,
    );
  }

  // Return the PARSED form, not the typed one. They differ in ways that matter:
  // `https:\\api.example.com\` passes `new URL()` (backslashes read as slashes)
  // but, returned as typed, its trailing backslash is not a slash, so the app
  // requested `https://api.example.com//api/messages` (found by the merge gate,
  // reproduced). The parsed form also lower-cases the scheme and host.
  parsed.pathname = parsed.pathname.replace(/\/+$/, "") + "/";
  return parsed.href;
}
