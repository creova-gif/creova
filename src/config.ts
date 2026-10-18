/**
 * Site-wide external links, in one place so they're easy to keep correct.
 *
 * ⚠️ GOOGLE_REVIEW_URL is a PLACEHOLDER. Replace it with CREOVA's real
 * "leave a review" link from the Google Business Profile:
 *   Business Profile → Read reviews / Ask for reviews → "Get more reviews"
 *   → copy the short link (looks like https://g.page/r/XXXXXXXXXXXX/review
 *   or https://search.google.com/local/writereview?placeid=ChIJ...).
 * Until this is the real link, the review buttons won't open the form.
 */
export const GOOGLE_REVIEW_URL = 'https://g.page/r/creova/review';

/**
 * SEEN and VERSE are separate web properties. Their public destinations are
 * deployment configuration rather than CREOVA routes so neither venture is
 * accidentally coupled to this site's URL structure.
 *
 * Only absolute HTTPS URLs are accepted. An unset or invalid value keeps the
 * CREOVA venture card in a truthful "site coming later" state.
 */
function publicVentureUrl(value: string | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

export const VENTURE_URLS = {
  seen: publicVentureUrl(import.meta.env.VITE_SEEN_SITE_URL),
  verse: publicVentureUrl(import.meta.env.VITE_VERSE_SITE_URL),
} as const;
