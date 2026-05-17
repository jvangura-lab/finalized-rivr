// =============================================================================
// HOME page — Hero (scroll-driven), Stats (count-up), LiveDemo (3D tilt),
// Benefits (icon reveals + watermark), SampleWork (horizontal scroll),
// ClosingCTA.
// =============================================================================
const { useState: useStateH, useEffect: useEffectH, useRef: useRefH, useLayoutEffect: useLayoutEffectH } = React;
const {
  useReveal, useScrollProgress, useStickyProgress, useMousePos, useCountUp,
  clamp, lerp, mix,
  Reveal, FadeUp, RevealLines, Nav, Button, Footer, BrowserFrame, ClosingCTA, Cursor
} = window;

const LUMERA_URL = "https://lumera-prototype-802456812494.us-central1.run.app/";

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  const [stageRef, progress] = useScrollProgress();
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
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
          gap: 56,
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
              <p className="text-label-caps" style={{ color: "var(--color-accent)", marginBottom: 22 }}>
                Online booking systems for medical spas
              </p>
            </FadeUp>

            <RevealLines
              as="h1"
              className="text-display-1"
              baseDelay={60}
              gap={90}
              lines={[
              <>Booking pages that fit</>,
              <>the system you <span className="serif" style={{ color: "var(--color-accent)" }}>already run</span>.</>]
              } />
            

            <Reveal delay={420}>
              <p className="text-body-lg" style={{ maxWidth: 540, margin: "28px 0 36px" }}>
                Your patients see a calm, branded booking experience. Your team sees the bookings land in the calendar they already use. No new platform. No staff retraining. No data migration.
              </p>
            </Reveal>

            <Reveal delay={540}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center", marginBottom: 24 }}>
                <Button href="book.html" variant="primary">Book a 30-min walkthrough</Button>
                <Button href={LUMERA_URL} external variant="secondary">See the live prototype</Button>
              </div>
            </Reveal>

            <Reveal delay={640}>
              <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                No slides. No pitch deck. 30 minutes.
              </p>
            </Reveal>
          </div>

          {/* Visual — scroll-driven browser frame */}
          <div style={{ position: "relative", minHeight: 420 }}>
            <Reveal>
              <div style={{
                transform: `translateY(${frameY}px) scale(${frameScale}) rotate(${frameRotate}deg)`,
                transition: "opacity 120ms linear",
                willChange: "transform, opacity",
                opacity: frameOpacity
              }}>
                <div style={{
                  position: "absolute", inset: -28, borderRadius: 32,
                  background: "radial-gradient(ellipse at center, rgba(201, 168, 117, 0.18), transparent 60%)",
                  filter: "blur(28px)",
                  pointerEvents: "none"
                }} />
                <BrowserFrame
                  src="imagery/lumera-hero.png"
                  alt="Lumera Aesthetics booking page hero"
                  url="lumera-aesthetics.com / book"
                  style={{ position: "relative" }} />
                
              </div>
            </Reveal>

            {/* Floating chip: appointment confirmation */}
            <div className="hero-chip hero-chip-confirm" style={{
              right: -18, top: 36,
              transform: `translate(${chip1X}px, ${chip1Y}px)`,
              willChange: "transform"
            }}>
              <span className="dot" />
              <div>
                <p style={{ fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-muted-inverse)", marginBottom: 2 }}>New booking</p>
                <p style={{ fontSize: "0.875rem", fontWeight: 600 }}>HydraFacial · 2:30 PM</p>
              </div>
            </div>

            {/* Floating chip: calendar */}
            <div className="hero-chip" style={{
              left: -28, bottom: 28,
              transform: `translate(${chip2X}px, ${chip2Y}px)`,
              willChange: "transform"
            }}>
              <span className="dot" />
              <div>
                <p style={{ fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: 2 }}>Synced to</p>
                <p style={{ fontSize: "0.875rem", fontWeight: 600 }}>Google Calendar</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-cue" style={{ opacity: clamp(1 - progress * 3, 0, 1) }}>
        <span>Scroll</span>
        <span className="line" />
      </div>
    </section>);

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
const STATS = [
{ n: 68, suffix: "%", label: "want online booking", body: "of patients want to schedule, change, or cancel healthcare appointments online.", cite: 1 },
{ n: 80, suffix: "%", label: "use it to pick a provider", body: "of healthcare consumers say online scheduling influences which provider they choose.", cite: 2 },
{ n: 38, suffix: "%", label: "fewer no-shows", body: "lower no-show rates when patients receive a text message appointment reminder.", cite: 3 },
{ n: 25, suffix: "%", label: "abandon hard booking", body: "of consumers abandon the booking attempt if scheduling is not simple and convenient.", cite: 4, prefix: "~" }];


