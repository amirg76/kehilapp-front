import { test, expect } from '@playwright/test';

/**
 * Who sees the delete control, and what a refused delete looks like.
 *
 * Background (1.11.2026): DELETE /api/messages/:id is admin-only on the
 * server, but the card showed a trash icon to every signed-in member and the
 * mutation's onError was empty. A member clicked eight times, the server
 * answered 403 eight times, the screen showed nothing.
 *
 * Runs against the served production build with the API mocked at the network
 * layer (page.route), so it needs no backend and no credentials. The service
 * worker is blocked so every request is visible to the mock, whatever sw.js
 * decides to handle.
 */
test.use({ serviceWorkers: 'block' });

const CATEGORY = { _id: 'c'.repeat(24), title: 'הודעות כלליות', categoryColor: '#3b82f6' };
const MESSAGE = {
  _id: 'a'.repeat(24),
  title: 'הודעת בדיקה',
  text: '<p>גוף ההודעה</p>',
  categoryId: CATEGORY._id,
  senderId: 'b'.repeat(24),
  createdAt: '2026-11-01T10:47:29.227Z',
  urgency: 'normal',
  visibility: 'public',
};

// Mocks every /api call the board makes. GET /api/auth/me is how App.jsx
// learns who is signed in, so `role` is all it takes to be a member or an
// admin. Returns the list of DELETE paths the page actually sent.
async function mockApi(page, { role, deleteStatus }) {
  const user = { id: 'u'.repeat(24), name: 'בודק', email: 'tester@example.com', role, approved: true };
  const deletes = [];
  await page.route('**/api/**', (route) => {
    const req = route.request();
    const method = req.method();
    const { pathname } = new URL(req.url());
    const json = (status, body) =>
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

    if (pathname.endsWith('/api/auth/me')) return json(200, { user });
    if (method === 'DELETE' && /\/api\/messages\/[a-f0-9]{24}$/.test(pathname)) {
      deletes.push(pathname);
      return deleteStatus === 200
        ? json(200, MESSAGE._id)
        : json(deleteStatus, { message: 'Forbidden' });
    }
    if (pathname.endsWith('/api/messages')) return json(200, [MESSAGE]);
    if (pathname.endsWith('/api/categories')) return json(200, [CATEGORY]);
    if (pathname.includes('/api/categories/')) return json(200, CATEGORY);
    if (pathname.endsWith('/api/users')) return json(200, []);
    return json(404, { message: `unmocked ${method} ${pathname}` });
  });
  return deletes;
}

const card = (page) => page.getByTestId('message-card');
const deleteButton = (page) => page.getByRole('button', { name: 'מחיקת ההודעה' });

test('a signed-in member gets no delete control at all', async ({ page }) => {
  const deletes = await mockApi(page, { role: 'member', deleteStatus: 403 });
  await page.goto('/');

  await expect(card(page)).toHaveCount(1);
  // The card did render its other controls, so the absence below is a choice.
  await expect(page.getByRole('button', { name: 'שיתוף ההודעה' })).toHaveCount(1);
  await expect(deleteButton(page)).toHaveCount(0);
  // main rendered the icon bare (no button role), so check the glyph too.
  await expect(page.locator('svg.fa-trash')).toHaveCount(0);
  expect(deletes).toEqual([]);
});

test('an admin whose delete is refused sees why, and keeps the message', async ({ page }) => {
  const deletes = await mockApi(page, { role: 'admin', deleteStatus: 403 });
  await page.goto('/');

  await expect(card(page)).toHaveCount(1);
  await deleteButton(page).click();

  await expect(page.getByRole('alert')).toContainText('אין לך הרשאה למחוק הודעות');
  await expect(card(page)).toHaveCount(1);
  expect(deletes).toEqual([`/api/messages/${MESSAGE._id}`]);
});

test('an admin whose delete succeeds sees the message go, with no alert', async ({ page }) => {
  const deletes = await mockApi(page, { role: 'admin', deleteStatus: 200 });
  await page.goto('/');

  await expect(card(page)).toHaveCount(1);
  await deleteButton(page).click();

  await expect(card(page)).toHaveCount(0);
  await expect(page.getByRole('alert')).toHaveText('');
  expect(deletes).toEqual([`/api/messages/${MESSAGE._id}`]);
});
