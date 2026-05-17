// =============================================================================
// ABOUT page — Hero (sequenced reveal), Founders photo (image mask),
// Founders bios (split reveal), Why, What we do/don't, Location, ClosingCTA
// =============================================================================
const { useRef: useRefA, useEffect: useEffectA, useState: useStateA } = React;
const {
  useReveal, useScrollProgress, useStickyProgress, useMousePos,
  clamp, lerp, mix,
  Reveal, FadeUp, RevealLines, Nav, Button, Footer, ClosingCTA, Cursor,
} = window;

// ─── About Hero ──────────────────────────────────────────────────────────────
function AboutHero() {
  return (
    <section className="hero-stage" style={{ minHeight: "auto", paddingBlock: "180px 100px" }}>
      <div className="hero-grid-bg" aria-hidden />
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 760 }}>
          <Reveal>
            <p className="text-label-caps" style={{ color: "var(--color-accent)", marginBottom: 26 }}>About</p>
          </Reveal>
          <RevealLines
            as="h1" className="text-display-1" baseDelay={60} gap={110}
            lines={[
              <>Two co-founders.</>,
              <>Both build, both ship,</>,
              <>both <span className="serif" style={{ color: "var(--color-accent)" }}>answer the phone</span>.</>,
            ]}
          />
          <Reveal delay={620}>
            <p className="text-body-lg" style={{ marginTop: 40, maxWidth: 620 }}>
              RIVR is a two-person studio in Jacksonville Beach. We build online booking systems for medical spas and aesthetic practices. No managers, no account reps, no offshore handoff. The two people who designed your page also ship it and support it.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Founders section: image mask + parallax photo, then bios ───────────────
function FoundersSection() {
  const [secRef, p] = useScrollProgress();
  const mouse = useMousePos();
  // Parallax on the image (drift up as user scrolls past)
  const imgY = (p - 0.4) * -60;
  // Subtle mouse tilt
  const tilt = mouse.x * 1.5;

  const imgRef = useReveal();

  return (
    <section ref={secRef} className="section">
      <div className="container">
        {/* Photo with image mask reveal */}
        <div ref={imgRef} className="about-photo img-mask" style={{
          transform: `translateY(${imgY}px) rotate(${tilt * 0.4}deg)`,
          willChange: "transform, clip-path",
        }}>
          <img src="imagery/rivr-founders-team.png" alt="Thor Gyulai and Jonas Vangura at work" />
          <div style={{
            position: "absolute", left: 24, bottom: 24,
            background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)",
            color: "#fff", padding: "10px 16px", borderRadius: 999,
            fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
          }}>
            <span style={{ color: "var(--color-accent)" }}>◆</span> &nbsp;Jonas + Thor &nbsp;·&nbsp; Jacksonville Beach
          </div>
        </div>

        {/* Bios */}
        <div className="founders">
          <FadeUp>
            <div className="founder">
              <p className="label">Co-founder</p>
              <h2>Jonas Vangura</h2>
              <p className="title">Engineering and operations</p>
              <p>
                Jonas leads the engineering side of RIVR. The booking pages run on his code, the calendar integrations are his pipes, and the on-call line goes to his phone when a deploy needs to land at 11pm.
              </p>
              <p>
                Before RIVR, Jonas spent years building integration-heavy web products and watching small practices wrestle with booking platforms designed for chains a hundred times their size. The thing that pulled him into this problem was simple: the gap between what a small med spa actually needs and what the big platforms force on them.
              </p>
              <p>
                He answers texts faster than email and prefers shipping something working over decking a meeting about shipping something working.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={140}>
            <div className="founder">
              <p className="label">Co-founder</p>
              <h2>Thor Gyulai</h2>
              <p className="title">Design and customer</p>
              <p>
                Thor leads the design and customer side of RIVR. The visual language of every booking page, the way it reads on a patient's phone at 11pm, the conversation we have with a med spa owner on the walkthrough call, all his work.
              </p>
              <p>
                Before RIVR, Thor designed booking and conversion flows for aesthetic and wellness brands. He kept hearing the same thing from operators: the patient experience and the front-desk experience could be calm, branded, and quietly excellent, but no one was building it that way. So we did.
              </p>
              <p>
                He answers the phone, walks every prospect through their own site live, and would rather lose a deal than ship a booking page he is not proud of.
              </p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── Why we built this (sticky pinned text reveal) ───────────────────────────
function WhyWeBuilt() {
  const [secRef, p] = useScrollProgress();
  // Sticky pinned text where words emphasize as you scroll
  return (
    <section ref={secRef} className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <Reveal>
          <p className="text-label-caps" style={{ color: "var(--color-accent)", marginBottom: 26 }}>Why we built this</p>
        </Reveal>
        <RevealLines
          as="h2" className="text-display-2" baseDelay={60}
          lines={[<>The gap nobody</>, <>was <span className="serif" style={{ color: "var(--color-accent)" }}>filling</span>.</>]}
        />
        <div style={{ marginTop: 56, fontSize: "1.125rem", lineHeight: 1.7 }}>
          <Reveal delay={120}>
            <p style={{ marginBottom: 24 }}>
              We started RIVR because we kept seeing the same gap. Med spas with great care, great teams, and a phone that would not stop ringing because patients could not book online. The big platforms wanted them to rip out everything and start over. The DIY options looked like Google Forms with extra steps.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <p style={{ marginBottom: 24 }}>
              There was not a middle option: a booking page designed for their practice that talked to their existing tools and did not ask their staff to learn anything new. So we built one.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <p>
              We picked one med spa to start, partnered with them, shipped a real booking page connected to their real calendar, and watched the after-hours bookings start landing. Then we did it again. That is the work.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── What we do (and do not) — split with line draw ──────────────────────────
function WhatWeDo() {
  return (
    <section className="section">
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }} className="we-do-grid">
          <FadeUp>
            <div>
              <p className="text-label-caps" style={{ color: "var(--color-accent)", marginBottom: 20 }}>We do</p>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.018em", lineHeight: 1.18, marginBottom: 28 }}>
                Build personalized booking pages.
              </h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 16, fontSize: "1.0625rem", lineHeight: 1.55 }}>
                <li style={listItemStyle}><span style={dotStyle("accent")} />Connect them to your existing calendar and tools.</li>
                <li style={listItemStyle}><span style={dotStyle("accent")} />Host them on your domain.</li>
                <li style={listItemStyle}><span style={dotStyle("accent")} />Stay on call when you need changes.</li>
              </ul>
            </div>
          </FadeUp>

          <FadeUp delay={120}>
            <div>
              <p className="text-label-caps" style={{ color: "var(--color-text-muted)", marginBottom: 20 }}>We do not</p>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.018em", lineHeight: 1.18, marginBottom: 28 }}>
                Sell you a platform you have to migrate to.
              </h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 16, fontSize: "1.0625rem", lineHeight: 1.55, color: "var(--color-text-muted)" }}>
                <li style={listItemStyle}><span style={dotStyle("muted", true)} />Charge per-staff seat fees.</li>
                <li style={listItemStyle}><span style={dotStyle("muted", true)} />Lock your patient data inside our system.</li>
                <li style={listItemStyle}><span style={dotStyle("muted", true)} />Run ads, social media, or branding services.</li>
              </ul>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

