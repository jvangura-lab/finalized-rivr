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

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  const [stageRef, rawProgress] = useScrollProgress();
  // useScrollProgress returns ~0.5 when the section sits at top-of-viewport
  // (rect.top=0, rect.height≈vh). For the hero we want 0 at rest so the copy
  // reads at full opacity on first paint, climbing only as the user scrolls out.
  const progress = clamp((rawProgress - 0.5) * 2, 0, 1);
  const mouse = useMousePos({ smooth: 0.08 });

  // Drive the browser frame: as user scrolls down, it shifts up + scales down
  const frameY = -progress * 80; // px
  const frameScale = 1 - progress * 0.06;
  const frameRotate = -2 + mouse.x * 1.2 - progress * 1.4;
  const frameOpacity = clamp(1 - progress * 1.1, 0, 1);

  // Hero copy fade as you scroll
  const copyOpacity = clamp(1 - progress * 1.4, 0, 1);
  const copyY = -progress * 30;

  // Mouse-driven spotlight
  const spotX = 50 + mouse.x * 18;
  const spotY = 36 + mouse.y * 14;

  // Floating chip parallax
  const chip1Y = mouse.y * 14 - progress * 60;
  const chip1X = mouse.x * 18;
  const chip2Y = mouse.y * -20 - progress * 90;
  const chip2X = mouse.x * -14;

  return (
    <section
      ref={stageRef}
      className="hero-stage"
      style={{ "--mx": `${spotX}%`, "--my": `${spotY}%`, opacity: "1" }}>
      
      <div className="hero-grid-bg" aria-hidden />
      <div className="hero-spotlight" aria-hidden />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        {/* Stream C v1: hero collapsed to single column. The right-column iframe
            booking mockup (imagery/hero-animation.html + 2 floating chips) was
            removed; the new "real demos" hero visual lives in the ThreeTileHero
            section directly below. */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: 40,
          alignItems: "center"
        }} className="hero-grid">
          {/* Copy */}
          <div style={{
            opacity: copyOpacity,
            transform: `translateY(${copyY}px)`,
            transition: "opacity 80ms linear",
            willChange: "transform, opacity"
          }}>
            <FadeUp>
              <p className="text-label-caps" style={{ color: "var(--color-accent-strong)", marginBottom: 22 }}>
                A studio for aesthetic medicine booking
              </p>
            </FadeUp>

            <RevealLines
              as="h1"
              className="text-display-1"
              baseDelay={60}
              gap={90}
              lines={[
              <>Booking flows built around</>,
              <>how you <span className="serif" style={{ color: "var(--color-accent)" }}>already work</span>.</>]
              } />


            <Reveal delay={420}>
              <p className="text-body-lg" style={{ maxWidth: 540, margin: "28px 0 36px" }}>
                Your patients see a calm, branded booking experience. Your team sees the bookings land in the calendar they already use. No new platform. No staff retraining. No data migration.
              </p>
            </Reveal>

            <Reveal delay={540}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center", marginBottom: 24 }}>
                <Button href="book.html" variant="primary">Book a 15-min walkthrough</Button>
                <PrototypeModalContext.Consumer>
                  {({ openModal }) => (
                    <Button onClick={openModal} variant="secondary">See the live prototype</Button>
                  )}
                </PrototypeModalContext.Consumer>
              </div>
            </Reveal>

            {/* RIVR-NOTE: hero sub-line — confirm or swap on review. */}
            <Reveal delay={640}>
              <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                A short look at your setup. We show you what we'd build for your practice. Fifteen minutes.
              </p>
            </Reveal>
          </div>

        </div>
      </div>

      <div className="scroll-cue" style={{ opacity: clamp(1 - progress * 3, 0, 1) }}>
        <span>Scroll</span>
        <span className="line" />
      </div>
    </section>);

}

