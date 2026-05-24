# RIVR Reskin — Progress Log

This file is appended to across all five reskin streams. Each stream records every
section touched, phrase replaced, and section removed.

---

## Stream A — de-AI rips, copy cleanups, scammy section removal

Branch: `reskin/rivr-web-style` · Base: Phase 1 token swap (`b398a87`)

Stream A is a content-level cleanup pass. No section restructuring (that is Stream C),
no image swaps (Stream B), no typography-weight changes. Verified by a headless walk of
all four pages at 1440px and 390px (0 console errors; the only console warning is the
pre-existing Babel-standalone in-browser-transformer notice inherent to this no-build site).

### Clarifications resolved with the founder before editing

1. **About hero "answer the phone"** — Category 1 rip target, but it lives in hero copy
   Category 9 protects. → **Left for Stream C** (rewriting the 3-line headline needs
   rendered-typography attention).
2. **"You keep the mockup" check** — rendered by the shared `CtaReassure` component (home
   hero, product hero, about contact); a prior commit added a HIPAA line to the same
   component. → **Removed the mockup line everywhere, kept the HIPAA line.**
3. **Support-chat artifact** — it was the visual for Pipeline step 04 ("We stay on call")
   of the 4-step centerpiece. → **Removed step 04 entirely, renumbered the pipeline to 3 steps.**
4. **"15 min / one screen share / no pitch deck" trio** — it is the ClosingCTA `<h2>`
   headline. → **Caption added now ("15 min · no obligation"), trio headline deferred to Stream C.**

---

### Category 1 — AI-tell / availability-promise language

| File | Location | Before | After |
|------|----------|--------|-------|
| `product.jsx` | Pipeline step 04 | `We stay on call.` + body "Text Thor or Jonas directly when something needs adjusting…" | **Removed** (step + visual). See Category 3. |
| `about.jsx` | "We do" list (`WhatWeDo`) | `Stay on call when you need changes.` | `Make changes after launch when you need them.` |
| `about.jsx` | Contact block (`Location`) | `Available 9am to 7pm ET. Replies in under an hour during business hours.` | `We reply within 48 hours, Monday through Friday.` (aligns with the cited 48-hour M–F posture) |
| `home.jsx` / `product.jsx` | Benefits section, "Real humans, immediate support" | instant-response framing | **Removed** with the whole Benefits section (see Category 5). |

- **Deferred (Category 9):** `about.jsx` hero headline still ends "…both answer the phone." —
  flagged for Stream C; not touched this pass.

### Category 2 — word-level fix: "fake" → "mock"

| File | Location | Before | After |
|------|----------|--------|-------|
| `home.jsx` | `LiveDemo` body copy | "Click around, book a **fake** appointment…" | "…book a **mock** appointment…" |
| `product.jsx` | `LiveProto` headline | "Click around. Book a **fake appointment**." | "Click around. Book a **mock appointment**." |

### Category 3 — scammy-reading section rips

- **"You keep the mockup" check** (`app.jsx`, `CtaReassure`): removed the
  `You keep the mockup whether or not we move forward.` list item. Component now renders
  only the HIPAA/BAA line and returns `null` when not requested. Removed the resulting
  empty `CtaReassure` calls from the **home hero** (`home.jsx`) and the **about contact
  block** (`about.jsx`). The HIPAA reassurance on the **product hero** is preserved.
- **Support-chat / text-message artifact** (`product.jsx`, `Pipeline`): removed pipeline
  **step 04** ("We stay on call") and its `pipe-support` chat-message visual (the
  `kind === "support"` branch of `PipelineVisual`). Updated the section intro from
  "**Four** steps from cold email to live booking page" → "**Three** steps…". Step
  numbering, progress ticks, and section height derive from `PIPELINE_STEPS.length`, so
  they updated automatically. Pipeline now ends at step 03 (handoff / live).
