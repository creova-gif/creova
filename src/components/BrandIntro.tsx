import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Logo } from './Logo';

const INTRO_DURATION_MS = 850;

/**
 * A brief, first-session brand signature. The inline bootstrap in index.html
 * hides this before paint for returning sessions and reduced-motion users.
 */
export function BrandIntro() {
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const shouldShow = document.documentElement.dataset.creovaIntro === 'show';
    const delay = reduceMotion || !shouldShow ? 0 : INTRO_DURATION_MS;
    const timer = window.setTimeout(() => setVisible(false), delay);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden="true"
          className="creova-brand-intro pointer-events-none fixed inset-0 z-[10000] grid place-items-center overflow-hidden bg-[#2D1011]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="absolute h-64 w-64 rounded-full border border-[#C6A45A]/25 sm:h-80 sm:w-80"
            initial={{ scale: 0.72, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: 12 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="relative flex flex-col items-center gap-5"
            initial={{ opacity: 0, y: 18, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <Logo
              variant="white"
              className="h-24 w-auto sm:h-28"
              interactive={false}
            />
            <motion.span
              className="text-[10px] uppercase tracking-[0.46em] text-[#C6A45A] sm:text-xs"
              initial={{ opacity: 0, letterSpacing: '0.26em' }}
              animate={{ opacity: 1, letterSpacing: '0.46em' }}
              transition={{ delay: 0.18, duration: 0.45 }}
            >
              Culture, carried forward
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
