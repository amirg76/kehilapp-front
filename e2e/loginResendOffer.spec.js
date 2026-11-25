import { test, expect } from '@playwright/test';

/**
 * A refused login offers "send the verification email again" (25.11.2026).
 *
 * The server used to answer an unverified account 403 "not verified", and that
 * told a stranger who is a verified member. It now answers 401, the same as a
 * wrong password, so the page cannot tell the two apart and offers the resend
 * after every 401. The API is simulated; the server's side is covered by the
 * backend's accountEnumeration.int.test.js.
 */
const CATEGORY = { _id: 'c'.repeat(24), title: 'הודעות כלליות', categoryColor: '#2563EB' };

async function mockApi(page) {
  const resendBodies = [];
  await page.route('**/api/**', async (route) => {
    const req = route.request();
    const { pathname } = new URL(req.url());
    const json = (status, body) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    if (pathname.endsWith('/api/auth/login')) return json(401, { error: 'Unauthorized' });
    if (pathname.endsWith('/api/auth/resend-verification')) {
      resendBodies.push(req.postDataJSON());
      return json(200, { ok: true, message: 'If the address exists and is unverified, a verification email has been sent.' });
    }
    if (pathname.endsWith('/api/auth/me')) return json(401, { message: 'Unauthorized' });
    if (pathname.endsWith('/api/categories')) return json(200, [CATEGORY]);
    return json(200, []);
  });
  return resendBodies;
}

test('a 401 shows the error and offers the resend, which sends the typed address', async ({ page }) => {
  const resendBodies = await mockApi(page);
  await page.goto('/login');
  await page.getByLabel('אימייל').fill('someone@example.com');
  await page.getByLabel('סיסמה').fill('some-password-1');
  await page.getByRole('button', { name: 'כניסה לחשבון' }).click();

  await expect(page.getByText('האימייל או הסיסמה שגויים')).toBeVisible();
  await expect(page.getByText('נרשמת ועוד לא אימתת את המייל?')).toBeVisible();

  await page.getByRole('button', { name: 'שלח מייל אימות שוב' }).click();
  await expect(page.getByText('אם הכתובת רשומה ועוד לא אומתה, שלחנו אליה מייל אימות חדש')).toBeVisible();
  expect(resendBodies).toEqual([{ email: 'someone@example.com' }]);
});

test('the resend offer is not shown before any login attempt', async ({ page }) => {
  await mockApi(page);
  await page.goto('/login');
  await expect(page.getByLabel('סיסמה')).toBeVisible();
  await expect(page.getByRole('button', { name: 'שלח מייל אימות שוב' })).toHaveCount(0);
});
