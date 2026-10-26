/**
 * French <head> copy, keyed by unprefixed path.
 *
 * Page components pass their English title/description to <PageSEO> inline.
 * Rather than thread `t()` through all fourteen of them, PageSEO looks the
 * French copy up here from the path it already receives. Anything missing
 * falls back to the English the page passed, so a gap degrades to an English
 * title rather than an empty one.
 *
 * Keep keys in sync with LOCALIZED_ROUTES in src/App.tsx.
 */
export interface SeoCopy {
  title: string;
  description: string;
}

/** Appended to every title. English form lives in PageSEO. */
export const FR_TITLE_SUFFIX = 'CREOVA — Studio de narration culturelle';

export const SEO_FR: Record<string, SeoCopy> = {
  '/': {
    title: 'Studio de narration culturelle en Ontario',
    description:
      "CREOVA aide les organisations culturelles et communautaires à transformer leurs événements et programmes en récits durables.",
  },
  '/work': {
    title: 'Nos réalisations',
    description:
      "Découvrez le portfolio de CREOVA : photographie, vidéographie, image de marque et campagnes créatives pour les entrepreneurs BIPOC et les marques culturelles du Canada.",
  },
  '/services': {
    title: 'Services de narration culturelle',
    description:
      "Trois façons de travailler avec CREOVA : événements, campagnes communautaires et partenariats narratifs continus.",
  },
  '/community': {
    title: 'Communauté et collaborations',
    description:
      "Mandater CREOVA, proposer une collaboration ou discuter d'un partenariat communautaire avec des attentes claires.",
  },
  '/resources': {
    title: 'Ressources créatives gratuites',
    description:
      'Des modèles, listes de contrôle et guides pratiques de CREOVA pour mieux préparer les projets créatifs et culturels.',
  },
  '/ventures': {
    title: 'Produits et marques en développement',
    description:
      'Découvrez SEEN, le produit numérique en développement de CREOVA, et VERSE, une marque lifestyle actuellement en incubation.',
  },
  '/start-a-project': {
    title: 'Démarrer un projet',
    description:
      'Présentez votre projet à CREOVA et recevez un identifiant de demande ainsi qu’une échéance de réponse claire.',
  },
  '/terms-of-service': {
    title: "Conditions d'utilisation",
    description:
      "Conditions d'utilisation des services de l'agence créative CREOVA, incluant la photographie, la vidéographie, l'image de marque et les produits numériques.",
  },
  '/privacy-policy': {
    title: 'Politique de confidentialité',
    description:
      "Politique de confidentialité de CREOVA — comment nous recueillons, utilisons et protégeons vos renseignements personnels sur notre site et nos services.",
  },
};
