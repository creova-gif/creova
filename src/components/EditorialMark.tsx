import { useRef, type ReactNode } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

type EditorialMarkProps = {
  children: ReactNode;
  variant?: 'circle' | 'underline' | 'highlight';
  tone?: 'gold' | 'sand' | 'wine';
  className?: string;
};

const paths = {
  circle: 'M7 47C16 15 71 3 112 12c35 8 45 33 23 48C113 77 48 77 17 61 5 55 3 48 7 47Z',
  underline: 'M4 55c31-7 58-8 89-5 19 2 34 0 51-5',
  highlight: 'M5 43c31-5 55-3 82-2 21 1 38-1 55-4l-2 20c-34 4-72 2-104 4-11 0-21 1-31 3Z',
} as const;

export function EditorialMark({ children, variant = 'underline', tone = 'gold', className = '' }: EditorialMarkProps) {
  const markRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(markRef, { once: true, amount: 0.55 });
  const reduceMotion = useReducedMotion();
  const visible = Boolean(reduceMotion || inView);

  return (
    <span
      ref={markRef}
      className={`editorial-mark editorial-mark--${variant} editorial-mark--${tone} ${visible ? 'is-visible' : ''} ${className}`.trim()}
    >
      <span className="editorial-mark__text">{children}</span>
      <svg className="editorial-mark__stroke" viewBox="0 0 150 76" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d={paths[variant]} pathLength="1" />
      </svg>
    </span>
  );
}
