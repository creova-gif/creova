import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { Menu, X, ShoppingCart, ChevronDown } from 'lucide-react';
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

  const navLinks = [
    { name: 'Work', path: '/work' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.shop'), path: '/shop' },
    { name: t('nav.digital'), path: '/digital-products' },
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
                aria-label={t('nav.cart.aria', { count: totalItems })}
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

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden py-4 space-y-1 border-t" style={{ borderColor: '#E3DCD3' }}>
              {/* Language Switcher - Mobile */}
              <div className="px-4 py-3 border-b" style={{ borderColor: '#E3DCD3' }}>
                <LanguageSwitcher />
              </div>
              
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 px-4 transition-colors text-sm tracking-wide"
                  style={{ color: '#4A3E36' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#B1643B'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#4A3E36'}
                >
                  {link.name}
                </Link>
              ))}

              {/* Memberships & Booking - Mobile only */}
              <Link to="/memberships" onClick={() => setIsOpen(false)} className="block py-3 px-4 text-sm tracking-wide" style={{ color: '#4A3E36' }}>
                Memberships
              </Link>
              <Link to="/booking" onClick={() => setIsOpen(false)} className="block py-3 px-4 text-sm tracking-wide" style={{ color: '#4A3E36' }}>
                Book a Session
              </Link>

              {/* Book a Call - Mobile */}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 mx-4 my-2 px-5 py-3 rounded-xl text-sm font-semibold tracking-wide text-center justify-center"
                style={{ backgroundColor: '#121212', color: '#F5F1EB' }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#A68F59' }} />
                {t('nav.book.call.mobile')}
              </Link>

              {/* SEEN - Mobile */}
              <Link
                to="/seen"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 py-3 px-4 text-sm font-medium tracking-wide"
                style={{ color: '#A68F59' }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#A68F59' }} />
                {t('nav.seen.label')}
              </Link>

              {/* Mobile Pricing Accordion */}
              <div>
                <button
                  onClick={() => setPricingMobileOpen(!pricingMobileOpen)}
                  className="w-full flex items-center justify-between py-3 px-4 transition-colors text-sm tracking-wide"
                  style={{ color: '#4A3E36' }}
                >
                  {t('nav.pricing')}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${pricingMobileOpen ? 'rotate-180' : ''}`} />
                </button>

                {pricingMobileOpen && (
                  <div className="py-2 pl-4 space-y-1" style={{ backgroundColor: '#F5F1EB' }}>
                    {pricingCategories.map((category, index) => (
                      <Link
                        key={category.path}
                        to={category.path}
                        onClick={() => {
                          setIsOpen(false);
                          setPricingMobileOpen(false);
                        }}
                        className={`block py-2 px-4 transition-colors ${index === 0 ? 'border-b pb-3 mb-2' : ''}`}
                        style={{ 
                          color: '#4A3E36',
                          borderColor: index === 0 ? '#A68F59' : 'transparent'
                        }}
                      >
                        <div className="text-sm">{category.name}</div>
                        <div className="text-xs mt-0.5" style={{ color: '#7A6F66' }}>
                          {category.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}