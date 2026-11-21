# CREOVA competitor benchmark

Originally tested on 2026-11-14 against the live homepages for CREOVA,
OneMethod, Narrative XPR, Tadiem, and DonProd. The technology review was
expanded on 2026-11-21 with supplied Wappalyzer exports for Higgsfield, Devin,
and Super Proper, plus refreshed exports for the original references.

## Method

- Lighthouse mobile profile, run once per live production URL with the same
  local Chrome installation and network/CPU simulation.
- Desktop viewport captures at 1440 by 1000 for visual hierarchy, first-paint
  composition, navigation, messaging, and imagery review.
- Source inspection of the supplied Wappalyzer exports and CREOVA production
  dependencies/imports.
- Lighthouse is a controlled lab measurement, not field data. Re-run it and
  compare the site's consented Web Vitals telemetry before treating a small
  score change as a trend.

## Results

| Site | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| CREOVA | 97 | 100 | 100 | 100 | 2.5 s | 0 | 0 ms |
| OneMethod | 70 | 100 | 100 | 100 | 14.5 s | 0 | 100 ms |
| Narrative XPR | 70 | 94 | 96 | 92 | 16.6 s | 0 | 160 ms |
| Tadiem | 80 | 89 | 100 | 100 | 3.7 s | 0.194 | 30 ms |
| DonProd | 92 | 87 | 100 | 92 | 2.4 s | 0 | 10 ms |

## Technology decision

CREOVA actively uses React, Motion, Tailwind CSS, responsive WebP imagery,
priority hints on hero images, prerendered routes, consent-aware analytics,
and `web-vitals`. These capabilities cover the useful outcomes demonstrated by
the reference sites without duplicating animation or styling runtimes.

| Reference technology | Decision | Reason |
| --- | --- | --- |
| Motion / Framer Motion | Keep | Extensively used for transitions, reveals, parallax, and micro-interactions. |
| Web Vitals | Keep | LCP, INP, and CLS are reported only after analytics consent. |
| Priority Hints | Keep | Primary hero images already use `fetchPriority="high"`. |
| GSAP | Do not add | Motion already owns the current interaction model; GSAP would duplicate it. |
| Emotion | Do not add | Tailwind and the existing CSS system already own component styling. |
| Lenis / Locomotive Scroll | Do not activate | Native scrolling is faster, simpler, and safer for keyboard and reduced-motion users. |
| Anime.js | Do not activate | No current effect requires a second animation runtime. |
| Mapbox | Add only for a real map feature | A decorative map would add weight, API governance, and accessibility work without improving the current conversion path. |
| Next.js / Framer Sites | Do not migrate | Vite prerendering already provides indexable route HTML and strong lab performance. |
| PWA shell | Defer | Several references expose PWA metadata, but CREOVA has no offline task or repeat-use workflow that would justify service-worker cache governance. |
| PostHog / GrowthBook | Defer | Experimentation tooling should follow a defined hypothesis and consent model, not precede one. |
| Sanity | Defer | The reviewed evidence manifest and gallery administration already cover current publishing needs without a CMS migration. |
| Three.js | Do not add | Higgsfield uses it for product spectacle; CREOVA's authentic photography communicates the brand more directly and accessibly. |
| Turbopack | Not applicable | It is a Next.js build tool, not an experience feature CREOVA can adopt independently. |

`lenis`, `animejs`, and the unused Anime.js type package were removed on
2026-11-21 after repository-wide import checks confirmed that none of them were
used. Motion remains the single animation runtime and native scrolling remains
the interaction baseline.

## Expanded technology snapshot

The supplied exports identify technologies, not design quality or business
results. They are useful for spotting capabilities, but they are not a reason
to copy a stack wholesale.

| Reference | Notable detected technology | CREOVA response |
| --- | --- | --- |
| Higgsfield | Framer Motion, Three.js, Tailwind, Sanity, PostHog, GrowthBook, priority hints, PWA | Reuse the proof-first visual density selectively; reject 3D spectacle, fingerprinting, and experimentation tooling without a defined need. |
| Devin | React, Next.js, Tailwind, priority hints, Vercel | Adopt the principle of showing real work immediately; retain Vite and the current hosting path. |
| Super Proper | React, Next.js, Tailwind, Sanity, priority hints | Keep concise positioning and fast media delivery; do not adopt its AI-advertising identity or migrate frameworks. |
| OneMethod | React, Next.js, GSAP, Emotion, web-vitals, Mapbox | Keep Web Vitals; use existing Motion and Tailwind instead of adding overlapping runtimes. |
| Narrative XPR | React, Framer Motion, Framer Sites, priority hints | Continue the editorial rhythm and hand-marked language in CREOVA's palette and voice. |
| Tadiem | React, Next.js, Emotion, priority hints | Keep the portfolio-scale confidence while avoiding its measured layout shift and duplicate styling stack. |
| DonProd | React Router, Framer Motion, Lenis, Locomotive Scroll | Retain native scrolling and reduced-motion safeguards; do not activate competing smooth-scroll systems. |

## Design comparison

- CREOVA has the clearest first-view value proposition and strongest immediate
  action path of the five sites.
- Narrative XPR has the most distinctive editorial typography and hand-marked
  visual language. CREOVA's annotation components capture this class of
  expression while using its own colour, photography, and voice.
- OneMethod creates strong brand theatre but delays useful content behind a
  dark first-load composition; its measured LCP reflects that trade-off.
- Tadiem has confident typography and portfolio scale, but its tested layout
  shift and accessibility issues are regressions CREOVA should avoid.
- DonProd is technically light once loaded, but the JavaScript-dependent first
  view and missing image alternatives found by Lighthouse reduce resilience.
- Higgsfield demonstrates dense visual discovery and cinematic product theatre,
  but its larger experimentation, fingerprinting, and 3D stack is not a fit for
  CREOVA's consent and performance principles.
- Devin is strongest when it shows the product doing real work rather than
  describing it abstractly. CREOVA can borrow that proof-first principle by
  bringing verified case-study imagery forward, without copying its software UI.
- Super Proper's concise positioning is useful, while its AI-advertising frame
  is not CREOVA's meaning or market position.

## 2026-11-21 implementation response

- Replaced the text-only homepage proof strip with an image-led selected-work
  rail sourced from the approved evidence record and existing public galleries.
- Kept the evidence copy unchanged, preserved the case-study route, and linked
  each image to its public Pixieset gallery.
- Used the current Motion and Tailwind stack, lazy image loading, explicit image
  geometry, keyboard focus treatment, and reduced-motion handling.
- No competitor framework or analytics vendor was added.

## Follow-up checks

1. Monitor consented field LCP, INP, and CLS by route and device class.
2. Re-run Lighthouse three times after major media or animation changes and use
   the median result.
3. Complete manual keyboard, VoiceOver, 200% zoom, and reduced-motion testing.
4. Keep the current rule: add a library only when a specific feature cannot be
   implemented cleanly with the existing system.
