import { ArrowRight, Building2, CalendarDays, CheckCircle2, Globe2, HeartHandshake, Repeat2, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from '../i18n/LocaleLink';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';
import { VENTURE_URLS } from '../config';
import { websiteSchema } from '../utils/structuredData';
import heroImageSmall from '../assets/photo-community-celebration-800.webp';
import heroImageLarge from '../assets/photo-community-celebration-1400.webp';
import founderImageSmall from '../assets/photo-team-atrium-640.webp';
import founderImageLarge from '../assets/photo-team-atrium-1066.webp';
import logoBrock from '../assets/logo-brock-university.webp';
import logoBSSC from '../assets/logo-bssc.png';
import { CreovaMusicPlayer } from '../components/CreovaMusicPlayer';
import { EditorialPhotoSequence } from '../components/EditorialPhotoSequence';
import { EditorialProofModule } from '../components/EditorialProofModule';
import { EditorialMark } from '../components/EditorialMark';
import communityBelongingSmall from '../assets/community-belonging-800.webp';
import communityBelongingLarge from '../assets/community-belonging-1600.webp';
import communityVoiceSmall from '../assets/community-voice-800.webp';
import communityVoiceLarge from '../assets/community-voice-1200.webp';
import communityPlaySmall from '../assets/community-play-800.webp';
import communityPlayLarge from '../assets/community-play-1200.webp';
import communityCarnivalSmall from '../assets/community-carnival-800.webp';
import communityCarnivalLarge from '../assets/community-carnival-1600.webp';
import communityPortraitSmall from '../assets/community-portrait-purple-800.webp';
import communityPortraitLarge from '../assets/community-portrait-purple-1200.webp';

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
    <div className="overflow-x-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      <PageSEO
        title={fr ? 'Studio de narration culturelle en Ontario' : 'Cultural Storytelling Studio in Ontario'}
        description={fr
          ? 'CREOVA est un studio ontarien de narration culturelle créant photos, vidéos et récits pour les événements, programmes communautaires et organisations.'
          : 'CREOVA is an Ontario cultural storytelling studio creating photography, video, and narrative assets for events, community programs, and organizations.'}
        path="/"
        jsonLd={websiteSchema}
      />

      <section className="relative min-h-[calc(100svh-4rem)] flex items-end overflow-hidden" style={{ backgroundColor: '#2D1011' }}>
        <motion.img
          src={heroImageLarge}
          srcSet={`${heroImageSmall} 800w, ${heroImageLarge} 1400w`}
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
          width="1400"
          height="1050"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(45,16,17,.94) 0%, rgba(45,16,17,.82) 39%, rgba(45,16,17,.26) 72%, rgba(45,16,17,.08) 100%)' }} />
        <div className="absolute inset-x-0 bottom-0 h-48" style={{ background: 'linear-gradient(transparent, rgba(45,16,17,.9))' }} />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-8 pt-32 pb-16 lg:pb-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }} className="max-w-3xl">
            <p className="text-xs tracking-[0.34em] uppercase mb-6" style={{ color: '#C6A45A' }}>
              {fr ? 'Studio de narration culturelle · Ontario' : 'Cultural storytelling studio · Ontario'}
            </p>
            <h1 className="creova-hero-title font-light tracking-tight" style={{ color: '#FFFFFF' }}>
              {fr ? <>Transformez vos événements en histoires qui <EditorialMark tone="sand">rassemblent</EditorialMark> et font agir.</> : <>Turn your events into stories that <EditorialMark tone="sand">connect</EditorialMark> people and move them to act.</>}
            </h1>
            <p className="mt-7 max-w-2xl text-base md:text-lg leading-relaxed" style={{ color: '#E0E0E0' }}>
              {fr
                ? 'CREOVA aide les organisations culturelles, les bâtisseurs de communautés et les entreprises engagées à transformer leurs événements et programmes en récits qui stimulent la participation, démontrent l’impact et maintiennent le lien.'
                : 'CREOVA helps cultural organizations, community builders, and purpose-led businesses turn events and programs into stories that grow participation, prove impact, and keep people connected.'}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/start-a-project" className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5" style={{ backgroundColor: '#7D6D51', color: '#FFFFFF' }}>
                {fr ? 'Démarrer un projet' : 'Start a project'} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/work" className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold border transition-colors" style={{ borderColor: 'rgba(255,255,255,.45)', color: '#FFFFFF', backgroundColor: 'rgba(45,16,17,.25)' }}>
                {fr ? 'Voir les études de cas' : 'View case studies'}
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm" style={{ color: 'rgba(255,255,255,.72)' }}>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: '#C6A45A' }} />{fr ? 'Dirigé par des personnes BIPOC' : 'BIPOC-led'}</span>
              <span className="inline-flex items-center gap-2"><Globe2 className="w-4 h-4" style={{ color: '#C6A45A' }} />{fr ? 'Collaboration en anglais et en français' : 'English and French collaboration'}</span>
              <span className="inline-flex items-center gap-2"><CalendarDays className="w-4 h-4" style={{ color: '#C6A45A' }} />Niagara · Hamilton · GTA</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b" style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-7 grid md:grid-cols-[1fr_auto] gap-6 md:items-center">
          <p className="text-sm leading-relaxed" style={{ color: '#555' }}>
            {fr
              ? 'Travail public vérifié : documentation du Mois de l’histoire des Noirs et de programmes communautaires liés au Black Student Success Centre de l’Université Brock.'
              : 'Verified public work: Black History Month and community-program documentation connected with Brock University’s Black Student Success Centre.'}
          </p>
          <div className="flex items-center gap-5" aria-label="Verified collaborators">
            <img src={logoBrock} alt="Brock University" className="h-11 w-auto object-contain" width="1188" height="720" />
            <img src={logoBSSC} alt="Black Student Success Centre" className="h-11 w-11 object-contain" width="1070" height="1074" />
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-14 lg:gap-24">
            <div>
              <p className="text-xs tracking-[0.35em] uppercase mb-5" style={{ color: '#7D6D51' }}>{fr ? 'Le problème' : 'The problem'}</p>
              <h2 className="font-light tracking-tight leading-tight" style={{ color: '#2D1011', fontSize: 'clamp(2.5rem, 5vw, 4.8rem)' }}>
                {fr ? <>L’événement se termine. Sa <EditorialMark variant="circle" tone="wine">valeur</EditorialMark> ne devrait pas disparaître.</> : <>The event ends. Its <EditorialMark variant="circle" tone="wine">value</EditorialMark> should not.</>}
              </h2>
            </div>
            <div className="border-t" style={{ borderColor: 'rgba(45,16,17,.2)' }}>
              {(fr ? [
                ['Attirer', 'Des récits et actifs de campagne qui aident le bon public à comprendre pourquoi le moment compte.'],
                ['Documenter avec soin', 'Une production culturellement attentive, guidée par le contexte, les droits, le consentement et l’usage prévu.'],
                ['Prolonger le récit', 'Des actifs rapides, une archive utile et une voie éditoriale pour les rapports, la promotion et le prochain programme.'],
              ] : [
                ['Bring people in', 'Narrative and campaign assets that help the right audience understand why the moment matters.'],
                ['Capture with care', 'Culturally attentive production shaped by context, rights, consent, and intended use.'],
                ['Carry the story forward', 'Rapid assets, a useful archive, and an editorial path for reporting, promotion, and the next program.'],
              ]).map(([title, text], index) => (
                <article key={title} className="grid gap-4 border-b py-7 sm:grid-cols-[3.5rem_1fr] sm:gap-6" style={{ borderColor: 'rgba(45,16,17,.2)' }}>
                  <span className="text-xs tracking-[.2em] pt-1" style={{ color: '#7D6D51' }}>0{index + 1}</span>
                  <div className="grid gap-3 md:grid-cols-[minmax(10rem,.72fr)_1.28fr] md:gap-8">
                    <h3 className="text-xl" style={{ color: '#2D1011' }}>{title}</h3>
                    <p className="leading-relaxed" style={{ color: '#555' }}>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <EditorialPhotoSequence
        id="living-archive"
        eyebrow={fr ? 'Une archive vivante' : 'A living archive'}
        title={fr ? 'Une communauté, vue sous plusieurs angles.' : 'A community, seen from more than one angle.'}
        description={fr
          ? 'Une archive vivante ne répète pas la même image. Elle réunit appartenance, voix et expression pour montrer comment la communauté prend place.'
          : 'A living archive does not repeat the same frame. It holds belonging, voice, and expression to show how community takes shape.'}
        photos={[
          {
            src: communityBelongingLarge,
            srcSet: `${communityBelongingSmall} 800w, ${communityBelongingLarge} 1600w`,
            alt: fr ? 'Trois amis souriant ensemble lors d’un rassemblement communautaire en plein air' : 'Three friends smiling together at an outdoor community gathering',
            label: fr ? 'Appartenance' : 'Belonging',
            objectPosition: 'center 44%',
          },
          {
            src: communityVoiceLarge,
            srcSet: `${communityVoiceSmall} 800w, ${communityVoiceLarge} 1200w`,
            alt: fr ? 'Une femme s’exprimant dans un microphone pendant une conversation enregistrée' : 'A woman speaking into a microphone during a recorded conversation',
            label: fr ? 'Voix' : 'Voice',
            objectPosition: 'center 50%',
          },
          {
            src: communityPlayLarge,
            srcSet: `${communityPlaySmall} 800w, ${communityPlayLarge} 1200w`,
            alt: fr ? 'Deux amis prenant une pose spontanée et joyeuse dans un espace communautaire' : 'Two friends sharing a playful pose in a community space',
            label: fr ? 'Joie' : 'Joy',
            objectPosition: 'center 58%',
          },
        ]}
      />

      <EditorialProofModule
        fr={fr}
        primary={{
          src: communityCarnivalLarge,
          srcSet: `${communityCarnivalSmall} 800w, ${communityCarnivalLarge} 1600w`,
          alt: fr ? 'Une participante souriante portant une coiffe de carnaval bleue devant un fond orange' : 'A smiling participant wearing a blue carnival headdress against an orange backdrop',
          objectPosition: 'center 48%',
        }}
        secondary={{
          src: communityPortraitLarge,
          srcSet: `${communityPortraitSmall} 800w, ${communityPortraitLarge} 1200w`,
          alt: fr ? 'Portrait d’une participante portant un chandail violet dans un fauteuil bleu' : 'Portrait of a participant wearing a purple sweatshirt in a blue chair',
          objectPosition: 'center 34%',
        }}
      />

      <section className="py-24" style={{ backgroundColor: '#2D1011' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-12">
            <div>
              <p className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: '#C6A45A' }}>{fr ? 'Façons de travailler ensemble' : 'Ways to create momentum'}</p>
              <h2 className="text-4xl md:text-6xl font-light tracking-tight" style={{ color: '#FFFFFF' }}>{fr ? 'Trois systèmes. Un résultat clair.' : 'Three systems. One clear outcome.'}</h2>
            </div>
            <Link to="/services" className="inline-flex items-center gap-2 text-sm" style={{ color: '#C6A45A' }}>{fr ? 'Voir notre approche' : 'See how we work'} <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid lg:grid-cols-3 gap-5">
            {offers.map((offer) => (
              <article key={offer.number} className="rounded-2xl p-7 md:p-8 flex flex-col min-h-[330px]" style={{ backgroundColor: 'rgba(255,255,255,.04)', border: '1px solid rgba(198,164,90,.2)' }}>
                <span className="text-xs tracking-[0.25em]" style={{ color: '#C6A45A' }}>{offer.number}</span>
                <h3 className="text-2xl mt-12 mb-4" style={{ color: '#FFFFFF' }}>{offer.title}</h3>
                <p className="leading-relaxed flex-1" style={{ color: '#B7BBC3' }}>{offer.text}</p>
                <Link to="/start-a-project" className="inline-flex items-center gap-2 text-sm mt-8" style={{ color: '#C6A45A' }}>{offer.cta} <ArrowRight className="w-4 h-4" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <p className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: '#7D6D51' }}>{fr ? 'Choisissez votre voie' : 'Choose the right route'}</p>
            <h2 className="text-4xl md:text-6xl font-light tracking-tight" style={{ color: '#2D1011' }}>{fr ? 'Une relation claire dès le départ.' : 'A clear relationship from the start.'}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {routes.map(({ icon: Icon, title, text, to, cta }) => (
              <article key={title} className="rounded-2xl p-7" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0' }}>
                <Icon className="w-6 h-6 mb-8" style={{ color: '#7D6D51' }} />
                <h3 className="text-2xl mb-3" style={{ color: '#2D1011' }}>{title}</h3>
                <p className="leading-relaxed min-h-[96px]" style={{ color: '#555' }}>{text}</p>
                <Link to={to} className="inline-flex items-center gap-2 text-sm mt-6" style={{ color: '#7D6D51' }}>{cta} <ArrowRight className="w-4 h-4" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[.8fr_1.2fr] gap-12 items-center">
          <img src={founderImageLarge} srcSet={`${founderImageSmall} 640w, ${founderImageLarge} 1066w`} sizes="(min-width: 1024px) 46vw, 100vw" alt="Justin Mafie working with the CREOVA community" decoding="async" loading="lazy" className="w-full rounded-3xl object-cover aspect-[4/5]" width="1066" height="1600" />
          <div>
            <p className="text-xs tracking-[0.35em] uppercase mb-5" style={{ color: '#7D6D51' }}>{fr ? 'Approche fondée par Justin Mafie' : 'Founder-led by Justin Mafie'}</p>
            <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6" style={{ color: '#2D1011' }}>{fr ? <>La culture n’est pas une couche <EditorialMark variant="highlight" tone="gold">décorative</EditorialMark>.</> : <>Culture is not a <EditorialMark variant="highlight" tone="gold">decorative</EditorialMark> layer.</>}</h2>
            <p className="text-lg leading-relaxed mb-8" style={{ color: '#555' }}>
              {fr
                ? 'Elle influence l’auteur du récit, les personnes qui en bénéficient, la manière dont les gens sont représentés et l’usage des images après la remise. CREOVA intègre ces décisions à la stratégie et à la production.'
                : 'It shapes who authors the story, who benefits, how people are represented, and how the work can be used after delivery. CREOVA brings those decisions into strategy and production.'}
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 font-medium" style={{ color: '#7D6D51' }}>{fr ? 'À propos de CREOVA' : 'About CREOVA'} <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      <CreovaMusicPlayer />

      <section className="py-24" style={{ backgroundColor: '#2D1011' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[1fr_auto] gap-10 items-end">
          <div>
            <p className="text-xs tracking-[0.35em] uppercase mb-5" style={{ color: '#C6A45A' }}>{fr ? 'Ce que nous bâtissons' : 'What we are building'}</p>
            <h2 className="text-4xl md:text-6xl font-light tracking-tight max-w-4xl" style={{ color: '#FFFFFF' }}>{fr ? 'Le travail client finance l’expertise. Les produits doivent mériter leur prochaine étape.' : 'Client work builds the craft. Products must earn their next stage.'}</h2>
            <p className="mt-6 max-w-3xl leading-relaxed" style={{ color: '#9B9B9B' }}>
              {fr
                ? 'SEEN est en développement vers une cible bêta en janvier 2027. Le site de notes de terrain de VERSE est en ligne; la marque reste en développement, sans vente ni date de lancement annoncée.'
                : 'SEEN is in development toward a January 2027 beta target. VERSE’s field-note site is live; the imprint remains in development, with nothing for sale and no announced release date.'}
            </p>
          </div>
          <div className="flex flex-wrap lg:flex-col gap-3">
            <Link to="/ventures" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm border" style={{ color: '#C6A45A', borderColor: 'rgba(198,164,90,.35)' }}>{fr ? 'Découvrir nos marques' : 'Explore our brands'} <ArrowRight className="w-4 h-4" /></Link>
            {VENTURE_URLS.seen && <a href={VENTURE_URLS.seen} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm px-2 py-2" style={{ color: '#E0E0E0' }}>SEEN <ArrowRight className="w-4 h-4" /></a>}
            {VENTURE_URLS.verse && <a href={VENTURE_URLS.verse} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm px-2 py-2" style={{ color: '#E0E0E0' }}>VERSE <ArrowRight className="w-4 h-4" /></a>}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ backgroundColor: '#6C5C42' }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <Repeat2 className="w-7 h-7 mx-auto mb-6" style={{ color: '#FFFFFF' }} />
          <h2 className="text-4xl md:text-6xl font-light tracking-tight" style={{ color: '#FFFFFF' }}>{fr ? 'Vous planifiez un moment qui doit compter après la journée?' : 'Planning a moment that needs to matter beyond the day?'}</h2>
          <p className="mt-5 text-lg" style={{ color: '#FFFFFF' }}>{fr ? 'Dites-nous ce qui se passe, qui il faut rejoindre et à quoi ressemble la réussite.' : 'Tell us what is happening, who it needs to reach, and what success should look like.'}</p>
          <Link to="/start-a-project" className="mt-9 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold" style={{ backgroundColor: '#FFFFFF', color: '#2D1011' }}>{fr ? 'Démarrer un projet' : 'Start a project'} <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>
    </div>
  );
}
