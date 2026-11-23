# Changelog

All notable changes to **CREOVA (`creova.one`)** are documented in this file.

## [0.2.1] - 2026-11-23

### Changed
- **Dead-File Hygiene:** Removed the unreferenced `src/utils/supabase/info.tsx` shim, simplified `scripts/prerender.mjs` to read optional legacy gallery env vars directly, and added `utils/supabase/info.tsx` guardrails to `.gitignore`.
- **Test Verification Coverage:** Wired `workers/api/src/guards.test.ts` and `workers/api/src/analytics.test.ts` (27 pure unit tests) into `workers/api` `npm test`, bringing automated CI test execution to 72 tests across Node `node:test` and 4 Miniflare/Vitest Worker configurations.
- **Governance & Case-Study Documentation:** Upgraded `AGENTS.md` to the Shared Engineering Governance Standard (`v1.0`) and expanded `README.md` with full build-time SSR + Cloudflare Worker/D1 architecture diagrams, trade-off analysis, and security verification documentation.

## [0.2.0] - 2026-11-22

### Changed
- **Security & Configuration Hygiene:** Removed hardcoded legacy Supabase project ID and anon JWT from `src/utils/supabase/info.tsx` in favor of environment variables documented in `.env.example`.
- **Repository Structure Cleanup:** Removed legacy Replit configs and one-off migration scripts from the repository root; archived historical design/audit reports and `EAST-AFRICA-FINTECH-THESIS.md` under `docs/archive/`.
- **Architecture Documentation:** Added `docs/adr/0001-cloudflare-worker-d1-edge-api-and-prerendered-spa.md` and updated `README.md` with system overview and engineering decisions.

## [0.1.0] - 2026-11-03

### Added
- Bilingual (`EN` / `FR`) React 19 + Vite 8 + Tailwind CSS v4 flagship site with build-time SSR prerendering (`scripts/prerender.mjs`) and content validation (`scripts/validate-public-content.mjs`).
- Cloudflare Worker + D1 + Analytics Engine backend (`workers/api/`) with Cloudflare Turnstile verification, HMAC admin session authentication, Resend email delivery, and Airtable lead synchronization.