- **Prose mockup-keeping — RESOLVED (Stream A cleanup):** the contextual "you keep the
  mockup" phrasing that survived in prose was also removed, per founder follow-up (it
  reads as the same hook-bait):
  - `app.jsx` `ClosingCTA` body: "…show you the booking page we would build for your
    practice, **and you keep the mockup we put together for your practice whether or not
    we move forward**." → "We look at your current setup and show you the booking page we
    would build for your practice." (substantive content kept; gimmick framing removed)
  - `book.jsx` FAQ "Is this a sales call?" answer: "…Otherwise we hang up **and you keep
    the mockup**." → "…Otherwise we hang up — no pitch, no follow-up pressure." (question
    preserved; answer keeps the "not a hard sell" point)

### Category 4 — "15 min / one screen share / no pitch deck" trio

- `app.jsx` `ClosingCTA`: replaced the meta list under the primary CTA
  (`15 minutes · Google Meet`) with the single caption **`15 min · no obligation`**.
- The trio **`<h2>` headline** ("Fifteen minutes, one screen share, no pitch deck.") was
  **left in place and flagged with a `TODO Stream C` comment** — rewriting a display
  headline is typography-sensitive and belongs in Stream C (per founder decision).

### Category 5 — "Built to grow your practice" three-icon-column

- **Found still present** on both home and product (it had not actually been removed in
  the merge pass). **Ripped** from both:
  - `home.jsx`: removed `BENEFITS` const + `Benefits()` component + `<Benefits />` in `Page`.
  - `product.jsx`: removed `BENEFITS_P` const + `BenefitIcon()` + `Benefits()` + `<Benefits />` in `Page`.
- Replaced each with a removal-note comment. This also removed the Category 1
  "Real humans, immediate support" copy.

### Category 6 — stats section: defensive → assertive

- `home.jsx` `CredibilityStats`:
  - Eyebrow `Why this matters` → `The industry standard`.
  - Removed the inline citation superscripts (`<sup>{stat.cite}</sup>` in `StatCard`).
  - Removed the `<ol className="sources">` block and the now-unused `SOURCES` const and
    `cite` keys.
  - Added a discrete **`see evidence →`** link (`.stats-evidence`) at the foot of the
    section, routing to `/#evidence` (placeholder until `/evidence` exists).
  - Statistics themselves (68% / 80% / 38% / ~25% and their labels/bodies) unchanged.
- `styles.css`: replaced the unused `.sources` rules with a discreet `.stats-evidence`
  style (muted, right-aligned, no underline).

### Category 7 — Meet Lumera 3-screenshot section

- `home.jsx` `LiveDemo`: **not killed** (Stream B will populate real screenshots). Added
  the marker comment inside the section:
  `{/* TODO Stream C: restructure as single hover-animated screenshot — currently redundant with hero */}`.
  Structure left intact.

### Category 8 — competitor marquee → integration framing

- `home.jsx` `Marquee`: **already integration-framed** — `aria-label="Calendar systems we
  integrate with"` and a logo set of calendar/booking systems, with **no "competitors we
  beat" copy present**. No visible surrounding header exists to reframe. Left as-is
  (per the "adjust framing minimally / no new marquee copy" guardrail). End-state matches
  the integration intent.

### Categories 9 & 10 — explicitly NOT touched

- Hero headline, eyebrow, and subhead on all pages — unchanged (home hero eyebrow still
  "Online booking systems for medical spas"; about hero still "…both answer the phone").
- Cormorant headline weight — unchanged (still 400).

### Files changed

- `app.jsx` — `CtaReassure` (mockup line removed, HIPAA kept), `ClosingCTA` (caption + trio TODO).
- `home.jsx` — hero CtaReassure removed, stats reframe + citation rip + evidence link,
  fake→mock, LiveDemo TODO, Benefits section removed.
- `product.jsx` — fake→mock, Pipeline step 04 + support artifact removed (3-step), Benefits removed.
- `about.jsx` — "Stay on call" reworded, contact response-time line aligned to 48h posture,
  empty CtaReassure removed.
- `styles.css` — `.sources` → `.stats-evidence`.

### Open items handed forward

- **Stream C:** rewrite the About hero headline (drop "answer the phone"); rewrite the
  ClosingCTA trio headline; restructure Meet Lumera to a single hover-animated screenshot;
  hero copy rewrites; Cormorant weight decision.
