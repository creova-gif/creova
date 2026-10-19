import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from '../i18n/LocaleLink';
import { useLanguage } from '../context/LanguageContext';

/**
 * Founder feature — investors fund people and clients trust faces. Built from
 * verifiable facts only (name on the booth badge, the Brock LINC Innovation
 * Showcase, the Niagara Region, the real "Creative Stories, Digital Impact"
 * tagline). Refine the narrative copy with the founder's own words.
 */
export function FounderSection() {
  const fr = useLanguage().language === 'fr';
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px' });

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#121212' }}>
      {/* ambient warm glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 55% 60% at 78% 30%, rgba(212,168,67,0.08) 0%, transparent 60%), radial-gradient(ellipse 45% 50% at 10% 90%, rgba(177,100,59,0.06) 0%, transparent 60%)',
      }} />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-1 lg:order-none"
          >
            <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: '4/3', border: '1px solid rgba(212,168,67,0.15)' }}>
              <img
                src="/card-justin-panel.jpg"
                alt="Justin Mafie, founder of CREOVA, at the Brock LINC Innovation Showcase"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 30%' }}
                loading="lazy"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(18,18,18,0.55) 0%, transparent 45%)' }} />
              <div className="absolute bottom-4 left-5">
                <p className="text-xs tracking-[0.3em] uppercase" style={{ color: '#D4A843', fontFamily: 'var(--font-display)' }}>
                  {fr ? 'Vitrine d’innovation Brock LINC' : 'Brock LINC Innovation Showcase'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-px" style={{ backgroundColor: '#D4A843' }} />
              <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#D4A843' }}>
                {fr ? 'Le fondateur' : 'The Founder'}
              </span>
            </div>

            <h2 className="tracking-tight mb-1" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', lineHeight: 1.05 }}>
              Justin Mafie
            </h2>
            <p className="text-sm tracking-[0.2em] uppercase mb-7" style={{ color: '#8C7B75' }}>
              {fr ? 'Fondateur — CREOVA' : 'Founder — CREOVA'}
            </p>

            <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color: '#E0E0E0', maxWidth: '54ch' }}>
              {fr
                ? "CREOVA a commencé par quelque chose de simple : en explorant sa ville, Justin a vu d’excellents commerces locaux passer inaperçus — non par manque de talent ou de qualité, mais de représentation et de visibilité. Il a bâti CREOVA autour de la narration visuelle et de l’impact numérique, pour rendre le travail créatif de classe mondiale accessible à toute personne ayant une histoire à raconter."
                : "CREOVA started with something simple: exploring his city, Justin watched excellent local businesses get overlooked — not for lack of talent or quality, but for lack of representation and visibility. He built CREOVA around visual storytelling and digital impact, to make world-class creative work accessible to everyone with a story worth telling."}
            </p>

            <blockquote className="pl-5 mb-9" style={{ borderLeft: '2px solid #B1643B' }}>
              <p className="italic" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.35rem, 2.6vw, 1.7rem)', lineHeight: 1.3 }}>
                {fr ? '« Des histoires créatives. Un impact numérique. »' : '“Creative stories. Digital impact.”'}
              </p>
            </blockquote>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/about"
                className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 hover:-translate-y-px hover:shadow-lg"
                style={{ backgroundColor: '#B1643B', color: '#F8F9FA' }}
              >
                {fr ? 'Lire son histoire' : 'Read the full story'}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/start-a-project"
                className="inline-flex items-center gap-2 text-sm tracking-wide transition-colors duration-200 hover:text-[#D4A843]"
                style={{ color: '#E0E0E0' }}
              >
                {fr ? 'Travaillez avec nous' : 'Work with us'}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
