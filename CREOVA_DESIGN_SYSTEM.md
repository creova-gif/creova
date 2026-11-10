# CREOVA Design System

## Foundations

### Colour roles

| Token | Value | Role |
| --- | --- | --- |
| `--creova-oxblood` | `#2D1011` | Primary dark canvas and text |
| `--creova-white` | `#FFFFFF` | Light canvas and inverse text |
| `--creova-cream` | `#CDBFAE` | Soft neutral field and supporting text |
| `--creova-olive` | `#887759` | Secondary brand surface |
| `--creova-olive-strong` | `#7D6D51` | Accessible action colour on white |
| `--creova-gold` | `#C6A45A` | Focus, active state, and editorial signal |

Avoid low-opacity body copy. Body text targets 4.5:1; large text targets 3:1; interactive boundaries and focus indicators target 3:1 against adjacent colours.

### Typography roles

| Role | CSS token | Range |
| --- | --- | --- |
| Homepage hero | `--type-hero` | 46–88px |
| Interior page title | `--type-page-title` | 42–72px |
| Section title | `--type-section-title` | 35–56px |
| Footer title | `--type-footer-title` | 42–76px |
| Body | Base scale | 16–20px |

Display: Quasimoda with established fallbacks. Body: Quasimoda/General Sans. Accent serif is reserved for quotations or a single editorial phrase, never long body copy.

### Spacing and measure

- Base spacing rhythm: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px.
- Standard content container: existing `max-w-7xl` with 24px mobile and 32px desktop gutters.
- Body copy measure: 55–75 characters.
- Touch targets: 44×44px preferred; never below WCAG 2.2 AA’s 24×24px minimum without a valid spacing exception.

## Components

### Hero

- Use one dominant image, not a collage by default.
- Protect the subject with `object-position` and a directional overlay.
- Use `min-height: calc(100svh - 4rem)` only when the image can support the crop.
- One primary CTA and one secondary CTA maximum.

### Editorial image sequence

- 2–4 images with different ratios (4:5, 3:2, 1:1) and no repeated source.
- Captions sit outside the image when possible.
- Lazy-load below-fold images; always provide width and height.

### Cards

Use a card only when the whole surface is one interaction or one bounded record. Prefer split layouts, lists, or rule-separated rows for explanatory content.

### Focus and state

- Retain the global gold focus ring with oxblood separation.
- Every hover treatment also requires a visible focus treatment.
- Active navigation uses `aria-current` plus a non-colour cue.
- Disabled and loading states must be explicit in both visuals and semantics.

## Responsive rules

- Design at 320, 375, 768, 1024, 1280, and 1440 CSS pixels.
- Use `svh`/`dvh` for viewport-sensitive layouts.
- Never position essential text over an uncontrolled mobile image crop.
- At 400% zoom, layouts reflow to a single column without two-dimensional scrolling, except genuine data tables.

