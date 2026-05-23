import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';

interface ScrollScrubTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

interface WordSpanProps {
  word: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}

function WordSpan({ word, index, total, scrollYProgress }: WordSpanProps) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(scrollYProgress, [start, end], [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}
    </motion.span>
  );
}

export function ScrollScrubText({ text, className = '', style }: ScrollScrubTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.35'],
  });

  const words = text.split(' ');

  return (
    <div ref={containerRef} className={className} style={style}>
      <p className="flex flex-wrap gap-x-[0.28em] gap-y-1">
        {words.map((word, i) => (
          <WordSpan
            key={i}
            word={word}
            index={i}
            total={words.length}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </p>
    </div>
  );
}
