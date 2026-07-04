# CREOVA

**Ontario's BIPOC creative agency — photography, videography, brand design, and event production, based in Niagara Region and serving clients across Canada.**

[![Status](https://img.shields.io/badge/status-live-brightgreen)]()
[![License](https://img.shields.io/badge/license-proprietary-red)]()

---

## What this is

CREOVA is a full-service creative agency built around elevating BIPOC-owned businesses and communities through visual storytelling — photography, videography, brand management, event design, and social media services. This repo is the production website: a full booking-and-commerce platform, not a static portfolio page.

---

## Core Features

- **Portfolio / Work** — case studies and past project showcase
- **Services & Pricing** — tiered service packages, viewable and bookable directly
- **Shop + Digital Products** — e-commerce storefront (Stripe-powered)
- **Booking** — client booking flow for services
- **Rental** — equipment/space rental flow
- **Memberships** — recurring membership tier(s)
- **Community** — BIPOC community programming and partnerships (this is where the MSK Niagara research partnership and Black Student Success Centre work surface publicly)
- **Auth** — client accounts (Supabase Auth, including OAuth callback flow)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite, React Router |
| UI | Radix UI |
| Backend / Auth | Supabase |
| Payments | Stripe |
| i18n | Multi-language support (`LanguageContext`) |
| SEO | `react-helmet-async`, sitemap.xml, robots.txt already configured |

---

## Getting Started (Local Dev)

### Prerequisites
- Node.js 18+

### Installation

```bash
git clone https://github.com/creova-gif/CREOVA.git
cd CREOVA
npm install
```

### Environment Variables

Supabase and Stripe keys are required — check for an existing `.env.example`; if none exists, one should be added based on the Supabase/Stripe client initialization in `src/`.

### Running locally

```bash
npm run dev
```

---

## A known issue, already diagnosed in this repo

This repo is large (500MB+) because large binary assets were committed to git history before `.gitignore` caught up — the repo's own `.gitignore` comments already flag this and note that a `git-filter-repo`/BFG history cleanup is the fix. That cleanup hasn't been run yet. It's a deliberate, one-time, backed-up operation — not something to do casually. See the portfolio audit for the exact safe procedure.

---

## Roadmap / Status

This is a live, active production site (not a prototype) — Home, Work, Services, Pricing, Shop, Digital Products, Events, Community, Memberships, Booking, Rental, and Auth are all implemented routes.

---

## Contributing

This is a private, proprietary CREOVA product. External contributions are not accepted at this time.

## License

Proprietary — All Rights Reserved. See `LICENSE`.

## Credits

CREOVA — Ontario's BIPOC creative agency. Founder: Justin Mafie.

---

## Ecosystem note

Three CREOVA repos — `Gopay`, `Sauti-Os`, and `Kultr-Hub` — form a connected East Africa fintech and creator-economy thesis (payment rails, artist royalty tooling, and consumer distribution, respectively) that wasn't documented as a unified strategy until now. See [`EAST-AFRICA-FINTECH-THESIS.md`](./EAST-AFRICA-FINTECH-THESIS.md) for the full picture — including what's actually connected today versus what's still conceptual.
