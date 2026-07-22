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
  '/pricing': {
    title: 'Tarifs',
    description:
      "Tarifs transparents pour la photographie, la vidéographie, l'image de marque, les médias sociaux et la couverture d'événements. Forfaits à partir de 450 $ en Ontario.",
  },
  '/shop': {
    title: 'Boutique — Capsule automne/hiver SEEN',
    description:
      "SEEN par CREOVA — collection capsule vol. 01 automne/hiver 2026. 14 styles de streetwear, chaussures et accessoires ancrés dans la culture. Précommandez maintenant, livraison en novembre 2026.",
  },
  '/shop/digital': {
    title: 'Produits numériques',
    description:
      "Gabarits, préréglages et outils haut de gamme pour les créatifs — kits de marque, gabarits pour médias sociaux, préréglages Lightroom, calendriers de contenu et plus encore. Lancement en novembre 2026.",
  },
  '/experience': {
    title: 'Expérience et événements',
    description:
      "Participez aux événements, ateliers et expériences créatives de CREOVA partout en Ontario. Collaborez avec des créatifs BIPOC et des conteurs culturels.",
  },
  '/community': {
    title: 'Communauté',
    description:
      "Rejoignez la communauté CREOVA — un espace pour les créatifs, entrepreneurs et conteurs culturels BIPOC du Canada. Connectez-vous, collaborez et grandissez.",
  },
  '/contact': {
    title: 'Nous joindre',
    description:
      "Communiquez avec CREOVA. Réservez une consultation, informez-vous sur nos services créatifs ou lancez dès aujourd'hui votre projet de photographie, vidéographie ou image de marque.",
  },
  '/booking': {
    title: 'Réserver une séance',
    description:
      "Réservez votre séance de photographie, vidéographie, image de marque ou médias sociaux avec CREOVA. Services créatifs professionnels en Ontario à partir de 450 $.",
  },
  '/rental': {
    title: "Location d'équipement",
    description:
      "Louez de l'équipement professionnel de photo et de vidéo chez CREOVA — caméras, objectifs, éclairage et matériel audio pour les créateurs de l'Ontario.",
  },
  '/seen': {
    title: 'SEEN — Plateforme de narration multilingue',
    description:
      "SEEN est la future plateforme de narration audio multilingue de CREOVA, célébrant les voix BIPOC et les récits culturels partout au Canada.",
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
