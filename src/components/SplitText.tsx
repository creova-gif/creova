import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface SplitTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  stagger?: number;
  mode?: 'words' | 'chars';
  once?: boolean;
  tag?: keyof JSX.IntrinsicElements;
}

export function SplitText({
  text,
  className = '',
  style,
  delay = 0,
  stagger = 0.04,
  mode = 'words',
  once = true,
  tag: Tag = 'span',
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once, margin: '-10% 0px' });

  const units = mode === 'chars' ? text.split('') : text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const unitVariants = {
    hidden: {
      opacity: 0,
      y: mode === 'chars' ? 20 : 18,
      rotateX: mode === 'chars' ? 20 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={className}
      style={{ ...style, display: 'block' }}
    >
      <span className="sr-only">{text}</span>
      <motion.span
        className="inline-flex flex-wrap gap-x-[0.22em]"
        style={{ perspective: '800px' }}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        aria-hidden="true"
      >
        {units.map((unit, i) => (
          <motion.span
            key={i}
            variants={unitVariants}
            className="inline-block"
            style={{ transformOrigin: 'bottom center' }}
            aria-hidden="true"
          >
            {unit === '' ? ' ' : unit}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