// ─── ThreeTileHero — three real demo screenshots, hover-scroll inside each ──
// Stream C v1: replaces the old hero booking mockup. Each tile shows the full
// home screenshot of a rebuilt demo, scaled to fit and cropped at the top via
// object-fit:cover + object-position. On hover, object-position animates from
// 0% to 80% over 4.5s (CSS ease-out) revealing more of the long-form home
// page; on hover-end it returns to 0% over 1s. Mobile (≤1024px or no-hover)
// disables the scroll and surfaces a "View live →" pill instead.
// Stream C v2 final: tile order Sela → Devereaux → Lumera (practice-type
// progression: retail → concierge surgical → multi-tier). Each tile carries a
// practice-type eyebrow above and a demo-URL caption below. The demo names
// themselves move into the caption; the practice type is the primary identifier.
const WORK_TILES = [
  {
    brand: "Sela",
    eyebrow: "01 · RETAIL MED SPA",
    caption: "demo: sela.rivrsystems.com",
    href: "https://sela.rivrsystems.com",
    image: "imagery/demos/sela-home.jpg",
    alt: "Sela Aesthetic Studio home page — \"Skin you live in.\" hero, full price-menu spine, membership, and team.",
  },
  {
    brand: "Devereaux",
    eyebrow: "02 · CONCIERGE SURGICAL",
    caption: "demo: devereaux.rivrsystems.com",
    href: "https://devereaux.rivrsystems.com",
    image: "imagery/demos/devereaux-home.jpg",
    alt: "Devereaux Institute home page — editorial-magazine register with Dr. Devereaux portrait, practice statement, and studies gallery.",
  },
  {
    brand: "Lumera",
    eyebrow: "03 · MULTI-TIER PRACTICE",
    caption: "demo: lumera.rivrsystems.com",
    href: "https://lumera.rivrsystems.com",
    image: "imagery/demos/lumera-home.jpg",
    alt: "Lumera Aesthetic Studio home page — photographic hero, PathFinder six-path chooser, rooms bento, team, and price menu.",
  },
];

