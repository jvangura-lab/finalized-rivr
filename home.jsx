// =============================================================================
// HOME page — Hero (single column), ThreeTileHero, IntegrationSection,
// Marquee, CredibilityStats (count-up), SampleWork (horizontal scroll),
// ClosingCTA. (Meet Lumera LiveDemo removed in Stream C v2; Benefits
// three-icon section removed in Stream A.)
// =============================================================================
const { useState: useStateH, useEffect: useEffectH, useRef: useRefH, useLayoutEffect: useLayoutEffectH } = React;
const {
  useReveal, useScrollProgress, useStickyProgress, useMousePos, useCountUp, usePrototypeModal,
  clamp, lerp, mix,
  Reveal, FadeUp, RevealLines, Nav, Button, Footer, BrowserFrame, ClosingCTA, Cursor, PrototypeModal, CtaReassure,
} = window;

// Modal context — opened/closed once per page so multiple CTAs share state.
const PrototypeModalContext = React.createContext({ open: false, openModal: () => {}, closeModal: () => {} });

// ─── Hero (Polish 3 / Task 1 — problem-focused before/after rebuild) ─────────
// Replaces the previous editorial single-column hero ("Booking flows built
// around how you already work."). Cold-email recipients are skeptical and
// skim; the editorial hero buried the value proposition. This hero leads with
// the dollar-cost problem in the headline (lost patients = lost revenue),
// validates with the body copy, and uses a concrete before/after visual to
// make the abstract claim immediate: broken contact-form-style booking page
// on the left, a tight fragment of the RIVR funnel on the right.
function Hero() {
  const [stageRef, rawProgress] = useScrollProgress();
  const progress = clamp((rawProgress - 0.5) * 2, 0, 1);
  const mouse = useMousePos({ smooth: 0.08 });

  // Hero copy fade as you scroll past
  const copyOpacity = clamp(1 - progress * 1.2, 0, 1);
  const copyY = -progress * 24;

  // Mouse-driven spotlight (kept from previous hero — soft warm halo behind)
  const spotX = 50 + mouse.x * 18;
  const spotY = 36 + mouse.y * 14;

  // Polish 5 / Task 2: 6-second narrative loop on the before/after visual.
  // IntersectionObserver toggles the `is-animating` class on .hero-v3-visual
  // so the keyframes only run when the hero is in view. Reveal already owns
  // its own ref on that element; we query into the stage instead of trying
  // to share refs. prefers-reduced-motion fallback lives in CSS (animations
  // suppressed; final-state contrast still visible).
  useEffectH(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const visual = stage.querySelector(".hero-v3-visual");
    if (!visual) return;
    if (typeof IntersectionObserver === "undefined") {
      visual.classList.add("is-animating");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) visual.classList.add("is-animating");
        else visual.classList.remove("is-animating");
      }),
      { threshold: 0.2 }
    );
    io.observe(visual);
    return () => io.disconnect();
  }, [stageRef]);

  return (
    <section
      ref={stageRef}
      className="hero-stage hero-v3"
      style={{ "--mx": `${spotX}%`, "--my": `${spotY}%`, opacity: "1" }}>

      <div className="hero-grid-bg" aria-hidden />
      <div className="hero-spotlight" aria-hidden />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div
          className="hero-v3-grid"
          style={{
            opacity: copyOpacity,
            transform: `translateY(${copyY}px)`,
            transition: "opacity 80ms linear",
            willChange: "transform, opacity",
          }}>
          {/* Left column — headline + sub + CTAs (no eyebrow per spec) */}
          <div className="hero-v3-copy">
            <RevealLines
              as="h1"
              className="text-display-1 hero-v3-headline"
              baseDelay={60}
              gap={90}
              lines={[
                <>Your booking page is</>,
                <>costing you</>,
                <><span className="hero-v3-emph">1 in 4 patients</span>.</>,
              ]} />

            <Reveal delay={420}>
              <p className="text-body-lg hero-v3-sub">
                Most med spa booking pages are a "Book a Call" button or a contact form. ~25% of patients abandon when scheduling isn't simple. We build a custom booking funnel that replaces that broken page — matched to your practice, integrated with your existing calendar.
              </p>
            </Reveal>

            <Reveal delay={540}>
              <div className="hero-v3-cta-row">
                <Button href="book.html" variant="primary">Book a 15-min walkthrough</Button>
                <a href="#reference-builds" className="hero-v3-cta-secondary">
                  <span>See the live prototypes</span>
                  <span className="arr" aria-hidden>↓</span>
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right column — single full-width stage cycling three states (Polish 7).
              Replaces the previous side-by-side .hero-v3-broken + .hero-v3-after
              layout. The chevron arrow between panels is gone: sequential
              storytelling through time substitutes for the spatial directional
              cue. Each of the three child states is absolutely positioned inside
              the stage so they overlap and crossfade via opacity + transform.
              Cycle: ~15s loop, gated by IntersectionObserver via .is-animating. */}
          <Reveal delay={620} className="hero-v3-visual" aria-hidden>
            <div className="hero-v3-stage">

              {/* STATE 1 — Phone-only "Call to book" booking page (~4s).
                  Looks like a real page someone might have on their site.
                  Cormorant serif brand, Inter sans content, neutral grays —
                  intentionally not-RIVR. */}
              <div className="hero-v3-state hero-v3-state-phone">
                <div className="hero-v3-state-head">
                  <span className="hero-v3-state-brand">COASTAL AESTHETIC STUDIO</span>
                </div>
                <div className="hero-v3-state-body hero-v3-phone-body">
                  <p className="hero-v3-state-eyebrow">Book an appointment</p>
                  <h3 className="hero-v3-state-h3">Call us to schedule your visit.</h3>
                  <div className="hero-v3-phone-cta">
                    <span className="hero-v3-phone-icon" aria-hidden>
                      <svg viewBox="0 0 24 24" width="28" height="28">
                        <path
                          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none" />
                      </svg>
                    </span>
                    <span className="hero-v3-phone-num">(305) 555-0148</span>
                  </div>
                  <p className="hero-v3-phone-hours">Mon&#8211;Fri 9am&#8211;6pm &middot; Sat 10am&#8211;4pm</p>
                  <p className="hero-v3-phone-location">
                    <em>Or visit our location at 4016 South Third Street, Jacksonville Beach, FL</em>
                  </p>
                </div>
                <div className="hero-v3-state-foot">
                  <span>&copy; Coastal Aesthetic Studio</span>
                </div>
                <div className="hero-v3-state-overlay" aria-hidden>
                  <span>Doesn't call</span>
                  <small>&rarr; books elsewhere</small>
                </div>
              </div>

              {/* STATE 2 — Contact form "Request an Appointment" page (~4s).
                  A DIFFERENT templated practice — "Magnolia Wellness Co." —
                  with a warm-neutral dove-gray + taupe palette so it reads
                  as a different template from State 1's slate/navy Coastal.
                  Form remains intentionally generic — no design polish, no
                  real-time validation, no animations beyond the typing. */}
              <div className="hero-v3-state hero-v3-state-form">
                <div className="hero-v3-state-head">
                  <span className="hero-v3-state-brand">Magnolia Wellness Co.</span>
                </div>
                <div className="hero-v3-state-body hero-v3-form-body">
                  <h3 className="hero-v3-state-h3">Request an Appointment</h3>
                  <p className="hero-v3-state-sub">
                    Fill out the form below and we&rsquo;ll get back to you within 1&ndash;3 business days.
                  </p>
                  <div className="hero-v3-form-grid">
                    <div className="hero-v3-form-field">
                      <label>Name</label>
                      <div className="inp">
                        <span className="hero-v3-typing" aria-hidden>Sarah</span>
                        <span className="hero-v3-caret" aria-hidden />
                      </div>
                    </div>
                    <div className="hero-v3-form-field"><label>Phone</label><div className="inp" /></div>
                    <div className="hero-v3-form-field"><label>Email</label><div className="inp" /></div>
                    <div className="hero-v3-form-field"><label>Preferred Date</label><div className="inp" /></div>
                    <div className="hero-v3-form-field"><label>Preferred Time</label><div className="inp" /></div>
                    <div className="hero-v3-form-field hero-v3-form-full"><label>Services Interested In</label><div className="inp select" /></div>
                    <div className="hero-v3-form-field hero-v3-form-full"><label>Message</label><div className="inp tall" /></div>
                  </div>
                  <button type="button" tabIndex={-1} className="hero-v3-form-submit">Submit</button>
                </div>
                <div className="hero-v3-state-foot">
                  <span>&copy; Magnolia Wellness Co.</span>
                </div>
                <div className="hero-v3-state-overlay" aria-hidden>
                  <span>Doesn't submit</span>
                  <small>&rarr; books elsewhere</small>
                </div>
              </div>

              {/* STATE 3 — RIVR funnel resolution (~7s with new initial click
                  beat). Geist sans, walnut accents, off-white surface — the
                  contrast with States 1+2 reads instantly. Sequence: cursor
                  glides into the Injectables card on entry → click → card
                  highlights → step indicator advances through Service →
                  Time → Confirm → Done. */}
              <div className="hero-v3-state hero-v3-state-funnel">
                <div className="hero-v3-funnel-head">
                  <span className="hero-v3-funnel-brand">Your Practice</span>
                </div>
                {/* Polish 9: initial cursor-click beat. Glides into the
                    Injectables card, pulses on click, then fades. Highlight
                    state on the card itself is gated by a separate keyframe
                    so the card looks idle until this click lands. */}
                <div className="hero-v3-funnel-cursor" aria-hidden>
                  <svg viewBox="0 0 22 22" width="22" height="22">
                    <path
                      d="M4 2 L4 17 L8 13.5 L10.5 19 L13 18 L10.5 12.5 L16 12 Z"
                      fill="#2B2620"
                      stroke="#FFFFFF"
                      strokeWidth="0.8"
                      strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="hero-v3-funnel-stepbar">
                  <span className="hero-v3-funnel-stepcount">
                    <span className="step-label step-label-1">STEP 1 of 4</span>
                    <span className="step-label step-label-2">STEP 2 of 4</span>
                    <span className="step-label step-label-3">STEP 3 of 4</span>
                    <span className="step-label step-label-4">STEP 4 of 4</span>
                  </span>
                  <ol className="hero-v3-funnel-steps">
                    <li className="step-dot step-dot-1"><span className="dot" /></li>
                    <li className="step-dot step-dot-2"><span className="dot" /></li>
                    <li className="step-dot step-dot-3"><span className="dot" /></li>
                    <li className="step-dot step-dot-4"><span className="dot" /></li>
                  </ol>
                </div>
                <div className="hero-v3-funnel-body">

                  {/* Step 1 view — service selection */}
                  <div className="hero-v3-funnel-view hero-v3-funnel-service">
                    <p className="hero-v3-funnel-eyebrow">Step 1 &mdash; Service</p>
                    <h3 className="hero-v3-funnel-title">Select a service</h3>
                    <p className="hero-v3-funnel-sub">Earliest availability, in real time.</p>
                    <div className="hero-v3-funnel-cards">
                      <article className="hero-v3-funnel-card is-highlight">
                        <div className="row">
                          <h4>Injectables</h4>
                          <span className="price">from $450</span>
                        </div>
                        <p>Botox, fillers, biostimulators.</p>
                        <div className="meta">
                          <span className="dot" />
                          <span>Next: Wed 10:00 AM</span>
                        </div>
                      </article>
                      <article className="hero-v3-funnel-card">
                        <div className="row">
                          <h4>Skin</h4>
                          <span className="price">from $180</span>
                        </div>
                        <p>Facials, peels, skin renewal.</p>
                        <div className="meta">
                          <span className="dot" />
                          <span>Next: Tue 2:30 PM</span>
                        </div>
                      </article>
                      <div className="hero-v3-funnel-more" aria-hidden>+ 4 more services</div>
                    </div>
                  </div>

                  {/* Step 2 view — time slot selection */}
                  <div className="hero-v3-funnel-view hero-v3-funnel-time">
                    <p className="hero-v3-funnel-eyebrow">Step 2 &mdash; Time</p>
                    <h3 className="hero-v3-funnel-title">Pick your time</h3>
                    <p className="hero-v3-funnel-sub">Showing earliest available.</p>
                    <div className="hero-v3-funnel-times">
                      <button type="button" tabIndex={-1} className="hero-v3-funnel-slot slot-1 is-highlight">
                        <span className="day">Wed</span><span className="time">10:00 AM</span>
                      </button>
                      <button type="button" tabIndex={-1} className="hero-v3-funnel-slot slot-2">
                        <span className="day">Wed</span><span className="time">2:30 PM</span>
                      </button>
                      <button type="button" tabIndex={-1} className="hero-v3-funnel-slot slot-3">
                        <span className="day">Thu</span><span className="time">9:00 AM</span>
                      </button>
                      <button type="button" tabIndex={-1} className="hero-v3-funnel-slot slot-4">
                        <span className="day">Thu</span><span className="time">1:00 PM</span>
                      </button>
                    </div>
                  </div>

                  {/* Step 3 view — confirm booking summary */}
                  <div className="hero-v3-funnel-view hero-v3-funnel-confirm">
                    <p className="hero-v3-funnel-eyebrow">Step 3 &mdash; Confirm</p>
                    <h3 className="hero-v3-funnel-title">Confirm your booking</h3>
                    <p className="hero-v3-funnel-sub">Review the details below.</p>
                    <dl className="hero-v3-funnel-summary">
                      <div><dt>Service</dt><dd>Injectables &middot; Botox</dd></div>
                      <div><dt>Time</dt><dd>Wed, May 27 &middot; 10:00 AM</dd></div>
                      <div><dt>Practitioner</dt><dd>Sofia Reyes, NP</dd></div>
                      <div><dt>Duration</dt><dd>45 min</dd></div>
                    </dl>
                    <button type="button" tabIndex={-1} className="hero-v3-funnel-confirm-btn">
                      Confirm booking
                      <span className="arr" aria-hidden>&rarr;</span>
                    </button>
                  </div>

                  {/* Step 4 view — booking confirmed payoff beat */}
                  <div className="hero-v3-funnel-view hero-v3-funnel-done">
                    <div className="hero-v3-funnel-done-check" aria-hidden>
                      <svg viewBox="0 0 48 48" width="40" height="40">
                        <path
                          d="M12 24.5 L21 33 L36 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className="hero-v3-funnel-done-title">You&rsquo;re booked.</h3>
                    <p className="hero-v3-funnel-done-detail">Wed, May 27 &middot; 10:00 AM &middot; Sofia Reyes, NP</p>
                    <p className="hero-v3-funnel-done-sub">Confirmation sent to sarah@example.com</p>
                  </div>
                </div>
              </div>

              {/* Reduced-motion labels — visible ONLY when prefers-reduced-motion
                  is active, in which case the cycling is disabled and all three
                  states stack vertically. Otherwise visually hidden. */}
              <p className="hero-v3-stage-rmlabel hero-v3-stage-rmlabel-1">Pattern 1 &mdash; Phone-only</p>
              <p className="hero-v3-stage-rmlabel hero-v3-stage-rmlabel-2">Pattern 2 &mdash; Contact form</p>
              <p className="hero-v3-stage-rmlabel hero-v3-stage-rmlabel-3">Pattern 3 &mdash; RIVR funnel (what we build)</p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="scroll-cue" style={{ opacity: clamp(1 - progress * 3, 0, 1) }}>
        <span>Scroll</span>
        <span className="line" />
      </div>
    </section>);

}

