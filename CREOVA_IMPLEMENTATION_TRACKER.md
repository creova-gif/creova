# CREOVA Implementation Tracker

Status date: 2026-11-10

| Priority | Item | Status | Evidence / next step |
| ---: | --- | --- | --- |
| P0 | Preserve user workspace files during audit | Done | Stored in named git stash; restore before handoff. |
| P0 | Prevent Work imagery from appearing absent | Done locally | Removed card `content-visibility` containment. |
| P0 | Restore photography/typography balance | Done locally | Shared hero/page/footer type roles applied to highest-impact routes. |
| P1 | Correct Work heading hierarchy | Done locally | Featured and closing headings now `h2`. |
| P1 | Shared navigation target sizes | Done locally | Logo, links, CTA, menu, and language switcher use 44px targets. |
| P1 | Work filter target sizes | Done locally | Filter and clear controls use 44px targets. |
| P1 | Footer target sizes and secondary contrast | Done locally | Link targets expanded; secondary links use lighter neutral. |
| P1 | Full automated verification | Done | Install, lint, typecheck, test, and build all passed on 2026-11-10. |
| P1 | Responsive post-change screenshots | Done | Home and Work captured at 375/768/1280 after production build. |
| P1 | Fully rendered axe/contrast scan | Pending | Do not scan Suspense/loading shells. |
| P1 | Manual keyboard/AT/zoom test | User/manual pending | Use QA checklist. |
| P1 | Search-performance baseline | Done | Search Console workbook analyzed; 19 clicks / 845 impressions with mobile CTR at 0.36%. |
| P1 | Concise brand-first search titles | Done locally | Homepage, About, Community, Resources, Journal, Contact, and high-opportunity local pages updated. |
| P1 | Site-name structured data | Done locally | Added `WebSite` schema without inventing an unsupported site-search action. |
| P1 | Homepage living archive | Done locally | Added three supplied CREOVA images with responsive loading, descriptive alt text, and reduced-motion support. |
| P1 | Homepage explanatory card reduction | Done locally | Replaced one generic card stack with a rule-separated editorial sequence. |
| P2 | Replace repeated card grids | Planned | Implement Phase 2 page-by-page after visual review. |
| P2 | Founder three-image editorial sequence | Planned | Select distinct supplied images; no stock. |
| P2 | Consolidate inline brand colours | Planned | Migrate repeated literals to tokens without changing palette. |
| P2 | Hosted performance verification | Pending release | Lighthouse/Web Vitals on deployed origin. |
| P2 | Search recrawl comparison | Pending | Compare equivalent 28-day periods after recrawl; do not infer from low-volume daily noise. |

