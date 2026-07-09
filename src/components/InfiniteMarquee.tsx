import { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'motion/react';

interface InfiniteMarqueeProps {
  items: string[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  separator?: string;
}

export function InfiniteMarquee({
  items,
  speed = 40,
  direction = 'left',
  className = '',
  separator = '·',
}: InfiniteMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const lastTime = useRef<number | null>(null);

  useAnimationFrame((time) => {
    if (lastTime.current === null) {
      lastTime.current = time;
      return;
    }
    const delta = time - lastTime.current;
    lastTime.current = time;

    const track = trackRef.current;
    if (!track) return;

    const halfWidth = track.scrollWidth / 2;
    const px = x.get();
    const step = (speed * delta) / 1000;

    if (direction === 'left') {
      const next = px - step;
      x.set(next <= -halfWidth ? 0 : next);
    } else {
      const next = px + step;
      x.set(next >= 0 ? -halfWidth : next);
    }
  });

  const doubled = [...items, ...items];

  return (
    <div className={`overflow-hidden w-full ${className}`} aria-hidden="true">
      <motion.div ref={trackRef} className="flex whitespace-nowrap" style={{ x }}>
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-6 text-sm tracking-[0.3em] uppercase font-light"
            style={{ color: 'rgba(166,143,89,0.6)' }}
          >
            {item}
            {i < doubled.length - 1 && (
              <span style={{ color: 'rgba(166,143,89,0.3)' }}>{separator}</span>
            )}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
