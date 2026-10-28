import { useMediaQuery } from './useMediaQuery';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Unlike motion/react's own useReducedMotion() — which only reads the OS
 * setting once at mount (see its source: a bare `useState(current)` with a
 * TODO acknowledging it doesn't live-update) — this subscribes to the media
 * query's change event, so components react if the user flips the setting
 * without reloading the page.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(QUERY);
}
