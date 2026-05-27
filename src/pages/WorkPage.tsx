import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageSEO } from '../components/PageSEO';
import { ExternalLink, ArrowRight, ArrowDown } from 'lucide-react';
import { Link } from 'react-router';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { Button } from '../components/ui/button';

type Category = 'all' | 'events' | 'sports' | 'brand' | 'conference';

const PROJECTS = [
  {
    id: 1,
    title: 'Afro Caribbean Night',
    subtitle: 'Part II',
    category: 'events' as Category,
    org: 'BSSC · Brock University',
    year: '2024',
    image: '/card-blackprint-session.jpg',
    objectPosition: 'center 30%',
    url: 'https://creova.pixieset.com/afrocaribbeannightpart2/',
    accent: '#B1643B',
    featured: true,
  },
  {
    id: 2,
    title: 'Afro Caribbean Night',
    subtitle: 'Part I',
    category: 'events' as Category,
    org: 'BSSC · Brock University',
    year: '2024',
    image: '/card-blackprint.jpg',
    objectPosition: 'center 40%',
    url: 'https://creova.pixieset.com/afrocaribbeannightpart1/',
    accent: '#A68F59',
    featured: true,
  },
  {
    id: 3,
    title: 'MASLAB × Always Carnival',
    subtitle: 'Cultural Night',
    category: 'events' as Category,
    org: 'BSSC · Brock University',
    year: '2024',
    image: '/community-photo.jpg',
    objectPosition: 'center 25%',
    url: 'https://creova.pixieset.com/maslabbsscxalwayscarnival/',
    accent: '#A68F59',
    featured: false,
  },
  {
    id: 4,
    title: 'Kingpin Bowling Night',
    subtitle: 'Community Event',
    category: 'events' as Category,
    org: 'BSSC · Brock University',
    year: '2024',
    image: '/card-bssc.jpg',
    objectPosition: 'center 20%',
    url: 'https://creova.pixieset.com/kingpinbowlingbssc/',
    accent: '#B1643B',
    featured: false,
  },
  {
    id: 5,
    title: 'Hoop for Stars',
    subtitle: 'BLSA × BUGA',
    category: 'sports' as Category,
    org: 'BLSA · BUGA · Brock University',
    year: '2024',
    image: '/card-blsa.jpg',
    objectPosition: 'center 35%',
    url: 'https://creova.pixieset.com/hoopforstarsblsaxbuga/',
    accent: '#A68F59',
    featured: false,
  },
  {
    id: 6,
    title: 'FBF Podcast Stocks',
    subtitle: 'Brand Photography',
    category: 'brand' as Category,
    org: 'Future Black Female',
    year: '2024',
    image: '/card-fbf.jpg',
    objectPosition: 'center 20%',
    url: 'https://creova.pixieset.com/futureblackfemalefbfpodcaststocks/',
    accent: '#B1643B',
    featured: false,
  },
  {
    id: 7,
    title: 'Paint Night',
    subtitle: 'Tray Arts × BSSC',
    category: 'events' as Category,
    org: 'Tray Arts · BSSC · Brock University',
    year: '2024',
    image: '/photo-monique-bssc.jpg',
    objectPosition: 'center 20%',
    url: 'https://creova.pixieset.com/paintnighttrayartsxblackstudentsuccesscentrebssc/',
    accent: '#A68F59',
    featured: false,
  },
  {
    id: 8,
    title: 'Level Up Symposium',
    subtitle: 'Brock University',
    category: 'conference' as Category,
    org: 'Brock University',
    year: '2024',
    image: '/card-justin-panel.jpg',
    objectPosition: 'center 25%',
    url: 'https://creova.pixieset.com/levelupsymposiumbrockuniversity/',
    accent: '#B1643B',
    featured: false,
  },
  {
    id: 9,
    title: 'East Africa vs West Africa',
    subtitle: 'Charity Match',
    category: 'sports' as Category,
    org: 'EASC · BUGA · NSA · Brock University',
    year: '2024',
    image: '/card-msk.jpg',
    objectPosition: 'center 30%',
    url: 'https://creova.pixieset.com/eastafricavswestafricacharitymatchbrockeascbugaandnsa/',
    accent: '#A68F59',
    featured: false,
  },
  {
    id: 10,
    title: 'BLSA Photoshoot',
    subtitle: 'Brand & Portraits',
    category: 'brand' as Category,
    org: 'BLSA · Brock University',
    year: '2024',
    image: '/photo-beyond-agency.jpg',
    objectPosition: 'center 25%',
    url: 'https://creova.pixieset.com/blsaphotoshoot/',
    accent: '#A68F59',
    featured: false,
  },
] as const;

