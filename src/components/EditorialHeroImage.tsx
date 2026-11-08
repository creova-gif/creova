import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

type EditorialHeroImageProps = {
  src: string;
  srcSet?: string;
  sizes?: string;
  objectPosition?: string;
  /** A little extra darkness for pages with longer copy. */
  deep?: boolean;
  /** Optional second frame turns the hero into an editorial diptych. */
  secondarySrc?: string;
  secondaryObjectPosition?: string;
  /** Short contact-sheet notation, e.g. "FIELD NOTE 01". */
  folio?: string;
};

/**
 * Shared image treatment for editorial page introductions.
 *
 * The photograph remains clearly visible on the right while a burgundy veil
 * protects text contrast on the left and across narrow screens.
 */
export function EditorialHeroImage({
  src,
  srcSet,
  sizes = '100vw',
  objectPosition = 'center',
  deep = false,
  secondarySrc,
  secondaryObjectPosition = 'center',
  folio,
}: EditorialHeroImageProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  return (
    <div ref={root} className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <motion.img
        src={src}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        alt=""
        className="absolute inset-0 h-[112%] w-full object-cover"
        style={{ objectPosition, y: reduceMotion ? '0%' : imageY }}
        initial={reduceMotion ? false : { opacity: 0.55, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1.015 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
      <div
        className="absolute inset-0"
        style={{
          background: deep
            ? 'linear-gradient(90deg, rgba(45,16,17,.98) 0%, rgba(45,16,17,.93) 46%, rgba(45,16,17,.64) 72%, rgba(45,16,17,.50) 100%)'
            : 'linear-gradient(90deg, rgba(45,16,17,.97) 0%, rgba(45,16,17,.88) 45%, rgba(45,16,17,.48) 74%, rgba(45,16,17,.34) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(0deg, rgba(45,16,17,.72) 0%, transparent 48%, rgba(14,14,14,.16) 100%)' }}
      />

      {/* Fine editorial rules and a moving inset make each photograph feel
          composed rather than simply assigned as a background. */}
      <div className="absolute inset-x-0 top-[18%] h-px bg-white/10" />
      <div className="absolute inset-x-0 bottom-[12%] h-px bg-white/10" />
      <div className="absolute bottom-[12%] right-[8%] top-[18%] w-px bg-white/10" />

      {secondarySrc && (
        <motion.div
          className="absolute right-[5vw] top-[18%] hidden w-[clamp(6.5rem,10vw,9.5rem)] overflow-hidden rounded-[1.15rem] border border-white/25 shadow-2xl lg:block"
          style={{ aspectRatio: '4 / 5' }}
          initial={reduceMotion ? false : { opacity: 0, y: 38, rotate: 4, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, rotate: 2, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={secondarySrc}
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: secondaryObjectPosition }}
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
          <div className="absolute bottom-3 left-3 rounded-full border border-white/30 bg-[#2D1011]/75 px-2 py-0.5 text-[7px] whitespace-nowrap tracking-[0.18em] text-white/80 backdrop-blur-sm">
            CREOVA / FRAME 02
          </div>
        </motion.div>
      )}

      {folio && (
        <motion.div
          className="absolute bottom-[4.5%] right-[5vw] hidden items-center gap-3 text-[9px] tracking-[0.32em] text-white/65 lg:flex"
          initial={reduceMotion ? false : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <span className="h-px w-10 bg-[#C6A45A]" />
          {folio}
        </motion.div>
      )}
    </div>
  );
}