- **Stream B:** real Lumera screenshots for the Meet Lumera section.
- **Founder review — RESOLVED (Stream A cleanup):** both items below were addressed in
  the same pass on founder follow-up, since both contradict Logic & Theory posture:
  - Prose "you keep the mockup" removed from the ClosingCTA body and book FAQ (see
    Category 3 above).
  - `product.jsx` FAQ "What if I need changes after launch?" answer rewritten from "Most
    changes … **go live within a day**" → "Text us. Maintenance covers two to three
    changes per quarter — copy edits, image swaps, service catalog updates, new hours. We
    respond within 48 hours, Monday through Friday. Bigger redesigns we scope on a
    follow-up call." (aligns with the $150/mo · 2–3 changes/quarter · 48h M–F posture)

---

## Stream C v1 — three-tile hero, integration section, the build restructure, demo screenshots integrated

Branch: `reskin/rivr-web-style` · Base: Stream A complete (`a245a04`)

Stream C v1 is the deterministic subset of section restructures and demo-screenshot
integration. A Stream C v2 pass will handle the judgment-heavy items (hero typography,
About bio depth, FAQ sharpening, eyebrow review, Meet Lumera kill-or-restructure).

### 1. Hero copy update — `home.jsx`

| Element | Before | After |
|---|---|---|
| Eyebrow | "Online booking systems for medical spas" | "A studio for aesthetic medicine booking" |
| Headline line 1 | "Booking pages that fit" | "Booking flows built around" |
| Headline line 2 | "the system you *already run*." | "how you *already work*." |

Two-line `RevealLines` structure preserved. The serif italic + accent-gold span pattern
was moved from "already run" → "already work" by analogy (otherwise the copy change
would have *removed* an italic accent, violating the Stream C v1 "no italic-accent
changes" guardrail). All other hero copy (body paragraph, both CTAs, sub-line)
unchanged. Typography weight, size, and Cormorant weight all untouched — Stream C v2.

### 2. Hero right-column mockup removed; hero collapsed to single column — `home.jsx`

- Removed the `imagery/hero-animation.html` iframe + the "New booking" and "Synced to
  your calendar" floating chips (the entire right column of the previous two-column
  hero).
- `gridTemplateColumns: "minmax(0,1fr) minmax(0,1.65fr)"` → `"minmax(0,1fr)"`. Hero is
  now a single left-aligned column. The "real demos" hero visual now lives in the new
  `ThreeTileHero` section immediately below.

### 3. New `ThreeTileHero` section — `home.jsx`, `styles.css`

- New section directly below the hero. Eyebrow "THE WORK", then a 3-column grid of
  4:5 portrait tiles, one per demo. Each tile shows the top of that demo's full-page
  screenshot via `object-fit: cover; object-position: 0% 0%`.
- **Hover behavior (CSS-only):** on `:hover`, `object-position` transitions to `0% 80%`
  over 4.5s ease-out, revealing the page as you scroll past it. On hover-end, returns
  to `0% 0%` over 1s ease-out (asymmetric durations via separate transition rules on
  the hover and base states).
- Each tile is a `<a target="_blank">` to its live subdomain
  (`devereaux.rivrsystems.com`, `lumera.rivrsystems.com`, `sela.rivrsystems.com`).
- Captions in mono (`var(--font-mono)`): "DEVEREAUX · SURGICAL", "LUMERA · MULTI-TIER",
  "SELA · RETAIL".
- **Mobile (`max-width: 1024px` or `hover: none`):** grid collapses to single column,
  hover-scroll disabled (`object-position` locked to top via `!important`), and a
  "View live →" pill appears bottom-right of each tile.

### 4. New `IntegrationSection` — `home.jsx`, `styles.css`

- Sits between `ThreeTileHero` and `Marquee`. Eyebrow "INTEGRATION", headline
  "It lives where your patients *already are*.", 2-sentence body explaining the iframe
  embed.
