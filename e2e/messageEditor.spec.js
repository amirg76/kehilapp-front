import { test, expect } from '@playwright/test';

/**
 * The message editor (Tiptap, 20.11.2026; replaced react-quill / Quill 1.3.7).
 *
 * What it must keep true:
 *   - every toolbar button has a Hebrew name and an icon (the Quill toolbar
 *     showed empty buttons for video, formula and direction, English labels
 *     for the rest);
 *   - it only produces markup the message display keeps;
 *   - pasted styling, images and script never reach the server;
 *   - typing and pasting an address makes a link; a bad address is refused;
 *   - typing in the body does not wipe the title (the form's change handler
 *     closes over stale state; the editor must call the latest one);
 *   - lists, quotes and strikethrough show to readers as they did to the author.
 *
 * Served production build, API mocked at the network layer (as in
 * delete-permission.spec.js): no backend, no credentials.
 */
test.use({ serviceWorkers: 'block' });

const CATEGORY = { _id: 'c'.repeat(24), title: 'הודעות כלליות', categoryColor: '#3b82f6' };
const baseMessage = (text) => ({
  _id: 'a'.repeat(24),
  title: 'הודעת בדיקה',
  text,
  categoryId: CATEGORY._id,
  senderId: 'b'.repeat(24),
  createdAt: '2026-11-20T10:00:00.000Z',
  urgency: 'normal',
  visibility: 'public',
});

async function mockApi(page, { listText = '<p>גוף</p>', postStatus = 201, role = 'member' } = {}) {
  const user = { id: 'u'.repeat(24), name: 'בודק', email: 'tester@example.com', role, approved: true };
  const posts = [];
  await page.route('**/api/**', (route) => {
    const req = route.request();
    const method = req.method();
    const { pathname } = new URL(req.url());
    const json = (status, body) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

    if (pathname.endsWith('/api/auth/me')) return json(200, { user });
    if (method === 'POST' && pathname.endsWith('/api/messages')) {
      const raw = req.postDataBuffer()?.toString('utf8') || '';
      const field = (name) => raw.match(new RegExp(`name="${name}"\\r\\n\\r\\n([\\s\\S]*?)\\r\\n--`))?.[1];
      posts.push({ title: field('title'), text: field('text'), categoryId: field('categoryId') });
      const status = typeof postStatus === 'function' ? postStatus(posts.length) : postStatus;
      return status === 201 ? json(201, baseMessage(field('text'))) : json(status, { message: 'Internal Server Error' });
    }
    if (pathname.includes('/api/messages')) return json(200, [baseMessage(listText)]);
    if (pathname.endsWith('/api/categories')) return json(200, [CATEGORY]);
    if (pathname.includes('/api/categories/')) return json(200, CATEGORY);
    if (pathname.endsWith('/api/users')) return json(200, []);
    return json(404, { message: `unmocked ${method} ${pathname}` });
  });
  return posts;
}

async function openComposer(page) {
  await page.goto('/');
  await expect(page.getByTestId('header-greeting')).toBeVisible();
  await page.getByTestId('sidebar-compose-page').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('toolbar', { name: 'עיצוב טקסט' })).toBeVisible();
  return dialog;
}

const editorOf = (dialog) => dialog.getByRole('textbox', { name: 'כתיבת הודעה…' });

test('every toolbar button has a Hebrew name and an icon', async ({ page }) => {
  await mockApi(page);
  const dialog = await openComposer(page);
  const buttons = dialog.getByRole('toolbar', { name: 'עיצוב טקסט' }).getByRole('button');
  // 4 marks, 2 headings, 2 lists + quote, link + clear, undo + redo.
  await expect(buttons).toHaveCount(13);
  for (const b of await buttons.all()) {
    const name = await b.getAttribute('aria-label');
    expect(name, 'button name').toMatch(/^[֐-׿ ]+$/);
    await expect(b.locator('svg')).toHaveCount(1);
  }
  // Nothing done yet, so there is nothing to undo.
  await expect(dialog.getByRole('button', { name: 'ביטול פעולה' })).toBeDisabled();
  // Formats are toggle buttons; plain actions are not.
  await expect(dialog.getByRole('button', { name: 'מודגש' })).toHaveAttribute('aria-pressed', 'false');
  for (const name of ['ניקוי עיצוב', 'ביטול פעולה', 'ביצוע שוב']) {
    await expect(dialog.getByRole('button', { name })).not.toHaveAttribute('aria-pressed');
  }
});

