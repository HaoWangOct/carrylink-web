import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3300';
const executablePath = process.env.CHROME_PATH || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
if (!executablePath) throw new Error('Set CHROME_PATH to an installed browser.');
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true });
const results = [], errors = [], external = [];
const button = (page, name) => page.getByRole('button', { name, exact: true });
const heading = (page, name) => page.getByRole('heading', { level: 1, name, exact: true }).waitFor();
const password = 'FictionalPassword!'; // Synthetic test input only; never included in reports.
async function fresh(path = '/signup') {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (new URL(request.url()).origin !== baseUrl) external.push(new URL(request.url()).origin); });
  await page.goto(baseUrl + path);
  if (path !== '/') await button(page, 'Continue with Google').waitFor();
  return page;
}
async function signup(page, method = 'email') {
  await page.getByRole('link', { name: method === 'email' ? 'Email' : 'Phone', exact: true }).click();
  await page.waitForURL(`**/signup/${method}`);
  if (method === 'email') await page.locator('#email').fill('person@example.test');
  else { await page.locator('#dial').selectOption('+86'); await page.locator('#phone').fill('13800000000'); }
  await page.locator('#password').fill(password);
  await page.locator('#confirm').fill(password);
  await button(page, 'Continue').click();
  await heading(page, method === 'email' ? 'Email verification' : 'SMS verification');
}
async function verify(page, code, error) {
  await page.locator('#code').fill(code);
  await Promise.all([
    page.waitForResponse(r => r.url().endsWith('/api/auth/demo') && r.request().method() === 'POST'),
    button(page, 'Verify your contact').click(),
  ]);
  if (error) await page.locator('#auth-error').filter({ hasText: error }).waitFor();
  else await heading(page, 'Complete your profile');
}
async function profile(page) {
  for (const [id, value] of Object.entries({ firstName: 'PrivateFirst', lastName: 'Example', dateOfBirth: '1995-02-12', city: 'Berlin', address: 'Fictional address 1' })) await page.locator('#' + id).fill(value);
  await page.locator('#country').selectOption('DE');
  if (!(await page.locator('#email').inputValue())) await page.locator('#email').fill('contact@example.test');
  await button(page, 'Save demo profile').click();
  await heading(page, 'Your demo profile is ready');
}
async function responsive(page, label) {
  for (const [width, height] of [[1440, 1000], [768, 1024], [390, 844], [320, 800]]) {
    await page.setViewportSize({ width, height });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${label} overflow at ${width}`);
    await page.screenshot({ path: `artifacts/auth-${label}-${width}.png`, fullPage: true });
  }
}
async function post(page, data, origin = baseUrl) {
  return page.context().request.post(baseUrl + '/api/auth/demo', { data, headers: { Origin: origin, 'Content-Type': 'application/json' } });
}
try {
  // Start the real resend timer first; other browser work runs while it counts down.
  const attempts = await fresh();
  await signup(attempts);
  assert.equal(await button(attempts, 'Resend code').isDisabled(), true);
  assert.equal((await post(attempts, { action: 'resend' })).status(), 429);
  for (let i = 0; i < 5; i++) await verify(attempts, '000000', 'could not be verified');
  await verify(attempts, '123456', 'no attempts left');
  assert.equal(await attempts.locator('#code').inputValue(), '');

  const page = await fresh('/');
  await page.getByRole('link', { name: 'Get Started', exact: true }).click();
  await heading(page, 'Create your CarryLink account');
  await button(page, 'Continue with Google').waitFor();
  await page.getByRole('link', { name: 'Phone', exact: true }).click();
  await page.locator('#phone').fill('15100000000');
  await page.getByRole('link', { name: 'Email', exact: true }).click();
  await page.locator('#email').fill('person@example.test');
  await page.locator('#password').fill(password);
  await page.locator('#confirm').fill('DifferentFictionalPassword!');
  await button(page, 'Continue').click();
  await page.locator('#auth-error').filter({ hasText: 'Passwords do not match.' }).waitFor();
  assert.equal(await page.locator('#auth-error').evaluate(el => el === document.activeElement), true);
  assert.notEqual(await page.locator('#confirm').evaluate(el => getComputedStyle(el).borderColor), 'rgba(0, 0, 0, 0)');
  await page.getByRole('button', { name: 'Show password: Password', exact: true }).click();
  assert.equal(await page.locator('#password').getAttribute('type'), 'text');
  await responsive(page, 'email-error');
  await page.locator('#confirm').fill(password);
  await button(page, 'Continue').click();
  await heading(page, 'Email verification');
  const before = (await page.context().cookies()).find(c => c.name === 'carrylink_demo_onboarding');
  assert.ok(before.httpOnly && before.sameSite === 'Strict' && before.path === '/api/auth/demo');
  await page.getByRole('link', { name: 'Back', exact: true }).click();
  assert.equal(await page.locator('#email').inputValue(), 'person@example.test');
  assert.equal(await page.locator('#password').inputValue(), '');
  await page.getByRole('link', { name: 'Continue', exact: true }).click();
  await heading(page, 'Email verification');
  await page.reload();
  await heading(page, 'Email verification');
  assert.equal(await page.locator('#code').getAttribute('inputmode'), 'numeric');
  await verify(page, '000000', 'could not be verified');
  await responsive(page, 'verification-error');
  await verify(page, '123456');
  const after = (await page.context().cookies()).find(c => c.name === before.name);
  assert.notEqual(after.value, before.value);
  assert.equal(await page.locator('#email').getAttribute('readonly'), '');
  await button(page, 'Save demo profile').click();
  await page.locator('#auth-error').waitFor();
  await page.locator('#dateOfBirth').fill('2999-01-01');
  await button(page, 'Save demo profile').click();
  await page.locator('#auth-error').waitFor();
  await responsive(page, 'profile-error');
  await profile(page);
  await button(page, 'Review profile').click();
  await page.locator('#city').fill('Hamburg');
  await button(page, 'Save demo profile').click();
  await heading(page, 'Your demo profile is ready');
  await page.reload();
  await heading(page, 'Your demo profile is ready');
  await button(page, 'Review profile').click();
  assert.equal(await page.locator('#city').inputValue(), 'Hamburg');
  assert.deepEqual(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) })), { local: [], session: [] });
  assert.equal(await page.evaluate(() => document.cookie.includes('carrylink_demo_onboarding')), false);
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await page.locator('#route-search').waitFor();
  assert.equal((await page.locator('body').innerText()).includes('PrivateFirst'), false);
  await button(page, 'Menu').click();
  await page.locator('#mobile-navigation').getByRole('link', { name: 'Create an account', exact: true }).click();
  await heading(page, 'Create your CarryLink account');
  results.push('Home desktop/mobile signup links, selectors, mismatch/focus/visibility, retained contact/back, refresh, invalid/correct OTP, cookie rotation, private profile validation/save/edit/reload, no browser persistence or public profile leakage.');

  const phone = await fresh();
  await signup(phone, 'phone');
  await responsive(phone, 'phone-verification');
  await verify(phone, '123456');
  assert.equal(await phone.locator('#phone').inputValue(), '+8613800000000');
  assert.equal(await phone.locator('#phone').getAttribute('readonly'), '');
  await profile(phone);
  const google = await fresh();
  await button(google, 'Continue with Google').click();
  await heading(google, 'Complete your profile');
  assert.equal(await google.locator('#email').inputValue(), 'google@example.test');
  await profile(google);
  await google.getByRole('link', { name: 'Log in', exact: true }).click();
  await button(google, 'Continue with Google').click();
  await heading(google, 'Your demo profile is ready');
  await button(google, 'Reset local account demo').click();
  await heading(google, 'Verify your contact before completing your profile.');
  results.push('Phone signup with dial selector and verified phone projection; first/returning Google simulation; reset and guarded profile access.');

  for (const method of ['email', 'phone-password', 'phone-otp']) {
    const login = await fresh('/login');
    if (method === 'email') await login.locator('#email').fill('login@example.test');
    else {
      await button(login, 'Phone').click();
      await login.locator('#phone').fill('15100000000');
      if (method === 'phone-otp') await login.getByRole('radio', { name: 'Use SMS code', exact: true }).check();
    }
    if (method !== 'phone-otp') {
      await login.locator('#password').fill('short');
      await button(login, 'Log in').click();
      await login.locator('#auth-error').waitFor();
      await login.locator('#password').fill(password);
    }
    await responsive(login, method);
    await button(login, 'Log in').click();
    if (method === 'phone-otp') {
      await heading(login, 'SMS verification');
      await verify(login, '000000', 'could not be verified');
      await verify(login, '123456');
    } else await heading(login, 'Complete your profile');
  }
  results.push('Email/password, phone/password and phone/OTP simulated login, validation errors and required OTP transition.');

  const languages = await fresh();
  for (const [lang, title, next, mismatch] of [['en', 'Create your CarryLink account', 'Continue', 'Passwords do not match.'], ['zh', '创建 CarryLink 账户', '继续', '两次输入的密码不一致。'], ['de', 'Dein CarryLink-Konto erstellen', 'Weiter', 'Die Passwörter stimmen nicht überein.']]) {
    await languages.goto(baseUrl + '/signup');
    await button(languages, 'Continue with Google').waitFor();
    await languages.locator('#auth-language').selectOption(lang);
    await heading(languages, title);
    await languages.locator('#email').fill('language@example.test');
    await languages.locator('#password').fill(password);
    await languages.locator('#confirm').fill('DifferentFictionalPassword!');
    await button(languages, next).click();
    await languages.locator('#auth-error').filter({ hasText: mismatch }).waitFor();
    await responsive(languages, lang);
    assert.equal(await languages.locator('html').getAttribute('lang'), lang);
    await languages.locator('#confirm').fill(password);
    await button(languages, next).click();
    const labels = {
      en: ['Email verification', 'Verify your contact', 'Complete your profile', 'Save demo profile', 'Your demo profile is ready', 'Log in'],
      zh: ['邮箱验证', '验证联系方式', '完善个人资料', '保存演示资料', '演示资料已完成', '登录'],
      de: ['E-Mail-Bestätigung', 'Kontakt bestätigen', 'Profil vervollständigen', 'Demo-Profil speichern', 'Dein Demo-Profil ist bereit', 'Anmelden'],
    }[lang];
    await heading(languages, labels[0]);
    await responsive(languages, `${lang}-verify`);
    await languages.locator('#code').fill('123456');
    await button(languages, labels[1]).click();
    await heading(languages, labels[2]);
    for (const [id, value] of Object.entries({ firstName: 'Example', lastName: 'Person', dateOfBirth: '1995-02-12', city: 'Berlin', address: 'Fictional address 1' })) await languages.locator('#' + id).fill(value);
    await responsive(languages, `${lang}-profile`);
    await button(languages, labels[3]).click();
    await heading(languages, labels[4]);
    await languages.getByRole('link', { name: labels[5], exact: true }).click();
    await heading(languages, labels[5]);
    await responsive(languages, `${lang}-login`);
  }
  await page.context().clearCookies();
  await page.goto(baseUrl + '/signup/verify');
  await heading(page, 'Start or resume signup to continue. Your demo session may have expired.');
  await page.context().addCookies([{ name: 'carrylink_demo_onboarding', value: 'invalid-demo-session', domain: '127.0.0.1', path: '/api/auth/demo' }]);
  await page.goto(baseUrl + '/signup/complete-profile');
  await heading(page, 'Verify your contact before completing your profile.');
  assert.equal((await post(page, { action: 'verify', code: '123456' })).status(), 401);
  assert.equal((await post(page, { action: 'google' }, 'https://example.test')).status(), 403);
  assert.equal((await post(page, { action: 'google' }, 'http://127.0.0.1:9999')).status(), 403);
  assert.equal((await page.request.get(baseUrl + '/api/auth/demo', { headers: { Host: 'example.test' } })).status(), 503);
  assert.equal((await post(page, { action: 'unknown' })).status(), 400);
  assert.equal((await post(page, 'x'.repeat(9000))).status(), 413);
  const response = await page.context().request.get(baseUrl + '/api/auth/demo');
  assert.match(response.headers()['cache-control'], /no-store/);
  assert.equal((await response.json()).state.profile, null);
  results.push('EN/ZH/DE copy and validation; desktop/tablet/390px/320px signup, verification, profile and login layouts; missing/invalid session recovery; origin, payload and cache guards.');

  await button(attempts, 'Resend code').waitFor();
  await attempts.waitForFunction(() => [...document.querySelectorAll('button')].some(el => el.textContent === 'Resend code' && !el.disabled), { }, { timeout: 65_000 });
  await button(attempts, 'Resend code').click();
  await attempts.getByRole('status').filter({ hasText: 'Demo code renewed.' }).waitFor();
  assert.equal(await button(attempts, 'Resend code').isDisabled(), true);
  await verify(attempts, '123456');
  results.push('Five failed attempts block further verification; real 60-second resend countdown and server cooldown; resend restores verification.');
  if (process.env.UNAVAILABLE_BASE_URL) {
    const unavailable = await browser.newPage();
    const url = process.env.UNAVAILABLE_BASE_URL;
    await unavailable.goto(url + '/signup');
    await heading(unavailable, 'Account setup is not enabled. You can return to the marketplace demo.');
    assert.equal(await unavailable.locator('input').count(), 0);
    for (const method of ['GET', 'POST']) {
      const r = await unavailable.request.fetch(url + '/api/auth/demo', { method, headers: { Origin: url, 'Content-Type': 'application/json' }, ...(method === 'POST' ? { data: { action: 'google' } } : {}) });
      assert.equal(r.status(), 503);
      assert.deepEqual(await r.json(), { error: 'unavailable' });
    }
    results.push('Configured unavailable provider: no signup inputs; GET and POST return 503.');
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(external, []);
  await writeFile('artifacts/auth-browser-results.json', JSON.stringify({ baseUrl, results, errors, external }, null, 2));
  console.log(JSON.stringify({ passed: results.length, results }, null, 2));
} finally {
  await browser.close();
}
