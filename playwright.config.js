import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for the user app.
 *
 * The a11y suite serves the production build and runs axe against it — it needs
 * no backend, so it runs anywhere (CI included). The flow suite (login → create →
 * see) needs the API and Mongo running; point E2E_BASE_URL at a live stack and
 * run with `--grep @flow`.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Serve the built app for the a11y suite. Skipped when E2E_BASE_URL is set
  // (you already have a live stack).
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run preview -- --port 4173',
        url: 'http://localhost:4173',
        timeout: 60000,
        reuseExistingServer: true,
      },
});
