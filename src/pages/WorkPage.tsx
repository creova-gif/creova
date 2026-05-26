import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageSEO } from '../components/PageSEO';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { FloatingOrbs } from '../components/FloatingOrbs';
import { SplitText } from '../components/SplitText';
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

function ProjectCard({ project, index }: { project: typeof PROJECTS[number]; index: number }) {
  return (
    <RevealOnScroll mode='3d' delay={index * 0.07}>
      <motion.a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden rounded-2xl cursor-pointer"
        style={{ aspectRatio: '4/3', backgroundColor: '#111' }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Image */}
        <img
          src={project.image}
          alt={`${project.title} — ${project.subtitle}`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ objectPosition: project.objectPosition }}
        />

        {/* Base gradient */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.4) 45%, rgba(10,10,10,0.1) 100%)'
        }} />

        {/* Hover overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400" style={{
          background: `linear-gradient(135deg, ${project.accent}22 0%, rgba(10,10,10,0.3) 100%)`
        }} />

        {/* Category pill — top left */}
        <div className="absolute top-4 left-4">
          <span
            className="text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 rounded-full"
            style={{ backgroundColor: `${project.accent}22`, color: project.accent, border: `1px solid ${project.accent}55` }}
          >
            {project.category === 'brand' ? 'Brand' : project.category === 'conference' ? 'Conference' : project.category === 'sports' ? 'Sports' : 'Event'}
          </span>
        </div>

        {/* Year — top right */}
        <div className="absolute top-4 right-4">
          <span className="text-[10px] tracking-[0.25em]" style={{ color: 'rgba(245,241,235,0.5)' }}>{project.year}</span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div
            className="w-8 mb-3 transition-all duration-400 group-hover:w-12"
            style={{ height: '1px', backgroundColor: project.accent }}
          />
          <p className="text-xs tracking-[0.3em] uppercase mb-1 transition-colors duration-300" style={{ color: project.accent }}>
            {project.org}
          </p>
          <h3 className="text-xl tracking-tight leading-tight mb-0.5" style={{ color: '#F5F1EB' }}>
            {project.title}
          </h3>
          <p className="text-sm mb-4" style={{ color: 'rgba(245,241,235,0.55)' }}>{project.subtitle}</p>

          {/* CTA — slides up on hover */}
          <div className="flex items-center gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
            <span className="text-xs tracking-[0.2em] uppercase" style={{ color: project.accent }}>View Gallery</span>
            <ExternalLink className="w-3.5 h-3.5" style={{ color: project.accent }} />
          </div>
        </div>
      </motion.a>
    </RevealOnScroll>
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

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#080808' }}>
        <FloatingOrbs />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 60% 80% at 15% 50%, rgba(166,143,89,0.08) 0%, transparent 60%),
                       radial-gradient(ellipse 40% 60% at 85% 40%, rgba(177,100,59,0.06) 0%, transparent 55%)`
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(166,143,89,0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(166,143,89,0.4), transparent)' }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-10"
          >
            <div style={{ height: '1px', width: '48px', backgroundColor: '#A68F59' }} />
            <span className="text-xs tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>Selected Work</span>
          </motion.div>

          <div className="mb-10">
            <SplitText
              text="Our"
              tag="h1"
              mode="chars"
              stagger={0.04}
              className="font-light tracking-tight block"
              style={{ fontSize: 'clamp(72px, 14vw, 160px)', color: '#F5F1EB', lineHeight: 0.9 }}
            />
            <SplitText
              text="Work."
              tag="h1"
              mode="chars"
              stagger={0.04}
              delay={0.1}
              className="font-light tracking-tight block"
              style={{
                fontSize: 'clamp(72px, 14vw, 160px)',
                lineHeight: 0.9,
                backgroundImage: 'linear-gradient(135deg, #A68F59 0%, #F5F1EB 70%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row sm:items-end gap-6 justify-between"
          >
            <p className="text-lg leading-relaxed max-w-xl" style={{ color: '#7A6F66' }}>
              Photography and brand content for BIPOC-led organizations, cultural events,
              and community institutions across Niagara and Ontario.
            </p>

            {/* Stats strip */}
            <div className="flex gap-8 flex-shrink-0">
              {[
                { n: '10', l: 'Galleries' },
                { n: '100+', l: 'Events Shot' },
                { n: '2024', l: 'Active' },
              ].map((s, i) => (
                <div key={i} className="text-right">
                  <div className="text-2xl font-light tracking-tight" style={{ color: '#A68F59' }}>{s.n}</div>
                  <div className="text-[10px] tracking-[0.3em] uppercase" style={{ color: '#4A3E36' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="sticky top-16 z-40" style={{ backgroundColor: '#0E0E0E', borderBottom: '1px solid rgba(166,143,89,0.15)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-1 py-3 scrollbar-hide">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 flex-shrink-0"
                style={{
                  backgroundColor: activeTab === tab.id ? 'rgba(166,143,89,0.15)' : 'transparent',
                  color: activeTab === tab.id ? '#A68F59' : '#4A3E36',
                  border: activeTab === tab.id ? '1px solid rgba(166,143,89,0.4)' : '1px solid transparent',
                }}
                onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.color = '#A68F59'; }}
                onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.color = '#4A3E36'; }}
              >
                <span className="text-xs tracking-wide">{tab.label}</span>
                <span
                  className="text-[10px] w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: activeTab === tab.id ? 'rgba(166,143,89,0.3)' : 'rgba(255,255,255,0.05)',
                    color: activeTab === tab.id ? '#A68F59' : '#4A3E36'
                  }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Pixieset full gallery CTA */}
      <section className="py-20 relative overflow-hidden" style={{ borderTop: '1px solid rgba(166,143,89,0.15)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(166,143,89,0.06) 0%, transparent 70%)'
        }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <RevealOnScroll mode='3d'>
            <div>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
                <span className="text-xs tracking-[0.45em] uppercase" style={{ color: '#A68F59' }}>Full Portfolio</span>
                <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              </div>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4" style={{ color: '#F5F1EB' }}>
                See every photo in full resolution
              </h2>
              <p className="text-base mb-8 leading-relaxed" style={{ color: '#7A6F66' }}>
                Every gallery is available on our Pixieset portfolio with full-resolution downloads.
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
                  style={{ backgroundColor: 'transparent', borderColor: 'rgba(166,143,89,0.4)', color: '#A68F59' }}
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
