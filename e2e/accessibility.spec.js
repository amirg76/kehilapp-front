import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility scan with axe-core.
 *
 * Runs against the served production build, no backend required. Fails on
 * serious/critical WCAG violations — the ones that actually block a screen-reader
 * or keyboard user. Moderate/minor issues are reported but not failed, so the
 * gate is meaningful rather than noisy.
 */
test('login page has no serious accessibility violations @a11y', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  const serious = results.violations.filter((v) =>
    ['serious', 'critical'].includes(v.impact),
  );

  // Human-readable failure: list each violation and one element it hit.
  if (serious.length) {
    const summary = serious
      .map((v) => `  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`)
      .join('\n');
    console.log(`\nSerious a11y violations:\n${summary}\n`);
  }

  expect(serious, 'serious/critical WCAG violations').toEqual([]);
});

// The auth screens were never scanned ("/" above redirects to the board). Added
// with the back link (22.11.2026): its first colour, primary-700 on the page's
// #EFEFEF, was 4.35:1, under the 4.5:1 that 14px text needs. Both themes,
// because each has its own colours.
for (const path of ['/login', '/register', '/verify-email']) {
  for (const theme of ['light', 'dark']) {
    test(`${path} (${theme}) has no serious accessibility violations @a11y`, async ({ page }) => {
      await page.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch { /* private mode */ } }, theme);
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await expect(page.getByTestId('back-to-board')).toBeVisible();

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      const serious = results.violations.filter((v) =>
        ['serious', 'critical'].includes(v.impact),
      );
      if (serious.length) {
        const summary = serious
          .map((v) => `  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s)) e.g. ${v.nodes[0].target}`)
          .join('\n');
        console.log(`\n${path} ${theme} serious a11y violations:\n${summary}\n`);
      }
      expect(serious, 'serious/critical WCAG violations').toEqual([]);
    });
  }
}
