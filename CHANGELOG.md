# Changelog

All notable changes to **CREOVA (`creova.one`)** are documented in this file.

## [0.2.0] - 2026-11-22

### Changed
- **Security & Configuration Hygiene:** Removed hardcoded legacy Supabase project ID and anon JWT from `src/utils/supabase/info.tsx` in favor of `VITE_SUPABASE_PROJECT_ID` / `VITE_SUPABASE_ANON_KEY` environment variables documented in `.env.example`.
- **Repository Structure Cleanup:** Removed legacy Replit configs and one-off migration scripts from the repository root; archived historical design/audit reports and `EAST-AFRICA-FINTECH-THESIS.md` under `docs/archive/`.
- **Architecture Documentation:** Added `docs/adr/0001-cloudflare-worker-d1-edge-api-and-prerendered-spa.md` and updated `README.md` with full system architecture diagram, implementation status table, and engineering decisions.

## [0.1.0] - 2026-11-03

### Added
- Bilingual (`EN` / `FR`) React 19 + Vite 8 + Tailwind CSS v4 flagship site with build-time SSR prerendering (`scripts/prerender.mjs`) and content validation (`scripts/validate-public-content.mjs`).
- Cloudflare Worker + D1 + Analytics Engine backend (`workers/api/`) with Cloudflare Turnstile verification, HMAC admin session authentication, Resend email delivery, and Airtable lead synchronization.
