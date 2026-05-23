# CREOVA - Black-Owned Creative Agency Website

## Project Overview
CREOVA is a high-end, professional website for a Black-owned creative agency based in Ontario, Canada. The agency specializes in photography, videography, brand management, and digital content creation, serving BIPOC communities.

## Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4 + Radix UI + Shadcn UI patterns
- **Routing**: React Router v6
- **Animations**: Framer Motion + Embla Carousel
- **Backend/DB**: Supabase (auth, database, edge functions - hardcoded in `src/utils/supabase/info.tsx`)
- **Payments**: Stripe (publishable key via `VITE_STRIPE_PUBLISHABLE_KEY` env var)
- **Error Tracking**: Sentry (DSN via `VITE_SENTRY_DSN` env var)
- **i18n**: Custom English/French context-based translations
- **reCAPTCHA**: Google reCAPTCHA v2 (production site key hardcoded in `src/components/Captcha.tsx`)

## Project Structure
```
src/
  components/     # Reusable UI components
    ui/           # Base design system (Shadcn/Radix)
    figma/        # ImageWithFallback component
  pages/          # Route-level components (22 pages)
  context/        # React Context providers (Cart, Language)
  utils/          # Helpers (security, payments, logger, supabase)
  supabase/       # Supabase client config + edge functions
  assets/         # Image assets (placeholder PNGs - need real images from Figma)
  styles/         # globals.css (Tailwind theme variables)
```

## Pages / Routes
- `/` - HomePage
- `/services` - ServicesPage
- `/pricing` - PricingPage
- `/shop` - ShopPage (SEEN fashion collection)
- `/digital-products` - DigitalProductsPage
- `/experience` - EventsCollaboratePage
- `/community` - CommunityPage
- `/contact` - ContactPage
- `/booking` - BookingPage
- `/rental` - RentalPage
- `/memberships` - MembershipsPage
- `/auth` - AuthPage (Supabase auth)
- `/terms-of-service`, `/privacy-policy` - Legal pages
- `/checkout`, `/order-confirmation`, `/payment-success` - Payment flow
- `/admin/*` - Protected admin routes

## Development
- Run: `npm run dev` on port 5000
- Build: `npm run build` (outputs to `build/`)

## Environment Variables Needed
- `VITE_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (pk_test_... or pk_live_...)
- `VITE_SENTRY_DSN` - Optional: Sentry DSN for error tracking

## Design Language (Editorial CREOVA System)
Applied consistently across all main pages (Home, Services, Pricing, Contact, Booking, Community, EventsCollaborate):
- **Hero**: Near-black `#0A0A0A` with ambient gold radials, fine 28px dot texture, editorial label with flanking gold hairlines, `clamp()` large headline, gold gradient on second headline line, vertical `|` service tag separators
- **Dark sections**: `#0E0E0E` or `#121212` with `rgba(166,143,89,0.3)` top/bottom hairlines, ambient radial glow
- **Cards**: Two-zone (dark `#121212` header + white body), gold 2px top stripe, gold dot bullets, dark→gold hover CTA
- **Section labels**: Small-caps gold text with flanking hairlines (left-aligned) or centered flanking rules
- **Palette**: `#0A0A0A` near-black, `#121212` dark, `#F5F1EB` cream, `#A68F59` gold, `#B1643B` terracotta, `#7A6F66` muted text

## Image Assets (public/)
Compressed images in `public/`: card-bssc.jpg, card-fbf.jpg, card-msk.jpg, card-blsa.jpg, card-busu.jpg, card-justin-panel.jpg
Compressed images in `src/assets/`: photo-event-networking.jpg, and various others (150-490KB each via ImageMagick)

## Known Issues / Post-Import TODOs

### 1. Missing Real Image Assets (CRITICAL for visual quality)
All 24 Figma-exported images in `src/assets/` are 1×1 placeholder PNGs.
These need to be replaced with the actual images exported from the Figma design:
`https://www.figma.com/design/mmca2ikgvaW1QbnjbXOgis/CREOVA`

Missing images include: CREOVA logo, hero backgrounds, hero photos, partner/community images,
event photos, etc. All referenced as `figma:asset/*.png` in component files.

### 2. Stripe Publishable Key (CRITICAL for payments)
The original key was corrupted in the GitHub export. Now reads from `VITE_STRIPE_PUBLISHABLE_KEY`
environment variable. Set this in Replit Secrets.

### 3. reCAPTCHA Domain Mismatch (non-critical in dev)
The reCAPTCHA site key is registered for `creova.ca`. Shows a false-positive error callback
in Replit's dev environment. Will work correctly on the production domain.

### 4. Supabase Configuration
Credentials are hardcoded in `src/utils/supabase/info.tsx` pointing to the original project.
If the Supabase project is no longer accessible, a new project will be needed.

## Deployment
- Static site deployment: `npm run build`, serves from `build/` directory
- Configure: deployment target = static, build = `npm run build`, publicDir = `build`
