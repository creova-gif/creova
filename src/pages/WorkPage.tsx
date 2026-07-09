import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageSEO } from '../components/PageSEO';
import { ExternalLink, ArrowRight, ArrowDown, Lock, Search, X } from 'lucide-react';
import { Link } from 'react-router';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useGalleries, type Gallery } from '../hooks/useGalleries';
import { galleryListSchema } from '../utils/structuredData';

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
  index,
  large = false,
}: {
  project: Gallery;
  index: number;
  large?: boolean;
}) {
  return (
    <RevealOnScroll mode="3d" delay={index * 0.06}>
      <motion.a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden rounded-2xl cursor-pointer"
        style={{ aspectRatio: large ? '16/9' : '4/3', backgroundColor: '#111' }}
        whileHover={{ scale: 1.015 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={project.image}
          alt={`${project.title} — ${project.subtitle}`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ objectPosition: project.objectPosition }}
        />

        {/* Base gradient */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.45) 45%, rgba(8,8,8,0.05) 100%)'
        }} />

        {/* Hover color wash */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
          background: `linear-gradient(135deg, ${project.accent}1A 0%, rgba(8,8,8,0.2) 100%)`
        }} />

        {/* Category + lock — top left */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span
            className="text-[9px] tracking-[0.35em] uppercase px-3 py-1.5 rounded-full backdrop-blur-sm"
            style={{
              backgroundColor: `${project.accent}18`,
              color: project.accent,
              border: `1px solid ${project.accent}44`,
            }}
          >
            {project.category === 'brand' ? 'Brand' : project.category === 'conference' ? 'Conference' : project.category === 'sports' ? 'Sports' : 'Event'}
          </span>
          {project.locked && (
            <span
              className="text-[9px] tracking-[0.2em] uppercase px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1"
              style={{
                backgroundColor: 'rgba(18,18,18,0.6)',
                color: 'rgba(245,241,235,0.7)',
                border: '1px solid rgba(245,241,235,0.15)',
              }}
              title="This gallery is password-protected on Pixieset"
            >
              <Lock className="w-2.5 h-2.5" />
              Private
            </span>
          )}
        </div>

        {/* Item count + date — top right */}
        <div className="absolute top-4 right-4 text-right">
          {typeof project.itemCount === 'number' && project.itemCount > 0 && (
            <div className="text-[10px] tracking-[0.25em]" style={{ color: 'rgba(245,241,235,0.55)' }}>
              {project.itemCount} photos
            </div>
          )}
          <div className="text-[9px] tracking-[0.3em]" style={{ color: 'rgba(245,241,235,0.35)' }}>
            {project.date ? formatShortDate(project.date) : project.year}
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div
            className="mb-3 transition-all duration-500 group-hover:w-10"
            style={{ width: '24px', height: '1px', backgroundColor: project.accent }}
          />
          {project.org && (
            <p className="text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: project.accent }}>
              {project.org}
            </p>
          )}
          <h2 className={`tracking-tight leading-tight mb-0.5 ${large ? 'text-2xl' : 'text-lg'}`} style={{ color: '#F5F1EB', fontWeight: 300 }}>
            {project.title}
          </h2>
          {project.subtitle && (
            <p className="text-sm mb-4" style={{ color: 'rgba(245,241,235,0.5)' }}>{project.subtitle}</p>
          )}

          <div className="flex items-center gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
            <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: project.accent }}>
              {project.locked ? 'Enter Password' : 'View Gallery'}
            </span>
            <ExternalLink className="w-3 h-3" style={{ color: project.accent }} />
          </div>
        </div>
      </motion.a>
    </RevealOnScroll>
  );
}

function ScrollIndicator() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY < 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
    >
      <span className="text-[9px] tracking-[0.5em] uppercase" style={{ color: 'rgba(245,241,235,0.35)' }}>Scroll</span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        <ArrowDown className="w-3.5 h-3.5" style={{ color: 'rgba(245,241,235,0.35)' }} />
      </motion.div>
    </motion.div>
  );
}

