# CREOVA Design Direction

CREOVA should feel like an editorial studio with product ambition: calm, exact,
warm, and culturally aware. The interface must make the work easy to evaluate
before it asks anyone to inquire.

## Brand architecture

- **CREOVA Studio** is the active client-services business.
- **SEEN** is a CREOVA-owned product in development. Product previews are
  evidence of direction, not proof of a released platform.
- **VERSE** is incubating. A tech pack exists; there is no public shop,
  preorder, product inventory, or launch date.
- CREOVA is the portfolio and venture-status hub. SEEN and VERSE use separate
  websites when their confirmed HTTPS destinations are ready; their domains
  are deployment configuration and must never be guessed from the brand name.
- **Community** holds cultural work and participation without presenting
  community relationships as commercial endorsements.

## Public information architecture

1. Home
2. Work
3. Services, including Event Story
4. Community
5. Ventures
6. About
7. Start a Project

Legacy pricing, shop, booking, rental, and checkout URLs redirect into this
architecture. They must not expose an active commerce or direct-booking flow.

## Visual rules

- Ink `#121212`, paper `#F8F9FA`, gold `#D4A843`, and clay `#B1643B` are the
  core palette.
- Use generous editorial spacing, strong type contrast, and real CREOVA work.
- Motion should clarify hierarchy and respect reduced-motion preferences.
- Every interactive element needs keyboard focus, a readable label, and a
  minimum practical touch target.
- Avoid urgency copy, artificial scarcity, inflated metrics, and unsupported
  superlatives.

## Evidence rules

- Public proof is rendered only from the reviewed manifest in
  `src/content/public-evidence.json`.
- A published record requires allowlisted public sources, a publication basis,
  current expiry, and approved English and French copy.
- Testimonials require explicit quote permission. Public posts and event
  participation do not imply permission to publish a testimonial.
- Client value, institutional reuse, and reach are described factually; no
  financial, legal, or performance outcome is inferred from visibility.

## Conversion rules

- The primary action is **Start a Project**.
- The intake form acknowledges a durable request ID only after the server has
  persisted the request.
- The public acknowledgement may state CREOVA's follow-up target, but it must
  not claim a server-calculated due date unless the active API returns one.
- SEEN and VERSE calls to action must reflect their actual stage.
