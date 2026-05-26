import { motion } from 'motion/react';
import { useReducedMotion } from 'motion/react';

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
  mode?: 'fade' | '3d';
  once?: boolean;
}

export function RevealOnScroll({
  children,
  className = '',
  style,
  delay = 0,
  direction = 'up',
  mode = 'fade',
  once = true,
}: RevealOnScrollProps) {
  const prefersReduced = useReducedMotion();

  const offset = { up: { y: 40 }, left: { x: -40 }, right: { x: 40 }, none: {} };

  if (prefersReduced) {
    return <div className={className} style={style}>{children}</div>;
  }

  if (mode === '3d') {
    return (
      <div style={{ perspective: '900px', ...style }}>
        <motion.div
          className={className}
          initial={{ opacity: 0, y: 32, rotateX: 14, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          viewport={{ once, margin: '-50px' }}
          transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d', height: '100%' }}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, ...offset[direction] }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
