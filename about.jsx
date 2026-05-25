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
  // Polish 4 / Task 3: padding tightened 180/100 → 120/80 to match the
  // new home hero (.hero-v3) so /about feels proportional.
  return (
    <section className="hero-stage" style={{ minHeight: "auto", paddingBlock: "120px 80px" }}>
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
              <>Both write the code.</>,
              <>Both <span className="serif" style={{ color: "var(--color-accent)" }}>talk to clients</span>.</>,
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

        {/* Bios — Stream C v2 depth pass.
            Three-area structure per founder: (1) background, (2) how we got into
            booking funnels for aesthetic medicine, (3) what we own day-to-day.
            PLACEHOLDER comments mark biographical facts that need founder input. */}
        <div className="founders">
          <FadeUp>
            <div className="founder">
              <p className="label">Co-founder</p>
              <h2>Jonas Vangura</h2>
              <p>
                I study at Florida International University's Honors College and train Muay Thai when I'm not in front of a screen. The training is the counterweight to the hours building.
                {/* PLACEHOLDER: Jonas — specific technical background. When did you start coding? Self-taught or coursework? Favorite stack? First real project you shipped before RIVR? */}
              </p>
              <p>
                {/* PLACEHOLDER: Jonas — the path to RIVR. How did you go from FIU + training to building booking funnels for medspas specifically? Was it through Thor, through a particular conversation, through a job? Who was the first med spa you talked to and what did they say? */}
                The reason this exists: I kept seeing the same gap. Every booking platform on the market expects medspas to migrate to new software, and most medspas already have a good EMR or scheduler they'd built their whole operation around. Asking them to reset their software was the wrong ask, so I built booking that adapts to whatever they're already running — we do the adapting, not them.
              </p>
              <p>
                Day to day, Thor and I both work across the whole product — engineering, design, customer calls, walkthroughs. I own {/* PLACEHOLDER: Jonas — what specifically do you own on the build? Backend? Integrations? Client onboarding? */} on most builds.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={140}>
            <div className="founder">
              <p className="label">Co-founder</p>
              <h2>Thor Gyulai</h2>
              <p>
                I'm 18 and RIVR is my full-time work.
                {/* PLACEHOLDER: Thor — specific technical background. When did you start coding? First language? First project? What were you doing in the year before RIVR? Self-taught, school, bootcamp? */}
              </p>
              <p>
                {/* PLACEHOLDER: Thor — the path to RIVR. How did the first med spa conversation happen? Why aesthetic medicine specifically — what made retail med spas the right market vs. generic SMB, generic healthcare, or another vertical? */}
                What I kept seeing on the way in: every booking platform was copy-pasting the same template onto every client, regardless of whether it was a single-surgeon concierge or a six-room studio. So at RIVR we build every client's booking page from scratch — consultation bookings, service menus, membership funnels — to the practice's actual pattern.
              </p>
              <p>
                On the build side I own the booking funnels, the three live demos at <em>the build</em>, and the marketing site you're reading right now. Day to day, Jonas and I run checks on each other's work so the deliverables hold up.
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
              We started RIVR because we kept seeing the same gap. Practices stuck between a DIY plugin — Squarespace plus a booking widget, $500 in setup, that doesn't actually book — and an enterprise platform — Boulevard or Mindbody, $30K-plus, requiring a migration of the whole operation onto someone else's software. Nothing in the middle.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <p style={{ marginBottom: 24 }}>
              The middle is what most practices actually need: a booking funnel that sits in front of the calendar and EMR they already run, on their own domain, with the same pricing and policies they've already worked out. No migration, no new software for staff to learn, no per-seat fees. So we built that — for practices that have outgrown the template but can't justify the enterprise cost.
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
