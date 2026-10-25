/**
 * Service-area landing pages — the organic-search engine.
 *
 * Each entry is a genuinely distinct page (unique intro, local context, FAQs,
 * service context and portfolio filter) targeting one high-intent "service + place"
 * query CREOVA can honestly rank for. These are NOT thin doorway pages: the
 * copy is specific to the service and the community, grounded in real work
 * (Brock University, the Black Student Success Centre, the Niagara Region) and
 * public evidence. Add or edit entries here; routing, prerendering,
 * the sitemap and footer links all read from this list.
 */

export interface ServiceAreaFAQ {
  q: string;
  a: string;
}

export interface ServiceAreaCopy {
  title: string;        // <title> (PageSEO adds the CREOVA suffix)
  description: string;  // meta description
  h1: string;
  kicker: string;       // eyebrow
  intro: string;        // lead paragraph (unique per page)
  included: string[];   // "what's included" bullets
  localContext: string; // a paragraph specific to the place/community
  faqs: ServiceAreaFAQ[];
}

export interface ServiceArea {
  slug: string;
  /** Portfolio category to surface (matches gallery.category), or null. */
  galleryCategory: 'events' | 'sports' | 'brand' | 'conference' | null;
  serviceLabel: string; // short label for internal links / breadcrumb
  en: ServiceAreaCopy;
  fr: ServiceAreaCopy;
}

