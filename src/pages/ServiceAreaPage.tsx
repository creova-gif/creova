import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Check, MapPin } from 'lucide-react';
import { Link } from '../i18n/LocaleLink';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';
import { useGalleries } from '../hooks/useGalleries';
import { getServiceArea, SERVICE_AREAS } from '../data/serviceAreas';
import { EditorialHeroImage } from '../components/EditorialHeroImage';
import eventsSmall from '../assets/photo-service-events-800.webp';
import eventsLarge from '../assets/photo-service-events-1600.webp';
import videoSmall from '../assets/photo-service-videography-800.webp';
import videoLarge from '../assets/photo-service-videography-1600.webp';
import brandSmall from '../assets/photo-social-laptop-800.webp';
import brandLarge from '../assets/photo-social-laptop-1600.webp';
import communitySmall from '../assets/photo-community-convo-800.webp';
import communityLarge from '../assets/photo-community-convo-1400.webp';
import graduationSmall from '../assets/photo-welcome-bash-800.webp';
import graduationLarge from '../assets/photo-welcome-bash-1600.webp';

const SITE_URL = 'https://www.creova.one';

const SERVICE_HEROES: Record<string, { small: string; large: string; position: string }> = {
  'event-photography-niagara': { small: eventsSmall, large: eventsLarge, position: 'center 44%' },
  'videography-niagara': { small: videoSmall, large: videoLarge, position: 'center 45%' },
  'brand-photography-st-catharines': { small: brandSmall, large: brandLarge, position: 'center 42%' },
  'bipoc-creative-agency-ontario': { small: communitySmall, large: communityLarge, position: 'center 42%' },
  'graduation-photography-brock-university': { small: graduationSmall, large: graduationLarge, position: 'center 38%' },
};

