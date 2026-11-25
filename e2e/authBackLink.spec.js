import { test, expect } from '@playwright/test';

/**
 * A way back to the board from the auth screens (22.11.2026).
 *
 * Login, register and verify-email hide the app header, so before this a
 * visitor who opened one of them (or arrived from an email link, with no page
 * to go "back" to) could only reach the public board with the browser's back
 * button. Each screen now has a "חזרה ללוח ההודעות" link, and the logo leads
 * there too.
 */
const CATEGORY = { _id: 'c'.repeat(24), title: 'הודעות כלליות', categoryColor: '#2563EB' };

async function mockApi(page) {
  await page.route('**/api/**', (route) => {
    const { pathname } = new URL(route.request().url());
    const json = (status, body) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    if (pathname.endsWith('/api/auth/me')) return json(401, { message: 'Unauthorized' });
    if (pathname.endsWith('/api/categories')) return json(200, [CATEGORY]);
    if (pathname.includes('/api/categories/')) return json(200, CATEGORY);
    return json(200, []);
  });
}

for (const path of ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password']) {
  test(`${path}: the back link leads to the message board`, async ({ page }) => {
    await mockApi(page);
    // Opened directly, as from an email: there is no history to go back to.
    await page.goto(path);
    const back = page.getByRole('link', { name: 'חזרה ללוח ההודעות' });
    await expect(back).toBeVisible();
    await back.click();
    await expect(page).toHaveURL(/\/messages$/);
    // The board, not another auth screen: its header is back.
    await expect(page.getByRole('banner')).toBeVisible();
  });

  test(`${path}: the logo leads to the message board too`, async ({ page }) => {
    await mockApi(page);
    await page.goto(path);
    await page.getByTestId('logo-to-board').click();
    await expect(page).toHaveURL(/\/messages$/);
  });
}

// axe does not judge text over a gradient (the auth pages' background), so it
// passed primary-700 at 4.35:1. Measure against the gradient's worst end:
// #EFEFEF at the top in light mode, slate-800 (#1e293b) in dark mode.
const luminance = (rgb) => {
  const [r, g, b] = rgb.map((v) => v / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
for (const [theme, worstBackground] of [['light', [0xef, 0xef, 0xef]], ['dark', [0x1e, 0x29, 0x3b]]]) {
  test(`the back link text has 4.5:1 contrast in ${theme} mode`, async ({ page }) => {
    await page.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch { /* private mode */ } }, theme);
    await mockApi(page);
    await page.goto('/login');
    const color = await page.getByTestId('back-to-board').evaluate((el) => getComputedStyle(el).color);
    const rgb = color.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
    expect(contrast(rgb, worstBackground), `${color} on ${worstBackground}`).toBeGreaterThanOrEqual(4.5);
  });
}

test('the back link does not make the phone login page scroll', async ({ page }) => {
  // With py-10 above it, the link pushed the login page 3-11px past an 844px
  // phone screen (measured 22.11.2026): a scroll for nothing.
  await page.setViewportSize({ width: 390, height: 844 });
  await mockApi(page);
  await page.goto('/login');
  await expect(page.getByTestId('back-to-board')).toBeVisible();
  const vertical = await page.evaluate(() => document.documentElement.scrollHeight - document.documentElement.clientHeight);
  expect(vertical).toBe(0);
});

test('the back link is reachable from the keyboard, the logo link is not a second stop', async ({ page }) => {
  await mockApi(page);
  await page.goto('/login');
  await expect(page.getByTestId('back-to-board')).toBeVisible();
  // The back link is the first thing Tab reaches on the page.
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('back-to-board')).toBeFocused();
  // The next Tab goes into the form, not to the logo (same target).
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('logo-to-board')).not.toBeFocused();
  await expect(page.getByLabel('אימייל')).toBeFocused();
});
