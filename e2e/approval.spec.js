import { test, expect } from '@playwright/test';

/**
 * End-to-end proof of the approval tier: a freshly registered, email-verified
 * account can log in and see public content only, with a "waiting for
 * approval" banner — and the moment an admin approves it, a reload shows the
 * members-only tier and the banner is gone. No re-login required, because the
 * backend re-reads `approved` off the account on every /api/auth/me call.
 *
 * Tagged @approval. Needs a live API + Mongo, same as @flow/@cookie:
 *   E2E_BASE_URL=http://localhost:5173 npx playwright test --grep @approval
 *
 * Admin credentials: scripts/seedDemo.js no longer writes a password literal
 * into the repo — it takes DEMO_ADMIN_PASSWORD/DEMO_PASSWORD from the
 * environment, or prints a freshly generated one to stdout when neither is
 * set. This spec cannot guess that value, so it reads the SAME credentials
 * back out of the environment under its own names:
 *   E2E_ADMIN_EMAIL    (default: admin@demo.example.com, the seed's fixed address)
 *   E2E_ADMIN_PASSWORD (no default — must be passed in; whatever DEMO_ADMIN_PASSWORD
 *                        or DEMO_PASSWORD was set to when seedDemo.js ran, or the
 *                        generated password it printed)
 * The test is skipped, not failed, when E2E_ADMIN_PASSWORD is missing, since a
 * missing credential is a setup gap, not a product bug.
 */
const API = process.env.E2E_API || 'http://localhost:5001';
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || 'admin@demo.example.com';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD;

// A throwaway account this test owns end-to-end — its own password, not a
// shared/demo secret, so choosing a literal here does not conflict with the
// "no invented admin password" rule above.
const uniqueEmail = () => `approval-test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
const TEST_PASSWORD = 'ApprovalFlow123';

// Count of visible message cards, anchored on a stable per-card hook rather
// than every <h1> on the page (MessagePreview's <h1> is its title, but this
// project already has more than one h1 as a documented smell — counting all
// of them silently starts counting the wrong thing the moment that changes
// elsewhere). data-testid="message-card" is added on MessagePreview's root
// for exactly this.
const messageCardCount = (page) => page.getByTestId('message-card').count();

test('unapproved member sees public-only + pending banner; admin approval unlocks members tier @approval', async ({
  page,
  request,
}) => {
  test.skip(!ADMIN_PASSWORD, 'E2E_ADMIN_PASSWORD not set — see file header for what to provide.');

  const email = uniqueEmail();

  // 1. Register + verify via the API, from inside the page (same-origin fetch,
  // matching cookieSecurity.spec.js's pattern) so the flow exercises the real
  // network path rather than a Node-side HTTP client.
  await page.goto('/login');

  const registerResult = await page.evaluate(
    async ({ api, email, password }) => {
      const r = await fetch(`${api}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: 'Approval Test', email, password }),
      });
      return { status: r.status, body: await r.json() };
    },
    { api: API, email, password: TEST_PASSWORD },
  );
  expect(registerResult.status, JSON.stringify(registerResult.body)).toBe(201);
  expect(registerResult.body.approved).toBe(false);
  const verificationToken = registerResult.body.verificationToken;
  expect(verificationToken, 'dev mailer must return the token (see registration/mailer)').toBeTruthy();

  const verifyResult = await page.evaluate(
    async ({ api, token }) => {
      const r = await fetch(`${api}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token }),
      });
      return { status: r.status, body: await r.json() };
    },
    { api: API, token: verificationToken },
  );
  expect(verifyResult.status, JSON.stringify(verifyResult.body)).toBe(200);

  // 2. Log in through the real UI (verified-but-unapproved logs in normally —
  // 403 in LoginForm only means "email not verified", not "not approved").
  await page.getByLabel(/email|אימייל|מייל/i).fill(email);
  await page.getByLabel(/password|סיסמ/i).fill(TEST_PASSWORD);
  await page.getByRole('button', { name: /log ?in|התחבר|כניסה/i }).click();

  // 3. Pending state: the new banner is visible, no members-only card is
  // present, and the public-only card count is what's showing. The banner
  // renders above MessageList's loading branch, so waiting on it alone proves
  // nothing about whether the messages themselves have arrived — anchor on an
  // actual card the same way step 5 anchors on members-only content, so the
  // count below can't run before the data does.
  const pendingBanner = page.getByTestId('pending-approval-banner');
  await expect(pendingBanner).toBeVisible();
  await expect(page.getByText('🔒 לחברים בלבד')).toHaveCount(0);
  await expect(page.getByTestId('message-card').first()).toBeVisible();
  const publicCount = await messageCardCount(page);
  expect(publicCount).toBeGreaterThan(0);

  // 4. Out-of-band: log in as the seeded admin via the request fixture (its
  // own cookie jar, independent of the page's session) and approve the new
  // account. login's response body carries the CSRF token directly, so there
  // is no need to also parse it back out of a Set-Cookie header.
  const adminLogin = await request.post(`${API}/api/auth/login`, {
    data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  });
  expect(adminLogin.ok(), `admin login failed: ${adminLogin.status()} ${await adminLogin.text()}`).toBeTruthy();
  const adminBody = await adminLogin.json();
  const csrfToken = adminBody.csrfToken;
  expect(csrfToken).toBeTruthy();

  const usersList = await request.get(`${API}/api/users`);
  expect(usersList.ok(), `listing users failed: ${usersList.status()}`).toBeTruthy();
  const users = await usersList.json();
  const newUser = users.find((u) => u.email === email);
  expect(newUser, `registered account ${email} not found in /api/users`).toBeTruthy();

  // From here on the test owns a real, approved account in the shared
  // database whose password is a literal in this file. Clean it up (revoke
  // its approval — userRoutes.js exposes approve/revoke/role on users, no
  // delete) no matter how the rest of the test goes, using the admin session
  // already established above.
  try {
    const approveResult = await request.patch(`${API}/api/users/${newUser._id}/approve`, {
      headers: { 'X-CSRF-Token': csrfToken },
    });
    expect(approveResult.ok(), `approve failed: ${approveResult.status()} ${await approveResult.text()}`).toBeTruthy();
    const approveBody = await approveResult.json();
    expect(approveBody.approved).toBe(true);

    // 5. Reload the still-logged-in member's page — no re-login. App.jsx's /me
    // call on mount picks up the fresh `approved` flag and merges it in.
    await page.reload();

    // Wait for actual content, not network idle (react-query keeps polling /
    // background-refetching, which makes networkidle an unreliable signal in
    // this project).
    await expect(page.getByText('🔒 לחברים בלבד').first()).toBeVisible();
    await expect(pendingBanner).toHaveCount(0);
    const approvedCount = await messageCardCount(page);
    expect(approvedCount).toBeGreaterThan(publicCount);
  } finally {
    const revokeResult = await request.patch(`${API}/api/users/${newUser._id}/revoke`, {
      headers: { 'X-CSRF-Token': csrfToken },
    });
    if (!revokeResult.ok()) {
      // Don't let cleanup failure mask the real assertion failure (if any),
      // but don't stay silent either — this account is now left behind.
      console.error(
        `cleanup: revoking ${email} (${newUser._id}) failed: ${revokeResult.status()} ${await revokeResult.text()}`
      );
    }
  }
});
