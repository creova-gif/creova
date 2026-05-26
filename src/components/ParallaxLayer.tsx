import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number; // 0.1 slow, 0.5 fast. negative = opposite direction
  className?: string;
  style?: React.CSSProperties;
}

export function ParallaxLayer({ children, speed = 0.25, className = '', style }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const yRange = 120 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [-yRange, yRange]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={style}>
      <motion.div style={prefersReduced ? {} : { y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