- **Visual:** a mock browser frame (3 traffic-light dots, URL bar "destinmedspa.com/book")
  + a generic practice nav (`DESTIN MED SPA` in Georgia serif + Services/Team/About/Book
  links in a warm-cream register distinct from RIVR's brand cream and from any of the
  three demos), then `imagery/demos/lumera-booking-flow.jpg` embedded below as if it's
  living inside that practice's site.
- Static for this pass — no scroll-driven motion. Stream C v2 may add it.

### 5. SampleWork tiles → real demo hover-cycle images — `home.jsx`

`TILES` data swapped to point at real demo screenshots. The existing `HoverCycle`
fade-cycle structure is intact; per-tile `firstAlt` describes the first image (cycle's
subsequent images use empty alt — they're decorative). All non-`home-desktop-full` to
avoid redundancy with the hero tiles.

| Tile | Old images | New images |
|---|---|---|
| Lumera (consult-first) | lumera-hero, lumera-team, lumera-calendar (synthetic) | demos/lumera-pathfinder, demos/lumera-bento, demos/lumera-explore-treatments |
| Sela (time-first) | sela-1, sela-2, sela-3 (synthetic) | demos/sela-hero, demos/sela-pricemenu, demos/sela-team |
| Devereaux (practitioner-first) | devereaux-1, devereaux-2, devereaux-3 (synthetic) | demos/devereaux-hero, demos/devereaux-procedures-facelift, demos/devereaux-booking-flow |

Also `HoverCycle` invocation: `alt={`${t.brand} booking page — ${t.title}`}` →
`alt={t.firstAlt}`.

### 6. Product → The Build rename

| Change | Locations |
|---|---|
| File rename (via `git mv`) | `product.html → the-build.html`, `product.jsx → the-build.jsx` |
| URL | `/product` → `/the-build` (the old route now returns 404 — clean since no pre-launch SEO traffic) |
| `<title>` + meta | `<title>`, `og:title`, `og:url`, `twitter:title`, `canonical` all updated in `the-build.html` to "RIVR — The Build" / `the-build.html` |
| Script src | `the-build.html` script tag points at `the-build.jsx` |
| Sitemap | `sitemap.xml` entry updated |
| Nav | `app.jsx` Nav link: label "Product"→"The build", href `product.html`→`the-build.html`, id `product`→`the-build` |
| Footer | `app.jsx` Footer site link updated |
| Page composition | `the-build.jsx` Page now passes `<Nav current="the-build" />` |

Historical references in `AUDIT_2026-05-20.md` and `MERGE_2026-05-20.md` left as-is
(those are dated reports of past state, not current source-of-truth).

### 7. /the-build page restructured — `the-build.jsx`

The previous /product page (Hero / LiveProto / Pipeline / Wedge / CalendarShowcase /
FAQSection / ClosingCTA) was fully replaced with a demo-walkthrough architecture:

- **`BuildHero`** — short placeholder intro ("Three practices. / Three different
  *builds*." + a 2-sentence body listing the three demos by register).
  Marked as Stream-C-v2-refinable per spec.
- **3 × `BuildDemoSection`** (Devereaux / Lumera / Sela) — each ~250vh tall with a
  sticky-pinned inner tile (`position: sticky; top: 0; height: 100vh`). The
  full-home screenshot inside each tile is `position: absolute` and its `translateY`
  is bound to `useStickyProgress` (the existing app.jsx hook), so as the user scrolls
  through the section the screenshot pans from top to bottom inside the tile.
- Per-section content: `eyebrow`, `subEyebrow`, big `headline` (Cormorant), 2 short
  body paragraphs, single text CTA ("See X live →") linking to the live subdomain.
- **FAQ section preserved verbatim** from the previous /product page (Stream C v2
  will sharpen — spec NOT-DO).
- ClosingCTA preserved.
- **Mobile fallback:** `.build-stage { height: auto }`, `.build-pin { position: static }`,
  and `.build-tile img { transform: none !important }` flatten the layout to a single
  column with a static screenshot per section. No scroll-driven motion below `lg`.
- **No new dependencies.** Built on the existing `useStickyProgress` hook.

### 8. About: WhatWeDo two-column list → inline prose — `about.jsx`

The previous "We do / We do not" two-column list (3 items each with strike-through
dots on the don'ts) was replaced with a single-column inline prose section under the
eyebrow "Scope". Every item from the source-of-truth list was woven in:

- **Do-items folded in:** "We build personalized booking pages for aesthetic medicine
  practices — consult, service, or membership flows that fit how a given practice
  actually books. We connect each one to the calendar and tools the team already
  runs, host it on the practice's own domain, and make changes after launch as the
  practice changes."
- **Don't-items folded in:** "We don't sell a platform you have to migrate to. No
  per-staff seat fees, no locking your patient data inside our system, no ads, social
  media, or branding services on the side. When something falls outside the
  booking-funnel scope, we refer you to specialists we trust."

The `listItemStyle` / `dotStyle` helpers (only used by the old list) were removed.

### Demo screenshot inventory — `imagery/demos/` (13 files, ~9.9 MB)

Copied verbatim from `C:\Users\thora\rivr-funnels\marketing-screenshots\` (Stream B):

- **Hero tiles + /the-build sections:** `devereaux-home.jpg`, `lumera-home.jpg`, `sela-home.jpg`
- **Integration section embed:** `lumera-booking-flow.jpg`
- **SampleWork hover-cycle (3 per demo):**
  - Devereaux: `devereaux-hero.jpg`, `devereaux-procedures-facelift.jpg`, `devereaux-booking-flow.jpg`
  - Lumera: `lumera-pathfinder.jpg`, `lumera-bento.jpg`, `lumera-explore-treatments.jpg`
  - Sela: `sela-hero.jpg`, `sela-pricemenu.jpg`, `sela-team.jpg`

All JPGs are mozjpeg q88 (from Stream B). Three large files (~1.4–2.9 MB) are the
home-desktop-full captures used by the hero tiles and the build-page panning tiles;
all others are 35–650 KB. Lazy-loaded via `loading="lazy"` on each `<img>`.

### Files touched

- `home.jsx` — Hero copy + single-column collapse, removed right-column iframe + chips,
  added `ThreeTileHero` and `IntegrationSection`, swapped SampleWork `TILES.images` to
  real demos, swapped `HoverCycle` alt to per-tile `firstAlt`.
- `the-build.jsx` (renamed from `product.jsx`) — full rewrite: `BuildHero`,
  `BuildDemoSection` × 3, FAQ preserved, ClosingCTA preserved.
- `the-build.html` (renamed from `product.html`) — title/og/twitter/canonical →
  "The Build", script src → `the-build.jsx`.
- `app.jsx` — Nav link + Footer link Product→"The build".
- `about.jsx` — `WhatWeDo` list→prose, list helpers removed.
- `styles.css` — new CSS for `.work-hero`/`.work-hero-tile`/`.work-hero-caption`/`.work-hero-mobile-cta`, `.integration-section`/`.integration-mock`/`.browser-chrome`/`.practice-nav`, `.build-section`/`.build-stage`/`.build-pin`/`.build-copy`/`.build-tile`, mobile overrides for each.
- `sitemap.xml` — `/product.html` → `/the-build.html`.
- `scripts/verify-stream-c.mjs` — Playwright regression harness for this stream's checks.
- `imagery/demos/` (new) — 13 demo screenshots (~9.9 MB total).

### Verification (Playwright walk via `scripts/verify-stream-c.mjs`)

- All routes load: `/`, `/the-build`, `/about`, `/book` → 200; `/product` → 404 (clean).
- 0 non-benign console errors at desktop (1440×900) and mobile (390×844) across all
  routes (the only message is the Babel-standalone in-browser-transformer notice,
  pre-existing).
- Mobile: no horizontal overflow on `/` or `/the-build`.
- Hero copy verified: new eyebrow + headline + italic-accent placement.
- 3-tile hero: 3 tiles present, each linking to the correct demo subdomain.
- Integration section: brand `DESTIN MED SPA` and URL `destinmedspa.com/book` present.
- /the-build: 3 demo sections with correct Devereaux/Lumera/Sela eyebrows + 3 CTAs +
  3 tile images.
- About: old `.we-do-grid` removed; new prose substance ("aesthetic medicine
  practices", "We don't sell a platform", "per-staff seat fees") all present.
- Old iframe hero mockup and floating chips: gone (0 selector matches).
- Nav: "The build" link present, "Product" link absent.

### Out of scope (Stream C v2 / Stream D)

Explicitly NOT touched in this pass per spec:

- Hero typography weight, size, line-break tuning, Cormorant 400→500/600 — Stream C v2.
- About hero headline ("…both answer the phone."), bio depth, "gap nobody's filling"
  reframe — Stream C v2.
- FAQ sharpening (the /the-build FAQ is preserved verbatim) — Stream C v2.
- Section eyebrow treatment review site-wide — Stream C v2.
- Meet Lumera 3-screenshot section kill-or-restructure (still has Stream A TODO comment) — Stream C v2.
- Mobile section spacing tuning — Stream C v2.
- `/legal`, `/process`, `/evidence` pages — Stream D.

### Notes for Stream C v2

- The /the-build Hero is intentionally placeholder copy. Stream C v2 may rewrite
  headline + body + decide whether the page needs its own primary CTA inside the hero.
- The Meet Lumera 3-screenshot `LiveDemo` section on the home page is now
  *doubly* redundant (the new `ThreeTileHero` and updated `SampleWork` both cover
  it). Stream C v2 should decide: kill, or restructure as a single hover-animated
  showcase per the existing Stream A TODO marker.
- The integration section is static. Stream C v2 may add scroll-driven motion
  (widget materializing into the page, or panning the practice nav as it pins).
- The hero photo collapse to single-column may want a small visual element to its
  right at desktop — Stream C v2 territory.

---

## Stream C v2 (partial) — About rewrite, FAQ sharpening, Meet Lumera removal (items 4–8)

Branch: `reskin/rivr-web-style` · Base: Stream C v1 complete (`91a453a`)

Stream C v2 was scoped as a 12-item polish pass (typography, composition, copy
tone). This commit lands **items 4, 5, 6, 7, 8 only**. Items 2, 3, 9, 10, 11, 12
are deferred to a follow-up session. Item 1 (Cormorant weight bump) was
investigated and found to already be done (display headlines are at `font-weight:
600` from the Phase 1 token swap); the `.serif` italic accent at 400 is the only
Cormorant-at-400 element and is intentional contrast — confirmed with the
founder, item 1 skipped.

### Item 4 — Meet Lumera (LiveDemo) section killed — `home.jsx`

The `LiveDemo` component (`#live-demo` section), the `DEMO_PANELS` data, the
`TiltCard` 3D-tilt wrapper, and the `<LiveDemo />` mount in `Page` were all
removed. Replaced with a comment block documenting the removal. Stream A had
flagged the section with a `TODO Stream C` marker; Stream C v1 made it doubly
redundant by adding `ThreeTileHero` (shows all three demos at top) and updating
`SampleWork` (cycles real demo screenshots); Stream C v2 kills it. Home flow
now reads: Hero → ThreeTileHero → IntegrationSection → Marquee →
CredibilityStats → SampleWork → ClosingCTA.

### Item 5 — About hero rewrite — `about.jsx`

Rewrote the 3-line hero headline (which had been Stream-A-deferred because
"answer the phone" lives in protected hero copy). Picked **Option B** from the
three candidates in the brief:

- Before: "Two co-founders. / Both build, both ship, / both *answer the phone*."
- After:  "Two co-founders. / Both write the code. / Both *talk to clients*."

Option B chosen for specificity — "write code" and "talk to clients" name
concrete activities the way "answer the phone" did, where Options A and C felt
more abstract. Italic-accent pattern preserved by analogy: serif italic +
accent-gold span moves from "answer the phone" → "talk to clients" on line 3.
Three-line `RevealLines` structure intact; weights, sizes, and gap timing
unchanged.

### Item 6 — About bio depth structure with placeholders — `about.jsx`

Both founder bios restructured around the 3-area depth pattern the brief
specified: (1) background, (2) how got into building booking funnels for
aesthetic medicine, (3) what they own day-to-day. Voice held to direct,
coffee-shop register — no "passionate about" or "our mission" framing.

**Substantive content preserved** where it existed (Jonas's FIU Honors College +
Muay Thai; Jonas's gap-seeing motivation; Thor's age-18 framing; Thor's
template-copy-paste critique; the both-of-us-run-checks closing).

**`{/* PLACEHOLDER: ... */}` markers** sit where founder-specific facts need to
be supplied. None of these fabricate biographical detail; they're structural
shells the founder fills:

- **Jonas (3 placeholders):**
  - Specific technical background — when started coding, self-taught vs.
    coursework, favorite stack, first shipped project before RIVR
  - The path to RIVR — how he went from FIU + training to medspa booking
    funnels; who the first med spa conversation was with
  - Day-to-day ownership — what specifically he owns on each build
    (backend? integrations? client onboarding?)
- **Thor (2 placeholders):**
  - Specific technical background — when started coding, first language /
    project, what the year-before-RIVR looked like
  - The path to RIVR — how the first med spa conversation happened, why
    aesthetic medicine vs. another vertical

The bio prose reads structurally complete with the placeholders in line — when
they're filled, the prose flows naturally; when the page renders today, the
JSX-comment placeholders are stripped by Babel and the surrounding sentences
read as-is (slightly shorter, but coherent).

### Item 7 — "Gap nobody's filling" reframe — `about.jsx`

`WhyWeBuilt` paragraphs 1 and 2 rewritten to the middle-positioning frame
specified in the brief. Paragraph 3 (the journey paragraph: "We picked one med
spa to start…") preserved verbatim.

- **Paragraph 1 (the gap, now with named products + prices):**
  - Before: "...The big platforms wanted them to rip out everything... The DIY
    options looked like Google Forms with extra steps."
  - After: "...Practices stuck between a DIY plugin — Squarespace plus a
    booking widget, $500 in setup, that doesn't actually book — and an
    enterprise platform — Boulevard or Mindbody, $30K-plus, requiring a
    migration of the whole operation onto someone else's software. Nothing in
    the middle."
- **Paragraph 2 (the middle as the answer):**
  - Before: "There was not a middle option: a booking page designed for their
    practice that talked to their existing tools..."
  - After: "The middle is what most practices actually need: a booking funnel
    that sits in front of the calendar and EMR they already run, on their own
    domain, with the same pricing and policies they've already worked out. No
    migration, no new software for staff to learn, no per-seat fees. So we
    built that — for practices that have outgrown the template but can't
    justify the enterprise cost."

The original prose was already gap-positioned (not opportunism-positioned, as
the brief premise suggested) — the rewrite sharpens it with the concrete
products/prices the brief target frame called for, rather than reframing from
scratch.

### Item 8 — FAQ sharpening — `book.jsx`, `the-build.jsx`

**`/book` FAQ — 3 → 5 questions:**

- Kept: "What if my current setup is a mess?" (already aesthetic-medicine
  relevant, the answer is on-voice).
- Added: "Will this work with our existing intake forms or patient portal?" —
  same answer pattern as the /the-build version (embed mid-flow or hand off to
  portal; we don't replace intake).
- Added: "Can patients self-schedule their first appointment, or do we want to
  vet them first?" — addresses the concierge-vs-retail decision the prospect
  is implicitly making on the walkthrough call.
- Sharpened: "Do you sign a BAA?" — answer extended with a `<a href="/#legal">See
  /legal</a>` link to a placeholder anchor; spec deferred actual `/legal` page
  to Stream D. The FAQ answer field now accepts JSX so the link renders inline
  (the existing `{item.a}` render handles both strings and JSX children).
- Kept verbatim: "Is this a sales call?" (spec said: "preserve, it's on-voice").

**`/the-build` FAQ — 7 → 7 questions (sharpened, not net-grown):**

- Kept: "Will I have to switch my current calendar?"
- Sharpened question text only: "What if my calendar **is not** in your list…"
  → "What if my calendar **isn't** in your list…" (small contraction tightening).
- **Combined** two Qs into one ("How long until it's live?" + "Who hosts the
  booking page?" → "How long until it's live, **and where does it live**?")
  — the hosting answer wasn't pulling enough weight as a standalone question;
  folded into the launch-timeline answer.
- Kept: "What happens if a patient books a time we are not actually available?"
- **Added**: "What if we don't have a Good Faith Exam workflow in place?" — a
  practice-specific concern unique to aesthetic medicine. Answer describes the
  "requires consult" lane RIVR can build for new-patient bookings.
- **Added**: "Will this work with our existing intake forms or patient portal?"
  — same answer as the /book version.
- **Removed**: "Can I see the booking page on my phone the way patients will?"
  — generic, not aesthetic-medicine-specific; trimmed per spec ("better 6 sharp
  than 12 generic").
- Kept verbatim: "What if I need changes after launch?" (Stream A had already
  aligned this with the 48h M–F · 2–3 changes/quarter posture; confirmed
  consistent with documented maintenance posture per spec).

### Verified (lightweight, no-build static site)

- All four routes return HTTP 200: `/`, `/about`, `/book`, `/the-build`.
- React mounts cleanly on each route (verified via headless Playwright with
  explicit wait for `#root` to populate — Babel-standalone is async, naive
  `networkidle` can fire before mount).
- **0 non-benign console errors across all routes** (only the pre-existing
  Babel-standalone in-browser-transformer warning).
- Hero eyebrow + headline render with expected text.
- `#live-demo` (Meet Lumera anchor) no longer present on home page — Item 4
  removal confirmed.

### Items deferred to follow-up session

Surfaced explicitly so they're not lost:

- **Item 1 (Cormorant weight):** investigated, found already-done (display
  headlines at 600; .serif italic accents at 400 by deliberate convention).
  Confirmed with founder, item skipped — not deferred, **closed**.
- **Items 2 + 3 (hero line-break verification + composition judgment):**
  partially started. Confirmed via DOM measurement at 1440 and 768 that the
  break lands at "around" and the italic "*already work*" sits on line 2 with
  "how you" at both viewports (no wrap, no orphan). Mobile (390) not yet
  verified. Composition judgment (Path A vs Path B: leave spare vs. add mono
  technical detail block) **not yet decided** — early read suggested Path B
  warranted but no implementation written. **No partial work in the working
  tree** for Item 3 — clean.
- **Item 9 (section eyebrow consistency audit):** not started.
- **Item 10 (mobile section spacing tuning):** not started.
- **Item 11 (IntegrationSection scroll-driven motion):** not started.
- **Item 12 (cross-page consistency final check):** not started.

### Files touched

- `home.jsx` — Item 4 (Meet Lumera removal + composition comment block).
- `about.jsx` — Items 5 (hero), 6 (bios w/ PLACEHOLDERs), 7 (gap reframe).
- `book.jsx` — Item 8 (/book FAQ 3 → 5, BAA → /#legal link, JSX answer support).
- `the-build.jsx` — Item 8 (/the-build FAQ sharpened, 7 → 7 with content swap).

### Notes for the follow-up session

- The bios contain 5 PLACEHOLDER markers awaiting founder input. They're JSX
  comments so they don't render — the page reads naturally today and gains
  detail when filled.
- The `/#legal` anchor in the /book BAA answer is a placeholder until Stream D
  ships `/legal`. Update both `/book` and `/the-build` FAQ answers that
  reference compliance once `/legal` exists.
- The follow-up session should re-investigate Item 1 framing — the prompt's
  premise didn't match codebase reality. If the founder concern is the italic
  accent looking thin, bump `.serif` from 400 → 500. Otherwise leave.
- Items 2 + 3 are interrelated: any decision to add a right-side mono detail
  block (Path B) affects how the headline wraps and may also force a line-break
  tweak at mid-viewport widths. Handle together.