const listItemStyle = { display: "flex", gap: 14, alignItems: "flex-start" };
function dotStyle(kind, strike) {
  return {
    flexShrink: 0, marginTop: 10,
    width: 18, height: 1,
    background: kind === "accent" ? "var(--color-accent)" : "var(--color-text-muted)",
    opacity: strike ? 0.6 : 1,
  };
}

// ─── Location ────────────────────────────────────────────────────────────────
function Location() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <Reveal>
          <p className="text-label-caps" style={{ color: "var(--color-accent)", marginBottom: 26 }}>Location</p>
        </Reveal>
        <RevealLines as="h2" className="text-display-2" baseDelay={60}
          lines={[<>Find us in <span className="serif" style={{ color: "var(--color-accent)" }}>Jacksonville Beach</span>.</>]}
        />
        <Reveal delay={240}>
          <address style={{ fontStyle: "normal", marginTop: 36, fontSize: "1.125rem", color: "var(--color-text-primary)", lineHeight: 1.6 }}>
            RIVR Systems<br />
            4016 South Third Street #1016<br />
            Jacksonville Beach, FL 32250
          </address>
        </Reveal>
        <Reveal delay={320}>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14, marginTop: 32, fontSize: "1.125rem" }}>
            <li>
              Email{" "}
              <a href="mailto:hello@rivrsystems.com" style={{ color: "var(--color-accent)", textDecoration: "underline", textUnderlineOffset: 4 }}>
                hello@rivrsystems.com
              </a>
            </li>
            <li style={{ color: "var(--color-text-muted)" }}>
              Available 9am to 7pm ET. Replies in under an hour during business hours.
            </li>
          </ul>
        </Reveal>
        <Reveal delay={420}>
          <div style={{ marginTop: 36 }}>
            <Button href="book.html" variant="primary">Book a 30-min walkthrough</Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Compose ─────────────────────────────────────────────────────────────────
function Page() {
  return (
    <>
      <Cursor />
      <Nav current="about" />
      <main>
        <AboutHero />
        <FoundersSection />
        <WhyWeBuilt />
        <WhatWeDo />
        <Location />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Page />);
