import { ArrowRight, Building2, CalendarDays, CheckCircle2, Globe2, HeartHandshake, Repeat2, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from '../i18n/LocaleLink';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';
import { VENTURE_URLS } from '../config';
import { organizationSchema } from '../utils/structuredData';
import heroImage from '../assets/photo-community-celebration.jpg';
import communityImage from '../assets/photo-community-convo.jpg';
import founderImage from '../assets/photo-team-atrium.jpg';

export function HomePage() {
  const { language } = useLanguage();
  const fr = language === 'fr';

  const offers = fr ? [
    {
      number: '01',
      title: 'Récit d’événement et d’expérience',
      text: 'Planifier l’histoire, documenter le moment avec soin et créer des actifs utiles pour le public, les partenaires, les commanditaires et la suite.',
      cta: 'Planifier un récit d’événement',
    },
    {
      number: '02',
      title: 'Campagnes et récits communautaires',
      text: 'Transformer un programme ou une initiative en un récit cohérent que les gens peuvent comprendre, croire et soutenir.',
      cta: 'Construire une campagne',
    },
    {
      number: '03',
      title: 'Partenariats narratifs continus',
      text: 'Créer une archive vivante de récits et de preuves au fil de l’année, sans repartir de zéro à chaque événement.',
      cta: 'Discuter d’un partenariat',
    },
  ] : [
    {
      number: '01',
      title: 'Event & Experience Storytelling',
      text: 'Plan the story, document the moment with care, and create useful assets for audiences, partners, sponsors, funders, and what comes next.',
      cta: 'Plan an event story',
    },
    {
      number: '02',
      title: 'Campaign & Community Narratives',
      text: 'Turn a program or initiative into a coherent narrative people can understand, trust, and participate in.',
      cta: 'Build a campaign',
    },
    {
      number: '03',
      title: 'Ongoing Storytelling Partnerships',
      text: 'Build a useful body of stories and evidence across the year instead of restarting with a new vendor every quarter.',
      cta: 'Discuss a partnership',
    },
  ];

  const routes = fr ? [
    { icon: Building2, title: 'Mandater CREOVA', text: 'Pour les organisations et entreprises qui planifient un programme, un événement ou une campagne.', to: '/start-a-project', cta: 'Démarrer un projet' },
    { icon: Users, title: 'Collaborer avec CREOVA', text: 'Pour les créatifs, artistes et travailleurs culturels qui proposent une collaboration définie et équitable.', to: '/community#collaborate', cta: 'Proposer une collaboration' },
    { icon: HeartHandshake, title: 'Devenir partenaire ou bailleur', text: 'Pour les organismes hôtes, commanditaires, institutions et bailleurs qui veulent soutenir un résultat précis.', to: '/community#partner', cta: 'Discuter d’un partenariat' },
  ] : [
    { icon: Building2, title: 'Commission CREOVA', text: 'For organizations and businesses planning a program, event, or campaign.', to: '/start-a-project', cta: 'Start a project' },
    { icon: Users, title: 'Collaborate with CREOVA', text: 'For creatives, artists, and cultural workers proposing a defined, equitable collaboration.', to: '/community#collaborate', cta: 'Propose a collaboration' },
    { icon: HeartHandshake, title: 'Partner or fund', text: 'For hosts, sponsors, institutions, and funders supporting a specific outcome.', to: '/community#partner', cta: 'Discuss a partnership' },
  ];

  return (
    <div className="overflow-x-hidden" style={{ backgroundColor: '#F8F9FA' }}>
      <PageSEO
        title={fr ? 'Studio de narration culturelle en Ontario' : 'Cultural Storytelling Studio in Ontario'}
        description={fr
          ? 'CREOVA aide les organisations culturelles, les bâtisseurs de communautés et les entreprises engagées à transformer leurs événements et programmes en récits durables.'
          : 'CREOVA helps cultural organizations, community builders, and purpose-led businesses turn events and programs into stories that grow participation, prove impact, and keep people connected.'}
        path="/"
        jsonLd={organizationSchema}
      />

      <section className="relative min-h-[82vh] flex items-end overflow-hidden" style={{ backgroundColor: '#121212' }}>
        <img
          src={heroImage}
          alt="A community gathering documented by CREOVA"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: 'center 42%' }}
          fetchPriority="high"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(18,18,18,.98) 0%, rgba(18,18,18,.9) 45%, rgba(18,18,18,.34) 100%)' }} />
        <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: 'linear-gradient(transparent, rgba(18,18,18,.92))' }} />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-8 pt-32 pb-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }} className="max-w-4xl">
            <p className="text-xs tracking-[0.34em] uppercase mb-6" style={{ color: '#D4A843' }}>
              {fr ? 'Studio de narration culturelle · Ontario' : 'Cultural storytelling studio · Ontario'}
            </p>
            <h1 className="font-light tracking-tight leading-[0.96]" style={{ color: '#F8F9FA', fontSize: 'clamp(3.2rem, 8vw, 7.6rem)' }}>
              {fr ? 'Transformer les moments marquants en élan durable.' : 'Turn meaningful moments into lasting momentum.'}
            </h1>
            <p className="mt-7 max-w-3xl text-lg md:text-xl leading-relaxed" style={{ color: '#E0E0E0' }}>
              {fr
                ? 'CREOVA aide les organisations culturelles, les bâtisseurs de communautés et les entreprises engagées à transformer leurs événements et programmes en récits qui stimulent la participation, démontrent l’impact et maintiennent le lien.'
                : 'CREOVA helps cultural organizations, community builders, and purpose-led businesses turn events and programs into stories that grow participation, prove impact, and keep people connected.'}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/start-a-project" className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5" style={{ backgroundColor: '#C0392B', color: '#FFFFFF' }}>
                {fr ? 'Démarrer un projet' : 'Start a project'} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/work" className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold border transition-colors" style={{ borderColor: 'rgba(248,249,250,.45)', color: '#F8F9FA', backgroundColor: 'rgba(18,18,18,.25)' }}>
                {fr ? 'Voir les études de cas' : 'View case studies'}
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm" style={{ color: 'rgba(248,249,250,.72)' }}>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: '#D4A843' }} />{fr ? 'Dirigé par des personnes BIPOC' : 'BIPOC-led'}</span>
              <span className="inline-flex items-center gap-2"><Globe2 className="w-4 h-4" style={{ color: '#D4A843' }} />{fr ? 'Collaboration en anglais et en français' : 'English and French collaboration'}</span>
              <span className="inline-flex items-center gap-2"><CalendarDays className="w-4 h-4" style={{ color: '#D4A843' }} />Niagara · Hamilton · GTA</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b" style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-7 grid md:grid-cols-[1fr_auto_auto] gap-5 md:items-center">
          <p className="text-sm leading-relaxed" style={{ color: '#555' }}>
            {fr
              ? 'Travail public vérifié : documentation du Mois de l’histoire des Noirs et de programmes communautaires liés au Black Student Success Centre de l’Université Brock.'
              : 'Verified public work: Black History Month and community-program documentation connected with Brock University’s Black Student Success Centre.'}
          </p>
          <span className="text-xs tracking-[0.2em] uppercase" style={{ color: '#2E4057' }}>Brock University</span>
          <span className="text-xs tracking-[0.2em] uppercase" style={{ color: '#2E4057' }}>Black Student Success Centre</span>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-14 lg:gap-24">
            <div>
              <p className="text-xs tracking-[0.35em] uppercase mb-5" style={{ color: '#C0392B' }}>{fr ? 'Le problème' : 'The problem'}</p>
              <h2 className="font-light tracking-tight leading-tight" style={{ color: '#1A1A2E', fontSize: 'clamp(2.5rem, 5vw, 4.8rem)' }}>
                {fr ? 'L’événement se termine. Sa valeur ne devrait pas disparaître.' : 'The event ends. Its value should not.'}
              </h2>
            </div>
            <div className="grid gap-5">
              {(fr ? [
                ['Attirer', 'Des récits et actifs de campagne qui aident le bon public à comprendre pourquoi le moment compte.'],
                ['Documenter avec soin', 'Une production culturellement attentive, guidée par le contexte, les droits, le consentement et l’usage prévu.'],
                ['Prolonger le récit', 'Des actifs rapides, une archive utile et une voie éditoriale pour les rapports, la promotion et le prochain programme.'],
              ] : [
                ['Bring people in', 'Narrative and campaign assets that help the right audience understand why the moment matters.'],
                ['Capture with care', 'Culturally attentive production shaped by context, rights, consent, and intended use.'],
                ['Carry the story forward', 'Rapid assets, a useful archive, and an editorial path for reporting, promotion, and the next program.'],
              ]).map(([title, text], index) => (
                <div key={title} className="grid grid-cols-[auto_1fr] gap-5 rounded-2xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0' }}>
                  <span className="text-xs pt-1" style={{ color: '#C0392B' }}>0{index + 1}</span>
                  <div><h3 className="text-xl mb-2" style={{ color: '#1A1A2E' }}>{title}</h3><p className="leading-relaxed" style={{ color: '#555' }}>{text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24" style={{ backgroundColor: '#1A1A2E' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-12">
            <div>
              <p className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: '#D4A843' }}>{fr ? 'Façons de travailler ensemble' : 'Ways to create momentum'}</p>
              <h2 className="text-4xl md:text-6xl font-light tracking-tight" style={{ color: '#F8F9FA' }}>{fr ? 'Trois systèmes. Un résultat clair.' : 'Three systems. One clear outcome.'}</h2>
            </div>
            <Link to="/services" className="inline-flex items-center gap-2 text-sm" style={{ color: '#D4A843' }}>{fr ? 'Voir notre approche' : 'See how we work'} <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid lg:grid-cols-3 gap-5">
            {offers.map((offer) => (
              <article key={offer.number} className="rounded-2xl p-7 md:p-8 flex flex-col min-h-[330px]" style={{ backgroundColor: 'rgba(248,249,250,.04)', border: '1px solid rgba(212,168,67,.2)' }}>
                <span className="text-xs tracking-[0.25em]" style={{ color: '#D4A843' }}>{offer.number}</span>
                <h3 className="text-2xl mt-12 mb-4" style={{ color: '#F8F9FA' }}>{offer.title}</h3>
                <p className="leading-relaxed flex-1" style={{ color: '#B7BBC3' }}>{offer.text}</p>
                <Link to="/start-a-project" className="inline-flex items-center gap-2 text-sm mt-8" style={{ color: '#D4A843' }}>{offer.cta} <ArrowRight className="w-4 h-4" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative overflow-hidden rounded-3xl min-h-[480px]">
            <img src={communityImage} alt="Community programming documented by CREOVA" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(transparent 40%, rgba(18,18,18,.85))' }} />
            <div className="absolute bottom-0 p-7 md:p-9">
              <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#D4A843' }}>BSSC × CREOVA</p>
              <h2 className="text-3xl md:text-4xl font-light" style={{ color: '#FFFFFF' }}>{fr ? 'Documenter la vie étudiante noire à Brock' : 'Documenting Black student life at Brock'}</h2>
            </div>
          </div>
          <div>
            <p className="text-xs tracking-[0.35em] uppercase mb-5" style={{ color: '#C0392B' }}>{fr ? 'Étude de cas' : 'Featured case study'}</p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6" style={{ color: '#1A1A2E' }}>{fr ? 'Conçu pour le moment. Utile longtemps après.' : 'Made for the moment. Useful long after it.'}</h2>
            <p className="text-lg leading-relaxed mb-5" style={{ color: '#555' }}>
              {fr
                ? 'CREOVA a photographié et documenté la vie étudiante noire et des programmes culturels liés au Black Student Success Centre de l’Université Brock.'
                : 'CREOVA photographed and documented Black student life and cultural programming connected with Brock University’s Black Student Success Centre.'}
            </p>
            <p className="leading-relaxed mb-8" style={{ color: '#777' }}>
              {fr
                ? 'Une sélection du travail continue de soutenir les communications sociales, promotionnelles, communautaires et institutionnelles. Aucun résultat ni témoignage non vérifié n’est ajouté.'
                : 'Selected work continues to support social, promotional, community, and institutional communications. No unverified result or testimonial is added.'}
            </p>
            <Link to="/work/black-student-success-centre" className="inline-flex items-center gap-2 font-medium" style={{ color: '#C0392B' }}>{fr ? 'Lire l’étude de cas' : 'Read the case study'} <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      <section className="py-24" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <p className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: '#148F77' }}>{fr ? 'Choisissez votre voie' : 'Choose the right route'}</p>
            <h2 className="text-4xl md:text-6xl font-light tracking-tight" style={{ color: '#1A1A2E' }}>{fr ? 'Une relation claire dès le départ.' : 'A clear relationship from the start.'}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {routes.map(({ icon: Icon, title, text, to, cta }) => (
              <article key={title} className="rounded-2xl p-7" style={{ backgroundColor: '#F8F9FA', border: '1px solid #E0E0E0' }}>
                <Icon className="w-6 h-6 mb-8" style={{ color: '#148F77' }} />
                <h3 className="text-2xl mb-3" style={{ color: '#1A1A2E' }}>{title}</h3>
                <p className="leading-relaxed min-h-[96px]" style={{ color: '#555' }}>{text}</p>
                <Link to={to} className="inline-flex items-center gap-2 text-sm mt-6" style={{ color: '#148F77' }}>{cta} <ArrowRight className="w-4 h-4" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[.8fr_1.2fr] gap-12 items-center">
          <img src={founderImage} alt="Justin Mafie working with the CREOVA community" loading="lazy" className="w-full rounded-3xl object-cover aspect-[4/5]" />
          <div>
            <p className="text-xs tracking-[0.35em] uppercase mb-5" style={{ color: '#C0392B' }}>{fr ? 'Approche fondée par Justin Mafie' : 'Founder-led by Justin Mafie'}</p>
            <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6" style={{ color: '#1A1A2E' }}>{fr ? 'La culture n’est pas une couche décorative.' : 'Culture is not a decorative layer.'}</h2>
            <p className="text-lg leading-relaxed mb-8" style={{ color: '#555' }}>
              {fr
                ? 'Elle influence l’auteur du récit, les personnes qui en bénéficient, la manière dont les gens sont représentés et l’usage des images après la remise. CREOVA intègre ces décisions à la stratégie et à la production.'
                : 'It shapes who authors the story, who benefits, how people are represented, and how the work can be used after delivery. CREOVA brings those decisions into strategy and production.'}
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 font-medium" style={{ color: '#C0392B' }}>{fr ? 'À propos de CREOVA' : 'About CREOVA'} <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      <section className="py-24" style={{ backgroundColor: '#121212' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[1fr_auto] gap-10 items-end">
          <div>
            <p className="text-xs tracking-[0.35em] uppercase mb-5" style={{ color: '#D4A843' }}>{fr ? 'Ce que nous bâtissons' : 'What we are building'}</p>
            <h2 className="text-4xl md:text-6xl font-light tracking-tight max-w-4xl" style={{ color: '#F8F9FA' }}>{fr ? 'Le travail client finance l’expertise. Les produits doivent mériter leur prochaine étape.' : 'Client work builds the craft. Products must earn their next stage.'}</h2>
            <p className="mt-6 max-w-3xl leading-relaxed" style={{ color: '#9B9B9B' }}>
              {fr
                ? 'SEEN est en développement vers une cible bêta en décembre 2026. VERSE est en incubation; son dossier technique est prêt, mais aucun lancement ni précommande n’est annoncé.'
                : 'SEEN is in development toward a December 2026 beta target. VERSE is incubating; its tech pack is ready, but no launch or preorder is being announced.'}
            </p>
          </div>
          <div className="flex flex-wrap lg:flex-col gap-3">
            <Link to="/ventures" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm border" style={{ color: '#D4A843', borderColor: 'rgba(212,168,67,.35)' }}>{fr ? 'Voir les projets' : 'Explore ventures'} <ArrowRight className="w-4 h-4" /></Link>
            {VENTURE_URLS.seen && <a href={VENTURE_URLS.seen} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm px-2 py-2" style={{ color: '#E0E0E0' }}>SEEN <ArrowRight className="w-4 h-4" /></a>}
            {VENTURE_URLS.verse && <a href={VENTURE_URLS.verse} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm px-2 py-2" style={{ color: '#E0E0E0' }}>VERSE <ArrowRight className="w-4 h-4" /></a>}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ backgroundColor: '#C0392B' }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <Repeat2 className="w-7 h-7 mx-auto mb-6" style={{ color: '#FFFFFF' }} />
          <h2 className="text-4xl md:text-6xl font-light tracking-tight" style={{ color: '#FFFFFF' }}>{fr ? 'Vous planifiez un moment qui doit compter après la journée?' : 'Planning a moment that needs to matter beyond the day?'}</h2>
          <p className="mt-5 text-lg" style={{ color: 'rgba(255,255,255,.82)' }}>{fr ? 'Dites-nous ce qui se passe, qui il faut rejoindre et à quoi ressemble la réussite.' : 'Tell us what is happening, who it needs to reach, and what success should look like.'}</p>
          <Link to="/start-a-project" className="mt-9 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold" style={{ backgroundColor: '#FFFFFF', color: '#1A1A2E' }}>{fr ? 'Démarrer un projet' : 'Start a project'} <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>
    </div>
  );
}
