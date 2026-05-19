#!/usr/bin/env node
// =============================================================================
// capture-prototype.mjs
//
// Regenerates the three Lumera prototype screenshots used across the RIVR site
// at 1440x900 (matching existing imagery dimensions, so no layout shift).
//
// Outputs (overwrites in place):
//   imagery/lumera-hero.png      — "Book your visit with Lumera" booking-section hero
//   imagery/lumera-team.png      — "How would you like to book?" step 1
//   imagery/lumera-calendar.png  — confirmation / "You're booked" screen
//
// USAGE:
//   1) In a sibling Lumera-Prototype checkout:    PORT=5173 npm run dev
//   2) From this repo root:                       npm run capture
//
// Override the prototype URL with --baseUrl=... or PROTOTYPE_URL=... env var.
// =============================================================================
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(REPO_ROOT, "imagery");

const argv = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);

const BASE_URL = argv.baseUrl || process.env.PROTOTYPE_URL || "http://localhost:5173";
const VIEWPORT = { width: 1440, height: 900 };

async function settle(page, ms = 700) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(ms);
}

async function clickByText(page, patterns, settleMs = 350) {
  for (const pat of patterns) {
    const re = pat instanceof RegExp ? pat : new RegExp(pat, "i");
    const handle = page.getByRole("button", { name: re }).first();
    if (await handle.isVisible().catch(() => false)) {
      await handle.click().catch(() => {});
      await page.waitForTimeout(settleMs);
      return true;
    }
    // also try plain text
    const textLoc = page.getByText(re, { exact: false }).first();
    if (await textLoc.isVisible().catch(() => false)) {
      await textLoc.click().catch(() => {});
      await page.waitForTimeout(settleMs);
      return true;
    }
  }
  return false;
}

async function captureHero(page) {
  console.log("→ Capturing hero (top of prototype, marketing PageHero)…");
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
  await settle(page, 1000);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
  await settle(page, 500);
  await page.screenshot({ path: resolve(OUT_DIR, "lumera-hero.png"), fullPage: false });
  console.log("  ✓ lumera-hero.png");
}

async function captureTeam(page) {
  console.log('→ Capturing "How would you like to book?"…');
  // Navigate fresh so booking flow is at step 1.
  await page.goto(`${BASE_URL}#book`, { waitUntil: "domcontentloaded" });
  await settle(page, 900);
  // Scroll a bit further so the step-1 card "How would you like to book?" is in the middle of viewport.
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll("h1,h2,h3"));
    const target = headings.find(h => /how would you like to book/i.test(h.textContent));
    if (target) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
      window.scrollBy({ top: -80, behavior: "auto" });
    }
  });
  await settle(page, 400);
  await page.screenshot({ path: resolve(OUT_DIR, "lumera-team.png"), fullPage: false });
  console.log("  ✓ lumera-team.png");
}

async function captureCalendar(page) {
  // Filename retained for site-import compatibility, but this captures the
  // CheckoutScreen ("Save card and book.") — that's the third tile in the
  // Home Live Demo. We seed the prototype's sessionStorage directly with a
  // checkout-ready state rather than walking the full booking flow, which
  // was fragile (slot picker + intake form selectors).
  console.log("→ Capturing checkout screen (sessionStorage seed)…");
  await page.goto(`${BASE_URL}#book`, { waitUntil: "domcontentloaded" });
  await settle(page, 600);
  await page.evaluate(() => {
    const state = {
      step: "CHECKOUT",
      bookingType: "single",
      serviceId: "hydrafacial",
      seriesId: null,
      returningPatient: false,
      consultFormat: null,
      practitionerId: "reyes",
      appointment: { dateIso: "2026-05-21", slot: "11:00", practitionerId: "reyes" },
      series: null,
      sameDay: null,
      intake: {
        fullName: "Maya Patel",
        email: "maya.patel@example.com",
        phone: "(813) 555-0199",
        dob: "06/15/1993",
        newOrReturning: "new",
        reason: "",
        hearAbout: "Instagram",
        medical: "",
        healthAck: true,
      },
      policyAck: true,
      payment: null,
      history: [],
    };
    sessionStorage.setItem("lumera.bookingState.v1", JSON.stringify(state));
  });
  await page.reload({ waitUntil: "networkidle" });
  await settle(page, 1500);
  await page.evaluate(() => {
    const h = Array.from(document.querySelectorAll("h1,h2")).find((el) =>
      /save card and book|payment|checkout/i.test(el.textContent)
    );
    if (h) h.scrollIntoView({ behavior: "auto", block: "start" });
    window.scrollBy({ top: -30 });
  });
  await settle(page, 400);
  await page.screenshot({ path: resolve(OUT_DIR, "lumera-calendar.png"), fullPage: false });
  console.log("  ✓ lumera-calendar.png (checkout screen)");
}

async function main() {
  console.log(`Capturing Lumera prototype at ${BASE_URL} → ${OUT_DIR}`);
  console.log(`Viewport: ${VIEWPORT.width}x${VIEWPORT.height}\n`);

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, reducedMotion: "no-preference" });
  const page = await ctx.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 8000 });
  } catch (err) {
    console.error(`\nCould not reach ${BASE_URL}.`);
    console.error(`Start the Lumera-Prototype dev server first:`);
    console.error(`  cd /Users/jonasvangura/Lumera-Prototype && PORT=5173 npm run dev\n`);
    await browser.close();
    process.exit(1);
  }

  await captureHero(page);
  await captureTeam(page);
  await captureCalendar(page);

  // Hash-routed standalone mockups — see Lumera-Prototype/src/main.jsx
  // dispatcher. Each navigates to its hash route and snaps a viewport.
  const HASH_ROUTES = [
    { file: "variant-coastline.png",   hash: "variant=coastline"   },
    { file: "variant-studio-vela.png", hash: "variant=studio-vela" },
    { file: "variant-northline.png",   hash: "variant=northline"   },
    { file: "product-step-1.png",      hash: "product-step-1"      },
    { file: "product-step-3.png",      hash: "product-step-3"      },
  ];
  for (const { file, hash } of HASH_ROUTES) {
    console.log(`→ Capturing ${file}…`);
    await page.goto(`${BASE_URL}/#${hash}`, { waitUntil: "domcontentloaded" });
    // Hash-only navigation may not trigger a document reload; main.jsx
    // listens to hashchange + re-renders, but settle gives it a tick.
    await settle(page, 900);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
    await page.waitForTimeout(250);
    await page.screenshot({ path: resolve(OUT_DIR, file), fullPage: false });
    console.log(`  ✓ ${file}`);
  }

  await browser.close();
  console.log("\nDone.");
}

main().catch(async (err) => { console.error(err); process.exit(1); });
