import { ArrowRight, ExternalLink } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { getPublishedEvidenceBySlug } from '../content/publicEvidence';
import { GALLERY_FALLBACK } from '../data/galleryFallback';
import { Link } from '../i18n/LocaleLink';
import logoBrock from '../assets/logo-brock-university.webp';
import logoBSSC from '../assets/logo-bssc.png';

const FEATURED_GALLERY_IDS = [
  'curated-community-bash',
  'curated-maslab-always-carnival',
  'curated-welcome-bash-2025',
];

interface FeaturedWorkRailProps {
  fr: boolean;
}

export function FeaturedWorkRail({ fr }: FeaturedWorkRailProps) {
  const reduceMotion = useReducedMotion();
  const evidence = getPublishedEvidenceBySlug('black-student-success-centre');
  const galleries = FEATURED_GALLERY_IDS.flatMap((id) => {
    const gallery = GALLERY_FALLBACK.find((item) => item.id === id);
    return gallery ? [gallery] : [];
  });

  if (!evidence || galleries.length === 0) return null;

  const copy = evidence.copy[fr ? 'fr' : 'en'];

  return (
    <section
      className="overflow-hidden py-20 lg:py-28"
      style={{ backgroundColor: '#F5F0E9' }}
      aria-labelledby="featured-work-title"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(18rem,.72fr)_minmax(0,1.28fr)] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs uppercase tracking-[.35em]" style={{ color: '#7D6D51' }}>
              {fr ? 'Travail public vérifié' : 'Verified public work'}
            </p>
            <h2
              id="featured-work-title"
              className="mt-5 text-4xl font-light leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl"
              style={{ color: '#2D1011' }}
            >
              {copy.title}
            </h2>
          </div>

          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-lg leading-relaxed" style={{ color: '#555555' }}>
              {copy.summary}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-5">
              <Link
                to="/work/black-student-success-centre"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
                style={{ backgroundColor: '#2D1011', color: '#FFFFFF' }}
              >
                {fr ? 'Lire l’étude de cas' : 'Read the case study'}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <div className="flex items-center gap-4" aria-label={fr ? 'Collaborateurs vérifiés' : 'Verified collaborators'}>
                <img src={logoBrock} alt="Brock University" className="h-9 w-auto object-contain" width="1188" height="720" />
                <img src={logoBSSC} alt="Black Student Success Centre" className="h-9 w-9 object-contain" width="1070" height="1074" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-[1.35fr_.85fr_.85fr]">
          {galleries.map((gallery, index) => (
            <motion.a
              key={gallery.id}
              href={gallery.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block min-h-[23rem] overflow-hidden rounded-[1.5rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7D6D51] md:min-h-[31rem]"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.62, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              aria-label={`${gallery.title}: ${fr ? 'ouvrir la galerie publique' : 'open public gallery'}`}
            >
              <img
                src={gallery.image}
                alt={`${gallery.title} — ${gallery.subtitle}`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035] group-focus-visible:scale-[1.035]"
                style={{ objectPosition: gallery.objectPosition }}
                width="1200"
                height="1600"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(45,16,17,.04) 24%, rgba(45,16,17,.88) 100%)' }} />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 text-white lg:p-7">
                <span>
                  <span className="block text-[10px] uppercase tracking-[.3em]" style={{ color: '#E4D49F' }}>
                    {gallery.subtitle}
                  </span>
                  <span className="mt-2 block text-xl font-medium leading-tight lg:text-2xl">{gallery.title}</span>
                  <span className="mt-2 block text-xs text-white/75">{gallery.org}</span>
                </span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/40 bg-[#2D1011]/40" aria-hidden="true">
                  <ExternalLink className="h-4 w-4" />
                </span>
              </div>
              <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-[#2D1011]/55 px-3 py-1.5 text-[9px] uppercase tracking-[.24em] text-white backdrop-blur-sm">
                0{index + 1}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
