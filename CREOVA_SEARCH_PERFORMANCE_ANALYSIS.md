# CREOVA Search Performance Analysis

Source: `creova.one-Performance-on-Search-2026-11-09.xlsx`

Export filter: Web search, “Last 16 months”

Visible daily series: 2026-08-13 through 2026-11-07

## Evidence boundary

This is an early, small-volume Search Console sample. It shows where CREOVA is already being surfaced, but it does not prove demand, conversion, or the cause of any ranking or click change. Title and description updates below are testable hypotheses; Google may rewrite title links and snippets.

## Baseline

| Metric | Value |
| --- | ---: |
| Clicks | 19 |
| Impressions | 845 |
| Desktop | 18 clicks / 566 impressions / 3.18% CTR |
| Mobile | 1 click / 274 impressions / 0.36% CTR |
| Canada | 18 clicks / 230 impressions / 7.83% CTR |
| United States | 0 clicks / 173 impressions |
| India | 0 clicks / 74 impressions |

The country distribution suggests some broad brand-name ambiguity outside Canada. Geography and service context should therefore stay explicit in titles and descriptions rather than expanding into generic global creative-agency language.

## Highest-value observations

### 1. Branded discovery is visible but under-clicked

- Query `creova`: 6 clicks, 251 impressions, 2.39% CTR, average position 5.67.
- Homepage URL variants: 16 clicks and 582 impressions combined.
- Search Console reports both apex and `www` homepage variants. Current canonical generation already selects `https://www.creova.one/`; live redirect/canonical behavior must be verified after release before treating this as an active duplication defect.

Action: lead the homepage title with `CREOVA`, add `WebSite` site-name markup, and keep the descriptor concise enough for mobile results.

### 2. Existing page-one impressions are not becoming visits

| Page/opportunity | Impressions | Clicks | Avg. position | Response |
| --- | ---: | ---: | ---: | --- |
| About | 42 | 0 | 5.29 | Name CREOVA and founder Justin Mafie directly in the title and description. |
| Community | 26 | 0 | 5.35 | Clarify that the page covers collaboration and partnerships. |
| Resources | 18 | 0 | 5.78 | Name the free event/community storytelling tools. |
| Journal | 11 | 0 | 4.18 | Use a practical guide-oriented title rather than “Journal” alone. |
| Brock graduation page | 49 | 1 | 8.06 | Match `Brock University graduation photography` more directly. |
| Videography Niagara | 22 | 0 | 14.23 | Lead with the observed `video production` phrasing and Niagara service area. |

### 3. Mobile result clarity is the immediate optimization target

Mobile produced roughly one-third of impressions but only one click. The title system previously appended the long suffix `CREOVA — Cultural Storytelling Studio` to every page, which could hide the page-specific intent on narrow search results.

Action: use `| CREOVA` as the normal suffix, keep brand-led homepage titles, and avoid appending the brand twice when a title already names CREOVA.

### 4. Legacy and slash variants remain in the historical export

The workbook includes `/fr/shop/digital`, `/shop/digital/`, `/contact/`, `/seen/`, and both slash/no-slash forms. The application already maintains legacy redirects and emits slash-normalized canonical URLs. These rows should be monitored after recrawl; they are not evidence that a new duplicate page should be created.

## Implemented hypotheses

- Brand-first homepage title and `WebSite` structured data.
- Concise global title construction for mobile result clarity.
- Search-intent titles/descriptions for About, Community, Resources, Journal, Contact, Brock graduation photography, and Niagara video production.
- No new claims, rankings, testimonials, or metrics added to public copy.
- Homepage visual proof expanded with a supplied-image living archive; this supports user confidence but is not presented as an SEO ranking guarantee.

## Measurement plan

Compare 28-day periods only after Google has recrawled the changed pages:

1. Branded `creova` CTR and average position.
2. Mobile CTR versus desktop CTR.
3. Clicks/CTR for About, Community, Resources, Journal, Brock graduation, and Videography Niagara.
4. Whether apex, legacy, and no-slash variants decline while canonical `www` slash URLs consolidate.
5. Search appearance data, which is empty in this export.

Do not interpret a change from a handful of impressions as a stable trend. Record impressions, clicks, CTR, and position together.
