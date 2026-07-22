import { forwardRef, useCallback } from 'react';
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  useLocation,
  useNavigate as useRouterNavigate,
  type LinkProps,
  type NavLinkProps,
  type NavigateOptions,
  type To,
} from 'react-router';
import { localeFromPath, withLocale, type Locale } from './locale';

/** The locale implied by the current URL. */
export function useLocale(): Locale {
  const { pathname } = useLocation();
  return localeFromPath(pathname);
}

function applyLocale(to: To, locale: Locale): To {
  if (typeof to === 'string') return withLocale(to, locale);
  if (to && typeof to === 'object' && typeof to.pathname === 'string') {
    return { ...to, pathname: withLocale(to.pathname, locale) };
  }
  return to;
}

/**
 * Drop-in replacement for react-router's <Link> that keeps the visitor in
 * their current locale. Deliberately named `Link` so adopting it is a one-line
 * import swap per file rather than an edit at all 51 call sites.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function LocaleLink(
  { to, ...rest },
  ref
) {
  const locale = useLocale();
  return <RouterLink ref={ref} to={applyLocale(to, locale)} {...rest} />;
});

/** Locale-aware <NavLink>, keeping isActive styling intact. */
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function LocaleNavLink(
  { to, ...rest },
  ref
) {
  const locale = useLocale();
  return <RouterNavLink ref={ref} to={applyLocale(to, locale)} {...rest} />;
});

/**
 * Drop-in replacement for useNavigate that preserves the active locale.
 * Numeric history deltas (navigate(-1)) pass straight through.
 */
export function useNavigate() {
  const navigate = useRouterNavigate();
  const locale = useLocale();

  return useCallback(
    (to: To | number, options?: NavigateOptions) => {
      if (typeof to === 'number') return navigate(to);
      return navigate(applyLocale(to, locale), options);
    },
    [navigate, locale]
  );
}