export function ServiceAreaPage({ slug }: { slug: string }) {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const area = getServiceArea(slug);
  const { galleries } = useGalleries();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  if (!area) return null;
  const copy = fr ? area.fr : area.en;
  const hero = SERVICE_HEROES[slug] ?? SERVICE_HEROES['event-photography-niagara'];

  // Real portfolio, filtered to this service's category.
  const related = area.galleryCategory
    ? galleries.filter((g) => g.category === area.galleryCategory).slice(0, 3)
    : [];

  // Service + FAQPage structured data → eligible for rich results.
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: copy.h1,
      description: copy.description,
      serviceType: area.serviceLabel,
      areaServed: { '@type': 'AdministrativeArea', name: 'Niagara Region, Ontario' },
      provider: {
        '@type': 'ProfessionalService',
        name: 'CREOVA',
        url: `${SITE_URL}/`,
        email: 'support@creova.one',
        address: { '@type': 'PostalAddress', addressRegion: 'ON', addressCountry: 'CA', addressLocality: 'St. Catharines' },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: copy.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  // Cross-links to the other service-area pages (internal linking for SEO).
  const others = SERVICE_AREAS.filter((a) => a.slug !== slug).slice(0, 4);

  return (
    <div style={{ backgroundColor: '#2D1011' }}>
      <PageSEO title={copy.title} description={copy.description} path={`/${slug}`} jsonLd={jsonLd} />

      {/* Hero */}
      <section className="relative flex min-h-[68vh] items-end overflow-hidden" style={{ backgroundColor: '#2D1011' }}>
        <EditorialHeroImage
          src={hero.large}
          srcSet={`${hero.small} 800w, ${hero.large} 1600w`}
          objectPosition={hero.position}
          folio={`LOCAL SERVICE / ${area.serviceLabel.toUpperCase()}`}
          deep
        />
        <div ref={ref} className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-center gap-2.5 mb-6">
              <MapPin className="w-4 h-4" style={{ color: '#C6A45A' }} />
              <span className="text-xs tracking-[0.35em] uppercase" style={{ color: '#C6A45A' }}>{copy.kicker}</span>
            </div>
            <h1 className="tracking-tight mb-6" style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 6vw, 4.2rem)', lineHeight: 1.04 }}>
              {copy.h1}
            </h1>
            <p className="text-lg leading-relaxed mb-8" style={{ color: '#E0E0E0', maxWidth: '60ch' }}>{copy.intro}</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/start-a-project" className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 hover:-translate-y-px hover:shadow-lg" style={{ backgroundColor: '#7D6D51', color: '#FFFFFF' }}>
                {fr ? 'Réserver un appel' : 'Book a call'}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 text-sm tracking-wide transition-colors" style={{ color: '#E0E0E0' }}>
                {fr ? 'Voir notre approche' : 'See our approach'}
                <ArrowRight className="w-4 h-4" style={{ color: '#C6A45A' }} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What's included */}
      <section className="relative py-16 lg:py-20" style={{ backgroundColor: '#0E0E0E' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            <div>
              <h2 className="tracking-tight mb-6" style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3.5vw, 2.1rem)' }}>
                {fr ? 'Ce qui est inclus' : "What's included"}
              </h2>
              <ul className="space-y-3.5">
                {copy.included.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(198,164,90,0.15)' }}>
                      <Check className="w-3 h-3" style={{ color: '#C6A45A' }} />
                    </span>
                    <span className="text-base leading-relaxed" style={{ color: '#E0E0E0' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:border-l md:pl-12" style={{ borderColor: 'rgba(198,164,90,0.15)' }}>
              <h2 className="tracking-tight mb-6" style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3.5vw, 2.1rem)' }}>
                {fr ? 'Enraciné ici' : 'Rooted here'}
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#B8AAA4' }}>{copy.localContext}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio strip */}
      {related.length > 0 && (
        <section className="relative py-16 lg:py-20" style={{ backgroundColor: '#2D1011' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs tracking-[0.4em] uppercase mb-8" style={{ color: '#C6A45A' }}>{fr ? 'Travaux récents' : 'Recent work'}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((g) => (
                <a key={g.id} href={g.url} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-2xl" style={{ backgroundColor: '#0E0E0E', border: '1px solid rgba(198,164,90,0.14)' }}>
                  <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img src={g.image} alt={`${g.title} — ${g.subtitle}`} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: g.objectPosition }} width="1600" height="1200" />
                  </div>
                  <div className="p-5">
                    {g.org && <p className="text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: '#C6A45A' }}>{g.org}</p>}
                    <h3 className="text-lg tracking-tight" style={{ color: '#FFFFFF', fontWeight: 300 }}>{g.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="relative py-16 lg:py-24" style={{ backgroundColor: '#0E0E0E' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="tracking-tight mb-10" style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
            {fr ? 'Questions fréquentes' : 'Frequently asked'}
          </h2>
          <div className="divide-y" style={{ borderColor: 'rgba(198,164,90,0.12)' }}>
            {copy.faqs.map((f, i) => (
              <div key={i} className="py-6" style={{ borderColor: 'rgba(198,164,90,0.12)' }}>
                <h3 className="text-lg mb-2.5" style={{ color: '#FFFFFF', fontWeight: 500 }}>{f.q}</h3>
                <p className="leading-relaxed" style={{ color: '#B8AAA4' }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + internal links */}
      <section className="relative py-20 lg:py-28" style={{ backgroundColor: '#2D1011' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="tracking-tight mb-6" style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.06 }}>
            {fr ? 'Racontons votre histoire.' : "Let's tell your story."}
          </h2>
          <Link to="/start-a-project" className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-semibold tracking-wide transition-all duration-300 hover:-translate-y-px hover:shadow-xl" style={{ backgroundColor: '#7D6D51', color: '#FFFFFF' }}>
            {fr ? 'Réserver un appel' : 'Book a call'}
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <div className="mt-16 pt-10 border-t" style={{ borderColor: 'rgba(198,164,90,0.12)' }}>
            <p className="text-xs tracking-[0.35em] uppercase mb-5" style={{ color: '#B8AAA4' }}>{fr ? 'Explorer aussi' : 'Explore also'}</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
              {others.map((o) => (
                <Link key={o.slug} to={`/${o.slug}`} className="text-sm tracking-wide transition-colors duration-200 hover:text-[#C6A45A]" style={{ color: '#E0E0E0' }}>
                  {(fr ? o.fr : o.en).h1}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
