// =============================================================================
// ABOUT page — Hero (sequenced reveal), Founders photo (image mask),
// Founders bios (split reveal), Why, What we do/don't, Location, ClosingCTA
// =============================================================================
const { useRef: useRefA, useEffect: useEffectA, useState: useStateA } = React;
const {
  useReveal, useScrollProgress, useStickyProgress, useMousePos,
  clamp, lerp, mix,
  Reveal, FadeUp, RevealLines, Nav, Button, Footer, ClosingCTA, Cursor, CtaReassure,
} = window;

// ─── About Hero ──────────────────────────────────────────────────────────────
function AboutHero() {
  return (
    <section className="hero-stage" style={{ minHeight: "auto", paddingBlock: "180px 100px" }}>
      <div className="hero-grid-bg" aria-hidden />
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 760 }}>
          <Reveal>
            <p className="text-label-caps" style={{ color: "var(--color-accent-strong)", marginBottom: 26 }}>About</p>
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
        {/* Photo pair with image mask reveal */}
        <div ref={imgRef} className="about-photo about-photo--split img-mask" style={{
          transform: `translateY(${imgY}px) rotate(${tilt * 0.4}deg)`,
          willChange: "transform, clip-path",
        }}>
          <figure>
            <img src="imagery/jonas-headshot.jpg" alt="Jonas Vangura, co-founder of RIVR" />
            <figcaption>Jonas</figcaption>
          </figure>
          <figure>
            <img src="imagery/thor-headshot.jpg" alt="Thor Gyulai, co-founder of RIVR" />
            <figcaption>Thor</figcaption>
          </figure>
          <div style={{
            position: "absolute", left: 24, bottom: 24, zIndex: 2,
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
              <p>
                I'm one of the co-founders behind RIVR. I started it because I kept seeing the same gap, every booking platform on the market expects medspas to migrate to new software, and most medspas already have a good EMR or scheduler they'd built their whole operation around. Asking them to reset their software was the wrong ask. So I built booking that adapts to whatever you're already running, we do the adapting not you.
              </p>
              <p>
                Day to day, Thor and I both work across the whole product: engineering, designing, implementing, customer calls, walkthroughs, etc.
              </p>
              <p>
                Outside of my work at RIVR, I study at Florida International University's Honors College and train Muay Thai. The training keeps my head clear and my body in shape, and it's the thing that balances out the hours at a screen, time studying at University, and building at RIVR.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={140}>
            <div className="founder">
              <p className="label">Co-founder</p>
              <h2>Thor Gyulai</h2>
              <p>
                I'm a co-founder at RIVR. I co-founded RIVR because I saw many online booking systems that weren't actually built around how medspas sell and how patients buy. Most booking platforms were just copy-pasting the same template onto every client. So at RIVR, we build every new client's booking page from scratch, based on their requirements and brand. Anywhere from consultation bookings to membership funnels.
              </p>
              <p>
                Day to day, Jonas and I both work across everything, running checks through each others work ensuring all deliverables surpass the standards.
              </p>
              <p>
                On the build side, I own the booking funnels, the live demos, and the marketing site you're reading right now.
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
          <p className="text-label-caps" style={{ color: "var(--color-accent-strong)", marginBottom: 26 }}>Why we built this</p>
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

// ─── Scope — inline prose (Stream C v1 list→prose conversion) ────────────────
// Replaces the previous "We do / We do not" two-column list. The substance of
// every do-item (build personalized booking pages, connect to existing
// calendar/tools, host on the practice's domain, make changes after launch)
// and every don't-item (sell a platform you have to migrate to, per-staff seat
// fees, lock patient data, ads/social/branding services) is preserved — woven
// into a confident scope statement rather than a defensive checklist.
function WhatWeDo() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <FadeUp>
          <p className="text-label-caps" style={{ color: "var(--color-accent-strong)", marginBottom: 26 }}>Scope</p>
        </FadeUp>
        <FadeUp delay={120}>
          <div style={{ fontSize: "1.125rem", lineHeight: 1.7, color: "var(--color-text-primary)" }}>
            <p style={{ marginBottom: 22 }}>
              We build personalized booking pages for aesthetic medicine practices — consult, service, or membership flows that fit how a given practice actually books. We connect each one to the calendar and tools the team already runs, host it on the practice's own domain, and make changes after launch as the practice changes.
            </p>
            <p>
              We don't sell a platform you have to migrate to. No per-staff seat fees, no locking your patient data inside our system, no ads, social media, or branding services on the side. When something falls outside the booking-funnel scope, we refer you to specialists we trust.
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Location ────────────────────────────────────────────────────────────────
function Location() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <Reveal>
          <p className="text-label-caps" style={{ color: "var(--color-accent-strong)", marginBottom: 26 }}>Location</p>
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
            {/* TODO(thor): replace (phone TBD) with the real Google Voice number. See BLOCKED_ON_THOR.md. */}
            <li>
              Call or text{" "}
              <a href="sms:" style={{ color: "var(--color-accent)", textDecoration: "underline", textUnderlineOffset: 4 }}>
                (phone TBD)
              </a>
            </li>
            <li style={{ color: "var(--color-text-muted)" }}>
              We reply within 48 hours, Monday through Friday.
            </li>
          </ul>
        </Reveal>
        <Reveal delay={420}>
          <div style={{ marginTop: 36 }}>
            <Button href="book.html" variant="primary">Book a 15-min walkthrough</Button>
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
      <Nav current="about" />
      <main id="main">
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
