# Blocked on Thor — 2026-05-20 merge batch

Items I couldn't finish without your accounts/auth/decisions. Each is also marked with a `TODO(thor):` comment at the code location. Knock these out in parallel.

## MUST-FIX batch (items 1–8)

- **Phone number** — Set up Google Voice at voice.google.com, then replace `(phone TBD)` (and the empty `sms:`/`tel:` hrefs) in `app.jsx` (footer) and `about.jsx` (Location) with the real number.
- **Email alias** — Create `hello@rivrsystems.com` in Google Workspace admin (the site now points there instead of `join@`).
- **Privacy/Terms/Cookies URLs** — Confirm the real Termly URLs and update `app.jsx` footer if they differ from `https://rivrsystems.com/privacy` `/terms` `/cookies`.
- **Social handles** — Removed the dead `href="#"` Instagram/LinkedIn links from the footer (`app.jsx`). Re-add with real URLs when the accounts exist.
- **Canonical production domain** — I assumed `https://rivrsystems.com` for canonical + OG `og:url`/`og:image` across all 4 HTML heads. Confirm that's the live domain (vs `www.` or a vercel.app domain) and correct if needed.
- **Branded scheduler domain** — The book-page scheduler still uses the raw Cloud Run URL (`rivr-booking-...run.app`). I deliberately did NOT point it at the Lumera demo (that would break booking). Map it to `book.rivrsystems.com` (DNS + deploy) and update `BOOKING_URL`/`BOOKING_ORIGIN` in `book.jsx`.