export function WorkPage() {
  const [activeTab, setActiveTab] = useState<Category>('all');
  const [query, setQuery] = useState('');
  const marqueeRef = useRef<HTMLDivElement>(null);
  const { galleries, loading } = useGalleries();

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
    { id: 'all', label: 'All Work', count: sorted.length },
    { id: 'events', label: 'Events', count: sorted.filter(p => p.category === 'events').length },
    { id: 'sports', label: 'Sports', count: sorted.filter(p => p.category === 'sports').length },
    { id: 'conference', label: 'Conference & Panels', count: sorted.filter(p => p.category === 'conference').length },
    { id: 'brand', label: 'Brand & Portraits', count: sorted.filter(p => p.category === 'brand').length },
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
      <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh' }} className="flex items-center justify-center px-4">
        <PageSEO
          title="Our Work"
          description="Explore CREOVA's portfolio of photography, videography, brand design, and creative campaigns for BIPOC entrepreneurs and cultural brands across Canada."
          path="/work"
        />
        {!loading && (
          <p className="text-center" style={{ color: 'rgba(245,241,235,0.4)' }}>
            Our portfolio is being updated — check back shortly.
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0A0A0A' }}>
      <PageSEO
        title="Our Work"
        description={`Explore CREOVA's ${sorted.length}-gallery portfolio of photography, videography, brand design, and creative campaigns for BIPOC entrepreneurs and cultural brands across Canada.`}
        path="/work"
        jsonLd={structuredData}
      />

      {/* ── CINEMATIC HERO ── */}
      <section className="relative overflow-hidden" style={{ height: '100svh', minHeight: '580px' }}>
        {/* Full-bleed background image */}
        <img
          src={sorted[0].image}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: sorted[0].objectPosition }}
        />

        {/* Layered gradient overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0.78) 45%, rgba(10,10,10,0.25) 100%)'
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 0% 100%, rgba(177,100,59,0.18) 0%, transparent 60%)'
        }} />

        {/* Subtle film-grain noise overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }} />

        {/* Top bar */}
        <div className="absolute top-8 left-6 lg:left-12 right-6 lg:right-12 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div style={{ height: '1px', width: '32px', backgroundColor: '#A68F59' }} />
            <span className="text-[10px] tracking-[0.55em] uppercase" style={{ color: '#A68F59' }}>Selected Work</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden sm:flex items-center gap-2"
          >
            <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: 'rgba(245,241,235,0.3)' }}>
              {sorted.length} Galleries · Since 2019
            </span>
          </motion.div>
        </div>

        {/* Giant ghost number */}
        <div
          className="absolute right-0 bottom-0 select-none pointer-events-none hidden lg:block"
          style={{
            fontSize: 'clamp(200px, 28vw, 380px)',
            fontWeight: 700,
            color: 'rgba(245,241,235,0.03)',
            lineHeight: 1,
            letterSpacing: '-0.05em',
            transform: 'translateX(8%)',
          }}
          aria-hidden="true"
        >
          {sorted.length}
        </div>

        {/* Vertical side text — editorial */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-2 pointer-events-none" aria-hidden="true">
          <div style={{ height: '40px', width: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />
          <span
            className="text-[9px] tracking-[0.6em] uppercase select-none"
            style={{ color: 'rgba(245,241,235,0.2)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Niagara · Ontario · Canada
          </span>
          <div style={{ height: '40px', width: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-12 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-0">

              {/* Title block — bbbblanc-style scale contrast */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* MASSIVE "Creative" — takes up the width */}
                  <h1 className="leading-none">
                    <span className="block font-light tracking-tighter" style={{ fontSize: 'clamp(72px, 15vw, 200px)', color: '#F5F1EB' }}>
                      Creative
                    </span>
                    {/* Small italic "/ Portfolio." — scale contrast is the technique */}
                    <span className="flex items-end justify-between mt-1">
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        className="italic tracking-tight"
                        style={{
                          fontSize: 'clamp(22px, 3.5vw, 44px)',
                          backgroundImage: 'linear-gradient(95deg, #A68F59 0%, #E3DCD3 60%)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                        }}
                      >
                        / Portfolio.
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-[9px] tracking-[0.5em] uppercase hidden sm:block"
                        style={{ color: 'rgba(245,241,235,0.2)' }}
                      >
                        {sorted.length} galleries · Since 2019
                      </motion.span>
                    </span>
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.55 }}
                  className="mt-5 text-base leading-relaxed max-w-md"
                  style={{ color: 'rgba(245,241,235,0.5)' }}
                >
                  Photography and brand content for BIPOC-led organizations, cultural events, and community institutions across Niagara and Ontario.
                </motion.p>
              </div>

              {/* Stats block */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65 }}
                className="flex gap-10 lg:gap-12 flex-shrink-0"
              >
                {[
                  { n: String(sorted.length), l: 'Galleries' },
                  { n: '100+', l: 'Events Shot' },
                  { n: '2024', l: 'Since' },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="text-3xl font-light tracking-tight" style={{ color: '#A68F59' }}>{s.n}</div>
                    <div className="text-[9px] tracking-[0.45em] uppercase mt-1.5" style={{ color: 'rgba(245,241,235,0.28)' }}>{s.l}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        <ScrollIndicator />
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div
        className="overflow-hidden py-3 border-y"
        style={{ backgroundColor: '#080808', borderColor: 'rgba(166,143,89,0.12)' }}
        aria-hidden="true"
      >
        <div ref={marqueeRef} className="flex whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-4 text-[9px] tracking-[0.5em] uppercase flex-shrink-0"
              style={{ color: 'rgba(166,143,89,0.35)' }}
            >
              {item}
              <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'rgba(166,143,89,0.25)', display: 'inline-block' }} />
            </span>
          ))}
        </div>
      </div>

      {/* ── FILTER TABS ── */}
      <div
        className="sticky z-40"
        style={{
          top: '64px',
          backgroundColor: '#0E0E0E',
          borderBottom: '1px solid rgba(166,143,89,0.12)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center gap-3 py-3">
            <div className="flex overflow-x-auto gap-1 scrollbar-hide flex-1 min-w-0">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 flex-shrink-0 text-xs tracking-wide"
                  style={{
                    backgroundColor: activeTab === tab.id ? 'rgba(166,143,89,0.18)' : 'transparent',
                    color: activeTab === tab.id ? '#A68F59' : 'rgba(245,241,235,0.3)',
                    border: activeTab === tab.id ? '1px solid rgba(166,143,89,0.45)' : '1px solid transparent',
                  }}
                >
                  {tab.label}
                  <span
                    className="text-[9px] px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: activeTab === tab.id ? 'rgba(166,143,89,0.35)' : 'rgba(245,241,235,0.06)',
                      color: activeTab === tab.id ? '#A68F59' : 'rgba(245,241,235,0.25)',
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72 flex-shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: 'rgba(166,143,89,0.55)' }} />
              <Input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search galleries..."
                aria-label="Search galleries"
                className="pl-10 pr-9 py-2 text-xs rounded-full border"
                style={{
                  backgroundColor: 'rgba(245,241,235,0.04)',
                  borderColor: 'rgba(166,143,89,0.15)',
                  color: '#F5F1EB',
                }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" style={{ color: 'rgba(245,241,235,0.4)' }} />
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
              <p className="text-sm mb-3" style={{ color: 'rgba(245,241,235,0.5)' }}>
                No galleries match your search.
              </p>
              <button
                onClick={() => { setQuery(''); setActiveTab('all'); }}
                className="text-xs tracking-widest uppercase"
                style={{ color: '#A68F59' }}
              >
                Reset filters
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
                      <ProjectCard project={project} index={index} large={isHero} />
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
        style={{ borderTop: '1px solid rgba(166,143,89,0.12)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 70% at 50% 50%, rgba(166,143,89,0.05) 0%, transparent 70%)'
        }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <RevealOnScroll mode="3d">
            <div>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div style={{ height: '1px', width: '32px', backgroundColor: 'rgba(166,143,89,0.4)' }} />
                <span className="text-[9px] tracking-[0.55em] uppercase" style={{ color: '#A68F59' }}>Full Portfolio</span>
                <div style={{ height: '1px', width: '32px', backgroundColor: 'rgba(166,143,89,0.4)' }} />
              </div>
              <h3 className="text-3xl md:text-4xl font-light tracking-tight mb-4" style={{ color: '#F5F1EB' }}>
                Every photo, full resolution
              </h3>
              <p className="text-base mb-10 leading-relaxed" style={{ color: 'rgba(245,241,235,0.4)' }}>
                All galleries live on Pixieset with full-resolution downloads available.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a
                  href="https://creova.pixieset.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm tracking-wide transition-all duration-300"
                  style={{ backgroundColor: '#A68F59', color: '#121212' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#F5F1EB'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#A68F59'; }}
                >
                  View Full Portfolio
                  <ExternalLink className="w-4 h-4" />
                </a>
                <Button
                  asChild
                  variant="outline"
                  className="px-8 py-4 rounded-xl text-sm tracking-wide border transition-all duration-300"
                  style={{ backgroundColor: 'transparent', borderColor: 'rgba(166,143,89,0.35)', color: '#A68F59' }}
                >
                  <Link to="/booking">
                    Book a Shoot
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
