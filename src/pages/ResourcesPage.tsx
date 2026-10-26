import { ArrowRight, Download, FileText, Lightbulb } from 'lucide-react';
import { Link } from '../i18n/LocaleLink';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';
import { JOURNAL } from '../data/journal';

const DOWNLOADS = [
  {
    title: 'Project Story Brief',
    titleFr: 'Brief narratif de projet',
    description: 'A bilingual planning worksheet for aligning the audience, narrative, must-capture moments, rights, deliverables, and approvals before production begins.',
    descriptionFr: 'Une fiche bilingue pour aligner le public, le récit, les moments essentiels, les droits, les livrables et les approbations avant la production.',
    href: '/resources/creova-project-story-brief.pdf',
    meta: 'Bilingual PDF · 2 pages',
    metaFr: 'PDF bilingue · 2 pages',
  },
  {
    title: 'Equipment & Media Checklist',
    titleFr: 'Liste de contrôle équipement et médias',
    description: 'A bilingual field checklist for camera, audio, lighting, power, media cards, and the two-backup workflow CREOVA uses to reduce avoidable production risk.',
    descriptionFr: 'Une liste bilingue pour la caméra, l’audio, l’éclairage, l’alimentation, les cartes et la méthode de double sauvegarde qui réduit les risques évitables.',
    href: '/resources/creova-equipment-media-checklist.pdf',
    meta: 'Bilingual PDF · 2 pages',
    metaFr: 'PDF bilingue · 2 pages',
  },
] as const;

const CATEGORY_FR: Record<string, string> = {
  Guides: 'Guides pratiques',
  Perspective: 'Perspective',
};

export function ResourcesPage() {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const articles = JOURNAL.slice(0, 3);

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <PageSEO
        title={fr ? 'Ressources créatives gratuites' : 'Free Creative Resources'}
        description={fr ? 'Des modèles, listes de contrôle et guides pratiques de CREOVA pour mieux préparer les projets créatifs et culturels.' : 'Practical CREOVA templates, checklists, and guides for planning stronger creative and cultural projects.'}
        path="/resources"
      />

      <section className="py-24 lg:py-36" style={{ backgroundColor: '#2D1011' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs tracking-[.35em] uppercase mb-6" style={{ color: '#C6A45A' }}>{fr ? 'Ressources de la communauté' : 'Community resources'}</p>
          <h1 className="max-w-5xl tracking-tight leading-[.98]" style={{ color: '#FFFFFF', fontSize: 'clamp(3.2rem, 8vw, 7.5rem)' }}>
            {fr ? 'Des outils utiles, issus du travail réel.' : 'Useful tools, shaped by real work.'}
          </h1>
          <p className="max-w-3xl mt-7 text-lg md:text-xl leading-relaxed" style={{ color: '#D7CEC4' }}>
            {fr
              ? 'Nous partageons les feuilles de travail et les leçons qui rendent les projets créatifs plus clairs, plus responsables et plus faciles à livrer.'
              : 'We share the worksheets and lessons that make creative projects clearer, more responsible, and easier to deliver.'}
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[.7fr_1.3fr] gap-10 lg:gap-16">
            <div>
              <p className="text-xs tracking-[.3em] uppercase mb-5" style={{ color: '#887759' }}>{fr ? 'Modèles gratuits' : 'Free templates'}</p>
              <h2 className="text-4xl md:text-6xl tracking-tight leading-[1.02]" style={{ color: '#2D1011' }}>{fr ? 'Commencez avec un meilleur brief.' : 'Start with a better brief.'}</h2>
              <p className="mt-5 leading-relaxed" style={{ color: '#555' }}>{fr ? 'Téléchargement direct. Aucun formulaire, aucune liste de diffusion.' : 'Direct downloads. No form and no mailing-list gate.'}</p>
            </div>
            <div className="grid gap-5">
              {DOWNLOADS.map((resource, index) => (
                <article key={resource.href} className="rounded-3xl p-7 md:p-9 grid sm:grid-cols-[1fr_auto] gap-7 items-end" style={{ backgroundColor: '#F7F3EE', border: '1px solid #E5DED5' }}>
                  <div>
                    <div className="flex items-center gap-3 mb-8"><FileText className="w-5 h-5" style={{ color: '#887759' }} /><span className="text-xs tracking-[.25em]" style={{ color: '#887759' }}>0{index + 1}</span></div>
                    <h3 className="text-2xl md:text-3xl mb-3" style={{ color: '#2D1011' }}>{fr ? resource.titleFr : resource.title}</h3>
                    <p className="leading-relaxed" style={{ color: '#555' }}>{fr ? resource.descriptionFr : resource.description}</p>
                    <p className="mt-5 text-xs tracking-[.16em] uppercase" style={{ color: '#887759' }}>{fr ? resource.metaFr : resource.meta}</p>
                  </div>
                  <a href={resource.href} download className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold" style={{ backgroundColor: '#7D6D51', color: '#FFFFFF' }}>
                    {fr ? 'Télécharger' : 'Download'} <Download className="w-4 h-4" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28" style={{ backgroundColor: '#CDBFAE' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 text-xs tracking-[.3em] uppercase mb-5" style={{ color: '#6D5D44' }}><Lightbulb className="w-4 h-4" />{fr ? 'Guides du studio' : 'Studio guides'}</div>
              <h2 className="text-4xl md:text-6xl tracking-tight" style={{ color: '#2D1011' }}>{fr ? 'Ce que nous apprenons, en accès libre.' : 'What we learn, in the open.'}</h2>
            </div>
            <Link to="/journal" className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: '#2D1011' }}>{fr ? 'Voir tout le journal' : 'Explore the journal'} <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {articles.map((article) => {
              const copy = fr ? article.fr : article.en;
              return (
                <Link key={article.slug} to={`/journal/${article.slug}`} className="group rounded-2xl p-7 min-h-[300px] flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
                  <p className="text-xs tracking-[.2em] uppercase" style={{ color: '#887759' }}>{fr ? (CATEGORY_FR[article.category] ?? article.category) : article.category} · {article.readMins} min</p>
                  <h3 className="mt-10 text-2xl leading-tight group-hover:translate-x-1 transition-transform" style={{ color: '#2D1011' }}>{copy.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed flex-1" style={{ color: '#555' }}>{copy.excerpt}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm" style={{ color: '#887759' }}>{fr ? 'Lire le guide' : 'Read the guide'} <ArrowRight className="w-4 h-4" /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
