import { test, expect } from '@playwright/test';

/**
 * The verify page asks for the password chosen at registration (24.11.2026).
 *
 * It used to verify the moment it opened, from the link alone. A stranger
 * could register first with a resident's address and the stranger's own
 * password; the resident, clicking a genuine "verify" email, activated that
 * account and the stranger logged in as them. The server now refuses a verify
 * without the matching password (403). This checks the page's side: nothing
 * is sent on load, the password goes with the token, and each answer shows the
 * right screen.
 *
 * The API is simulated; the server's side is covered by the backend's
 * accountEnumeration.int.test.js.
 */
const TOKEN = 'a'.repeat(64);
const CATEGORY = { _id: 'c'.repeat(24), title: 'הודעות כלליות', categoryColor: '#2563EB' };

async function mockApi(page, verifyAnswers) {
  const verifyBodies = [];
  await page.route('**/api/**', async (route) => {
    const req = route.request();
    const { pathname } = new URL(req.url());
    const json = (status, body) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    if (pathname.endsWith('/api/auth/verify-email')) {
      verifyBodies.push(req.postDataJSON());
      const [status, body] = verifyAnswers.shift() ?? [500, { error: 'unexpected' }];
      return json(status, body);
    }
    if (pathname.endsWith('/api/auth/me')) return json(401, { message: 'Unauthorized' });
    if (pathname.endsWith('/api/categories')) return json(200, [CATEGORY]);
    return json(200, []);
  });
  return verifyBodies;
}

test('sends nothing on load, and asks for the password', async ({ page }) => {
  const bodies = await mockApi(page, []);
  await page.goto(`/verify-email?token=${TOKEN}`);
  await expect(page.getByLabel('סיסמה')).toBeVisible();
  await expect(page.getByRole('button', { name: 'אימות החשבון' })).toBeDisabled();
  // Give an on-load request every chance to happen.
  await page.waitForTimeout(500);
  expect(bodies).toHaveLength(0);
});

test('a wrong password says so and keeps the form; the right one verifies', async ({ page }) => {
  const bodies = await mockApi(page, [
    [403, { error: 'Wrong password for this account.' }],
    [200, { ok: true, emailVerified: true }],
  ]);
  await page.goto(`/verify-email?token=${TOKEN}`);

  await page.getByLabel('סיסמה').fill('wrong-password-1');
  await page.getByRole('button', { name: 'אימות החשבון' }).click();
  await expect(page.getByText('הסיסמה לא תואמת לסיסמה שנבחרה בהרשמה')).toBeVisible();
  await expect(page.getByLabel('סיסמה')).toBeVisible();

  await page.getByLabel('סיסמה').fill('right-password-1');
  await page.getByRole('button', { name: 'אימות החשבון' }).click();
  await expect(page.getByText('המייל אומת בהצלחה!')).toBeVisible();

  expect(bodies).toEqual([
    { token: TOKEN, password: 'wrong-password-1' },
    { token: TOKEN, password: 'right-password-1' },
  ]);
});

test('an invalid or expired link shows the failure screen', async ({ page }) => {
  await mockApi(page, [[400, { error: 'Invalid or expired verification token.' }]]);
  await page.goto(`/verify-email?token=${TOKEN}`);
  await page.getByLabel('סיסמה').fill('some-password-1');
  await page.getByRole('button', { name: 'אימות החשבון' }).click();
  await expect(page.getByText('האימות נכשל')).toBeVisible();
  await expect(page.getByRole('button', { name: 'מעבר להתחברות' })).toBeVisible();
});

test('the "register again" way out leads to the register page', async ({ page }) => {
  await mockApi(page, []);
  await page.goto(`/verify-email?token=${TOKEN}`);
  await page.getByRole('button', { name: 'להירשם שוב עם אותה כתובת' }).click();
  await expect(page).toHaveURL(/\/register$/);
});
