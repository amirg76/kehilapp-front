import { test, expect } from '@playwright/test';

/**
 * Browser-level proof of the cookie security property, against the live backend.
 *
 * This does NOT depend on the app's routing/UI — it logs in through the real API
 * from within a real browser page and asserts what JavaScript can and cannot see.
 * That is exactly the property that matters: an XSS running as page script must
 * not be able to read the session token.
 *
 * Needs the live stack: E2E_API=http://localhost:5001 (default) with demo data.
 */
const API = process.env.E2E_API || 'http://localhost:5001';
const EMAIL = process.env.E2E_EMAIL || 'admin@demo.example.com';
const PASSWORD = process.env.E2E_PASSWORD || 'demo-password-1234';

test('auth cookie is httpOnly and unreadable by page script @cookie', async ({ page }) => {
  await page.goto('/');

  // Log in via the real API from inside the browser (credentials: include stores cookies).
  const login = await page.evaluate(
    async ({ api, email, password }) => {
      const r = await fetch(`${api}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      return { status: r.status, body: await r.json() };
    },
    { api: API, email: EMAIL, password: PASSWORD },
  );
  expect(login.status).toBe(200);
  expect(login.body.csrfToken).toBeTruthy();

  // The critical assertion: document.cookie exposes the CSRF token but NOT the
  // auth token. httpOnly means an XSS cannot lift the session out of the page.
  const readable = await page.evaluate(() => document.cookie);
  expect(readable).toContain('csrfToken=');
  expect(readable).not.toContain(login.body.token); // the JWT is not visible
  expect(readable).not.toMatch(/(^|;\s*)token=/); // no readable auth cookie at all

  // And the cookie alone authenticates a follow-up request (no Authorization header).
  const me = await page.evaluate(
    async ({ api }) => {
      const r = await fetch(`${api}/api/messages`, { credentials: 'include' });
      return r.status;
    },
    { api: API },
  );
  expect(me).toBe(200);

  // A mutating request needs the CSRF header — without it the backend rejects.
  const noCsrf = await page.evaluate(
    async ({ api }) => {
      const r = await fetch(`${api}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ categoryId: 'c', title: 'no csrf' }),
      });
      return r.status;
    },
    { api: API },
  );
  expect(noCsrf).toBe(403);
});