export const SERVICE_AREAS: ServiceArea[] = [
  {
    slug: 'event-photography-niagara',
    galleryCategory: 'events',
    serviceLabel: 'Event Photography',
    en: {
      title: 'Event Photography in Niagara Region',
      description:
        'Event photography across St. Catharines, Niagara Falls and Welland. CREOVA covers cultural celebrations, galas, conferences and community nights for BIPOC-led organizations in the Niagara Region.',
      kicker: 'Niagara Region · Event Photography',
      h1: 'Event Photography in the Niagara Region',
      intro:
        'From cultural celebrations at Brock University to community galas across St. Catharines, Niagara Falls and Welland, CREOVA photographs the moments that matter to the people who make them. We shoot fast, move quietly through a room, and hand back images that feel like the night actually felt.',
      included: [
        'Full-event coverage with a documentary eye — candids, key moments, and the room',
        'Colour-corrected, hand-edited gallery delivered on Pixieset within days',
        'Usage rights for social, press and sponsor recaps',
        'Second shooter available for large multi-room events',
      ],
      localContext:
        'We are based in the Niagara Region and have covered events for Brock University, the Black Student Success Centre and BIPOC-led community groups across the peninsula. That means we already know the venues, the light, and how to make a Niagara crowd look as good as it feels.',
      faqs: [
        { q: 'How is event storytelling scoped?', a: 'We scope each engagement around the event, intended audience, coverage needs, usage rights, delivery plan and required team. Share those details for a proposal.' },
        { q: 'How fast do we get the photos?', a: 'A curated preview goes out within 48 hours and the full edited gallery is typically delivered within one week.' },
        { q: 'Do you travel across the Niagara Region?', a: 'Yes — St. Catharines, Niagara Falls, Welland, Thorold and the surrounding area are all covered, and we travel further across Ontario for larger engagements.' },
      ],
    },
    fr: {
      title: 'Photographie d’événements dans la région de Niagara',
      description:
        'Photographie d’événements à St. Catharines, Niagara Falls et Welland. CREOVA couvre célébrations culturelles, galas, conférences et soirées communautaires pour les organisations dirigées par des BIPOC.',
      kicker: 'Région de Niagara · Photographie d’événements',
      h1: 'Photographie d’événements dans la région de Niagara',
      intro:
        'Des célébrations culturelles à l’Université Brock aux galas communautaires à St. Catharines, Niagara Falls et Welland, CREOVA photographie les moments qui comptent pour ceux qui les créent. On travaille vite, discrètement, et on remet des images fidèles à l’ambiance de la soirée.',
      included: [
        'Couverture complète au regard documentaire — candides, moments clés et ambiance',
        'Galerie éditée à la main, corrigée et livrée sur Pixieset en quelques jours',
        'Droits d’utilisation pour réseaux sociaux, presse et bilans de commanditaires',
        'Second photographe disponible pour les grands événements',
      ],
      localContext:
        'Basés dans la région de Niagara, nous avons couvert des événements pour l’Université Brock, le Black Student Success Centre et des groupes communautaires BIPOC de toute la péninsule. On connaît déjà les lieux et la lumière.',
      faqs: [
        { q: 'Comment le mandat est-il défini ?', a: 'Chaque mandat tient compte de l’événement, du public, de la couverture, des droits d’usage, de la livraison et de l’équipe requise. Partagez ces détails pour recevoir une proposition.' },
        { q: 'En combien de temps reçoit-on les photos ?', a: 'Un aperçu sort en 48 heures et la galerie complète est généralement livrée en une semaine.' },
        { q: 'Vous déplacez-vous dans la région ?', a: 'Oui — St. Catharines, Niagara Falls, Welland, Thorold et les environs, et plus loin en Ontario pour les mandats importants.' },
      ],
    },
  },

  {
    slug: 'videography-niagara',
    galleryCategory: null,
    serviceLabel: 'Videography',
    en: {
      title: 'Videography & Video Production in Niagara',
      description:
        'Cinematic videography in the Niagara Region — brand films, event recaps, social reels and interviews for BIPOC-led businesses and organizations across St. Catharines and beyond.',
      kicker: 'Niagara Region · Videography',
      h1: 'Videography & Video Production in Niagara',
      intro:
        'Video is how a brand gets remembered. CREOVA produces cinematic brand films, event recaps, founder interviews and short-form social reels for organizations across the Niagara Region — story-first work that looks expensive and travels well on a phone screen.',
      included: [
        'Concept, shoot and edit handled end-to-end by one team',
        'Cinematic 4K capture, colour grading and licensed music',
        'Vertical social cut-downs delivered alongside the master edit',
        'Aerial / drone coverage available as an add-on',
      ],
      localContext:
        'We produce video across St. Catharines, Niagara Falls and Welland, and have filmed at Brock University and community venues throughout the region. Local means faster scouting, easier reshoots, and a crew that already knows the room.',
      faqs: [
        { q: 'How is a video project scoped?', a: 'Scope depends on the story, intended use, production days, locations, participants, edit requirements, rights and delivery schedule. We quote after those details are clear.' },
        { q: 'Do you deliver social-ready vertical cuts?', a: 'Yes. Every project includes vertical (9:16) cut-downs for Reels, TikTok and Shorts alongside the main horizontal edit.' },
        { q: 'Can aerial footage be included?', a: 'Where the location, permissions, weather and project needs allow it, aerial capture can be considered during scoping.' },
      ],
    },
    fr: {
      title: 'Vidéographie et production vidéo à Niagara',
      description:
        'Vidéographie cinématographique dans la région de Niagara — films de marque, récapitulatifs d’événements, reels et entrevues pour les entreprises dirigées par des BIPOC.',
      kicker: 'Région de Niagara · Vidéographie',
      h1: 'Vidéographie et production vidéo à Niagara',
      intro:
        'La vidéo, c’est ce dont on se souvient. CREOVA produit des films de marque, des récapitulatifs d’événements, des entrevues de fondateurs et des reels courts pour les organisations de la région de Niagara — un travail axé sur le récit, au rendu haut de gamme.',
      included: [
        'Concept, tournage et montage gérés de bout en bout par une seule équipe',
        'Captation 4K cinématographique, étalonnage et musique sous licence',
        'Versions verticales pour les réseaux livrées avec le montage principal',
        'Couverture aérienne / drone disponible en option',
      ],
      localContext:
        'Nous produisons de la vidéo à St. Catharines, Niagara Falls et Welland, et avons filmé à l’Université Brock et dans des lieux communautaires de toute la région.',
      faqs: [
        { q: 'Comment un projet vidéo est-il défini ?', a: 'Le mandat dépend du récit, de l’usage prévu, des jours de production, des lieux, des personnes, du montage, des droits et du calendrier de livraison.' },
        { q: 'Livrez-vous des versions verticales ?', a: 'Oui. Chaque projet inclut des versions verticales (9:16) pour Reels, TikTok et Shorts, en plus du montage horizontal.' },
        { q: 'Peut-on inclure des prises aériennes ?', a: 'Lorsque le lieu, les autorisations, la météo et le mandat le permettent, la captation aérienne peut être considérée pendant le cadrage.' },
      ],
    },
  },

  {
    slug: 'brand-photography-st-catharines',
    galleryCategory: 'brand',
    serviceLabel: 'Brand Photography',
    en: {
      title: 'Brand Photography in St. Catharines',
      description:
        'Brand & content photography in St. Catharines for founders, small businesses and BIPOC-led brands — headshots, product, and a library of on-brand content built around Brock University and downtown.',
      kicker: 'St. Catharines · Brand Photography',
      h1: 'Brand Photography in St. Catharines',
      intro:
        'Great brands run out of good photos long before they run out of ideas. CREOVA builds founders and small businesses in St. Catharines a library of on-brand imagery — headshots, product, behind-the-scenes and lifestyle — shot in a single session and designed to feed a whole quarter of content.',
      included: [
        'Pre-shoot brand direction so every frame is on-message',
        'Headshots, product and lifestyle content in one session',
        'A batch of edited images sized for web, social and print',
        'Optional monthly content retainer to stay stocked',
      ],
      localContext:
        'St. Catharines is home base — from the Brock University campus to the downtown core, we know where the good light and the right backdrops are. That local knowledge keeps sessions efficient and keeps your brand looking like it belongs here.',
      faqs: [
        { q: 'What can a brand photography engagement include?', a: 'A scoped engagement can combine portraits, product, environment and lifestyle imagery, with pre-production direction tied to the intended story and channels.' },
        { q: 'Can you support recurring content needs?', a: 'Yes. Recurring needs can be structured as an ongoing storytelling partnership with an agreed cadence, priorities and asset plan.' },
        { q: 'Do you photograph products as well as people?', a: 'Both. A single session can mix founder headshots, team photos, product and lifestyle so you leave with a full content library.' },
      ],
    },
    fr: {
      title: 'Photographie de marque à St. Catharines',
      description:
        'Photographie de marque et de contenu à St. Catharines pour fondateurs, petites entreprises et marques dirigées par des BIPOC — portraits, produits et bibliothèque de contenu.',
      kicker: 'St. Catharines · Photographie de marque',
      h1: 'Photographie de marque à St. Catharines',
      intro:
        'Les bonnes marques manquent de photos bien avant de manquer d’idées. CREOVA bâtit aux fondateurs et petites entreprises de St. Catharines une bibliothèque d’images — portraits, produits, coulisses et style de vie — captées en une séance et pensées pour nourrir tout un trimestre de contenu.',
      included: [
        'Direction de marque avant la séance pour des images alignées',
        'Portraits, produits et contenu lifestyle en une seule séance',
        'Un lot d’images éditées, dimensionnées pour le web, les réseaux et l’imprimé',
        'Forfait de contenu mensuel optionnel',
      ],
      localContext:
        'St. Catharines, c’est notre base — du campus de l’Université Brock au centre-ville, on sait où trouver la bonne lumière et les bons décors.',
      faqs: [
        { q: 'Que peut inclure un mandat de photographie de marque ?', a: 'Un mandat défini peut réunir portraits, produits, lieux et images lifestyle, avec une direction de préproduction liée au récit et aux canaux prévus.' },
        { q: 'Pouvez-vous soutenir des besoins récurrents ?', a: 'Oui. Les besoins récurrents peuvent devenir un partenariat narratif continu avec une cadence, des priorités et un plan d’actifs convenus.' },
        { q: 'Photographiez-vous aussi les produits ?', a: 'Les deux. Une séance peut combiner portraits, équipe, produits et lifestyle.' },
      ],
    },
  },

  {
    slug: 'bipoc-creative-agency-ontario',
    galleryCategory: null,
    serviceLabel: 'BIPOC Creative Agency',
    en: {
      title: 'BIPOC-Led Cultural Storytelling Studio in Ontario',
      description:
        'CREOVA is a BIPOC-led cultural storytelling studio in Ontario helping organizations turn events, programs and community initiatives into useful stories.',
      kicker: 'Ontario · BIPOC-Led Storytelling Studio',
      h1: 'A BIPOC-Led Cultural Storytelling Studio in Ontario',
      intro:
        'CREOVA is a Black-owned creative studio built on a simple idea: the communities that shape culture deserve to be photographed and filmed like they matter. We partner with BIPOC-led organizations, founders and events across Ontario to make photography, video and brand work that carries the weight of the story behind it.',
      included: [
        'Narrative strategy, photography, video and editorial assets in one engagement',
        'A team that reflects and understands the communities we shoot',
        'Work delivered in English and French',
        'A scope built around the intended outcome, audience and use',
      ],
      localContext:
        'Rooted in the Niagara Region and working across Ontario, CREOVA has documented culture from Brock University to community centres and cultural nights — including partnerships with the Black Student Success Centre. When representation is the point, having a studio that lives it is not a nice-to-have.',
      faqs: [
        { q: 'What does CREOVA do?', a: 'CREOVA develops cultural storytelling systems for events, campaigns, community programs and ongoing organizational communications.' },
        { q: 'Where are you based?', a: 'We are based in the Niagara Region of Ontario and work across the province, with bilingual (EN/FR) delivery.' },
        { q: 'Do you only work with BIPOC clients?', a: 'Our focus and heart are with BIPOC-led communities, but we partner with any organization that shares those values and wants work made with that care.' },
      ],
    },
    fr: {
      title: 'Studio de narration culturelle dirigé par des BIPOC en Ontario',
      description:
        'CREOVA est un studio de narration culturelle dirigé par des BIPOC en Ontario qui aide les organisations à prolonger la valeur de leurs événements, programmes et initiatives communautaires.',
      kicker: 'Ontario · Studio de narration dirigé par des BIPOC',
      h1: 'Un studio de narration culturelle dirigé par des BIPOC en Ontario',
      intro:
        'CREOVA est un studio créatif appartenant à des Noirs, bâti sur une idée simple : les communautés qui façonnent la culture méritent d’être photographiées et filmées à leur juste valeur. Nous collaborons avec des organisations, fondateurs et événements dirigés par des BIPOC partout en Ontario.',
      included: [
        'Stratégie narrative, photographie, vidéo et actifs éditoriaux dans un même mandat',
        'Une équipe qui reflète et comprend les communautés qu’elle capte',
        'Travail livré en anglais et en français',
        'Un mandat défini selon le résultat, le public et les usages prévus',
      ],
      localContext:
        'Enracinée dans la région de Niagara et active partout en Ontario, CREOVA a documenté la culture de l’Université Brock aux centres communautaires — dont des partenariats avec le Black Student Success Centre.',
      faqs: [
        { q: 'Que fait CREOVA ?', a: 'CREOVA développe des systèmes narratifs culturels pour les événements, les campagnes, les programmes communautaires et les communications organisationnelles continues.' },
        { q: 'Où êtes-vous situés ?', a: 'Dans la région de Niagara, en Ontario, avec un service bilingue (EN/FR) partout dans la province.' },
        { q: 'Travaillez-vous seulement avec des clients BIPOC ?', a: 'Notre cœur est avec les communautés BIPOC, mais nous collaborons avec toute organisation qui partage ces valeurs.' },
      ],
    },
  },

  {
    slug: 'graduation-photography-brock-university',
    galleryCategory: 'events',
    serviceLabel: 'Grad & Campus Photography',
    en: {
      title: 'Graduation & Campus Photography — Brock University',
      description:
        'Graduation and campus photography for Brock University students, clubs and cultural groups in St. Catharines — grad portraits, club events and cultural nights, shot by a studio that knows the campus.',
      kicker: 'Brock University · Grad & Campus',
      h1: 'Graduation & Campus Photography at Brock University',
      intro:
        'Four years is worth more than a phone photo in a gown. CREOVA shoots graduation portraits, club events and cultural nights for Brock University students and student groups in St. Catharines — the kind of images you actually print, post, and send home to family.',
      included: [
        'Individual and group grad portraits on and around campus',
        'Coverage for club events, showcases and cultural nights',
        'Quick-turnaround galleries timed to convocation and socials',
        'Group rates for clubs, associations and student cohorts',
      ],
      localContext:
        'We work with student groups on the Brock campus and have partnered with the Black Student Success Centre on cultural programming and events. We know the spots — the atrium, the LINC, the campus greens — where grad photos actually look great.',
      faqs: [
        { q: 'Can you work with clubs and cohorts?', a: 'Yes. Share the headcount, date, intended use and required coverage so a group engagement can be scoped appropriately.' },
        { q: 'How quickly are grad photos ready?', a: 'We time delivery to convocation and end-of-term socials, with a preview within 48 hours and the full gallery within about a week.' },
        { q: 'Can you cover a cultural night or showcase?', a: 'Yes. Share the event context, audience, schedule, intended uses and coverage needs so the right engagement can be scoped.' },
      ],
    },
    fr: {
      title: 'Photographie de graduation et de campus — Université Brock',
      description:
        'Photographie de graduation et de campus pour les étudiants, clubs et groupes culturels de l’Université Brock à St. Catharines — portraits de finissants, événements de clubs et soirées culturelles.',
      kicker: 'Université Brock · Graduation et campus',
      h1: 'Photographie de graduation et de campus à l’Université Brock',
      intro:
        'Quatre années valent mieux qu’une photo de téléphone en toge. CREOVA photographie les finissants, événements de clubs et soirées culturelles des étudiants de l’Université Brock à St. Catharines — des images qu’on imprime, qu’on partage et qu’on envoie à la famille.',
      included: [
        'Portraits de finissants individuels et de groupe sur le campus',
        'Couverture d’événements de clubs, vitrines et soirées culturelles',
        'Galeries à livraison rapide, synchronisées avec la collation des grades',
        'Tarifs de groupe pour clubs, associations et cohortes',
      ],
      localContext:
        'Nous travaillons avec des groupes étudiants sur le campus de Brock et avons collaboré avec le Black Student Success Centre. On connaît les meilleurs endroits — l’atrium, le LINC, les espaces verts.',
      faqs: [
        { q: 'Travaillez-vous avec les clubs et cohortes ?', a: 'Oui. Partagez le nombre de personnes, la date, l’usage prévu et la couverture requise afin de définir un mandat de groupe adapté.' },
        { q: 'Quand les photos sont-elles prêtes ?', a: 'Nous synchronisons la livraison avec la collation des grades : aperçu en 48 heures, galerie complète en une semaine environ.' },
        { q: 'Pouvez-vous couvrir une soirée culturelle ?', a: 'Oui. Partagez le contexte, le public, le calendrier, les usages prévus et les besoins de couverture afin de définir le bon mandat.' },
      ],
    },
  },
];

export function getServiceArea(slug: string): ServiceArea | undefined {
  return SERVICE_AREAS.find((a) => a.slug === slug);
}
