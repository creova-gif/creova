---
name: design system
description: The site-wide visual design system and where its primitives live
---

The whole CREOVA site uses one dark editorial design system that blends two
Webflow templates: Rovano (pure-black minimal, tiny mono uppercase labels,
stacked lists, word-by-word reveal) and X-Axis (massive uppercase display type
sandwiching media, crosshair guide lines, single accent). CREOVA branding is
kept: gold #A68F59, terracotta #B1643B, cream #F5F1EB, near-black #0A0A0A.

**Where the primitives live:** reusable CSS utilities are in
`src/styles/globals.css` — `.display-grotesk`, `.display-hero`, `.mono-label`,
`.text-gold-gradient`, `.crosshair-guides`, `.guide-ring`, `.reveal-word`, plus
the `--font-grotesk` (Archivo) token. Reusable components: `SplitText`,
`ScrollScrubText`, `InfiniteMarquee`, `Magnetic`, `TiltCard`, `VideoHero`,
`RevealOnScroll`.

**Conventions:** backgrounds #0A0A0A / #0E0E0E / #121212; headings #F5F1EB with
grotesk uppercase; body text #C8C0B8 (primary) / #9A9088 (muted); cards
#121212 or rgba(166,143,89,0.06) with rgba(166,143,89,0.14-0.18) borders;
primary CTA = cream pill (#F5F1EB bg, #0A0A0A text, rounded-full); section
hairlines rgba(166,143,89,0.3).

**How to apply:** When adding/restyling any page, reuse these utilities and
match HomePage/Navigation/Footer rather than inventing new styles. Keep all
`t()` i18n keys and cart/Stripe/Supabase/form logic intact — restyle is
presentation-only.
