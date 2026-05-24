// Polish Pass 1 verification — DOM-only probes. No screenshots.
// Covers: T1 hero descender clearance, T2 Source Serif 4 load, T3 evidence link
// removal, T4 yours-next echoes + grain, T5 closing timeline + no R watermark,
// T6 nav redesign (Cormorant wordmark, underline, no .mk).
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:3000';
const NORMAL_WARN = /You are using the in-browser Babel transformer/i;

const browser = await chromium.launch({ headless: true });

async function visit(route, viewport) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(`pageerror: ${e.message}`));
  const resp = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForFunction(() => document.getElementById('root')?.children?.length > 0, { timeout: 8000 });
  await page.waitForTimeout(250);
  return { ctx, page, errs, status: resp.status() };
}

const results = [];
const VPS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };

// ── Home (desktop) — main route, every check runs here.
{
  const { ctx, page, errs, status } = await visit('/', VPS.desktop);
  const checks = [];

  // T2: Source Serif 4 on body copy
  const bodyFont = await page.evaluate(() => {
    const el = document.querySelector('p.text-body-lg') || document.querySelector('p');
    return el ? getComputedStyle(el).fontFamily : '';
  });
  checks.push({ name: 'T2 body uses Source Serif 4', pass: /Source Serif 4/i.test(bodyFont), got: bodyFont });

  // T2: glyph-width probe — Source Serif 4 actually rendered
  const glyphLoaded = await page.evaluate(async () => {
    await document.fonts.ready;
    const measure = (family) => {
      const s = document.createElement('span');
      s.style.cssText = `position:absolute;visibility:hidden;font-family:${family};font-size:120px;font-weight:500;white-space:nowrap`;
      s.textContent = 'Wgmilypq';
      document.body.appendChild(s);
      const w = s.offsetWidth; s.remove(); return w;
    };
    const target = measure(`'Source Serif 4', serif`);
    const fallback = measure(`Georgia, serif`);
    return { target, fallback, distinct: Math.abs(target - fallback) > 1 };
  });
  checks.push({
    name: 'T2 Source Serif 4 glyphs differ from Georgia fallback',
    pass: glyphLoaded.distinct,
    got: glyphLoaded
  });

  // T1: hero display-1 line-height ≥ 1.10
  const heroLH = await page.evaluate(() => {
    const h = document.querySelector('.hero-stage h1.text-display-1');
    if (!h) return null;
    const cs = getComputedStyle(h);
    const fs = parseFloat(cs.fontSize);
    const lh = parseFloat(cs.lineHeight);
    return { fontSize: fs, lineHeight: lh, ratio: lh / fs };
  });
  checks.push({
    name: 'T1 hero line-height ratio ≥ 1.10',
    pass: heroLH && heroLH.ratio >= 1.10,
    got: heroLH
  });

  // T1: hero-stage bottom-padding > 80
  const heroPad = await page.evaluate(() => {
    const s = document.querySelector('.hero-stage');
    return s ? parseFloat(getComputedStyle(s).paddingBottom) : null;
  });
  checks.push({ name: 'T1 hero bottom padding > 80px', pass: heroPad > 80, got: heroPad });

  // T3: broken /#evidence link absent
  const evidenceLinks = await page.evaluate(() =>
    [...document.querySelectorAll('a[href*="evidence"]')].map(a => a.getAttribute('href'))
  );
  checks.push({ name: 'T3 no #evidence link in DOM', pass: evidenceLinks.length === 0, got: evidenceLinks });

  // T3: CredibilityStats still renders 4 stats
  const statCount = await page.evaluate(() => document.querySelectorAll('.stat-card').length);
  checks.push({ name: 'T3 CredibilityStats still shows 4 stats', pass: statCount === 4, got: statCount });

  // T4: yours-next tile present with three echoes + caption + divider
  const yoursTile = await page.evaluate(() => {
    const tile = document.querySelector('.work-tile-yours');
    if (!tile) return { present: false };
    const caption = tile.querySelector('.yours-caption')?.textContent || '';
    const echoes = [...tile.querySelectorAll('.yours-echoes li')].map(li => li.textContent.trim());
    const divider = !!tile.querySelector('.yours-divider');
    const headline = tile.querySelector('.yours-headline')?.textContent || '';
    return { present: true, caption, echoes, divider, headline };
  });
  checks.push({ name: 'T4 yours-next tile present', pass: yoursTile.present, got: !!yoursTile.present });
  checks.push({ name: 'T4 caption includes CHOOSING YOUR PATTERN', pass: /CHOOSING YOUR PATTERN/.test(yoursTile.caption || ''), got: yoursTile.caption });
  checks.push({ name: 'T4 three echo lines present', pass: (yoursTile.echoes || []).length === 3, got: yoursTile.echoes });
  checks.push({ name: 'T4 divider element present', pass: !!yoursTile.divider, got: yoursTile.divider });
  checks.push({ name: 'T4 headline includes "lead with"', pass: /lead with/i.test(yoursTile.headline || ''), got: yoursTile.headline });

  // T5: giant R watermark absent
  const closingMark = await page.evaluate(() => !!document.querySelector('.closing-cta .closing-mark'));
  checks.push({ name: 'T5 .closing-mark (giant R) removed', pass: !closingMark, got: closingMark });

  // T5: walkthrough timeline present with 4 rows
  const tl = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.closing-timeline li')].map(li => ({
      t: li.querySelector('.t')?.textContent,
      lbl: li.querySelector('.lbl')?.textContent,
    }));
    return rows;
  });
  checks.push({ name: 'T5 timeline has 4 rows', pass: tl.length === 4, got: tl });
  checks.push({
    name: 'T5 timeline rows are 0:00 / 5:00 / 10:00 / 15:00',
    pass: tl.length === 4 && tl[0].t === '0:00' && tl[3].t === '15:00',
    got: tl.map(r => r.t).join(', ')
  });

  // T5: italic "no pitch deck" present
  const closingHeadlineHTML = await page.evaluate(() => {
    const h = document.querySelector('.closing-cta .closing-headline');
    return h ? h.innerHTML : '';
  });
  checks.push({
    name: 'T5 "no pitch deck" rendered as italic em.serif',
    pass: /<em[^>]*class="[^"]*serif[^"]*"[^>]*>no pitch deck<\/em>/.test(closingHeadlineHTML),
    got: closingHeadlineHTML.slice(0, 240)
  });

  // T6: nav uses Cormorant wordmark, R-square badge gone
  const navBrand = await page.evaluate(() => {
    const wm = document.querySelector('.nav-brand .wordmark');
    const mk = document.querySelector('.nav-brand .mk');
    if (!wm) return { wordmarkText: null, font: null, hasMk: !!mk };
    const cs = getComputedStyle(wm);
    return { wordmarkText: wm.textContent, font: cs.fontFamily, size: cs.fontSize, hasMk: !!mk };
  });
  checks.push({ name: 'T6 nav wordmark renders "RIVR"', pass: navBrand.wordmarkText === 'RIVR', got: navBrand });
  checks.push({ name: 'T6 nav wordmark uses Cormorant', pass: /Cormorant/i.test(navBrand.font || ''), got: navBrand.font });
  checks.push({ name: 'T6 R-square badge (.nav-brand .mk) removed', pass: navBrand.hasMk === false, got: navBrand.hasMk });

  // T6: active nav link has visible underline (.nav-link.active::after opacity ≈ 1)
  const activeUnderline = await page.evaluate(() => {
    const link = document.querySelector('.nav-link.active');
    if (!link) return null;
    const cs = getComputedStyle(link, '::after');
    return { opacity: cs.opacity, height: cs.height, bg: cs.backgroundColor };
  });
  checks.push({
    name: 'T6 active nav-link underline visible (opacity 1)',
    pass: activeUnderline && parseFloat(activeUnderline.opacity) >= 0.9,
    got: activeUnderline
  });

  const realErrs = errs.filter(e => !NORMAL_WARN.test(e));
  results.push({ route: '/ desktop', status, consoleErrors: realErrs.length, errSamples: realErrs.slice(0, 2), checks });
  await ctx.close();
}

