/**
 * Case studies — deep-dive proof pages. Data-driven like the other surfaces
 * (routing/prerender/sitemap read from here). Grounded in real partnerships;
 * no invented metrics. A `quote` is only rendered if present, so leave it out
 * until you have the client's real words.
 */

export interface CaseStudyCopy {
  title: string;
  kicker: string;
  metaDescription: string;
  overview: string;
  scope: { label: string; detail: string }[];
  body: string[];
  resultLabel: string;
  result: string;
  /** Optional real client quote. Omit until you have their actual words. */
  quote?: { text: string; name: string; role: string };
}

export interface CaseStudy {
  slug: string;              // lives at /work/<slug>
  partner: string;
  org: string;
  cover: string;            // public path
  featureImage: string;     // public path (the person/feature)
  featureName: string;
  featureRoleEn: string;
  featureRoleFr: string;
  en: CaseStudyCopy;
  fr: CaseStudyCopy;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'black-student-success-centre',
    partner: 'Black Student Success Centre',
    org: 'Brock University',
    cover: '/card-bssc.jpg',
    featureImage: '/photo-monique-bssc.jpg',
    featureName: 'Monique Beauregard',
    featureRoleEn: 'Black Student Success Centre',
    featureRoleFr: 'Black Student Success Centre',
    en: {
      title: 'Documenting Black student life at Brock',
      kicker: 'Case Study · BSSC × CREOVA',
      metaDescription:
        'CREOVA photography and documentation for Black student life and cultural programming connected with Brock University’s Black Student Success Centre.',
      overview:
        'CREOVA has photographed and documented Black student life and cultural programming connected with Brock University’s Black Student Success Centre. The work was created for immediate event storytelling and for continued use across social, promotional, community and institutional communications.',
      scope: [
        { label: 'Event photography', detail: 'Cultural nights, showcases, and closing sessions, captured as they happen.' },
        { label: 'Videography', detail: 'Recaps and promotional video that carry the energy of the room.' },
        { label: 'Graphic design', detail: 'Event graphics and promotional material that match the moment.' },
        { label: 'Portraits & content', detail: 'A steady library of images for social, recaps and reporting.' },
      ],
      body: [
        'The work spans cultural gatherings and Black History Month programming, with an emphasis on the people, energy and details that make each event distinct.',
        'Selected images have appeared in public social content and can support longer-lived documentation, reporting and promotional needs. That reuse is part of the value of building an intentional visual record rather than treating each event as a one-off post.',
        'This case study is limited to source-linked public evidence. It does not publish private project details, performance claims or a testimonial without separate permission.',
      ],
      resultLabel: 'The result',
      result:
        'A reusable visual record of Black student and community programming, with selected work continuing into social, promotional and institutional storytelling.',
    },
    fr: {
      title: 'Documenter la vie étudiante noire à Brock',
      kicker: 'Étude de cas · BSSC × CREOVA',
      metaDescription:
        'Photographie et documentation par CREOVA de la vie étudiante noire et de programmes culturels liés au Black Student Success Centre de l’Université Brock.',
      overview:
        'CREOVA a photographié et documenté la vie étudiante noire et des programmes culturels liés au Black Student Success Centre de l’Université Brock. Le travail a été conçu pour le récit immédiat des événements et pour une utilisation continue dans les communications sociales, promotionnelles, communautaires et institutionnelles.',
      scope: [
        { label: 'Photographie d’événement', detail: 'Soirées culturelles, vitrines et séances de clôture, captées sur le vif.' },
        { label: 'Vidéographie', detail: 'Récapitulatifs et vidéos promotionnelles qui portent l’énergie de la salle.' },
        { label: 'Design graphique', detail: 'Visuels d’événements et matériel promotionnel à la hauteur du moment.' },
        { label: 'Portraits et contenu', detail: 'Une bibliothèque d’images pour les réseaux, les bilans et les rapports.' },
      ],
      body: [
        'Le travail couvre des rassemblements culturels et des activités du Mois de l’histoire des Noirs, en mettant l’accent sur les personnes, l’énergie et les détails propres à chaque événement.',
        'Certaines images ont paru dans du contenu social public et peuvent soutenir des besoins de documentation, de rapport et de promotion à plus long terme. Cette réutilisation fait partie de la valeur d’une archive visuelle intentionnelle.',
        'Cette étude de cas se limite aux preuves publiques liées à des sources. Elle ne publie ni détails privés, ni résultats non vérifiés, ni témoignage sans autorisation distincte.',
      ],
      resultLabel: 'Le résultat',
      result:
        'Une archive visuelle réutilisable de programmes étudiants noirs et communautaires, dont une sélection continue de soutenir des communications sociales, promotionnelles et institutionnelles.',
    },
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
