import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { onCLS, onINP, onLCP, type Metric } from 'web-vitals';
import { apiUrl } from '../utils/api';

export function AnalyticsTracker() {
  const location = useLocation();
  const sessionIdRef = useRef<string>('');
  const visitorIdRef = useRef<string>('');

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

  // Report the three Core Web Vitals to GTM and the existing first-party
  // analytics endpoint. The values stay diagnostic and contain no page text.
  useEffect(() => {
    let active = true;
    const report = (metric: Metric) => {
      if (!active) return;
      const eventData = {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
        navigationType: metric.navigationType,
      };

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'web_vital',
        ...eventData,
      });

      const eventUrl = apiUrl('/track-event');
      if (!eventUrl || !visitorIdRef.current || !sessionIdRef.current) return;
      void fetch(eventUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          visitorId: visitorIdRef.current,
          sessionId: sessionIdRef.current,
          eventName: `web_vital_${metric.name.toLowerCase()}`,
          page: window.location.pathname,
          eventData,
        }),
      }).catch(() => undefined);
    };

    onCLS(report);
    onINP(report);
    onLCP(report);
    return () => { active = false; };
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

        // GTM owns vendor configuration. The app emits one explicit SPA event.
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'virtual_page_view',
          page_path: location.pathname,
          page_title: document.title,
          page_location: window.location.href,
        });
      } catch {
        // Silently fail - don't disrupt user experience
      }
    };

    trackPageView();
  }, [location]);

  return null; // This component doesn't render anything
}
