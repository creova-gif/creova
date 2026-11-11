# CREOVA QA Report

Date: 2026-11-10

## Audit coverage

- Responsive visual captures: Home, Work, one case study, Services, About, Community, Journal, Resources, Ventures, Contact, and an event/service landing page.
- Breakpoints sampled: 375×812, 768×1024, 1280×720.
- Structural inspection: route table, shared navigation/footer, image alt attributes, heading counts, focusable target sampling, and form labels.
- Competitive reference captures: Narrative XPR and OneMethod.

## Pre-change automated observations

| Check | Result |
| --- | --- |
| Home headings | One h1; no sampled heading skip |
| Home images | Five sampled; no missing alt; one decorative empty alt |
| Work headings | One h1; h1→h3 skip found |
| Work images | 31 sampled; no missing alt |
| Contact fields | Ten sampled; all had programmatic labels |
| Home focusables | 58 total; 37 under 24px; 46 under 44px |
| Work focusables | 74 total; 30 under 24px; 42 under 44px |
| Contact focusables | 54 total; 30 under 24px; 43 under 44px |
| DOM design detector | 18 low-contrast warnings; route-shell contamination means confirmation is pending |

## Local changes awaiting verification

- Role-based type scale in `src/styles/globals.css`.
- Home hero composition and safe viewport height.
- Work card rendering, hierarchy, and filters.
- Services, Resources, Ventures, and Contact title scale.
- Navigation, language, and footer target sizes.

## Required automated verification

Run exactly:

```bash
npm ci && npm --prefix workers/api ci
npm run lint
npm run typecheck
npm test
npm run build
```

Record any unavailable command as `NOT VERIFIED` with the reason.

## Manual verification checklist

### Accessibility

- [ ] Tab through every public page; focus is always visible and ordered logically.
- [ ] Open and close mobile navigation, dialogs, drawers, and modals using keyboard only.
- [ ] Confirm focus returns to the trigger after closing an overlay.
- [ ] Test VoiceOver/Safari and NVDA/Firefox or Chrome for landmarks, headings, image alternatives, fields, errors, and status messages.
- [ ] Test at 200% and 400% zoom, including Work filters and Contact form.
- [ ] Confirm all meaning survives `prefers-reduced-motion: reduce`.

### Visual and responsive

- [ ] Verify photo subjects remain visible at 320, 375, 768, 1024, 1280, and 1440 pixels.
- [ ] Confirm French headings do not overflow or create orphaned single words.
- [ ] Confirm no repeated image is used as multiple page covers.
- [ ] Confirm Work cards paint immediately during normal and full-page capture.
- [ ] Confirm footer link rows remain readable with the larger targets.

### Performance and compatibility

- [ ] Run Lighthouse on fully loaded Home, Work, Services, About, and Contact pages.
- [ ] Run axe DevTools on those same settled routes.
- [ ] Test latest Safari, Chrome, Firefox, and Edge.
- [ ] Check iOS Safari and Android Chrome for `svh`, sticky filters, and menu positioning.
- [ ] Confirm no unexpected CLS from fonts, images, loading states, or route transitions.

## Verification status

Automated project commands: PASS — install, lint, typecheck, 44 tests, production build, content validation, SSR build, and 44-route prerender completed on 2026-11-10.  
Manual accessibility and device testing: NOT VERIFIED; requires human/device pass.  
Hosted deployment behavior: VERIFIED on 2026-11-11 for release `bd1d1b9`; GitHub CI and Pages completed successfully and the public-origin axe matrix passed.

## 2026-11-11 search and imagery continuation

- Analyzed the supplied Search Console workbook without modifying it.
- Re-ran install, lint, typecheck, 44 tests, production build, SSR build, public-evidence validation, and the 44-route prerender: all passed.
- Captured the updated homepage at 375, 768, and 1280 pixels plus the French desktop state.
- Verified all three living-archive images load after the section enters the viewport and expose descriptive alt text.
- Verified homepage structured data contains one `WebSite` and one `ProfessionalService` graph, with no duplicate organization graph.
- Verified English and French homepage titles, canonical URL, language state, and archive copy in rendered HTML.
- The browser harness logged sandboxed `about:blank` script warnings; these came from the test harness frame rather than the CREOVA application.

Manual assistive-technology and physical-device testing remains NOT VERIFIED.

## 2026-11-11 rendered accessibility continuation

- Ran axe against the production build at 1280×900 and 390×844 on Home, About, Community, Resources, Work, Start a Project, and French Home.
- Remediated accessible-name mismatches in the language switcher and music player.
- Replaced low-contrast decorative footer text with a non-text circular motif.
- Increased the mobile Work marquee contrast and corrected the Community page to expose one top-level heading.
- Re-scan result: zero axe WCAG 2.1 A/AA violations across all 14 tested page states; every tested page exposed exactly one `h1`, no images without `alt`, and no unlabelled form fields.
- Public mobile Lighthouse baseline: Home scored 79 performance / 100 accessibility / 100 best practices / 100 SEO; Start a Project scored 78 / 100 / 100 / 100. Both reported CLS 0 and total blocking time 0 ms.
- Lighthouse attributed most unused JavaScript to the requested GTM and Contentsquare integrations. Their loading behavior was preserved; field data should be reviewed before changing analytics collection.
- Automated coverage does not replace manual keyboard, screen-reader, 200%/400% zoom, or physical-device testing; those checks remain NOT VERIFIED.

