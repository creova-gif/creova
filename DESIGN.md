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
4. Resources
5. Community
6. Our Brands
7. About
8. Start a Project

Legacy pricing, shop, booking, rental, and checkout URLs redirect into this
architecture. Equipment access may be presented as an inquiry-led service, but
must not expose an unverified inventory, rate, deposit, availability, checkout,
or direct-booking flow.

## Visual rules

- The supplied CREOVA brand board is the source of truth: warm beige
  `#CDBFAE`, olive `#887759`, deep oxblood `#2D1011`, white `#FFFFFF`, and a
  restrained digital metallic-gold accent `#C6A45A`.
- Use the derived olive shade `#7D6D51` only when white small text needs an
  accessible solid background; the board's `#887759` remains the visible
  palette reference.
- Quasimoda Bold is the preferred heading face and Quasimoda Regular is the
  preferred body face. Use only through a licensed Adobe Fonts web project or
  licensed self-hosted files. Until that is connected, the site uses its
  declared Avenir Next, General Sans, and Instrument Serif fallbacks.
- Use generous editorial spacing, strong type contrast, and real CREOVA work.
- The logo-led intro plays once per browser-tab session, stays under roughly
  1.2 seconds, never delays content loading, and is skipped for reduced motion.
- Partner logos use their official colour artwork. Do not recolour, desaturate,
  or force institutional marks into monochrome treatments.
- Project cards use the corresponding public Pixieset collection cover and
  link to that exact collection. Locked galleries are not public case-study
  evidence.
- Motion should clarify hierarchy and respect reduced-motion preferences.
- CREOVA Music may use official, public CREOVA Music releases in a compact
  click-to-play module. Never autoplay audio or load a third-party player before
  the visitor asks to listen.
- Community resources must be real, directly downloadable, free of lead gates,
  and scrubbed of internal contact, banking, legal, or draft-only information.
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
