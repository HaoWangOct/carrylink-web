import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';

// Run against `next start` to exercise production SSR as well as hydrated flows.
const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000';
const executablePath = process.env.CHROME_PATH || [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
].find(existsSync);
if (!executablePath) throw new Error('Set CHROME_PATH to an installed browser.');
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true });
const results = [], errors = [], mutations = [];
try {
  const noJS = await browser.newContext({ javaScriptEnabled: false });
  const initial = await noJS.newPage();
  for (const query of ['', '?fromCity=frankfurt&toCity=beijing&weight=4.5&volume=11&date=2026-09-21']) {
    assert.equal((await initial.goto(baseUrl + query)).status(), 200);
    assert.match(await initial.locator('h1').innerText(), /Someone is/);
    assert.equal(await initial.locator('#route-search').count(), 1);
    assert.equal(await initial.locator('#trips article').count(), 4);
    assert.ok((await initial.locator('#how-it-works').innerText()).includes('Create a trip or request'));
    assert.ok(await initial.getByRole('link', { name: 'Find a Traveler', exact: true }).count());
    assert.equal(await initial.locator('#trip-weight').inputValue(), query ? '4.5' : '2');
    assert.equal(await initial.locator('#trip-volume').inputValue(), query ? '11' : '5');
    assert.equal(await initial.locator('#from-city').inputValue(), query ? 'frankfurt' : 'munich');
    assert.notEqual((await initial.locator('body').innerText()).trim(), 'Loading…');
  }
  await noJS.close();
  results.push('R3: production server output contains headline, navigation, form, story and listings without JavaScript, including URL-provided values.');

  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', request => {
    if (request.method() === 'POST' || request.url().includes('/api/')) mutations.push(request.url());
  });
  const button = name => page.getByRole('button', { name, exact: true });
  const link = name => page.getByRole('link', { name, exact: true }).first();
  const heading = name => page.getByRole('heading', { level: 1, name, exact: true }).waitFor();
  const next = () => button('Next').click();
  async function responsive(label) {
    for (const [size, width, height] of [['desktop', 1440, 1000], ['tablet', 768, 1024], ['mobile', 390, 844], ['small', 320, 800]]) {
      await page.setViewportSize({ width, height });
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${label}/${size}: page overflow`);
      // Inspect the active surface, excluding closed details and the inert modal background.
      const selector = await page.locator('dialog[open]').count()
        ? 'dialog[open], dialog[open] p, dialog[open] button'
        : 'main article, main form, main button, main p';
      const oversized = await page.locator(selector).evaluateAll(nodes => nodes
        .filter(node => node.checkVisibility() && (node.getBoundingClientRect().right > innerWidth + 1 || node.scrollWidth > node.clientWidth + 1))
        .map(node => ({ tag: node.tagName, text: node.textContent, className: node.className,
          width: node.clientWidth, scrollWidth: node.scrollWidth, right: node.getBoundingClientRect().right })));
      assert.deepEqual(oversized, [], `${label}/${size}: overflowing content or controls`);
      await page.screenshot({ path: `artifacts/corrections-${label}-${size}.png`, fullPage: true });
    }
  }

  for (const [width, height] of [[1440, 1000], [768, 1024], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.goto(baseUrl);
    await page.locator('#trip-weight').fill('7');
    await page.locator('#trip-volume').fill('12');
    await page.locator('#matching').getByRole('button', { name: 'Create Request', exact: true }).first().click();
    await heading('Create Request');
    await next();
    assert.equal(await page.locator('#weight').inputValue(), '7');
    assert.equal(await page.locator('#volume').inputValue(), '12');
    for (const [id, value] of [['item', 'Books'], ['area', 'Shanghai centre'], ['length', '31'], ['width', '22'], ['height', '13']]) {
      await page.locator(`#${id}`).fill(value);
    }
    await button('Previous').click();
    await next();
    for (const [id, value] of [['weight', '7'], ['volume', '12'], ['length', '31'], ['width', '22'], ['height', '13']]) {
      assert.equal(await page.locator(`#${id}`).inputValue(), value);
    }
    await next();
    assert.match(await page.locator('main').innerText(), /7 kg · 12 L · 31 × 22 × 13 cm/);
  }
  results.push('R1: homepage match CTA retains 7 kg/12 L at desktop, tablet and mobile; request dimensions survive Previous and review.');

  await page.goto(`${baseUrl}/?weight=4.5&volume=11`);
  assert.equal(await page.locator('#trip-weight').inputValue(), '4.5');
  await page.locator('#route-search').getByRole('button', { name: 'Find a Traveler', exact: true }).click();
  await heading('Match results');
  await link('Edit search').click();
  await page.locator('#route-search').waitFor();
  assert.equal(await page.locator('#trip-volume').inputValue(), '11');
  await page.locator('#route-search').getByRole('button', { name: 'Find a Traveler', exact: true }).click();
  await heading('Match results');
  await page.locator('main article').first().getByRole('link', { name: 'Create Request', exact: true }).click();
  await heading('Create Request');
  await next();
  assert.equal(await page.locator('#weight').inputValue(), '4.5');
  assert.equal(await page.locator('#volume').inputValue(), '11');
  results.push('R1/R3: hydrated URL search, Edit search and results-page handoff retain non-default values.');

  await page.goto(`${baseUrl}/requests/new`);
  await page.locator('#arrival').fill('2026-09-19');
  await next();
  const values = { item: 'X'.repeat(300), area: 'Y'.repeat(300), weight: '2', volume: '5', length: '20', width: '20', height: '10' };
  for (const [id, value] of Object.entries(values)) await page.locator(`#${id}`).fill(value);
  await next();
  await button('Submit demo request').click();
  await heading('Match results');
  const requestId = new URL(page.url()).searchParams.get('request');
  await page.getByText('No compatible results.', { exact: false }).waitFor();
  await responsive('empty-request');
  await link('Edit request').click();
  await heading('Edit request');
  assert.equal(await page.locator('#arrival').inputValue(), '2026-09-19');
  assert.equal(await page.locator('#from-city').inputValue(), 'munich');
  assert.equal(await page.locator('#to-city').inputValue(), 'shanghai');
  await page.locator('#arrival').fill('2026-09-25');
  await next();
  for (const [id, value] of Object.entries(values)) assert.equal(await page.locator(`#${id}`).inputValue(), value);
  await link('Back to dashboard').click();
  await heading('Traveler dashboard');
  await link('Edit request').click();
  await heading('Edit request');
  assert.equal(await page.locator('#arrival').inputValue(), '2026-09-25');
  await next();
  await next();
  await responsive('revised-request');
  await button('Save changes').click();
  await heading('Match results');
  assert.equal(new URL(page.url()).searchParams.get('request'), requestId, 'revision preserves request identity');
  assert.equal(await page.locator('main article').count(), 2);
  await responsive('long-matches');
  results.push('R4: empty-result revision and dashboard edit reuse the form, preserve every field/draft and request ID, and find candidates after correction.');

  await link('Review match').click();
  await heading('Review demo order');
  const reviewUrl = page.url();
  assert.ok((await page.locator('main').innerText()).includes(values.item));
  assert.ok((await page.locator('main').innerText()).includes(values.area));
  await responsive('long-order-review');
  assert.equal(await button('Create demo order').isEnabled(), false);
  await page.getByRole('checkbox').check();
  await button('Create demo order').click();
  await page.waitForURL(url => /\/orders\/(?!review)[^/]+$/.test(url.pathname));
  await heading('Demo order created');
  const orderPath = new URL(page.url()).pathname;
  await responsive('long-order-saved');
  await link('Back to dashboard').click();
  await heading('Traveler dashboard');
  const requestSection = page.locator('main section').filter({ has: page.getByRole('heading', { name: 'Your requests', exact: true }) });
  assert.equal(await requestSection.locator('article').count(), 1, 'edit did not duplicate request');
  assert.equal(await requestSection.getByRole('link', { name: 'Find matches', exact: true }).count(), 0);
  assert.equal(await requestSection.getByRole('link', { name: 'Edit request', exact: true }).count(), 0);
  assert.equal(await requestSection.getByRole('link', { name: 'View demo order', exact: true }).getAttribute('href'), orderPath);
  await responsive('ordered-dashboard');
  await page.goBack(); // Saved order.
  await heading('Demo order created');
  await page.goBack(); // The existing request's matches URL.
  await heading('This request has a demo order');
  assert.equal(new URL(page.url()).searchParams.get('request'), requestId);
  assert.equal(await page.getByText('No compatible results.', { exact: false }).count(), 0);
  assert.equal(await link('View demo order').getAttribute('href'), orderPath);
  await responsive('existing-order');
  await page.goBack(); // Previously visited edit URL must also protect the snapshot.
  await heading('This request has a demo order');
  assert.equal(new URL(page.url()).pathname, '/requests/new');
  assert.equal(await page.locator('main form').count(), 0);
  await link('View demo order').click();
  await heading('Demo order created');
  assert.ok((await page.locator('main').innerText()).includes(values.item));
  await link('Back to dashboard').click();
  await heading('Traveler dashboard');
  const orders = page.locator('main section').filter({ has: page.getByRole('heading', { name: 'Demo orders', exact: true }) });
  assert.equal(await orders.locator('a').count(), 1, 'one request retains one demo order');
  results.push('R2/R5: full 300-character item and area wrap across forms/cards/order review/saved order/dashboard; ordered request links to its one snapshot, including browser Back to matches and edit URLs.');

  await link('CarryLink').click();
  await page.locator('#route-search').waitFor();
  await button('About this demo →').click();
  await page.getByRole('dialog').waitFor();
  await responsive('dialog');
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(), 0);
  // Unknown request-edit URLs must recover honestly after a full reload.
  await page.goto(`${baseUrl}/requests/new?edit=${requestId}`);
  await page.getByRole('heading', { level: 1, name: /unavailable/ }).waitFor();
  results.push('Affected layouts checked at 1440/768/390/320 px; dialog remains contained and closable; missing edit IDs recover after reload.');
  assert.deepEqual(errors, []);
  assert.deepEqual(mutations, []);
  await writeFile('artifacts/corrections-results.json', JSON.stringify({ baseUrl, results, errors, reviewUrl }, null, 2));
  console.log(JSON.stringify({ passed: results.length, results }, null, 2));
} finally {
  await browser.close();
}
