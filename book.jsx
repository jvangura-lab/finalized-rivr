// =============================================================================
// BOOK page — Hero with agenda + interactive calendar widget, FAQ
// =============================================================================
const { useState: useStateB, useEffect: useEffectB, useRef: useRefB } = React;
const {
  useReveal, useScrollProgress, useMousePos,
  clamp, lerp, mix,
  Reveal, FadeUp, RevealLines, Nav, Button, Footer, ClosingCTA, Cursor,
} = window;

const AGENDA = [
  "We show you the booking page we would build for your practice.",
  "We walk through how it would talk to your existing calendar.",
  "You get the mockup whether or not we move forward.",
];

const FAQ_B = [
  { q: "What if my current setup is a mess?", a: "That is the most common case. We will not judge it. We will show you which piece does the heaviest lifting and which piece you can leave alone." },
  { q: "Do you sign an NDA?", a: "Yes, before the call if you send one over. By default we treat anything you share as confidential to your practice." },
  { q: "Is this a sales call?", a: "Only if you want it to be. The 30 minutes are a working session. If you ask us for next steps, we share what a build looks like. Otherwise we hang up and you keep the mockup." },
];

// ─── Mini calendar widget ────────────────────────────────────────────────────
function CalendarWidget() {
  // Static days-in-may layout
  const [selDate, setSelDate] = useStateB(22);
  const [selTime, setSelTime] = useStateB(null);

  // Friday 22 May 2026 -> we'll show a typical month grid
  // May 2026: 1 = Friday. So pad 5 cells (Sun-Thu) before day 1.
  const daysInMonth = 31;
  const firstDow = 5; // 0=Sun, 5=Fri
  const today = 17;
  const availableSet = new Set([18, 19, 20, 21, 22, 26, 27, 28, 29]);

  const times = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM", "2:00 PM"];

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push({ muted: true, day: null, k: `pad-${i}` });
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      muted: d < today,
      available: availableSet.has(d),
      day: d,
      selected: d === selDate,
      k: `d-${d}`,
    });
  }

  return (
    <div className="calendar-placeholder">
      <div className="cal-mini-head">
        <span className="month">May <span className="serif" style={{ fontSize: "1.1em" }}>2026</span></span>
        <div className="nav-btns">
          <button type="button" aria-label="Previous month">‹</button>
          <button type="button" aria-label="Next month">›</button>
        </div>
      </div>

      <div className="cal-grid-mini">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i} className="dow">{d}</span>)}
        {cells.map((c) => (
          c.day === null
            ? <span key={c.k} className="day-cell muted" />
            : (
              <button
                key={c.k}
                className={`day-cell ${c.muted ? "muted" : ""} ${c.available ? "available" : ""} ${c.selected ? "selected" : ""}`}
                disabled={c.muted}
                onClick={() => { setSelDate(c.day); setSelTime(null); }}
                type="button"
              >
                {c.day}
              </button>
            )
        ))}
      </div>

      <div className="times">
        <p className="title">
          {selDate ? `Available · Fri May ${selDate}` : "Pick a day"}
        </p>
        <div className="times-grid">
          {times.map((t) => (
            <button
              type="button"
              key={t}
              className={`time-slot ${selTime === t ? "selected" : ""}`}
              onClick={() => setSelTime(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
            Times in your local zone · 30 minutes · Google Meet
          </p>
          <Button
            href={selTime ? "#" : undefined}
            onClick={selTime ? undefined : () => alert("Please pick a time first.")}
            variant="primary"
            className={selTime ? "" : "disabled"}
          >
            {selTime ? `Confirm · ${selTime}` : "Pick a time"}
          </Button>
        </div>
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
              lines={[<>Book a <span className="serif" style={{ color: "var(--color-accent)" }}>30-min</span></>, <>walkthrough.</>]}
            />
            <Reveal delay={420}>
              <p className="text-body-lg" style={{ marginTop: 32, marginBottom: 36, maxWidth: 540 }}>
                Thirty minutes on Google Meet. We look at your current setup, show you the booking page we would build for your practice, and you keep the mockup whether or not we move forward.
              </p>
            </Reveal>

            <Reveal delay={520}>
              <div className="founder-card">
                <div className="av">
                  <img src="imagery/rivr-founders-team.png" alt="Thor and Jonas, RIVR co-founders" />
                </div>
                <div>
                  <p className="name">Thor Gyulai and Jonas Vangura</p>
                  <p className="sub">Co-founders. You will meet both on the call.</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={620}>
              <p className="text-label-caps" style={{ color: "var(--color-accent)", marginBottom: 18 }}>What we cover</p>
            </Reveal>
            <ul className="agenda">
              {AGENDA.map((item, i) => (
                <FadeUp as="li" key={i} delay={720 + i * 80}>
                  <span className="num">{i + 1}</span>
                  <span>{item}</span>
                </FadeUp>
              ))}
            </ul>

            <Reveal delay={1000}>
              <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                No slides. No sales deck. No follow-up unless you ask.
              </p>
            </Reveal>
          </div>

          <FadeUp delay={300}>
            <CalendarWidget />
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
          <FadeUp><p className="text-label-caps" style={{ color: "var(--color-accent)" }}>Frequently asked</p></FadeUp>
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
                style={{
                  width: "100%", textAlign: "left", padding: 0,
                  display: "flex", justifyContent: "space-between", gap: 24, alignItems: "flex-start",
                }}
              >
                <h3 style={{ marginBottom: 0 }}>{item.q}</h3>
                <span style={{
                  flexShrink: 0, fontSize: "1.25rem", lineHeight: 1, color: "var(--color-accent)",
                  transform: open === i ? "rotate(45deg)" : "rotate(0)",
                  transition: "transform 400ms var(--ease-rivr)",
                }}>+</span>
              </button>
              <div style={{
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
      <Cursor />
      <Nav current="home" />
      <main>
        <BookHero />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Page />);
