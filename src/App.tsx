import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router';
import { AnimatePresence } from 'motion/react';
import { PageTransition } from './components/PageTransition';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { AdminAuth } from './components/AdminAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CartProvider } from './context/CartContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Toaster } from './components/ui/sonner';
import { BackToTop } from './components/BackToTop';
import { ScrollToTop } from './components/ScrollToTop';
import { ScrollToTopOnMount } from './components/ScrollToTopOnMount';
import { Sankofa } from './components/Sankofa';
import { AnalyticsTracker } from './components/AnalyticsTracker';
import { ExitIntentModal } from './components/ExitIntentModal';
import { ContactInfoBanner } from './components/ContactInfoBanner';
import { CustomCursor } from './components/CustomCursor';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { GrainOverlay } from './components/GrainOverlay';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })));
const ShopPage = lazy(() => import('./pages/ShopPage').then(m => ({ default: m.ShopPage })));
const DigitalProductsPage = lazy(() => import('./pages/DigitalProductsPage').then(m => ({ default: m.DigitalProductsPage })));
const EventsCollaboratePage = lazy(() => import('./pages/EventsCollaboratePage').then(m => ({ default: m.EventsCollaboratePage })));
const CommunityPage = lazy(() => import('./pages/CommunityPage').then(m => ({ default: m.CommunityPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const BookingPage = lazy(() => import('./pages/BookingPage').then(m => ({ default: m.BookingPage })));
const RentalPage = lazy(() => import('./pages/RentalPage').then(m => ({ default: m.RentalPage })));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage').then(m => ({ default: m.AuthCallbackPage })));
const MembershipsPage = lazy(() => import('./pages/MembershipsPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage').then(m => ({ default: m.OrderConfirmationPage })));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage').then(m => ({ default: m.PaymentSuccessPage })));
const SEENPage = lazy(() => import('./pages/SEENPage').then(m => ({ default: m.SEENPage })));
const AdminSubmissionsPage = lazy(() => import('./pages/AdminSubmissionsPage').then(m => ({ default: m.AdminSubmissionsPage })));
const AnalyticsDashboardPage = lazy(() => import('./pages/AnalyticsDashboardPage').then(m => ({ default: m.AnalyticsDashboardPage })));
const RefundManagementPage = lazy(() => import('./pages/RefundManagementPage').then(m => ({ default: m.RefundManagementPage })));
const AdminHubPage = lazy(() => import('./pages/AdminHubPage').then(m => ({ default: m.AdminHubPage })));
const DatabaseAccessPage = lazy(() => import('./pages/DatabaseAccessPage').then(m => ({ default: m.DatabaseAccessPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#0A0A0A' }}
      aria-label="Loading page"
    >
      <div
        className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: '#A68F59', borderTopColor: 'transparent' }}
        role="status"
      />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition locationKey={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/digital-products" element={<DigitalProductsPage />} />
            <Route path="/experience" element={<EventsCollaboratePage />} />
            <Route path="/events" element={<Navigate to="/experience" replace />} />
            <Route path="/collaborate" element={<Navigate to="/experience" replace />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/about" element={<Navigate to="/community" replace />} />
            <Route path="/memberships" element={<MembershipsPage />} />
            <Route path="/membership" element={<Navigate to="/memberships" replace />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/rental" element={<RentalPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/admin/submissions" element={<AdminAuth><AdminSubmissionsPage /></AdminAuth>} />
            <Route path="/analytics/dashboard" element={<AdminAuth><AnalyticsDashboardPage /></AdminAuth>} />
            <Route path="/admin/refunds" element={<AdminAuth><RefundManagementPage /></AdminAuth>} />
            <Route path="/admin/hub" element={<AdminAuth><AdminHubPage /></AdminAuth>} />
            <Route path="/admin/database" element={<AdminAuth><DatabaseAccessPage /></AdminAuth>} />
            <Route path="/seen" element={<SEENPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
    </Suspense>
  );
}

function AppContent() {
  const { language, t, isChanging } = useLanguage();
  
  const currentLang = language || 'en';
  const ogLocale = currentLang === 'fr' ? 'fr_CA' : 'en_CA';
  const ogLocaleAlternate = currentLang === 'fr' ? 'en_CA' : 'fr_CA';
  
  return (
    <>
      <Helmet htmlAttributes={{ lang: currentLang }}>
        <title>{t('seo.title')}</title>
        <meta name="description" content={t('seo.description')} />
        <meta name="keywords" content={t('seo.keywords')} />
        <meta property="og:title" content={t('seo.og.title')} />
        <meta property="og:description" content={t('seo.og.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://creova.ca" />
        <meta property="og:locale" content={ogLocale} />
        <meta property="og:locale:alternate" content={ogLocaleAlternate} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('seo.og.title')} />
        <meta name="twitter:description" content={t('seo.og.description')} />
        <link rel="canonical" href="https://creova.ca" />
        <meta name="geo.region" content="CA-ON" />
        <meta name="geo.placename" content="Ontario, Niagara Region" />
        <meta name="geo.position" content="43.0896;-79.0849" />
        <meta name="author" content="CREOVA Creative Agency" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="theme-color" content="#121212" />
      </Helmet>

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "CREOVA Creative Agency",
          "description": t('seo.schema.desc'),
          "url": "https://creova.ca",
          "telephone": "+1-437-260-8925",
          "email": "support@creova.ca",
          "address": {
            "@type": "PostalAddress",
            "addressRegion": "ON",
            "addressCountry": "CA",
            "addressLocality": "Ontario"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "43.0896",
            "longitude": "-79.0849"
          },
          "priceRange": "$$",
          "openingHours": "Mo-Fr 09:00-18:00",
          "sameAs": [
            "https://www.instagram.com/creova.ca"
          ],
          "areaServed": [
            { "@type": "City", "name": "Toronto" },
            { "@type": "City", "name": "Niagara Falls" },
            { "@type": "City", "name": "St. Catharines" },
            { "@type": "State", "name": "Ontario" }
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": t('seo.schema.catalog'),
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": t('seo.schema.photo.name'),
                  "description": t('seo.schema.photo.desc')
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": t('seo.schema.video.name'),
                  "description": t('seo.schema.video.desc')
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": t('seo.schema.brand.name'),
                  "description": t('seo.schema.brand.desc')
                }
              }
            ]
          }
        })
      }} />
      
      <ScrollToTopOnMount />
      
      {isChanging && (
        <div
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{
            backgroundColor: '#080808',
            opacity: 0.18,
            transition: 'opacity 120ms ease',
          }}
          aria-hidden="true"
        />
      )}

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#121212] focus:text-[#F5F1EB] focus:px-4 focus:py-2 focus:rounded"
      >
        {t('a11y.skip.content')}
      </a>
      
      <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
        <ContactInfoBanner />
        <Navigation />
        <main id="main-content" className="flex-grow">
          <AnimatedRoutes />
        </main>
        <Footer />
        <Toaster richColors position="top-right" />
        <BackToTop />
        <Sankofa />
        <AnalyticsTracker />
        <ExitIntentModal />
        <CustomCursor />
        <ScrollProgressBar />
        <GrainOverlay />
      </div>
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </Router>
        </CartProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}
