/**
 * Post-build prerender pass.
 *
 * The site is a client-rendered SPA, so crawlers that don't execute JS (and
 * social unfurlers) previously saw only the empty shell in index.html with a
 * single generic title. This renders each public route to static HTML at build
 * time and writes a real index.html per route, so every page ships correct
 * markup plus its own title/description/canonical/OG/JSON-LD.
 *
 * Deliberately excluded: /admin/*, /analytics/*, /checkout, /order-confirmation
 * and /payment-success are all noindex, and the bare redirect paths
 * (/events, /collaborate, /about, /digital-products) resolve client-side.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = join(root, 'build');

const BASE_ROUTES = [
  '/',
  '/about',
  '/work',
  '/services',
  '/pricing',
  '/shop',
  '/shop/digital',
  '/experience',
  '/community',
  '/contact',
  '/booking',
  '/rental',
  '/seen',
  '/terms-of-service',
  '/privacy-policy',
];

// Service-area SEO pages are defined once in src/data/serviceAreas.ts; read
// their slugs from source so adding an entry there auto-prerenders it (Node
// can't import .ts directly, so parse the slug literals as text).
function serviceAreaRoutes() {
  try {
    const src = readFileSync(join(root, 'src/data/serviceAreas.ts'), 'utf8');
    return [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => `/${m[1]}`);
  } catch {
    return [];
  }
}

// Journal: the index plus one route per post (slug parsed from the data file).
function journalRoutes() {
  try {
    const src = readFileSync(join(root, 'src/data/journal.ts'), 'utf8');
    const slugs = [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
    return ['/journal', ...slugs.map((s) => `/journal/${s}`)];
  } catch {
    return ['/journal'];
  }
}

// Case studies live at /work/<slug> (slug parsed from the data file).
function caseStudyRoutes() {
  try {
    const src = readFileSync(join(root, 'src/data/caseStudies.ts'), 'utf8');
    return [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => `/work/${m[1]}`);
  } catch {
    return [];
  }
}

const ALL_BASE = [...BASE_ROUTES, ...serviceAreaRoutes(), ...journalRoutes(), ...caseStudyRoutes()];

// English at the bare path, French under /fr — mirrors src/i18n/locale.ts.
const ROUTES = [
  ...ALL_BASE,
  ...ALL_BASE.map((r) => (r === '/' ? '/fr' : `/fr${r}`)),
];

// Priority hints for the generated sitemap. Anything unlisted defaults to 0.7.
const SITEMAP_PRIORITY = {
  '/': '1.0', '/services': '0.9', '/pricing': '0.9', '/work': '0.8',
  '/contact': '0.8', '/experience': '0.8', '/community': '0.8',
  '/terms-of-service': '0.3', '/privacy-policy': '0.3',
};

// Pages returns 200 for the trailing-slash directory URL (route/index.html)
// and 301s the slashless path. Sitemap locs use that 200 URL.
const SITE_URL = 'https://www.creova.one';

function canonicalLoc(route) {
  const path = route === '/' ? '/' : (route.endsWith('/') ? route : `${route}/`);
  return `${SITE_URL}${path}`;
}

function writeSitemap() {
  const urls = ROUTES.map((r) => {
    const loc = canonicalLoc(r);
    const priority = SITEMAP_PRIORITY[r] ?? (r.startsWith('/fr') ? '0.6' : '0.7');
    const changefreq = r === '/' ? 'weekly' : 'monthly';
    return `  <url><loc>${loc}</loc><priority>${priority}</priority><changefreq>${changefreq}</changefreq></url>`;
  }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  writeFileSync(join(buildDir, 'sitemap.xml'), xml, 'utf8');
  console.log(`[prerender] sitemap.xml written (${ROUTES.length} urls).`);
}

/**
 * Fetch the admin-managed gallery list once and expose it on globalThis, where
 * useGalleries picks it up during SSR. Without it /work prerenders its empty
 * state. A failure here is non-fatal: /work still gets correct head tags, and
 * the browser refetches on mount — we just log loudly so it isn't silent.
 */
