---
name: Asset performance
description: How the CREOVA home-page lag was diagnosed and fixed; what actually moved the needle.
---

# Home-page performance

The site "lagging" was almost entirely an 18MB `public/hero-reel.mp4` autoplaying
as a 0.45-opacity background on HomePage, plus ~30 uncompressed 300-560KB JPGs
loaded eagerly.

## Rule
For a background/loop video, trimming **duration** and downscaling resolution
beats lowering CRF.

**Why:** hero-reel.mp4 was already encoded at ~1Mbps, so re-encoding at CRF 30/32
barely changed the size — the file was big because it was 143s long. Trimming to
20s + scaling 1280→960 took it from 18MB to 1.36MB (~92%). The loop reads
identically since it's a low-opacity ambient background.

**How to apply:** If asked to speed up a page with a video, check duration and
bitrate first (`ffprobe`). If bitrate is already reasonable (~1Mbps), trim length
and/or downscale instead of fighting CRF. Keep `preload="metadata"` on background
video so it doesn't block first paint. Images: `loading="lazy"` + `decoding="async"`
live in `src/components/figma/ImageWithFallback.tsx`; bulk-compress JPGs with
`magick ... -resize "1600x1600>" -strip -quality 82`.

## Runtime jank (separate from load size)
After load size was fixed, perceived "lag" was runtime jank, not download. Two causes:
1. `FloatingOrbs` rendered on multiple sections = many large (up to 520px) blurred,
   infinitely-animating layers. Blurred + animating layers are the most GPU-expensive
   thing on a page. Now gated to `min-width:1024px` + not `prefers-reduced-motion`.
2. `hover:backdrop-blur-md` + `transition-all` animated backdrop blur every frame.
   Replaced with `transition-colors`/`transition-transform` so blur stays static.

**Why:** these dominate frame time on mobile/low-end devices even though they are
purely decorative.

## Dev preview vs production
The in-editor / canvas preview runs the Vite **dev** server (unminified, React dev
build, HMR). It is always far choppier than the published site. Judge performance on
the deployed domain (creova.one), not the workspace preview.

## "Feels laggy" flourishes — smooth scroll + custom cursor
Two premium-feel effects were the dominant cause of perceived lag (separate from
framerate): (1) Lenis smooth-scroll (`LenisProvider` in App.tsx) re-animated every
scroll via rAF — makes scrolling feel heavy/janky, worse with scroll-linked parallax;
(2) `CustomCursor` hid the native cursor (`cursor: none !important`) and replaced it
with spring-driven dot+ring that visibly trail the pointer. Both disabled (commented
out at their mount points, not deleted) to restore native scroll + cursor.

**Why:** trailing cursor and interpolated scroll feel laggy even at 60fps; they are
the first things to disable when a user reports general "lag" but the console/profiler
is clean. Easily reversible by un-commenting.
