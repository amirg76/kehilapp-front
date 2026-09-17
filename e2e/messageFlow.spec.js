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
  // Sidebar compose buttons and the background search box (also a textbox).
  const dialog = page.getByRole('dialog');

  // The form requires a category and a title (2-25 chars) before the submit
  // button becomes enabled -- the previous version of this test never filled
  // either, so the submit click below always no-opped on a disabled button.
  await dialog.getByRole('combobox').selectOption({ index: 1 });
  await dialog.getByRole('textbox').fill(`E2E ${Date.now()}`);

  // The message body is a Quill rich-text editor (react-quill): its
  // `.ql-editor` region is `contenteditable`, not a real <textarea>, and
  // Quill does not give it an ARIA role, so `getByRole('textbox')` never
  // matches it -- it only ever matched the title field above (the sole real
  // textbox in the form). That's a second, independent test defect: even
  // with the compose button reachable, the old locator could never have
  // filled the real message body. Playwright's `.fill()` does support
  // `contenteditable` elements directly.
  await dialog.locator('.ql-editor').fill(body);

  // The "שלח" (send) button shares a data-testid pattern with the compose
  // button above for the same reason: a broad name regex like
  // /send|publish|שלח|פרסם|הוסף/ also matches this form's "הוסף קובץ" (add
  // file) control, which sits earlier in the DOM -- `.first()` clicked the
  // file picker, not send, and the click "succeeded" (the file button isn't
  // disabled) while silently never submitting the message.
  await page.getByTestId('message-submit-button').click();

  // The message appears in the feed.
  await expect(page.getByText(body)).toBeVisible();
});
