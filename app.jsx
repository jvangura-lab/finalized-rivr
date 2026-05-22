// =============================================================================
// RIVR — shared hooks + components
// Globals exposed at the bottom for cross-script access.
// =============================================================================
const { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo, createContext, useContext } = React;

// ── Easing matching framer-motion's expressive curve ─────────────────────────
const EASE_RIVR = [0.22, 1, 0.36, 1];
const cubicBezier = (t, p1, p2, p3, p4) => {
  // Approximation: cubic-bezier on parameter t (0..1). Returns y for given x=t.
  // Use Newton's method for x→t mapping, then evaluate y(t).
  const cx = 3 * p1;
  const bx = 3 * (p3 - p1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p2;
  const by = 3 * (p4 - p2) - cy;
  const ay = 1 - cy - by;
  let x = t;
  for (let i = 0; i < 6; i++) {
    const xv = ((ax * x + bx) * x + cx) * x;
    const dx = (3 * ax * x + 2 * bx) * x + cx;
    if (Math.abs(dx) < 1e-6) break;
    x -= (xv - t) / dx;
  }
  return ((ay * x + by) * x + cy) * x;
};
const easeRivr = (t) => cubicBezier(t, EASE_RIVR[0], EASE_RIVR[1], EASE_RIVR[2], EASE_RIVR[3]);

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const mix = (range, t) => lerp(range[0], range[1], t);

// ── Hook: useReveal — adds .in class when element enters viewport
// Uses scroll-position polling (more reliable than IntersectionObserver in
// some iframe sandboxes) with a small offset.
function useReveal({ once = true, offset = 0.12 } = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let rafId = 0;
    let scheduled = false;
    let done = false;
    const check = () => {
      scheduled = false;
      if (done) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // trigger when ~12% past top of viewport, OR when within view
      const trigger = vh - vh * offset;
      const isIn = rect.top < trigger && rect.bottom > 0;
      if (isIn) {
        el.classList.add("in");
        if (once) { done = true; cleanup(); }
      } else if (!once) {
        el.classList.remove("in");
      }
    };
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      rafId = requestAnimationFrame(check);
    };
    const cleanup = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", check);
      if (rafId) cancelAnimationFrame(rafId);
    };
    // Initial check (slight delay to let layout settle)
    setTimeout(check, 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", check);
    return cleanup;
  }, [once, offset]);
  return ref;
}

// ── Hook: useScrollProgress — returns rAF-driven 0..1 for element through viewport
// progress=0 when top of element hits bottom of viewport, =1 when bottom of element hits top
function useScrollProgress(opts = {}) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // total distance: when bottom enters (rect.top = vh) → progress=0
      // until top exits (rect.bottom = 0) → progress=1
      const total = rect.height + vh;
      const traveled = vh - rect.top;
      const p = clamp(traveled / total, 0, 1);
      setProgress(p);
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        compute();
      });
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return [ref, progress];
}

// ── Hook: useStickyProgress — progress through a sticky pin section ──────────
// progress=0 when pin starts pinning, =1 when it un-pins.
function useStickyProgress() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // section taller than vh; progress = (-rect.top) / (rect.height - vh)
      const total = rect.height - vh;
      if (total <= 0) { setProgress(rect.top < 0 ? 1 : 0); return; }
      const p = clamp(-rect.top / total, 0, 1);
      setProgress(p);
    };
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => { rafRef.current = 0; compute(); });
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return [ref, progress];
}

// ── Hook: useMousePos — normalized -1..1 x/y, smoothed ───────────────────────
function useMousePos({ smooth = 0.12 } = {}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);

  useEffect(() => {
    const onMove = (e) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (!rafRef.current) tick();
    };
    const tick = () => {
      current.current.x = lerp(current.current.x, target.current.x, smooth);
      current.current.y = lerp(current.current.y, target.current.y, smooth);
      setPos({ x: current.current.x, y: current.current.y });
      const dx = Math.abs(current.current.x - target.current.x);
      const dy = Math.abs(current.current.y - target.current.y);
      if (dx > 0.001 || dy > 0.001) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = 0;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [smooth]);

  return pos;
}

