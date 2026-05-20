#!/usr/bin/env node
// =============================================================================
// gen-assets.mjs — one-off generator for social card + favicons.
// Renders HTML in headless Chromium (already a dep via playwright) and snaps
// PNGs. Re-runnable; overwrites in place.
//
//   node scripts/gen-assets.mjs
//
// Outputs:
//   imagery/og-image.png        1200x630  social/link-preview card
//   imagery/favicon-32.png        32x32    browser tab icon
//   imagery/apple-touch-icon.png 180x180   iOS home-screen icon
// =============================================================================
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", "imagery");

const CREAM = "#FAFAFA";
const INK = "#111111";
const ACCENT = "#C9A875";
const MUTED = "#525252";

// Brand "R" mark — accent rounded square, white italic serif R.
const mark = (size, radius) => `
  <div style="width:${size}px;height:${size}px;border-radius:${radius}px;background:${ACCENT};
              display:flex;align-items:center;justify-content:center;
              box-shadow:0 8px 24px -10px rgba(201,168,117,0.7);">
    <span style="font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-weight:600;
                 color:#fff;font-size:${Math.round(size * 0.62)}px;line-height:1;">R</span>
  </div>`;

const FONT_LINK = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">`;

const ogHtml = `<!doctype html><html><head><meta charset="utf-8">${FONT_LINK}
<style>*{margin:0;padding:0;box-sizing:border-box}</style></head>
<body style="width:1200px;height:630px;background:${CREAM};position:relative;overflow:hidden;
             font-family:'Inter',system-ui,sans-serif;">
  <div style="position:absolute;inset:0;
       background-image:linear-gradient(to right,rgba(0,0,0,0.045) 1px,transparent 1px),
                        linear-gradient(to bottom,rgba(0,0,0,0.045) 1px,transparent 1px);
       background-size:64px 64px;
       -webkit-mask-image:radial-gradient(ellipse 70% 60% at 70% 35%,#000 30%,transparent 80%);"></div>
  <div style="position:absolute;inset:-10%;
       background:radial-gradient(ellipse 45% 40% at 78% 32%,rgba(201,168,117,0.20),transparent 60%);"></div>
  <div style="position:relative;height:100%;display:flex;flex-direction:column;justify-content:center;
              padding:0 96px;">
    <div style="display:flex;align-items:center;gap:18px;margin-bottom:40px;">
      ${mark(64, 16)}
      <span style="font-size:34px;font-weight:600;letter-spacing:-0.02em;color:${INK};">RIVR Systems</span>
    </div>
    <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-weight:600;font-size:78px;
               line-height:1.04;letter-spacing:-0.01em;color:${INK};max-width:900px;">
      Booking funnels for<br><span style="font-style:italic;color:${ACCENT};">aesthetic medicine</span> practices.
    </h1>
    <p style="margin-top:34px;font-size:25px;color:${MUTED};max-width:760px;line-height:1.4;">
      Custom booking pages that fit the calendar you already run. Florida &amp; the Southeast.
    </p>
  </div>
</body></html>`;

const iconHtml = (size, radius) => `<!doctype html><html><head><meta charset="utf-8">${FONT_LINK}
<style>*{margin:0;padding:0}</style></head>
<body style="width:${size}px;height:${size}px;">${mark(size, radius)}</body></html>`;

async function snap(page, html, w, h, file) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(html, { waitUntil: "networkidle" }).catch(() => {});
  // Give webfonts a beat (falls back to Georgia if offline).
  await page.waitForTimeout(600);
  await page.screenshot({ path: resolve(OUT, file), clip: { x: 0, y: 0, width: w, height: h } });
  console.log("  ✓ " + file);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ deviceScaleFactor: 1 });
console.log("Generating brand assets → " + OUT);
await snap(page, ogHtml, 1200, 630, "og-image.png");
await snap(page, iconHtml(32, 7), 32, 32, "favicon-32.png");
await snap(page, iconHtml(180, 40), 180, 180, "apple-touch-icon.png");
await browser.close();
console.log("Done.");
