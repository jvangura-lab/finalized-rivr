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

          {/* Right column — before/after visual */}
          <Reveal delay={620} className="hero-v3-visual" aria-hidden>
            {/* BEFORE — stylized "broken" contact-form booking page.
                Plain sans, flat fields, generic disclaimer. The dull on
                purpose. */}
            <div className="hero-v3-before">
              <div className="hero-v3-before-head">
                <span className="hero-v3-before-brand">YOUR AESTHETICS CO.</span>
              </div>
              <div className="hero-v3-before-body">
                <h3 className="hero-v3-before-title">Request an Appointment</h3>
                <div className="hero-v3-before-form">
                  <div className="hero-v3-before-field"><span className="lbl">Name</span><span className="inp" /></div>
                  <div className="hero-v3-before-field"><span className="lbl">Phone</span><span className="inp" /></div>
                  <div className="hero-v3-before-field"><span className="lbl">Email</span><span className="inp" /></div>
                  <div className="hero-v3-before-field"><span className="lbl">Preferred Date</span><span className="inp" /></div>
                  <div className="hero-v3-before-field"><span className="lbl">Preferred Time</span><span className="inp" /></div>
                  <div className="hero-v3-before-field hero-v3-before-msg"><span className="lbl">Message</span><span className="inp tall" /></div>
                  <div className="hero-v3-before-submit">Submit</div>
                  <p className="hero-v3-before-disclaimer">
                    We'll get back to you within 1-3 business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Arrow / chevron between the two states. Horizontal on desktop,
                vertical (chevron down) on mobile via CSS rotate. */}
            <div className="hero-v3-arrow">
              <svg viewBox="0 0 24 24" width="28" height="28">
                <path d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none" />
              </svg>
            </div>

            {/* AFTER — tight RIVR funnel fragment in RIVR's editorial register
                (Geist display, Source Serif 4 body, mono eyebrow). NOT the
                Lumera animation — that's later on the page. */}
            <div className="hero-v3-after">
              <div className="hero-v3-after-stepbar">
                <span className="hero-v3-after-stepcount">STEP 1 OF 4</span>
                <ol className="hero-v3-after-steps">
                  <li className="is-active"><span className="dot" /></li>
                  <li><span className="dot" /></li>
                  <li><span className="dot" /></li>
                  <li><span className="dot" /></li>
                </ol>
              </div>
              <div className="hero-v3-after-body">
                <p className="hero-v3-after-eyebrow">Step 1 — Service</p>
                <h3 className="hero-v3-after-title">Select a service</h3>
                <p className="hero-v3-after-sub">Earliest availability, in real time.</p>
                <div className="hero-v3-after-cards">
                  <article className="hero-v3-after-card is-pulse">
                    <div className="hero-v3-after-card-row">
                      <h4>Injectables</h4>
                      <span className="hero-v3-after-price">from $450</span>
                    </div>
                    <p>Botox, fillers, biostimulators.</p>
                    <div className="hero-v3-after-meta">
                      <span className="dot" />
                      <span>Next: Wed 10:00 AM</span>
                    </div>
                  </article>
                  <article className="hero-v3-after-card">
                    <div className="hero-v3-after-card-row">
                      <h4>Skin</h4>
                      <span className="hero-v3-after-price">from $180</span>
                    </div>
                    <p>Facials, peels, skin-renewal.</p>
                    <div className="hero-v3-after-meta">
                      <span className="dot" />
                      <span>Next: Tue 2:30 PM</span>
                    </div>
                  </article>
                </div>
              </div>
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
            immediately below the fold, before product details. Cold-email
            recipient needs proof before product. */}
        <CredibilityStats />
        <ReferenceBuilds />
        <IntegrationSection />
        <Marquee />
        <YoursNextCTA />
        <ClosingCTA />
      </main>
      <Footer />
      <PrototypeModal open={modal.open} onClose={modal.closeModal} />
    </PrototypeModalContext.Provider>);

}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Page />);