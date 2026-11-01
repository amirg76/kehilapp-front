// The service worker must never store an error response. Regression test for
// the white page of 29.10–1.11.2026: a 404 cached for the JS bundle was served
// cache-first forever, so the fixed server was never asked again.
//
// Runs against the preview server the Playwright config starts (production
// build, so /sw.js and /assets/ exist). Browser: chromium (service workers).
import { test, expect } from "@playwright/test";

const ready = (page) =>
  page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready;
    return !!reg.active;
  });

const cacheNames = (page) => page.evaluate(() => caches.keys());

test("asset 404 is not stored by the service worker", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "service workers: chromium only");
  await page.goto("/");
  expect(await ready(page)).toBe(true);

  // A bundle-shaped path that does not exist → the server answers 404.
  const missing = "/assets/does-not-exist-00000000.js";
  const status = await page.evaluate(
    (p) => fetch(p).then((r) => r.status),
    missing
  );
  expect(status).toBe(404);

  const stored = await page.evaluate(async (p) => {
    const names = await caches.keys();
    for (const n of names) {
      const hit = await (await caches.open(n)).match(p);
      if (hit) return hit.status;
    }
    return null;
  }, missing);
  expect(stored).toBeNull();
});

test("a successful asset is stored, and v3 is the only cache", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "service workers: chromium only");
  await page.goto("/");
  expect(await ready(page)).toBe(true);
  // The bundle the page itself loaded.
  const bundle = await page.evaluate(() =>
    [...document.scripts].filter((s) => s.src).map((s) => new URL(s.src).pathname).find((p) => p.startsWith("/assets/"))
  );
  expect(bundle).toBeTruthy();
  // Fetch it through the worker once more so the cache-first branch runs.
  await page.evaluate((p) => fetch(p).then((r) => r.status), bundle);
  await page.waitForTimeout(300);
  const names = await cacheNames(page);
  expect(names).toEqual(["kehilapp-shell-v3"]);
  const stored = await page.evaluate(async (p) => {
    const hit = await (await caches.open("kehilapp-shell-v3")).match(p);
    return hit ? hit.status : null;
  }, bundle);
  expect(stored).toBe(200);
});
