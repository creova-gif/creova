import { Helmet } from 'react-helmet-async';

interface PageSEOProps {
  title: string;
  description: string;
  ogImage?: string;
}

const DEFAULT_OG_IMAGE = 'https://creova.ca/card-blackprint.jpg';

export function PageSEO({ title, description, ogImage = DEFAULT_OG_IMAGE }: PageSEOProps) {
  const fullTitle = `${title} | CREOVA — Creative Agency`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
