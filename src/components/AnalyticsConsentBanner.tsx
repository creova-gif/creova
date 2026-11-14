import { useEffect, useId, useState } from 'react';
import { Link } from '../i18n/LocaleLink';
import { useLanguage } from '../context/LanguageContext';
import {
  enableAnalyticsVendors,
  getAnalyticsConsent,
  PRIVACY_CHOICES_EVENT,
  revokeAnalyticsConsent,
  setAnalyticsConsent,
  type AnalyticsConsent,
} from '../analytics/consent';

export function AnalyticsConsentBanner() {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const titleId = useId();
  const [choice, setChoice] = useState<AnalyticsConsent | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const saved = getAnalyticsConsent();
    queueMicrotask(() => {
      if (cancelled) return;
      setChoice(saved);
      setOpen(saved === null);
      setReady(true);
    });
    if (saved === 'granted') void enableAnalyticsVendors();

    const showChoices = () => setOpen(true);
    window.addEventListener(PRIVACY_CHOICES_EVENT, showChoices);
    return () => {
      cancelled = true;
      window.removeEventListener(PRIVACY_CHOICES_EVENT, showChoices);
    };
  }, []);

  const choose = (next: AnalyticsConsent) => {
    const previous = choice;
    setAnalyticsConsent(next);
    setChoice(next);
    setOpen(false);

    if (next === 'granted') {
      void enableAnalyticsVendors();
      return;
    }

    revokeAnalyticsConsent();
    if (previous === 'granted') window.location.reload();
  };

  if (!ready || !open) return null;

  return (
    <section
      className="fixed inset-x-4 bottom-4 z-[400] mx-auto max-w-3xl rounded-2xl border p-5 shadow-2xl sm:p-6"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#CDBFAE', color: '#2D1011' }}
      role="region"
      aria-labelledby={titleId}
    >
      <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-[10px] uppercase tracking-[.28em]" style={{ color: '#7D6D51' }}>
            {fr ? 'Vos choix de confidentialité' : 'Your privacy choices'}
          </p>
          <h2 id={titleId} className="mt-2 text-xl font-medium">
            {fr ? 'Mesure utile, avec votre accord.' : 'Useful measurement, with your permission.'}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: '#5F5651' }}>
            {fr
              ? 'Avec votre accord, nous utilisons Google Tag Manager, Google Analytics et Contentsquare pour comprendre la performance et améliorer l’expérience. Refuser ne change pas le fonctionnement du site.'
              : 'With your permission, we use Google Tag Manager, Google Analytics, and Contentsquare to understand performance and improve the experience. Declining does not affect how the site works.'}
          </p>
          <Link to="/privacy-policy" className="mt-3 inline-flex text-xs underline underline-offset-4">
            {fr ? 'Lire la politique de confidentialité' : 'Read the privacy policy'}
          </Link>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <button
            type="button"
            onClick={() => choose('denied')}
            className="creova-touch-target rounded-xl border px-5 py-3 text-sm font-semibold"
            style={{ borderColor: '#7D6D51', color: '#2D1011' }}
          >
            {fr ? 'Refuser' : 'Decline'}
          </button>
          <button
            type="button"
            onClick={() => choose('granted')}
            className="creova-touch-target rounded-xl px-5 py-3 text-sm font-semibold"
            style={{ backgroundColor: '#2D1011', color: '#FFFFFF' }}
          >
            {fr ? 'Accepter la mesure' : 'Allow analytics'}
          </button>
        </div>
      </div>
    </section>
  );
}
