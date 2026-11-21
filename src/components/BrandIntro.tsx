import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import primaryLockupSandstone from '../assets/creova-primary-lockup-sandstone.png';

const INTRO_DURATION_MS = 900;

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
          className="creova-brand-intro pointer-events-none fixed inset-0 z-[10000] grid place-items-center overflow-hidden bg-[#2B1112]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="relative w-[min(78vw,38rem)]"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.52, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="overflow-hidden"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 0)' }}
              transition={{ duration: 0.52, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={primaryLockupSandstone}
                alt=""
                className="h-auto w-full"
                width="1147"
                height="259"
                decoding="sync"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
