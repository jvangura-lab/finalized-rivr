// =============================================================================
// PRODUCT page — Hero, Live prototype iframe, Pipeline (sticky scroll seq),
// Wedge, Calendar, Benefits, FAQ, ClosingCTA
// =============================================================================
const { useState: useStateP, useEffect: useEffectP, useRef: useRefP } = React;
const {
  useReveal, useScrollProgress, useStickyProgress, useMousePos, useCountUp,
  clamp, lerp, mix,
  Reveal, FadeUp, RevealLines, Nav, Button, Footer, BrowserFrame, ClosingCTA, Cursor,
} = window;

const LUMERA_URL_P = "https://lumera-prototype-802456812494.us-central1.run.app/";

// ─── Product hero ────────────────────────────────────────────────────────────
function ProductHero() {
  const [stageRef, p] = useScrollProgress();
  return (
    <section ref={stageRef} className="hero-stage" style={{ minHeight: "auto", paddingBlock: "180px 80px" }}>
      <div className="hero-grid-bg" aria-hidden />
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <p className="text-label-caps" style={{ color: "var(--color-accent)", marginBottom: 22 }}>Product</p>
          </Reveal>
          <RevealLines
            as="h1" className="text-display-1" baseDelay={60}
            lines={[<>The booking page that talks</>, <>to your <span className="serif" style={{ color: "var(--color-accent)" }}>calendar</span>.</>]}
          />
          <Reveal delay={420}>
            <p className="text-body-lg" style={{ maxWidth: 620, margin: "32px auto 40px" }}>
              Patients see a calm, branded booking page. Your team sees the appointments land in the calendar they already use. Built for your practice in two to three weeks.
            </p>
          </Reveal>
          <Reveal delay={540}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button href="book.html" variant="primary">Book a 30-min walkthrough</Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Live prototype embed (image preview since iframe can't actually load remote in this preview) ──
function LiveProto() {
  const [ref, p] = useScrollProgress();
  // image mask reveal as section enters
  const clip = clamp((p - 0.05) / 0.4, 0, 1);
  const insetVal = 12 * (1 - clip);
  return (
    <section ref={ref} className="section" style={{ background: "var(--color-bg-elevated)" }}>
      <div className="container">
        <div className="section-header">
          <FadeUp><p className="text-label-caps">Live prototype</p></FadeUp>
          <RevealLines as="h2" className="text-display-2" baseDelay={120}
            lines={[<>Click around. Book a <span className="serif" style={{ color: "var(--color-accent)" }}>fake appointment</span>.</>]}
          />
          <FadeUp delay={320}>
            <p className="text-body-lg" style={{ marginTop: 24 }}>
              This is the real prototype we built for Lumera Aesthetics, a Jacksonville Beach med spa. The whole flow is live.
            </p>
          </FadeUp>
        </div>

        <FadeUp delay={120}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="browser" style={{
              boxShadow: "0 40px 80px -30px rgba(0, 0, 0, 0.28)",
              clipPath: `inset(${insetVal}px ${insetVal}px ${insetVal}px ${insetVal}px round 14px)`,
              transition: "clip-path 600ms var(--ease-rivr)",
            }}>
              <div className="bar"><i /><i /><i /><span className="u">lumera-prototype.run.app</span></div>
              <div className="body" style={{ aspectRatio: "16 / 10" }}>
                <img src="imagery/lumera-hero.png" alt="Lumera Aesthetics live prototype" />
              </div>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={320}>
          <div style={{ marginTop: 48, textAlign: "center" }}>
            <Button href={LUMERA_URL_P} external variant="primary">Want one for your practice? Open the live prototype</Button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Pipeline — sticky 4-step scroll sequence (CENTERPIECE) ──────────────────
const PIPELINE_STEPS = [
  {
    n: "01",
    title: <>We design your <em>booking page</em>.</>,
    body: "Branded to your practice, structured around how you actually book patients. Consult-first, practitioner-first, or time-first depending on what fits.",
    visual: "design",
  },
  {
    n: "02",
    title: <>We connect it to your <em>calendar</em>.</>,
    body: "Google, Acuity, Boulevard, Vagaro, or whatever your team already opens every morning. Bookings flow into the calendar in real time.",
    visual: "integrate",
  },
  {
    n: "03",
    title: <>We hand it to <em>you</em>.</>,
    body: "Live on your domain (booking.yourpractice.com or yourpractice.com/book). Embedded in your existing site, or standalone, your call.",
    visual: "handoff",
  },
  {
    n: "04",
    title: <>We stay on <em>call</em>.</>,
    body: "Text Thor or Jonas directly when something needs adjusting. No tickets, no chatbots, no level-1 support.",
    visual: "support",
  },
];

function PipelineVisual({ kind, active }) {
  if (kind === "design") {
    return (
      <div className={`pipe-frame pipe-design ${active ? "active" : ""}`}>
        <div className="toolbar">
          <span className="tool on">+</span>
          <span className="tool">T</span>
          <span className="tool">▢</span>
          <span className="tool">○</span>
          <span className="tool">▢</span>
          <span className="tool">―</span>
        </div>
        <div className="artboard">
          <div className="head">Book your visit with Lumera.</div>
          <div className="ph w-1" />
          <div className="ph w-2" />
          <div className="ph h-large" />
          <div className="row">
            <div className="pill on" />
            <div className="pill" />
            <div className="pill" />
          </div>
          <div className="ph w-2" />
          <svg className="cursor-ghost" viewBox="0 0 24 24" fill="currentColor"><path d="M3 2 L21 11 L13 13 L10 22 Z" /></svg>
        </div>
      </div>
    );
  }
  if (kind === "integrate") {
    return (
      <div className={`pipe-frame pipe-integrate ${active ? "active" : ""}`}>
        <div className="col">
          <h5>Booking page</h5>
          <div className="item"><span className="ic">B</span> New booking · Botox</div>
          <div className="item"><span className="ic">B</span> New booking · HydraFacial</div>
          <div className="item"><span className="ic">B</span> Reschedule · Filler</div>
          <div className="item"><span className="ic">B</span> New booking · Consult</div>
        </div>
        <div className="pipes">
          <svg viewBox="0 0 80 200" preserveAspectRatio="none">
            <path d="M0,20 C40,20 40,40 80,40" />
            <path d="M0,70 C40,70 40,80 80,80" />
            <path d="M0,120 C40,120 40,120 80,120" />
            <path d="M0,170 C40,170 40,160 80,160" />
          </svg>
        </div>
        <div className="col">
          <h5>Your calendar</h5>
          <div className="item cal"><span className="ic">G</span> Google Calendar</div>
          <div className="item acuity"><span className="ic">A</span> Acuity</div>
          <div className="item vagaro"><span className="ic">V</span> Vagaro</div>
          <div className="item boulevard"><span className="ic">BL</span> Boulevard</div>
        </div>
      </div>
    );
  }
  if (kind === "handoff") {
    const url = "booking.yourpractice.com";
    return (
      <div className={`pipe-frame pipe-handoff ${active ? "active" : ""}`}>
        <div className="url-pill">
          <span className="lock">🔒</span>
          <span className="swap">{url}</span>
        </div>
        <div className="browser" style={{ width: "100%", maxWidth: 460 }}>
          <div className="bar"><i /><i /><i /><span className="u">{url}</span></div>
          <div className="browser-body" style={{ aspectRatio: "16/10", background: "linear-gradient(180deg, #fff 0%, #FAFAFA 100%)", display: "grid", placeItems: "center", padding: 24 }}>
            <div style={{ textAlign: "center" }}>
              <div className="live-badge"><span className="pulse" /> Now live</div>
              <p className="serif" style={{ fontSize: "1.5rem", marginTop: 18, color: "var(--color-text-primary)" }}>Book your visit</p>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginTop: 6 }}>Real bookings, your domain.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (kind === "support") {
    return (
      <div className={`pipe-frame pipe-support ${active ? "active" : ""}`}>
        <div className="msg you">
          <span className="who">You · 8:42 AM</span>
          Hey — can we add Tuesday evenings to the calendar? Starting next week.
        </div>
        <div className="msg">
          <span className="who">Thor · 8:43 AM</span>
          On it. 5:00pm – 7:30pm slots?
        </div>
        <div className="msg you">
          <span className="who">You · 8:43 AM</span>
          Yes — 30-min increments.
        </div>
        <div className="msg">
          <span className="who">Thor · 8:46 AM</span>
          <span className="typing"><i /><i /><i /></span>
        </div>
        <div className="msg">
          <span className="who">Thor · 8:48 AM</span>
          Live. Tuesday evenings are bookable starting May 28.
        </div>
      </div>
    );
  }
  return null;
}

function Pipeline() {
  const [ref, progress] = useStickyProgress();
  // Map progress 0..1 to step index 0..3 with sticky transitions
  const stepF = clamp(progress * PIPELINE_STEPS.length, 0, PIPELINE_STEPS.length - 0.001);
  const stepIdx = Math.min(PIPELINE_STEPS.length - 1, Math.floor(stepF));

  return (
    <section ref={ref} className="pipeline" style={{ height: `${100 + PIPELINE_STEPS.length * 90}vh` }}>
      <div className="pipeline-pin">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <FadeUp><p className="text-label-caps" style={{ color: "var(--color-accent)" }}>How it works</p></FadeUp>
            <FadeUp delay={120}>
              <p style={{ fontSize: "1.0625rem", color: "var(--color-text-muted)", marginTop: 12, maxWidth: 540, margin: "12px auto 0" }}>
                Four steps from cold email to live booking page. Scroll to walk through it.
              </p>
            </FadeUp>
          </div>

          <div className="pipeline-stage">
            {/* Left: stacked step copy */}
            <div className="pipeline-copy">
              <div className="pipeline-step-stack">
                {PIPELINE_STEPS.map((step, i) => (
                  <div key={i} className={`pipeline-step ${i === stepIdx ? "active" : ""}`}>
                    <div className="num">
                      <span>{step.n}</span>
                      <span style={{ fontWeight: 500, letterSpacing: "0.08em" }}>
                        Step {i + 1} of {PIPELINE_STEPS.length}
                      </span>
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                ))}
              </div>

              {/* Progress ticks below the stack */}
              <div style={{ marginTop: 32, display: "flex", gap: 14, alignItems: "center" }}>
                {PIPELINE_STEPS.map((s, i) => (
                  <div
                    key={i}
                    className={`pipeline-tick ${i < stepIdx ? "done" : i === stepIdx ? "active" : ""}`}
                  >
                    <span className="bar" />
                    <span>{s.n}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: stacked visuals */}
            <div className="pipeline-vis">
              {PIPELINE_STEPS.map((step, i) => (
                <PipelineVisual key={i} kind={step.visual} active={i === stepIdx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Wedge ───────────────────────────────────────────────────────────────────
const WEDGE_COLS = [
  { label: "You already have", title: "A calendar.", body: "Google Calendar, Acuity, Boulevard, Vagaro, whatever your front desk already opens every morning. We send bookings into it." },
  { label: "You already have", title: "An EMR and a phone.", body: "The system that holds patient notes, the line your patients call. The booking page lives in front of them, not in place of them." },
  { label: "You already have", title: "A way you do this.", body: "Front desk flows, intake forms, deposit policies, cancellation windows. We follow your rules, we don't ask you to follow ours." },
];

function Wedge() {
  return (
    <section className="section" style={{ background: "var(--color-bg-elevated)" }}>
      <div className="container">
        <RevealLines as="h2" className="text-display-2" baseDelay={60}
          lines={[<>We slot in around what you</>, <><span className="serif" style={{ color: "var(--color-accent)" }}>already run</span>.</>]}
          style={{ textAlign: "center", maxWidth: 880, margin: "0 auto 64px" }}
        />
        <FadeUp>
          <div className="wedge-grid">
            {WEDGE_COLS.map((c, i) => (
              <article className="wedge-card" key={i}>
                <p className="label">{c.label}</p>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </article>
            ))}
          </div>
        </FadeUp>
        <FadeUp delay={240}>
          <p className="text-body-lg" style={{ textAlign: "center", marginTop: 56, maxWidth: 600, marginInline: "auto" }}>
            One more page on the internet, pointing patients into the systems you already trust.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── CalendarShowcase ────────────────────────────────────────────────────────
const DAYS = ["Mon 18", "Tue 19", "Wed 20", "Thu 21", "Fri 22"];
const HOURS = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"];

const APPOINTMENTS = [
  { day: 0, start: 0, span: 1, title: "Botox", who: "Maria Chen", color: "blue", viaRivr: true },
  { day: 0, start: 3, span: 2, title: "Consultation", who: "James W.", color: "violet" },
  { day: 1, start: 1, span: 1, title: "HydraFacial", who: "Priya S.", color: "rose", viaRivr: true },
  { day: 2, start: 2, span: 2, title: "Filler", who: "Olivia M.", color: "amber" },
  { day: 3, start: 0, span: 1, title: "Lip filler", who: "Talia P.", color: "blue" },
  { day: 3, start: 5, span: 1, title: "Microneedling", who: "Sam D.", color: "green", viaRivr: true },
  { day: 4, start: 2, span: 1, title: "Botox", who: "Nora H.", color: "blue" },
];

const COLOR_STYLES = {
  blue: { background: "#DBEAFE", color: "#1E3A8A", borderLeftColor: "#3B82F6" },
  violet: { background: "#EDE9FE", color: "#4C1D95", borderLeftColor: "#8B5CF6" },
  green: { background: "#D1FAE5", color: "#065F46", borderLeftColor: "#10B981" },
  amber: { background: "#FEF3C7", color: "#92400E", borderLeftColor: "#F59E0B" },
  rose: { background: "#FCE7F3", color: "#9D174D", borderLeftColor: "#EC4899" },
};

const CHIPS = ["Google Calendar", "Acuity", "Vagaro", "Mindbody", "Boulevard", "Square", "Calendly", "Cal.com", "Microsoft 365", "Apple Calendar"];

function CalendarShowcase() {
  const [secRef, p] = useScrollProgress();
  // Parallax: calendar drifts up as you scroll the section
  const calY = (p - 0.5) * -40;

  return (
    <section ref={secRef} className="section" style={{ background: "var(--color-bg-elevated)" }}>
      <div className="container">
        <div className="calendar-wrap">
          <FadeUp>
            <div style={{ transform: `translateY(${calY}px)`, willChange: "transform" }}>
              <div className="calendar">
                <div className="hd">
                  <div className="name"><span className="ic" /> Calendar</div>
                  <span className="week">Week of May 18</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <div className="grid">
                    <div />
                    {DAYS.map((d) => <div key={d} className="day">{d}</div>)}
                    {HOURS.map((hour, hi) => (
                      <React.Fragment key={hour}>
                        <div className="hour">{hour}</div>
                        {[0, 1, 2, 3, 4].map((di) => {
                          const appt = APPOINTMENTS.find((a) => a.day === di && a.start === hi);
                          return (
                            <div key={di} className="cell">
                              {appt && (
                                <div
                                  className="appt"
                                  style={{
                                    ...COLOR_STYLES[appt.color],
                                    borderLeftWidth: 3, borderLeftStyle: "solid",
                                    height: appt.span * 48 - 8,
                                  }}
                                >
                                  <p className="t">
                                    {appt.title}
                                    {appt.viaRivr && <span className="via">via RIVR</span>}
                                  </p>
                                  <p className="w">{appt.who}</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>

          <div>
            <Reveal>
              <p className="text-label-caps" style={{ color: "var(--color-accent)", marginBottom: 18 }}>Where bookings land</p>
            </Reveal>
            <RevealLines as="h2" className="text-display-2" baseDelay={120}
              lines={[<>Every booking flows into the</>, <>calendar you <span className="serif" style={{ color: "var(--color-accent)" }}>already use</span>.</>]}
            />
            <Reveal delay={320}>
              <p className="text-body-lg" style={{ marginTop: 24 }}>
                Google Calendar, Acuity, Vagaro, Mindbody, Boulevard, Square Appointments, Calendly, Cal.com, Microsoft 365, Apple Calendar, or whatever you have custom-built. If it has an API or webhook, we connect to it.
              </p>
            </Reveal>
            <Reveal delay={420}>
              <ul className="chips">
                {CHIPS.map((c) => <li key={c} className="chip">{c}</li>)}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Benefits (dark) — reused from home but slightly different framing ───────
const BENEFITS_P = [
  { ico: "chart", title: "Drive online bookings", body: "Your patients book themselves on their phone at 11pm. The appointment lands in your calendar before your front desk gets in tomorrow. No phone tag, no manual entry." },
  { ico: "stack", title: "No new system to adopt", body: "We integrate with the calendar, EMR, and tools you already use. Nothing to install, nothing for your staff to learn, nothing to migrate. Your current system keeps running exactly the same." },
  { ico: "support", title: "Real humans, immediate support", body: "Questions go to Thor and Jonas directly. Not a ticket system, not a chatbot, not a level-1 support rep. Text the same number you'd text a friend." },
];

function BenefitIcon({ kind }) {
  if (kind === "chart") return (
    <svg className="ico" viewBox="0 0 80 80" fill="none" aria-hidden>
      <path d="M12 60 L12 12 M12 60 L68 60" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 50 L32 38 L42 46 L56 24" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 24 L56 24 L56 30" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="38" r="2" fill="var(--color-accent)" />
      <circle cx="42" cy="46" r="2" fill="var(--color-accent)" />
    </svg>
  );
  if (kind === "stack") return (
    <svg className="ico" viewBox="0 0 80 80" fill="none" aria-hidden>
      <rect x="14" y="18" width="52" height="14" rx="2" stroke="var(--color-accent)" strokeWidth="1.5" />
      <rect x="14" y="36" width="52" height="14" rx="2" stroke="var(--color-accent)" strokeWidth="1.5" />
      <rect x="14" y="54" width="52" height="10" rx="2" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.45" />
      <path d="M48 25 L52 28 L60 22" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M48 43 L52 46 L60 40" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return (
    <svg className="ico" viewBox="0 0 80 80" fill="none" aria-hidden>
      <path d="M18 26 C18 21 22 18 26 18 L54 18 C58 18 62 21 62 26 L62 46 C62 51 58 54 54 54 L36 54 L26 62 L26 54 C22 54 18 51 18 46 Z" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="30" cy="36" r="2" fill="var(--color-accent)" />
      <circle cx="40" cy="36" r="2" fill="var(--color-accent)" />
      <circle cx="50" cy="36" r="2" fill="var(--color-accent)" />
    </svg>
  );
}

function Benefits() {
  return (
    <section className="section section-dark" style={{ paddingBlock: "160px" }}>
      <div className="container">
        <RevealLines as="h2" className="text-display-2" baseDelay={60}
          lines={[<>Built to grow your practice,</>, <><span className="serif" style={{ color: "var(--color-accent)" }}>not your tooling stack</span>.</>]}
          style={{ textAlign: "center", maxWidth: 880, margin: "0 auto 80px" }}
        />
        <FadeUp>
          <div className="benefits-grid">
            {BENEFITS_P.map((b, i) => (
              <div className="benefit" key={i}>
                <BenefitIcon kind={b.ico} />
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQ = [
  { q: "Will I have to switch my current calendar?", a: "No. The booking page connects to whatever you already use. Bookings land in that calendar, not a new one. Your front desk keeps opening the same tab every morning." },
  { q: "What if my calendar is not in your list of supported systems?", a: "If it has a public API or a webhook, we can connect to it. We have built integrations with Google, Acuity, Vagaro, Boulevard, Square Appointments, Calendly, Cal.com, Microsoft 365, Apple Calendar, and a handful of custom in-house systems. Send us the name on the walkthrough call and we will tell you." },
  { q: "How long until it is live?", a: "Most pages go live two to three weeks after the walkthrough call, depending on how many practitioners and services we are mapping. We share a working draft inside the first week so you can see it move." },
  { q: "Who hosts the booking page?", a: "We do. The page lives on a subdomain of your choice (commonly booking.yourpractice.com) or as an embed inside your existing site. No new servers for you to manage, no SSL renewals to track." },
  { q: "What happens if a patient books a time we are not actually available?", a: "Cannot happen. Availability comes from your calendar in real time. The slots a patient sees are the slots your team has open. If you block off Friday afternoon, Friday afternoon disappears from the page within a minute." },
  { q: "Can I see the booking page on my phone the way patients will?", a: "Yes. Every booking page is mobile-first, and we send you a preview link the same day we start building. Walk through your own booking flow on your phone before any patient does." },
  { q: "What if I need changes after launch?", a: "Text us. Most changes (new service, new practitioner, new pricing, new hours, copy tweak) go live within a day. Bigger redesigns we scope on a follow-up call." },
];

function FAQSection() {
  const [open, setOpen] = useStateP(0);
  return (
    <section className="section">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <FadeUp><p className="text-label-caps" style={{ color: "var(--color-accent)" }}>Frequently asked</p></FadeUp>
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
      <Nav current="product" />
      <main>
        <ProductHero />
        <LiveProto />
        <Pipeline />
        <Wedge />
        <CalendarShowcase />
        <Benefits />
        <FAQSection />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Page />);
