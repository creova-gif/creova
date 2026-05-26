import { motion } from 'motion/react';
import { useReducedMotion } from 'motion/react';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
  once?: boolean;
}

export function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  once = true,
}: RevealOnScrollProps) {
  const prefersReduced = useReducedMotion();

  const offset = { up: { y: 36 }, left: { x: -36 }, right: { x: 36 }, none: {} };

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset[direction] }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