const TABS: { id: Category; label: string; count: number }[] = [
  { id: 'all', label: 'All Work', count: PROJECTS.length },
  { id: 'events', label: 'Events', count: PROJECTS.filter(p => p.category === 'events').length },
  { id: 'sports', label: 'Sports', count: PROJECTS.filter(p => p.category === 'sports').length },
  { id: 'brand', label: 'Brand & Headshots', count: PROJECTS.filter(p => p.category === 'brand').length },
  { id: 'conference', label: 'Conference', count: PROJECTS.filter(p => p.category === 'conference').length },
];

const MARQUEE_ITEMS = ['CREOVA', 'PHOTOGRAPHY', 'EVENTS', 'SPORTS', 'BRAND', 'CONFERENCES', 'NIAGARA', '2024', 'CULTURAL', 'COMMUNITY'];

function ProjectCard({
  project,
  index,
  large = false,
}: {
  project: typeof PROJECTS[number];
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

        {/* Category — top left */}
        <div className="absolute top-4 left-4">
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
        </div>

        {/* Year — top right */}
        <div className="absolute top-4 right-4">
          <span className="text-[9px] tracking-[0.3em]" style={{ color: 'rgba(245,241,235,0.4)' }}>{project.year}</span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div
            className="mb-3 transition-all duration-500 group-hover:w-10"
            style={{ width: '24px', height: '1px', backgroundColor: project.accent }}
          />
          <p className="text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: project.accent }}>
            {project.org}
          </p>
          <h3 className={`tracking-tight leading-tight mb-0.5 ${large ? 'text-2xl' : 'text-lg'}`} style={{ color: '#F5F1EB', fontWeight: 300 }}>
            {project.title}
          </h3>
          <p className="text-sm mb-4" style={{ color: 'rgba(245,241,235,0.5)' }}>{project.subtitle}</p>

          <div className="flex items-center gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
            <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: project.accent }}>View Gallery</span>
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
  const marqueeRef = useRef<HTMLDivElement>(null);

  const filtered = activeTab === 'all'
    ? [...PROJECTS]
    : PROJECTS.filter(p => p.category === activeTab);

  return (
    <div style={{ backgroundColor: '#0A0A0A' }}>
      <PageSEO
        title="Our Work"
        description="Explore CREOVA's portfolio of photography, videography, brand design, and creative campaigns for BIPOC entrepreneurs and cultural brands across Canada."
      />

      {/* ── CINEMATIC HERO ── */}
      <section className="relative overflow-hidden" style={{ height: '100svh', minHeight: '580px' }}>
        {/* Full-bleed background image */}
        <img
          src={PROJECTS[0].image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: PROJECTS[0].objectPosition }}
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
              {PROJECTS.length} Projects · 2024
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
          10
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-12 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

              {/* Title block */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h1 className="font-light leading-none tracking-tighter" style={{ fontSize: 'clamp(56px, 11vw, 136px)' }}>
                    <span className="block" style={{ color: '#F5F1EB' }}>Creative</span>
                    <span
                      className="block"
                      style={{
                        backgroundImage: 'linear-gradient(95deg, #A68F59 0%, #E3DCD3 60%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                      }}
                    >
                      Portfolio.
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
                  { n: '10', l: 'Galleries' },
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
          top: 0,
          backgroundColor: '#0E0E0E',
          borderBottom: '1px solid rgba(166,143,89,0.12)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-1 py-3 scrollbar-hide">
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
                  className="text-[9px] w-4 h-4 rounded-full flex items-center justify-center"
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
        </div>
      </div>

      {/* ── GRID ── */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((project, index) => {
                // First featured project in "all" view → spans 2 columns
                const isHero = activeTab === 'all' && index === 0;
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
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4" style={{ color: '#F5F1EB' }}>
                Every photo, full resolution
              </h2>
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
