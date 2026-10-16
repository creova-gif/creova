/**
 * URL-based locale scheme.
 *
 * English is served from bare paths (/services) and French from a /fr prefix
 * (/fr/services). English keeps the unprefixed URLs deliberately: those are the
 * ones already indexed and linked, so this change adds French URLs without
 * invalidating any existing ones.
 */
export const SUPPORTED_LOCALES = ['en', 'fr'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** The locale a pathname belongs to. */
export function localeFromPath(pathname: string): Locale {
  return pathname === '/fr' || pathname.startsWith('/fr/') ? 'fr' : 'en';
}

/** Strip any locale prefix, always returning a leading-slash path. */
export function stripLocale(pathname: string): string {
  if (pathname === '/fr') return '/';
  if (pathname.startsWith('/fr/')) return pathname.slice(3) || '/';
  return pathname || '/';
}

/**
 * Build the URL for `path` in `locale`. Accepts either a already-prefixed or a
 * bare path, so it is safe to apply more than once.
 */
export function withLocale(path: string, locale: Locale): string {
  // Leave absolute URLs, anchors, mailto: and tel: untouched.
  if (/^([a-z]+:|\/\/|#)/i.test(path)) return path;

  const [rawPath, ...rest] = path.split(/(?=[?#])/);
  const suffix = rest.join('');
  const bare = stripLocale(rawPath.startsWith('/') ? rawPath : `/${rawPath}`);

  if (locale === DEFAULT_LOCALE) return `${bare}${suffix}`;
  return `${bare === '/' ? '/fr' : `/fr${bare}`}${suffix}`;
}

/**
 * Absolute https URL for a path in a given locale — canonical, hreflang, og:url.
 *
 * GitHub Pages serves each prerendered route from `<route>/index.html`.
 * `/services` is a 301 to `/services/`, and `/services/` is the 200. The
 * homepage is `https://www.creova.one/` (apex `creova.one` 301s there).
 */
export function absoluteUrl(path: string, locale: Locale, siteUrl = 'https://www.creova.one'): string {
  const localized = withLocale(path, locale);
  if (/^([a-z]+:|\/\/)/i.test(localized)) return localized;

  const [rawPath, ...rest] = localized.split(/(?=[?#])/);
  const suffix = rest.join('');
  const pathname = rawPath === '/' || rawPath === ''
    ? '/'
    : (rawPath.endsWith('/') ? rawPath : `${rawPath}/`);
  return `${siteUrl}${pathname}${suffix}`;
}
