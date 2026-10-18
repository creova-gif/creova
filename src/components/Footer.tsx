import { useRef } from 'react';
import { Link } from '../i18n/LocaleLink';
import { motion, useInView } from 'motion/react';
import { ArrowUpRight, Mail, Star, MapPin } from 'lucide-react';
import { Logo } from './Logo';
import { SERVICE_AREAS } from '../data/serviceAreas';
import { GOOGLE_REVIEW_URL } from '../config';
import photoInline from '../assets/photo-duo-portrait.jpg';
import { useLanguage } from '../context/LanguageContext';

/* ─── HELPERS ───────────────────────────────────────────────────────────── */

function FooterMarquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden select-none" aria-hidden="true">
      <div
        className="flex whitespace-nowrap animate-marquee"
        style={{ willChange: 'transform', gap: '2.5rem' }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-sm tracking-[0.35em] uppercase flex-shrink-0"
            style={{ color: item === '·' ? '#D4A843' : 'rgba(224,224,224,0.35)' }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function SocialIcon({
  href, label, children,
}: { href: string; label: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ scale: 1.15, y: -3 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300"
      style={{
        backgroundColor: 'rgba(248,249,250,0.05)',
        border: '1px solid rgba(212,168,67,0.18)',
        color: '#777777',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#D4A843'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.45)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#777777'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.18)'; }}
    >
      {children}
    </motion.a>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M5.1 3.5A1.6 1.6 0 1 0 5.1 6.7a1.6 1.6 0 0 0 0-3.2ZM3.7 8.1h2.8v8.4H3.7V8.1Zm4.6 0h2.7v1.1h.04c.38-.72 1.3-1.48 2.67-1.48 2.85 0 3.38 1.88 3.38 4.32v4.45h-2.8v-3.94c0-.94-.02-2.15-1.31-2.15-1.31 0-1.51 1.02-1.51 2.08v4.01H8.3V8.1Z" />
    </svg>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */

export function Footer() {
  const { t, language } = useLanguage();
  const headlineRef = useRef<HTMLDivElement>(null);
  const linksRef    = useRef<HTMLDivElement>(null);
  const headlineInView = useInView(headlineRef, { once: true, margin: '-5% 0px' });
  const linksInView    = useInView(linksRef,    { once: true, margin: '-5% 0px' });

  const COLUMNS: Array<{
    titleKey: string;
    links: Array<{ label?: string; labelKey?: string; href: string; external?: boolean }>;
  }> = [
    {
      titleKey: 'footer.col.services',
      links: [
        { labelKey: 'footer.link.photography', href: '/services#photography' },
        { labelKey: 'footer.link.videography',  href: '/services#videography' },
        { labelKey: 'footer.link.brand',         href: '/services#brand' },
        { labelKey: 'footer.link.aerial',        href: '/services#aerial' },
        { labelKey: 'footer.link.social',        href: '/services#social' },
        { labelKey: 'footer.link.graphic',       href: '/services#brand-design' },
        { labelKey: 'footer.link.events',        href: '/services#event-story' },
      ],
    },
    {
      titleKey: 'footer.col.company',
      links: [
        { labelKey: 'footer.link.story',      href: '/about' },
        { labelKey: 'footer.link.journal',    href: '/journal' },
        { labelKey: 'footer.link.book',       href: '/start-a-project' },
        { labelKey: 'footer.link.community',  href: '/community' },
        { labelKey: 'footer.link.terms',      href: '/terms-of-service' },
        { labelKey: 'footer.link.privacy',    href: '/privacy-policy' },
      ],
    },
    {
      titleKey: 'footer.col.ventures',
      links: [
        { labelKey: 'footer.link.seen',        href: '/seen' },
        { labelKey: 'footer.link.verse',       href: '/ventures#verse' },
        { labelKey: 'footer.link.ventures',    href: '/ventures' },
      ],
    },
    {
      titleKey: 'footer.col.connect',
      links: [
        { label: '@creativeinnovation__',                 href: 'https://instagram.com/creativeinnovation__',              external: true },
        { label: 'LinkedIn',                  href: 'https://www.linkedin.com/company/creovaspace/', external: true },
        { label: 'support@creova.one',         href: 'mailto:support@creova.one',                     external: true },
        { label: t('footer.contact.location'), href: 'https://maps.google.com/?q=Niagara+Region+Ontario+Canada', external: true },
        { labelKey: 'footer.contact.review',  href: GOOGLE_REVIEW_URL,               external: true },
      ],
    },
  ] as const;

  const MARQUEE_ITEMS = [
    t('footer.link.photography'), '·', t('footer.link.videography'), '·', t('footer.link.brand'),
    '·', t('footer.link.aerial'), '·', t('footer.link.social'), '·', t('footer.link.community'),
    '·', t('footer.marquee.bipoc'), '·', t('footer.marquee.ontario'), '·', t('footer.marquee.cultural'),
  ];

  const HEADLINE_TOKENS: Array<string | 'IMAGE'> = [
    t('footer.headline.0'), t('footer.headline.1'), 'IMAGE',
    t('footer.headline.2'), t('footer.headline.3'), t('footer.headline.4'),
  ];

  return (
    <footer
      className="relative overflow-hidden"
      style={{ backgroundColor: '#121212', color: '#E0E0E0' }}
    >
      {/* Ambient radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 60% at 85% 95%, rgba(212,168,67,0.08) 0%, transparent 65%), ' +
            'radial-gradient(ellipse 40% 40% at 15% 85%, rgba(177,100,59,0.05) 0%, transparent 60%)',
        }}
      />
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, #D4A843 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── 1. AVAILABILITY STRIP ──────────────────────────────────────── */}
      <div
        className="relative border-b"
        style={{ borderColor: 'rgba(212,168,67,0.12)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
              style={{ backgroundColor: '#B1643B' }}
            />
            <p className="text-xs tracking-[0.08em]" style={{ color: '#777777' }}>
              <span style={{ color: '#E0E0E0' }}>{t('footer.avail.text')}</span>
              {' '}{t('footer.avail.sub')}
            </p>
          </div>
          <Link
            to="/start-a-project"
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs tracking-[0.12em] uppercase transition-all duration-300 hover:opacity-60"
            style={{ color: '#D4A843' }}
          >
            {t('footer.avail.cta')}
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* ── 2. MEGA CTA ────────────────────────────────────────────────── */}
      <div
        ref={headlineRef}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: 'clamp(5rem, 10vw, 9rem)', paddingBottom: 'clamp(4rem, 7vw, 7rem)' }}
      >
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-end">

          {/* Headline + CTAs */}
          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={headlineInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-10 h-px" style={{ backgroundColor: 'rgba(212,168,67,0.5)' }} />
              <span className="text-xs tracking-[0.45em] uppercase" style={{ color: '#D4A843' }}>
                {t('footer.eyebrow')}
              </span>
            </motion.div>

            {/* Giant headline with inline portrait pill */}
            <h2
              className="leading-[0.9] tracking-tight mb-2 overflow-visible"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.2rem, 8vw, 9rem)',
                color: '#F8F9FA',
              }}
            >
              {HEADLINE_TOKENS.map((token, i) =>
                token === 'IMAGE' ? (
                  <motion.span
                    key="img"
                    className="inline-block align-middle overflow-hidden rounded-full mx-2 md:mx-4 flex-shrink-0"
                    style={{
                      width: 'clamp(4rem, 7vw, 8rem)',
                      height: 'clamp(2.4rem, 4.2vw, 4.8rem)',
                      verticalAlign: '-0.06em',
                      boxShadow: '0 0 0 2px rgba(212,168,67,0.25)',
                    }}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={headlineInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <img
                      src={photoInline}
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center 15%', filter: 'grayscale(20%) contrast(1.08)' }}
                    />
                  </motion.span>
                ) : (
                  <motion.span
                    key={i}
                    className="inline-block mr-[0.22em]"
                    initial={{ opacity: 0, y: 48, rotateX: 18 }}
                    animate={headlineInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                    transition={{ delay: i * 0.09, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
                  >
                    {token === t('footer.headline.4') ? (
                      <span
                        style={{
                          backgroundImage: 'linear-gradient(135deg, #F8F9FA 10%, #D4A843 80%)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                        }}
                      >
                        {token}
                      </span>
                    ) : token}
                  </motion.span>
                )
              )}
            </h2>

            {/* Sub-text */}
            <motion.p
              className="text-base md:text-lg mb-10 max-w-xl leading-relaxed"
              style={{ color: '#777777' }}
              initial={{ opacity: 0 }}
              animate={headlineInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {t('footer.sub')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={headlineInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.95, duration: 0.7 }}
            >
              <Link
                to="/start-a-project"
                className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-xl text-sm font-semibold tracking-wide transition-all duration-400 hover:shadow-[0_8px_32px_rgba(212,168,67,0.2)] hover:-translate-y-0.5"
                style={{ backgroundColor: '#F8F9FA', color: '#121212' }}
              >
                {t('footer.cta.book')}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </Link>
              <Link
                to="/services#event-story"
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl text-sm font-semibold tracking-wide transition-all duration-400 hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'transparent',
                  color: '#D4A843',
                  border: '1px solid rgba(212,168,67,0.3)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.6)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.3)'; }}
              >
                {t('footer.cta.pricing')}
              </Link>
            </motion.div>
          </div>

          {/* Right column — contact quick-info */}
          <motion.div
            className="hidden lg:flex flex-col gap-5 pb-2"
            initial={{ opacity: 0, x: 24 }}
            animate={headlineInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            {[
              { Icon: MapPin, text: t('footer.contact.location') },
              { Icon: Mail,   text: 'support@creova.one', href: 'mailto:support@creova.one' },
              { Icon: Star,   text: t('footer.contact.rating'), href: GOOGLE_REVIEW_URL },
            ].map(({ Icon, text, href }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.14)' }}
                >
                  <Icon className="w-4 h-4" style={{ color: '#D4A843' }} />
                </div>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="text-sm hover:opacity-70 transition-opacity"
                    style={{ color: '#E0E0E0' }}
                  >
                    {text}
                  </a>
                ) : (
                  <span className="text-sm" style={{ color: '#E0E0E0' }}>{text}</span>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── 3. MARQUEE DIVIDER ─────────────────────────────────────────── */}
      <div
        className="relative border-y py-5 overflow-hidden"
        style={{ borderColor: 'rgba(212,168,67,0.1)' }}
      >
        <FooterMarquee items={MARQUEE_ITEMS} />
      </div>

      {/* ── 4. LINKS GRID ──────────────────────────────────────────────── */}
      <div
        ref={linksRef}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: 'clamp(3.5rem, 6vw, 5rem)', paddingBottom: 'clamp(3.5rem, 6vw, 5rem)' }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          {COLUMNS.map((col, colIdx) => (
            <motion.div
              key={colIdx}
              initial={{ opacity: 0, y: 24 }}
              animate={linksInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: colIdx * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Column header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-4 h-px" style={{ backgroundColor: '#D4A843' }} />
                <p
                  className="text-xs tracking-[0.4em] uppercase"
                  style={{ color: '#D4A843' }}
                >
                  {t(col.titleKey)}
                </p>
              </div>

              <ul className="space-y-3.5">
                {col.links.map((link, linkIdx) => {
                  const label = link.labelKey ? t(link.labelKey) : (link.label ?? '');
                  const isExternal = Boolean(link.external);
                  return (
                    <motion.li
                      key={linkIdx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={linksInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: colIdx * 0.1 + linkIdx * 0.05 + 0.15, duration: 0.5 }}
                    >
                      {isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-1.5 text-sm transition-all duration-250"
                          style={{ color: '#777777' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#E0E0E0'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#777777'; }}
                        >
                          {label}
                          {link.href !== '#' && (
                            <ArrowUpRight
                              className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            />
                          )}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-sm transition-all duration-250"
                          style={{ color: '#777777' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#E0E0E0'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#777777'; }}
                        >
                          {label}
                        </Link>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Service areas — internal links so the local landing pages are
            crawlable and discoverable from every page. */}
        <div className="mt-14 pt-8 border-t" style={{ borderColor: 'rgba(248,249,250,0.06)' }}>
          <p className="text-[10px] tracking-[0.35em] uppercase mb-4" style={{ color: '#8C7B75' }}>
            {t('footer.areas.title')}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2.5">
            {SERVICE_AREAS.map((a) => (
              <Link
                key={a.slug}
                to={`/${a.slug}`}
                className="text-xs sm:text-sm transition-colors duration-200"
                style={{ color: '#777777' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#D4A843'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#777777'; }}
              >
                {(language === 'fr' ? a.fr : a.en).kicker}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. BOTTOM BAR ──────────────────────────────────────────────── */}
      <div
        className="relative border-t"
        style={{ borderColor: 'rgba(248,249,250,0.05)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group" aria-label="CREOVA">
              <Logo variant="white" className="h-8 w-auto transition-opacity duration-300 group-hover:opacity-70" interactive={false} />
            </Link>

            {/* Legal strip */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <p className="text-xs" style={{ color: '#8C7B75' }}>
                {t('footer.bottom.rights').replace('{year}', String(new Date().getFullYear()))}
              </p>
            </div>

            {/* Social icons + legal links */}
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2">
                <SocialIcon href="https://instagram.com/creativeinnovation__" label={t('footer.social.instagram')}>
                  <InstagramIcon className="w-4 h-4" />
                </SocialIcon>
                <SocialIcon href="https://www.linkedin.com/company/creovaspace/" label={t('footer.social.linkedin')}>
                  <LinkedInIcon className="w-4 h-4" />
                </SocialIcon>
                <SocialIcon href="mailto:support@creova.one" label={t('footer.social.email')}>
                  <Mail className="w-4 h-4" />
                </SocialIcon>
                <SocialIcon href={GOOGLE_REVIEW_URL} label={t('footer.contact.review')}>
                  <Star className="w-4 h-4" />
                </SocialIcon>
              </div>
              <div className="flex items-center gap-4">
                {[
                  { labelKey: 'footer.legal.terms', href: '/terms-of-service' },
                  { labelKey: 'footer.legal.privacy', href: '/privacy-policy' },
                  { labelKey: 'footer.legal.contact', href: '/start-a-project' },
                ].map(({ labelKey, href }) => (
                  <Link
                    key={href}
                    to={href}
                    className="text-xs transition-opacity duration-200 hover:opacity-70"
                    style={{ color: '#8C7B75' }}
                  >
                    {t(labelKey)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
