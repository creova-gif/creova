import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageSEO } from '../components/PageSEO';
import { ExternalLink, ArrowRight, ArrowDown } from 'lucide-react';
import { Link } from 'react-router';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { Button } from '../components/ui/button';
import { SplitText } from '../components/SplitText';
import { InfiniteMarquee } from '../components/InfiniteMarquee';
import { Magnetic } from '../components/Magnetic';
import { TiltCard } from '../components/TiltCard';

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
        style={{ aspectRatio: large ? '16/9' : '4/3', backgroundColor: '#121212', border: '1px solid rgba(166,143,89,0.18)' }}
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
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.45) 45%, rgba(10,10,10,0.05) 100%)'
        }} />

        {/* Hover color wash */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
          background: `linear-gradient(135deg, ${project.accent}1A 0%, rgba(10,10,10,0.2) 100%)`
        }} />

        {/* Category — top left */}
        <div className="absolute top-4 left-4">
          <span
            className="mono-label px-3 py-1.5 rounded-full backdrop-blur-sm"
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
          <span className="mono-label" style={{ color: 'rgba(245,241,235,0.4)' }}>{project.year}</span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div
            className="mb-3 transition-all duration-500 group-hover:w-10"
            style={{ width: '24px', height: '1px', backgroundColor: project.accent }}
          />
          <p className="mono-label mb-1" style={{ color: project.accent }}>
            {project.org}
          </p>
          <h3 className={`display-grotesk mb-1 ${large ? 'text-3xl' : 'text-xl'}`} style={{ color: '#F5F1EB' }}>
            {project.title}
          </h3>
          <p className="text-sm mb-4 font-light" style={{ color: '#C8C0B8' }}>{project.subtitle}</p>

          <div className="flex items-center gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
            <span className="mono-label" style={{ color: project.accent }}>View Gallery</span>
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
      <span className="mono-label" style={{ color: 'rgba(245,241,235,0.35)' }}>Scroll</span>
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
      <section className="relative overflow-hidden" style={{ height: '100svh', minHeight: '580px', backgroundColor: '#0A0A0A' }}>
        
        {/* Architectural elements */}
        <div className="crosshair-guides" />
        <div className="guide-ring hidden md:block" style={{ width: '48vw', height: '48vw', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />

        {/* Full-bleed background image with heavy fading */}
        <img
          src={PROJECTS[0].image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          style={{ objectPosition: PROJECTS[0].objectPosition }}
        />

        {/* Layered gradient overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0.85) 45%, rgba(10,10,10,0.45) 100%)'
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 60% at 0% 100%, rgba(166,143,89,0.12) 0%, transparent 60%)'
        }} />

        {/* Top bar */}
        <div className="absolute top-8 left-6 lg:left-12 right-6 lg:right-12 flex items-center justify-between z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div style={{ height: '1px', width: '32px', backgroundColor: '#A68F59' }} />
            <span className="mono-label">Selected Work</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden sm:flex items-center gap-2"
          >
            <span className="mono-label" style={{ color: 'rgba(245,241,235,0.4)' }}>
              {PROJECTS.length} Projects · 2024
            </span>
          </motion.div>
        </div>

        {/* Vertical side text — editorial */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-2 pointer-events-none z-10" aria-hidden="true">
          <div style={{ height: '40px', width: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />
          <span
            className="mono-label"
            style={{ color: 'rgba(245,241,235,0.3)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Niagara · Ontario · Canada
          </span>
          <div style={{ height: '40px', width: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-12 pb-16 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-0">
              
              {/* Title block */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SplitText
                    text="CREATIVE"
                    tag="h1"
                    className="display-hero"
                    style={{ color: '#F5F1EB' }}
                    delay={0.3}
                    stagger={0.05}
                    mode="chars"
                  />
                  
                  <div className="flex items-end justify-between mt-2">
                    <motion.h1
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.7, delay: 0.5 }}
                      className="display-grotesk text-gold-gradient"
                      style={{ fontSize: 'clamp(28px, 4.5vw, 64px)' }}
                    >
                      / PORTFOLIO.
                    </motion.h1>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="mono-label hidden sm:block"
                      style={{ color: 'rgba(245,241,235,0.4)' }}
                    >
                      {PROJECTS.length} projects · 2024
                    </motion.span>
                  </div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.55 }}
                  className="mt-6 text-base sm:text-lg leading-relaxed max-w-md"
                  style={{ color: '#C8C0B8' }}
                >
                  Photography and brand content for BIPOC-led organizations, cultural events, and community institutions across Niagara and Ontario.
                </motion.p>
              </div>

              {/* Stats block */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65 }}
                className="flex gap-10 lg:gap-12 flex-shrink-0 mt-8"
              >
                {[
                  { n: '10', l: 'Galleries' },
                  { n: '100+', l: 'Events Shot' },
                  { n: '2024', l: 'Since' },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="display-grotesk text-4xl" style={{ color: '#A68F59' }}>{s.n}</div>
                    <div className="mono-label mt-2" style={{ color: 'rgba(245,241,235,0.4)' }}>{s.l}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        <ScrollIndicator />
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="py-5 overflow-hidden border-y" style={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(166,143,89,0.2)' }}>
        <InfiniteMarquee items={MARQUEE_ITEMS} speed={45} direction="left" />
      </div>

      {/* ── FILTER TABS ── */}
      <div
        className="sticky z-40"
        style={{
          top: '64px',
          backgroundColor: 'rgba(14, 14, 14, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(166,143,89,0.18)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-2 py-4 scrollbar-hide">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 flex-shrink-0"
                style={{
                  backgroundColor: activeTab === tab.id ? 'rgba(166,143,89,0.12)' : 'transparent',
                  color: activeTab === tab.id ? '#A68F59' : '#9A9088',
                  border: activeTab === tab.id ? '1px solid rgba(166,143,89,0.4)' : '1px solid transparent',
                }}
              >
                <span className="mono-label" style={{ color: 'inherit' }}>{tab.label}</span>
                <span
                  className="mono-label w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: activeTab === tab.id ? 'rgba(166,143,89,0.25)' : 'rgba(245,241,235,0.08)',
                    color: activeTab === tab.id ? '#F5F1EB' : 'inherit',
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
      <section className="py-16 relative" style={{ backgroundColor: '#0E0E0E' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 60% at 50% 0%, rgba(166,143,89,0.05) 0%, transparent 60%)'
        }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((project, index) => {
                const isHero = activeTab === 'all' && index === 0;
                return (
                  <div
                    key={project.id}
                    className={isHero ? 'md:col-span-2 lg:col-span-2' : ''}
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
        className="py-28 relative overflow-hidden"
        style={{ backgroundColor: '#0A0A0A', borderTop: '1px solid rgba(166,143,89,0.18)' }}
      >
        <div className="crosshair-guides" />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 70% at 50% 50%, rgba(166,143,89,0.08) 0%, transparent 70%)'
        }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center z-10">
          <RevealOnScroll mode="3d">
            <div>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
                <span className="mono-label" style={{ color: '#A68F59' }}>Full Portfolio</span>
                <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              </div>
              <h2 className="display-grotesk text-4xl md:text-6xl mb-6" style={{ color: '#F5F1EB' }}>
                EVERY PHOTO, FULL RESOLUTION
              </h2>
              <p className="text-lg mb-10 leading-relaxed" style={{ color: '#C8C0B8' }}>
                All galleries live on Pixieset with full-resolution downloads available.
              </p>
              <div className="flex flex-wrap gap-5 justify-center">
                <Magnetic strength={0.22}>
                  <a
                    href="https://creova.pixieset.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-400 hover:shadow-2xl hover:-translate-y-0.5"
                    style={{ backgroundColor: '#F5F1EB', color: '#0A0A0A' }}
                  >
                    View Full Portfolio
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </a>
                </Magnetic>
                <Magnetic strength={0.22}>
                  <Button
                    asChild
                    variant="outline"
                    className="group px-8 py-4 rounded-full text-sm font-semibold tracking-wide border transition-all duration-400 hover:-translate-y-0.5"
                    style={{ backgroundColor: 'transparent', borderColor: 'rgba(166,143,89,0.5)', color: '#A68F59' }}
                  >
                    <Link to="/booking">
                      Book a Shoot
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </Link>
                  </Button>
                </Magnetic>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
