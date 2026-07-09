import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router';
import { Menu, X, ShoppingCart, ChevronDown, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { CartDrawer } from './CartDrawer';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Magnetic } from './Magnetic';
import creovaLogo from '../assets/creova-logo.png';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [pricingDesktopOpen, setPricingDesktopOpen] = useState(false);
  const [pricingMobileOpen, setPricingMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { t } = useLanguage();

  // Lock body scroll while drawer open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const navLinks = [
    { name: 'Work', path: '/work' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.shop'), path: '/shop' },
    { name: 'Digital', path: '/digital-products' },
    { name: t('nav.experience'), path: '/experience' },
    { name: t('nav.community'), path: '/community' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const pricingCategories = [
    { name: t('nav.pricing.all.label'), path: '/pricing', description: t('nav.pricing.all.desc') },
    { name: t('nav.pricing.family'), path: '/pricing#family', description: t('nav.pricing.family.desc') },
    { name: t('nav.pricing.brand'), path: '/pricing#brand', description: t('nav.pricing.brand.desc') },
    { name: t('nav.pricing.product'), path: '/pricing#commerce', description: t('nav.pricing.product.desc') },
    { name: t('nav.pricing.aerial'), path: '/pricing#aerial', description: t('nav.pricing.aerial.desc') },
    { name: t('nav.pricing.events'), path: '/pricing#events', description: t('nav.pricing.events.desc') },
    { name: t('nav.pricing.social'), path: '/pricing#social', description: t('nav.pricing.social.desc') },
    { name: t('nav.pricing.design'), path: '/pricing#design', description: t('nav.pricing.design.desc') },
  ];

  return (
    <>
      <nav className="border-b bg-[#F5F1EB]" style={{ borderColor: '#E3DCD3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center group" onClick={() => setIsOpen(false)}>
              <img 
                src={creovaLogo} 
                alt="CREOVA - Creative Stories, Digital Impact" 
                width={48}
                height={48}
                className="h-12 w-auto transition-all duration-300 group-hover:scale-105 aspect-square"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className="px-3.5 py-1.5 rounded-lg transition-all duration-250 text-sm tracking-wide font-medium"
                  style={({ isActive }) => ({
                    color: isActive ? '#B1643B' : '#4A3E36',
                    backgroundColor: isActive ? 'rgba(177,100,59,0.08)' : 'transparent',
                  })}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.getAttribute('aria-current')) {
                      e.currentTarget.style.color = '#B1643B';
                      e.currentTarget.style.backgroundColor = 'rgba(177,100,59,0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.getAttribute('aria-current')) {
                      e.currentTarget.style.color = '#4A3E36';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {({ isActive }) => (
                    <span aria-current={isActive ? 'page' : undefined}>
                      {link.name}
                    </span>
                  )}
                </NavLink>
              ))}

              {/* SEEN Platform Link */}
              <Link
                to="/seen"
                title="SEEN — CREOVA Community Platform"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 hover:opacity-80 ml-2"
                style={{ backgroundColor: '#121212', color: '#F5F1EB', border: '1px solid rgba(166,143,89,0.4)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#A68F59' }} />
                SEEN
              </Link>

              {/* Pricing Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setPricingDesktopOpen(true)}
                onMouseLeave={() => setPricingDesktopOpen(false)}
              >
                <button
                  className="px-4 py-2 transition-colors duration-300 text-sm tracking-wide font-medium flex items-center hover:bg-transparent"
                  style={{ color: pricingDesktopOpen ? '#B1643B' : '#4A3E36' }}
                  aria-haspopup="true"
                  aria-expanded={pricingDesktopOpen}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setPricingDesktopOpen(!pricingDesktopOpen);
                    }
                    if (e.key === 'Escape') setPricingDesktopOpen(false);
                  }}
                >
                  {t('nav.pricing')}
                  <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${pricingDesktopOpen ? 'rotate-180' : ''}`} />
                </button>

                {pricingDesktopOpen && (
                  <div 
                    className="absolute left-0 mt-0 w-80 rounded-lg shadow-2xl overflow-hidden z-50"
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3DCD3' }}
                  >
                    {pricingCategories.map((category, index) => (
                      <Link
                        key={category.path}
                        to={category.path}
                        onClick={() => setPricingDesktopOpen(false)}
                        className={`block px-5 py-3 transition-all duration-200 ${index === 0 ? 'border-b-2' : ''}`}
                        style={{ 
                          borderColor: index === 0 ? '#A68F59' : 'transparent',
                          backgroundColor: '#FFFFFF'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F5F1EB';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                        }}
                      >
                        <div className="text-sm font-medium" style={{ color: '#121212' }}>
                          {category.name}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: '#7A6F66' }}>
                          {category.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cart & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher - Desktop */}
              <div className="hidden lg:flex">
                <LanguageSwitcher />
              </div>

              {/* Book a Call — primary conversion CTA */}
              <Magnetic strength={0.2} className="hidden lg:inline-flex">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:-translate-y-px"
                  style={{ backgroundColor: '#121212', color: '#F5F1EB', border: '1px solid rgba(166,143,89,0.25)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#A68F59' }} />
                  {t('nav.book.call')}
                </Link>
              </Magnetic>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCartOpen(true)}
                className="relative hover:bg-transparent"
                style={{ color: '#121212' }}
                aria-label={t('nav.cart.aria')}
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    style={{ backgroundColor: '#B1643B' }}
                  >
                    {totalItems}
                  </span>
                )}
              </Button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden transition-colors"
                style={{ color: '#121212' }}
                aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

        </div>
      </nav>

      {/* ── FULL-SCREEN MOBILE DRAWER ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[200] lg:hidden flex flex-col overflow-y-auto"
            style={{ backgroundColor: '#080808' }}
          >
            {/* Header row */}
            <div
              className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-b"
              style={{ borderColor: 'rgba(166,143,89,0.12)' }}
            >
              <Link to="/" onClick={() => setIsOpen(false)}>
                <img src={creovaLogo} alt="CREOVA" className="h-10 w-auto" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
                style={{ color: '#F5F1EB', backgroundColor: 'rgba(245,241,235,0.06)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links — large editorial */}
            <div className="flex-1 px-6 py-6">
              {[...navLinks, { name: 'Memberships', path: '/memberships' }, { name: 'Book a Session', path: '/booking' }].map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 + 0.05, duration: 0.3 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between py-4 border-b group"
                    style={{ borderColor: 'rgba(166,143,89,0.08)' }}
                  >
                    <span
                      className="font-light tracking-tight transition-colors duration-200 group-hover:text-[#A68F59]"
                      style={{ fontSize: 'clamp(24px, 6vw, 34px)', color: '#F5F1EB' }}
                    >
                      {link.name}
                    </span>
                    <ArrowUpRight
                      className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
                      style={{ color: '#A68F59' }}
                    />
                  </Link>
                </motion.div>
              ))}

              {/* Pricing sub-links */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (navLinks.length + 2) * 0.04 + 0.05, duration: 0.3 }}
              >
                <button
                  onClick={() => setPricingMobileOpen(!pricingMobileOpen)}
                  className="w-full flex items-center justify-between py-4 border-b"
                  style={{ borderColor: 'rgba(166,143,89,0.08)' }}
                >
                  <span className="font-light tracking-tight" style={{ fontSize: 'clamp(24px, 6vw, 34px)', color: '#F5F1EB' }}>
                    {t('nav.pricing')}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${pricingMobileOpen ? 'rotate-180' : ''}`}
                    style={{ color: '#A68F59' }}
                  />
                </button>
                <AnimatePresence>
                  {pricingMobileOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 py-2 space-y-1">
                        {pricingCategories.map(cat => (
                          <Link
                            key={cat.path}
                            to={cat.path}
                            onClick={() => { setIsOpen(false); setPricingMobileOpen(false); }}
                            className="block py-2.5 px-3 rounded-lg transition-colors"
                            style={{ color: 'rgba(245,241,235,0.6)' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#A68F59'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,241,235,0.6)'}
                          >
                            <div className="text-sm">{cat.name}</div>
                            <div className="text-xs mt-0.5" style={{ color: 'rgba(245,241,235,0.3)' }}>{cat.description}</div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* SEEN link */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (navLinks.length + 3) * 0.04 + 0.05, duration: 0.3 }}
              >
                <Link
                  to="/seen"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 py-4 border-b"
                  style={{ borderColor: 'rgba(166,143,89,0.08)' }}
                >
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#A68F59' }} />
                  <span className="font-light tracking-tight" style={{ fontSize: 'clamp(24px, 6vw, 34px)', color: '#A68F59' }}>
                    SEEN
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Bottom bar */}
            <div className="px-6 pb-10 pt-6 flex-shrink-0 space-y-4 border-t" style={{ borderColor: 'rgba(166,143,89,0.12)' }}>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold tracking-wide"
                style={{ backgroundColor: '#B1643B', color: '#F5F1EB' }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#F5F1EB' }} />
                {t('nav.book.call.mobile')}
              </Link>
              <div className="flex justify-center">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}