#!/usr/bin/env node
// =============================================================================
// capture-demos.mjs — grab 3 hover-cycle screenshots each from the live
// Sela + Devereaux reference builds. 16:10 viewport (1440x900), three scroll
// positions so the frames differ. Re-runnable; overwrites in place.
//
//   node scripts/capture-demos.mjs
//
// Lumera already has real screenshots (lumera-hero/team/calendar.png), so it's
// not captured here.
// =============================================================================
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", "imagery");
const VIEWPORT = { width: 1440, height: 900 };

const SITES = [
  { slug: "sela", url: "https://sela.rivrsystems.com" },
  { slug: "devereaux", url: "https://devereaux.rivrsystems.com" },
];

async function settle(page, ms = 900) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(ms);
}

async function capture(page, site) {
  console.log(`→ ${site.slug} (${site.url})`);
  await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: 20000 });
  await settle(page, 1200);

  // Best-effort dismiss of common consent/cookie buttons.
  for (const re of [/accept/i, /agree/i, /got it/i, /continue/i]) {
    const b = page.getByRole("button", { name: re }).first();
    if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); await page.waitForTimeout(300); break; }
  }

  const docH = await page.evaluate(() => document.body.scrollHeight).catch(() => VIEWPORT.height);
  const positions = [0, Math.max(0, Math.round(docH * 0.42)), Math.max(0, Math.round(docH * 0.72))];

  for (let i = 0; i < positions.length; i++) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "auto" }), positions[i]);
    await page.waitForTimeout(700);
    const file = `${site.slug}-${i + 1}.png`;
    await page.screenshot({ path: resolve(OUT, file), fullPage: false });
    console.log(`  ✓ ${file}`);
  }
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
const page = await ctx.newPage();
let ok = 0, fail = 0;
for (const site of SITES) {
  try { await capture(page, site); ok++; }
  catch (err) { fail++; console.error(`  ✗ ${site.slug}: ${err.message}`); }
}
await browser.close();
console.log(`\nDone. ${ok} captured, ${fail} failed.`);
process.exit(fail > 0 && ok === 0 ? 1 : 0);
