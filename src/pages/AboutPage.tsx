import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from '../i18n/LocaleLink';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';
import { absoluteUrl } from '../i18n/locale';

const SITE_URL = 'https://www.creova.one';

// Founder's own words, sharpened with CREOVA's own problem-framing language
// (from the pitch deck: "the representation & visibility gap for BIPOC
// creatives") and its tagline ("Creative Stories, Digital Impact"). The
// personal anecdote is untouched — only the articulation of the problem and
// mission is enriched. Edit here; the pull-quote is index PULL of the array.
const STORY_EN = [
  'One of the moments that inspired me to build CREOVA came from simply exploring my city.',
  'I visited restaurants, cafés, and local businesses that served incredible food and offered amazing experiences. The quality was there — but the visual storytelling wasn’t. Their social media was inconsistent, their photography didn’t reflect the experience, and many had little to no digital presence at all.',
  'It wasn’t because they lacked passion. Many simply couldn’t afford professional creative services, or didn’t have the tools to compete in a digital-first world where visual storytelling is what gets a business seen.',
  'I realized there was a gap — not in talent or quality, but in representation and visibility.',
  'Talented BIPOC creators, founders, and community organizations were being overlooked, not because their work wasn’t good enough, but because they didn’t have access to the branding, content, and storytelling platforms that larger companies take for granted.',
  'That gap planted the seed for CREOVA.',
  'I wanted to build a company rooted in visual storytelling and digital impact — one that helps businesses, creators, and communities tell their stories through world-class design, media, and technology, making high-quality creative work accessible not just to those with the biggest budgets, but to everyone with a story worth telling.',
];
const STORY_FR = [
  'L’un des moments qui m’ont inspiré à bâtir CREOVA est venu simplement en explorant ma ville.',
  'J’ai visité des restaurants, des cafés et des commerces locaux qui servaient une nourriture incroyable et offraient des expériences remarquables. La qualité était là — mais pas la narration visuelle. Leurs réseaux sociaux étaient irréguliers, leur photographie ne reflétait pas l’expérience, et beaucoup n’avaient presque aucune présence numérique.',
  'Ce n’était pas par manque de passion. Beaucoup n’avaient tout simplement pas les moyens de s’offrir des services créatifs professionnels, ou n’avaient pas les outils pour rivaliser dans un monde d’abord numérique où la narration visuelle fait toute la différence.',
  'J’ai compris qu’il y avait un fossé — non pas de talent ou de qualité, mais de représentation et de visibilité.',
  'Des créateurs, fondateurs et organismes communautaires BIPOC talentueux étaient ignorés, non pas parce que leur travail n’était pas assez bon, mais parce qu’ils n’avaient pas accès aux outils de marque, de contenu et de narration que les grandes entreprises tiennent pour acquis.',
  'Ce fossé a planté la graine de CREOVA.',
  'Je voulais bâtir une entreprise enracinée dans la narration visuelle et l’impact numérique — qui aide les commerces, les créateurs et les communautés à raconter leur histoire grâce à un design, des médias et une technologie de classe mondiale, en rendant le travail créatif de haute qualité accessible non seulement à ceux qui ont les plus gros budgets, mais à toute personne ayant une histoire qui mérite d’être racontée.',
];
const PULL = 3; // "I realized there was a gap — not in talent or quality, but in representation and visibility."

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
    <div style={{ backgroundColor: '#121212' }}>
      <PageSEO
        title={fr ? 'À propos — L’histoire de CREOVA' : 'About — The CREOVA Story'}
        description={fr
          ? 'L’histoire derrière CREOVA, par son fondateur Justin Mafie — pourquoi il a bâti une agence créative pour rendre le travail de qualité accessible à tous.'
          : 'The story behind CREOVA, by founder Justin Mafie — why he built a creative agency to make world-class creative work accessible to everyone with a story worth telling.'}
        path="/about"
        ogImage={`${SITE_URL}/card-justin-panel.jpg`}
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 50% at 20% 0%, rgba(212,168,67,0.10) 0%, transparent 55%)',
        }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 lg:pt-32">
          <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#D4A843' }}>{fr ? 'L’histoire' : 'The Story'}</span>
          <h1 className="tracking-tight mt-5" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem, 7vw, 4.8rem)', lineHeight: 1.02 }}>
            {fr ? 'Pourquoi j’ai bâti CREOVA' : 'Why I built CREOVA'}
          </h1>
        </div>
      </section>

      {/* Portrait */}
      <div ref={ref} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl"
          style={{ aspectRatio: '16/9', border: '1px solid rgba(212,168,67,0.15)' }}
        >
          <img src="/card-justin-panel.jpg" alt="Justin Mafie, founder of CREOVA, at the Brock LINC Innovation Showcase" className="w-full h-full object-cover" style={{ objectPosition: 'center 28%' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(18,18,18,0.5) 0%, transparent 50%)' }} />
          <div className="absolute bottom-5 left-6">
            <p className="text-lg" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)' }}>Justin Mafie</p>
            <p className="text-xs tracking-[0.2em] uppercase" style={{ color: '#D4A843' }}>{fr ? 'Fondateur — CREOVA' : 'Founder — CREOVA'}</p>
          </div>
        </motion.div>
      </div>

      {/* Story */}
      <article className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="space-y-6">
          {story.map((para, i) =>
            i === PULL ? (
              <blockquote key={i} className="py-3 my-2 pl-6" style={{ borderLeft: '2px solid #B1643B' }}>
                <p className="italic" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3.4vw, 2.1rem)', lineHeight: 1.28 }}>{para}</p>
              </blockquote>
            ) : (
              <p key={i} className="leading-relaxed" style={{ color: '#E0E0E0', fontSize: '1.1rem' }}>{para}</p>
            )
          )}
        </div>
        <p className="mt-10 text-sm tracking-[0.2em] uppercase" style={{ color: '#8C7B75' }}>— Justin Mafie, {fr ? 'Fondateur' : 'Founder'}</p>
      </article>

      {/* Sankofa — the philosophy behind the work. Previously lived inside the
          chat widget's info popup; moved here so it gets a real page section
          instead of being buried in a support-chat modal. */}
      <section className="relative py-16 lg:py-24 overflow-hidden" style={{ backgroundColor: '#0E0E0E' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 60% at 85% 20%, rgba(212,168,67,0.08) 0%, transparent 55%)',
        }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16 items-start">
            {/* Portrait */}
            <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: '4/5', border: '1px solid rgba(212,168,67,0.15)' }}>
              <img
                src="/sankofa-profile.jpg"
                alt={fr ? 'Symbole Sankofa, un oiseau Adinkra regardant en arrière' : 'The Sankofa symbol, an Adinkra bird looking backward'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,14,14,0.55) 0%, transparent 45%)' }} />
            </div>

            {/* Story */}
            <div>
              <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#D4A843' }}>{fr ? 'La philosophie' : 'The Philosophy'}</span>
              <h2 className="tracking-tight mt-4 mb-6" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>
                Sankofa
              </h2>

              <p className="leading-relaxed mb-5" style={{ color: '#E0E0E0', fontSize: '1.05rem' }}>
                {fr
                  ? 'Le symbole Sankofa représente un oiseau regardant en arrière tout en tenant un œuf dans son bec — l’importance de retourner au passé pour récupérer des connaissances et des traditions précieuses afin de construire un meilleur avenir.'
                  : 'The Sankofa symbol represents a bird looking backward while holding an egg in its beak — the importance of returning to the past to retrieve valuable knowledge and traditions for building a better future.'}
              </p>

              <blockquote className="pl-5 mb-7" style={{ borderLeft: '2px solid #D4A843' }}>
                <p className="italic" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
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
                  <strong style={{ color: '#D4A843' }}>{fr ? 'Charte de Scarborough — ' : 'The Scarborough Charter — '}</strong>
                  {fr
                    ? 'reconnaître les injustices historiques et favoriser la responsabilité institutionnelle.'
                    : 'acknowledging historical injustices and fostering accountability in institutions.'}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#8C7B75' }}>
                  <strong style={{ color: '#D4A843' }}>Audre Lorde — </strong>
                  {fr
                    ? '« Il n’y a pas de lutte à un seul problème parce que nous ne vivons pas de vies à un seul problème. »'
                    : '“There is no such thing as a single-issue struggle because we do not live single-issue lives.”'}
                </p>
              </div>

              <p className="text-base leading-relaxed" style={{ color: '#F8F9FA' }}>
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
      <section className="relative py-16 lg:py-20" style={{ backgroundColor: '#121212' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#D4A843' }}>
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
                style={{ backgroundColor: '#151515', border: '1px solid rgba(212,168,67,0.15)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs tracking-[0.15em] uppercase" style={{ color: '#8C7B75' }}>{item.outlet} · {item.date}</span>
                  <ArrowUpRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: '#D4A843' }} />
                </div>
                <p className="mb-2 transition-colors group-hover:text-[#D4A843]" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: '1.1rem', lineHeight: 1.3 }}>
                  {item.title}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#8C7B75' }}>{item.desc}</p>
                <span className="inline-block text-xs tracking-[0.15em] uppercase mt-3" style={{ color: '#D4A843' }}>
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
          <h2 className="tracking-tight mb-6" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
            {fr ? 'CREOVA aujourd’hui' : 'CREOVA today'}
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: '#E0E0E0' }}>
            {fr
              ? 'CREOVA est une agence créative et une marque lifestyle. Le studio livre photographie, vidéo, image de marque et design — et a donné naissance à ses propres produits. Une entreprise, mille façons de raconter une histoire.'
              : 'CREOVA is a creative agency and lifestyle brand. The studio delivers photography, videography, brand and design work — and it has grown into products of its own. One company, many ways to tell a story.'}
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: 'CREOVA', tag: fr ? 'L’agence créative' : 'The creative agency', to: '/services' },
              { name: 'VERSE', tag: fr ? 'La marque lifestyle' : 'The lifestyle label', to: '/shop' },
              { name: 'SEEN', tag: fr ? 'Le produit numérique' : 'The digital product', to: '/seen' },
            ].map((b) => (
              <Link key={b.name} to={b.to} className="group block rounded-xl p-5 transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: '#151515', border: '1px solid rgba(212,168,67,0.15)' }}>
                <p className="tracking-tight mb-1 transition-colors group-hover:text-[#D4A843]" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>{b.name}</p>
                <p className="text-xs" style={{ color: '#8C7B75' }}>{b.tag}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 lg:py-28 text-center" style={{ backgroundColor: '#121212' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="tracking-tight mb-6" style={{ color: '#F8F9FA', fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.06 }}>
            {fr ? 'Une bonne idée à partager ?' : 'Have a story worth telling?'}
          </h2>
          <Link to="/contact" className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-semibold tracking-wide transition-all duration-300 hover:-translate-y-px hover:shadow-xl" style={{ backgroundColor: '#B1643B', color: '#F8F9FA' }}>
            {fr ? 'Travaillons ensemble' : 'Let’s work together'}
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
