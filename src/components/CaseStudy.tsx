import { motion } from 'motion/react';
import { ArrowRight, ExternalLink, Quote } from 'lucide-react';
import { Link } from '../i18n/LocaleLink';

import { useLanguage } from '../context/LanguageContext';
import logoBSSC from '../assets/logo-bssc.png';

export function CaseStudy() {
  const { t } = useLanguage();

  return (
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-px" style={{ backgroundColor: '#B1643B' }} />
            <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#B1643B' }}>{t('casestudy.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl tracking-tight" style={{ color: '#121212' }}>
            {t('casestudy.heading')}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* ── Featured Testimonial — Monique Beauregard ───────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl"
            style={{ backgroundColor: '#121212', minHeight: '480px' }}
          >
            {/* Portrait background */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'url(/photo-monique-bssc.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center 20%',
                filter: 'grayscale(15%) contrast(1.08)',
                opacity: 0.6,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(18,18,18,0.95) 0%, rgba(18,18,18,0.55) 50%, rgba(18,18,18,0.15) 100%)',
              }}
            />

            <div
              className="relative h-full p-10 flex flex-col justify-end"
              style={{ minHeight: '480px' }}
            >
              {/* BSSC logo + badge */}
              <div className="flex items-center gap-3 mb-6">
                <img
                  src={logoBSSC}
                  alt="Brock University Black Student Success Centre"
                  className="h-7 w-auto"
                  style={{ filter: 'brightness(0) invert(1) opacity(0.6)' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span
                  className="text-xs tracking-wider uppercase px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: 'rgba(166,143,89,0.15)',
                    border: '1px solid rgba(166,143,89,0.3)',
                    color: '#A68F59',
                  }}
                >
                  {t('casestudy.tag.1')}
                </span>
              </div>

              {/* Quote mark */}
              <Quote
                className="w-10 h-10 mb-4 opacity-30"
                style={{ color: '#A68F59' }}
              />

              <blockquote
                className="text-lg md:text-xl leading-relaxed mb-6 font-light"
                style={{ color: '#F5F1EB', fontFamily: 'var(--font-display)' }}
              >
                {t('casestudy.quote')}
              </blockquote>

              <div className="pt-5 border-t" style={{ borderColor: 'rgba(166,143,89,0.2)' }}>
                <p className="text-base font-semibold mb-0.5" style={{ color: '#F5F1EB' }}>
                  {t('casestudy.author.name')}
                </p>
                <p className="text-sm" style={{ color: '#A68F59' }}>
                  {t('casestudy.author.org')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Right column: Brock LINC + Black Print ───────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Brock LINC Innovation Showcase */}
            <motion.a
              href="https://www.linkedin.com/posts/brock-linc_innovationshowcase2027-activity-7435428477895569408-uYf7"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl flex-1"
              style={{
                backgroundColor: '#111111',
                border: '1px solid rgba(166,143,89,0.15)',
                minHeight: '200px',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(166,143,89,0.4)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(166,143,89,0.15)'; }}
            >
              {/* Card image */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/7' }}>
                <img
                  src="/card-justin-panel.jpg"
                  alt="Justin Mafie presenting CREOVA at the Innovation Showcase at Brock University LINC"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  style={{ objectPosition: 'center 20%' }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 60%, transparent 100%)',
                  }}
                />
                <div
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: 'rgba(166,143,89,0.9)', color: '#121212' }}
                >
                  <ExternalLink className="w-3 h-3" />
                  {t('casestudy.card1.badge')}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs tracking-widest uppercase px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: 'rgba(166,143,89,0.1)',
                      border: '1px solid rgba(166,143,89,0.2)',
                      color: '#A68F59',
                    }}
                  >
                    {t('casestudy.card1.tag')}
                  </span>
                  <span className="text-xs" style={{ color: '#4A3E36' }}>{t('casestudy.card1.org')}</span>
                </div>
                <h3 className="text-lg tracking-tight mb-2" style={{ color: '#F5F1EB' }}>
                  {t('casestudy.card1.title')}
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#7A6F66' }}>
                  {t('casestudy.card1.desc')}
                </p>
                <div
                  className="flex items-center gap-2 text-sm group-hover:translate-x-2 transition-transform duration-300"
                  style={{ color: '#A68F59' }}
                >
                  <span>{t('casestudy.card1.link')}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.a>

            {/* The Black Print */}
            <motion.a
              href="https://www.instagram.com/creova.ca"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl flex-1"
              style={{
                backgroundColor: '#111111',
                border: '1px solid rgba(177,100,59,0.15)',
                minHeight: '200px',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(177,100,59,0.4)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(177,100,59,0.15)'; }}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/7' }}>
                <img
                  src="/card-blackprint-session.jpg"
                  alt="The Black Print closing session at the Black Student Success Centre"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  style={{ objectPosition: 'center 40%' }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 60%, transparent 100%)',
                  }}
                />
                <div
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: 'rgba(177,100,59,0.9)', color: '#F5F1EB' }}
                >
                  <ExternalLink className="w-3 h-3" />
                  {t('casestudy.card2.badge')}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs tracking-widest uppercase px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: 'rgba(177,100,59,0.1)',
                      border: '1px solid rgba(177,100,59,0.2)',
                      color: '#B1643B',
                    }}
                  >
                    {t('casestudy.card2.tag')}
                  </span>
                  <span className="text-xs" style={{ color: '#4A3E36' }}>{t('casestudy.card2.org')}</span>
                </div>
                <h3 className="text-lg tracking-tight mb-2" style={{ color: '#F5F1EB' }}>
                  {t('casestudy.card2.title')}
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#7A6F66' }}>
                  {t('casestudy.card2.desc')}
                </p>
                <div
                  className="flex items-center gap-2 text-sm group-hover:translate-x-2 transition-transform duration-300"
                  style={{ color: '#B1643B' }}
                >
                  <span>{t('casestudy.card2.link')}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.a>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-500 hover:shadow-xl hover:scale-[1.02]"
                style={{ backgroundColor: '#121212', color: '#F5F1EB' }}
              >
                {t('casestudy.cta.start')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/experience"
                className="text-sm transition-opacity hover:opacity-60"
                style={{ color: '#A68F59' }}
              >
                {t('casestudy.cta.view')}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
