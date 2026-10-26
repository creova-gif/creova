import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Camera, Calendar, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Compact strip of real market-validation data (61-response survey from
 * CREOVA's own pitch deck) — replaces a prior version that used fabricated
 * percentages. Kept deliberately small: a single row, no full section stack.
 */
export function CommunityInsights() {
  const fr = useLanguage().language === 'fr';
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  const stats = [
    { icon: Camera, value: '70.5%', label: fr ? 'Photo et séances créatives' : 'Photography & creative shoots' },
    { icon: Calendar, value: '60.7%', label: fr ? 'Événements et ateliers' : 'Events & workshops' },
    { icon: ShoppingBag, value: '50.8%', label: fr ? 'Contenu réseaux sociaux' : 'Social media content' },
  ];

  return (
    <section
      ref={ref}
      className="py-10 lg:py-12"
      style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E0E0E0', borderBottom: '1px solid #E0E0E0' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10"
        >
          <div className="md:w-64 flex-shrink-0">
            <p className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: '#887759' }}>
              {fr ? 'Validation marché' : 'Market Validation'}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#777777' }}>
              {fr
                ? '61 réponses à notre sondage, de créatifs et de communautés en Afrique, en Amérique du Nord et en Asie.'
                : '61 survey responses from creatives and communities across Africa, North America, and Asia.'}
            </p>
          </div>

          <div className="flex-1 grid grid-cols-3 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <stat.icon className="w-5 h-5 flex-shrink-0" style={{ color: '#C6A45A' }} strokeWidth={1.75} />
                <div>
                  <p className="text-lg sm:text-xl font-semibold leading-none mb-1" style={{ color: '#2D1011', fontFamily: 'var(--font-display)' }}>
                    {stat.value}
                  </p>
                  <p className="text-xs leading-snug" style={{ color: '#777777' }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
