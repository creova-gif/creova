import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router';
import { AnimatePresence } from 'motion/react';
import { PageTransition } from './components/PageTransition';
import { Helmet, HelmetProvider } from '@dr.pogodin/react-helmet';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { AdminAuth } from './components/AdminAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ExploreMenuProvider } from './context/ExploreMenuContext';
import { SERVICE_AREAS } from './data/serviceAreas';
import { JOURNAL } from './data/journal';
import { CASE_STUDIES } from './data/caseStudies';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Toaster } from './components/ui/sonner';
import { BackToTop } from './components/BackToTop';
import { ScrollToTop } from './components/ScrollToTop';
import { ScrollToTopOnMount } from './components/ScrollToTopOnMount';
import { SupportChat } from './components/SupportChat';
import { AnalyticsTracker } from './components/AnalyticsTracker';
import { ExitIntentModal } from './components/ExitIntentModal';
import { ContactInfoBanner } from './components/ContactInfoBanner';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { GrainOverlay } from './components/GrainOverlay';
import { IntroLoader } from './components/IntroLoader';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const CommunityPage = lazy(() => import('./pages/CommunityPage').then(m => ({ default: m.CommunityPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage').then(m => ({ default: m.TermsOfServicePage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const SEENPage = lazy(() => import('./pages/SEENPage').then(m => ({ default: m.SEENPage })));
const VenturesPage = lazy(() => import('./pages/VenturesPage').then(m => ({ default: m.VenturesPage })));
const AdminSubmissionsPage = lazy(() => import('./pages/AdminSubmissionsPage').then(m => ({ default: m.AdminSubmissionsPage })));
const AnalyticsDashboardPage = lazy(() => import('./pages/AnalyticsDashboardPage').then(m => ({ default: m.AnalyticsDashboardPage })));
const RefundManagementPage = lazy(() => import('./pages/RefundManagementPage').then(m => ({ default: m.RefundManagementPage })));
const AdminHubPage = lazy(() => import('./pages/AdminHubPage').then(m => ({ default: m.AdminHubPage })));
const AdminGalleriesPage = lazy(() => import('./pages/AdminGalleriesPage').then(m => ({ default: m.AdminGalleriesPage })));
const DatabaseAccessPage = lazy(() => import('./pages/DatabaseAccessPage').then(m => ({ default: m.DatabaseAccessPage })));
const WorkPage = lazy(() => import('./pages/WorkPage').then(m => ({ default: m.WorkPage })));
const ServiceAreaPage = lazy(() => import('./pages/ServiceAreaPage').then(m => ({ default: m.ServiceAreaPage })));
const JournalPage = lazy(() => import('./pages/JournalPage').then(m => ({ default: m.JournalPage })));
const JournalPostPage = lazy(() => import('./pages/JournalPostPage').then(m => ({ default: m.JournalPostPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage').then(m => ({ default: m.CaseStudyPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#121212' }}
      aria-label="Loading page"
    >
      <div
        className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: '#D4A843', borderTopColor: 'transparent' }}
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
  { path: 'community', element: <CommunityPage /> },
  { path: 'start-a-project', element: <ContactPage /> },
  { path: 'ventures', element: <VenturesPage /> },
  { path: 'seen', element: <SEENPage /> },
  { path: 'about', element: <AboutPage /> },
  { path: 'terms-of-service', element: <TermsOfServicePage /> },
  { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
  // Service-area SEO landing pages (data-driven — see data/serviceAreas.ts).
  ...SERVICE_AREAS.map((a) => ({ path: a.slug, element: <ServiceAreaPage slug={a.slug} /> })),
  // Journal (blog) — index + one route per post (data-driven — see data/journal.ts).
  { path: 'journal', element: <JournalPage /> },
  ...JOURNAL.map((p) => ({ path: `journal/${p.slug}`, element: <JournalPostPage slug={p.slug} /> })),
  // Case studies — deep-dive proof pages at /work/<slug> (data/caseStudies.ts).
  ...CASE_STUDIES.map((cs) => ({ path: `work/${cs.slug}`, element: <CaseStudyPage slug={cs.slug} /> })),
];

/** Legacy paths kept alive as redirects. English only — they were never localized. */
const LEGACY_REDIRECTS: Array<{ from: string; to: string }> = [
  { from: '/contact', to: '/start-a-project' },
  { from: '/pricing', to: '/services#event-story' },
  { from: '/shop', to: '/ventures#verse' },
  { from: '/shop/digital', to: '/ventures' },
  { from: '/digital-products', to: '/ventures' },
  { from: '/events', to: '/services#event-story' },
  { from: '/experience', to: '/services#event-story' },
  { from: '/collaborate', to: '/services#event-story' },
  { from: '/booking', to: '/start-a-project' },
  { from: '/rental', to: '/services' },
  { from: '/checkout', to: '/start-a-project' },
  { from: '/order-confirmation', to: '/start-a-project' },
  { from: '/payment-success', to: '/start-a-project' },
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
            {LEGACY_REDIRECTS.map(({ from, to }) => (
              <Route
                key={`fr-${from}`}
                path={`/fr${from}`}
                element={<Navigate to={`/fr${to}`} replace />}
              />
            ))}
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

  const currentLang = language || 'en';
  const ogLocale = currentLang === 'fr' ? 'fr_CA' : 'en_CA';
  const ogLocaleAlternate = currentLang === 'fr' ? 'en_CA' : 'fr_CA';

  return (
    <>
      {/*
        Site-wide defaults only. Everything page-specific — title, description,
        canonical, robots, og/twitter title+description+url+image, hreflang,
        JSON-LD — is owned per-route by <PageSEO>, which is the single source of
        truth. Duplicating any of those here would ship two of each tag: unlike
        react-helmet-async v2, the React 19-era helmet does not silently dedupe
        competing instances, so overlap must be avoided at the source.
      */}
      <Helmet htmlAttributes={{ lang: currentLang }}>
        <meta name="keywords" content={t('seo.keywords')} />
        <meta property="og:locale" content={ogLocale} />
        <meta property="og:locale:alternate" content={ogLocaleAlternate} />
        <meta name="geo.region" content="CA-ON" />
        <meta name="geo.placename" content="Ontario, Niagara Region" />
        <meta name="geo.position" content="43.0896;-79.0849" />
        <meta name="author" content="CREOVA Creative Agency" />
        <meta name="theme-color" content="#121212" />
      </Helmet>

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "CREOVA Creative Agency",
          "description": t('seo.schema.desc'),
          "url": "https://www.creova.one/",
          "telephone": "+1-437-260-8925",
          "email": "support@creova.one",
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
            "https://www.instagram.com/creativeinnovation__"
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
      <IntroLoader />
      <ScrollToTopOnMount />
      
      {isChanging && (
        <div
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{
            backgroundColor: '#121212',
            opacity: 0.18,
            transition: 'opacity 120ms ease',
          }}
          aria-hidden="true"
        />
      )}

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#121212] focus:text-[#F8F9FA] focus:px-4 focus:py-2 focus:rounded"
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
        <SupportChat />
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
      <ExploreMenuProvider>
        <ScrollToTop />
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </ExploreMenuProvider>
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
