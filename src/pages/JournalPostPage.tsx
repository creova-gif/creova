import { Link } from '../i18n/LocaleLink';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';
import { getPost, JOURNAL } from '../data/journal';
import { absoluteUrl } from '../i18n/locale';

const SITE_URL = 'https://www.creova.one';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

function fmt(iso: string, fr: boolean) {
  const [y, m, d] = iso.split('-');
  return `${parseInt(d, 10)} ${(fr ? MONTHS_FR : MONTHS)[parseInt(m, 10) - 1]} ${y}`;
}

export function JournalPostPage({ slug }: { slug: string }) {
  const fr = useLanguage().language === 'fr';
  const post = getPost(slug);
  if (!post) return null;
  const c = fr ? post.fr : post.en;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: c.title,
    description: c.metaDescription,
    datePublished: post.date,
    dateModified: post.date,
    image: `${SITE_URL}${post.cover}`,
    author: { '@type': 'Organization', name: 'CREOVA' },
    publisher: { '@type': 'Organization', name: 'CREOVA', url: `${SITE_URL}/` },
    mainEntityOfPage: absoluteUrl(`/journal/${post.slug}`, fr ? 'fr' : 'en'),
    articleSection: post.category,
  };

  const more = JOURNAL.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div style={{ backgroundColor: '#121212' }}>
      <PageSEO title={c.title} description={c.metaDescription} path={`/journal/${slug}`} ogImage={`${SITE_URL}${post.cover}`} jsonLd={jsonLd} />

      <article>
        {/* Header */}
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 55% 50% at 25% 0%, rgba(212,168,67,0.10) 0%, transparent 55%)',
          }} />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 lg:pt-28">
            <Link to="/journal" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase mb-8 transition-colors hover:text-[#D4A843]" style={{ color: '#8C7B75' }}>
              <ArrowLeft className="w-3.5 h-3.5" /> {fr ? 'Le Journal' : 'The Journal'}
            </Link>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[10px] tracking-[0.25em] uppercase px-2.5 py-1 rounded-full" style={{ color: '#D4A843', backgroundColor: 'rgba(212,168,67,0.12)' }}>{post.category}</span>
              <span className="text-xs" style={{ color: '#777777' }}>{fmt(post.date, fr)} · {post.readMins} {fr ? 'min de lecture' : 'min read'}</span>
            </div>
            <h1 className="tracking-tight" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)', lineHeight: 1.05 }}>{c.title}</h1>
          </div>
        </header>

        {/* Cover */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: '16/9', border: '1px solid rgba(212,168,67,0.12)' }}>
            <img src={post.cover} alt={c.title} className="w-full h-full object-cover" style={{ objectPosition: 'center 35%' }} />
          </div>
        </div>

        {/* Body */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="space-y-6">
            {c.body.map((block, i) => {
              if ('h2' in block) {
                return <h2 key={i} className="tracking-tight pt-4" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3.2vw, 2rem)', lineHeight: 1.2 }}>{block.h2}</h2>;
              }
              if ('list' in block) {
                return (
                  <ul key={i} className="space-y-2.5 pl-1">
                    {block.list.map((item, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span className="mt-2.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#D4A843' }} />
                        <span className="leading-relaxed" style={{ color: '#E0E0E0' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return <p key={i} className="leading-relaxed" style={{ color: '#E0E0E0', fontSize: '1.075rem' }}>{block.p}</p>;
            })}
          </div>

          {/* CTA */}
          <div className="mt-14 pt-10 border-t text-center" style={{ borderColor: 'rgba(212,168,67,0.15)' }}>
            <p className="mb-6" style={{ color: '#8C7B75' }}>{fr ? 'Un projet en tête ?' : 'Have a project in mind?'}</p>
            <Link to="/contact" className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 hover:-translate-y-px hover:shadow-lg" style={{ backgroundColor: '#B1643B', color: '#F8F9FA' }}>
              {fr ? 'Réserver un appel' : 'Book a call'}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* More posts */}
        {more.length > 0 && (
          <section className="border-t py-16" style={{ borderColor: 'rgba(248,249,250,0.06)', backgroundColor: '#0E0E0E' }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-xs tracking-[0.35em] uppercase mb-6" style={{ color: '#8C7B75' }}>{fr ? 'À lire ensuite' : 'Read next'}</p>
              <div className="grid sm:grid-cols-2 gap-6">
                {more.map((p) => (
                  <Link key={p.slug} to={`/journal/${p.slug}`} className="group flex items-center gap-4">
                    <div className="relative overflow-hidden rounded-xl flex-shrink-0" style={{ width: 88, height: 88 }}>
                      <img src={p.cover} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ objectPosition: 'center 35%' }} />
                    </div>
                    <span className="text-base leading-snug transition-colors duration-200 group-hover:text-[#D4A843]" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)' }}>{(fr ? p.fr : p.en).title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