test('Ctrl+K opens the link panel on a Hebrew keyboard layout too', async ({ page }) => {
  await mockApi(page);
  const dialog = await openComposer(page);
  const editor = editorOf(dialog);
  await editor.click();
  // On a Hebrew layout the K key reports key "ל" with code "KeyK".
  await editor.evaluate((el) =>
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ל', code: 'KeyK', ctrlKey: true, bubbles: true, cancelable: true })),
  );
  await expect(dialog.getByLabel('כתובת הקישור')).toBeVisible();
});

test('an open link panel holding an address without http does not block sending', async ({ page }) => {
  const posts = await mockApi(page);
  const dialog = await openComposer(page);
  await dialog.getByRole('combobox').selectOption({ index: 1 });
  await dialog.getByLabel('כותרת *').fill('פאנל פתוח');
  await editorOf(dialog).click();
  await page.keyboard.type('גוף');
  await dialog.getByRole('button', { name: 'קישור' }).click();
  await dialog.getByLabel('כתובת הקישור').fill('www.example.com');
  await page.getByTestId('message-submit-button').click();
  await expect.poll(() => posts.length).toBe(1);
  expect(posts[0].text).toBe('<p>גוף</p>');
});

test('a failed send keeps the body, and the retry sends the same body', async ({ page }) => {
  const posts = await mockApi(page, { postStatus: (n) => (n === 1 ? 500 : 201) });
  const dialog = await openComposer(page);
  await dialog.getByRole('combobox').selectOption({ index: 1 });
  await dialog.getByLabel('כותרת *').fill('ניסיון שני');
  await editorOf(dialog).click();
  await page.keyboard.type('טקסט שחייב לשרוד');
  await page.getByTestId('message-submit-button').click();
  await expect.poll(() => posts.length).toBe(1);

  await expect(editorOf(dialog)).toHaveText('טקסט שחייב לשרוד');
  await page.getByTestId('message-submit-button').click();
  await expect.poll(() => posts.length).toBe(2);
  expect(posts[1].text).toBe(posts[0].text);
  expect(posts[1].text).toBe('<p>טקסט שחייב לשרוד</p>');
});

