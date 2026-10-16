import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from '../i18n/LocaleLink';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';
import { getCaseStudy } from '../data/caseStudies';
import { absoluteUrl } from '../i18n/locale';

const SITE_URL = 'https://www.creova.one';

export function CaseStudyPage({ slug }: { slug: string }) {
  const fr = useLanguage().language === 'fr';
  const cs = getCaseStudy(slug);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px' });
  if (!cs) return null;
  const c = fr ? cs.fr : cs.en;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.title,
    description: c.metaDescription,
    image: `${SITE_URL}${cs.cover}`,
    author: { '@type': 'Organization', name: 'CREOVA' },
    publisher: { '@type': 'Organization', name: 'CREOVA', url: `${SITE_URL}/` },
    about: { '@type': 'Organization', name: `${cs.partner}, ${cs.org}` },
    mainEntityOfPage: absoluteUrl(`/work/${cs.slug}`, fr ? 'fr' : 'en'),
  };

  return (
    <div style={{ backgroundColor: '#121212' }}>
      <PageSEO title={c.title} description={c.metaDescription} path={`/work/${slug}`} ogImage={`${SITE_URL}${cs.cover}`} jsonLd={jsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 20% 0%, rgba(212,168,67,0.10) 0%, transparent 55%)' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 lg:pt-28">
          <Link to="/work" className="flex w-fit items-center gap-2 text-xs tracking-[0.2em] uppercase mb-8 transition-colors hover:text-[#D4A843]" style={{ color: '#8C7B75' }}>
            <ArrowLeft className="w-3.5 h-3.5" /> {fr ? 'Réalisations' : 'Our work'}
          </Link>
          <span className="block text-xs tracking-[0.35em] uppercase" style={{ color: '#D4A843' }}>{c.kicker}</span>
          <h1 className="tracking-tight mt-5 mb-6" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 6vw, 4.2rem)', lineHeight: 1.03 }}>{c.title}</h1>
          <p className="text-lg leading-relaxed" style={{ color: '#E0E0E0', maxWidth: '62ch' }}>{c.overview}</p>
        </div>
      </section>

      {/* Cover */}
      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: '16/9', border: '1px solid rgba(212,168,67,0.15)' }}>
          <img src={cs.cover} alt={`${cs.partner} — ${c.title}`} className="w-full h-full object-cover" style={{ objectPosition: 'center 40%' }} />
        </motion.div>
      </div>

      {/* Scope */}
      <section className="relative py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs tracking-[0.4em] uppercase mb-8" style={{ color: '#D4A843' }}>{fr ? 'La portée' : 'The scope'}</p>
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
            {c.scope.map((s, i) => (
              <div key={i} className="border-t pt-4" style={{ borderColor: 'rgba(212,168,67,0.2)' }}>
                <h3 className="text-lg mb-1.5" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)' }}>{s.label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#8C7B75' }}>{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Body + feature */}
      <section className="relative py-4 lg:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-3 space-y-6">
            {c.body.map((p, i) => (
              <p key={i} className="leading-relaxed" style={{ color: '#E0E0E0', fontSize: '1.075rem' }}>{p}</p>
            ))}
          </div>
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: '4/5', border: '1px solid rgba(212,168,67,0.15)' }}>
              <img src={cs.featureImage} alt={cs.featureName} className="w-full h-full object-cover" style={{ objectPosition: 'center 20%' }} loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(18,18,18,0.7) 0%, transparent 45%)' }} />
              <div className="absolute bottom-4 left-5">
                <p className="text-base" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)' }}>{cs.featureName}</p>
                <p className="text-[11px] tracking-[0.15em] uppercase" style={{ color: '#D4A843' }}>{fr ? cs.featureRoleFr : cs.featureRoleEn}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Optional client quote (only if present) */}
      {c.quote && (
        <section className="relative py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="italic" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3.6vw, 2.3rem)', lineHeight: 1.3 }}>“{c.quote.text}”</p>
            <p className="mt-6 text-sm" style={{ color: '#D4A843' }}>{c.quote.name} · <span style={{ color: '#8C7B75' }}>{c.quote.role}</span></p>
          </div>
        </section>
      )}

      {/* Result + CTA */}
      <section className="relative py-16 lg:py-24 border-t" style={{ backgroundColor: '#0E0E0E', borderColor: 'rgba(248,249,250,0.06)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs tracking-[0.4em] uppercase mb-5" style={{ color: '#D4A843' }}>{c.resultLabel}</p>
          <p className="text-xl lg:text-2xl leading-relaxed mb-10" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)' }}>{c.result}</p>
          <Link to="/contact" className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-semibold tracking-wide transition-all duration-300 hover:-translate-y-px hover:shadow-xl" style={{ backgroundColor: '#B1643B', color: '#F8F9FA' }}>
            {fr ? 'Démarrer un projet' : 'Start a project'}
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
