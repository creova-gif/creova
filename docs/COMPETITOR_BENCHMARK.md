# CREOVA competitor benchmark

Tested on 2026-11-14 against the live homepages for CREOVA, OneMethod,
Narrative XPR, Tadiem, and DonProd.

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

`lenis` and `animejs` remain installed but have no production imports. They
should be removed in a dedicated dependency cleanup unless an approved feature
requires them.

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

## Follow-up checks

1. Monitor consented field LCP, INP, and CLS by route and device class.
2. Re-run Lighthouse three times after major media or animation changes and use
   the median result.
3. Complete manual keyboard, VoiceOver, 200% zoom, and reduced-motion testing.
4. Keep the current rule: add a library only when a specific feature cannot be
   implemented cleanly with the existing system.
