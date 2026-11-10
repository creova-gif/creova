import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { Link } from '../i18n/LocaleLink';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';
import { useFocusTrap } from '../hooks/useFocusTrap';

export function Navigation() {
  const { language } = useLanguage();
  const location = useLocation();
  const fr = language === 'fr';
  const [open, setOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const closeMenu = useCallback(() => setOpen(false), []);
  const currentPath = location.pathname.replace(/^\/fr(?=\/|$)/, '') || '/';

  useFocusTrap(mobileMenuRef, open, closeMenu);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const links = fr
    ? [['Travail', '/work'], ['Services', '/services'], ['Ressources', '/resources'], ['Communauté', '/community'], ['Nos marques', '/ventures'], ['À propos', '/about']]
    : [['Work', '/work'], ['Services', '/services'], ['Resources', '/resources'], ['Community', '/community'], ['Our Brands', '/ventures'], ['About', '/about']];

  return (
    <nav className="relative border-b" style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0' }} aria-label={fr ? 'Navigation principale' : 'Primary navigation'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" aria-label="CREOVA" onClick={closeMenu} aria-current={currentPath === '/' ? 'page' : undefined}><Logo variant="navy" animateIn className="h-10 w-auto" interactive /></Link>

        <div className="hidden lg:flex items-center gap-5 xl:gap-7">
          {links.map(([label, path]) => <Link key={path} to={path} aria-current={currentPath === path ? 'page' : undefined} className="text-sm transition-colors hover:text-[#75664C] aria-[current=page]:font-semibold aria-[current=page]:underline aria-[current=page]:underline-offset-8" style={{ color: '#2D1011' }}>{label}</Link>)}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block"><LanguageSwitcher /></div>
          <Link to="/start-a-project" onClick={closeMenu} aria-current={currentPath === '/start-a-project' ? 'page' : undefined} className="hidden md:inline-flex rounded-xl px-5 py-2.5 text-sm font-semibold" style={{ backgroundColor: '#2D1011', color: '#FFFFFF' }}>{fr ? 'Démarrer un projet' : 'Start a project'}</Link>
          <button type="button" onClick={() => setOpen(value => !value)} className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl" style={{ border: '1px solid #D5D5D5' }} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? (fr ? 'Fermer le menu' : 'Close menu') : (fr ? 'Ouvrir le menu' : 'Open menu')}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div ref={mobileMenuRef} id="mobile-navigation" aria-label={fr ? 'Menu mobile' : 'Mobile menu'} className="lg:hidden fixed inset-x-0 top-[var(--mobile-nav-top,7rem)] bottom-0 z-50 overflow-y-auto" style={{ backgroundColor: '#2D1011' }}>
          <div className="px-6 py-10">
            <div className="grid">
              {links.map(([label, path], index) => <Link key={path} to={path} onClick={closeMenu} aria-current={currentPath === path ? 'page' : undefined} className="flex items-center justify-between py-5 border-b text-3xl font-light aria-[current=page]:text-[#E5C978]" style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,.12)' }}><span>{label}</span><span className="text-xs" style={{ color: '#E5C978' }}>0{index + 1}</span></Link>)}
            </div>
            <Link to="/start-a-project" onClick={closeMenu} aria-current={currentPath === '/start-a-project' ? 'page' : undefined} className="mt-8 flex items-center justify-center rounded-xl px-6 py-4 font-semibold" style={{ backgroundColor: '#CDBFAE', color: '#2D1011' }}>{fr ? 'Démarrer un projet' : 'Start a project'}</Link>
            <div className="sm:hidden mt-6"><LanguageSwitcher /></div>
          </div>
        </div>
      )}
    </nav>
  );
}
