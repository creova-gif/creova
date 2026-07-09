const SITE_URL = 'https://creova.ca';

/**
 * CREOVA has no public storefront — it's a service-area business, so this
 * intentionally omits a street `address` rather than fabricate one.
 * See ContactPage: the only location info given anywhere is "Niagara, Ontario".
 */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'CREOVA',
  alternateName: 'CREOVA Creative Agency',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/card-blackprint.jpg`,
  description:
    "CREOVA is Ontario's Black-owned BIPOC creative agency offering professional photography, videography, brand management, event design, and social media services.",
  telephone: '+1-437-260-8925',
  email: 'support@creova.ca',
  areaServed: {
    '@type': 'Place',
    name: 'Niagara Region, Ontario, Canada',
  },
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
  sameAs: [
    'https://instagram.com/creova.ca',
    'https://www.linkedin.com/company/creovaspace/',
  ],
  priceRange: '$450-$950',
};

export function productSchema(product: {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/shop#${product.id}`,
      priceCurrency: 'CAD',
      price: product.price,
      availability: 'https://schema.org/PreOrder',
      seller: {
        '@type': 'Organization',
        name: 'CREOVA',
      },
    },
  };
}

export function productListSchema(
  products: Array<{ id: string; name: string; description: string; price: number; image: string; category?: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: productSchema(product),
    })),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
