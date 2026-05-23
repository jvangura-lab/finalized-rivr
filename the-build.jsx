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

// ─── Hero (placeholder copy — Stream C v2 will refine) ──────────────────────
function BuildHero() {
  return (
    <section className="hero-stage" style={{ minHeight: "auto", paddingBlock: "180px 80px" }}>
      <div className="hero-grid-bg" aria-hidden />
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <p className="text-label-caps" style={{ color: "var(--color-accent-strong)", marginBottom: 22 }}>The build</p>
          </Reveal>
          <RevealLines
            as="h1" className="text-display-1" baseDelay={60}
            lines={[<>Three practices.</>, <>Three different <span className="serif" style={{ color: "var(--color-accent)" }}>builds</span>.</>]}
          />
          <Reveal delay={420}>
            <p className="text-body-lg" style={{ maxWidth: 620, margin: "32px auto 0" }}>
              Each demo below is a real, working booking funnel — Devereaux's editorial-magazine register, Lumera's multi-tier hub, Sela's price-menu retail. Scroll through each section to walk the full page.
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

const DEMOS = [
  {
    eyebrow: "Devereaux",
    subEyebrow: "Surgical · concierge · editorial",
    headline: "A magazine about a person.",
    body: [
      "Devereaux is a single-surgeon concierge practice. The home page leads with the practitioner — portrait, voice, point of view — because the surgeon is the product.",
      "The booking flow is consult-first by design. Patients meet the practice through a long-form editorial register, choose a procedure, and book a conversation before anything else.",
    ],
    ctaLabel: "See Devereaux live",
    ctaHref: "https://devereaux.rivrsystems.com",
    image: "imagery/demos/devereaux-home.jpg",
    alt: "Devereaux Institute home page — editorial-magazine register with Dr. Devereaux portrait, practice statement, and studies gallery.",
  },
  {
    eyebrow: "Lumera",
    subEyebrow: "Multi-tier · clinical-modern · hub",
    headline: "A navigable directory of a place.",
    body: [
      "Lumera is a multi-tier studio — injectables, skin, laser, body, surgery, wellness — under one roof. The home page is a hub: a six-card PathFinder triages patients into the right path before any specific treatment is named.",
      "Below the PathFinder, a bento of the practice's rooms, a clear team strip, and a full price menu give every kind of patient a way in. The booking flow drops them into the lane they chose at the top.",
    ],
    ctaLabel: "See Lumera live",
    ctaHref: "https://lumera.rivrsystems.com",
    image: "imagery/demos/lumera-home.jpg",
    alt: "Lumera Aesthetic Studio home page — photographic hero, PathFinder six-path chooser, rooms bento, team, and price menu.",
  },
  {
    eyebrow: "Sela",
    subEyebrow: "Retail · time-first · price-forward",
    headline: "Skin work, on the menu.",
    body: [
      "Sela is a retail NP-led med spa. The defining move is the price menu — every treatment, every price, on the page, with a Book button on each card. No quotes-on-request, no friction between curiosity and commitment.",
      "The booking flow is time-first: pick the soonest opening, pick a provider, done. A persistent mobile book bar keeps the action one tap away on the phone, where most of these patients are reading.",
    ],
    ctaLabel: "See Sela live",
    ctaHref: "https://sela.rivrsystems.com",
    image: "imagery/demos/sela-home.jpg",
    alt: "Sela Aesthetic Studio home page — \"Skin you live in.\" hero, full price-menu spine, membership, and team.",
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
// Preserved verbatim from the previous /product page. Stream C v2 will sharpen.
const FAQ = [
  { q: "Will I have to switch my current calendar?", a: "No. The booking page connects to whatever you already use. Bookings land in that calendar, not a new one. Your front desk keeps opening the same tab every morning." },
  { q: "What if my calendar is not in your list of supported systems?", a: "If it has a public API or a webhook, we can connect to it. We have built integrations with Google, Acuity, Vagaro, Boulevard, Square Appointments, Calendly, Cal.com, Microsoft 365, Apple Calendar, and a handful of custom in-house systems. Send us the name on the walkthrough call and we will tell you." },
  { q: "How long until it is live?", a: "Most pages go live two to three weeks after the walkthrough call, depending on how many practitioners and services we are mapping. We share a working draft inside the first week so you can see it move." },
  { q: "Who hosts the booking page?", a: "We do. The page lives on a subdomain of your choice (commonly booking.yourpractice.com) or as an embed inside your existing site. No new servers for you to manage, no SSL renewals to track." },
  { q: "What happens if a patient books a time we are not actually available?", a: "Cannot happen. Availability comes from your calendar in real time. The slots a patient sees are the slots your team has open. If you block off Friday afternoon, Friday afternoon disappears from the page within a minute." },
  { q: "Can I see the booking page on my phone the way patients will?", a: "Yes. Every booking page is mobile-first, and we send you a preview link the same day we start building. Walk through your own booking flow on your phone before any patient does." },
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