const SOURCES = [
{ n: 1, text: "Accenture, 2019 Digital Health Consumer Survey.", href: "https://www.ehidc.org/sites/default/files/resources/files/Accenture-2019-Digital-Health-Consumer-Survey.pdf" },
{ n: 2, text: "Press Ganey, Online appointment scheduling: the last mile of patient access.", href: "https://www.pressganey.com/resources/blog/online-appointment-scheduling-last-mile/" },
{ n: 3, text: "Pragmatic Randomized Study of Targeted Text Message Reminders. The Permanente Journal, 2022.", href: "https://pubmed.ncbi.nlm.nih.gov/35609163/" },
{ n: 4, text: "Press Ganey, Online appointment scheduling: the last mile of patient access.", href: "https://www.pressganey.com/resources/blog/online-appointment-scheduling-last-mile/" }];


function StatCard({ stat }) {
  const [ref, text] = useCountUp(stat.n, { duration: 1700, prefix: stat.prefix || "", suffix: stat.suffix });
  return (
    <div className="stat-card">
      <p className="n" ref={ref}>{text}<sup>{stat.cite}</sup></p>
      <p className="lbl">{stat.label}</p>
      <p className="body">{stat.body}</p>
    </div>);

}

function CredibilityStats() {
  return (
    <section className="section" style={{ paddingBlock: "120px" }}>
      <div className="container">
        <div className="section-header">
          <FadeUp><p className="text-label-caps">Why this matters</p></FadeUp>
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

        <ol className="sources">
          {SOURCES.map((src) =>
          <li key={src.n}>
              <span className="n">{src.n}.</span>
              <span>
                {src.text}{" "}
                <a href={src.href} target="_blank" rel="noopener noreferrer">Source</a>
              </span>
            </li>
          )}
        </ol>
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
      <div className="container">
        <div className="section-header">
          <FadeUp><p className="text-label-caps">Live prototype</p></FadeUp>
          <RevealLines
            as="h2" className="text-display-2" baseDelay={120}
            lines={[<>This is the booking page we built for <span className="serif" style={{ color: "var(--color-accent)" }}>Lumera Aesthetics</span>.</>]} />
          
          <FadeUp delay={320}>
            <p className="text-body-lg" style={{ marginTop: 24 }}>
              Lumera is a Jacksonville Beach med spa we partnered with. Click around, book a fake appointment, browse the practitioner cards, read the FAQ. The whole thing is live.
            </p>
          </FadeUp>
          <FadeUp delay={420}>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
              <Button href={LUMERA_URL} external variant="primary">Open the live prototype</Button>
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={120}>
          <div className="demo-grid" style={{ marginTop: 56 }}>
            {DEMO_PANELS.map((p, i) =>
            <TiltCard key={i}>
                <div className="head"><i /><i /><i /></div>
                <div className="body"><img src={p.src} alt={p.alt} loading="lazy" /></div>
              </TiltCard>
            )}
          </div>
        </FadeUp>
      </div>
    </section>);

}

