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

export const SEO_FR: Record<string, SeoCopy> = {
  '/': {
    title: 'Studio de narration culturelle en Ontario',
    description:
      'CREOVA est un studio ontarien de narration culturelle créant photos, vidéos et récits pour les événements, programmes communautaires et organisations.',
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
    title: 'Collaborations et partenariats communautaires',
    description:
      'Mandater CREOVA, proposer une collaboration ou discuter d’un partenariat communautaire avec des rôles, des attentes et des prochaines étapes clairs.',
  },
  '/resources': {
    title: 'Ressources gratuites pour raconter vos projets',
    description:
      'Des modèles, listes de contrôle et guides gratuits de CREOVA pour préparer des événements, entrevues communautaires et projets de narration culturelle.',
  },
  '/ventures': {
    title: 'Produits et marques en développement',
    description:
      'Découvrez SEEN, le produit numérique en développement de CREOVA, et le site public de VERSE, une marque lifestyle en développement.',
  },
  '/start-a-project': {
    title: 'Démarrer un projet de narration culturelle',
    description:
      'Présentez à CREOVA votre événement, campagne, programme communautaire ou besoin de partenariat narratif.',
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
