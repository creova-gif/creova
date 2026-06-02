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
