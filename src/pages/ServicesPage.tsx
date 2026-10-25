import { ArrowRight, Check, Compass, FileStack, HeartHandshake, Repeat2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from '../i18n/LocaleLink';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';

type Offer = {
  id: string;
  number: string;
  title: string;
  promise: string;
  fit: string;
  includes: string[];
  icon: typeof Compass;
};

export function ServicesPage() {
  const { language } = useLanguage();
  const fr = language === 'fr';

  const offers: Offer[] = fr ? [
    {
      id: 'event-story',
      number: '01',
      title: 'Récit d’événement et d’expérience',
      promise: 'Transformer un moment en un ensemble d’actifs utiles avant, pendant et après l’événement.',
      fit: 'Pour les événements culturels, conférences, programmes, lancements et rassemblements communautaires.',
      includes: ['Cadrage narratif et plan de captation', 'Photographie et vidéo selon le mandat', 'Actifs rapides et sélection éditoriale', 'Livraison, droits d’usage et archivage définis'],
      icon: Compass,
    },
    {
      id: 'campaign-story',
      number: '02',
      title: 'Campagnes et récits communautaires',
      promise: 'Donner à un programme ou une initiative une histoire cohérente que le public peut comprendre et soutenir.',
      fit: 'Pour les campagnes, rapports d’impact, programmes communautaires et initiatives institutionnelles.',
      includes: ['Atelier de cadrage et architecture du récit', 'Production photo, vidéo ou éditoriale', 'Système d’actifs adapté aux canaux', 'Contexte, consentement et représentation intégrés'],
      icon: FileStack,
    },
    {
      id: 'ongoing-partnership',
      number: '03',
      title: 'Partenariats narratifs continus',
      promise: 'Construire une mémoire visuelle et éditoriale au fil de l’année sans repartir de zéro chaque trimestre.',
      fit: 'Pour les équipes ayant plusieurs programmes, événements ou besoins de communication récurrents.',
      includes: ['Cadence et priorités convenues', 'Bibliothèque d’actifs organisée', 'Production et livraison récurrentes', 'Révision régulière des usages et apprentissages'],
      icon: Repeat2,
    },
  ] : [
    {
      id: 'event-story',
      number: '01',
      title: 'Event & Experience Storytelling',
      promise: 'Turn one meaningful moment into useful assets before, during, and after the event.',
      fit: 'For cultural events, conferences, programs, launches, and community gatherings.',
      includes: ['Narrative framing and capture plan', 'Photography and video scoped to the brief', 'Rapid assets and an edited story set', 'Defined delivery, usage rights, and archive'],
      icon: Compass,
    },
    {
      id: 'campaign-story',
      number: '02',
      title: 'Campaign & Community Narratives',
      promise: 'Give a program or initiative a coherent story that people can understand, trust, and support.',
      fit: 'For campaigns, impact reporting, community programs, and institutional initiatives.',
      includes: ['Framing workshop and story architecture', 'Photo, video, or editorial production', 'A channel-ready asset system', 'Context, consent, and representation built in'],
      icon: FileStack,
    },
    {
      id: 'ongoing-partnership',
      number: '03',
      title: 'Ongoing Storytelling Partnerships',
      promise: 'Build a useful visual and editorial memory across the year instead of restarting every quarter.',
      fit: 'For teams with multiple programs, events, or recurring communications needs.',
      includes: ['Agreed cadence and priorities', 'An organized asset library', 'Recurring production and delivery', 'Regular review of use and learning'],
      icon: Repeat2,
    },
  ];

  const steps = fr
    ? [['Cadrer', 'Objectif, public, contexte culturel, droits et résultat attendu.'], ['Concevoir', 'Un plan narratif et de production adapté au moment et aux canaux.'], ['Produire', 'Une équipe proportionnée au mandat, avec des attentes claires.'], ['Prolonger', 'Des actifs organisés pour la communication, les rapports et la suite.']]
    : [['Frame', 'Objective, audience, cultural context, rights, and intended outcome.'], ['Design', 'A narrative and production plan shaped to the moment and its channels.'], ['Produce', 'A right-sized team working from clear expectations.'], ['Extend', 'Organized assets for communications, reporting, and what comes next.']];

  return (
    <div style={{ backgroundColor: '#F8F9FA' }}>
      <PageSEO
        title={fr ? 'Services de narration culturelle' : 'Cultural Storytelling Services'}
        description={fr ? 'Trois façons de travailler avec CREOVA : événements, campagnes communautaires et partenariats narratifs continus.' : 'Three ways to work with CREOVA: event storytelling, community campaigns, and ongoing storytelling partnerships.'}
        path="/services"
      />

      <section className="relative overflow-hidden py-24 lg:py-36" style={{ backgroundColor: '#121212' }}>
        <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(circle at 85% 20%, rgba(212,168,67,.18), transparent 38%)' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-xs tracking-[.35em] uppercase mb-6" style={{ color: '#D4A843' }}>{fr ? 'Services' : 'What we do'}</p>
          <h1 className="max-w-5xl font-light tracking-tight leading-[.98]" style={{ color: '#F8F9FA', fontSize: 'clamp(3.2rem, 8vw, 7.5rem)' }}>
            {fr ? 'Un système narratif pour le moment, le public et la suite.' : 'One story system for the moment, the audience, and what comes next.'}
          </h1>
          <p className="max-w-3xl mt-7 text-lg md:text-xl leading-relaxed" style={{ color: '#B7BBC3' }}>
            {fr ? 'Stratégie, photo, vidéo et actifs organisés autour du résultat recherché — pas une liste de livrables isolés.' : 'Strategy, photography, video, and organized assets built around the outcome you need—not a disconnected menu of deliverables.'}
          </p>
        </motion.div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-7">
          {offers.map(({ id, number, title, promise, fit, includes, icon: Icon }) => (
            <article id={id} key={id} className="scroll-mt-36 grid lg:grid-cols-[.7fr_1.3fr] gap-10 rounded-3xl p-7 md:p-10 lg:p-12" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0' }}>
              <div>
                <div className="flex items-center gap-3 mb-10"><Icon className="w-5 h-5" style={{ color: '#C0392B' }} /><span className="text-xs tracking-[.3em]" style={{ color: '#C0392B' }}>{number}</span></div>
                <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-5" style={{ color: '#1A1A2E' }}>{title}</h2>
                <p className="text-lg leading-relaxed" style={{ color: '#555' }}>{promise}</p>
              </div>
              <div className="lg:border-l lg:pl-12" style={{ borderColor: '#E0E0E0' }}>
                <p className="text-xs tracking-[.25em] uppercase mb-3" style={{ color: '#148F77' }}>{fr ? 'Conçu pour' : 'Designed for'}</p>
                <p className="leading-relaxed mb-8" style={{ color: '#555' }}>{fit}</p>
                <ul className="grid sm:grid-cols-2 gap-4 mb-9">
                  {includes.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed" style={{ color: '#333' }}><Check className="w-4 h-4 mt-1 shrink-0" style={{ color: '#148F77' }} />{item}</li>)}
                </ul>
                <Link to="/start-a-project" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold" style={{ backgroundColor: '#1A1A2E', color: '#FFFFFF' }}>{fr ? 'Parler de votre projet' : 'Talk about your project'} <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="py-24" style={{ backgroundColor: '#1A1A2E' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[.75fr_1.25fr] gap-12 lg:gap-20">
            <div><p className="text-xs tracking-[.35em] uppercase mb-5" style={{ color: '#D4A843' }}>{fr ? 'Notre approche' : 'How it works'}</p><h2 className="text-4xl md:text-6xl font-light tracking-tight" style={{ color: '#F8F9FA' }}>{fr ? 'Un mandat clair. Une production responsable.' : 'A clear brief. A responsible production.'}</h2></div>
            <div className="grid sm:grid-cols-2 gap-5">
              {steps.map(([title, text], index) => <div key={title} className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(248,249,250,.04)', border: '1px solid rgba(212,168,67,.18)' }}><span className="text-xs" style={{ color: '#D4A843' }}>0{index + 1}</span><h3 className="text-xl mt-7 mb-3" style={{ color: '#F8F9FA' }}>{title}</h3><p className="text-sm leading-relaxed" style={{ color: '#B7BBC3' }}>{text}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <HeartHandshake className="w-7 h-7 mx-auto mb-6" style={{ color: '#C0392B' }} />
          <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6" style={{ color: '#1A1A2E' }}>{fr ? 'Le prix suit le mandat.' : 'Scope first. Price second.'}</h2>
          <p className="max-w-2xl mx-auto leading-relaxed mb-9" style={{ color: '#555' }}>{fr ? 'Chaque proposition définit le résultat, les responsabilités, les droits d’usage, le calendrier et le budget. Aucun forfait public ne remplace cette conversation.' : 'Every proposal defines the outcome, responsibilities, usage rights, timeline, and budget. A public package cannot replace that conversation.'}</p>
          <Link to="/start-a-project" className="inline-flex items-center gap-2 rounded-xl px-7 py-4 font-semibold" style={{ backgroundColor: '#C0392B', color: '#FFFFFF' }}>{fr ? 'Démarrer un projet' : 'Start a project'} <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>
    </div>
  );
}
