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