// ─── ReferenceBuilds — combined demos showcase (Polish 3 / Task 2) ───────────
// Replaces the previous two separate demo sections: ThreeTileHero (thumbnail
// hover-pan grid at the top of the page) and SampleWork (horizontal-scroll
// per-tile copy strip lower down). Both were showing the same three demos —
// the page surfaced the demos visually four times in total. Polish 3 collapses
// that to two surfaces: this section, and the IntegrationSection's Lumera
// animation later on.
//
// Each tile carries the preview image (hover-pan from ThreeTileHero) AND the
// per-practice headline + body + CTA row (from SampleWork). Tile order
// locked: Sela → Devereaux → Lumera (practice-type progression: retail →
// concierge surgical → multi-tier).
const REFERENCE_TILES = [
  {
    brand: "Sela",
    eyebrow: "01 · RETAIL MED SPA",
    image: "imagery/demos/sela-home.jpg",
    alt: "Sela Aesthetic Studio home page — \"Skin you live in.\" hero, full price-menu spine, membership, and team.",
    href: "https://sela.rivrsystems.com",
    demoCaption: "demo: sela.rivrsystems.com",
    headline: "The soonest opening comes first.",
    body: "For a high-volume, NP-led retail med spa, the booking funnel leads with availability. Pick the next open slot, pick a provider, done. Time is the primary axis; everything else folds in around it.",
  },
  {
    brand: "Devereaux",
    eyebrow: "02 · CONCIERGE SURGICAL",
    image: "imagery/demos/devereaux-home.jpg",
    alt: "Devereaux Institute home page — editorial-magazine register with Dr. Devereaux portrait, practice statement, and studies gallery.",
    href: "https://devereaux.rivrsystems.com",
    demoCaption: "demo: devereaux.rivrsystems.com",
    headline: "The practitioner comes first.",
    body: "For a founder-led concierge practice, the booking funnel leads with the surgeon — one provider, their credentials, their first available. The relationship to the practitioner is the whole product.",
  },
  {
    brand: "Lumera",
    eyebrow: "03 · MULTI-TIER PRACTICE",
    image: "imagery/demos/lumera-home.jpg",
    alt: "Lumera Aesthetic Studio home page — photographic hero, PathFinder six-path chooser, rooms bento, team, and price menu.",
    href: "https://lumera.rivrsystems.com",
    demoCaption: "demo: lumera.rivrsystems.com",
    headline: "The conversation comes first.",
    body: "For a multi-tier practice selling both surgical procedures and injectables, the booking funnel leads with a consult. Three lanes, one continue button, no upsell — the coordinator routes from there.",
  },
];

