import { test, expect } from '@playwright/test';

/**
 * "Forgot password" (25.11.2026): the login page links to it, the request page
 * answers every address with the same conditional message, and the reset page
 * sends the token with the new password only on submit. The API is simulated;
 * the server's side is covered by the backend's passwordReset.int.test.js.
 */
const TOKEN = 'b'.repeat(64);
const CATEGORY = { _id: 'c'.repeat(24), title: 'הודעות כלליות', categoryColor: '#2563EB' };

async function mockApi(page, { forgot = [], reset = [] } = {}) {
  const bodies = { forgot: [], reset: [] };
  await page.route('**/api/**', async (route) => {
    const req = route.request();
    const { pathname } = new URL(req.url());
    const json = (status, body) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    if (pathname.endsWith('/api/auth/forgot-password')) {
      bodies.forgot.push(req.postDataJSON());
      const [status, body] = forgot.shift() ?? [200, { ok: true }];
      return json(status, body);
    }
    if (pathname.endsWith('/api/auth/reset-password')) {
      bodies.reset.push(req.postDataJSON());
      const [status, body] = reset.shift() ?? [500, { error: 'unexpected' }];
      return json(status, body);
    }
    if (pathname.endsWith('/api/auth/me')) return json(401, { message: 'Unauthorized' });
    if (pathname.endsWith('/api/categories')) return json(200, [CATEGORY]);
    return json(200, []);
  });
  return bodies;
}

test('the login page links to "forgot password"', async ({ page }) => {
  await mockApi(page);
  await page.goto('/login');
  await page.getByRole('link', { name: 'שכחת את הסיסמה?' }).click();
  await expect(page).toHaveURL(/\/forgot-password$/);
  await expect(page.getByRole('heading', { name: 'שכחת את הסיסמה?' })).toBeVisible();
});

test('the request sends the typed address and shows the same conditional message', async ({ page }) => {
  const bodies = await mockApi(page);
  await page.goto('/forgot-password');
  await page.getByLabel('אימייל').fill('someone@example.com');
  await page.getByRole('button', { name: 'שליחת קישור' }).click();
  await expect(page.getByText('אם הכתובת רשומה באתר ואומתה, שלחנו אליה קישור')).toBeVisible();
  expect(bodies.forgot).toEqual([{ email: 'someone@example.com' }]);
});

test('a 429 on the request says to wait', async ({ page }) => {
  await mockApi(page, { forgot: [[429, { error: 'Too many requests' }]] });
  await page.goto('/forgot-password');
  await page.getByLabel('אימייל').fill('someone@example.com');
  await page.getByRole('button', { name: 'שליחת קישור' }).click();
  await expect(page.getByText('יותר מדי בקשות')).toBeVisible();
});

test('the reset page sends nothing on load and needs two matching passwords', async ({ page }) => {
  const bodies = await mockApi(page);
  await page.goto(`/reset-password?token=${TOKEN}`);
  const save = page.getByRole('button', { name: 'שמירת הסיסמה' });
  await page.getByLabel('סיסמה חדשה').fill('new-password-1');
  await page.getByLabel('הסיסמה שוב').fill('new-password-2');
  await expect(page.getByText('הסיסמאות אינן זהות')).toBeVisible();
  await expect(save).toBeDisabled();
  await page.waitForTimeout(300);
  expect(bodies.reset).toHaveLength(0);
});

test('a good link saves the new password with the token', async ({ page }) => {
  const bodies = await mockApi(page, { reset: [[200, { ok: true }]] });
  await page.goto(`/reset-password?token=${TOKEN}`);
  await page.getByLabel('סיסמה חדשה').fill('new-password-1');
  await page.getByLabel('הסיסמה שוב').fill('new-password-1');
  await page.getByRole('button', { name: 'שמירת הסיסמה' }).click();
  await expect(page.getByText('הסיסמה הוחלפה')).toBeVisible();
  expect(bodies.reset).toEqual([{ token: TOKEN, password: 'new-password-1' }]);
});

test('a used or expired link offers a new one', async ({ page }) => {
  await mockApi(page, { reset: [[400, { error: 'Invalid or expired reset token.' }]] });
  await page.goto(`/reset-password?token=${TOKEN}`);
  await page.getByLabel('סיסמה חדשה').fill('new-password-1');
  await page.getByLabel('הסיסמה שוב').fill('new-password-1');
  await page.getByRole('button', { name: 'שמירת הסיסמה' }).click();
  await expect(page.getByText('הקישור לא עובד')).toBeVisible();
  await page.getByRole('button', { name: 'לבקש קישור חדש' }).click();
  await expect(page).toHaveURL(/\/forgot-password$/);
});