// ─── Benefits (dark) ─────────────────────────────────────────────────────────
const BENEFITS = [
{
  icon:
  <svg className="ico" viewBox="0 0 80 80" fill="none" aria-hidden>
        <path d="M12 60 L12 12 M12 60 L68 60" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 50 L32 38 L42 46 L56 24" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="ico-draw" />
        <path d="M50 24 L56 24 L56 30" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="32" cy="38" r="2" fill="var(--color-accent)" />
        <circle cx="42" cy="46" r="2" fill="var(--color-accent)" />
      </svg>,

  title: "Drive online bookings",
  body: "Your patients book themselves on their phone at 11pm. The appointment lands in your calendar before your front desk gets in tomorrow. No phone tag, no manual entry."
},
{
  icon:
  <svg className="ico" viewBox="0 0 80 80" fill="none" aria-hidden>
        <rect x="14" y="18" width="52" height="14" rx="2" stroke="var(--color-accent)" strokeWidth="1.5" />
        <rect x="14" y="36" width="52" height="14" rx="2" stroke="var(--color-accent)" strokeWidth="1.5" />
        <rect x="14" y="54" width="52" height="10" rx="2" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.45" />
        <path d="M48 25 L52 28 L60 22" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M48 43 L52 46 L60 40" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>,

  title: "No new system to adopt",
  body: "We integrate with the calendar, EMR, and tools you already use. Nothing to install, nothing for your staff to learn, nothing to migrate. Your current system keeps running exactly the same."
},
{
  icon:
  <svg className="ico" viewBox="0 0 80 80" fill="none" aria-hidden>
        <path d="M18 26 C18 21 22 18 26 18 L54 18 C58 18 62 21 62 26 L62 46 C62 51 58 54 54 54 L36 54 L26 62 L26 54 C22 54 18 51 18 46 Z" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="30" cy="36" r="2" fill="var(--color-accent)" />
        <circle cx="40" cy="36" r="2" fill="var(--color-accent)" />
        <circle cx="50" cy="36" r="2" fill="var(--color-accent)" />
      </svg>,

  title: "Real humans, immediate support",
  body: "Questions go to Thor and Jonas directly. Not a ticket system, not a chatbot, not a level-1 support rep. Text the same number you'd text a friend."
}];


function Benefits() {
  const [sectionRef, p] = useScrollProgress();
  return (
    <section ref={sectionRef} className="section section-dark" style={{ paddingBlock: "160px", position: "relative", overflow: "hidden" }}>
      <span aria-hidden style={{
        position: "absolute", left: "50%", top: "50%",
        transform: `translate(-50%, ${-50 + (p - 0.5) * 40}%)`,
        fontSize: "clamp(20rem, 50vw, 56rem)",
        fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 600,
        color: "rgba(201, 168, 117, 0.05)", letterSpacing: "-0.04em",
        pointerEvents: "none", lineHeight: 0.85, whiteSpace: "nowrap"
      }}>R</span>

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <RevealLines
          as="h2"
          className="text-display-2"
          baseDelay={60}
          lines={[<>Built to grow your practice,</>, <><span className="serif" style={{ color: "var(--color-accent)" }}>not your tooling stack</span>.</>]}
          style={{ textAlign: "center", maxWidth: 880, margin: "0 auto 80px" }} />
        
        <FadeUp>
          <div className="benefits-grid">
            {BENEFITS.map((b, i) =>
            <div className="benefit" key={i}>
                {b.icon}
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </div>
            )}
          </div>
        </FadeUp>
      </div>
    </section>);

}

// ─── SampleWork (horizontal scroll) ──────────────────────────────────────────
const TILES = [
{
  label: "Consult-first booking",
  brand: "Coastline Aesthetic Group",
  image: "imagery/variant-coastline.png",
  title: "The conversation comes first.",
  body: "When the patient needs a provider to assess them before they buy, the booking page leads with a consult. Three lanes, one continue button, no upsell."
},
{
  label: "Practitioner-first booking",
  brand: "Studio Vela",
  image: "imagery/variant-studio-vela.png",
  title: "The practitioner comes first.",
  body: "When the relationship sits with a specific provider, the booking page leads with a grid of practitioners. Avatars, credentials, first available, one tap to continue."
},
{
  label: "Time-first booking",
  brand: "Northline Skin Co.",
  image: "imagery/variant-northline.png",
  title: "The time comes first.",
  body: "When the practice runs multiple locations, the booking page leads with availability across all of them. Calendar grid, color-coded slots, no double bookings."
}];


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
                  <i /><i /><i />
                  <span className="brand-tag">{t.brand}</span>
                </div>
                <div className="preview">
                  <img src={t.image} alt={t.title} loading="lazy" />
                </div>
                <div className="meta">
                  <p className="label">{t.label}</p>
                  <h3>{t.title}</h3>
                  <p>{t.body}</p>
                  <div className="links">
                    <a href="#" data-cursor="hover">See it live →</a>
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
  return (
    <>
      <Cursor />
      <Nav current="home" />
      <main>
        <Hero />
        <Marquee />
        <CredibilityStats />
        <LiveDemo />
        <Benefits />
        <SampleWork />
        <ClosingCTA />
      </main>
      <Footer />
    </>);

}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Page />);