import { ArrowRight, BriefcaseBusiness, HandHeart, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from '../i18n/LocaleLink';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';
import communityImageSmall from '../assets/photo-community-convo-800.webp';
import communityImageLarge from '../assets/photo-community-convo-1400.webp';

export function CommunityPage() {
  const { language } = useLanguage();
  const fr = language === 'fr';

  const routes = fr ? [
    { id: 'commission', icon: BriefcaseBusiness, title: 'Mandater CREOVA', text: 'Vous représentez une organisation ou une entreprise avec un événement, un programme ou une campagne à raconter.', cta: 'Démarrer un projet', to: '/start-a-project' },
    { id: 'collaborate', icon: Users, title: 'Collaborer avec CREOVA', text: 'Vous êtes créatif, artiste ou travailleur culturel et vous proposez une collaboration définie avec un rôle, un échange de valeur et un calendrier clairs.', cta: 'Proposer une collaboration', to: 'mailto:support@creova.one?subject=Proposition%20de%20collaboration' },
    { id: 'partner', icon: HandHeart, title: 'Devenir partenaire ou bailleur', text: 'Vous souhaitez soutenir, accueillir ou financer un résultat précis pour une communauté, un programme ou un public.', cta: 'Discuter d’un partenariat', to: 'mailto:support@creova.one?subject=Partenariat%20communautaire' },
  ] : [
    { id: 'commission', icon: BriefcaseBusiness, title: 'Commission CREOVA', text: 'You represent an organization or business with an event, program, or campaign that needs a thoughtful story.', cta: 'Start a project', to: '/start-a-project' },
    { id: 'collaborate', icon: Users, title: 'Collaborate with CREOVA', text: 'You are a creative, artist, or cultural worker proposing a defined collaboration with clear roles, value exchange, and timing.', cta: 'Propose a collaboration', to: 'mailto:support@creova.one?subject=Collaboration%20proposal' },
    { id: 'partner', icon: HandHeart, title: 'Partner or fund', text: 'You want to support, host, or fund a specific outcome for a community, program, or audience.', cta: 'Discuss a partnership', to: 'mailto:support@creova.one?subject=Community%20partnership' },
  ];

  const commitments = fr ? [
    ['Contexte avant contenu', 'Nous clarifions qui raconte l’histoire, qui y apparaît et à quoi les actifs serviront.'],
    ['Consentement et droits clairs', 'Les attentes liées à la captation, à l’usage et à la remise sont définies dans le mandat.'],
    ['Échange de valeur explicite', 'Une collaboration n’est pas une demande vague de travail gratuit; les rôles et la contrepartie doivent être clairs.'],
    ['Aucune promesse inventée', 'Nous distinguons les relations vérifiées, les travaux en développement et les idées qui restent à valider.'],
  ] : [
    ['Context before content', 'We clarify who is authoring the story, who appears in it, and what the assets are for.'],
    ['Clear consent and rights', 'Capture, usage, and delivery expectations are defined in the engagement.'],
    ['Explicit value exchange', 'Collaboration is not a vague request for free labour; roles and consideration need to be clear.'],
    ['No invented proof', 'We distinguish verified relationships, work in development, and ideas that still need validation.'],
  ];

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <PageSEO
        title={fr ? 'Collaborations et partenariats communautaires' : 'Community Collaboration & Partnerships'}
        description={fr ? 'Mandater CREOVA, proposer une collaboration ou discuter d’un partenariat communautaire avec des rôles, des attentes et des prochaines étapes clairs.' : 'Commission CREOVA, propose a creative collaboration, or discuss a community partnership with clear roles, expectations, and next steps.'}
        path="/community"
      />

      <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden lg:min-h-[calc(100svh-6rem)]" style={{ backgroundColor: '#2D1011' }} aria-label={fr ? 'Portrait de la communauté CREOVA' : 'CREOVA community portrait'}>
        <motion.img
          src={communityImageLarge}
          srcSet={`${communityImageSmall} 800w, ${communityImageLarge} 1400w`}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: 'center 42%' }}
          initial={{ scale: 1.035 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          fetchPriority="high"
          decoding="async"
          width="1600"
          height="1067"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(45,16,17,.94) 0%, rgba(45,16,17,.82) 39%, rgba(45,16,17,.26) 72%, rgba(45,16,17,.08) 100%)' }} />
        <div className="absolute inset-x-0 bottom-0 h-48" style={{ background: 'linear-gradient(transparent, rgba(45,16,17,.9))' }} />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-8 pt-32 pb-16 lg:pb-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }} className="max-w-3xl">
            <p className="text-xs tracking-[0.34em] uppercase mb-6" style={{ color: '#C6A45A' }}>
              {fr ? 'Choisissez votre voie' : 'Choose your route'}
            </p>
            <h1 className="creova-hero-title font-light tracking-tight" style={{ color: '#FFFFFF' }}>
              {fr ? 'Trois relations. Trois prochaines étapes.' : 'Three relationships. Three next steps.'}
            </h1>
            <p className="mt-7 max-w-2xl text-base md:text-lg leading-relaxed" style={{ color: '#E0E0E0' }}>
              {fr
                ? 'Présentez le contexte, les personnes concernées, le résultat recherché, le calendrier et ce que chaque partie apporte.'
                : 'Share the context, who is involved, the intended outcome, timing, and what each party brings.'}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href="mailto:support@creova.one?subject=Community proposal" className="inline-flex items-center gap-2 rounded-xl px-7 py-4 font-semibold transition-transform hover:-translate-y-0.5" style={{ backgroundColor: '#7D6D51', color: '#FFFFFF' }}>
                {fr ? 'Écrire à CREOVA' : 'Email CREOVA'} <ArrowRight className="w-4 h-4" />
              </a>
              <Link to="/start-a-project" className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold border transition-colors" style={{ borderColor: 'rgba(255,255,255,.45)', color: '#FFFFFF', backgroundColor: 'rgba(45,16,17,.25)' }}>
                {fr ? 'Start a project' : 'Start a project'} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mb-12"><p className="text-xs tracking-[.35em] uppercase mb-4" style={{ color: '#7D6D51' }}>{fr ? 'Choisissez votre voie' : 'Choose your route'}</p><h1 className="text-4xl md:text-6xl font-light tracking-tight" style={{ color: '#2D1011' }}>{fr ? 'Trois relations. Trois prochaines étapes.' : 'Three relationships. Three next steps.'}</h1></div>
          <div className="grid lg:grid-cols-3 gap-6">
            {routes.map(({ id, icon: Icon, title, text, cta, to }) => (
              <article id={id} key={id} className="scroll-mt-36 rounded-3xl p-7 md:p-9 flex flex-col min-h-[390px]" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0' }}>
                <Icon className="w-7 h-7" style={{ color: '#7D6D51' }} />
                <h2 className="text-3xl font-light tracking-tight mt-14 mb-5" style={{ color: '#2D1011' }}>{title}</h2>
                <p className="leading-relaxed flex-1" style={{ color: '#555' }}>{text}</p>
                {to.startsWith('mailto:') ? <a href={to} className="inline-flex items-center gap-2 text-sm font-medium mt-8" style={{ color: '#7D6D51' }}>{cta}<ArrowRight className="w-4 h-4" /></a> : <Link to={to} className="inline-flex items-center gap-2 text-sm font-medium mt-8" style={{ color: '#7D6D51' }}>{cta}<ArrowRight className="w-4 h-4" /></Link>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ backgroundColor: '#2D1011' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[.8fr_1.2fr] gap-14 lg:gap-20">
          <div><ShieldCheck className="w-7 h-7 mb-7" style={{ color: '#C6A45A' }} /><h2 className="text-4xl md:text-6xl font-light tracking-tight" style={{ color: '#FFFFFF' }}>{fr ? 'Nos engagements de collaboration.' : 'How we protect the relationship.'}</h2></div>
          <div className="grid sm:grid-cols-2 gap-5">
            {commitments.map(([title, text]) => <div key={title} className="rounded-2xl p-6" style={{ border: '1px solid rgba(198,164,90,.18)', backgroundColor: 'rgba(255,255,255,.04)' }}><h3 className="text-xl mb-3" style={{ color: '#FFFFFF' }}>{title}</h3><p className="text-sm leading-relaxed" style={{ color: '#B7BBC3' }}>{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Sparkles className="w-7 h-7 mx-auto mb-6" style={{ color: '#7D6D51' }} />
          <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6" style={{ color: '#2D1011' }}>{fr ? 'Vous avez une proposition précise?' : 'Have a specific proposal?'}</h2>
          <p className="max-w-2xl mx-auto leading-relaxed mb-9" style={{ color: '#555' }}>{fr ? 'Présentez le contexte, les personnes concernées, le résultat recherché, le calendrier et ce que chaque partie apporte.' : 'Share the context, who is involved, the intended outcome, timing, and what each party brings.'}</p>
          <a href="mailto:support@creova.one?subject=Community%20proposal" className="inline-flex items-center gap-2 rounded-xl px-7 py-4 font-semibold" style={{ backgroundColor: '#7D6D51', color: '#FFFFFF' }}>{fr ? 'Écrire à CREOVA' : 'Email CREOVA'} <ArrowRight className="w-4 h-4" /></a>
        </div>
      </section>
    </div>
  );
}