// ── Hook: useCountUp ─────────────────────────────────────────────────────────
function useCountUp(target, { duration = 1600, decimals = 0, prefix = "", suffix = "" } = {}) {
  const ref = useRef(null);
  const [text, setText] = useState(`${prefix}${(0).toFixed(decimals)}${suffix}`);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    let raf = 0;
    let scheduled = false;
    const start = () => {
      if (started) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh * 0.85 && rect.bottom > 0) {
        started = true;
        const startTime = performance.now();
        const tick = (now) => {
          const t = clamp((now - startTime) / duration, 0, 1);
          const eased = easeRivr(t);
          const v = target * eased;
          setText(`${prefix}${v.toFixed(decimals)}${suffix}`);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        cleanup();
      }
    };
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; start(); });
    };
    const cleanup = () => {
      window.removeEventListener("scroll", onScroll);
    };
    setTimeout(start, 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cleanup(); if (raf) cancelAnimationFrame(raf); };
  }, [target, duration, decimals, prefix, suffix]);
  return [ref, text];
}

// =============================================================================
// COMPONENTS
// =============================================================================

// ── Reveal wrapper — adds .reveal then .in when in view ──────────────────────
function Reveal({ as: As = "div", delay = 0, children, className = "", style = {}, ...rest }) {
  const ref = useReveal();
  return (
    <As
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </As>
  );
}

// ── RevealLines — splits text into mask-revealed lines with stagger ──────────
function RevealLines({ lines, as: As = "h1", className = "", lineClassName = "", baseDelay = 0, gap = 90 }) {
  const ref = useReveal();
  return (
    <As ref={ref} className={`${className}`.trim()} style={{ display: "block" }}>
      {lines.map((line, i) => (
        <span
          key={i}
          className={`reveal-mask intro-line ${lineClassName}`.trim()}
          style={{ display: "block" }}
        >
          <span style={{ transitionDelay: `${baseDelay + i * gap}ms` }}>
            {line}
          </span>
        </span>
      ))}
    </As>
  );
}

// Helper: animate-on-view (uses our useReveal ref + classes already in CSS)
function FadeUp({ delay = 0, children, className = "", as: As = "div", style = {}, ...rest }) {
  const ref = useReveal();
  return (
    <As ref={ref} className={`reveal ${className}`.trim()} style={{ transitionDelay: `${delay}ms`, ...style }} {...rest}>
      {children}
    </As>
  );
}

