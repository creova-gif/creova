import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { projectId, publicAnonKey } from '../utils/supabase/info';

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
  const pageLoadTimeRef = useRef<number>(Date.now());

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

  // Track page view on every route change
  useEffect(() => {
    pageLoadTimeRef.current = Date.now();

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

        // Send to backend
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-feacf0d8/track-pageview`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify(analyticsData)
          }
        );

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

    // Track time on page when user leaves
    return () => {
      const timeSpent = Math.floor((Date.now() - pageLoadTimeRef.current) / 1000);
      
      // Track page exit event
      if (timeSpent > 2) { // Only track if spent more than 2 seconds
        trackEvent('page_exit', {
          page: location.pathname,
          timeSpent: timeSpent
        });
      }
    };
  }, [location]);

  // Function to track custom events
  const trackEvent = async (eventName: string, eventData?: any) => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-feacf0d8/track-event`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            visitorId: visitorIdRef.current,
            sessionId: sessionIdRef.current,
            eventName,
            eventData,
            page: location.pathname
          })
        }
      );
    } catch {
      // Silently fail
    }
  };

  return null; // This component doesn't render anything
}