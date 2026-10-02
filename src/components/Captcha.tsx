import { useEffect, useRef, useState } from 'react';

// Cloudflare Turnstile — replaces Google reCAPTCHA
// Invisible by default, privacy-respecting, works on all domains

interface CaptchaProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: string) => void;
  siteKey?: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'invisible';
}

// Production builds use only VITE_TURNSTILE_SITE_KEY. The Cloudflare always-pass
// test key is confined to the non-production branch so Vite can drop it from
// the production bundle. Do not move that literal into the production branch.
const configuredSiteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY || '').trim();
const DEFAULT_SITE_KEY = import.meta.env.PROD
  ? configuredSiteKey
  : (configuredSiteKey || '1x00000000000000000000AA');

let isScriptLoaded = false;
let isScriptLoading = false;
const scriptCallbacks: (() => void)[] = [];

export function Captcha({
  onVerify,
  onExpire,
  onError,
  siteKey = DEFAULT_SITE_KEY,
  theme = 'light',
}: CaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const isMountedRef = useRef(true);
  const [scriptReady, setScriptReady] = useState(isScriptLoaded);

  // Load the Turnstile script once
  useEffect(() => {
    if (!siteKey) return;
    isMountedRef.current = true;

    if (isScriptLoaded) {
      setScriptReady(true);
      return;
    }

    if (isScriptLoading) {
      const cb = () => { if (isMountedRef.current) setScriptReady(true); };
      scriptCallbacks.push(cb);
      return () => {
        isMountedRef.current = false;
        const i = scriptCallbacks.indexOf(cb);
        if (i > -1) scriptCallbacks.splice(i, 1);
      };
    }

    const existing = document.querySelector('script[src*="turnstile"]');
    if (existing) {
      isScriptLoading = true;
      const cb = () => { if (isMountedRef.current) setScriptReady(true); };
      scriptCallbacks.push(cb);
      return () => {
        isMountedRef.current = false;
        const i = scriptCallbacks.indexOf(cb);
        if (i > -1) scriptCallbacks.splice(i, 1);
      };
    }

    isScriptLoading = true;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (window.turnstile) {
          clearInterval(interval);
          isScriptLoaded = true;
          isScriptLoading = false;
          if (isMountedRef.current) setScriptReady(true);
          scriptCallbacks.forEach(cb => cb());
          scriptCallbacks.length = 0;
        } else if (attempts > 50) {
          clearInterval(interval);
          isScriptLoading = false;
        }
      }, 100);
    };

    script.onerror = () => { isScriptLoading = false; };
    document.body.appendChild(script);

    return () => { isMountedRef.current = false; };
  }, [siteKey]);

  // Render the widget once script is ready
  useEffect(() => {
    if (!scriptReady || !containerRef.current || !window.turnstile || widgetIdRef.current) return;

    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme,
        callback: (token: string) => {
          onVerify(token);
        },
        'expired-callback': () => {
          widgetIdRef.current = null;
          if (onExpire) onExpire();
        },
        'error-callback': () => {
          widgetIdRef.current = null;
          if (onError) onError('Verification failed. Please try again.');
        },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load verification widget.';
      if (onError) onError(msg);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch (_) {}
        widgetIdRef.current = null;
      }
    };
  }, [scriptReady, siteKey, theme, onVerify, onExpire, onError]);

  if (!siteKey) {
    return (
      <p role="alert" className="text-sm text-center" style={{ color: '#991B1B' }}>
        Security verification is unavailable because the Turnstile site key is not configured.
      </p>
    );
  }

  return (
    <div className="flex justify-center">
      <div ref={containerRef} />
    </div>
  );
}

// Turnstile global type declarations
declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, config: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
      getResponse: (widgetId: string) => string;
    };
  }
}
