// =============================================================================
// ABOUT page — ethos/pathos rebuild
//
// 5-section architecture deploying the strategic argument:
// "You'll look at us and think we're too young. We grew up with this. We're
//  more fluent in modern AI tooling and modern web than anyone you can hire
//  for our price. That's the asset. Plus this is our entire focus."
//
//   1. AboutHero          — short framing, who we are
//   2. AgeQuestion        — name the elephant, reframe (pivot section)
//   3. FoundersSection    — photo pair + restructured 2-para bios
//   4. WhereWeAreFrom     — Ponte Vedra / TPC pathos beat
//   5. WhatWereBuilding   — closing CTA
//
// PLACEHOLDER markers throughout flag spots where the founder will fill
// in personal specifics tomorrow morning before deploy (look for the
// exact string "[PLACEHOLDER" to find them — both in JSX comments and
// in rendered copy).
// =============================================================================
const { useRef: useRefA, useEffect: useEffectA, useState: useStateA } = React;
const {
  useReveal, useScrollProgress, useStickyProgress, useMousePos,
  clamp, lerp, mix,
  Reveal, FadeUp, RevealLines, Nav, Button, Footer, Cursor, CtaReassure,
} = window;

// ─── Section 1 — About Hero ─────────────────────────────────────────────
// Lightly polished from the previous version. Headline tightened to lead
// with the audience-positioning hook ("Built for practices that have
// outgrown templates"). Italic accents removed (Polish 4 typography pass).
function AboutHero() {
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
              <>Two founders.</>,
              <>Both code.</>,
              <>Built for practices that have <span className="serif" style={{ color: "var(--color-accent)" }}>outgrown templates</span>.</>,
            ]}
          />
          <Reveal delay={680}>
            <p className="text-body-lg" style={{ marginTop: 40, maxWidth: 620 }}>
              RIVR is a two-person studio. We build custom booking funnels for medical spas and aesthetic practices &mdash; not template installs, not platform migrations. The two people who design your page also ship it and support it.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Section 2 — The Age Question ───────────────────────────────────────
