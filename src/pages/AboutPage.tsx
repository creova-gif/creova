import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from '../i18n/LocaleLink';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';
import { absoluteUrl } from '../i18n/locale';
import { VENTURE_URLS } from '../config';
import sankofaSymbol from '../assets/sankofa-symbol.webp';
import aboutHero from '../assets/photo-about-hero.webp';
import aboutHeroSmall from '../assets/photo-about-hero-900.webp';
import founderSpeaking from '../assets/founder-speaking-1600.webp';
import founderSpeakingSmall from '../assets/founder-speaking-800.webp';
import founderCollaboration from '../assets/founder-collaboration-1600.webp';
import founderCollaborationSmall from '../assets/founder-collaboration-800.webp';
import founderCommunity from '../assets/founder-community-1600.webp';
import founderCommunitySmall from '../assets/founder-community-800.webp';
import founderStage from '../assets/founder-stage-1600.webp';
import founderStageSmall from '../assets/founder-stage-800.webp';
import founderWorkshopCandid from '../assets/founder-workshop-candid-1600.webp';
import founderWorkshopCandidSmall from '../assets/founder-workshop-candid-800.webp';
import founderWorkshopPresenting from '../assets/founder-workshop-presenting-1600.webp';
import founderWorkshopPresentingSmall from '../assets/founder-workshop-presenting-800.webp';
import { EditorialHeroImage } from '../components/EditorialHeroImage';
import { EditorialPhotoSequence } from '../components/EditorialPhotoSequence';

const SITE_URL = 'https://www.creova.one';

// Founder's own words, sharpened with CREOVA's own problem-framing language
// (from the pitch deck: "the representation & visibility gap for BIPOC
// creatives") and its tagline ("Creative Stories, Digital Impact"). The
// The opening anchors the story in Niagara; the remaining problem and mission
// framing comes from CREOVA's own language. The pull-quote is index PULL.
const STORY_EN = [
  'One of the moments that inspired me to build CREOVA came from exploring the Niagara community.',
  'I visited restaurants, cafés, and local businesses that served incredible food and offered amazing experiences. The quality was there — but the visual storytelling wasn’t. Their social media was inconsistent, their photography didn’t reflect the experience, and many had little to no digital presence at all.',
  'It wasn’t because they lacked passion. Many simply couldn’t afford professional creative services, or didn’t have the tools to compete in a digital-first world where visual storytelling is what gets a business seen.',
  'I realized there was a gap — not in talent or quality, but in representation and visibility.',
  'Talented BIPOC creators, founders, and community organizations were being overlooked, not because their work wasn’t good enough, but because they didn’t have access to the branding, content, and storytelling platforms that larger companies take for granted.',
  'That gap planted the seed for CREOVA.',
  'I wanted to build a company rooted in visual storytelling and digital impact — one that helps businesses, creators, and communities tell their stories through world-class design, media, and technology, making high-quality creative work accessible not just to those with the biggest budgets, but to everyone with a story worth telling.',
];
const STORY_FR = [
  'L’un des moments qui m’ont inspiré à bâtir CREOVA est venu en explorant la communauté de Niagara.',
  'J’ai visité des restaurants, des cafés et des commerces locaux qui servaient une nourriture incroyable et offraient des expériences remarquables. La qualité était là — mais pas la narration visuelle. Leurs réseaux sociaux étaient irréguliers, leur photographie ne reflétait pas l’expérience, et beaucoup n’avaient presque aucune présence numérique.',
  'Ce n’était pas par manque de passion. Beaucoup n’avaient tout simplement pas les moyens de s’offrir des services créatifs professionnels, ou n’avaient pas les outils pour rivaliser dans un monde d’abord numérique où la narration visuelle fait toute la différence.',
  'J’ai compris qu’il y avait un fossé — non pas de talent ou de qualité, mais de représentation et de visibilité.',
  'Des créateurs, fondateurs et organismes communautaires BIPOC talentueux étaient ignorés, non pas parce que leur travail n’était pas assez bon, mais parce qu’ils n’avaient pas accès aux outils de marque, de contenu et de narration que les grandes entreprises tiennent pour acquis.',
  'Ce fossé a planté la graine de CREOVA.',
  'Je voulais bâtir une entreprise enracinée dans la narration visuelle et l’impact numérique — qui aide les commerces, les créateurs et les communautés à raconter leur histoire grâce à un design, des médias et une technologie de classe mondiale, en rendant le travail créatif de haute qualité accessible non seulement à ceux qui ont les plus gros budgets, mais à toute personne ayant une histoire qui mérite d’être racontée.',
];
const PULL = 3; // "I realized there was a gap — not in talent or quality, but in representation and visibility."

