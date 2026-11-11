import { Link } from '../i18n/LocaleLink';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';
import { JOURNAL } from '../data/journal';
import { absoluteUrl } from '../i18n/locale';
import { EditorialHeroImage } from '../components/EditorialHeroImage';
import journalImageSmall from '../assets/photo-collage-2-800.webp';
import journalImageLarge from '../assets/photo-collage-2-1600.webp';
import journalDetailImage from '../assets/photo-social-laptop-800.webp';

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
    <div style={{ backgroundColor: '#2D1011', minHeight: '100vh' }}>
      <PageSEO
        title={fr ? 'Guides et perspectives sur la narration culturelle' : 'Creative Storytelling Guides & Insights'}
        description={fr
          ? 'Guides pratiques de CREOVA sur la préparation d’événements, le consentement, la photographie de marque et la narration culturelle en Ontario.'
          : 'Practical CREOVA guides on event preparation, consent, brand photography, and cultural storytelling from Ontario.'}
        path="/journal"
        jsonLd={jsonLd}
      />

      {/* Header */}
      <section className="relative flex min-h-[68vh] items-end overflow-hidden">
        <EditorialHeroImage
          src={journalImageLarge}
          srcSet={`${journalImageSmall} 800w, ${journalImageLarge} 1600w`}
          objectPosition="center 44%"
          secondarySrc={journalDetailImage}
          secondaryObjectPosition="center"
          folio="THE JOURNAL / 08"
          deep
        />
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-20">
          <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#C6A45A' }}>
            {fr ? 'Le Journal' : 'The Journal'}
          </span>
          <h1 className="tracking-tight mt-5 mb-5" style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem, 7vw, 4.6rem)', lineHeight: 1.02 }}>
            {fr ? 'Des conseils pratiques pour mieux raconter la culture.' : 'Practical guidance for better cultural storytelling.'}
          </h1>
          <p className="text-lg" style={{ color: '#B8AAA4', maxWidth: '54ch' }}>
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
                  <article className="h-full flex flex-col overflow-hidden rounded-2xl transition-all duration-300 group-hover:-translate-y-1" style={{ backgroundColor: '#0E0E0E', border: '1px solid rgba(198,164,90,0.12)' }}>
                    <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
                      <img src={post.cover} alt={c.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: 'center 35%' }} />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,14,14,0.6) 0%, transparent 55%)' }} />
                    </div>
                    <div className="flex flex-col flex-1 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] tracking-[0.25em] uppercase px-2.5 py-1 rounded-full" style={{ color: '#C6A45A', backgroundColor: 'rgba(198,164,90,0.12)' }}>{post.category}</span>
                        <span className="text-xs" style={{ color: '#B8ACA6' }}>{fmt(post.date, fr)} · {post.readMins} {fr ? 'min' : 'min read'}</span>
                      </div>
                      <h2 className="tracking-tight mb-3 transition-colors duration-200 group-hover:text-[#C6A45A]" style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: '1.5rem', lineHeight: 1.15 }}>{c.title}</h2>
                      <p className="text-sm leading-relaxed" style={{ color: '#B8AAA4' }}>{c.excerpt}</p>
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