async function loadGalleries() {
  // Vite inlines VITE_ for the browser bundle. This script runs in Node, so
  // it reads the same variable from the process environment.
  const base = (process.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
  if (!base) {
    console.warn(
      '[prerender] WARNING: VITE_API_BASE_URL is unset. /work will prerender its empty state.'
    );
    return;
  }
  try {
    const res = await fetch(`${base}/galleries`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const galleries = (data.galleries || []).sort((a, b) => a.order - b.order);
    globalThis.__CREOVA_GALLERIES__ = galleries;
    console.log(`[prerender] loaded ${galleries.length} galleries for SSR`);
  } catch (error) {
    console.warn(
      `[prerender] WARNING: could not load galleries (${error?.message ?? error}). ` +
        `/work will prerender its empty state.`
    );
  }
}

function stripStaticHead(template) {
  // index.html carries a fallback <title> and description for the
  // pre-hydration window. Once Helmet supplies real per-route tags we must
  // remove the fallbacks, or every prerendered page ships two titles and two
  // descriptions — which search engines treat as a duplicate-metadata error.
  return template
    .replace(/\n?\s*<title>[\s\S]*?<\/title>/i, '')
    .replace(/\n?\s*<meta\s+name="description"[^>]*>/i, '')
    .replace(/\n?\s*<meta\s+name="keywords"[^>]*>/i, '')
    .replace(/\n?\s*<meta\s+property="og:(?:type|url|title|description|image|image:width|image:height|site_name|locale)"[^>]*>/gi, '')
    .replace(/\n?\s*<meta\s+name="twitter:(?:card|site|title|description|image)"[^>]*>/gi, '');
}

async function main() {
  const templatePath = join(buildDir, 'index.html');
  if (!existsSync(templatePath)) {
    console.error('[prerender] build/index.html not found — run `vite build` first.');
    process.exit(1);
  }

  const rawTemplate = readFileSync(templatePath, 'utf8');
  const template = stripStaticHead(rawTemplate);

  await loadGalleries();

  const { render } = await import(join(root, '.ssr', 'entry-server.js'));

  let failed = 0;
  for (const route of ROUTES) {
    try {
      const { html, head, htmlAttrs } = await render(route);

      let page = template;

      if (htmlAttrs) {
        page = page.replace(/<html\b[^>]*>/i, `<html ${htmlAttrs}>`);
      }
      if (head) {
        // Helmet serialises React's camelCase prop name verbatim, so hreflang
        // ships as hrefLang. HTML attribute names are case-insensitive so
        // browsers and Google handle it, but plenty of SEO auditors regex for
        // the lowercase form — normalise so it isn't reported as missing.
        page = page.replace('</head>', `  ${head.replace(/\bhrefLang=/g, 'hreflang=')}\n  </head>`);
      }
      page = page.replace(
        /<div id="root">\s*<\/div>/,
        `<div id="root">${html}</div>`
      );

      const outPath =
        route === '/'
          ? join(buildDir, 'index.html')
          : join(buildDir, route.slice(1), 'index.html');

      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, page, 'utf8');

      const titleMatch = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      console.log(
        `[prerender] ${route.padEnd(20)} ${String(html.length).padStart(7)} bytes  ${
          titleMatch ? `"${titleMatch[1].slice(0, 52)}"` : '!! NO TITLE'
        }`
      );
      if (!titleMatch) failed++;
    } catch (error) {
      failed++;
      console.error(`[prerender] FAILED ${route}:`, error?.message ?? error);
    }
  }

  if (failed > 0) {
    console.error(`\n[prerender] ${failed} route(s) failed or produced no title.`);
    process.exit(1);
  }
  writeSitemap();
  console.log(`\n[prerender] ${ROUTES.length} routes written.`);
}

main().catch((error) => {
  console.error('[prerender] fatal:', error);
  process.exit(1);
});