test('formatting, links and paste produce only display-safe HTML, and the title survives', async ({ page }) => {
  const posts = await mockApi(page);
  const dialog = await openComposer(page);

  await dialog.getByRole('combobox').selectOption({ index: 1 });
  await dialog.getByLabel('כותרת *').fill('כותרת בדיקה');

  const editor = editorOf(dialog);
  await editor.click();
  await page.keyboard.type('שלום ');
  await page.keyboard.press('Control+b');
  await page.keyboard.type('מודגש');
  await page.keyboard.press('Control+b');
  await expect(dialog.getByRole('button', { name: 'מודגש' })).toHaveAttribute('aria-pressed', 'false');
  await page.keyboard.press('Enter');

  // A list from the toolbar.
  await dialog.getByRole('button', { name: 'רשימת תבליטים' }).click();
  await expect(dialog.getByRole('button', { name: 'רשימת תבליטים' })).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.type('פריט ראשון');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter'); // leaves the list

  // A typed address becomes a link on the following space.
  await page.keyboard.type('אתר www.example.com ');

  // Paste from a styled source: colour, font, an image with an onerror and a
  // javascript: link must all be gone; the text and the safe link stay.
  await editor.evaluate((el) => {
    const dt = new DataTransfer();
    dt.setData(
      'text/html',
      '<p><span style="color:red;font-family:Comic Sans MS">אדום</span><img src="x" onerror="window.__pwned=1">' +
        '<a href="javascript:window.__pwned=2">רע</a> <a href="https://good.example/a">טוב</a></p>',
    );
    dt.setData('text/plain', 'אדום רע טוב');
    el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
  });

  // The link panel: a bad address is refused with a message, a good one is set
  // on the selected word.
  await page.keyboard.press('Enter');
  await page.keyboard.type('קישור כאן');
  // Right-to-left line: Ctrl+Shift+ArrowRight selects the previous word.
  await page.keyboard.press('Shift+Control+ArrowRight');
  await dialog.getByRole('button', { name: 'קישור' }).click();
  const linkInput = dialog.getByLabel('כתובת הקישור');
  await linkInput.fill('javascript:alert(1)');
  await linkInput.press('Enter');
  // The form has its own (empty) alert region, so pick the link error by text.
  await expect(dialog.getByRole('alert').filter({ hasText: 'כתובת לא תקינה' })).toBeVisible();
  await linkInput.fill('https://kehilapp.example/page');
  await linkInput.press('Enter');
  await expect(linkInput).toHaveCount(0);

  // The title was not wiped by typing in the body.
  await expect(dialog.getByLabel('כותרת *')).toHaveValue('כותרת בדיקה');

  await page.getByTestId('message-submit-button').click();
  await expect.poll(() => posts.length).toBe(1);
  const { title, text } = posts[0];

  expect(title).toBe('כותרת בדיקה');
  expect(text).toContain('<strong>מודגש</strong>');
  expect(text).toMatch(/<ul><li><p>פריט ראשון<\/p><\/li><\/ul>/);
  expect(text).toContain('<a href="https://www.example.com">www.example.com</a>');
  expect(text).toContain('<a href="https://good.example/a">טוב</a>');
  expect(text).toContain('<a href="https://kehilapp.example/page">כאן</a>');
  expect(text).toContain('אדום');
  expect(text, 'no stray empty paragraph').not.toContain('<p></p>');
  for (const bad of ['style=', '<img', 'onerror', 'javascript:', 'target=', 'rel=', '<span']) {
    expect(text, `stored HTML must not contain ${bad}`).not.toContain(bad);
  }
  // Only tags the display keeps.
  const tags = [...new Set([...text.matchAll(/<([a-z0-9]+)/g)].map((m) => m[1]))];
  const allowed = ['a', 'strong', 'em', 'u', 's', 'br', 'p', 'ul', 'ol', 'li', 'h2', 'h3', 'blockquote'];
  expect(tags.filter((t) => !allowed.includes(t))).toEqual([]);
  expect(await page.evaluate(() => window.__pwned)).toBeUndefined();
});

test('an empty body is sent as an empty string, not an empty paragraph', async ({ page }) => {
  const posts = await mockApi(page);
  const dialog = await openComposer(page);
  await dialog.getByRole('combobox').selectOption({ index: 1 });
  await dialog.getByLabel('כותרת *').fill('רק כותרת');
  const editor = editorOf(dialog);
  await editor.click();
  await page.keyboard.type('x');
  await page.keyboard.press('Backspace');
  await page.getByTestId('message-submit-button').click();
  await expect.poll(() => posts.length).toBe(1);
  expect(posts[0].text).toBe('');
});

test('readers see lists, quotes and strikethrough the way the author did', async ({ page }) => {
  await mockApi(page, {
    listText:
      '<p><s>מחוק</s> רגיל</p><ul><li><p>תבליט</p></li></ul><ol><li><p>מספר</p></li></ol>' +
      '<blockquote><p>ציטוט</p></blockquote><h2>כותרת</h2>',
  });
  await page.goto('/');
  const card = page.getByTestId('message-card');
  await expect(card).toHaveCount(1);

  const style = (sel, prop) => card.locator(sel).first().evaluate((el, p) => getComputedStyle(el)[p], prop);
  await expect(card.locator('s')).toHaveText('מחוק');
  expect(await style('s', 'textDecorationLine')).toBe('line-through');
  expect(await style('ul', 'listStyleType')).toBe('disc');
  expect(await style('ol', 'listStyleType')).toBe('decimal');
  await expect(card.locator('blockquote')).toHaveText('ציטוט');
  expect(await style('blockquote', 'borderRightWidth')).toBe('4px'); // inline-start in RTL
});

