// =============================================================================
// BOOK page — hero (copy + founder card + agenda) on the left,
// rivr-booking widget iframe on the right (replaces old mock CalendarWidget),
// then the FAQ section. Same page chrome (nav, footer, cursor) as before.
// =============================================================================
const { useState: useStateB, useEffect: useEffectB, useRef: useRefB } = React;
const {
  useReveal, useScrollProgress, useMousePos,
  clamp, lerp, mix,
  Reveal, FadeUp, RevealLines, Nav, Button, Footer, ClosingCTA, Cursor,
} = window;

// NOTE: This is RIVR's OWN walkthrough-booking scheduler (the conversion point of
// the whole funnel), NOT the Lumera demo. It must stay functional — do not point it
// at lumera.rivrsystems.com. The raw Cloud Run URL is ugly but live; the fix is to map
// it to a branded domain (e.g. book.rivrsystems.com), which needs DNS + deploy config.
// TODO(thor): map this scheduler to book.rivrsystems.com and update both constants. See BLOCKED_ON_THOR.md.
const BOOKING_URL = "https://rivr-booking-914650990846.us-central1.run.app/";
const BOOKING_ORIGIN = "https://rivr-booking-914650990846.us-central1.run.app";

const AGENDA = [
  "We walk through how our booking systems work and connect to your schedule.",
  "We discuss the booking system we would build for your practice.",
  "You confirm and we begin building your online booking immediately. Ready in two to three weeks. No obligations.",
];

const FAQ_B = [
  { q: "What if my current setup is a mess?", a: "That is the most common case. We will not judge it. We will show you which piece does the heaviest lifting and which piece you can leave alone." },
  { q: "Do you sign a BAA?", a: "Yes. We sign a HIPAA Business Associate Agreement before any patient data flows through our systems, and we treat anything you share on the call as confidential to your practice by default." },
  { q: "Is this a sales call?", a: "Only if you want it to be. The 15 minutes are a working session. If you ask us for next steps, we share what a build looks like. Otherwise we hang up and you keep the mockup." },
];

// ─── Booking widget iframe (sits in the right column where the old mock calendar lived) ───
function BookingWidget() {
  const [height, setHeight] = useStateB(820);
  const [loaded, setLoaded] = useStateB(false);
  const iframeRef = useRefB(null);

  useEffectB(() => {
    function onMessage(e) {
      if (e.origin !== BOOKING_ORIGIN) return;
      const data = e.data;
      if (!data || typeof data !== "object") return;
      if (data.type === "rivr-booking:height" && typeof data.height === "number") {
        setHeight(Math.max(560, Math.round(data.height)));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="book-widget-wrap" style={{ minHeight: height }}>
      <iframe
        ref={iframeRef}
        src={BOOKING_URL}
        title="Book a walkthrough with RIVR"
        className="book-widget-iframe"
        style={{ height, opacity: loaded ? 1 : 0 }}
        onLoad={() => setLoaded(true)}
        allow="clipboard-write"
      />
      <div className={`book-widget-skeleton ${loaded ? "is-hidden" : ""}`} aria-hidden="true">
        <span className="mk">R</span>
      </div>
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function BookHero() {
  return (
    <section className="hero-stage" style={{ minHeight: "auto", paddingBlock: "150px 100px" }}>
      <div className="hero-grid-bg" aria-hidden />
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <a href="index.html" style={{
          display: "inline-block", marginBottom: 28,
          fontSize: "0.875rem", color: "var(--color-text-muted)",
          transition: "color 180ms var(--ease-rivr)",
        }}>
          ← Back to home
        </a>

        <div className="book-grid">
          <div>
            <RevealLines
              as="h1" className="text-display-1" baseDelay={60}
              lines={[<>Book a <span className="serif" style={{ color: "var(--color-accent)" }}>15-min</span></>, <>walkthrough.</>]}
            />
            <Reveal delay={520}>
              <div className="founder-card">
                <div className="av av--stack">
                  <img src="imagery/jonas-headshot.jpg" alt="Jonas Vangura, RIVR co-founder" />
                  <img src="imagery/thor-headshot.jpg" alt="Thor Gyulai, RIVR co-founder" />
                </div>
                <div>
                  <p className="name">Thor Gyulai and Jonas Vangura</p>
                  <p className="sub">Co-founders. You will meet both on the call.</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={620}>
              <p className="text-label-caps" style={{ color: "var(--color-accent-strong)", marginBottom: 18 }}>What we cover</p>
            </Reveal>
            <ul className="agenda">
              {AGENDA.map((item, i) => (
                <FadeUp as="li" key={i} delay={720 + i * 80}>
                  <span className="num">{i + 1}</span>
                  <span>{item}</span>
                </FadeUp>
              ))}
            </ul>

            {/* RIVR-NOTE: book hero sub-line — parallel structure to home hero. */}
            <Reveal delay={1000}>
              <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                A short look at your setup. We show you the booking page we'd build. Fifteen minutes.
              </p>
            </Reveal>
          </div>

          <FadeUp delay={300}>
            <BookingWidget />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useStateB(0);
  return (
    <section className="section" style={{ borderBottom: 0 }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <FadeUp><p className="text-label-caps" style={{ color: "var(--color-accent-strong)" }}>Frequently asked</p></FadeUp>
          <FadeUp delay={120}>
            <h2 className="text-display-2" style={{ marginTop: 16 }}>Common questions, answered.</h2>
          </FadeUp>
        </div>
        <ul className="faq-list">
          {FAQ_B.map((item, i) => (
            <FadeUp as="li" delay={i * 60} key={i} className="faq-item">
              <button
                type="button"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
                aria-controls={`book-faq-${i}`}
                style={{
                  width: "100%", textAlign: "left", padding: 0,
                  display: "flex", justifyContent: "space-between", gap: 24, alignItems: "flex-start",
                }}
              >
                <h3 style={{ marginBottom: 0 }}>{item.q}</h3>
                <span aria-hidden style={{
                  flexShrink: 0, fontSize: "1.25rem", lineHeight: 1, color: "var(--color-accent)",
                  transform: open === i ? "rotate(45deg)" : "rotate(0)",
                  transition: "transform 400ms var(--ease-rivr)",
                }}>+</span>
              </button>
              <div
                id={`book-faq-${i}`}
                role="region"
                style={{
                  maxHeight: open === i ? "320px" : "0",
                  overflow: "hidden",
                  transition: "max-height 600ms var(--ease-rivr)",
                }}>
                <p style={{ marginTop: 14, color: "var(--color-text-muted)", lineHeight: 1.6 }}>{item.a}</p>
              </div>
            </FadeUp>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── Compose ─────────────────────────────────────────────────────────────────
function Page() {
  return (
    <>
      <Nav current="home" />
      <main id="main">
        <BookHero />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Page />);
