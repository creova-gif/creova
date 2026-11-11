# CREOVA Page Redesign Plan

## Phase 1 — Foundation and reliability (implemented locally)

- Introduce role-based type tokens.
- Reduce Home, Work, Services, Resources, Ventures, Contact, and footer headline scale.
- Reveal more of the homepage image subject.
- Remove Work card deferred painting and repair heading hierarchy.
- Standardize shared 44px targets.

## Phase 2 — Narrative layout variation

Search priorities are informed by the 2026-11-09 Search Console export. See `CREOVA_SEARCH_PERFORMANCE_ANALYSIS.md`; proposed CTR improvements remain hypotheses until post-recrawl measurement.

### Home

- Convert one three-card explanatory group into a rule-separated editorial sequence. **Implemented locally.**
- Keep the featured case study as the first strong proof block.
- Add a compact three-image “living archive” strip using distinct supplied images. **Implemented locally.**

### Work

- Lead with one project and follow with mixed 2:1 and 1:1 image rhythm.
- Keep search/filter controls but simplify metadata density.
- Add captions that distinguish public case studies from external galleries.

### Services

- Replace the uniform four-panel treatment with alternating service chapters.
- Pair each offer with one relevant existing/supplied image and a concise fit statement.
- Keep equipment access visibly inquiry-led and subject to written terms.

### About

- Preserve the photo-led hero.
- Build a three-frame founder editorial sequence from distinct supplied images.
- Keep Sankofa context concise and grounded in CREOVA’s stated approach.

### Community

- Preserve the image-first opening.
- Give the commission, collaborate, and partner/fund paths different visual treatments instead of identical cards.

### Resources and Journal

- Use feature cards only for the lead item.
- Render secondary content as an editorial index with topic, reading time/type, and action.

### Ventures

- Treat each venture as a chapter with explicit stage, next available action, and no invented launch timing.

### Contact

- Keep the qualified intake flow.
- Add a compact “what happens next” sequence beside or after the form on large screens.

## Phase 3 — Motion, accessibility, and performance polish

- Consolidate motion durations/easing and reduced-motion behavior.
- Complete final contrast and target-size inventory.
- Run assistive-technology and zoom testing.
- Measure LCP/CLS/INP on deployed pages and adjust image preload/sizes from real data.

## Release and rollback

- Release as an atomic commit after all `.ai/project.yaml` verification commands pass.
- Capture Home, Work, Services, About, Community, and Contact at 375/768/1280 before push.
- Roll back by reverting the redesign commit; do not rewrite branch history.
- Treat a successful local build as local evidence only; confirm hosted source and deployment separately.

