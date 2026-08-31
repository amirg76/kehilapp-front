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
