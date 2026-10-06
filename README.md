# Kehilapp — resident app

[![CI](https://github.com/amirg76/kehilapp-front/actions/workflows/ci.yml/badge.svg)](https://github.com/amirg76/kehilapp-front/actions/workflows/ci.yml)

A Hebrew, right-to-left community notice board: residents read, search and post
categorised messages, and the community's admins decide who sees what.

**Live demo:** coming soon — see [kehilapp-devops](https://github.com/amirg76/kehilapp-devops).

## Why it exists

After October 7th the Kibbutz Kissufim community was evacuated to a Dead Sea
hotel, and every important notice drowned in WhatsApp groups. This app was
built in 2024 by a volunteer team (with two senior developers and a product
manager from the AppleSeeds / Tapuach nonprofit accompanying it) to turn that
stream into browsable categories. It ran as a pilot and was not taken to
production.

In August–October 2026 it was rebuilt and hardened as a portfolio project: the
security work, the tests and the CI below are from that pass.
[`HARDENING.md`](HARDENING.md) tells the security story, finding by finding.

## What is notable

- **Session in an httpOnly cookie, with CSRF double-submit.** The browser sends
  the cookie; page script cannot read it, so an XSS cannot steal the session.
  Every mutating request echoes the readable `csrfToken` cookie in an
  `X-CSRF-Token` header, and the server rejects a mismatch.
- **Three layers on user-supplied text:** DOMPurify on message bodies (tag
  allowlist + `http/https/mailto/tel` only), a URL-safety filter on links, and
  stripping of Unicode bidi control characters (the `invoice<RLO>gnp.exe` trick)
  from every title, name and attachment name.
- **Email verification** on sign-up, and **three visibility tiers:** public
  (anonymous visitors), pending (verified, awaiting an admin's approval) and
  member (approved).
- **Dark mode** (class-based Tailwind) and an installable **PWA** with an
  offline shell.
- **Playwright + axe-core** accessibility probes, plus browser flows for login,
  approval and cookie security (those need a live backend).
- **CI on every pull request:** `npm run lint` (0 errors), `npm run check`
  (307 assertions across six standalone scripts: URL safety, HTML rendering,
  password policy, email policy, bidi text, API base URL) and a production
  build.

## Stack

React 18 + Vite · Tailwind CSS · Redux Toolkit · React Query · React Router ·
Quill (rich text) · DOMPurify · Playwright + axe-core

## Running it

```bash
cp .env.example .env          # then set VITE_REACT_APP_BASE_URL
npm ci
npm run dev -- --port 5180
```

The app needs the API from [kehilapp-backend](https://github.com/amirg76/kehilapp-backend)
running on port 5001.

`VITE_REACT_APP_BASE_URL` is the API's base URL and is baked into the bundle at
build time. Two forms are accepted:

- an absolute origin, e.g. `http://localhost:5001/` for local development;
- `/` — "same origin as the page", for a deployment where one reverse proxy
  serves both the app and the API (this is how the devops repo deploys it).

Without a valid value the build refuses, instead of producing a site that
loads blank.

Useful scripts:

| command | what it does |
|---|---|
| `npm run lint` | ESLint incl. `jsx-a11y` and `eslint-plugin-security`; `no-console` is an error in app code |
| `npm run check` | the six standalone check scripts, no browser or backend needed |
| `npm run build` | production build into `build/` |
| `npm run test:a11y` | serves the build and runs axe-core against it |
| `npm run test:e2e` | all Playwright flows; point `E2E_BASE_URL` at a live stack |

## The other repos

| repo | role |
|---|---|
| [kehilapp-backend](https://github.com/amirg76/kehilapp-backend) | Node + Express REST API, MongoDB, sessions and approval logic |
| [kehilapp-admin](https://github.com/amirg76/kehilapp-admin) | admin dashboard: approve users, manage categories and messages |
| [kehilapp-devops](https://github.com/amirg76/kehilapp-devops) | Docker images, reverse proxy and deployment |

## Credits

Built in 2024 by Amir Gilboa (full-stack), Dafna Bashan and Samir Khoury, with
the AppleSeeds (Tapuach) nonprofit. Rebuilt and hardened in 2026 by Amir Gilboa.

© Amir Gilboa
