import { useEffect, useRef } from 'react';
import { Link } from '../i18n/LocaleLink';
import { X, ArrowUpRight, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useExploreMenu } from '../context/ExploreMenuContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Magnetic } from './Magnetic';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { Logo } from './Logo';
import logoWatermark from '../assets/logo-mark-white-faint.png';
import { VENTURE_URLS } from '../config';

export function Navigation() {
  const { t } = useLanguage();
  const { isOpen: menuOpen, open: openMenu, close } = useExploreMenu();
  const menuRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useFocusTrap(menuRef, menuOpen, () => close());

  // Public navigation follows the current company architecture: active studio
  // services, owned ventures at their real stage, and community work.
  const groups: Array<{
    key: string;
    label: string;
    tag: string;
    brand: boolean;
    items: Array<{ name: string; path: string; external?: boolean }>;
  }> = [
    {
      key: 'studio',
      label: t('nav.group.studio'),
      tag: t('nav.studio.tag'),
      brand: false,
      items: [
        { name: t('nav.work'), path: '/work' },
        { name: t('nav.services'), path: '/services' },
        { name: t('nav.about'), path: '/about' },
      ],
    },
    {
      key: 'ventures',
      label: t('nav.ventures'),
      tag: t('nav.ventures.tag'),
      brand: true,
      items: [
        { name: 'SEEN — ' + t('nav.seen.status'), path: VENTURE_URLS.seen ?? '/ventures#seen', external: Boolean(VENTURE_URLS.seen) },
        { name: 'VERSE — ' + t('nav.verse.status'), path: VENTURE_URLS.verse ?? '/ventures#verse', external: Boolean(VENTURE_URLS.verse) },
        { name: t('nav.ventures.all'), path: '/ventures' },
      ],
    },
    {
      key: 'community',
      label: t('nav.group.community'),
      tag: '',
      brand: false,
      items: [
        { name: t('nav.community'), path: '/community' },
        { name: t('nav.journal'), path: '/journal' },
        { name: t('nav.start.project'), path: '/start-a-project' },
      ],
    },
  ];

  return (
    <>
      <nav className="border-b bg-[#F8F9FA]" style={{ borderColor: '#E0E0E0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center" onClick={close} aria-label="CREOVA — Creative Stories, Digital Impact">
              <Logo variant="navy" animateIn className="h-10 w-auto" interactive />
            </Link>

            {/* Primary destinations are visible on desktop; Explore holds the
                full studio, venture, and community map. */}
            <div className="hidden lg:flex items-center gap-8">
              {[
                { name: t('nav.work'), path: '/work' },
                { name: t('nav.services'), path: '/services' },
                { name: t('nav.ventures'), path: '/ventures' },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={close}
                  className="text-sm tracking-wide transition-colors duration-200"
                  style={{ color: '#121212' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#B1643B')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#121212')}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right cluster */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex">
                <LanguageSwitcher />
              </div>

              {/* Start a Project — primary conversion CTA */}
              <Magnetic strength={0.2} className="hidden md:inline-flex">
                <Link
                  to="/start-a-project"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:-translate-y-px"
                  style={{ backgroundColor: '#121212', color: '#F8F9FA', border: '1px solid rgba(212,168,67,0.25)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#D4A843' }} />
                  {t('nav.start.project')}
                </Link>
              </Magnetic>

              {/* Explore — opens the full-screen menu (all breakpoints) */}
              <button
                onClick={openMenu}
                aria-haspopup="dialog"
                aria-expanded={menuOpen}
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-sm font-medium tracking-wide transition-all duration-300"
                style={{ backgroundColor: 'rgba(18,18,18,0.06)', color: '#121212', border: '1px solid rgba(18,18,18,0.12)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(212,168,67,0.12)'; e.currentTarget.style.borderColor = 'rgba(212,168,67,0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(18,18,18,0.06)'; e.currentTarget.style.borderColor = 'rgba(18,18,18,0.12)'; }}
              >
                <LayoutGrid className="w-4 h-4" style={{ color: '#D4A843' }} />
                <span>{t('nav.explore')}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── FULL-SCREEN EXPLORE OVERLAY ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[200] flex flex-col overflow-y-auto"
            style={{ backgroundColor: '#121212' }}
          >
            {/* Ambient warm glow */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse 60% 50% at 20% 0%, rgba(212,168,67,0.10) 0%, transparent 55%), radial-gradient(ellipse 50% 50% at 90% 100%, rgba(177,100,59,0.08) 0%, transparent 55%)',
            }} />

            {/* Slowly-turning watermark mark, ambient brand texture — purely
                decorative, so skip it entirely under reduced motion rather
                than just holding it static (matches FloatingOrbs). */}
            {!prefersReduced && (
              <motion.img
                src={logoWatermark}
                alt=""
                aria-hidden="true"
                className="absolute pointer-events-none select-none"
                style={{ width: '70vw', maxWidth: 900, right: '-15vw', top: '10%', opacity: 0.05 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
              />
            )}

            <div
              ref={menuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Explore menu"
              className="relative flex flex-col min-h-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 lg:px-12 py-4 flex-shrink-0 border-b" style={{ borderColor: 'rgba(212,168,67,0.12)' }}>
                <Link to="/" onClick={close} aria-label="CREOVA">
                  <Logo variant="white" className="h-9 w-auto" interactive={false} />
                </Link>
                <button
                  onClick={close}
                  aria-label={t('nav.close')}
                  className="inline-flex items-center gap-2 pl-4 pr-3 py-2 rounded-full text-xs tracking-widest uppercase transition-colors"
                  style={{ color: '#F8F9FA', backgroundColor: 'rgba(248,249,250,0.06)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(248,249,250,0.12)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(248,249,250,0.06)')}
                >
                  {t('nav.close')}
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Current company architecture */}
              <div className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-10 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-12">
                  {groups.map((group, gi) => (
                    <motion.div
                      key={group.key}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 + gi * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {/* Group heading */}
                      <div className="flex items-center gap-2.5 mb-1">
                        {group.brand && (
                          <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ backgroundColor: '#D4A843' }} />
                        )}
                        <span
                          className={group.brand ? 'font-light tracking-tight' : 'text-xs tracking-[0.4em] uppercase'}
                          style={{
                            color: group.brand ? '#F8F9FA' : '#D4A843',
                            fontSize: group.brand ? 'clamp(30px, 4vw, 44px)' : undefined,
                          }}
                        >
                          {group.label}
                        </span>
                      </div>
                      {group.tag && (
                        <p className="text-xs mb-5" style={{ color: 'rgba(248,249,250,0.4)' }}>{group.tag}</p>
                      )}
                      {!group.tag && <div className="mb-5 mt-3" style={{ height: '1px', width: '32px', backgroundColor: 'rgba(212,168,67,0.4)' }} />}

                      {/* Items */}
                      <ul className="space-y-1">
                        {group.items.map((item) => (
                          <li key={item.path}>
                            {item.external ? (
                              <a
                                href={item.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={close}
                                className="group flex items-center justify-between py-2.5 border-b"
                                style={{ borderColor: 'rgba(212,168,67,0.08)' }}
                              >
                                <span className="tracking-tight transition-colors duration-200 group-hover:text-[#D4A843]" style={{ color: '#E0E0E0', fontSize: group.brand ? '0.95rem' : 'clamp(20px, 3.5vw, 28px)', fontWeight: group.brand ? 400 : 300 }}>
                                  {item.name}
                                </span>
                                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0 flex-shrink-0" style={{ color: '#D4A843' }} />
                              </a>
                            ) : (
                              <Link
                                to={item.path}
                                onClick={close}
                                className="group flex items-center justify-between py-2.5 border-b"
                                style={{ borderColor: 'rgba(212,168,67,0.08)' }}
                              >
                                <span className="tracking-tight transition-colors duration-200 group-hover:text-[#D4A843]" style={{ color: '#E0E0E0', fontSize: group.brand ? '0.95rem' : 'clamp(20px, 3.5vw, 28px)', fontWeight: group.brand ? 400 : 300 }}>
                                  {item.name}
                                </span>
                                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0 flex-shrink-0" style={{ color: '#D4A843' }} />
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 lg:px-12 pb-10 pt-6 flex-shrink-0 border-t max-w-7xl w-full mx-auto" style={{ borderColor: 'rgba(212,168,67,0.12)' }}>
                <Link
                  to="/start-a-project"
                  onClick={close}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold tracking-wide"
                  style={{ backgroundColor: '#B1643B', color: '#F8F9FA' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#F8F9FA' }} />
                  {t('nav.start.project')}
                </Link>
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