/** Presents CREOVA's founder story, Sankofa philosophy, press, and brand structure. */
export function AboutPage() {
  const fr = useLanguage().language === 'fr';
  const story = fr ? STORY_FR : STORY_EN;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px' });

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'AboutPage', name: fr ? 'À propos de CREOVA' : 'About CREOVA', url: absoluteUrl('/about', fr ? 'fr' : 'en') },
    {
      '@context': 'https://schema.org', '@type': 'Person', name: 'Justin Mafie', jobTitle: fr ? 'Fondateur' : 'Founder',
      worksFor: { '@type': 'Organization', name: 'CREOVA', url: `${SITE_URL}/` }, image: `${SITE_URL}/card-justin-panel.jpg`,
    },
  ];

  return (
    <div style={{ backgroundColor: '#2D1011' }}>
      <PageSEO
        title={fr ? 'À propos — L’histoire de CREOVA' : 'About — The CREOVA Story'}
        description={fr
          ? 'L’histoire derrière CREOVA, par son fondateur Justin Mafie — pourquoi il a bâti une agence créative pour rendre le travail de qualité accessible à tous.'
          : 'The story behind CREOVA, by founder Justin Mafie — and why cultural context, responsible production, and useful storytelling belong together.'}
        path="/about"
        ogImage={`${SITE_URL}/card-justin-panel.jpg`}
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="relative flex min-h-[72vh] items-end overflow-hidden">
        <EditorialHeroImage
          src={aboutHero}
          srcSet={`${aboutHeroSmall} 900w, ${aboutHero} 2000w`}
          objectPosition="center 44%"
          folio="ABOUT CREOVA / 07"
          deep
        />
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-20">
          <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#C6A45A' }}>{fr ? 'À propos de CREOVA' : 'About CREOVA'}</span>
          <h1 className="tracking-tight mt-5" style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem, 7vw, 4.8rem)', lineHeight: 1.02 }}>
            {fr ? 'Un studio conçu pour raconter la culture avec contexte et soin.' : 'A studio built to tell cultural stories with context and care.'}
          </h1>
        </div>
      </section>

      {/* Portrait */}
      <div ref={ref} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-2xl"
          style={{ backgroundColor: '#0E0E0E', border: '1px solid rgba(198,164,90,0.15)' }}
        >
          <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <img
              src={founderSpeaking}
              srcSet={`${founderSpeakingSmall} 800w, ${founderSpeaking} 1600w`}
              sizes="(min-width: 1024px) 896px, 100vw"
              alt={fr ? 'Justin Mafie, fondateur de CREOVA, prenant la parole lors d’un événement à l’Université Brock' : 'Justin Mafie, founder of CREOVA, speaking at a Brock University event'}
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 36%' }}
              width="1600"
              height="1067"
              decoding="async"
            />
          </div>
          <div className="px-6 py-4">
            <p className="text-lg" style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>Justin Mafie</p>
            <p className="text-xs tracking-[0.2em] uppercase" style={{ color: '#C6A45A' }}>{fr ? 'Fondateur — CREOVA' : 'Founder — CREOVA'}</p>
          </div>
        </motion.div>
      </div>

      {/* Story */}
      <article className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="space-y-6">
          {story.map((para, i) => (
            <div key={i}>
              {i === PULL ? (
                <blockquote className="py-3 my-2 pl-6" style={{ borderLeft: '2px solid #887759' }}>
                  <p className="italic" style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3.4vw, 2.1rem)', lineHeight: 1.28 }}>{para}</p>
                </blockquote>
              ) : (
                <p className="leading-relaxed" style={{ color: '#E0E0E0', fontSize: '1.1rem' }}>{para}</p>
              )}

              {i === 1 && (
                <div className="-mx-2 my-10 grid gap-4 sm:-mx-12 sm:grid-cols-[0.92fr_1.08fr] lg:-mx-28">
                  <figure className="relative min-h-[300px] overflow-hidden rounded-2xl sm:min-h-[430px]">
                    <img
                      src={founderWorkshopCandid}
                      srcSet={`${founderWorkshopCandidSmall} 800w, ${founderWorkshopCandid} 1600w`}
                      sizes="(min-width: 1024px) 390px, (min-width: 640px) 44vw, 100vw"
                      alt={fr ? 'Justin Mafie échangeant avec des participants pendant un atelier entrepreneurial' : 'Justin Mafie listening to participants during an entrepreneurship workshop'}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ objectPosition: 'center 42%' }}
                      width="1600"
                      height="1067"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2D1011]/80 via-transparent to-transparent" />
                    <figcaption className="absolute inset-x-0 bottom-0 p-5 text-xs uppercase tracking-[0.22em] text-white">
                      {fr ? 'Écouter avant de créer' : 'Listen before creating'}
                    </figcaption>
                  </figure>

                  <figure className="relative min-h-[300px] overflow-hidden rounded-2xl sm:min-h-[430px] sm:translate-y-10">
                    <img
                      src={founderWorkshopPresenting}
                      srcSet={`${founderWorkshopPresentingSmall} 800w, ${founderWorkshopPresenting} 1600w`}
                      sizes="(min-width: 1024px) 455px, (min-width: 640px) 52vw, 100vw"
                      alt={fr ? 'Justin Mafie présentant une idée à un groupe pendant un atelier entrepreneurial' : 'Justin Mafie presenting an idea to a group during an entrepreneurship workshop'}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ objectPosition: 'center 44%' }}
                      width="1600"
                      height="1067"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2D1011]/80 via-transparent to-transparent" />
                    <figcaption className="absolute inset-x-0 bottom-0 p-5 text-xs uppercase tracking-[0.22em] text-white">
                      {fr ? 'Transformer les idées en récit' : 'Turn ideas into story'}
                    </figcaption>
                  </figure>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm tracking-[0.2em] uppercase" style={{ color: '#B8AAA4' }}>— Justin Mafie, {fr ? 'Fondateur' : 'Founder'}</p>
      </article>

      <EditorialPhotoSequence
        id="founder-in-practice"
        eyebrow={fr ? 'Le fondateur en pratique' : 'The founder in practice'}
        title={fr ? 'Les histoires prennent forme dans la relation.' : 'Stories take shape through relationship.'}
        description={fr
          ? 'Des conversations informelles aux moments publics, le travail de CREOVA commence par l’écoute, la présence et une compréhension claire du contexte.'
          : 'From informal conversations to public moments, CREOVA’s work begins with listening, presence, and a clear understanding of context.'}
        dark
        photos={[
          {
            src: founderCollaboration,
            srcSet: `${founderCollaborationSmall} 800w, ${founderCollaboration} 1600w`,
            alt: fr ? 'Justin Mafie partageant un moment spontané avec un collaborateur' : 'Justin Mafie sharing a candid moment with a collaborator',
            label: fr ? 'Relation' : 'Relationship',
            objectPosition: 'center 38%',
          },
          {
            src: founderCommunity,
            srcSet: `${founderCommunitySmall} 800w, ${founderCommunity} 1600w`,
            alt: fr ? 'Justin Mafie avec des participants à un événement communautaire de l’Université Brock' : 'Justin Mafie with participants at a Brock University community event',
            label: fr ? 'Communauté' : 'Community',
            objectPosition: 'center 42%',
          },
          {
            src: founderStage,
            srcSet: `${founderStageSmall} 800w, ${founderStage} 1600w`,
            alt: fr ? 'Des organisateurs s’adressant au public lors d’un événement à l’Université Brock' : 'Event organizers addressing an audience at Brock University',
            label: fr ? 'Présence' : 'Presence',
            objectPosition: 'center 44%',
          },
        ]}
      />

      {/* Sankofa — the symbol is presented as a quiet, layered visual rather
          than a separate white image tile. */}
      <section id="philosophy" className="relative scroll-mt-24 py-16 lg:py-24 overflow-hidden" style={{ backgroundColor: '#0E0E0E' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 60% at 85% 20%, rgba(198,164,90,0.08) 0%, transparent 55%)',
        }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[.85fr_1.3fr] gap-10 lg:gap-16 items-start">
            <div className="relative isolate overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(145deg, #2D1011 0%, #5A3028 100%)', border: '1px solid rgba(198,164,90,0.22)' }}>
              <div className="absolute inset-0 -z-10" aria-hidden="true" style={{ background: 'radial-gradient(circle at 50% 25%, rgba(198,164,90,0.18), transparent 48%)' }} />
              <div className="relative h-64 sm:h-72 lg:h-80 px-6 pt-6 md:px-8 md:pt-8 flex items-center justify-center" aria-hidden="true">
                <img src={sankofaSymbol} alt="" loading="lazy" decoding="async" className="w-full h-full object-contain opacity-80 mix-blend-screen" />
              </div>
              <div className="relative z-10 p-8 pt-5 md:p-10 md:pt-6">
                <p className="text-xs tracking-[.24em] sm:tracking-[.34em] uppercase mb-5" style={{ color: '#C6A45A' }}>{fr ? 'Revenir. Retrouver. Avancer.' : 'Return. Retrieve. Build forward.'}</p>
                <p className="leading-none" style={{ color: '#FFFFFF', fontSize: 'clamp(2.65rem, 3.2vw, 3.35rem)', letterSpacing: '-0.045em' }}>Sankofa</p>
                <p className="mt-7 max-w-sm leading-relaxed" style={{ color: '#CDBFAE' }}>{fr ? 'Une philosophie de mémoire, de responsabilité et de création tournée vers l’avenir.' : 'A philosophy of memory, responsibility, and future-facing creation.'}</p>
              </div>
            </div>

            {/* Story */}
            <div>
              <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#C6A45A' }}>{fr ? 'La philosophie' : 'The Philosophy'}</span>
              <h2 className="tracking-tight mt-4 mb-6" style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
                Sankofa
              </h2>

              <p className="leading-relaxed mb-5" style={{ color: '#E0E0E0', fontSize: '1.05rem' }}>
                {fr
                  ? 'Le symbole Sankofa représente un oiseau regardant en arrière tout en tenant un œuf dans son bec — l’importance de retourner au passé pour récupérer des connaissances et des traditions précieuses afin de construire un meilleur avenir.'
                  : 'The Sankofa symbol represents a bird looking backward while holding an egg in its beak — the importance of returning to the past to retrieve valuable knowledge and traditions for building a better future.'}
              </p>

              <blockquote className="pl-5 mb-7" style={{ borderLeft: '2px solid #C6A45A' }}>
                <p className="italic" style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
                  “Se wo were fi na wosankofa a yenkyi”
                </p>
                <p className="text-sm mt-1" style={{ color: '#8C7B75' }}>
                  {fr ? '« Il n’est pas mal de retourner chercher ce que vous avez oublié »' : '“It is not wrong to go back for that which you have forgotten”'}
                </p>
              </blockquote>

              <p className="leading-relaxed mb-7" style={{ color: '#E0E0E0', fontSize: '1.05rem' }}>
                {fr
                  ? 'En 2024, le fondateur de CREOVA a développé les actifs créatifs pour le Mois de l’histoire des Noirs et le Mois du patrimoine africain à l’Université Brock, en partenariat avec Human Rights & Equity (HRE). Ce travail — honorer l’héritage tout en construisant pour l’avenir — est devenu le fil conducteur de la manière dont CREOVA aborde chaque projet.'
                  : 'In 2024, CREOVA’s founder developed creative assets for Black History Month and African Heritage Month at Brock University, in partnership with Human Rights & Equity (HRE). That work — honouring heritage while building for the future — became the through-line for how CREOVA approaches every project since.'}
              </p>

              <div className="space-y-4 mb-7">
                <p className="text-sm leading-relaxed" style={{ color: '#8C7B75' }}>
                  <strong style={{ color: '#C6A45A' }}>{fr ? 'Charte de Scarborough — ' : 'The Scarborough Charter — '}</strong>
                  {fr
                    ? 'reconnaître les injustices historiques et favoriser la responsabilité institutionnelle.'
                    : 'acknowledging historical injustices and fostering accountability in institutions.'}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#8C7B75' }}>
                  <strong style={{ color: '#C6A45A' }}>Audre Lorde — </strong>
                  {fr
                    ? '« Il n’y a pas de lutte à un seul problème parce que nous ne vivons pas de vies à un seul problème. »'
                    : '“There is no such thing as a single-issue struggle because we do not live single-issue lives.”'}
                </p>
              </div>

              <p className="text-base leading-relaxed" style={{ color: '#FFFFFF' }}>
                {fr
                  ? 'Sankofa représente l’engagement de CREOVA à honorer l’héritage culturel, à apprendre de l’histoire et à créer un avenir inclusif grâce à l’excellence créative.'
                  : 'Sankofa represents CREOVA’s commitment to honouring cultural heritage, learning from history, and creating an inclusive future through creative excellence.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Press — real Brock News coverage, original descriptions with direct
          outbound links (never reproducing the source articles' text). */}
      <section className="relative py-16 lg:py-20" style={{ backgroundColor: '#2D1011' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#C6A45A' }}>
            {fr ? 'Dans les médias' : 'As Featured In'}
          </span>
          <div className="grid sm:grid-cols-2 gap-4 mt-5">
            {[
              {
                outlet: 'Brock News',
                date: fr ? '13 août 2025' : 'August 13, 2025',
                title: fr
                  ? 'Une bourse Enbridge propulse CREOVA'
                  : 'Enbridge bursary empowers students through work-integrated learning, advocacy',
                desc: fr
                  ? 'Brock News revient sur la façon dont la bourse Enbridge et le programme Navigate de Brock LINC ont contribué au lancement de CREOVA, et sur le travail du fondateur pour le Mois de l’histoire des Noirs et le Mois du patrimoine africain.'
                  : 'Brock News profiles how the Enbridge Career Experience Bursary and Brock LINC’s Navigate program helped launch CREOVA — and covers the founder’s Black History Month and African Heritage Month work with Human Rights & Equity at Brock.',
                url: 'https://brocku.ca/brock-news/2025/08/enbridge-bursary-empowers-students-through-work-integrated-learning-advocacy/',
              },
              {
                outlet: 'Brock News',
                date: fr ? '6 avril 2026' : 'April 6, 2026',
                title: fr
                  ? 'D’une passion personnelle à une entreprise prometteuse'
                  : 'Navigate winners turn personal passions into promising ventures',
                desc: fr
                  ? 'Justin Mafie, fondateur de CREOVA, a rejoint un panel d’anciens participants de Navigate pour partager son parcours entrepreneurial.'
                  : 'Justin Mafie, founder of CREOVA, joined a panel of past Navigate participants sharing insights from the entrepreneurial journey.',
                url: 'https://brocku.ca/brock-news/2026/04/navigate-winners-turn-personal-passions-into-promising-ventures/',
              },
            ].map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl p-5 transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: '#151515', border: '1px solid rgba(198,164,90,0.15)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs tracking-[0.15em] uppercase" style={{ color: '#8C7B75' }}>{item.outlet} · {item.date}</span>
                  <ArrowUpRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: '#C6A45A' }} />
                </div>
                <p className="mb-2 transition-colors group-hover:text-[#C6A45A]" style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: '1.1rem', lineHeight: 1.3 }}>
                  {item.title}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#8C7B75' }}>{item.desc}</p>
                <span className="inline-block text-xs tracking-[0.15em] uppercase mt-3" style={{ color: '#C6A45A' }}>
                  {fr ? 'Lire l’article complet' : 'Read the full story'}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* One company, many brands */}
      <section className="relative py-16 lg:py-24" style={{ backgroundColor: '#0E0E0E' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="tracking-tight mb-6" style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
            {fr ? 'CREOVA aujourd’hui' : 'CREOVA today'}
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: '#E0E0E0' }}>
            {fr
              ? 'CREOVA est une entreprise créative centrée sur la narration culturelle. Le studio réalise le travail client; SEEN est en développement et VERSE dispose maintenant d’un site public tout en restant en développement. Une entreprise, des étapes clairement nommées.'
              : 'CREOVA is a creative company centered on cultural storytelling. The studio delivers client work; SEEN is in development, and VERSE now has a public website while the imprint remains in development. One company, with each stage named clearly.'}
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: 'CREOVA', tag: fr ? 'Le studio de narration culturelle' : 'The cultural storytelling studio', to: '/services' },
              { name: 'VERSE', tag: fr ? 'Le site public de la marque en développement' : 'The developing imprint’s public website', to: VENTURE_URLS.verse ?? '/ventures#verse', external: Boolean(VENTURE_URLS.verse) },
              { name: 'SEEN', tag: fr ? 'Le produit numérique' : 'The digital product', to: VENTURE_URLS.seen ?? '/ventures#seen', external: Boolean(VENTURE_URLS.seen) },
            ].map((b) => (
              b.external ? (
                <a key={b.name} href={b.to} target="_blank" rel="noopener noreferrer" className="group block rounded-xl p-5 transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: '#151515', border: '1px solid rgba(198,164,90,0.15)' }}>
                  <p className="tracking-tight mb-1 transition-colors group-hover:text-[#C6A45A]" style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>{b.name}</p>
                  <p className="text-xs" style={{ color: '#8C7B75' }}>{b.tag}</p>
                </a>
              ) : (
                <Link key={b.name} to={b.to} className="group block rounded-xl p-5 transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: '#151515', border: '1px solid rgba(198,164,90,0.15)' }}>
                  <p className="tracking-tight mb-1 transition-colors group-hover:text-[#C6A45A]" style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>{b.name}</p>
                  <p className="text-xs" style={{ color: '#8C7B75' }}>{b.tag}</p>
                </Link>
              )
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 lg:py-28 text-center" style={{ backgroundColor: '#2D1011' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="tracking-tight mb-6" style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.06 }}>
            {fr ? 'Une bonne idée à partager ?' : 'Have a story worth telling?'}
          </h2>
          <Link to="/start-a-project" className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-semibold tracking-wide transition-all duration-300 hover:-translate-y-px hover:shadow-xl" style={{ backgroundColor: '#7D6D51', color: '#FFFFFF' }}>
            {fr ? 'Travaillons ensemble' : 'Let’s work together'}
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
