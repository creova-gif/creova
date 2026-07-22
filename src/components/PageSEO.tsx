import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';
import { localeFromPath, stripLocale, absoluteUrl } from '../i18n/locale';

const SITE_URL = 'https://creova.ca';
const DEFAULT_OG_IMAGE = `${SITE_URL}/card-blackprint.jpg`;

interface PageSEOProps {
  title: string;
  description: string;
  /** Path only, e.g. "/services" — used to build the canonical URL and og:url. */
  path: string;
  ogImage?: string;
  /** 'website' for most pages, 'product' for shop/digital-product listings. */
  ogType?: 'website' | 'product';
  /** Set for pages that should never appear in search results (admin, auth, checkout, order/payment states). */
  noIndex?: boolean;
  /** One or more schema.org objects to emit as JSON-LD <script> tags. */
  jsonLd?: object | object[];
}

export function PageSEO({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
  jsonLd,
}: PageSEOProps) {
  const fullTitle = `${title} | CREOVA — Creative Agency`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  // `path` is authored unprefixed (e.g. "/services"). The locale comes from the
  // URL, so the same component yields /services and /fr/services correctly.
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const barePath = stripLocale(path);

  const canonicalUrl = absoluteUrl(barePath, locale, SITE_URL);
  const enUrl = absoluteUrl(barePath, 'en', SITE_URL);
  const frUrl = absoluteUrl(barePath, 'fr', SITE_URL);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />

      {/*
        hreflang lets Google serve the right language and stops the two
        versions competing as duplicates. Omitted on noindex pages, which have
        no French counterpart.
      */}
      {!noIndex && <link rel="alternate" hrefLang="en" href={enUrl} />}
      {!noIndex && <link rel="alternate" hrefLang="fr" href={frUrl} />}
      {!noIndex && <link rel="alternate" hrefLang="x-default" href={enUrl} />}

      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="CREOVA" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
