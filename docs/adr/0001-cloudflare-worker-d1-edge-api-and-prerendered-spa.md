# ADR 0001: Prerendered Bilingual React SPA + Cloudflare Worker & D1 Edge API

- **Status:** Accepted
- **Date:** 2026-11-03
- **Owners:** Justin Mafie (`@creova-gif`)

## Context

`creova.one` serves as CREOVA's bilingual (`EN` / `FR`) creative agency flagship and cross-venture gateway (linking to `SEEN` and `VERSE`). Early iterations relied on a pure client-rendered Vite bundle and a Supabase Edge Function (`src/supabase/functions/server`). That setup had three operational drawbacks:
1. Search engines and social preview crawlers received a single generic `<title>` and meta description before client hydration.
2. Pausing or rotating the legacy Supabase project broke contact/booking forms and gallery lookups.
3. Embedding legacy Supabase `publicAnonKey` tokens in source triggered secret/hygiene alerts.

## Decision

1. **Build-Time SSR Prerendering (`src/entry-server.tsx` + `scripts/prerender.mjs`):**
   - `npm run build` validates all bilingual content contracts (`scripts/validate-public-content.mjs`), builds the client bundle, builds an SSR bundle (`.ssr`), and prerenders every public route with route-specific Helmet metadata (`<title>`, canonical URL, OpenGraph tags) and deterministic curated gallery fallback when no remote API is configured.
2. **Cloudflare Worker + D1 + Analytics Engine Backend (`workers/api/`):**
   - Replaces the legacy Supabase Edge Function with a Hono-based Cloudflare Worker (`workers/api/src/index.ts`) backed by Cloudflare D1 (`WITHOUT ROWID` primary-key schema to minimize write amplification) and Workers Analytics Engine for zero-D1-write page-view telemetry.
   - Public form endpoints (`/submit-contact`, `/submit-booking`, `/submit-collaboration`, `/submit-rental`, `/submit-notify`, `/submit-lead-magnet`) enforce strict origin allowlisting (`https://creova.one`, `https://www.creova.one`), per-IP isolate rate limiting (`cf-connecting-ip`), and mandatory Cloudflare Turnstile verification (failing closed with `503` if `TURNSTILE_SECRET_KEY` is unconfigured).
   - Admin endpoints (`/admin-login`, gallery CRUD, transactional replies) use HMAC-signed session tokens (`ADMIN_SESSION_SECRET`) verified server-side.
3. **Environment-Only Credentials:**
   - All client configuration is injected via `VITE_*` environment variables documented in `.env.example`; no project IDs or JWTs are hardcoded in source.

## Consequences

- **Positive:**
  - Zero runtime database dependency for static page rendering; the marketing site remains 100% available on GitHub Pages / CDN even if the API Worker is unreachable.
  - Fits comfortably within Cloudflare Workers & D1 Free Tier limits (~33k–50k daily views) by keeping page-view tracking out of D1.
  - Full automated verification across content parity, ESLint (`--max-warnings=0`), TypeScript (`tsc --noEmit` on root and `workers/api`), Node guard tests, and Vitest Worker tests.
- **Trade-offs:**
  - Per-isolate in-memory rate limiting resets on cold starts rather than coordinating globally via KV/Durable Objects, trading strict global counters for zero KV write costs.
