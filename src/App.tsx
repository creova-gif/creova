import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router';
import { AnimatePresence } from 'motion/react';
import { PageTransition } from './components/PageTransition';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { PricingPage } from './pages/PricingPage';
import { ShopPage } from './pages/ShopPage';
import { DigitalProductsPage } from './pages/DigitalProductsPage';
import { EventsCollaboratePage } from './pages/EventsCollaboratePage';
import { CommunityPage } from './pages/CommunityPage';
import { ContactPage } from './pages/ContactPage';
import { BookingPage } from './pages/BookingPage';
import { RentalPage } from './pages/RentalPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { AuthPage } from './pages/AuthPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import MembershipsPage from './pages/MembershipsPage';
import { AdminSubmissionsPage } from './pages/AdminSubmissionsPage';
import { AnalyticsDashboardPage } from './pages/AnalyticsDashboardPage';
import { RefundManagementPage } from './pages/RefundManagementPage';
import { AdminHubPage } from './pages/AdminHubPage';
import { DatabaseAccessPage } from './pages/DatabaseAccessPage';
import { AdminAuth } from './components/AdminAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CartProvider } from './context/CartContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { Toaster } from './components/ui/sonner';
import { BackToTop } from './components/BackToTop';
import { ScrollToTop } from './components/ScrollToTop';
import { ScrollToTopOnMount } from './components/ScrollToTopOnMount';
import { Sankofa } from './components/Sankofa';
import { AnalyticsTracker } from './components/AnalyticsTracker';
import { ExitIntentModal } from './components/ExitIntentModal';
import { ContactInfoBanner } from './components/ContactInfoBanner';
import { SEENPage } from './pages/SEENPage';

function AnimatedRoutes() {
  const location = useLocation();
  return (
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
          <Route path="/admin/database" element={<DatabaseAccessPage />} />
          <Route path="/seen" element={<SEENPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
}

function AppContent() {
  const { language, t, isChanging } = useLanguage();
  
  // Ensure language is always a string
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

      {/* Business Schema - Outside Helmet */}
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
            {
              "@type": "City",
              "name": "Toronto"
            },
            {
              "@type": "City",
              "name": "Niagara Falls"
            },
            {
              "@type": "City",
              "name": "St. Catharines"
            },
            {
              "@type": "State",
              "name": "Ontario"
            }
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
      
      {/* Language-switch flash overlay — cinematic simultaneous content swap */}
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

      {/* Accessibility skip link - hidden unless focused */}
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