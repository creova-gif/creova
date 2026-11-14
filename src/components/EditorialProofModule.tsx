import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from '../i18n/LocaleLink';

interface EditorialProofModuleProps {
  fr: boolean;
  primary: { src: string; srcSet: string };
  secondary: { src: string };
}

export function EditorialProofModule({ fr, primary, secondary }: EditorialProofModuleProps) {
  const reduceMotion = useReducedMotion();
  const proof = fr
    ? [
        ['01', 'Contexte', 'Les personnes, le lieu et l’intention restent visibles dans le récit.'],
        ['02', 'Présence', 'Les images montrent la participation, le leadership et les relations.'],
        ['03', 'Continuité', 'Une sélection organisée soutient les communications après le moment.'],
      ]
    : [
        ['01', 'Context', 'People, place, and purpose remain visible in the story.'],
        ['02', 'Presence', 'The imagery holds participation, leadership, and relationship.'],
        ['03', 'Continuity', 'An organized selection supports communication after the moment.'],
      ];

  return (
    <section className="relative overflow-hidden py-24 lg:py-32" style={{ backgroundColor: '#2D1011' }} aria-labelledby="editorial-proof-title">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[8%] top-0 h-full w-px" style={{ backgroundColor: 'rgba(198,164,90,.15)' }} />
        <div className="absolute right-[13%] top-0 h-full w-px" style={{ backgroundColor: 'rgba(198,164,90,.09)' }} />
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full border" style={{ borderColor: 'rgba(198,164,90,.14)' }} />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(22rem,.88fr)] lg:gap-20 lg:px-8">
        <div className="relative min-h-[620px] sm:min-h-[720px]">
          <motion.figure
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-0 overflow-hidden rounded-[2rem] sm:right-[12%]"
            style={{ border: '1px solid rgba(205,191,174,.24)' }}
          >
            <img
              src={primary.src}
              srcSet={primary.srcSet}
              sizes="(min-width: 1024px) 52vw, 100vw"
              alt={fr ? 'Programmation communautaire documentée par CREOVA à l’Université Brock' : 'Community programming documented by CREOVA at Brock University'}
              loading="lazy"
              decoding="async"
              className="h-[500px] w-full object-cover sm:h-[610px]"
              style={{ objectPosition: 'center 44%' }}
              width="1400"
              height="933"
            />
            <figcaption className="flex items-center justify-between gap-4 px-5 py-4 text-[10px] uppercase tracking-[.24em]" style={{ backgroundColor: '#14090A', color: '#CDBFAE' }}>
              <span>BSSC × CREOVA</span>
              <span>{fr ? 'Étude publique vérifiée' : 'Verified public work'}</span>
            </figcaption>
          </motion.figure>

          <motion.figure
            initial={reduceMotion ? false : { opacity: 0, x: 20, rotate: 1.5 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, rotate: -1.5 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 right-0 w-[58%] overflow-hidden rounded-2xl shadow-2xl sm:w-[48%]"
            style={{ border: '8px solid #CDBFAE', backgroundColor: '#CDBFAE' }}
          >
            <img
              src={secondary.src}
              alt={fr ? 'Deux participants échangeant autour d’un jeu d’échecs' : 'Two participants talking over a chess game'}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover"
              style={{ objectPosition: 'center 44%' }}
              width="800"
              height="1000"
            />
          </motion.figure>

          <div className="absolute bottom-8 left-0 hidden -rotate-90 origin-bottom-left text-[10px] uppercase tracking-[.36em] sm:block" style={{ color: '#C6A45A' }} aria-hidden="true">
            {fr ? 'La preuve devient mémoire' : 'Proof becomes memory'}
          </div>
        </div>

        <div className="relative flex flex-col justify-center">
          <motion.svg
            className="pointer-events-none absolute -left-20 top-10 hidden h-24 w-24 -rotate-6 lg:block"
            viewBox="0 0 96 96"
            fill="none"
            aria-hidden="true"
          >
            <motion.path
              d="M88 10C53 17 30 34 22 64"
              stroke="#C6A45A"
              strokeWidth="2"
              strokeLinecap="round"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              whileInView={reduceMotion ? undefined : { pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d="m14 55 8 10 13-5"
              stroke="#C6A45A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={reduceMotion ? undefined : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: 0.65 }}
            />
          </motion.svg>
          <p className="text-xs uppercase tracking-[.35em]" style={{ color: '#C6A45A' }}>{fr ? 'Une preuve éditoriale' : 'An editorial proof system'}</p>
          <h2 id="editorial-proof-title" className="mt-5 text-4xl font-light leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl" style={{ color: '#FFFFFF' }}>
            {fr ? 'Le moment est vivant. La preuve doit le rester.' : 'The moment is alive. The proof should be too.'}
          </h2>
          <p className="mt-6 text-lg leading-relaxed" style={{ color: '#CDBFAE' }}>
            {fr
              ? 'CREOVA transforme une couverture ponctuelle en une séquence visuelle cohérente : assez humaine pour être ressentie, assez structurée pour continuer à servir.'
              : 'CREOVA turns one-time coverage into a coherent visual sequence: human enough to feel, structured enough to keep working.'}
          </p>

          <ol className="mt-10 border-t" style={{ borderColor: 'rgba(205,191,174,.2)' }}>
            {proof.map(([number, title, description]) => (
              <li key={number} className="grid grid-cols-[3rem_1fr] gap-4 border-b py-5" style={{ borderColor: 'rgba(205,191,174,.2)' }}>
                <span className="pt-1 text-[10px] tracking-[.22em]" style={{ color: '#C6A45A' }}>{number}</span>
                <span>
                  <strong className="block text-lg font-medium" style={{ color: '#FFFFFF' }}>{title}</strong>
                  <span className="mt-1 block text-sm leading-relaxed" style={{ color: '#B7BBC3' }}>{description}</span>
                </span>
              </li>
            ))}
          </ol>

          <Link to="/work/black-student-success-centre" className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold" style={{ color: '#C6A45A' }}>
            {fr ? 'Voir l’étude de cas' : 'Read the case study'} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