// ── Nav (sticky pill, hash-link active state) ────────────────────────────────
function Nav({ current = "home" }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Drawer: lock scroll + close on ESC while open.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [menuOpen]);

  const links = [
    { label: "Home", href: "index.html", id: "home" },
    { label: "Product", href: "product.html", id: "product" },
    { label: "About", href: "about.html", id: "about" },
  ];

  return (
    <header className={`nav ${scrolled ? "scrolled" : ""}`}>
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="nav-inner">
        <a href="index.html" className="nav-brand">
          <span className="mk">R</span>
          <span>RIVR</span>
        </a>
        <nav style={{ display: "flex", alignItems: "center" }}>
          {links.map((l) => (
            <a
              key={l.id}
              href={l.href}
              className={`nav-link ${current === l.id ? "active" : ""}`}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a href="book.html" className="nav-cta">
          <span>Book a walkthrough</span>
          <span className="arr">→</span>
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="nav-drawer"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
      </div>

      <div id="nav-drawer" className={`nav-drawer ${menuOpen ? "is-open" : ""}`}>
        <div className="nav-drawer-backdrop" onClick={() => setMenuOpen(false)} />
        <nav className="nav-drawer-panel" aria-label="Mobile">
          {links.map((l) => (
            <a
              key={l.id}
              href={l.href}
              className={`nav-link ${current === l.id ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a href="book.html" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
            <span>Book a walkthrough</span><span className="arr" aria-hidden>→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

// ── Button (pressable) ───────────────────────────────────────────────────────
function Button({ href, onClick, variant = "primary", arrow = "right", children, external, className = "", ...rest }) {
  const arr = arrow === "external"
    ? <span className="arr" aria-hidden>↗</span>
    : arrow === "none" ? null
    : <span className="arr" aria-hidden>→</span>;

  const cls = `btn btn-${variant} ${className}`.trim();
  if (onClick) {
    return <button type="button" onClick={onClick} className={cls} {...rest}><span>{children}</span>{arr}</button>;
  }
  if (external || (href && /^https?:\/\//.test(href))) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}><span>{children}</span>{arr}</a>;
  }
  return <a href={href} className={cls} {...rest}><span>{children}</span>{arr}</a>;
}

// ── CtaReassure — trust lines that sit beside a primary CTA. Surfaces the
// risk-reversal (buried in ClosingCTA copy) and, optionally, the HIPAA/BAA line
// (otherwise only on the book FAQ). ──────────────────────────────────────────
function CtaReassure({ hipaa = false, center = false, style = {} }) {
  // Stream A (Category 3): the "You keep the mockup" check read as hook-bait and
  // was removed. Only the HIPAA/BAA reassurance remains; renders nothing when
  // not requested (so callers without `hipaa` produce no empty markup).
  if (!hipaa) return null;
  return (
    <ul className={`cta-reassure ${center ? "is-center" : ""}`.trim()} style={style}>
      <li><span className="ck" aria-hidden>✓</span> HIPAA-ready — we sign a BAA before any patient data flows.</li>
    </ul>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <p className="footer-brand-name"><span className="mk">R</span> RIVR</p>
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:hello@rivrsystems.com">hello@rivrsystems.com</a></li>
              {/* TODO(thor): replace (phone TBD) with the real Google Voice number. See BLOCKED_ON_THOR.md. */}
              <li><a href="sms:">Text us · (phone TBD)</a></li>
            </ul>
            <address>
              RIVR Systems<br />
              4016 South Third Street #1016<br />
              Jacksonville Beach, FL 32250
            </address>
          </div>

          <div>
            <h4>Site</h4>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="product.html">Product</a></li>
              <li><a href="about.html">About</a></li>
              <li><a href="book.html">Book a call</a></li>
            </ul>
          </div>

          <div>
            <h4>Legal</h4>
            {/* TODO(thor): confirm these match the real Termly URLs. See BLOCKED_ON_THOR.md. */}
            <ul>
              <li><a href="https://rivrsystems.com/privacy">Privacy</a></li>
              <li><a href="https://rivrsystems.com/terms">Terms</a></li>
              <li><a href="https://rivrsystems.com/cookies">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 RIVR Systems</p>
          {/* TODO(thor): add Instagram/LinkedIn links once handles exist. Removed dead href="#" links for now. See BLOCKED_ON_THOR.md. */}
        </div>
      </div>
      <span className="footer-watermark">RIVR</span>
    </footer>
  );
}

// ── BrowserFrame: chrome around an image or arbitrary children ───────────────
function BrowserFrame({ src, alt, url, style = {}, className = "", children }) {
  return (
    <div className={`browser ${className}`.trim()} style={style}>
      <div className="bar">
        <i /><i /><i />
        {url && <span className="u">{url}</span>}
      </div>
      <div className="body">
        {children || <img src={src} alt={alt} loading="lazy" />}
      </div>
    </div>
  );
}

// ── PrototypeModal — full-screen iframe modal for the Lumera prototype ───────
const PROTOTYPE_URL = "https://lumera.rivrsystems.com";

function usePrototypeModal() {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);
  return { open, openModal, closeModal };
}

function PrototypeModal({ open, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [isOpenClass, setIsOpenClass] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const closeBtnRef = useRef(null);
  const prevFocusRef = useRef(null);

  // Mount on open. Delay unmount to let exit animation play.
  useEffect(() => {
    if (open) { setMounted(true); return; }
    if (!mounted) return;
    const t = setTimeout(() => { setMounted(false); setIframeLoaded(false); }, 600);
    return () => clearTimeout(t);
  }, [open, mounted]);

  // Toggle .is-open after mount so transitions trigger (instead of starting at final state).
  useLayoutEffect(() => {
    if (!mounted) { setIsOpenClass(false); return; }
    if (open) {
      const id = requestAnimationFrame(() => setIsOpenClass(true));
      return () => cancelAnimationFrame(id);
    }
    setIsOpenClass(false);
  }, [mounted, open]);

  // Scroll lock, ESC, focus restore — while mounted.
  useEffect(() => {
    if (!mounted) return;
    prevFocusRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    const focusId = requestAnimationFrame(() => {
      if (closeBtnRef.current) closeBtnRef.current.focus();
    });
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(focusId);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      const prev = prevFocusRef.current;
      if (prev && typeof prev.focus === "function") {
        try { prev.focus(); } catch (_) { /* no-op */ }
      }
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div className={`proto-modal ${isOpenClass ? "is-open" : ""}`} aria-hidden={!open}>
      <div className="proto-modal-backdrop" onClick={onClose} />
      <div className="proto-modal-panel" role="dialog" aria-modal="true" aria-label="Lumera Aesthetics live prototype">
        {!iframeLoaded && (
          <div className="proto-modal-skeleton" aria-hidden>
            <span className="mk">R</span>
          </div>
        )}
        <iframe
          src={PROTOTYPE_URL}
          title="Lumera Aesthetics live prototype"
          className="proto-modal-iframe"
          onLoad={() => setIframeLoaded(true)}
          allow="clipboard-write; fullscreen"
        />
        <a href="book.html" className="proto-modal-book">
          <span>Want one for your practice?</span>
          <strong>Book the walkthrough →</strong>
        </a>
        <button
          ref={closeBtnRef}
          type="button"
          className="proto-modal-close"
          onClick={onClose}
          aria-label="Close prototype"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden focusable="false">
            <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
}

// ── Closing CTA (used on home, product, about) ───────────────────────────────
function ClosingCTA() {
  const ref = useReveal();
  return (
    <section className="closing-cta" ref={ref}>
      <span className="closing-mark serif" aria-hidden>R</span>
      <div className="container" style={{ position: "relative", maxWidth: 820, textAlign: "center" }}>
        <Reveal>
          <p className="text-label-caps" style={{ color: "var(--color-accent)", marginBottom: 24 }}>Next step</p>
        </Reveal>
        {/* TODO Stream C: "15 min / one screen share / no pitch deck" trio headline
            deferred — rewrite with rendered typography + line-break control.
            Stream A replaced only the meta caption below the CTA. */}
        <RevealLines
          as="h2"
          className="text-display-2"
          lines={[
            <>Fifteen minutes, one screen share,</>,
            <> <span className="serif">no pitch deck</span>.</>,
          ]}
          baseDelay={80}
        />
        <Reveal delay={300}>
          <p className="text-body-lg" style={{ maxWidth: 620, margin: "32px auto 40px" }}>
            We look at your current setup and show you the booking page we would build for your practice.
          </p>
        </Reveal>
        <Reveal delay={420}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}>
            <Button href="book.html" variant="primary">Book a 15-min walkthrough</Button>
          </div>
        </Reveal>
        <Reveal delay={520}>
          <ul style={{
            display: "flex", flexWrap: "wrap", justifyContent: "center",
            gap: "12px 24px", fontSize: "0.75rem", letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--color-text-muted-inverse)", listStyle: "none"
          }}>
            <li>15 min · no obligation</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

// =============================================================================
// EXPORT to window so per-page scripts can import without scope leakage
// =============================================================================
Object.assign(window, {
  // hooks
  useReveal, useScrollProgress, useStickyProgress, useMousePos, useCountUp, usePrototypeModal,
  // utils
  clamp, lerp, mix, easeRivr, EASE_RIVR,
  // components
  Reveal, FadeUp, RevealLines, Nav, Button, Footer, BrowserFrame, ClosingCTA, PrototypeModal, CtaReassure,
  // constants
  PROTOTYPE_URL,
});

// ── Defensive: if the page's animation frame loop is frozen (some preview
// iframes pause it — rAF never fires), force final state on all reveal
// elements so they're visible. Real browsers run rAF and play the animations.
(function () {
  let rafFired = false;
  if (typeof requestAnimationFrame !== "undefined") {
    requestAnimationFrame(() => { rafFired = true; });
  }
  setTimeout(() => {
    if (!rafFired) {
      window.__rivrAnimsFrozen = true;
      const forceFinal = () => {
        document.querySelectorAll(".reveal, .reveal-mask, .intro-line, .img-mask, .reveal-clip").forEach((el) => {
          el.classList.add("in");
          el.style.transition = "none";
          el.style.opacity = "1";
          el.style.transform = "none";
          el.style.clipPath = "none";
          el.querySelectorAll(".reveal, .reveal-mask, .intro-line, .img-mask, .reveal-clip, span").forEach((c) => {
            c.style.transition = "none";
            c.style.transform = "none";
            c.style.opacity = "1";
            c.style.clipPath = "none";
          });
          if (el.matches(".reveal-mask")) {
            el.querySelectorAll(":scope > span").forEach(s => { s.style.transform = "none"; });
          }
        });
      };
      forceFinal();
      // Run a few more times to catch newly-mounted elements (React renders
      // asynchronously). Stop once stable.
      let runs = 0;
      const iv = setInterval(() => {
        forceFinal();
        runs++;
        if (runs > 12) clearInterval(iv);
      }, 500);
    }
  }, 250);
})();
