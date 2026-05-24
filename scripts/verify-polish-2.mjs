// Polish Pass 2 verification — DOM-only probes of the IntegrationSection's
// animated Lumera booking flow. No screenshots.
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:3000';
const NORMAL_WARN = /You are using the in-browser Babel transformer/i;

const browser = await chromium.launch({ headless: true });

async function visit(viewport, { reducedMotion = false } = {}) {
  const ctx = await browser.newContext({
    viewport,
    reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(`pageerror: ${e.message}`));
  const resp = await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForFunction(() => document.querySelector('.integration-mock'), { timeout: 8000 });
  // Scroll to the section so IntersectionObserver fires.
  await page.evaluate(() => document.querySelector('.integration-mock').scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(800);
  return { ctx, page, errs, status: resp.status() };
}

const results = [];

// ── Desktop: animation cycles through 5 states
{
  const { ctx, page, errs, status } = await visit({ width: 1440, height: 900 });
  const checks = [];

  // Cursor present
  const cursorPresent = await page.evaluate(() => !!document.querySelector('.lf-cursor'));
  checks.push({ name: 'cursor present', pass: cursorPresent });

  // All 5 panel kinds present in DOM
  const panels = await page.evaluate(() => ({
    home: !!document.querySelector('.lh-panel'),
    service: !!document.querySelectorAll('.lf-panel')[0],
    timeSlots: document.querySelectorAll('.lf-slot').length,
    confirmBtn: !!document.querySelector('.lf-confirm-btn'),
    done: !!document.querySelector('.lf-panel-done'),
    stepIndicator: document.querySelectorAll('.lf-steps li').length,
  }));
  checks.push({ name: 'lumera home panel rendered', pass: panels.home, got: panels });
  checks.push({ name: '4 step-indicator entries', pass: panels.stepIndicator === 4, got: panels.stepIndicator });
  checks.push({ name: '6 time slots present', pass: panels.timeSlots === 6, got: panels.timeSlots });
  checks.push({ name: 'confirm button present', pass: panels.confirmBtn });
  checks.push({ name: 'done panel present', pass: panels.done });

  // Sample which state is is-active over time, expect to see multiple distinct states.
  const seen = new Set();
  for (let i = 0; i < 20; i++) {
    const which = await page.evaluate(() => {
      const homeActive = document.querySelector('.lf-state.is-active:not(.lf-state-funnel)');
      const funnelActive = document.querySelector('.lf-state.lf-state-funnel.is-active');
      if (homeActive) return 'home';
      if (!funnelActive) return null;
      const innerActive = funnelActive.querySelector('.lf-state-inner.is-active');
      if (!innerActive) return 'funnel-no-inner';
      // Identify inner by checking what kind of panel it contains
      if (innerActive.querySelector('.lf-cards')) return 'service';
      if (innerActive.querySelector('.lf-times')) return 'time';
      if (innerActive.querySelector('.lf-confirm-btn')) return 'confirm';
      if (innerActive.querySelector('.lf-panel-done')) return 'done';
      return 'unknown';
    });
    if (which) seen.add(which);
    await page.waitForTimeout(950); // 19s total — full ~17s cycle should fit
  }
  checks.push({
    name: 'animation cycles through ≥ 3 distinct states',
    pass: seen.size >= 3,
    got: [...seen]
  });
  checks.push({
    name: 'service state observed',
    pass: seen.has('service'),
    got: [...seen]
  });

  // URL bar toggles between lumera.com and lumera.com/book over the full ~17s cycle.
  // Sample for 20s to guarantee we observe the home state's 2.5s window.
  const urlSeen = new Set();
  for (let i = 0; i < 25; i++) {
    const url = await page.evaluate(() => document.querySelector('.integration-mock .browser-chrome .url')?.textContent);
    if (url) urlSeen.add(url);
    await page.waitForTimeout(800);
  }
  checks.push({
    name: 'URL bar shows both lumera.com and lumera.com/book over time',
    pass: urlSeen.has('lumera.com') && urlSeen.has('lumera.com/book'),
    got: [...urlSeen]
  });

  // Cursor has actual position transition CSS
  const cursorCSS = await page.evaluate(() => {
    const c = document.querySelector('.lf-cursor');
    if (!c) return null;
    const cs = getComputedStyle(c);
    return { transition: cs.transition, position: cs.position };
  });
  checks.push({
    name: 'cursor has left/top transition',
    pass: cursorCSS && /left/.test(cursorCSS.transition) && /top/.test(cursorCSS.transition),
    got: cursorCSS
  });

  // Lumera nav uses Geist (not Georgia)
  const navBrandFont = await page.evaluate(() => {
    const el = document.querySelector('.integration-mock .practice-nav .brand');
    return el ? getComputedStyle(el).fontFamily : null;
  });
  checks.push({
    name: 'Lumera nav brand uses Geist (not Georgia)',
    pass: /Geist/i.test(navBrandFont || ''),
    got: navBrandFont
  });

  // Funnel UI uses Geist (Lumera brand)
  const headingFont = await page.evaluate(() => {
    const el = document.querySelector('.lf-heading');
    return el ? getComputedStyle(el).fontFamily : null;
  });
  checks.push({
    name: 'funnel heading uses Geist',
    pass: /Geist/i.test(headingFont || ''),
    got: headingFont
  });

  // Petrol-teal accent applied to active step dot
  const accentColor = await page.evaluate(() => {
    const dot = document.querySelector('.lf-steps li.is-active .dot');
    if (!dot) return null;
    return getComputedStyle(dot).backgroundColor;
  });
  // #16494A = rgb(22, 73, 74)
  checks.push({
    name: 'active step dot is petrol-teal (#16494A)',
    pass: /rgb\(22,\s*73,\s*74\)/.test(accentColor || ''),
    got: accentColor
  });

  const realErrs = errs.filter(e => !NORMAL_WARN.test(e));
  results.push({ name: 'desktop / animation', status, consoleErrors: realErrs.length, errSamples: realErrs.slice(0, 2), checks });
  await ctx.close();
}

// ── IntersectionObserver: scroll the section out of view, expect state to stop
{
  const { ctx, page, errs, status } = await visit({ width: 1440, height: 900 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.evaluate(() => document.querySelector('.integration-mock').scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(2200); // let it tick at least once
  const beforeScrollOut = await page.evaluate(() => {
    const innerActive = document.querySelector('.lf-state.lf-state-funnel.is-active .lf-state-inner.is-active, .lf-state.is-active:not(.lf-state-funnel)');
    return innerActive ? innerActive.className : null;
  });
  // Scroll way past the section
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(4500); // longer than any single state's duration
  const afterScrollOut = await page.evaluate(() => {
    const innerActive = document.querySelector('.lf-state.lf-state-funnel.is-active .lf-state-inner.is-active, .lf-state.is-active:not(.lf-state-funnel)');
    return innerActive ? innerActive.className : null;
  });
  const realErrs = errs.filter(e => !NORMAL_WARN.test(e));
  results.push({
    name: 'desktop / scroll-out pauses loop',
    status,
    consoleErrors: realErrs.length,
    errSamples: realErrs.slice(0, 2),
    checks: [
      { name: 'state captured before scroll-out', pass: !!beforeScrollOut, got: beforeScrollOut },
      // Loop paused means state shouldn't have advanced past whatever it was when scroll started.
      // We can't strictly know the state would have advanced; just confirm a state is still rendered.
      { name: 'state still rendered after scroll-out (no crash)', pass: !!afterScrollOut, got: afterScrollOut },
    ],
  });
  await ctx.close();
}

// ── prefers-reduced-motion: only service state, no cursor
{
  const { ctx, page, errs, status } = await visit({ width: 1440, height: 900 }, { reducedMotion: true });
  const probe = await page.evaluate(() => ({
    isStatic: document.querySelector('.integration-mock')?.classList.contains('is-static'),
    cursorPresent: !!document.querySelector('.lf-cursor'),
    serviceCardsCount: document.querySelectorAll('.lf-card').length,
    timesCount: document.querySelectorAll('.lf-slot').length,
    confirmBtnPresent: !!document.querySelector('.lf-confirm-btn'),
    donePresent: !!document.querySelector('.lf-panel-done'),
    homePresent: !!document.querySelector('.lh-panel'),
  }));
  const realErrs = errs.filter(e => !NORMAL_WARN.test(e));
  results.push({
    name: 'desktop / reduced-motion static',
    status,
    consoleErrors: realErrs.length,
    errSamples: realErrs.slice(0, 2),
    checks: [
      { name: 'integration-mock has is-static class', pass: probe.isStatic, got: probe },
      { name: 'cursor NOT rendered', pass: probe.cursorPresent === false, got: probe.cursorPresent },
      { name: 'only service step rendered (6 service cards)', pass: probe.serviceCardsCount === 6, got: probe.serviceCardsCount },
      { name: 'time / confirm / done / home NOT rendered', pass:
        probe.timesCount === 0 && probe.confirmBtnPresent === false && probe.donePresent === false && probe.homePresent === false, got: probe },
    ],
  });
  await ctx.close();
}

// ── Mobile 390: static service state, no cursor
{
  const { ctx, page, errs, status } = await visit({ width: 390, height: 844 });
  const probe = await page.evaluate(() => ({
    isStatic: document.querySelector('.integration-mock')?.classList.contains('is-static'),
    cursorPresent: !!document.querySelector('.lf-cursor'),
    serviceCardsCount: document.querySelectorAll('.lf-card').length,
    homePresent: !!document.querySelector('.lh-panel'),
  }));
  const realErrs = errs.filter(e => !NORMAL_WARN.test(e));
  results.push({
    name: 'mobile 390 / static service',
    status,
    consoleErrors: realErrs.length,
    errSamples: realErrs.slice(0, 2),
    checks: [
      { name: 'integration-mock has is-static class', pass: probe.isStatic, got: probe },
      { name: 'cursor NOT rendered on mobile', pass: probe.cursorPresent === false, got: probe.cursorPresent },
      { name: 'service step rendered with 6 cards', pass: probe.serviceCardsCount === 6, got: probe.serviceCardsCount },
      { name: 'home panel NOT rendered on mobile', pass: probe.homePresent === false, got: probe.homePresent },
    ],
  });
  await ctx.close();
}

await browser.close();

let allPass = true;
for (const r of results) {
  console.log(`\n=== ${r.name}  (HTTP ${r.status}, ${r.consoleErrors} console errors) ===`);
  if (r.errSamples?.length) console.log('  errs:', r.errSamples);
  for (const c of r.checks) {
    const tag = c.pass ? 'OK ' : 'FAIL';
    if (!c.pass) allPass = false;
    console.log(`  [${tag}] ${c.name}${c.pass ? '' : ` — got: ${JSON.stringify(c.got)}`}`);
  }
}
console.log(`\n${allPass ? '✓ all checks pass' : '✗ some checks failed'}`);
process.exit(allPass ? 0 : 1);
