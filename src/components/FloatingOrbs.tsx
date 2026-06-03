import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

interface OrbConfig {
  size: number;
  left: string;
  top: string;
  color: string;
  duration: number;
  delay: number;
  path: { x: string[]; y: string[] };
}

const orbs: OrbConfig[] = [
  {
    size: 520,
    left: '8%',
    top: '15%',
    color: 'rgba(166,143,89,0.09)',
    duration: 20,
    delay: 0,
    path: { x: ['0%', '4%', '-3%', '2%', '0%'], y: ['0%', '-3%', '4%', '-2%', '0%'] },
  },
  {
    size: 380,
    left: '72%',
    top: '55%',
    color: 'rgba(177,100,59,0.07)',
    duration: 26,
    delay: 7,
    path: { x: ['0%', '-5%', '3%', '-2%', '0%'], y: ['0%', '4%', '-3%', '3%', '0%'] },
  },
  {
    size: 300,
    left: '45%',
    top: '78%',
    color: 'rgba(166,143,89,0.06)',
    duration: 18,
    delay: 12,
    path: { x: ['0%', '3%', '-4%', '1%', '0%'], y: ['0%', '-4%', '2%', '-3%', '0%'] },
  },
  {
    size: 240,
    left: '85%',
    top: '12%',
    color: 'rgba(177,100,59,0.06)',
    duration: 22,
    delay: 4,
    path: { x: ['0%', '-3%', '5%', '-2%', '0%'], y: ['0%', '3%', '-4%', '2%', '0%'] },
  },
];

export function FloatingOrbs() {
  const prefersReduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setEnabled(mq.matches);
    const handler = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Ambient orbs are purely decorative. Skip them on tablets/phones and for
  // users who prefer reduced motion — large blurred, animating layers are the
  // most GPU-expensive element on the page and barely visible on small screens.
  if (!enabled || prefersReduced) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.left,
            top: orb.top,
            translateX: '-50%',
            translateY: '-50%',
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 68%)`,
            filter: 'blur(32px)',
            willChange: 'transform',
          }}
          animate={{
            x: orb.path.x,
            y: orb.path.y,
            scale: [1, 1.06, 0.96, 1.03, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
