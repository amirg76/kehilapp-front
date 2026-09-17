import { test, expect } from '@playwright/test';

/**
 * End-to-end happy path: sign in, post a message, see it in the list.
 *
 * Tagged @flow because it needs a live API + Mongo. Run it against a running
 * stack: E2E_BASE_URL=http://localhost:5173 npx playwright test --grep @flow
 * with demo credentials seeded (scripts/seedDemo.js on the backend).
 */
const DEMO_EMAIL = process.env.E2E_EMAIL || 'admin@demo.example.com';
// No default: the backend seed stopped shipping a password literal, so it now
// either takes one from the environment or generates and prints one. A stale
// default here would fail as a wrong password rather than as a missing setting.
const DEMO_PASSWORD = process.env.E2E_PASSWORD;

test('sign in, post a message, and see it @flow', async ({ page }) => {
  test.skip(!DEMO_PASSWORD, 'set E2E_PASSWORD to the seeded admin password');

  // '/' is the board, not the sign-in screen -- the form lives on /login.
  await page.goto('/login');

  // Sign in.
  await page.getByLabel(/email|אימייל|מייל/i).fill(DEMO_EMAIL);
  await page.getByLabel(/password|סיסמ/i).fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: /log ?in|התחבר|כניסה/i }).click();

  // A unique body so we can find exactly our message afterward.
  const body = `בדיקת E2E ${Date.now()}`;

  // Open the composer. The board renders two Sidebar instances: the in-page
  // one used here, and a second copy inside the header's mobile drawer that
  // stays mounted (off-canvas via `translate-x(-100%)`) even at desktop
  // widths. Both carry an identically-labelled "הוסף הודעה" button, so a
  // broad role+name locator matches the drawer's copy first -- it is
  // "visible" by CSS (not display:none/hidden) but permanently outside the
  // viewport, which is exactly the "visible, enabled and stable" / "outside
  // of the viewport" timeout this test used to hit. A stable data-testid
  // (Sidebar.jsx's `variant` prop) disambiguates the two without depending
  // on DOM order or copy.
  await page.getByTestId('sidebar-compose-page').click();

  // From here everything lives inside the compose modal (a headlessui
  // Dialog, role="dialog"). Scoping to it avoids matching the still-mounted
  // Sidebar compose buttons (their label contains "הוסף", which also matches
  // the send-button regex) and the background search box (also a textbox).
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox').last().fill(body);
  await dialog.getByRole('button', { name: /send|publish|שלח|פרסם|הוסף/i }).first().click();

  // The message appears in the feed.
  await expect(page.getByText(body)).toBeVisible();
});
