# Hardening notes — kehilapp-front

What changed during the security pass, and why. Nothing about the app's features
changed; this is all defensive.

## 1. Stored-XSS in message rendering (fixed)

`src/features/messages/components/TextPreview/TextPreview.jsx` rendered message
bodies as raw HTML via `html-react-parser`, with no sanitisation.

**Verified, not assumed.** Rendering three payloads through the real
`html-react-parser` + React pipeline:

| payload | result |
|---|---|
| `<img onerror=...>` | React strips it — not exploitable |
| `<script>...</script>` | React does not execute injected scripts — not exploitable |
| `<a href="javascript:...">` | **survives — runs on click** |

The `javascript:` link is the live vector. Combined with the auth token living
in `localStorage`, a click on a malicious message could steal the token.

**Fix:** every message body is now passed through **DOMPurify** before any
styling or parsing, with an allowlist of formatting tags and a URL scheme filter
(`http/https/mailto/tel` only). Verified that the `javascript:` link, `onerror`,
and `<script>` are all neutralised while legitimate links and formatting survive.

## 2. Dependency vulnerabilities (reduced)

`npm audit`: **31 → 9** (2 critical → 0, 18 high → 3). The 2 criticals and the
runtime highs (axios, react-router-dom) are fixed. The 3 remaining highs are all
in **build-only tooling** (vite, path-to-regexp, router) that never ships to the
browser — advisory, not user-facing.

## Known, still open

- **Token in `localStorage`** (`src/lib/axios.js`). This is exposed to any XSS.
  The robust fix is httpOnly cookies, which needs backend + CSRF work — a
  separate task. Closing the XSS above removes the realistic exploit path for now.
- **ESLint config drift** — the forced dependency upgrade left the old `.eslintrc`
  incompatible with the new ESLint. The build passes; the lint script needs a
  config refresh (same fix as the backend: flat config or parserOptions update).

## 3. Working ESLint config + accessibility linting (added)

The repo had a lint script but no config file, so linting had never run. Added a
working `.eslintrc.cjs` wiring up the plugins that were already installed —
including `jsx-a11y` (accessibility) and `eslint-plugin-security`.

Running it surfaced and fixed real bugs:
- **Dead, broken `src/lib/axios.js`** — missing `import axios`, undeclared `api`,
  exported nothing; nothing imported it. Deleted.
- **Conditional React hooks** in `useFormattedDate.js` — an early `return` before
  `useState`/`useEffect`, which crashes React when the argument flips truthy.
  Fixed by always running the hooks and guarding inside the effect.
- Two `switch` fall-throughs, an SVG typo (`stroklinecap`), and decorative `<h1>`
  loading bars using heading semantics — all corrected.

Result: **0 lint errors** (94 warnings tracked — mostly interactive-element a11y
debt to fix incrementally). `npm run lint` passes.

## 4. Playwright E2E + axe accessibility (added)

- `npm run test:a11y` — serves the production build and runs axe-core against it.
  No backend needed; runs in CI.
- `npm run test:e2e` — includes a `@flow` login→post→see spec that needs a live
  API + Mongo (point `E2E_BASE_URL` at a running stack).

The a11y scan found and we fixed a real **serious** WCAG violation: the header
logo linked to home with an empty `alt`, giving screen-reader users an unlabeled
link. All logo alts are now meaningful Hebrew text; the scan passes.

## 5. Startup crash on missing env (fixed)

The app threw `VITE_REACT_APP_BASE_URL is not defined` and white-screened when the
env var was absent, with no `.env.example` to document it. Added `.env.example`.

## 6. Session moved to an httpOnly cookie (done)

The token used to live in `localStorage`, readable by any script — so an XSS
could lift it. It now rides in an **httpOnly cookie** the browser sends
automatically (`withCredentials: true`), which page script — and therefore an
XSS — cannot read.

Because a cookie is sent automatically, CSRF defence was added: the backend also
sets a readable `csrfToken` cookie, and `httpService` echoes it in an
`X-CSRF-Token` header on every mutating request (double-submit). The backend
rejects a cookie-authenticated mutation whose header doesn't match.

Verified in a real browser against the live backend (`e2e/cookieSecurity.spec.js`):
`document.cookie` exposes the CSRF token but NOT the auth token; the cookie alone
authenticates a GET; a mutation without the CSRF header is rejected (403). The
JWT is no longer stored in `localStorage` anywhere.