test('a body sent straight to the API cannot cover the screen or link to a disguised host', async ({ page }) => {
  // Not something the editor writes: a body posted to the API directly. The
  // app ships Tailwind, so a kept class attribute is a full-screen overlay.
  await mockApi(page, {
    listText:
      '<p class="fixed inset-0 z-50 bg-white" aria-label="הודעה רשמית" data-testid="header-greeting">התחברו מחדש</p>' +
      '<p><a href="https://www.paypal.com@evil.example.com/login">PayPal</a> ' +
      '<a href="https://evil.example.com/login">https://www.paypal.com</a> ' +
      '<a href="https://example.com/ok">תקין</a></p>',
  });
  await page.goto('/');
  const card = page.getByTestId('message-card');
  await expect(card).toHaveCount(1);
  await expect(card.getByText('התחברו מחדש')).toBeVisible();

  expect(await card.locator('[class*="fixed"]').count()).toBe(0);
  expect(await card.locator('p').first().getAttribute('class')).toBeNull();
  await expect(card.locator('[aria-label="הודעה רשמית"], [data-testid="header-greeting"]')).toHaveCount(0);
  await expect(card.locator('a[href*="evil.example.com"]')).toHaveCount(0);
  // Refused links stay as plain text in the same paragraph.
  await expect(card).toContainText('PayPal https://www.paypal.com תקין (example.com)');
  await expect(card.locator('a[href="https://example.com/ok"]')).toHaveText('תקין');
});

// Relative luminance (WCAG) of an element's computed colour property.
const luminance = (locator, prop = 'backgroundColor') =>
  locator.evaluate((el, p) => {
    const [r, g, b, a = 1] = getComputedStyle(el)[p].match(/[\d.]+/g).map(Number);
    // A see-through colour is not "dark" or "light"; fail it outright.
    if (a < 0.9) return NaN;
    const lin = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  }, prop);

for (const theme of ['light', 'dark']) {
  test(`in ${theme} mode the composer panel and its fields share one theme`, async ({ page }) => {
    // 22.11.2026: in dark mode the panel stayed light grey while the title and
    // file inputs turned dark inside it, and the title counter was unreadable.
    await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
    await mockApi(page);
    const dialog = await openComposer(page);
    const parts = {
      panel: dialog.locator('form').locator('xpath=..'),
      category: dialog.getByRole('combobox'),
      title: dialog.getByLabel('כותרת *'),
      editor: dialog.locator('.message-editor'),
      file: dialog.getByText('צירוף קובץ'),
    };
    for (const [name, el] of Object.entries(parts)) {
      const l = await luminance(el);
      if (theme === 'dark') expect(l, `${name} background`).toBeLessThan(0.1);
      else expect(l, `${name} background`).toBeGreaterThan(0.6);
    }
    // The title counter sits inside the title input: its text must sit on the
    // other side of the scale from the input's background.
    const text = await luminance(dialog.getByText('25 / 0'), 'color');
    if (theme === 'dark') expect(text).toBeGreaterThan(0.4);
    else expect(text).toBeLessThan(0.2);
  });
}

test('the file picker is in Hebrew and names the chosen file', async ({ page }) => {
  await mockApi(page);
  const dialog = await openComposer(page);
  await expect(dialog.getByText('צירוף קובץ')).toBeVisible();
  await expect(dialog.getByText('לא נבחר קובץ')).toBeVisible();
  // The native input is still the control, named by the visible label.
  const input = dialog.getByLabel('צירוף קובץ');
  await input.setInputFiles({ name: 'פרוטוקול.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4') });
  await expect(dialog.getByText('פרוטוקול.pdf')).toBeVisible();
  await expect(dialog.getByText('לא נבחר קובץ')).toHaveCount(0);
});

test('a disabled send button says what is still missing', async ({ page }) => {
  await mockApi(page);
  const dialog = await openComposer(page);
  const send = page.getByTestId('message-submit-button');
  const hint = dialog.locator('#message-submit-hint');
  await expect(send).toBeDisabled();
  await expect(hint).toHaveText('כדי לשלוח צריך לבחור קטגוריה ולכתוב כותרת (2–25 תווים).');
  await expect(send).toHaveAttribute('aria-describedby', 'message-submit-hint');
  await dialog.getByRole('combobox').selectOption({ index: 1 });
  await expect(hint).toHaveText('כדי לשלוח צריך לכתוב כותרת (2–25 תווים).');
  await dialog.getByLabel('כותרת *').fill('כותרת');
  await expect(send).toBeEnabled();
  await expect(hint).toHaveCount(0);
});

