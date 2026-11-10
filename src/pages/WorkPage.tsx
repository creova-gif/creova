import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageSEO } from '../components/PageSEO';
import { EditorialHeroImage } from '../components/EditorialHeroImage';
import { ExternalLink, ArrowRight, Lock, Search, X } from 'lucide-react';
import { Link } from '../i18n/LocaleLink';
import { useLanguage } from '../context/LanguageContext';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useGalleries, type Gallery } from '../hooks/useGalleries';
import { galleryListSchema } from '../utils/structuredData';
import { CASE_STUDIES } from '../data/caseStudies';
import { getPublishedEvidenceBySlug } from '../content/publicEvidence';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatShortDate(iso?: string): string {
  if (!iso) return '';
  const parts = iso.split('-');
  if (parts.length !== 3) return '';
  const [year, month, day] = parts;
  return `${MONTHS_SHORT[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
}

type Category = 'all' | 'events' | 'sports' | 'brand' | 'conference';

const MARQUEE_ITEMS = ['CREOVA', 'PHOTOGRAPHY', 'EVENTS', 'SPORTS', 'BRAND', 'CONFERENCES', 'NIAGARA', '2024', 'CULTURAL', 'COMMUNITY'];

function ProjectCard({
  project,
  large = false,
}: {
  project: Gallery;
  large?: boolean;
}) {
  // Portfolio page → tu register (see mixed-register decision).
  const fr = useLanguage().language === 'fr';
  return (
    <div>
      <motion.a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block overflow-hidden rounded-2xl cursor-pointer"
        style={{ backgroundColor: '#0E0E0E', border: '1px solid rgba(198,164,90,0.16)' }}
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: large ? '16/9' : '4/3' }}>
          <img
            src={project.image}
            alt={`${project.title} — ${project.subtitle}`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ objectPosition: project.objectPosition }}
            width="1600"
            height="1200"
          />
        </div>

        <div className="p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] tracking-[0.3em] uppercase rounded-full px-3 py-1.5" style={{ color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)' }}>
                {fr
                  ? (project.category === 'brand' ? 'Marque' : project.category === 'conference' ? 'Conférence' : project.category === 'sports' ? 'Sport' : 'Événement')
                  : (project.category === 'brand' ? 'Brand' : project.category === 'conference' ? 'Conference' : project.category === 'sports' ? 'Sports' : 'Event')}
              </span>
              {project.locked && (
                <span className="text-[9px] tracking-[0.2em] uppercase flex items-center gap-1" style={{ color: '#CDBFAE' }} title="This gallery is password-protected on Pixieset">
                  <Lock className="w-2.5 h-2.5" /> {fr ? 'Privé' : 'Private'}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-[0.2em]" style={{ color: '#CDBFAE' }}>
              {typeof project.itemCount === 'number' && project.itemCount > 0 ? `${project.itemCount} photos · ` : ''}{project.date ? formatShortDate(project.date) : project.year}
            </span>
          </div>
          {project.org && (
            <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: '#CDBFAE' }}>
              {project.org}
            </p>
          )}
          <h2 className={`tracking-tight leading-tight mb-1 ${large ? 'text-2xl' : 'text-xl'}`} style={{ color: '#FFFFFF', fontWeight: 300 }}>
            {project.title}
          </h2>
          {project.subtitle && (
            <p className="text-sm mb-5" style={{ color: '#CDBFAE' }}>{project.subtitle}</p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: '#FFFFFF' }}>
              {fr ? (project.locked ? 'Entrer le mot de passe' : 'Voir la galerie') : (project.locked ? 'Enter Password' : 'View Gallery')}
            </span>
            <ExternalLink className="w-3 h-3" style={{ color: '#C6A45A' }} />
          </div>
        </div>
      </motion.a>
    </div>
  );
}

export function WorkPage() {
  const fr = useLanguage().language === 'fr';
  const [activeTab, setActiveTab] = useState<Category>('all');
  const [query, setQuery] = useState('');
  const marqueeRef = useRef<HTMLDivElement>(null);
  const { galleries, loading, source } = useGalleries();
  const featuredCaseStudy = CASE_STUDIES.find((caseStudy) => getPublishedEvidenceBySlug(caseStudy.slug));

  const sorted = useMemo(() => {
    // Newest first, using date if present, otherwise year
    return [...galleries].sort((a, b) => {
      const aDate = a.date || `${a.year}-01-01`;
      const bDate = b.date || `${b.year}-01-01`;
      return bDate.localeCompare(aDate);
    });
  }, [galleries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter(p => {
      if (activeTab !== 'all' && p.category !== activeTab) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.org.toLowerCase().includes(q)
      );
    });
  }, [sorted, activeTab, query]);

  const TABS: { id: Category; label: string; count: number }[] = [
    { id: 'all', label: fr ? 'Tout' : 'All Work', count: sorted.length },
    { id: 'events', label: fr ? 'Événements' : 'Events', count: sorted.filter(p => p.category === 'events').length },
    { id: 'sports', label: fr ? 'Sport' : 'Sports', count: sorted.filter(p => p.category === 'sports').length },
    { id: 'conference', label: fr ? 'Conférences et panels' : 'Conference & Panels', count: sorted.filter(p => p.category === 'conference').length },
    { id: 'brand', label: fr ? 'Marque et portraits' : 'Brand & Portraits', count: sorted.filter(p => p.category === 'brand').length },
  ];

  const structuredData = useMemo(
    () => galleryListSchema(sorted.map(g => ({
      title: g.title,
      subtitle: g.subtitle,
      url: g.url,
      image: g.image,
      date: g.date,
      itemCount: g.itemCount,
    }))),
    [sorted]
  );

  if (loading || galleries.length === 0) {
    return (
      <div style={{ backgroundColor: '#2D1011', minHeight: '100vh' }} className="flex items-center justify-center px-4">
        <PageSEO
          title="Our Work"
          description="Explore verified CREOVA work documenting cultural events, community programs, and institutional stories in Ontario."
          path="/work"
        />
        {!loading && (
          <p className="text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {fr ? 'Notre portfolio est en cours de mise à jour — reviens bientôt.' : 'Our portfolio is being updated — check back shortly.'}
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#2D1011' }}>
      <PageSEO
        title="Our Work"
        description="Explore verified CREOVA work documenting cultural events, community programs, and institutional stories in Ontario."
        path="/work"
        jsonLd={structuredData}
      />

      {/* ── EDITORIAL HERO ── */}
      <section className="relative flex min-h-[calc(100svh-4rem)] items-end overflow-hidden" style={{ backgroundColor: '#2D1011' }}>
        <EditorialHeroImage
          src={sorted[0].image}
          objectPosition={sorted[0].objectPosition}
          secondarySrc={sorted[1]?.image}
          secondaryObjectPosition={sorted[1]?.objectPosition}
          folio="SELECTED WORK / 05"
        />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-16 lg:py-28">
          <div className="max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-7">
                <span className="block h-px w-8" style={{ backgroundColor: '#C6A45A' }} />
                <span className="text-[10px] tracking-[0.45em] uppercase" style={{ color: '#C6A45A' }}>{fr ? 'Travaux choisis' : 'Selected Work'}</span>
              </div>
              <h1 className="creova-page-title font-light tracking-tight" style={{ color: '#FFFFFF' }}>
                {fr ? 'Des histoires ancrées dans de vrais événements, personnes et programmes.' : 'Stories built from real events, people, and programs.'}
              </h1>
              <p className="mt-7 text-lg leading-relaxed max-w-2xl" style={{ color: '#E0E0E0' }}>
                {fr ? "Parcourez une sélection publique de photographies et de contenus créés pour des organisations, des événements culturels et des institutions communautaires de l'Ontario." : 'Explore public photography and content created for organizations, cultural events, and community institutions across Ontario.'}
              </p>
              <div className="mt-10 grid grid-cols-3 gap-5 max-w-xl">
                {[
                  { n: String(sorted.length), l: fr ? 'Galeries' : 'Galleries' },
                  { n: 'Public', l: 'Pixieset' },
                  { n: 'ON', l: fr ? 'Ontario' : 'Ontario-based' },
                ].map((s) => (
                  <div key={s.l} className="border-t pt-3" style={{ borderColor: 'rgba(198,164,90,0.28)' }}>
                    <div className="text-2xl font-light tracking-tight" style={{ color: '#C6A45A' }}>{s.n}</div>
                    <div className="text-[9px] tracking-[0.25em] uppercase mt-1.5" style={{ color: '#CDBFAE' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {source === 'fallback' && (
        <div className="px-4 py-4 text-center" style={{ backgroundColor: '#0E0E0E', borderTop: '1px solid rgba(198,164,90,0.12)' }}>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {fr ? 'Une sélection organisée du portfolio public de CREOVA.' : "A curated selection from CREOVA's public portfolio."}{' '}
            <a href="https://creova.pixieset.com/" target="_blank" rel="noopener noreferrer" className="creova-touch-target inline-flex items-center underline underline-offset-4" style={{ color: '#C6A45A' }}>
              {fr ? 'Voir les galeries sur Pixieset' : 'Browse the galleries on Pixieset'}
            </a>
          </p>
        </div>
      )}

      {/* ── MARQUEE STRIP ── */}
      <div
        className="overflow-hidden py-3 border-y"
        style={{ backgroundColor: '#2D1011', borderColor: 'rgba(198,164,90,0.12)' }}
        aria-hidden="true"
      >
        <div ref={marqueeRef} className="flex whitespace-nowrap">
          {[...(fr ? ['CREOVA', 'PHOTOGRAPHIE', 'ÉVÉNEMENTS', 'SPORT', 'MARQUE', 'CONFÉRENCES', 'NIAGARA', '2024', 'CULTUREL', 'COMMUNAUTÉ'] : MARQUEE_ITEMS)].flatMap(x => [x, x, x]).map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-4 text-[9px] tracking-[0.5em] uppercase flex-shrink-0"
              style={{ color: 'rgba(198,164,90,0.35)' }}
            >
              {item}
              <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'rgba(198,164,90,0.25)', display: 'inline-block' }} />
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED CASE STUDY ── */}
      {featuredCaseStudy && (() => {
        const cs = featuredCaseStudy;
        const c = fr ? cs.fr : cs.en;
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Link
              to={`/work/${cs.slug}`}
              className="group grid sm:grid-cols-[minmax(0,1fr)_1.4fr] gap-0 overflow-hidden rounded-2xl"
              style={{ backgroundColor: '#0E0E0E', border: '1px solid rgba(198,164,90,0.15)' }}
            >
              <div className="relative overflow-hidden" style={{ minHeight: '200px', aspectRatio: '16/10' }}>
                <img src={cs.cover} alt={c.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: 'center 40%' }} loading="lazy" width="1600" height="1200" />
              </div>
              <div className="flex flex-col justify-center p-7 lg:p-10">
                <span className="text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: '#C6A45A' }}>{fr ? 'Étude de cas en vedette' : 'Featured case study'}</span>
                <h2 className="tracking-tight mb-3 transition-colors duration-200 group-hover:text-[#C6A45A]" style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', lineHeight: 1.1 }}>{c.title}</h2>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#CDBFAE', maxWidth: '48ch' }}>{cs.partner} · {cs.org}</p>
                <span className="inline-flex items-center gap-2 text-sm tracking-wide" style={{ color: '#E0E0E0' }}>
                  {fr ? 'Lire l’étude de cas' : 'Read the case study'}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" style={{ color: '#C6A45A' }} />
                </span>
              </div>
            </Link>
          </div>
        );
      })()}

      {/* ── FILTER TABS ── */}
      <div
        className="sticky z-40"
        style={{
          top: '64px',
          backgroundColor: '#2D1011',
          borderBottom: '1px solid rgba(198,164,90,0.12)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center gap-3 py-3">
            <div className="flex overflow-x-auto gap-1 scrollbar-hide flex-1 min-w-0">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="creova-touch-target flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 flex-shrink-0 text-xs tracking-wide"
                  style={{
                    backgroundColor: activeTab === tab.id ? '#6B5033' : 'transparent',
                    color: activeTab === tab.id ? '#FFFFFF' : '#C9BFBA',
                    border: activeTab === tab.id ? '1px solid #C6A45A' : '1px solid transparent',
                  }}
                >
                  {tab.label}
                  <span
                    className="text-[9px] px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: activeTab === tab.id ? '#2D1011' : '#4A3031',
                      color: activeTab === tab.id ? '#F2D98C' : '#D8CECA',
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72 flex-shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: 'rgba(198,164,90,0.55)' }} />
              <Input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={fr ? 'Rechercher des galeries...' : 'Search galleries...'}
                aria-label={fr ? 'Rechercher des galeries' : 'Search galleries'}
                className="h-11 pl-10 pr-9 py-2 text-xs rounded-full border"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderColor: 'rgba(198,164,90,0.15)',
                  color: '#FFFFFF',
                }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="creova-touch-target absolute right-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center"
                  aria-label={fr ? 'Effacer la recherche' : 'Clear search'}
                >
                  <X className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.4)' }} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── GRID ── */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {fr ? 'Aucune galerie ne correspond à ta recherche.' : 'No galleries match your search.'}
              </p>
              <button
                onClick={() => { setQuery(''); setActiveTab('all'); }}
                className="text-xs tracking-widest uppercase"
                style={{ color: '#C6A45A' }}
              >
                {fr ? 'Réinitialiser les filtres' : 'Reset filters'}
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + query}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filtered.map((project, index) => {
                  // First card in "all"+no-query view spans 2 columns
                  const isHero = activeTab === 'all' && !query && index === 0;
                  return (
                    <div
                      key={project.id}
                      className={isHero ? 'sm:col-span-2' : ''}
                    >
                      <ProjectCard project={project} large={isHero} />
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ borderTop: '1px solid rgba(198,164,90,0.12)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 70% at 50% 50%, rgba(198,164,90,0.05) 0%, transparent 70%)'
        }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <RevealOnScroll mode="3d">
            <div>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div style={{ height: '1px', width: '32px', backgroundColor: 'rgba(198,164,90,0.4)' }} />
                <span className="text-[9px] tracking-[0.55em] uppercase" style={{ color: '#C6A45A' }}>{fr ? 'Portfolio complet' : 'Full Portfolio'}</span>
                <div style={{ height: '1px', width: '32px', backgroundColor: 'rgba(198,164,90,0.4)' }} />
              </div>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4" style={{ color: '#FFFFFF' }}>
                {fr ? 'Chaque photo, pleine résolution' : 'Every photo, full resolution'}
              </h2>
              <p className="text-base mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {fr ? 'Toutes les galeries sont hébergées sur Pixieset avec téléchargements en pleine résolution.' : 'All galleries live on Pixieset with full-resolution downloads available.'}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="https://creova.pixieset.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm tracking-wide transition-all duration-300"
                  style={{ backgroundColor: '#C6A45A', color: '#2D1011' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#FFFFFF'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#C6A45A'; }}
                >
                  {fr ? 'Voir le portfolio complet' : 'View Full Portfolio'}
                  <ExternalLink className="w-4 h-4" />
                </a>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 px-8 py-4 rounded-xl text-sm tracking-wide border transition-all duration-300"
                  style={{ backgroundColor: 'transparent', borderColor: 'rgba(198,164,90,0.35)', color: '#C6A45A' }}
                >
                  <Link to="/start-a-project">
                    {fr ? 'Réserve une séance' : 'Book a Shoot'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
