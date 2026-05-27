// =============================================================================
// COOKIES page — branded chrome wrapping the Termly-exported Cookie Policy.
// Mirrors privacy.jsx / terms.jsx exactly; only the policy file URL, page
// title, and PolicyHero title differ. Reuses the .termly-policy CSS scope
// already added in the privacy commit so Termly's Arial / grey inline styles
// get re-mapped to the rivr-web palette.
// =============================================================================
const { useState: useStateCookies, useEffect: useEffectCookies } = React;
const {
  useReveal, Reveal, FadeUp, RevealLines, Nav, Footer,
} = window;

const POLICY_HTML_URL = "legal/cookie-policy.html";
const POLICY_LAST_UPDATED = "Last updated May 27, 2026";

function PolicyHero({ eyebrow, title, lastUpdated }) {
  return (
    <section className="hero-stage policy-hero" style={{ minHeight: "auto", paddingBlock: "120px 56px" }}>
      <div className="hero-grid-bg" aria-hidden />
      <div className="container" style={{ position: "relative", zIndex: 2, maxWidth: 760 }}>
        <Reveal>
          <p className="text-label-caps" style={{ color: "var(--color-accent-strong)", marginBottom: 20 }}>{eyebrow}</p>
        </Reveal>
        <RevealLines
          as="h1"
          className="text-display-1"
          lines={[title]}
          baseDelay={80}
        />
        <Reveal delay={260}>
          <p className="serif" style={{
            fontStyle: "italic",
            color: "var(--color-text-muted)",
            fontSize: "0.9375rem",
            marginTop: 18,
          }}>
            {lastUpdated}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PolicyContent({ html, loading, error }) {
  return (
    <section className="section policy-content" style={{ paddingBlock: "16px 96px", borderBottom: 0 }}>
      <div className="container" style={{ maxWidth: 760 }}>
        {loading && (
          <p style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>
            Loading policy…
          </p>
        )}
        {error && (
          <p style={{ color: "var(--color-walnut)" }}>
            Couldn't load the policy. Please refresh, or email <a href="mailto:hello@rivrsystems.com" style={{ color: "var(--color-accent-strong)", textDecoration: "underline" }}>hello@rivrsystems.com</a> for a copy.
          </p>
        )}
        {html && (
          <div className="termly-policy" dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </div>
    </section>
  );
}

function Page() {
  const [html, setHtml] = useStateCookies("");
  const [loading, setLoading] = useStateCookies(true);
  const [error, setError] = useStateCookies(false);

  useEffectCookies(() => {
    let cancelled = false;
    fetch(POLICY_HTML_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((text) => {
        if (cancelled) return;
        setHtml(text);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <Nav current="home" />
      <main id="main">
        <PolicyHero
          eyebrow="LEGAL"
          title="Cookie Policy"
          lastUpdated={POLICY_LAST_UPDATED}
        />
        <PolicyContent html={html} loading={loading} error={error} />
      </main>
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Page />);
