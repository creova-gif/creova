import { useEffect } from 'react';
import { useLocation } from 'react-router';

export function ScrollToTopOnMount() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      let id = hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        // Keep the raw fragment when it is not valid URI-encoded text.
      }

      const scrollToFragment = () => {
        const target = document.getElementById(id);
        if (!target) return false;
        target.scrollIntoView({ block: 'start', behavior: 'instant' });
        return true;
      };

      if (scrollToFragment()) return;

      const observer = new MutationObserver(() => {
        if (scrollToFragment()) observer.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });
      const timeout = window.setTimeout(() => observer.disconnect(), 2000);
      return () => {
        observer.disconnect();
        window.clearTimeout(timeout);
      };
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname, hash]);

  return null;
}
