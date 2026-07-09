import { Helmet } from 'react-helmet-async';

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
  const canonicalUrl = `${SITE_URL}${path === '/' ? '' : path}`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />

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
