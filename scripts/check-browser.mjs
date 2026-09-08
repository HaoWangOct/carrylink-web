import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const executablePath =
  process.env.CHROME_PATH ||
  [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].find((path) => existsSync(path));
if (!executablePath)
  throw new Error("Set CHROME_PATH to an installed Chrome/Chromium browser.");
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true });
const results = [];
const runtimeErrors = [];
const requests = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  page.on("request", (request) =>
    requests.push({ url: request.url(), method: request.method() }),
  );
  const response = await page.goto(baseUrl, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator("h1").count(), 1);
  assert.equal(await page.locator("main").count(), 1);
  assert.equal(await page.locator("#trips article").count(), 4);
  assert.equal(await page.locator("#matching article").count(), 3);
  assert.equal(await page.locator("main section").count(), 8);
  assert.equal(
    await page
      .locator('input:not([type="hidden"]), select')
      .evaluateAll((elements) =>
        elements.every((element) => element.labels?.length),
      ),
    true,
  );
  assert.equal(
    await page
      .locator("img")
      .evaluateAll((images) =>
        images.every((img) => img.complete && img.naturalWidth > 0),
      ),
    true,
  );
  results.push(
    "HTTP 200; semantic landmarks, eight sections, four trips, three matches, associated labels and loaded logo",
  );

  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["tablet", 768, 1024],
    ["mobile", 390, 844],
    ["small-mobile", 320, 800],
  ]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => window.scrollTo(0, 0));
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    assert.equal(overflow, false, `${name}: horizontal overflow`);
    await page.screenshot({ path: `artifacts/${name}.png`, fullPage: true });
    await page.screenshot({ path: `artifacts/${name}-viewport.png` });
    results.push(
      `${name} ${width}×${height}: no horizontal overflow; screenshot saved`,
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page
    .locator("#mobile-navigation")
    .getByRole("link", { name: "How It Works", exact: true })
    .click();
  assert.equal(await page.locator("#mobile-navigation").count(), 0);
  assert.match(page.url(), /#how-it-works$/);
  results.push("Mobile navigation opens, follows in-page links and closes");

  for (const [button, choice, expected, code, file] of [
    ["Language", "中文 Chinese", "有人正飞往", "zh", "mobile-zh"],
    ["语言", "Deutsch German", "Jemand", "de", "mobile-de"],
    ["Sprache", "English English", "Someone", "en", "mobile-en"],
  ]) {
    await page.getByRole("button", { name: button, exact: true }).click();
    await page
      .locator("#language-options")
      .getByRole("button", { name: choice })
      .click();
    await page.waitForFunction(
      (text) => document.querySelector("h1")?.textContent.includes(text),
      expected,
    );
    assert.equal(await page.locator("html").getAttribute("lang"), code);
    assert.ok(
      (await page.locator("h1").innerText()).includes(expected),
      `Unexpected ${code} headline`,
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `artifacts/${file}.png`, fullPage: true });
  }
  results.push(
    "English, Chinese and German switching updates copy and document language without overflow",
  );

  await page.locator("#from-country").selectOption("CN");
  assert.equal(await page.locator("#from-city").inputValue(), "shanghai");
  await page
    .locator("#route-search")
    .getByRole("button", { name: "Find a Traveler", exact: true })
    .click();
  assert.equal(
    await page.locator("#route-error").innerText(),
    "Choose a route between Germany and China.",
  );
  await page.locator("#from-country").selectOption("DE");
  await page.locator("#from-city").selectOption("berlin");
  await page.locator("#trip-weight").fill("3.5");
  await page.locator("#trip-volume").fill("6");
  await page
    .locator("#route-search")
    .getByRole("button", { name: "Find a Traveler", exact: true })
    .click();
  assert.ok((await page.locator("#matching").innerText()).includes("3.5 kg"));
  assert.ok((await page.locator("#matching").innerText()).includes("Berlin"));
  assert.equal(
    await page
      .locator("#matching-heading")
      .evaluate((el) => el === document.activeElement),
    true,
  );
  assert.equal(await page.locator("#matching article").count(), 3);
  results.push(
    "Dependent cities, invalid-route validation, submitted request summary and focus movement; sample data remains illustrative",
  );

  const tripButton = page.getByRole("button", {
    name: "View Trip: Alex M.",
    exact: true,
  });
  await tripButton.click();
  assert.equal(await page.getByRole("dialog").isVisible(), true);
  assert.ok((await page.getByRole("dialog").innerText()).includes("Alex M."));
  await page.keyboard.press("Tab");
  await page.locator("#from-city").evaluate((element) => element.focus());
  assert.equal(
    await page
      .getByRole("dialog")
      .evaluate((el) => el.contains(document.activeElement)),
    true,
  );
  await page.screenshot({ path: "artifacts/trip-dialog.png" });
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  assert.equal(
    await tripButton.evaluate((el) => el === document.activeElement),
    true,
  );
  results.push(
    "Trip preview: native modal focus containment, Escape dismissal and restored trigger focus",
  );

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "Get Started", exact: true }).click();
  assert.ok(
    (await page.getByRole("dialog").innerText()).includes(
      "Accounts are coming soon",
    ),
  );
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Close", exact: true })
    .last()
    .click();
  assert.equal(
    requests.some(
      (request) => request.method === "POST" || request.url.includes("/api/"),
    ),
    false,
  );
  assert.deepEqual(runtimeErrors, []);
  results.push(
    "Account preview only; no API calls, mutations, hydration errors or browser console errors",
  );
  await writeFile(
    "artifacts/browser-results.json",
    JSON.stringify({ baseUrl, results, runtimeErrors }, null, 2),
  );
  console.log(JSON.stringify({ passed: results.length, results }, null, 2));
} finally {
  await browser.close();
}
