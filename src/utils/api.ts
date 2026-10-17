/**
 * Browser and build-time base for the Cloudflare Worker API.
 *
 * Set VITE_API_BASE_URL to the Worker prefix, with no trailing slash:
 *   https://<name>.<account>.workers.dev/make-server-feacf0d8
 *
 * Vite inlines VITE_ variables at build time. An empty value is valid:
 * tracking and galleries stay quiet, and `npm run build` still prerenders.
 */
function readBase(): string {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (typeof raw !== 'string') return '';
  return raw.trim().replace(/\/+$/, '');
}

export function apiBaseUrl(): string {
  return readBase();
}

/** Absolute URL for a Worker path, or null when the API is unset. */
export function apiUrl(path: string): string | null {
  const base = readBase();
  if (!base) return null;
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}
