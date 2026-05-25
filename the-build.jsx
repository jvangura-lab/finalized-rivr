// =============================================================================
// THE BUILD page (formerly /product) — Stream C v1 rewrite.
//
// New page architecture: a short hero intro, then three stacked demo sections
// (Devereaux / Lumera / Sela), each ~250vh tall. Inside each section a sticky
// tile pins to viewport center for the duration of the section's scroll range;
// inside the tile the full home screenshot translates vertically, bound to
// scroll progress, so the user pans the full demo without leaving the page.
// Mobile (<= lg) falls back to a static screenshot (CSS overrides the transform
// — see .build-tile img in styles.css), no scroll-driven motion.
//
// The FAQ section is preserved verbatim from the previous /product page; it
// answers practical prospect questions (calendar swap, time-to-live, hosting,
// post-launch changes). Stream C v2 will sharpen the FAQ; Stream C v1 leaves
// it as-is per scope.
// =============================================================================
const { useState: useStateP, useEffect: useEffectP, useRef: useRefP } = React;
const {
  useStickyProgress,
  clamp,
  Reveal, FadeUp, RevealLines, Nav, Button, Footer, ClosingCTA,
} = window;

// ─── Hero (Stream C v2 final: lead with the funnel, not the demos) ──────────
function BuildHero() {
  // Polish 4 / Task 5: padding tightened 180/80 → 120/80 to match home + about + book heroes.
  return (
    <section className="hero-stage" style={{ minHeight: "auto", paddingBlock: "120px 80px" }}>
      <div className="hero-grid-bg" aria-hidden />
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <p className="text-label-caps" style={{ color: "var(--color-accent-strong)", marginBottom: 22 }}>The build</p>
          </Reveal>
          <RevealLines
            as="h1" className="text-display-1" baseDelay={60}
            lines={[<>One booking funnel.</>, <>Three different <span className="serif" style={{ color: "var(--color-accent)" }}>practices</span>.</>]}
          />
          <Reveal delay={420}>
            <p className="text-body-lg" style={{ maxWidth: 640, margin: "32px auto 0" }}>
              The booking funnel is the work. Below, three reference builds show how it handles a retail med spa, a concierge surgical practice, and a multi-tier studio. Scroll any section to walk the full demo.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── BuildDemoSection — one demo, with sticky tile + scroll-bound screenshot ─
// Built on the existing useStickyProgress hook (no new dependencies). The hook
// returns 0..1 as the outer ~250vh section scrolls through the viewport; we
// translateY the image inside the pinned tile from 0 to -(imgHeight - tileHeight).
// On mobile, .build-stage / .build-pin / .build-tile img CSS overrides flatten
// the layout to a static grid and `transform: none !important` on the image
// disables the scroll-driven motion — see styles.css.
function BuildDemoSection({ eyebrow, subEyebrow, headline, body, ctaLabel, ctaHref, image, alt }) {
  const [sectionRef, progress] = useStickyProgress();
  const imgRef = useRefP(null);
  const tileRef = useRefP(null);
  const [imgLoaded, setImgLoaded] = useStateP(false);
  const [translate, setTranslate] = useStateP(0);

  useEffectP(() => {
    const calc = () => {
      const img = imgRef.current;
      const tile = tileRef.current;
      if (!img || !tile) return;
      const tileH = tile.clientHeight;
      const imgH = img.clientHeight;
      const maxTravel = Math.max(0, imgH - tileH);
      setTranslate(-maxTravel * clamp(progress, 0, 1));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [progress, imgLoaded]);

  return (
    <section ref={sectionRef} className="section build-section">
      <div className="build-stage">
        <div className="container build-pin">
          <div className="build-copy">
            <FadeUp><p className="eyebrow">{eyebrow}</p></FadeUp>
            <FadeUp delay={60}><p className="sub-eyebrow">{subEyebrow}</p></FadeUp>
            <FadeUp delay={120}><h2>{headline}</h2></FadeUp>
            <FadeUp delay={200}>
              <div>
                {body.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </FadeUp>
            <FadeUp delay={280}>
              <a className="cta" href={ctaHref} target="_blank" rel="noopener noreferrer">
                {ctaLabel} <span aria-hidden>→</span>
              </a>
            </FadeUp>
          </div>
          <div className="build-tile" ref={tileRef}>
            <img
              ref={imgRef}
              src={image}
              alt={alt}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              style={{ transform: `translateY(${translate}px)` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── BuildProcess (Polish 4 / Task 5) ────────────────────────────────────────
// /the-build now needs to communicate methodology, not just demo screenshots —
// the home page's ReferenceBuilds already does the demos showcase work. This
// section walks the actual engagement steps so a prospect can see what
// "two to three weeks from kickoff to live" actually looks like.
const PROCESS_STEPS = [
  {
    n: "01",
    title: "Discovery call",
    body: "Fifteen minutes. We look at your current setup — where bookings come in now, which calendar runs the practice, how your team triages new patients. No deck, no pitch.",
  },
  {
    n: "02",
    title: "Audit and scope",
    body: "We map your current booking page against the funnel patterns that fit aesthetic medicine — time-first, practitioner-first, consult-first. You see which one fits and which services route through which lane.",
  },
  {
    n: "03",
    title: "Funnel build",
    body: "Two weeks. We build your booking page from scratch — matched to your services, your providers, your pricing, your voice. We share a working draft inside the first week so you can see it move before it's done.",
  },
  {
    n: "04",
    title: "Integration",
    body: "Wired to the calendar you already run — Google, Acuity, Vagaro, Boulevard, Square, Calendly, Cal.com, Microsoft 365, Apple Calendar, or a custom API. Bookings land in the same tab your front desk opens every morning. No new platform, no staff retraining.",
  },
  {
    n: "05",
    title: "Handoff and maintenance",
    body: "We ship to your domain. Maintenance is opt-in — two to three changes per quarter (copy edits, image swaps, service menu updates, hours), with a 48-hour response window Monday through Friday. Bigger redesigns we scope on a follow-up call.",
  },
];

function BuildProcess() {
  return (
    <section className="section build-process">
      <div className="container">
        <div className="section-header">
          <FadeUp><p className="text-label-caps">How a build works</p></FadeUp>
          <RevealLines
            as="h2"
            className="text-display-2"
            baseDelay={120}
            lines={[
              <>Two to three weeks.</>,
              <>One funnel, live on <span className="serif" style={{ color: "var(--color-accent)" }}>your domain</span>.</>,
            ]} />
        </div>
        <ol className="process-list">
          {PROCESS_STEPS.map((s, i) => (
            <FadeUp as="li" key={s.n} delay={i * 80} className="process-step">
              <span className="process-num">{s.n}</span>
              <div className="process-body">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </FadeUp>
          ))}
        </ol>
      </div>
    </section>
  );
}

// Stream C v2 final: lead each section with the practice type. The funnel is
// the work; the demo is the example. Order matches the home hero
// (Sela → Devereaux → Lumera). Demo name moves to the small reference caption.
const DEMOS = [
  {
    eyebrow: "01 · Retail med spa",
    subEyebrow: "demo: sela.rivrsystems.com",
    headline: <>Retail med spa, <span className="serif" style={{ color: "var(--color-accent)" }}>time-first</span>.</>,
    body: [
      "For a high-volume retail med spa selling injectables, skin, and laser, the booking funnel handles time-first scheduling, a fully-priced service menu surfaced on the page, and a persistent mobile book bar. Patients pick the soonest opening, pick a provider, done.",
      "The funnel is the work; the demo is the example. Sela's price-menu spine and NP-led roster are one expression of the pattern — your version uses your services, your providers, your pricing.",
    ],
    ctaLabel: "See Sela live",
    ctaHref: "https://sela.rivrsystems.com",
    image: "imagery/demos/sela-home.jpg",
    alt: "Sela Aesthetic Studio home page — \"Skin you live in.\" hero, full price-menu spine, membership, and team.",
  },
  {
    eyebrow: "02 · Concierge surgical practice",
    subEyebrow: "demo: devereaux.rivrsystems.com",
    headline: <>Concierge surgical, <span className="serif" style={{ color: "var(--color-accent)" }}>practitioner-first</span>.</>,
    body: [
      "For a single-surgeon concierge practice, the booking funnel handles practitioner-first triage, long-form consult routing, and a register that matches the surgeon's voice. New patients meet the practice through the surgeon's point of view, then book a consult before any procedure is named.",
      "The funnel is the work; the demo is the example. Devereaux's editorial-magazine register is one expression of the pattern — your version uses your surgeon, your voice, your consult workflow.",
    ],
    ctaLabel: "See Devereaux live",
    ctaHref: "https://devereaux.rivrsystems.com",
    image: "imagery/demos/devereaux-home.jpg",
    alt: "Devereaux Institute home page — editorial-magazine register with Dr. Devereaux portrait, practice statement, and studies gallery.",
  },
  {
    eyebrow: "03 · Multi-tier practice",
    subEyebrow: "demo: lumera.rivrsystems.com",
    headline: <>Multi-tier practice, <span className="serif" style={{ color: "var(--color-accent)" }}>consult-first</span>.</>,
    body: [
      "For a multi-tier studio running injectables, skin, laser, body, surgery, and wellness under one roof, the booking funnel handles patient triage into the right lane, six-path navigation, and consult routing before any specific treatment is named. Every kind of patient gets a way in.",
      "The funnel is the work; the demo is the example. Lumera's PathFinder hub and rooms-bento are one expression of the pattern — your version uses your lanes, your specialties, your triage rules.",
    ],
    ctaLabel: "See Lumera live",
    ctaHref: "https://lumera.rivrsystems.com",
    image: "imagery/demos/lumera-home.jpg",
    alt: "Lumera Aesthetic Studio home page — photographic hero, PathFinder six-path chooser, rooms bento, team, and price menu.",
  },
];

// ─── FAQ — Stream C v2 sharpened ─────────────────────────────────────────────
// Sharpened for aesthetic-medicine prospect concerns. Removed the standalone
// "Who hosts the booking page?" Q (folded into "how long & where does it live"
// below) and the mobile-preview Q (general, not practice-specific). Added two
// aesthetic-medicine-specific Qs: Good Faith Exam routing and intake-form /
// patient-portal handoff. Maintenance-posture answer verified consistent with
// Stream A's 48h M-F · 2–3 changes/quarter line.
const FAQ = [
  { q: "Will I have to switch my current calendar?", a: "No. The booking page connects to whatever you already use. Bookings land in that calendar, not a new one. Your front desk keeps opening the same tab every morning." },
  { q: "What if my calendar isn't in your list of supported systems?", a: "If it has a public API or a webhook, we can connect to it. We have built integrations with Google, Acuity, Vagaro, Boulevard, Square Appointments, Calendly, Cal.com, Microsoft 365, Apple Calendar, and a handful of custom in-house systems. Send us the name on the walkthrough call and we'll tell you." },
  { q: "How long until it's live, and where does it live?", a: "Most pages go live two to three weeks after the walkthrough call, depending on how many practitioners and services we're mapping. They live on a subdomain of your choice (commonly booking.yourpractice.com) or as an embed inside your existing site — your hosting, your DNS, no new servers for you to manage. We share a working draft inside the first week so you can see it move." },
  { q: "What happens if a patient books a time we are not actually available?", a: "Cannot happen. Availability comes from your calendar in real time. The slots a patient sees are the slots your team has open. If you block off Friday afternoon, Friday afternoon disappears from the page within a minute." },
  { q: "What if we don't have a Good Faith Exam workflow in place?", a: "That's normal — a lot of practices we talk to are still working out their GFE flow. We can route new-patient bookings through a \"requires consult\" lane before any treatment is actually scheduled, so the GFE happens before the syringe does. We've shipped that pattern for practices using Boulevard, Calendly, and a couple of custom intake systems." },
  { q: "Will this work with our existing intake forms or patient portal?", a: "Yes. We can either embed your existing intake form mid-flow (after the patient picks a service, before they confirm) or hand off to your portal for the intake step. We don't replace intake — we route patients into the form you already have." },
  { q: "What if I need changes after launch?", a: "Text us. Maintenance covers two to three changes per quarter — copy edits, image swaps, service catalog updates, new hours. We respond within 48 hours, Monday through Friday. Bigger redesigns we scope on a follow-up call." },
];

function FAQSection() {
  const [open, setOpen] = useStateP(0);
  return (
    <section className="section">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <FadeUp><p className="text-label-caps" style={{ color: "var(--color-accent-strong)" }}>Frequently asked</p></FadeUp>
          <FadeUp delay={120}>
            <h2 className="text-display-2" style={{ marginTop: 16 }}>Questions before you book the call.</h2>
          </FadeUp>
        </div>
        <ul className="faq-list">
          {FAQ.map((item, i) => (
            <FadeUp as="li" delay={i * 60} key={i} className="faq-item">
              <button
                type="button"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
                aria-controls={`build-faq-${i}`}
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
                id={`build-faq-${i}`}
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
      <Nav current="the-build" />
      <main id="main">
        <BuildHero />
        {/* Polish 4 / Task 5: methodology section added before demos so the
            page leads with HOW a build works, not just three demo deep-dives.
            Home page's ReferenceBuilds now does the demos summary work; the
            demos here are the deeper scroll-pan deep-dives, kept for depth. */}
        <BuildProcess />
        {DEMOS.map((d) => <BuildDemoSection key={d.eyebrow} {...d} />)}
        <FAQSection />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Page />);
