import { ArrowRight, Code2, PackageCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { PageSEO } from '../components/PageSEO';
import { getPublishedEvidence } from '../content/publicEvidence';
import { useLanguage } from '../context/LanguageContext';
import { VENTURE_URLS } from '../config';

export function VenturesPage() {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const ventures = getPublishedEvidence().filter((record) =>
    record.kind === 'product' || record.kind === 'venture'
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#121212' }}>
      <PageSEO
        title={fr ? 'Produits et marques en développement' : 'Products and ventures in development'}
        description={fr
          ? 'Découvrez SEEN et VERSE, les produits et marques développés par CREOVA.'
          : 'Meet SEEN and VERSE, the products and brands being developed by CREOVA.'}
        path="/ventures"
      />

      <section className="relative overflow-hidden px-6 py-24 lg:py-36">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 75% 20%, rgba(212,168,67,0.13), transparent 40%)' }} />
        <div className="relative max-w-6xl mx-auto">
          <p className="text-xs tracking-[0.45em] uppercase mb-6" style={{ color: '#D4A843' }}>
            {fr ? 'Construit par CREOVA' : 'Built by CREOVA'}
          </p>
          <h1 className="max-w-4xl font-light tracking-tight leading-[0.95]" style={{ color: '#F8F9FA', fontSize: 'clamp(3.5rem, 9vw, 8rem)' }}>
            {fr ? 'Des idées qui deviennent des actifs.' : 'Ideas becoming owned assets.'}
          </h1>
          <p className="max-w-2xl mt-8 text-lg leading-relaxed" style={{ color: '#9B9B9B' }}>
            {fr
              ? 'Nous développons nos propres produits avec la même rigueur que notre travail client. Cette page montre leur état réel — sans prévente ni promesse prématurée.'
              : 'We are building our own products with the same care we bring to client work. This page shows their actual stage—without preorders or premature promises.'}
          </p>
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
          {ventures.map((record, index) => {
            const copy = record.copy[fr ? 'fr' : 'en'];
            const isSeen = record.slug === 'seen';
            const Icon = isSeen ? Code2 : PackageCheck;
            const website = isSeen ? VENTURE_URLS.seen : VENTURE_URLS.verse;
            return (
              <motion.article
                key={record.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                id={record.slug}
                className="rounded-3xl p-8 md:p-10 flex flex-col min-h-[390px]"
                style={{ backgroundColor: isSeen ? '#F8F9FA' : '#191919', border: `1px solid ${isSeen ? '#E0E0E0' : 'rgba(212,168,67,0.22)'}` }}
              >
                <div className="flex items-center justify-between gap-4 mb-16">
                  <Icon className="w-6 h-6" style={{ color: isSeen ? '#B1643B' : '#D4A843' }} />
                  <span className="text-[10px] tracking-[0.28em] uppercase rounded-full px-4 py-2" style={{ color: isSeen ? '#121212' : '#D4A843', border: `1px solid ${isSeen ? 'rgba(18,18,18,0.18)' : 'rgba(212,168,67,0.28)'}` }}>
                    {copy.statusLabel}
                  </span>
                </div>
                <h2 className="text-5xl md:text-6xl font-light tracking-tight mb-5" style={{ color: isSeen ? '#121212' : '#F8F9FA' }}>{copy.title}</h2>
                <p className="leading-relaxed mb-8 flex-1" style={{ color: isSeen ? '#555' : '#9B9B9B' }}>{copy.summary}</p>
                {website ? (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium"
                    style={{ color: isSeen ? '#B1643B' : '#D4A843' }}
                  >
                    {fr ? `Visiter le site ${copy.title}` : `Visit the ${copy.title} website`}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2 text-sm" style={{ color: '#777' }}>
                    <Sparkles className="w-4 h-4" />
                    {isSeen
                      ? (fr ? 'Le site dédié sera ajouté lorsqu’il sera prêt' : 'The dedicated website will be linked when ready')
                      : (fr ? 'Aucune boutique ni précommande pour le moment' : 'No shop or preorder at this stage')}
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
