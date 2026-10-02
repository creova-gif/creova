import { Link } from '../i18n/LocaleLink';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';
import { JOURNAL } from '../data/journal';
import { absoluteUrl } from '../i18n/locale';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FR = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

function fmt(iso: string, fr: boolean) {
  const [y, m, d] = iso.split('-');
  return `${(fr ? MONTHS_FR : MONTHS)[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
}

export function JournalPage() {
  const fr = useLanguage().language === 'fr';
  const posts = [...JOURNAL].sort((a, b) => b.date.localeCompare(a.date));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: fr ? 'Le Journal CREOVA' : 'The CREOVA Journal',
    url: absoluteUrl('/journal', fr ? 'fr' : 'en'),
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: (fr ? p.fr : p.en).title,
      datePublished: p.date,
      url: absoluteUrl(`/journal/${p.slug}`, fr ? 'fr' : 'en'),
    })),
  };

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
      <PageSEO
        title={fr ? 'Journal — Guides et perspectives' : 'Journal — Guides & Perspective'}
        description={fr
          ? 'Guides, perspectives et coulisses de CREOVA — photographie, vidéo et création de marque pour les communautés BIPOC en Ontario.'
          : 'Guides, perspective and behind-the-scenes from CREOVA — photography, video and brand craft for BIPOC communities across Ontario.'}
        path="/journal"
        jsonLd={jsonLd}
      />

      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 50% at 20% 0%, rgba(212,168,67,0.10) 0%, transparent 55%)',
        }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 lg:pt-32">
          <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#D4A843' }}>
            {fr ? 'Le Journal' : 'The Journal'}
          </span>
          <h1 className="tracking-tight mt-5 mb-5" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem, 7vw, 4.6rem)', lineHeight: 1.02 }}>
            {fr ? 'Guides & perspectives' : 'Guides & perspective'}
          </h1>
          <p className="text-lg" style={{ color: '#8C7B75', maxWidth: '54ch' }}>
            {fr
              ? 'Ce qu’on a appris à documenter la culture — préparation, métier et points de vue depuis la région de Niagara.'
              : 'What we’ve learned documenting culture — preparation, craft, and point of view from the Niagara Region.'}
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="relative pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 gap-8 lg:gap-10">
            {posts.map((post) => {
              const c = fr ? post.fr : post.en;
              return (
                <Link key={post.slug} to={`/journal/${post.slug}`} className="group block">
                  <article className="h-full flex flex-col overflow-hidden rounded-2xl transition-all duration-300 group-hover:-translate-y-1" style={{ backgroundColor: '#0E0E0E', border: '1px solid rgba(212,168,67,0.12)' }}>
                    <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
                      <img src={post.cover} alt={c.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: 'center 35%' }} />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,14,14,0.6) 0%, transparent 55%)' }} />
                    </div>
                    <div className="flex flex-col flex-1 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] tracking-[0.25em] uppercase px-2.5 py-1 rounded-full" style={{ color: '#D4A843', backgroundColor: 'rgba(212,168,67,0.12)' }}>{post.category}</span>
                        <span className="text-xs" style={{ color: '#777777' }}>{fmt(post.date, fr)} · {post.readMins} {fr ? 'min' : 'min read'}</span>
                      </div>
                      <h2 className="tracking-tight mb-3 transition-colors duration-200 group-hover:text-[#D4A843]" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: '1.5rem', lineHeight: 1.15 }}>{c.title}</h2>
                      <p className="text-sm leading-relaxed" style={{ color: '#8C7B75' }}>{c.excerpt}</p>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