test('a category tag draws its hex colour and a readable name, in dark mode too', async ({ page }) => {
  // 22.11.2026: the API stores "#D97706"; the tag only knew colour names, so
  // the bubble had no fill and the name was dark text on the dark card.
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
  await mockApi(page);
  // The card takes its category from the category list, by categoryId.
  // Registered after mockApi, so it answers first.
  const category = { ...CATEGORY, title: 'זכויות', categoryColor: '#D97706' };
  await page.route('**/api/categories**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify(new URL(route.request().url()).pathname.endsWith('/categories') ? [category] : category) }));
  await page.goto('/');
  const tag = page.getByTestId('message-card').getByRole('heading', { level: 6, name: 'זכויות' });
  await expect(tag).toBeVisible();
  const fill = await tag.locator('xpath=../following-sibling::*[local-name()="svg"]/*[local-name()="path"]')
    .evaluate((el) => getComputedStyle(el).fill);
  expect(fill).toBe('rgb(217, 119, 6)');
  // Amber is light enough that the name goes dark: contrast at least 4.5:1.
  const ratio = await tag.evaluate((el) => {
    const lum = (s) => {
      const [r, g, b] = s.match(/[\d.]+/g).slice(0, 3).map((c) => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const a = lum(getComputedStyle(el).color);
    const b = lum('rgb(217, 119, 6)');
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  });
  expect(ratio).toBeGreaterThanOrEqual(4.5);
});

test('the phone menu opens above the page title', async ({ page }) => {
  // 22.11.2026: the hero title (z-10, later in the page) painted over the
  // open drawer, which lives inside the header (was z-10 too).
  await page.setViewportSize({ width: 390, height: 844 });
  await mockApi(page);
  await page.goto('/');
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  await page.getByRole('button', { name: 'פתח תפריט קטגוריות' }).click();
  const drawer = page.locator('header aside');
  await expect(drawer).toBeVisible();
  // Wait for the slide to finish: the drawer's left edge reaches 0.
  await expect.poll(async () => Math.round((await drawer.boundingBox()).x)).toBe(0);
  const box = await heading.boundingBox();
  // A point on the title that the open drawer covers (it spans the left side).
  const x = Math.min(box.x + box.width - 10, 280);
  const y = box.y + box.height / 2;
  const onTop = await page.evaluate(([px, py]) => Boolean(document.elementFromPoint(px, py)?.closest('header aside')), [x, y]);
  expect(onTop, 'the drawer, not the hero title, is on top').toBe(true);
});

test('the search box stays above the sticky header when the page scrolls', async ({ page }) => {
  // The header became z-40 for the phone menu; the search box overlaps its
  // bottom edge by design and had been drawn over it only by DOM order.
  await mockApi(page, { listText: '<p>' + 'שורה '.repeat(400) + '</p>' });
  await page.goto('/');
  const search = page.getByRole('textbox', { name: 'חיפוש הודעות' });
  await expect(search).toBeVisible();
  await page.mouse.wheel(0, 800);
  await expect.poll(async () => Math.round((await search.boundingBox()).y)).toBeLessThan(100);
  const box = await search.boundingBox();
  // Its top edge, where it overlaps the header.
  const hit = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.closest('input, header')?.tagName, [box.x + box.width / 2, box.y + 4]);
  expect(hit).toBe('INPUT');
});

test('the message list does not scroll sideways on a phone', async ({ page }) => {
  // 22.11.2026: the category bubble hung 17px off the card, 8px past the edge
  // of a 390px screen, and the whole page scrolled sideways (RTL: to the left).
  await page.setViewportSize({ width: 390, height: 844 });
  // An admin: the extra delete button is what pushes the bubble out that far.
  await mockApi(page, { role: 'admin' });
  await page.goto('/');
  await expect(page.getByTestId('message-card')).toHaveCount(1);
  const widths = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  expect(widths[0]).toBe(widths[1]);
});