// ── Body-font check on the other three routes
for (const [route, label] of [['/about.html', 'about'], ['/book.html', 'book'], ['/the-build.html', 'the-build']]) {
  const { ctx, page, errs, status } = await visit(route, VPS.desktop);
  const bodyFont = await page.evaluate(() => {
    const el = document.querySelector('p.text-body-lg') || document.querySelector('p');
    return el ? getComputedStyle(el).fontFamily : '';
  });
  const evidenceLinks = await page.evaluate(() =>
    [...document.querySelectorAll('a[href*="#evidence"]')].map(a => a.getAttribute('href'))
  );
  const realErrs = errs.filter(e => !NORMAL_WARN.test(e));
  results.push({
    route: `${label} desktop`,
    status,
    consoleErrors: realErrs.length,
    errSamples: realErrs.slice(0, 2),
    checks: [
      { name: 'T2 body uses Source Serif 4', pass: /Source Serif 4/i.test(bodyFont), got: bodyFont },
      { name: 'no #evidence link', pass: evidenceLinks.length === 0, got: evidenceLinks },
    ],
  });
  await ctx.close();
}

// ── Hero descender check at 390 + 768 + 1440 viewports
for (const [w, h] of [[1440, 900], [768, 1024], [390, 844]]) {
  const { ctx, page, errs, status } = await visit('/', { width: w, height: h });
  const heroLH = await page.evaluate(() => {
    const el = document.querySelector('.hero-stage h1.text-display-1');
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { fs: parseFloat(cs.fontSize), lh: parseFloat(cs.lineHeight) };
  });
  const heroPad = await page.evaluate(() => {
    const s = document.querySelector('.hero-stage');
    return s ? parseFloat(getComputedStyle(s).paddingBottom) : null;
  });
  const maskPadBottom = await page.evaluate(() => {
    const m = document.querySelector('.hero-stage .reveal-mask');
    return m ? parseFloat(getComputedStyle(m).paddingBottom) : null;
  });
  await ctx.close();
  results.push({
    route: `hero descender clearance @ ${w}x${h}`,
    status,
    consoleErrors: 0,
    errSamples: [],
    checks: [
      { name: `display-1 line-height/font ratio ≥ 1.10`, pass: heroLH && heroLH.lh / heroLH.fs >= 1.10, got: heroLH },
      { name: 'reveal-mask padding-bottom > 6px', pass: maskPadBottom > 6, got: maskPadBottom },
      { name: 'hero bottom padding > 80px', pass: heroPad > 80, got: heroPad },
    ],
  });
}

await browser.close();

let allPass = true;
for (const r of results) {
  console.log(`\n=== ${r.route}  (HTTP ${r.status}, ${r.consoleErrors} console errors) ===`);
  if (r.errSamples?.length) console.log('  errs:', r.errSamples);
  for (const c of r.checks) {
    const tag = c.pass ? 'OK ' : 'FAIL';
    if (!c.pass) allPass = false;
    console.log(`  [${tag}] ${c.name}${c.pass ? '' : ` — got: ${JSON.stringify(c.got)}`}`);
  }
}
console.log(`\n${allPass ? '✓ all checks pass' : '✗ some checks failed'}`);
process.exit(allPass ? 0 : 1);
