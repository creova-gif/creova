import { useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Magnetic({ children, strength = 0.28, className = '', style }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 14, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 180, damping: 14, mass: 0.1 });
  const prefersReduced = usePrefersReducedMotion();

  const onMove = useCallback((e: React.MouseEvent) => {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  }, [x, y, strength, prefersReduced]);

  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  // If reduced motion turns on mid-hover, onMove above stops updating but
  // whatever offset was already applied would otherwise stay stuck — snap
  // back to neutral immediately instead of animating there.
  useEffect(() => {
    if (prefersReduced) {
      springX.jump(0);
      springY.jump(0);
    }
  }, [prefersReduced, springX, springY]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, ...style }}
      className={className || 'inline-block'}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
