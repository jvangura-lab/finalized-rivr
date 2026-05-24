# Evidence Page — Backup Content

Source: extracted from `home.jsx` `CredibilityStats` component on 2026-05-24 (commit 58cad8f).
Citation URLs recovered from the original `SOURCES` const in commit `fac5b35` (initial
commit; the const was removed in Stream A — `a245a04` — along with the inline `<sup>`
superscripts when the section was reframed from defensive-citation to assertive-stat).

This is preserved for the future `/evidence` page build (Stream D / week-2 launch).

---

## Section header

- Eyebrow: The industry standard
- Headline: Online booking is no longer a *nice-to-have*. (italic accent on "nice-to-have")

---

## Stat 1

- Headline: 68%
- Label: want online booking
- Body: of patients want to schedule, change, or cancel healthcare appointments online.
- Source: Accenture, *2019 Digital Health Consumer Survey*.
- URL: https://www.ehidc.org/sites/default/files/resources/files/Accenture-2019-Digital-Health-Consumer-Survey.pdf

## Stat 2

- Headline: 80%
- Label: use it to pick a provider
- Body: of healthcare consumers say online scheduling influences which provider they choose.
- Source: Press Ganey, *Online appointment scheduling: the last mile of patient access*.
- URL: https://www.pressganey.com/resources/blog/online-appointment-scheduling-last-mile/

## Stat 3

- Headline: 38%
- Label: fewer no-shows
- Body: lower no-show rates when patients receive a text message appointment reminder.
- Source: *Pragmatic Randomized Study of Targeted Text Message Reminders*. The Permanente Journal, 2022.
- URL: https://pubmed.ncbi.nlm.nih.gov/35609163/

## Stat 4

- Headline: ~25%
- Label: abandon hard booking
- Body: of consumers abandon the booking attempt if scheduling is not simple and convenient.
- Source: Press Ganey, *Online appointment scheduling: the last mile of patient access*.
- URL: https://www.pressganey.com/resources/blog/online-appointment-scheduling-last-mile/

---

## Notes for the future `/evidence` page

- Stat 2 and Stat 4 share the Press Ganey source — collapse to a single bibliography entry on the page.
- The original rendered pattern used numeric superscripts (`<sup>1</sup>` … `<sup>4</sup>`) tied to a footer `<ol className="sources">`. Stream A removed both; restore some equivalent pattern when the evidence page exists.
- Until `/evidence` ships, the home stats section renders the stats without citations and without the broken `/#evidence` link.
