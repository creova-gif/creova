# CREOVA Website Audit

Date: 2026-11-10  
Scope: public English routes, representative French routing, shared navigation/footer, responsive captures at 375, 768, and 1280 pixels. Admin routes were inventoried but not visually audited because they require authentication.

## Assumptions and evidence boundary

- CREOVA is a founder-led cultural storytelling studio serving cultural organizations, community builders, and purpose-led businesses in Ontario.
- The current burgundy, cream, olive, and gold palette and authentic CREOVA photography are brand assets to preserve.
- Public outcomes are stated only where the repository contains published evidence. No new performance metric, testimonial, client claim, or maturity claim was introduced.
- Automated findings are evidence, not proof. Keyboard, screen-reader, zoom, and real-device testing remain manual verification gates.

## Executive summary

- The site has a distinctive, credible foundation: authentic people-first imagery, a coherent palette, bilingual routing, and clear service intent.
- Oversized display type repeatedly competes with photography and makes several first screens feel like posters rather than useful entry points.
- The visual rhythm relies too often on three-column cards, bordered panels, numbered kickers, and a very large repeated footer CTA.
- The Work page can reserve large blank areas while deferred cards paint; removing `content-visibility` from the portfolio cards makes the visual proof reliable.
- Accessibility foundations are present, but touch targets, heading hierarchy, contrast verification, and manual assistive-technology testing require attention.

## Scores

| Area | Score | Rationale |
| --- | ---: | --- |
| Overall design quality | 7.1/10 | Strong brand assets and photography; scale and repetition weaken hierarchy. |
| Creative distinctiveness | 7.4/10 | Human, cultural material is memorable; some page patterns feel templated. |
| Accessibility readiness | 7.0/10 | Good landmarks, labels, alt-text coverage, zoom, and focus foundation; target size and manual verification remain. |
| Performance perception | 7.2/10 | Responsive WebP assets and lazy loading are used; deferred Work cards created an apparent empty-page failure. |

## Prioritized issues

### Critical

No confirmed critical defect was found in the inspected public routes.

### High

1. **Photography is obscured by display typography** — Home, Work, Services, Resources, Ventures, and Contact heroes used 102–128px maximum title sizes. This reduced subject visibility and first-screen comprehension.
2. **Work proof can appear missing** — Work portfolio cards used `content-visibility: auto` with large intrinsic placeholders. In a full-page capture this presented as a large empty region, undermining the site’s primary evidence surface.
3. **Touch targets are inconsistent** — Homepage sampling found 46 of 58 focusable elements under the preferred 44px target and 37 under 24px. Navigation, language controls, filters, and footer links were the main clusters.

### Medium

1. **Heading hierarchy skip** — Work used an `h3` directly under the page `h1` for its featured case study and closing CTA.
2. **Repeated card grammar** — Home, Services, Resources, and Ventures repeat rounded bordered containers and three-column grids, flattening narrative rhythm.
3. **Repeated footer climax** — A 96px footer heading competed with each page’s own final message.
4. **Small uppercase metadata** — Multiple 8–10px labels with wide tracking are visually quiet and can be difficult to read at zoom or on low-density screens.
5. **Contrast requires route-by-route confirmation** — The DOM detector reported 18 low-contrast findings, but several captures contained identical lazy-loading shells. These warnings are not accepted as confirmed failures until each final rendered route is re-scanned.

### Low

1. Hover scale and translation effects are used broadly; they should remain restrained and informational.
2. Several inline colour literals duplicate existing brand tokens.
3. Some paragraphs exceed the ideal 55–75 character reading measure.

## Page-by-page checklist

| Page | Current state | Change applied / direction |
| --- | --- | --- |
| Home | Authentic hero image, but title covered much of the human subject. Repeated three-card sections. | Reduced title scale, narrowed copy measure, softened the right-side overlay, and used viewport-safe hero height. Preserve photo-led opening; vary later sections in phase 2. |
| Work | Strong project imagery and filters, but card painting could leave a large blank field; heading skip. | Removed deferred card containment, corrected `h2` hierarchy, reduced hero title, and enlarged filter/clear controls. |
| Case study | Evidence-led structure and suitable title scale. | No structural change in this tranche. Keep claim boundaries and add only verified outcomes. |
| Services | Clear offer architecture, but a huge hero and repeated bordered service panels. | Reduced hero title. Phase 2: alternate editorial splits and process diagrams instead of uniform panels. |
| About | Strongest interior photo narrative; founder treatment feels most authored. | Preserve. Use it as the compositional reference for other interior pages. |
| Community | Image-led opening is effective; route choices are clear. | Preserve. Future enhancement: subtle route-specific image captions and partner context. |
| Journal | Photo-led cards and readable scale. | Preserve; verify heading and teaser consistency as content grows. |
| Resources | Useful content, but large hero and stacked cards dominate mobile. | Reduced hero title. Phase 2: use editorial index rows for secondary resources. |
| Ventures | Honest stage language, but title scale overwhelms sparse content. | Reduced title scale. Retain the explicit in-development language. |
| Contact / Start a project | Good labels and clear conversion path; oversized intro. | Reduced title scale. Keep direct email fallback and form labels. |
| Service-area pages | Consistent localized template with moderate title scale. | No immediate change; re-test each generated route for duplicate content and contrast. |
| Legal pages | Functional content pages. | No visual expansion required; keep readability and semantic headings primary. |
| Shared navigation | Clear IA and current-page state; several desktop/mobile controls were undersized. | Added 44px targets to logo, desktop links, CTA, menu control, and language buttons. |
| Shared footer | Useful navigation but visually dominant and many compact links. | Reduced headline scale, improved secondary-link contrast, and added 44px link targets. |

## Accessibility findings against WCAG 2.1/2.2 AA

| Criterion | Name | Affected element | Severity | State |
| --- | --- | --- | --- | --- |
| 1.3.1 | Info and Relationships | Work featured/closing headings skipped from h1 to h3 | Medium | Fixed locally |
| 1.4.3 | Contrast (Minimum) | Automated detector flagged small/low-opacity text across route shells | High | Needs final rendered re-scan and manual confirmation |
| 1.4.10 | Reflow | Long mobile page stacks and sticky Work filters | Medium | Heuristic pass; manual 320px/400% test pending |
| 2.4.3 | Focus Order | Mobile menu, filters, modals | Medium | Focus trap exists; full keyboard walk pending |
| 2.4.7 | Focus Visible | Site-wide controls | Low | Global focus ring exists; visual review pending on dark/light surfaces |
| 2.5.8 | Target Size (Minimum), WCAG 2.2 | Navigation, language switcher, filters, footer links | High | Shared controls fixed locally; full inventory pending |
| 4.1.2 | Name, Role, Value | Interactive modals, drawers, and custom controls | Medium | Labels observed in key forms; screen-reader verification pending |

## Quick wins completed

- Added shared editorial type roles and reduced hero/footer maxima.
- Preserved more visible photography in the homepage first screen.
- Replaced `vh` hero sizing with `svh`-safe sizing on Home and Work.
- Removed portfolio card containment that caused apparent missing imagery.
- Corrected Work heading levels.
- Enlarged shared navigation, language, Work-filter, and footer targets.

## Verification still required

- Keyboard-only walkthrough of every public route and modal.
- VoiceOver + Safari and NVDA + Firefox/Chrome smoke tests.
- 200% and 400% zoom/reflow checks at 320 CSS pixels.
- Axe and Lighthouse runs on fully settled routes, not loading shells.
- Real iOS Safari and Android Chrome checks for sticky filters and viewport height.

