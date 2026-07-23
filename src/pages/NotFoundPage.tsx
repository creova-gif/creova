import { Link } from '../i18n/LocaleLink';
import { motion } from 'motion/react';
import { Home, Mail, ArrowRight } from 'lucide-react';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';

const warmGradient = 'linear-gradient(135deg, #A68F59 0%, #B1643B 100%)';

export function NotFoundPage() {
  // Transactional/utility page → vous register.
  const fr = useLanguage().language === 'fr';
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
      <PageSEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has moved."
        path="/404"
        noIndex
      />
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(166,143,89,0.06) 0%, transparent 70%)`
      }} />

      <div className="relative max-w-2xl mx-auto">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-8"
        >
          <div style={{ height: '1px', width: '32px', background: warmGradient }} />
          <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>{fr ? 'CREOVA · Erreur' : 'CREOVA · Error'}</span>
        </motion.div>

        {/* Giant "404" scale contrast */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-light leading-none tracking-tighter"
          style={{ fontSize: 'clamp(100px, 22vw, 280px)', color: '#F5F1EB' }}
          aria-label="404"
        >
          404
        </motion.h1>

        {/* Small italic sub-line */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="italic leading-none mb-10"
          style={{
            fontSize: 'clamp(18px, 3vw, 36px)',
            backgroundImage: warmGradient,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {fr ? "/ Cette page n'existe pas." : "/ This page doesn't exist."}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-sm font-light leading-relaxed mb-10 max-w-xs"
          style={{ color: 'rgba(245,241,235,0.35)' }}
        >
          {fr ? "La page que vous cherchez a été déplacée ou n'a jamais existé. Ramenons-vous en terrain connu." : "The page you're looking for has moved or never existed. Let's get you somewhere real."}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-start gap-3"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm tracking-wide font-medium transition-all duration-300 hover:opacity-90 hover:-translate-y-px"
            style={{ background: warmGradient, color: '#F5F1EB' }}
          >
            <Home size={14} />
            {fr ? "Accueil" : 'Go Home'}
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm tracking-wide transition-all duration-300 hover:opacity-70"
            style={{ border: '1px solid rgba(166,143,89,0.3)', color: '#A68F59' }}
          >
            <Mail size={14} />
            {fr ? 'Nous joindre' : 'Contact Us'}
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
