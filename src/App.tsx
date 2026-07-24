import { lazy, Suspense, useEffect } from 'react';
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
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { GrainOverlay } from './components/GrainOverlay';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })));
const ShopPage = lazy(() => import('./pages/ShopPage').then(m => ({ default: m.ShopPage })));
const EventsCollaboratePage = lazy(() => import('./pages/EventsCollaboratePage').then(m => ({ default: m.EventsCollaboratePage })));
const CommunityPage = lazy(() => import('./pages/CommunityPage').then(m => ({ default: m.CommunityPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const BookingPage = lazy(() => import('./pages/BookingPage').then(m => ({ default: m.BookingPage })));
const RentalPage = lazy(() => import('./pages/RentalPage').then(m => ({ default: m.RentalPage })));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage').then(m => ({ default: m.OrderConfirmationPage })));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage').then(m => ({ default: m.PaymentSuccessPage })));
const SEENPage = lazy(() => import('./pages/SEENPage').then(m => ({ default: m.SEENPage })));
const AdminSubmissionsPage = lazy(() => import('./pages/AdminSubmissionsPage').then(m => ({ default: m.AdminSubmissionsPage })));
const AnalyticsDashboardPage = lazy(() => import('./pages/AnalyticsDashboardPage').then(m => ({ default: m.AnalyticsDashboardPage })));
const RefundManagementPage = lazy(() => import('./pages/RefundManagementPage').then(m => ({ default: m.RefundManagementPage })));
const AdminHubPage = lazy(() => import('./pages/AdminHubPage').then(m => ({ default: m.AdminHubPage })));
const AdminGalleriesPage = lazy(() => import('./pages/AdminGalleriesPage').then(m => ({ default: m.AdminGalleriesPage })));
const DatabaseAccessPage = lazy(() => import('./pages/DatabaseAccessPage').then(m => ({ default: m.DatabaseAccessPage })));
const WorkPage = lazy(() => import('./pages/WorkPage').then(m => ({ default: m.WorkPage })));
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

/**
 * Public pages, served at both the bare path (English) and under /fr (French).
 * Paths are relative — the locale prefix is applied when the table is rendered.
 */
const LOCALIZED_ROUTES: Array<{ path: string; element: React.ReactNode }> = [
  { path: '', element: <HomePage /> },
  { path: 'work', element: <WorkPage /> },
  { path: 'services', element: <ServicesPage /> },
  { path: 'pricing', element: <PricingPage /> },
  { path: 'shop', element: <ShopPage /> },
  { path: 'shop/digital', element: <ShopPage /> },
  { path: 'experience', element: <EventsCollaboratePage /> },
  { path: 'community', element: <CommunityPage /> },
  { path: 'contact', element: <ContactPage /> },
  { path: 'booking', element: <BookingPage /> },
  { path: 'rental', element: <RentalPage /> },
  { path: 'seen', element: <SEENPage /> },
  { path: 'terms-of-service', element: <TermsOfServicePage /> },
  { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
];

/** Legacy paths kept alive as redirects. English only — they were never localized. */
const LEGACY_REDIRECTS: Array<{ from: string; to: string }> = [
  { from: '/digital-products', to: '/shop/digital' },
  { from: '/events', to: '/experience' },
  { from: '/collaborate', to: '/experience' },
  { from: '/about', to: '/community' },
];

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition locationKey={location.pathname}>
          <Routes location={location}>
            {/* French first: /fr/x must win over the bare table's catch-alls. */}
            {LOCALIZED_ROUTES.map(({ path, element }) => (
              <Route key={`fr-${path}`} path={`/fr${path ? `/${path}` : ''}`} element={element} />
            ))}
            {LOCALIZED_ROUTES.map(({ path, element }) => (
              <Route key={`en-${path}`} path={`/${path}`} element={element} />
            ))}

            {LEGACY_REDIRECTS.map(({ from, to }) => (
              <Route key={from} path={from} element={<Navigate to={to} replace />} />
            ))}

            {/*
              Transactional: noindex, so intentionally NOT in LOCALIZED_ROUTES
              (kept out of the prerender/hreflang set). But they still need a
              /fr/* route so a French shopper — whose locale-aware navigate()
              sends them to /fr/checkout — stays in French through the flow
              instead of hitting the 404 catch-all.
            */}
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/fr/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/fr/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/fr/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/admin/submissions" element={<AdminAuth><AdminSubmissionsPage /></AdminAuth>} />
            <Route path="/analytics/dashboard" element={<AdminAuth><AnalyticsDashboardPage /></AdminAuth>} />
            <Route path="/admin/refunds" element={<AdminAuth><RefundManagementPage /></AdminAuth>} />
            <Route path="/admin/hub" element={<AdminAuth><AdminHubPage /></AdminAuth>} />
            <Route path="/admin/galleries" element={<AdminAuth><AdminGalleriesPage /></AdminAuth>} />
            <Route path="/admin/database" element={<AdminAuth><DatabaseAccessPage /></AdminAuth>} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
    </Suspense>
  );
}

export function LenisProvider() {
  useEffect(() => {
    let raf: number;
    let lenis: any;
    import(/* @vite-ignore */ 'lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
      const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    }).catch(() => {});
    return () => { cancelAnimationFrame(raf); lenis?.destroy(); };
  }, []);
  return null;
}

function AppContent() {
  const { language, t, isChanging } = useLanguage();
  const location = useLocation();

  const currentLang = language || 'en';
  const ogLocale = currentLang === 'fr' ? 'fr_CA' : 'en_CA';
  const ogLocaleAlternate = currentLang === 'fr' ? 'en_CA' : 'fr_CA';
  const canonicalUrl = `https://creova.ca${location.pathname}`;
  
  return (
    <>
      <Helmet htmlAttributes={{ lang: currentLang }}>
        <title>{t('seo.title')}</title>
        <meta name="description" content={t('seo.description')} />
        <meta name="keywords" content={t('seo.keywords')} />
        <meta property="og:title" content={t('seo.og.title')} />
        <meta property="og:description" content={t('seo.og.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:locale" content={ogLocale} />
        <meta property="og:locale:alternate" content={ogLocaleAlternate} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('seo.og.title')} />
        <meta name="twitter:description" content={t('seo.og.description')} />
        <link rel="canonical" href={canonicalUrl} />
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
      
      {/* <LenisProvider /> disabled: smooth-scroll library made scrolling feel laggy; using native scroll */}
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
        <div className="sticky top-0 z-50 flex flex-col">
          <ContactInfoBanner />
          <Navigation />
        </div>
        <main id="main-content" className="flex-grow">
          <AnimatedRoutes />
        </main>
        <Footer />
        <Toaster richColors position="top-right" />
        <BackToTop />
        <Sankofa />
        <AnalyticsTracker />
        <ExitIntentModal />
        {/* <CustomCursor /> disabled: trailing custom cursor made the site feel laggy; using native cursor */}
        <ScrollProgressBar />
        <GrainOverlay />
      </div>
    </>
  );
}

/**
 * The app tree minus the router and HelmetProvider, so the prerenderer can
 * supply StaticRouter + its own Helmet context while the browser uses
 * BrowserRouter. Not intended for direct use — render <App /> instead.
 */
export function AppShell() {
  return (
    <LanguageProvider>
      <CartProvider>
        <ScrollToTop />
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </CartProvider>
    </LanguageProvider>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppShell />
      </Router>
    </HelmetProvider>
  );
}
