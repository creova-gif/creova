# CREOVA

**Ontario's BIPOC creative agency — photography, videography, brand design, and event production, based in Niagara Region and serving clients across Canada.**

[![CI](https://github.com/creova-gif/creova/actions/workflows/ci.yml/badge.svg)](https://github.com/creova-gif/creova/actions/workflows/ci.yml)
[![Status](https://img.shields.io/badge/status-live-brightgreen)](https://www.creova.one)
[![License](https://img.shields.io/badge/license-proprietary-red)](LICENSE)

Live site: **https://www.creova.one**

## Overview

The production marketing website for CREOVA's creative agency work, and the home of CREOVA's cross-portfolio strategy documentation.

## Key Capabilities

- Marketing site: photography, videography, brand management, event design, social media services
- Hosts `EAST-AFRICA-FINTECH-THESIS.md` — the reference document describing how Gopay, Sauti-Os, and Kultr-Hub connect as a single fintech/creator-economy architecture

## Architecture

React/Vite frontend with a minimal Supabase backend (scaffold tables only — `knowledge_base`, `kv_store` — with RLS enabled and no client policies, correctly default-deny). There is no real business data at risk in this repo's own database; its role is primarily the marketing site and shared strategy documentation.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Supabase (minimal/scaffold usage) |
| CI/CD | Own `ci.yml` + `deploy.yml` |

## Prerequisites

- Node.js 22 (matches CI) and npm

## Getting Started

```bash
git clone https://github.com/creova-gif/creova.git
cd creova
npm ci
npm run dev        # Vite dev server
npm test           # Edge-function guard tests + workers/api tests
npm run build      # Content validation, client + SSR build, prerender
```

## Configuration

Optional Vite variables (set in `.env.local`):

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | API base URL |
| `VITE_GALLERY_API_BASE_URL` | Gallery API base URL |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |
| `VITE_SEEN_SITE_URL`, `VITE_VERSE_SITE_URL` | Links to sibling sites |

## Project Structure

```
src/        # React app and Supabase edge-function code
public/     # Static assets
workers/    # Cloudflare Worker API (has its own tests)
scripts/    # Build, prerender and content-validation scripts
docs/       # Documentation
*.md        # Root strategy and design documents (e.g. CREOVA_DESIGN_SYSTEM.md, EAST-AFRICA-FINTECH-THESIS.md)
```

## Project Status

Live — this is the active production marketing site.

## Contributing

Private, proprietary CREOVA product. Authorized contributors should read [`CONTRIBUTING.md`](CONTRIBUTING.md), the [Code of Conduct](CODE_OF_CONDUCT.md) and [`DESIGN.md`](DESIGN.md) before UI work.

## License

Proprietary — All Rights Reserved. See [`LICENSE`](LICENSE).

## Author / Organization

Built by [Justin Mafie](https://github.com/creova-gif). Questions: open an issue or email creativeinnovationspace@gmail.com.

## Documentation

[`EAST-AFRICA-FINTECH-THESIS.md`](EAST-AFRICA-FINTECH-THESIS.md) in this repo is a strategic reference, not proof that cross-product integration is built — verify claims against the actual target repos (Gopay, Sauti-Os, Kultr-Hub) directly. See [`CLAUDE.md`](CLAUDE.md) for AI-agent-specific notes.
