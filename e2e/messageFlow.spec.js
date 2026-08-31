import { test, expect } from '@playwright/test';

/**
 * End-to-end happy path: sign in, post a message, see it in the list.
 *
 * Tagged @flow because it needs a live API + Mongo. Run it against a running
 * stack: E2E_BASE_URL=http://localhost:5173 npx playwright test --grep @flow
 * with demo credentials seeded (scripts/seedDemo.js on the backend).
 */
const DEMO_EMAIL = process.env.E2E_EMAIL || 'admin@demo.example.com';
const DEMO_PASSWORD = process.env.E2E_PASSWORD || 'demo-password-1234';

test('sign in, post a message, and see it @flow', async ({ page }) => {
  await page.goto('/');

  // Sign in.
  await page.getByLabel(/email|אימייל|מייל/i).fill(DEMO_EMAIL);
  await page.getByLabel(/password|סיסמ/i).fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: /log ?in|התחבר|כניסה/i }).click();

  // A unique body so we can find exactly our message afterward.
  const body = `בדיקת E2E ${Date.now()}`;

  // Open the composer, write, submit. Selectors are intentionally forgiving
  // (role + accessible name) so small copy changes don't break the test.
  await page.getByRole('button', { name: /new|הוסף|כתוב|הודעה/i }).first().click();
  await page.getByRole('textbox').last().fill(body);
  await page.getByRole('button', { name: /send|publish|שלח|פרסם|הוסף/i }).first().click();

  // The message appears in the feed.
  await expect(page.getByText(body)).toBeVisible();
});
