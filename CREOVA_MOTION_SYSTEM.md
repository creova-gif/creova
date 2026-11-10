# CREOVA Motion System

## Principle

Motion should guide attention, reveal structure, or confirm a state. The default page must remain understandable before animation begins.

## Timing

| Use | Duration | Easing |
| --- | ---: | --- |
| Hover/focus state | 120–180ms | ease-out |
| Small reveal | 240–400ms | cubic-bezier(0.22, 1, 0.36, 1) |
| Hero image settle | 900–1600ms | cubic-bezier(0.22, 1, 0.36, 1) |
| Page transition | 180–300ms | ease-out |

## Approved patterns

- One subtle hero image settle from 1.02–1.04 scale to 1.
- Section reveal from opacity 0.85 and translateY 12–20px.
- Directional arrow movement of 2–4px on hover/focus.
- Filter results crossfade while preserving layout height.

## Avoid

- Continuous floating decoration.
- Parallax that disconnects the image from scroll position.
- Hidden-at-rest essential content.
- Simultaneous scale, blur, rotation, and translation.
- Smooth-scroll libraries that replace native scrolling.

## Reduced motion

Under `prefers-reduced-motion: reduce`:

- Disable transforms, parallax, marquees, and animated scrolling.
- Render all content at final opacity and position.
- Retain instant state changes and essential progress indicators.
- Never remove information when motion is disabled.