function ReferenceBuilds() {
  return (
    <section className="section reference-builds" id="reference-builds">
      <div className="container">
        <div className="section-header">
          <FadeUp><p className="text-label-caps">Reference builds</p></FadeUp>
          <RevealLines
            as="h2"
            className="text-display-2"
            baseDelay={120}
            lines={[
              <>Three practices. Three booking patterns.</>,
              <>One funnel <span className="serif" style={{ color: "var(--color-accent)" }}>system</span>.</>,
            ]} />
          <FadeUp delay={320}>
            <p className="text-body-lg" style={{ marginTop: 22, maxWidth: 660, marginInline: "auto" }}>
              We built three reference med spa sites to show how the funnel adapts. Each one fits a different practice type and a different way the practice makes money.
            </p>
          </FadeUp>
        </div>

        <FadeUp delay={180}>
          <div className="ref-grid">
            {REFERENCE_TILES.map((t) => (
              <article key={t.brand} className="ref-tile">
                <a
                  className="ref-tile-preview"
                  href={t.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.brand} — open the live demo in a new tab`}>
                  <img src={t.image} alt={t.alt} loading="lazy" />
                  <span className="ref-tile-mobile-cta" aria-hidden>View live →</span>
                </a>
                <div className="ref-tile-body">
                  <p className="ref-tile-eyebrow">{t.eyebrow}</p>
                  <h3 className="ref-tile-headline">{t.headline}</h3>
                  <p className="ref-tile-copy">{t.body}</p>
                  <p className="ref-tile-caption">{t.demoCaption}</p>
                  <div className="ref-tile-cta">
                    <a href={t.href} target="_blank" rel="noopener noreferrer">See it live ↗</a>
                    <a href="book.html">Book a call →</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── IntegrationSection — "It lives where your patients already are." ────────
// Polish Pass 2: the static Service-step mock is replaced with a 5-state
// animated loop showing a patient booking on Lumera's site. The funnel UI is
// styled in LUMERA's actual brand (porcelain #ECEDE9 + petrol-teal #16494A +
// Geist Sans/Mono — confirmed against C:\Users\thora\rivr-funnels\lumera\app\
// globals.css) to demonstrate the core RIVR promise: every funnel is built to
// match the client's brand, not a generic template dropped in.
//
// Sequence (~17s total): home → service → time → confirm → done → loop.
// An animated cursor moves between targets and "clicks" at each step.
// IntersectionObserver pauses the loop when the section scrolls out of view.
// prefers-reduced-motion AND viewports ≤ 900px fall back to a static service
// step rendering (the most information-dense single frame).
// Cursor x/y are % of the .integration-mock bounding box. The cursor element
// is 22x22 with transform: translate(-2px,-2px), so its visual center sits at
// (left + 9, top + 9). Values chosen so the cursor visual lands inside the
// click target's bounding rect on every desktop mock width (~900–1280px):
//   home    → BOOK link in practice-nav (center ≈ {93.5%, 13%})
//   service → Injectables card in lf-cards grid (wide card; cursor inside)
//   time    → Wed 10:00 AM slot in lf-times grid (wide slot; cursor inside)
//   confirm → "Confirm booking" button bottom-right (center ≈ {86%, 80%})
//   done    → off-screen exit; no click target pulses on this state
const FLOW_STATES = [
  { id: "home",    duration: 2500, url: "lumera.com",     stepIndex: -1, cursor: { x: "93%",  y: "12%" } },
  { id: "service", duration: 3000, url: "lumera.com/book", stepIndex: 0, cursor: { x: "25%",  y: "55%" } },
  { id: "time",    duration: 3000, url: "lumera.com/book", stepIndex: 1, cursor: { x: "39%",  y: "55%" } },
  { id: "confirm", duration: 3000, url: "lumera.com/book", stepIndex: 2, cursor: { x: "85%",  y: "79%" } },
  { id: "done",    duration: 3000, url: "lumera.com/book", stepIndex: 3, cursor: { x: "110%", y: "110%" } },
];

const FLOW_STEPS = ["Service", "Time", "Confirm", "Done"];

function LumeraStepIndicator({ stepIndex }) {
  return (
    <ol className="lf-steps" aria-hidden>
      <span className="lf-step-count">
        {stepIndex >= 0 ? `STEP ${stepIndex + 1} OF 4` : "BOOK"}
      </span>
      {FLOW_STEPS.map((label, i) => {
        const done = stepIndex > i;
        const active = stepIndex === i;
        return (
          <li key={label} className={`${active ? "is-active" : ""} ${done ? "is-done" : ""}`.trim()}>
            <span className="dot" aria-hidden>{done ? "✓" : ""}</span>
            <span className="label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function LumeraHomePanel() {
  return (
    <div className="lh-panel" aria-hidden>
      <div className="lh-eyebrow">AESTHETIC STUDIO · EST. 2018</div>
      <h3 className="lh-headline">A practice built around the consultation.</h3>
      <p className="lh-sub">
        Surgical, injectables, skin. One coordinator, one calendar, one path to the right room.
      </p>
      <div className="lh-meta">
        <span>Treatments</span>
        <span className="lh-dot" />
        <span>Team of 6 practitioners</span>
        <span className="lh-dot" />
        <span>Coral Gables, FL</span>
      </div>
    </div>
  );
}

const SERVICE_CARDS = [
  { name: "Injectables",       blurb: "Botox, fillers, biostimulators.",      price: "from $450" },
  { name: "Skin",              blurb: "Facials, peels, skin-renewal.",        price: "from $180" },
  { name: "Laser",             blurb: "Pigment, redness, resurfacing.",       price: "from $250" },
  { name: "Body",              blurb: "Non-invasive contouring.",             price: "from $400" },
  { name: "Wellness",          blurb: "IV therapy and vitamin protocols.",    price: "from $125" },
  { name: "Surgical consult",  blurb: "15-min intro with a coordinator.",     price: "complimentary" },
];

function LumeraServicePanel({ pulseInjectables }) {
  return (
    <div className="lf-panel" aria-hidden>
      <p className="lf-eyebrow">Step 1 — Service</p>
      <h3 className="lf-heading">Select a service</h3>
      <p className="lf-sub">Choose a category to see real-time availability.</p>
      <div className="lf-cards">
        {SERVICE_CARDS.map((c) => (
          <article
            key={c.name}
            className={`lf-card ${pulseInjectables && c.name === "Injectables" ? "is-pulse" : ""}`.trim()}>
            <h4>{c.name}</h4>
            <p>{c.blurb}</p>
            <p className="price">{c.price}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

const TIME_SLOTS = [
  { day: "Tue", time: "2:30 PM" },
  { day: "Wed", time: "10:00 AM", target: true },
  { day: "Wed", time: "3:15 PM" },
  { day: "Thu", time: "11:45 AM" },
  { day: "Thu", time: "4:00 PM" },
  { day: "Fri", time: "9:30 AM" },
];

function LumeraTimePanel({ pulseTarget }) {
  return (
    <div className="lf-panel" aria-hidden>
      <p className="lf-eyebrow">Step 2 — Time</p>
      <h3 className="lf-heading">Pick a time</h3>
      <p className="lf-sub">Showing earliest available this week.</p>
      <div className="lf-times">
        {TIME_SLOTS.map((s, i) => (
          <button
            key={i}
            type="button"
            tabIndex={-1}
            className={`lf-slot ${pulseTarget && s.target ? "is-pulse" : ""}`.trim()}>
            <span className="day">{s.day}</span>
            <span className="time">{s.time}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function LumeraConfirmPanel({ pulseButton }) {
  return (
    <div className="lf-panel" aria-hidden>
      <p className="lf-eyebrow">Step 3 — Confirm</p>
      <h3 className="lf-heading">Confirm your booking</h3>
      <div className="lf-confirm-grid">
        <dl className="lf-summary">
          <div><dt>Service</dt><dd>Injectables</dd></div>
          <div><dt>Time</dt><dd>Wed 10:00 AM</dd></div>
          <div><dt>Duration</dt><dd>45 min</dd></div>
          <div><dt>Provider</dt><dd>Sofia Reyes, NP</dd></div>
        </dl>
        <div className="lf-fields">
          <label><span>Name</span><input type="text" tabIndex={-1} readOnly defaultValue="Sarah M." /></label>
          <label><span>Email</span><input type="email" tabIndex={-1} readOnly defaultValue="s.morrison@email.com" /></label>
          <label><span>Phone</span><input type="tel" tabIndex={-1} readOnly defaultValue="(305) 555-0148" /></label>
        </div>
      </div>
      <button
        type="button"
        tabIndex={-1}
        className={`lf-confirm-btn ${pulseButton ? "is-pulse" : ""}`.trim()}>
        Confirm booking
      </button>
    </div>
  );
}

function LumeraDonePanel() {
  return (
    <div className="lf-panel lf-panel-done" aria-hidden>
      <svg className="lf-check" viewBox="0 0 32 32" width="44" height="44" aria-hidden>
        <circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <path d="M9 16.5 L14 21.5 L23 11.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h3 className="lf-heading lf-heading-done">You're booked.</h3>
      <p className="lf-sub">
        Wednesday, 10:00 AM with Sofia Reyes. Confirmation sent to your email.
      </p>
    </div>
  );
}

function LumeraCursor({ state, clicking }) {
  return (
    <div
      className={`lf-cursor ${clicking ? "is-clicking" : ""}`.trim()}
      style={{ left: state.cursor.x, top: state.cursor.y }}
      aria-hidden>
      <svg width="22" height="22" viewBox="0 0 22 22">
        <path
          d="M4 2 L4 17 L8 13.5 L10.5 19 L13 18 L10.5 12.5 L16 12 Z"
          fill="#1E2220"
          stroke="#ECEDE9"
          strokeWidth="0.8"
          strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function IntegrationSection() {
  const mockRef = useRefH(null);
  const [inView, setInView] = useStateH(false);
  const [staticMode, setStaticMode] = useStateH(false);
  const [stateIdx, setStateIdx] = useStateH(0);
  const [clicking, setClicking] = useStateH(false);

  // Detect reduced-motion or small viewport → static fallback (service step).
  useEffectH(() => {
    const evalStatic = () => {
      const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const small = window.matchMedia && window.matchMedia("(max-width: 900px)").matches;
      return reduce || small;
    };
    const update = () => {
      const s = evalStatic();
      setStaticMode(s);
      if (s) setStateIdx(1); // service step is the most info-dense single frame
    };
    update();
    const m1 = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    const m2 = window.matchMedia && window.matchMedia("(max-width: 900px)");
    if (m1 && m1.addEventListener) { m1.addEventListener("change", update); m2.addEventListener("change", update); }
    return () => {
      if (m1 && m1.removeEventListener) { m1.removeEventListener("change", update); m2.removeEventListener("change", update); }
    };
  }, []);

  // IntersectionObserver gates both the materialize-on-scroll + the animation loop.
  useEffectH(() => {
    const el = mockRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setInView(e.isIntersecting)),
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Drive the loop while inView and animation is enabled.
  useEffectH(() => {
    if (!inView || staticMode) return;
    let advanceTimer;
    let clickTimer;
    const current = FLOW_STATES[stateIdx];
    // Schedule a click-pulse 320ms before the state ends (so the target visibly
    // pulses just before the next state crossfades in).
    clickTimer = setTimeout(() => setClicking(true), Math.max(0, current.duration - 320));
    advanceTimer = setTimeout(() => {
      setClicking(false);
      setStateIdx((i) => (i + 1) % FLOW_STATES.length);
    }, current.duration);
    return () => { clearTimeout(advanceTimer); clearTimeout(clickTimer); };
  }, [stateIdx, inView, staticMode]);

  const state = FLOW_STATES[staticMode ? 1 : stateIdx];
  const activeId = state.id;

  return (
    <section className="section integration-section">
      <div className="container">
        <div className="section-header">
          <FadeUp><p className="text-label-caps">Integration</p></FadeUp>
          <RevealLines
            as="h2"
            className="text-display-2"
            baseDelay={120}
            lines={[<>It lives where your patients <span className="serif" style={{ color: "var(--color-accent)" }}>already are</span>.</>]} />
          <FadeUp delay={320}>
            <p className="text-body-lg" style={{ marginTop: 24, maxWidth: 720, marginInline: "auto" }}>
              The booking funnel sits inside the page your patients already know how to find. Your navigation, your branding, your CMS — all untouched. They see one familiar site with one page that actually takes the booking.
            </p>
          </FadeUp>
        </div>

        <div
          ref={mockRef}
          className={`integration-mock ${inView ? "is-in" : ""} ${staticMode ? "is-static" : ""}`.trim()}
          role="img"
          aria-label="Mock browser window showing a patient booking on Lumera Aesthetic Studio's site. The funnel UI is styled in Lumera's brand — porcelain background, petrol-teal accent, Geist typography.">
          <div className="browser-chrome" aria-hidden>
            <i /><i /><i />
            <span className="url" data-state={activeId}>{state.url}</span>
          </div>
          <div className="practice-nav" aria-hidden>
            <span className="brand">LUMERA</span>
            <span className="links">
              <span>Treatments</span>
              <span>Team</span>
              <span>About</span>
              <span className={`book-link ${activeId === "home" && clicking ? "is-pulse" : ""}`.trim()}>Book</span>
            </span>
          </div>

          <div className="embed lumera-embed" aria-hidden>
            {staticMode ? (
              /* Static fallback: render only the service step inline — no absolute
                 stacking, no crossfade, container height grows with content. */
              <div className="lf-state-funnel is-static">
                <LumeraStepIndicator stepIndex={0} />
                <div className="lf-panels lf-panels-static">
                  <LumeraServicePanel pulseInjectables={false} />
                </div>
              </div>
            ) : (
              <>
                {/* All five panels stack and crossfade via .is-active. */}
                <div className={`lf-state ${activeId === "home" ? "is-active" : ""}`.trim()}>
                  <LumeraHomePanel />
                </div>
                <div className={`lf-state lf-state-funnel ${activeId !== "home" ? "is-active" : ""}`.trim()}>
                  <LumeraStepIndicator stepIndex={state.stepIndex} />
                  <div className="lf-panels">
                    <div className={`lf-state-inner ${activeId === "service" ? "is-active" : ""}`.trim()}>
                      <LumeraServicePanel pulseInjectables={activeId === "service" && clicking} />
                    </div>
                    <div className={`lf-state-inner ${activeId === "time" ? "is-active" : ""}`.trim()}>
                      <LumeraTimePanel pulseTarget={activeId === "time" && clicking} />
                    </div>
                    <div className={`lf-state-inner ${activeId === "confirm" ? "is-active" : ""}`.trim()}>
                      <LumeraConfirmPanel pulseButton={activeId === "confirm" && clicking} />
                    </div>
                    <div className={`lf-state-inner ${activeId === "done" ? "is-active" : ""}`.trim()}>
                      <LumeraDonePanel />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {!staticMode && <LumeraCursor state={state} clicking={clicking} />}
        </div>
        <p className="integration-caption">demo: lumera.rivrsystems.com</p>
      </div>
    </section>
  );
}

// ─── Marquee row ─────────────────────────────────────────────────────────────
function Marquee() {
  const items = [
  "Google Calendar", "Acuity", "Vagaro", "Boulevard",
  "Square", "Mindbody", "Microsoft 365", "Cal.com", "Calendly",
  "Apple Calendar", "Custom systems"];

  const doubled = [...items, ...items];
  return (
    <div className="marquee" aria-label="Calendar systems we integrate with">
      <div className="marquee-track">
        {doubled.map((t, i) =>
        <span className="marquee-item" key={i}>{t}</span>
        )}
      </div>
    </div>);

}

// ─── Credibility Stats ───────────────────────────────────────────────────────
// Stream A (Category 6): citation indices (`cite`) and the SOURCES list were
// removed — evidence now lives behind the discrete "see evidence →" link, not
// inline in the rendered stats. The statistics themselves are unchanged.
const STATS = [
{ n: 68, suffix: "%", label: "want online booking", body: "of patients want to schedule, change, or cancel healthcare appointments online." },
{ n: 80, suffix: "%", label: "use it to pick a provider", body: "of healthcare consumers say online scheduling influences which provider they choose." },
{ n: 38, suffix: "%", label: "fewer no-shows", body: "lower no-show rates when patients receive a text message appointment reminder." },
{ n: 25, suffix: "%", label: "abandon hard booking", body: "of consumers abandon the booking attempt if scheduling is not simple and convenient.", prefix: "~" }];


function StatCard({ stat }) {
  const [ref, text] = useCountUp(stat.n, { duration: 1700, prefix: stat.prefix || "", suffix: stat.suffix });
  return (
    <div className="stat-card">
      <p className="n" ref={ref}>{text}</p>
      <p className="lbl">{stat.label}</p>
      <p className="body">{stat.body}</p>
    </div>);

}

// TODO: restore /evidence link when evidence page ships in week 2 launch.
// Stat sources + URLs are preserved in _evidence-content-backup.md at repo root.
function CredibilityStats() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <FadeUp><p className="text-label-caps">The industry standard</p></FadeUp>
          <RevealLines
            as="h2"
            className="text-display-2"
            baseDelay={120}
            lines={[<>Online booking is no longer a <span className="serif" style={{ color: "var(--color-accent)" }}>nice-to-have</span>.</>]} />

        </div>

        <FadeUp>
          <div className="stats-grid">
            {STATS.map((s, i) => <StatCard key={i} stat={s} />)}
          </div>
        </FadeUp>
      </div>
    </section>);

}

// ─── Meet Lumera (LiveDemo) — REMOVED in Stream C v2 (Item 4) ────────────────
// Triply redundant after Stream C v1 added ThreeTileHero (which surfaces all
// three demos at the top) and updated SampleWork (which cycles real Lumera/
// Sela/Devereaux screenshots). Stream A had marked it for restructure; Stream
// C v2 kills it instead. Removed: DEMO_PANELS const, TiltCard component,
// LiveDemo component, and the <LiveDemo /> mount in Page below.

// ─── Benefits (dark) — REMOVED in Stream A (Category 5) ──────────────────────
// The "Built to grow your practice, not your tooling stack" three-icon-column
// section was scoped for removal. Ripped here (and the matching <Benefits /> in
// Page below). This also removed the "Real humans, immediate support" copy,
// which read as an instant-response promise (Category 1).

// ─── YoursNextCTA (Polish 3) — extracted from the old SampleWork trailing
// card. The horizontal-scroll SampleWork was removed when its three
// per-practice tiles consolidated into ReferenceBuilds above; the trailing
// "What does your booking page lead with?" card was the SampleWork wrapper's
// closing beat and is preserved as its own section between IntegrationSection
// and ClosingCTA. The three echo lines now mirror ReferenceBuilds' tile order
// (Sela → Devereaux → Lumera).
function YoursNextCTA() {
  return (
    <section className="section yours-next">
      <div className="container">
        <div className="yours-next-card">
          <div className="yours-inner">
            <p className="yours-caption">// CHOOSING YOUR PATTERN</p>
            <ul className="yours-echoes" aria-hidden>
              <li>The soonest opening comes first.</li>
              <li>The practitioner comes first.</li>
              <li>The conversation comes first.</li>
            </ul>
            <span className="yours-divider" aria-hidden />
            <h3 className="yours-headline">
              What does <em>your</em> booking page lead with?
            </h3>
            <div className="yours-cta">
              <Button href="book.html" variant="primary">Book a walkthrough</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Compose page ────────────────────────────────────────────────────────────
function Page() {
  const modal = usePrototypeModal();
  return (
    <PrototypeModalContext.Provider value={modal}>
      <Nav current="home" />
      <main id="main">
        <Hero />
        {/* CredibilityStats moved up to position 3 (Polish 3 / Task 3) so the
            stat claim that backs the hero's "1 in 4 patients" headline lands
            immediately below the fold, before product details. */}
        <CredibilityStats />
        <ReferenceBuilds />
        <IntegrationSection />
        {/* Marquee removed from the home composition (Polish 4 / Task 2).
            Component file left in place; just unhooked here.
            YoursNextCTA ("Choosing your pattern" dark card) removed in
            Polish 5 / Task 1 — the three-echo lines were preamble for the
            story ReferenceBuilds already told, and the italic styling that
            survived Polish 3's typography pass read as "ceremonial poetry"
            rather than CTA copy. Component file kept; just unhooked. */}
        <ClosingCTA />
      </main>
      <Footer />
      <PrototypeModal open={modal.open} onClose={modal.closeModal} />
    </PrototypeModalContext.Provider>);

}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Page />);