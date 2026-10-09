import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { apiUrl } from '../utils/api';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? '';

// Load Google Analytics script
const loadGoogleAnalytics = () => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID || !GA_MEASUREMENT_ID.startsWith('G-')) {
    return;
  }

  // Check if already loaded
  if (document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
    return;
  }

  // Load GA script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false // We'll manually track page views
  });

  // Make gtag globally available
  (window as any).gtag = gtag;
};

export function AnalyticsTracker() {
  const location = useLocation();
  const sessionIdRef = useRef<string>('');
  const visitorIdRef = useRef<string>('');

  // Load Google Analytics on mount
  useEffect(() => {
    loadGoogleAnalytics();
  }, []);

  // Generate or retrieve visitor ID
  useEffect(() => {
    // Get or create visitor ID (persists across sessions)
    let visitorId = localStorage.getItem('creova_visitor_id');
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('creova_visitor_id', visitorId);
    }
    visitorIdRef.current = visitorId;

    // Get or create session ID (lasts for browser session)
    let sessionId = sessionStorage.getItem('creova_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('creova_session_id', sessionId);
    }
    sessionIdRef.current = sessionId;
  }, []);

  // Track page view on every route change. page_exit is not sent:
  // the Worker accepts it and drops it, so the POST only spends a request.
  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Extract UTM parameters from URL
        const searchParams = new URLSearchParams(location.search);
        const utmSource = searchParams.get('utm_source') || '';
        const utmMedium = searchParams.get('utm_medium') || '';
        const utmCampaign = searchParams.get('utm_campaign') || '';

        // Collect analytics data
        const analyticsData = {
          visitorId: visitorIdRef.current,
          sessionId: sessionIdRef.current,
          page: location.pathname,
          referrer: document.referrer || '',
          userAgent: navigator.userAgent,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          utmSource,
          utmMedium,
          utmCampaign
        };

        const pageviewUrl = apiUrl('/track-pageview');
        if (pageviewUrl) {
          await fetch(pageviewUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(analyticsData)
          });
        }

        // Track page view in Google Analytics
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'page_view', {
            page_path: location.pathname,
            page_title: document.title,
            page_location: window.location.href
          });
        }
      } catch {
        // Silently fail - don't disrupt user experience
      }
    };

    trackPageView();
  }, [location]);

  return null; // This component doesn't render anything
}