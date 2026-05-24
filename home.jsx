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
// Stream C v2 final: uses Lumera (one of the three demos) as the integration
// example, not a fictional Destin Med Spa. The browser frame shows
// lumera.com/book with Lumera's own nav above the booking funnel.
// Scroll-driven materialization gated behind prefers-reduced-motion.
function IntegrationSection() {
  const mockRef = useRefH(null);
  const [inView, setInView] = useStateH(false);

  useEffectH(() => {
    const el = mockRef.current;
    if (!el) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setInView(true); return; }
    if (typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } });
      },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
          className={`integration-mock ${inView ? "is-in" : ""}`}
          role="img"
          aria-label="Mock browser window showing the RIVR booking funnel embedded inside Lumera Aesthetic Studio's site.">
          <div className="browser-chrome" aria-hidden>
            <i /><i /><i />
            <span className="url">lumera.com/book</span>
          </div>
          <div className="practice-nav" aria-hidden>
            <span className="brand">LUMERA</span>
            <span className="links">
              <span>Treatments</span>
              <span>Team</span>
              <span>About</span>
              <span>Book</span>
            </span>
          </div>
          {/* Funnel embed — inline HTML mock of the booking funnel's "Service"
              step. Replaces a broken lumera-booking-flow.jpg that captured
              only the step-indicator chrome with a blank body. Inline mock
              is more durable than a screenshot — survives demo redeploys.
              Visual register intentionally departs from the host nav above:
              host nav is tracked-uppercase serif (Lumera's site styling);
              the funnel inside is clean sans-serif + hairline cards (RIVR's
              clinical aesthetic). */}
          <div className="embed funnel-embed" aria-hidden>
            <div className="funnel-chrome">
              <span className="funnel-back" aria-hidden>‹</span>
              <span className="funnel-brand">
                <strong>Lumera</strong>
                <span className="funnel-brand-sub">AESTHETIC STUDIO</span>
              </span>
              <span className="funnel-signin">Already a patient? Sign in →</span>
              <span className="funnel-close" aria-hidden>✕</span>
            </div>
            <ol className="funnel-steps">
              <li className="is-active">
                <span className="dot" />
                <span className="label">Service</span>
              </li>
              <li>
                <span className="dot" />
                <span className="label">Time</span>
              </li>
              <li>
                <span className="dot" />
                <span className="label">Confirm</span>
              </li>
              <li>
                <span className="dot" />
                <span className="label">Done</span>
              </li>
              <span className="step-count">STEP 1 OF 4</span>
            </ol>
            <div className="funnel-body">
              <p className="funnel-eyebrow">Step 1 — Service</p>
              <h3 className="funnel-h">Select a service</h3>
              <p className="funnel-sub">Choose a category to see real-time availability.</p>
              <div className="funnel-cards">
                <article className="funnel-card">
                  <h4>Injectables</h4>
                  <p>Botox, fillers, biostimulators.</p>
                  <p className="price">from $450</p>
                </article>
                <article className="funnel-card">
                  <h4>Skin</h4>
                  <p>Facials, peels, skin-renewal treatments.</p>
                  <p className="price">from $180</p>
                </article>
                <article className="funnel-card">
                  <h4>Laser</h4>
                  <p>Pigment, redness, hair, resurfacing.</p>
                  <p className="price">from $250</p>
                </article>
                <article className="funnel-card">
                  <h4>Body</h4>
                  <p>Non-invasive contouring & tightening.</p>
                  <p className="price">from $400</p>
                </article>
                <article className="funnel-card">
                  <h4>Wellness</h4>
                  <p>IV therapy and vitamin protocols.</p>
                  <p className="price">from $125</p>
                </article>
                <article className="funnel-card">
                  <h4>Surgical consult</h4>
                  <p>15-min intro with a surgeon's coordinator.</p>
                  <p className="price">complimentary</p>
                </article>
              </div>
            </div>
          </div>
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