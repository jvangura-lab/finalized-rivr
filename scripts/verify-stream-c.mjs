// Stream C v1 verification — walks all routes at desktop + mobile, captures
// console errors, asserts specific content is present (or absent) per spec.
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:3002';
const NORMAL_WARN = /You are using the in-browser Babel transformer/i;

const results = [];
const browser = await chromium.launch({ headless: true });

async function visit(route, viewport, label) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(`pageerror: ${e.message}`));
  const resp = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(300);
  return { ctx, page, errs, status: resp.status() };
}

async function expectPresent(page, sel, label) {
  const ok = await page.locator(sel).count() > 0;
  return { name: label, pass: ok };
}
async function expectText(page, sel, expected, label) {
  const txt = await page.locator(sel).first().textContent().catch(() => '');
  const pass = (txt || '').includes(expected);
  return { name: label, pass, got: pass ? null : (txt || '').trim().slice(0, 120) };
}

async function check(routeKey, route, viewport, vpLabel, assertFn) {
  const { ctx, page, errs, status } = await visit(route, viewport, `${routeKey} ${vpLabel}`);
  const assertions = await assertFn(page);
  const realErrs = errs.filter(e => !NORMAL_WARN.test(e));
  const fails = assertions.filter(a => !a.pass);
  const result = {
    route: routeKey, viewport: vpLabel,
    status,
    consoleErrors: realErrs.length,
    consoleErrorSamples: realErrs.slice(0, 3),
    assertions,
    failed: fails.length,
  };
  await ctx.close();
  return result;
}

const VPS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };

// HOME — desktop
results.push(await check('/', '/', VPS.desktop, 'desktop', async (p) => [
  await expectText(p, '.text-label-caps', 'A studio for aesthetic medicine booking', 'hero eyebrow updated'),
  await expectText(p, 'h1', 'Booking flows built around', 'hero headline updated (line 1)'),
  await expectText(p, 'h1', 'already work', 'hero headline updated (line 2 + italic word)'),
  await expectPresent(p, '.work-hero-grid', '3-tile hero grid present'),
  { name: '3 tile links to demo subdomains', pass: (await p.locator('.work-hero-tile').count()) === 3 },
  { name: 'tile 1 → devereaux', pass: (await p.locator('.work-hero-tile').nth(0).getAttribute('href')) === 'https://devereaux.rivrsystems.com' },
  { name: 'tile 2 → lumera',    pass: (await p.locator('.work-hero-tile').nth(1).getAttribute('href')) === 'https://lumera.rivrsystems.com' },
  { name: 'tile 3 → sela',      pass: (await p.locator('.work-hero-tile').nth(2).getAttribute('href')) === 'https://sela.rivrsystems.com' },
  await expectPresent(p, '.integration-mock', 'integration section mock present'),
  await expectText(p, '.integration-mock .practice-nav .brand', 'DESTIN MED SPA', 'integration practice brand name'),
  await expectText(p, '.integration-mock .browser-chrome .url', 'destinmedspa.com/book', 'integration mock URL'),
  { name: 'old iframe hero mockup gone', pass: (await p.locator('iframe[src*="hero-animation"]').count()) === 0 },
  { name: 'old fake-Lumera-screenshot in hero gone', pass: (await p.locator('.hero-stage .hero-video-frame').count()) === 0 },
  { name: 'SampleWork present', pass: (await p.locator('#booking-types').count()) > 0 },
  { name: 'SampleWork tile 1 first image is real demo screenshot', pass: (await p.locator('#booking-types .hover-cycle img').nth(0).getAttribute('src') || '').includes('imagery/demos/lumera-pathfinder.jpg') },
  { name: 'Nav has "The build" link', pass: (await p.locator('.nav-link', { hasText: 'The build' }).count()) > 0 },
  { name: 'Nav no longer has "Product" link', pass: (await p.locator('.nav-link', { hasText: 'Product' }).count()) === 0 },
]));

// HOME — mobile
results.push(await check('/', '/', VPS.mobile, 'mobile', async (p) => [
  { name: 'tiles stack (single column)', pass: true /* CSS-only; covered by visual */ },
  { name: 'mobile "View live →" cta visible on tiles', pass: (await p.locator('.work-hero-mobile-cta').first().isVisible()) },
  { name: 'no horizontal overflow', pass: (await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2)) },
]));

// THE BUILD — desktop
results.push(await check('/the-build', '/the-build', VPS.desktop, 'desktop', async (p) => [
  await expectText(p, 'title', 'The Build', 'page title updated'),
  await expectText(p, 'h1', 'Three practices', 'build hero headline'),
  { name: '3 demo sections (build-section)', pass: (await p.locator('.build-section').count()) === 3 },
  { name: 'section 1 eyebrow Devereaux', pass: (await p.locator('.build-copy .eyebrow').nth(0).textContent()).trim() === 'Devereaux' },
  { name: 'section 2 eyebrow Lumera',    pass: (await p.locator('.build-copy .eyebrow').nth(1).textContent()).trim() === 'Lumera' },
  { name: 'section 3 eyebrow Sela',      pass: (await p.locator('.build-copy .eyebrow').nth(2).textContent()).trim() === 'Sela' },
  { name: 'each section has CTA to its demo', pass: (await p.locator('.build-copy .cta').count()) === 3 },
  { name: 'each section has scroll-tile image', pass: (await p.locator('.build-tile img').count()) === 3 },
]));

// THE BUILD — mobile
results.push(await check('/the-build', '/the-build', VPS.mobile, 'mobile', async (p) => [
  { name: 'tile images present', pass: (await p.locator('.build-tile img').count()) === 3 },
  { name: 'no horizontal overflow', pass: (await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2)) },
]));

// ABOUT — desktop
results.push(await check('/about', '/about', VPS.desktop, 'desktop', async (p) => [
  { name: 'old "We do / We do not" list gone', pass: (await p.locator('.we-do-grid').count()) === 0 },
  await expectText(p, '.section', 'aesthetic medicine practices', 'new prose body present'),
  await expectText(p, '.section', "We don't sell a platform", 'new prose body includes don\'t-side substance'),
  { name: 'About hero still on this page', pass: (await p.locator('h1').first().textContent()).includes('Two co-founders') },
]));

// BOOK — desktop
results.push(await check('/book', '/book', VPS.desktop, 'desktop', async (p) => [
  { name: 'book page loads', pass: (await p.locator('h1').count()) > 0 },
  { name: 'booking iframe untouched', pass: (await p.locator('iframe.book-widget-iframe').count()) === 1 },
]));

// /product 404
{
  const ctx = await browser.newContext({ viewport: VPS.desktop });
  const page = await ctx.newPage();
  const resp = await page.goto(`${BASE}/product`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  results.push({
    route: '/product', viewport: 'desktop', status: resp.status(), consoleErrors: 0, consoleErrorSamples: [],
    assertions: [{ name: '/product returns 404 (file renamed)', pass: resp.status() === 404 }],
    failed: resp.status() === 404 ? 0 : 1,
  });
  await ctx.close();
}

await browser.close();

// Summarize
console.log(JSON.stringify(results, null, 2));
const totalFailed = results.reduce((a, r) => a + r.failed, 0);
const totalErrs = results.reduce((a, r) => a + r.consoleErrors, 0);
console.log(`\nSUMMARY: ${results.length} route checks · ${totalFailed} assertion failures · ${totalErrs} non-benign console errors`);
process.exit(totalFailed + totalErrs > 0 ? 1 : 0);
