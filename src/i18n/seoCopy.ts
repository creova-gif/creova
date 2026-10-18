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
export const FR_TITLE_SUFFIX = 'CREOVA — Agence créative';

export const SEO_FR: Record<string, SeoCopy> = {
  '/': {
    title: 'Agence créative dirigée par des personnes BIPOC en Ontario',
    description:
      "CREOVA est une agence créative dirigée par des personnes BIPOC offrant photographie, vidéographie, image de marque et gestion des médias sociaux partout en Ontario et au Canada.",
  },
  '/work': {
    title: 'Nos réalisations',
    description:
      "Découvrez le portfolio de CREOVA : photographie, vidéographie, image de marque et campagnes créatives pour les entrepreneurs BIPOC et les marques culturelles du Canada.",
  },
  '/services': {
    title: 'Services créatifs',
    description:
      "Photographie, vidéographie, image de marque, gestion des médias sociaux et couverture d'événements pour les entrepreneurs et marques BIPOC partout en Ontario.",
  },
  '/community': {
    title: 'Communauté',
    description:
      "Rejoignez la communauté CREOVA — un espace pour les créatifs, entrepreneurs et conteurs culturels BIPOC du Canada. Connectez-vous, collaborez et grandissez.",
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
  '/seen': {
    title: 'SEEN — Plateforme de narration multilingue',
    description:
      "SEEN est un produit numérique de narration multilingue de CREOVA, actuellement en développement vers une cible bêta en décembre 2026.",
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
