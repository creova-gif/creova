import { ArrowRight, BriefcaseBusiness, HandHeart, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from '../i18n/LocaleLink';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';
import communityImage from '../assets/photo-community-convo.jpg';

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
    <div style={{ backgroundColor: '#F8F9FA' }}>
      <PageSEO
        title={fr ? 'Communauté et collaborations' : 'Community and Collaboration'}
        description={fr ? 'Mandater CREOVA, proposer une collaboration ou discuter d’un partenariat communautaire avec des attentes claires.' : 'Commission CREOVA, propose a collaboration, or discuss a community partnership with clear expectations.'}
        path="/community"
      />

      <section className="relative min-h-[70vh] flex items-end overflow-hidden" style={{ backgroundColor: '#121212' }}>
        <img src={communityImage} alt="People in conversation at a community gathering" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(18,18,18,.97), rgba(18,18,18,.62) 70%, rgba(18,18,18,.38))' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="relative max-w-7xl mx-auto w-full px-6 lg:px-8 py-20 lg:py-28">
          <p className="text-xs tracking-[.35em] uppercase mb-6" style={{ color: '#D4A843' }}>{fr ? 'Communauté' : 'Community'}</p>
          <h1 className="max-w-5xl font-light tracking-tight leading-[.98]" style={{ color: '#F8F9FA', fontSize: 'clamp(3.1rem, 8vw, 7.2rem)' }}>{fr ? 'Mandater, collaborer ou soutenir — avec des rôles clairs dès le départ.' : 'Commission, collaborate, or partner—with clear roles from the start.'}</h1>
          <p className="max-w-3xl mt-7 text-lg md:text-xl leading-relaxed" style={{ color: '#E0E0E0' }}>{fr ? 'Choisissez la relation qui correspond à votre objectif. Nous clarifions le rôle de chacun, la valeur échangée et le résultat avant de commencer.' : 'Choose the relationship that matches your goal. We clarify roles, value exchange, and the intended outcome before work begins.'}</p>
        </motion.div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mb-12"><p className="text-xs tracking-[.35em] uppercase mb-4" style={{ color: '#148F77' }}>{fr ? 'Choisissez votre voie' : 'Choose your route'}</p><h2 className="text-4xl md:text-6xl font-light tracking-tight" style={{ color: '#1A1A2E' }}>{fr ? 'Trois relations. Trois prochaines étapes.' : 'Three relationships. Three next steps.'}</h2></div>
          <div className="grid lg:grid-cols-3 gap-6">
            {routes.map(({ id, icon: Icon, title, text, cta, to }) => (
              <article id={id} key={id} className="scroll-mt-36 rounded-3xl p-7 md:p-9 flex flex-col min-h-[390px]" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0' }}>
                <Icon className="w-7 h-7" style={{ color: '#148F77' }} />
                <h2 className="text-3xl font-light tracking-tight mt-14 mb-5" style={{ color: '#1A1A2E' }}>{title}</h2>
                <p className="leading-relaxed flex-1" style={{ color: '#555' }}>{text}</p>
                {to.startsWith('mailto:') ? <a href={to} className="inline-flex items-center gap-2 text-sm font-medium mt-8" style={{ color: '#148F77' }}>{cta}<ArrowRight className="w-4 h-4" /></a> : <Link to={to} className="inline-flex items-center gap-2 text-sm font-medium mt-8" style={{ color: '#148F77' }}>{cta}<ArrowRight className="w-4 h-4" /></Link>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ backgroundColor: '#1A1A2E' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[.8fr_1.2fr] gap-14 lg:gap-20">
          <div><ShieldCheck className="w-7 h-7 mb-7" style={{ color: '#D4A843' }} /><h2 className="text-4xl md:text-6xl font-light tracking-tight" style={{ color: '#F8F9FA' }}>{fr ? 'Nos engagements de collaboration.' : 'How we protect the relationship.'}</h2></div>
          <div className="grid sm:grid-cols-2 gap-5">
            {commitments.map(([title, text]) => <div key={title} className="rounded-2xl p-6" style={{ border: '1px solid rgba(212,168,67,.18)', backgroundColor: 'rgba(248,249,250,.04)' }}><h3 className="text-xl mb-3" style={{ color: '#F8F9FA' }}>{title}</h3><p className="text-sm leading-relaxed" style={{ color: '#B7BBC3' }}>{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <Sparkles className="w-7 h-7 mx-auto mb-6" style={{ color: '#C0392B' }} />
          <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6" style={{ color: '#1A1A2E' }}>{fr ? 'Vous avez une proposition précise?' : 'Have a specific proposal?'}</h2>
          <p className="max-w-2xl mx-auto leading-relaxed mb-9" style={{ color: '#555' }}>{fr ? 'Présentez le contexte, les personnes concernées, le résultat recherché, le calendrier et ce que chaque partie apporte.' : 'Share the context, who is involved, the intended outcome, timing, and what each party brings.'}</p>
          <a href="mailto:support@creova.one?subject=Community%20proposal" className="inline-flex items-center gap-2 rounded-xl px-7 py-4 font-semibold" style={{ backgroundColor: '#C0392B', color: '#FFFFFF' }}>{fr ? 'Écrire à CREOVA' : 'Email CREOVA'} <ArrowRight className="w-4 h-4" /></a>
        </div>
      </section>
    </div>
  );
}