// The structural pivot. Place this BEFORE the founder photos so prospects
// encounter the age reframe before they scan a face and form a snap
// judgement. This is the most strategically important section on the page.
// The placeholder copy is solid enough to ship if not rewritten, but
// clearly invites a founder pass to add personal register.
function AgeQuestion() {
  return (
    <section className="section about-age">
      <div className="container" style={{ maxWidth: 760 }}>
        <Reveal>
          <p className="text-label-caps" style={{ color: "var(--color-accent-strong)", marginBottom: 26 }}>On our age</p>
        </Reveal>
        <RevealLines
          as="h2" className="text-display-2" baseDelay={60} gap={90}
          lines={[
            <>We&rsquo;re 18.</>,
            <>That&rsquo;s not a problem.</>,
            <>It&rsquo;s the reason this works.</>,
          ]}
        />
        <div style={{ marginTop: 56, fontSize: "1.125rem", lineHeight: 1.7, maxWidth: 680 }}>
          {/* [PLACEHOLDER: founder will refine voice — paragraph 1 acknowledges
              the objection directly. Keep "We grew up with this." somewhere.] */}
          <Reveal delay={120}>
            <p style={{ marginBottom: 24 }}>
              Most of the people we talk to in the aesthetic medicine space have ten or twenty years on us. Their first read on our age is going to be a credibility question, and we&rsquo;re not going to pretend otherwise. So we&rsquo;ll name it now: we&rsquo;re 18, this is the work, and here&rsquo;s why we think it&rsquo;s an asset rather than a liability.
            </p>
          </Reveal>

          {/* [PLACEHOLDER: founder will refine voice — paragraph 2 reframes
              age as fluency advantage. Specific: modern AI tooling, modern
              web stack. Avoid vague "digital native" cliche.] */}
          <Reveal delay={240}>
            <p style={{ marginBottom: 24 }}>
              We grew up with this technology. We&rsquo;ve been using modern AI tooling since it shipped, building on modern web stacks since they became the default. Compared to the agencies and freelancers a practice typically considers in our price band, we&rsquo;re faster, more current, and more comfortable with the tools the work actually needs. That fluency compounds into output quality.
            </p>
          </Reveal>

          {/* [PLACEHOLDER: founder will refine voice — paragraph 3 bridges
              to credibility ("the work argues for itself"). Reference the
              three demos.] */}
          <Reveal delay={360}>
            <p style={{ marginBottom: 24 }}>
              We don&rsquo;t ask you to take this on faith. Every reference build on our site &mdash; Sela, Devereaux, Lumera &mdash; was built by us, end to end. Walk through any of them. The work argues for itself.
            </p>
          </Reveal>

          {/* [PLACEHOLDER: founder will refine voice — paragraph 4 bridges
              to conviction. RIVR is the entire focus, not a side project,
              you get the attention every client gets.] */}
          <Reveal delay={480}>
            <p>
              And because this is our entire focus &mdash; not a side gig, not a class project, not a stepping stone to a different career &mdash; you get the attention every client gets. We pick up the phone. We sign the BAA. We answer in 48 hours. That&rsquo;s the deal.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Section 3 — Founders ───────────────────────────────────────────────
// Existing photo pair + restructured 2-paragraph bios per founder.
// Paragraph 1: technical role at RIVR. Paragraph 2: PLACEHOLDER for personal
// narrative the founder will fill in.
//
// NOTE: Thor's headshot (imagery/thor-headshot.jpg) is scheduled to be
// replaced tonight with a new photo. Keep the markup the same; the file
// will be swapped in place.
function FoundersSection() {
  const [secRef, p] = useScrollProgress();
  const mouse = useMousePos();
  const imgY = (p - 0.4) * -60;
  const tilt = mouse.x * 1.5;
  const imgRef = useReveal();

  return (
    <section ref={secRef} className="section">
      <div className="container">
        <div ref={imgRef} className="about-photo about-photo--split img-mask" style={{
          transform: `translateY(${imgY}px) rotate(${tilt * 0.4}deg)`,
          willChange: "transform, clip-path",
        }}>
          <figure>
            <img src="imagery/jonas-headshot.jpg" alt="Jonas Vangura, co-founder of RIVR" />
            <figcaption>Jonas</figcaption>
          </figure>
          <figure>
            {/* PLACEHOLDER: replace imagery/thor-headshot.jpg tonight before
                deploy. The src path stays the same; just swap the file. */}
            <img src="imagery/thor-headshot.jpg" alt="Thor Gyulai, co-founder of RIVR" />
            <figcaption>Thor</figcaption>
          </figure>
          <div style={{
            position: "absolute", left: 24, bottom: 24, zIndex: 2,
            background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)",
            color: "#fff", padding: "10px 16px", borderRadius: 999,
            fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600,
          }}>
            <span style={{ color: "var(--color-accent)" }}>&#9670;</span> &nbsp;Jonas + Thor &nbsp;&middot;&nbsp; Ponte Vedra Beach
          </div>
        </div>

        <div className="founders">
          <FadeUp>
            <div className="founder">
              <p className="label">Co-founder</p>
              <h2>Jonas Vangura</h2>
              <p>
                I study at Florida International University&rsquo;s Honors College and train Muay Thai when I&rsquo;m not in front of a screen. On the build side, I own the backend integrations &mdash; calendar APIs, intake handoff, the parts that connect a RIVR booking page to whatever software a practice already runs. That&rsquo;s the work that makes &ldquo;no migration&rdquo; actually true.
              </p>
              {/* [PLACEHOLDER: Jonas — fill in 2-3 sentences of personal
                  narrative. Hometown, path to RIVR, what you care about
                  outside the work. Keep it concrete; avoid generic founder
                  bio voice.] */}
              <p>
                <em>[PLACEHOLDER &mdash; Jonas, fill in 2&ndash;3 sentences here: hometown / path to this work / what you care about outside RIVR. Concrete details, not generic founder voice.]</em>
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={140}>
            <div className="founder">
              <p className="label">Co-founder</p>
              <h2>Thor Gyulai</h2>
              <p>
                I&rsquo;m 18 and RIVR is my full-time work. On the build side I own the booking funnels themselves, the three live demos at <em>the build</em>, and the marketing site you&rsquo;re reading right now. Jonas and I run checks on each other&rsquo;s work so the deliverables hold up.
              </p>
              {/* [PLACEHOLDER: Thor — fill in 2-3 sentences of personal
                  narrative. Hometown specifics, what you were doing before
                  RIVR, what you care about outside the work.] */}
              <p>
                <em>[PLACEHOLDER &mdash; Thor, fill in 2&ndash;3 sentences here: where you grew up, what you were doing before RIVR, what you care about outside the work. Concrete, not generic.]</em>
              </p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── Section 4 — Where We're From ───────────────────────────────────────
// Pathos beat. Anchors RIVR geographically and culturally — and quietly
// signals to prospects in the Florida/Southeast aesthetic-medicine market
// that we know the register. Photo grid is a placeholder until the
// founder uploads TPC / hometown shots.
function WhereWeAreFrom() {
  return (
    <section className="section about-from">
      <div className="container" style={{ maxWidth: 880 }}>
        <Reveal>
          <p className="text-label-caps" style={{ color: "var(--color-accent-strong)", marginBottom: 26 }}>Where we&rsquo;re from</p>
        </Reveal>
        <RevealLines
          as="h2" className="text-display-2" baseDelay={60}
          lines={[<>Ponte Vedra Beach, Florida.</>]}
        />
        <div style={{ marginTop: 56, fontSize: "1.125rem", lineHeight: 1.7, maxWidth: 720 }}>
          {/* [PLACEHOLDER: founder will rewrite — paragraph 1 sets the
              place. PV/TPC/Northeast Florida specifics. Avoid postcard
              language.] */}
          <Reveal delay={120}>
            <p style={{ marginBottom: 24 }}>
              We grew up here. A few miles from TPC Sawgrass, a short drive from Jacksonville Beach, in the kind of Northeast Florida town where the local aesthetic-medicine practice is the same one your mom&rsquo;s friend goes to. That proximity isn&rsquo;t a marketing line &mdash; it&rsquo;s the reason we know what a boutique practice actually looks like.
            </p>
          </Reveal>

          {/* [PLACEHOLDER: founder will rewrite — paragraph 2 connects
              place to product instinct. Why this geography gives us an
              edge in this market specifically.] */}
          <Reveal delay={240}>
            <p style={{ marginBottom: 24 }}>
              The practices we build for &mdash; concierge surgical groups, multi-tier studios, retail med spas &mdash; are the kinds of practices that exist within five miles of where we grew up. We&rsquo;ve been around the patient register, the price points, the way a coordinator answers the phone. When you describe your practice on the walkthrough call, we recognize it.
            </p>
          </Reveal>

          {/* [PLACEHOLDER: founder will add personal specifics — childhood,
              family, formative experiences. Concrete + brief.] */}
          <Reveal delay={360}>
            <p>
              <em>[PLACEHOLDER &mdash; one paragraph of personal specifics: childhood / family / a formative moment that connects to why this work feels right. Brief and concrete.]</em>
            </p>
          </Reveal>
        </div>

        {/* Photo grid — placeholder block until founder uploads real shots.
            Clearly marked so it doesn't ship to production accidentally. */}
        <Reveal delay={480}>
          <div className="about-from-photos" aria-hidden>
            <div className="about-from-photo-ph">
              <span>[PHOTO: PONTE VEDRA / TPC]</span>
            </div>
            <div className="about-from-photo-ph">
              <span>[PHOTO: HOMETOWN / FOUNDERS GROWING UP]</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Section 5 — What We're Building (closing CTA) ──────────────────────
// Replaces the shared <ClosingCTA /> on this page with a lighter, more
// personal closer. Mirrors the home closing's "fifteen minutes, one
// screen share" beat but in About's first-person register.
function WhatWereBuilding() {
  return (
    <section className="section about-closing">
      <div className="container" style={{ maxWidth: 760, textAlign: "center" }}>
        <Reveal>
          <p className="text-label-caps" style={{ color: "var(--color-accent-strong)", marginBottom: 26 }}>What&rsquo;s next</p>
        </Reveal>
        <RevealLines
          as="h2" className="text-display-2" baseDelay={60}
          lines={[<>If this resonates,</>, <>let&rsquo;s talk.</>]}
        />
        <Reveal delay={300}>
          <p className="text-body-lg" style={{ marginTop: 40, maxWidth: 600, marginInline: "auto" }}>
            We&rsquo;re not the agency choice. We&rsquo;re the small-shop choice &mdash; two founders, fast, focused on doing this one thing well.
          </p>
        </Reveal>
        <Reveal delay={420}>
          <p className="text-body-lg" style={{ marginTop: 18, maxWidth: 600, marginInline: "auto" }}>
            If you&rsquo;ve read this far, you probably want to see what we&rsquo;d build for your practice. Fifteen minutes, one screen share, no pitch deck.
          </p>
        </Reveal>
        <Reveal delay={560}>
          <div style={{ marginTop: 44, display: "flex", justifyContent: "center" }}>
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
        <AgeQuestion />
        <FoundersSection />
        <WhereWeAreFrom />
        <WhatWereBuilding />
      </main>
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Page />);