function ThreeTileHero() {
  return (
    <section className="section work-hero" id="work-hero">
      <div className="container">
        <div className="section-header" style={{ marginBottom: 0 }}>
          <FadeUp><p className="text-label-caps">The work</p></FadeUp>
          <FadeUp delay={120}>
            <p className="text-body-lg work-hero-supporting" style={{ marginTop: 18, maxWidth: 620 }}>
              Three reference builds. Find the one that looks like your practice.
            </p>
          </FadeUp>
        </div>
        <FadeUp delay={180}>
          <div className="work-hero-grid">
            {WORK_TILES.map((t) => (
              <div key={t.brand} className="work-hero-cell">
                <p className="work-hero-eyebrow">{t.eyebrow}</p>
                <a
                  className="work-hero-tile"
                  href={t.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.brand} — open the live demo in a new tab`}>
                  <img src={t.image} alt={t.alt} loading="lazy" />
                  <span className="work-hero-mobile-cta" aria-hidden>View live →</span>
                </a>
                <p className="work-hero-caption">{t.caption}</p>
              </div>
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
          <label><span>Name</span><input type="text" tabIndex={-1} readOnly /></label>
          <label><span>Email</span><input type="email" tabIndex={-1} readOnly /></label>
          <label><span>Phone</span><input type="tel" tabIndex={-1} readOnly /></label>
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

// ─── SampleWork (horizontal scroll) ──────────────────────────────────────────
// These are reference builds — live demos we use to show each booking pattern,
// not client deployments. Each tile links to the deployed subdomain and
// hover-cycles through three real screenshots.
// Stream C v1: images swapped to real demo screenshots from rivr-funnels Stream B.
// Each tile cycles through 3 non-home-full screenshots (so they don't repeat the
// hero tiles above). HoverCycle uses `firstAlt` for the first image; the cycle
// fades through the others decoratively (their alts are intentionally empty).
const TILES = [
{
  label: "Consult-first booking",
  brand: "Lumera",
  category: "Multi-tier surgical + injectables",
  href: "https://lumera.rivrsystems.com",
  images: [
    "imagery/demos/lumera-pathfinder.jpg",
    "imagery/demos/lumera-bento.jpg",
    "imagery/demos/lumera-explore-treatments.jpg",
  ],
  firstAlt: "Lumera home — PathFinder section with six path-choice cards for triaging patients across the multi-tier practice.",
  title: "The conversation comes first.",
  body: "For a multi-tier practice selling both surgical procedures and injectables, the page leads with a consult. Three lanes, one continue button, no upsell. A reference build we use to show the consult-first pattern."
},
{
  label: "Time-first booking",
  brand: "Sela",
  category: "Retail med spa, NP-led",
  href: "https://sela.rivrsystems.com",
  images: [
    "imagery/demos/sela-hero.jpg",
    "imagery/demos/sela-pricemenu.jpg",
    "imagery/demos/sela-team.jpg",
  ],
  firstAlt: "Sela home — \"Skin you live in.\" hero strip with the start of the price-menu spine visible below.",
  title: "The soonest opening comes first.",
  body: "For a high-volume, NP-led retail med spa, the page leads with availability. Pick the next open slot, pick a provider, done. A reference build we use to show the time-first pattern."
},
{
  label: "Practitioner-first booking",
  brand: "Devereaux",
  category: "Concierge surgical, founder-led",
  href: "https://devereaux.rivrsystems.com",
  images: [
    "imagery/demos/devereaux-hero.jpg",
    "imagery/demos/devereaux-procedures-facelift.jpg",
    "imagery/demos/devereaux-booking-flow.jpg",
  ],
  firstAlt: "Devereaux Institute home — editorial-magazine register with Dr. Devereaux portrait and practice statement.",
  title: "The practitioner comes first.",
  body: "For a founder-led concierge practice, the page leads with the surgeon — one provider, their credentials, their first available. A reference build we use to show the practitioner-first pattern."
}];

// ── HoverCycle — fades through screenshots on hover (~1.2s/frame). Falls back
// to a branded placeholder tile per image if a screenshot is missing.
function HoverCycle({ images, label, alt }) {
  const [idx, setIdx] = useStateH(0);
  const [hovering, setHovering] = useStateH(false);
  const [failed, setFailed] = useStateH({});
  useEffectH(() => {
    if (!hovering || images.length < 2) return;
    const iv = setInterval(() => setIdx((i) => (i + 1) % images.length), 1200);
    return () => clearInterval(iv);
  }, [hovering, images.length]);
  return (
    <div
      className="hover-cycle"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { setHovering(false); setIdx(0); }}
    >
      {images.map((src, i) =>
        failed[i] ? (
          <div key={i} className={`hover-cycle-ph ${i === idx ? "is-active" : ""}`} aria-hidden={i !== idx}>
            <span>{label}</span>
          </div>
        ) : (
          <img
            key={i}
            src={src}
            alt={i === 0 ? alt : ""}
            loading="lazy"
            className={i === idx ? "is-active" : ""}
            aria-hidden={i !== idx}
            onError={() => setFailed((f) => ({ ...f, [i]: true }))}
          />
        )
      )}
      {images.length > 1 && (
        <div className="hover-cycle-dots" aria-hidden>
          {images.map((_, i) => <span key={i} className={i === idx ? "on" : ""} />)}
        </div>
      )}
    </div>
  );
}


function SampleWork() {
  const [sectionRef, progress] = useStickyProgress();

  // Calculate horizontal offset. Total scroll distance: 3 viewports worth
  // We want the strip to slide from x=0 to x=-(totalWidth - viewportWidth)
  const totalTiles = TILES.length;
  // Each tile is ~540px + 32px gap = 572px on desktop, plus pad
  // We translate the strip so all tiles pass through
  const stripRef = useRefH(null);
  const trackRef = useRefH(null);
  const [stripX, setStripX] = useStateH(0);

  useEffectH(() => {
    const calc = () => {
      const strip = stripRef.current;
      const track = trackRef.current;
      if (!strip || !track) return;
      const stripW = strip.scrollWidth;
      const viewW = window.innerWidth;
      const maxTravel = Math.max(0, stripW - viewW + 64);
      setStripX(-maxTravel * progress);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [progress]);

  return (
    <section className="section" style={{ borderBottom: 0, padding: 0 }} id="booking-types">
      {/* Intro */}
      <div className="container" style={{ paddingBlock: "120px 0" }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <FadeUp><p className="text-label-caps">Three booking page types</p></FadeUp>
          <RevealLines
            as="h2" className="text-display-2" baseDelay={120}
            lines={[<>Three different practices.</>, <><span className="serif" style={{ color: "var(--color-accent)" }}>Three booking pages, no two alike</span>.</>]} />
          
          <FadeUp delay={320}>
            <p className="text-body-lg" style={{ marginTop: 24 }}>
              Each tile is a real prototype. Click any one to open it in a popup and walk the first screen.
            </p>
          </FadeUp>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={sectionRef}
        className="work-horizontal"
        style={{ height: `${Math.max(200, 100 + totalTiles * 40)}vh`, position: "relative", borderBottom: "1px solid var(--color-rule)" }}>
        
        <div className="work-track" ref={trackRef}>
          <div ref={stripRef} className="work-strip" style={{
            transform: `translate3d(${stripX}px, 0, 0)`,
            transition: "transform 80ms linear"
          }}>
            {TILES.map((t, i) =>
            <article className="work-tile" key={i}>
                <div className="head">
                  <span className="brand-tag">{t.brand} · Reference build</span>
                </div>
                <div className="preview">
                  <HoverCycle images={t.images} label={t.brand} alt={t.firstAlt} />
                </div>
                <div className="meta">
                  <p className="label">{t.label}</p>
                  <p className="category">{t.category}</p>
                  <h3>{t.title}</h3>
                  <p>{t.body}</p>
                  <div className="links">
                    <a href={t.href} target="_blank" rel="noopener noreferrer" data-cursor="hover">See it live ↗</a>
                    <a href="book.html" data-cursor="hover">Book a call →</a>
                  </div>
                </div>
              </article>
            )}
            {/* Trailing card — "yours next" closing tile. Echoes the three
                preceding tile headlines (consult / time / practitioner) so the
                strip ends with the prospect being asked the same question the
                three reference builds already answered. Subtle grain texture
                breaks the flat dark — keeps the section from reading minimal. */}
            <div className="work-tile work-tile-yours">
              <div className="yours-inner">
                <p className="yours-caption">// CHOOSING YOUR PATTERN</p>
                <ul className="yours-echoes" aria-hidden>
                  <li>The conversation comes first.</li>
                  <li>The soonest opening comes first.</li>
                  <li>The practitioner comes first.</li>
                </ul>
                <span className="yours-divider" aria-hidden />
                <h3 className="yours-headline serif">
                  What does <em>your</em> booking page lead with?
                </h3>
                <div className="yours-cta">
                  <Button href="book.html" variant="primary">Book a walkthrough</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="work-progress"><div className="fill" style={{ width: `${progress * 100}%` }} /></div>
        </div>
      </div>
    </section>);

}

// ─── Compose page ────────────────────────────────────────────────────────────
function Page() {
  const modal = usePrototypeModal();
  return (
    <PrototypeModalContext.Provider value={modal}>
      <Nav current="home" />
      <main id="main">
        <Hero />
        <ThreeTileHero />
        <IntegrationSection />
        <Marquee />
        <CredibilityStats />
        <SampleWork />
        <ClosingCTA />
      </main>
      <Footer />
      <PrototypeModal open={modal.open} onClose={modal.closeModal} />
    </PrototypeModalContext.Provider>);

}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Page />);