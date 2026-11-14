export const ANALYTICS_CONSENT_KEY = 'creova_analytics_consent_v1';
export const ANALYTICS_CONSENT_EVENT = 'creova:analytics-consent-change';
export const PRIVACY_CHOICES_EVENT = 'creova:open-privacy-choices';

export type AnalyticsConsent = 'granted' | 'denied';

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  return value === 'granted' || value === 'denied' ? value : null;
}

export function setAnalyticsConsent(value: AnalyticsConsent): void {
  window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: value }));
}

export function openPrivacyChoices(): void {
  window.dispatchEvent(new Event(PRIVACY_CHOICES_EVENT));
}

export function analyticsAllowed(): boolean {
  return getAnalyticsConsent() === 'granted';
}

export function pushAnalyticsEvent(event: Record<string, unknown>): void {
  if (!analyticsAllowed()) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

let vendorsLoading: Promise<void> | null = null;

export function enableAnalyticsVendors(): Promise<void> {
  if (typeof window === 'undefined' || !analyticsAllowed()) return Promise.resolve();
  if (vendorsLoading) return vendorsLoading;

  vendorsLoading = (async () => {
    window.gtag?.('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });

    if (!document.querySelector('script[data-creova-gtm]')) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      const script = document.createElement('script');
      script.async = true;
      script.dataset.creovaGtm = 'true';
      script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-M6C6BK99';
      document.head.appendChild(script);
    }

    try {
      const { injectContentsquareScript } = await import('@contentsquare/tag-sdk');
      injectContentsquareScript({ clientId: '90b1df2bcdb90' });
    } catch {
      // Analytics must never interrupt the website experience.
    }
  })();

  return vendorsLoading;
}

export function revokeAnalyticsConsent(): void {
  window.gtag?.('consent', 'update', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.localStorage.removeItem('creova_visitor_id');
  window.sessionStorage.removeItem('creova_session_id');
}
