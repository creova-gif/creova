import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check, MapPin } from 'lucide-react';
import { Link } from '../i18n/LocaleLink';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';
import { useGalleries } from '../hooks/useGalleries';
import { getServiceArea, SERVICE_AREAS } from '../data/serviceAreas';

const SITE_URL = 'https://www.creova.one';

export function ServiceAreaPage({ slug }: { slug: string }) {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const area = getServiceArea(slug);
  const { galleries } = useGalleries();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  if (!area) return null;
  const copy = fr ? area.fr : area.en;

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
        telephone: '+1-437-260-8925',
        email: 'support@creova.one',
        address: { '@type': 'PostalAddress', addressRegion: 'ON', addressCountry: 'CA', addressLocality: 'St. Catharines' },
      },
      offers: { '@type': 'Offer', priceCurrency: 'CAD', price: area.price.replace(/[^0-9]/g, '') },
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
    <div style={{ backgroundColor: '#121212' }}>
      <PageSEO title={copy.title} description={copy.description} path={`/${slug}`} jsonLd={jsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#121212' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 50% at 15% 0%, rgba(212,168,67,0.10) 0%, transparent 55%), radial-gradient(ellipse 50% 50% at 90% 100%, rgba(177,100,59,0.07) 0%, transparent 55%)',
        }} />
        <div ref={ref} className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-center gap-2.5 mb-6">
              <MapPin className="w-4 h-4" style={{ color: '#D4A843' }} />
              <span className="text-xs tracking-[0.35em] uppercase" style={{ color: '#D4A843' }}>{copy.kicker}</span>
            </div>
            <h1 className="tracking-tight mb-6" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 6vw, 4.2rem)', lineHeight: 1.04 }}>
              {copy.h1}
            </h1>
            <p className="text-lg leading-relaxed mb-8" style={{ color: '#E0E0E0', maxWidth: '60ch' }}>{copy.intro}</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/contact" className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 hover:-translate-y-px hover:shadow-lg" style={{ backgroundColor: '#B1643B', color: '#F8F9FA' }}>
                {fr ? 'Réserver un appel' : 'Book a call'}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link to="/pricing" className="inline-flex items-center gap-2 text-sm tracking-wide transition-colors" style={{ color: '#E0E0E0' }}>
                {area.price} · {fr ? 'voir les tarifs' : 'see pricing'}
                <ArrowUpRight className="w-4 h-4" style={{ color: '#D4A843' }} />
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
              <h2 className="tracking-tight mb-6" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3.5vw, 2.1rem)' }}>
                {fr ? 'Ce qui est inclus' : "What's included"}
              </h2>
              <ul className="space-y-3.5">
                {copy.included.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(212,168,67,0.15)' }}>
                      <Check className="w-3 h-3" style={{ color: '#D4A843' }} />
                    </span>
                    <span className="text-base leading-relaxed" style={{ color: '#E0E0E0' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:border-l md:pl-12" style={{ borderColor: 'rgba(212,168,67,0.15)' }}>
              <h2 className="tracking-tight mb-6" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3.5vw, 2.1rem)' }}>
                {fr ? 'Enraciné ici' : 'Rooted here'}
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#8C7B75' }}>{copy.localContext}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio strip */}
      {related.length > 0 && (
        <section className="relative py-16 lg:py-20" style={{ backgroundColor: '#121212' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs tracking-[0.4em] uppercase mb-8" style={{ color: '#D4A843' }}>{fr ? 'Travaux récents' : 'Recent work'}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((g) => (
                <a key={g.id} href={g.url} target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden rounded-2xl" style={{ aspectRatio: '4/3', backgroundColor: '#0E0E0E' }}>
                  <img src={g.image} alt={`${g.title} — ${g.subtitle}`} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: g.objectPosition }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.9) 0%, transparent 60%)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    {g.org && <p className="text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: '#D4A843' }}>{g.org}</p>}
                    <h3 className="text-lg tracking-tight" style={{ color: '#F8F9FA', fontWeight: 300 }}>{g.title}</h3>
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
          <h2 className="tracking-tight mb-10" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
            {fr ? 'Questions fréquentes' : 'Frequently asked'}
          </h2>
          <div className="divide-y" style={{ borderColor: 'rgba(212,168,67,0.12)' }}>
            {copy.faqs.map((f, i) => (
              <div key={i} className="py-6" style={{ borderColor: 'rgba(212,168,67,0.12)' }}>
                <h3 className="text-lg mb-2.5" style={{ color: '#F8F9FA', fontWeight: 500 }}>{f.q}</h3>
                <p className="leading-relaxed" style={{ color: '#8C7B75' }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + internal links */}
      <section className="relative py-20 lg:py-28" style={{ backgroundColor: '#121212' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="tracking-tight mb-6" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.06 }}>
            {fr ? 'Racontons votre histoire.' : "Let's tell your story."}
          </h2>
          <Link to="/contact" className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-semibold tracking-wide transition-all duration-300 hover:-translate-y-px hover:shadow-xl" style={{ backgroundColor: '#B1643B', color: '#F8F9FA' }}>
            {fr ? 'Réserver un appel' : 'Book a call'}
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <div className="mt-16 pt-10 border-t" style={{ borderColor: 'rgba(212,168,67,0.12)' }}>
            <p className="text-xs tracking-[0.35em] uppercase mb-5" style={{ color: '#8C7B75' }}>{fr ? 'Explorer aussi' : 'Explore also'}</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
              {others.map((o) => (
                <Link key={o.slug} to={`/${o.slug}`} className="text-sm tracking-wide transition-colors duration-200 hover:text-[#D4A843]" style={{ color: '#E0E0E0' }}>
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
