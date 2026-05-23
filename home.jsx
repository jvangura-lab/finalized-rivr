// =============================================================================
// HOME page — Hero (scroll-driven), Stats (count-up), LiveDemo (3D tilt),
// Benefits (icon reveals + watermark), SampleWork (horizontal scroll),
// ClosingCTA.
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
const WORK_TILES = [
  {
    brand: "Devereaux",
    caption: "DEVEREAUX · SURGICAL",
    href: "https://devereaux.rivrsystems.com",
    image: "imagery/demos/devereaux-home.jpg",
    alt: "Devereaux Institute home page — editorial-magazine register with Dr. Devereaux portrait, practice statement, and studies gallery.",
  },
  {
    brand: "Lumera",
    caption: "LUMERA · MULTI-TIER",
    href: "https://lumera.rivrsystems.com",
    image: "imagery/demos/lumera-home.jpg",
    alt: "Lumera Aesthetic Studio home page — photographic hero, PathFinder six-path chooser, rooms bento, team, and price menu.",
  },
  {
    brand: "Sela",
    caption: "SELA · RETAIL",
    href: "https://sela.rivrsystems.com",
    image: "imagery/demos/sela-home.jpg",
    alt: "Sela Aesthetic Studio home page — \"Skin you live in.\" hero, full price-menu spine, membership, and team.",
  },
];

function ThreeTileHero() {
  return (
    <section className="section work-hero" id="work-hero">
      <div className="container">
        <div className="section-header" style={{ marginBottom: 0 }}>
          <FadeUp><p className="text-label-caps">The work</p></FadeUp>
        </div>
        <FadeUp delay={120}>
          <div className="work-hero-grid">
            {WORK_TILES.map((t) => (
              <div key={t.brand}>
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
// Stream C v1: shows the RIVR booking widget living inside a generic practice
// website (mock browser chrome → mock practice nav → embedded booking flow
// screenshot). Static for this pass; Stream C v2 may add scroll-driven motion.
function IntegrationSection() {
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
              Your booking funnel drops into your existing website as an embedded iframe. Your navigation, your branding, your CMS — all untouched. Patients see one familiar site with one new page that actually takes the booking.
            </p>
          </FadeUp>
        </div>

        <FadeUp delay={120}>
          <div className="integration-mock" role="img" aria-label="Mock browser window showing the RIVR booking widget embedded inside a generic practice site.">
            <div className="browser-chrome" aria-hidden>
              <i /><i /><i />
              <span className="url">destinmedspa.com/book</span>
            </div>
            <div className="practice-nav" aria-hidden>
              <span className="brand">DESTIN MED SPA</span>
              <span className="links">
                <span>Services</span>
                <span>Team</span>
                <span>About</span>
                <span>Book</span>
              </span>
            </div>
            <img
              className="embed"
              src="imagery/demos/lumera-booking-flow.jpg"
              alt=""
              loading="lazy"
            />
          </div>
        </FadeUp>
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

function CredibilityStats() {
  return (
    <section className="section" style={{ paddingBlock: "120px" }}>
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

        {/* Stream A (Category 6): inline citations removed from the visible copy.
            Evidence lives behind a discrete link — routes to /evidence once it
            exists (placeholder anchor for now). */}
        <p className="stats-evidence">
          <a href="/#evidence">see evidence →</a>
        </p>
      </div>
    </section>);

}

// ─── Live Demo (3D tilt panels) ──────────────────────────────────────────────
const DEMO_PANELS = [
{ src: "imagery/lumera-hero.png", alt: "Lumera booking page hero with Book your visit headline" },
{ src: "imagery/lumera-team.png", alt: "Lumera practitioner team cards including Dr. Sarah Chen" },
{ src: "imagery/lumera-calendar.png", alt: "Lumera time-slot calendar with selectable dates" }];


function TiltCard({ children }) {
  const ref = useRefH(null);
  const [tilt, setTilt] = useStateH({ rx: 0, ry: 0, sx: 0, sy: 0, hover: false });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -y * 8, ry: x * 8, sx: x * 40, sy: y * 40, hover: true });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, sx: 0, sy: 0, hover: false });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="demo-card"
      style={{
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(${tilt.hover ? -4 : 0}px)`,
        transformStyle: "preserve-3d",
        transition: tilt.hover ? "transform 80ms linear, box-shadow 240ms cubic-bezier(0.22,1,0.36,1)" : "transform 600ms cubic-bezier(0.22,1,0.36,1), box-shadow 240ms cubic-bezier(0.22,1,0.36,1)"
      }}>
      
      {children}
    </div>);

}

function LiveDemo() {
  return (
    <section className="section" id="live-demo">
      {/* TODO Stream C: restructure as single hover-animated screenshot — currently redundant with hero */}
      <div className="container">
        <div className="section-header">
          <FadeUp><p className="text-label-caps">Live prototype</p></FadeUp>
          <RevealLines
            as="h2" className="text-display-2" baseDelay={120}
            lines={[<>Meet <span className="serif" style={{ color: "var(--color-accent)" }}>Lumera</span>, a reference build.</>]} />

          <FadeUp delay={320}>
            <p className="text-body-lg" style={{ marginTop: 24 }}>
              Lumera is a reference build — a complete booking flow we made to show how a multi-tier surgical and injectables practice books patients. Click around, book a mock appointment, browse the practitioner cards, read the FAQ. The whole thing is live.
            </p>
          </FadeUp>
          <FadeUp delay={420}>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
              <PrototypeModalContext.Consumer>
                {({ openModal }) => (
                  <Button onClick={openModal} variant="primary">Open the live prototype</Button>
                )}
              </PrototypeModalContext.Consumer>
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={120}>
          <div className="demo-grid" style={{ marginTop: 56 }}>
            {DEMO_PANELS.map((p, i) =>
            <TiltCard key={i}>
                <div className="body"><img src={p.src} alt={p.alt} loading="lazy" /></div>
              </TiltCard>
            )}
          </div>
        </FadeUp>
      </div>
    </section>);

}

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
            {/* trailing card: spacer + cta */}
            <div className="work-tile" style={{ background: "var(--color-bg-dark)", color: "#fff", border: 0, alignItems: "center", justifyContent: "center", padding: 48 }}>
              <div style={{ textAlign: "center", padding: "48px 24px" }}>
                <p className="text-label-caps" style={{ color: "var(--color-accent)", marginBottom: 20 }}>Yours next</p>
                <h3 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", lineHeight: 1.05, marginBottom: 24 }}>
                  What does <em>your</em> booking page lead with?
                </h3>
                <Button href="book.html" variant="primary">Book a walkthrough</Button>
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
        <LiveDemo />
        <SampleWork />
        <ClosingCTA />
      </main>
      <Footer />
      <PrototypeModal open={modal.open} onClose={modal.closeModal} />
    </PrototypeModalContext.Provider>);

}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Page />);