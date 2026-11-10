import { motion, useReducedMotion } from 'motion/react';

export type EditorialPhoto = {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  label: string;
  objectPosition?: string;
};

type EditorialPhotoSequenceProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  photos: [EditorialPhoto, EditorialPhoto, EditorialPhoto];
  dark?: boolean;
};

const layouts = [
  'lg:col-span-7 lg:row-span-6',
  'lg:col-span-5 lg:row-span-3',
  'lg:col-span-5 lg:row-span-3',
];

/** An asymmetric, motion-aware contact sheet for story-rich page sections. */
export function EditorialPhotoSequence({
  id,
  eyebrow,
  title,
  description,
  photos,
  dark = false,
}: EditorialPhotoSequenceProps) {
  const reduceMotion = useReducedMotion();
  const foreground = dark ? '#FFFFFF' : '#2D1011';
  const muted = dark ? '#CDBFAE' : '#655B54';

  return (
    <section
      id={id}
      className="relative overflow-hidden py-20 lg:py-28"
      style={{ backgroundColor: dark ? '#0E0E0E' : '#F4EFE8' }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[#C6A45A]/25" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.35em]" style={{ color: dark ? '#B39C68' : '#75664C' }}>{eyebrow}</p>
            <h2 className="max-w-3xl text-4xl leading-[1.02] tracking-tight md:text-6xl" style={{ color: foreground }}>{title}</h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed lg:justify-self-end lg:text-lg" style={{ color: muted }}>{description}</p>
        </div>

        <div className="grid gap-4 lg:h-[650px] lg:grid-cols-12 lg:grid-rows-6">
          {photos.map((photo, index) => (
            <motion.figure
              key={`${photo.src}-${photo.label}`}
              className={`group relative min-h-[290px] overflow-hidden rounded-2xl ${layouts[index]}`}
              initial={reduceMotion ? false : { opacity: 0, y: 42, clipPath: 'inset(12% 0 0 0 round 1rem)' }}
              whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0 round 1rem)' }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={{ duration: 0.85, delay: index * 0.11, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.img
                src={photo.src}
                srcSet={photo.srcSet}
                sizes={photo.srcSet ? (photo.sizes ?? '(min-width: 1024px) 42vw, 100vw') : undefined}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: photo.objectPosition ?? 'center' }}
                whileHover={reduceMotion ? undefined : { scale: 1.045 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1011]/85 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white">
                <span className="text-xs uppercase tracking-[0.24em]">{photo.label}</span>
                <span className="text-[10px] tracking-[0.28em] text-[#C6A45A]">0{index + 1}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
