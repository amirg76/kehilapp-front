import { test, expect } from '@playwright/test';

/**
 * Desktop scrolling with a classic scrollbar (22.11.2026).
 *
 * Windows Chrome draws a scrollbar that takes room (15px). Playwright hides it
 * by default, which is why the sideways scroll below was never seen in tests:
 * the app root was `w-screen` (100vw = the window INCLUDING the bar), so any
 * page with a vertical scrollbar was 15px wider than the room left for it.
 * Measured on the live site: home, login and register all scrolled sideways.
 */
test.use({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } });

const CATEGORY = { _id: 'c'.repeat(24), title: 'הודעות כלליות', categoryColor: '#2563EB' };

async function mockApi(page) {
  await page.route('**/api/**', (route) => {
    const { pathname } = new URL(route.request().url());
    const json = (status, body) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    if (pathname.endsWith('/api/auth/me')) return json(401, { message: 'Unauthorized' });
    if (pathname.endsWith('/api/categories')) return json(200, [CATEGORY]);
    if (pathname.includes('/api/categories/')) return json(200, CATEGORY);
    if (pathname.includes('/api/messages')) return json(200, []);
    return json(200, []);
  });
}

const scroll = (page) =>
  page.evaluate(() => {
    const de = document.documentElement;
    return {
      bar: innerWidth - de.clientWidth,
      sideways: de.scrollWidth - de.clientWidth,
      vertical: de.scrollHeight - de.clientHeight,
    };
  });

for (const [path, ready] of [
  ['/', (page) => page.getByRole('banner')],
  ['/login', (page) => page.getByRole('button', { name: 'כניסה לחשבון' })],
  ['/register', (page) => page.getByRole('button', { name: 'הרשמה' })],
]) {
  test(`${path}: a vertical scrollbar does not also bring a sideways one`, async ({ page }) => {
    // Short window, so the page needs a vertical scrollbar.
    await page.setViewportSize({ width: 1366, height: 400 });
    await mockApi(page);
    await page.goto(path);
    await expect(ready(page)).toBeVisible();
    const s = await scroll(page);
    // Preconditions, so this cannot pass by not reproducing the setup:
    // the scrollbar takes room, and the page does scroll vertically.
    expect(s.bar, 'classic scrollbar width').toBeGreaterThan(0);
    expect(s.vertical, 'page scrolls vertically').toBeGreaterThan(0);
    expect(s.sideways, 'sideways scroll').toBe(0);
  });
}

test('the register form fits a desktop window without scrolling', async ({ page }) => {
  // 1920x1080 screen minus the browser's tabs and the taskbar is about 950;
  // 900 leaves room for a bookmarks bar. The form was 991px tall.
  await page.setViewportSize({ width: 1920, height: 900 });
  await mockApi(page);
  await page.goto('/register');
  await expect(page.getByRole('button', { name: 'הרשמה' })).toBeVisible();
  await expect(page.getByTestId('link-to-login')).toBeVisible();
  const s = await scroll(page);
  expect(s.vertical, 'vertical scroll').toBe(0);
  expect(s.sideways, 'sideways scroll').toBe(0);
});
