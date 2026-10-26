import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';

const SESSION_KEY = 'creova-intro-shown';

// A short brand-board sequence. Content loads underneath it, so this is a
// reveal rather than a loading dependency.
const CYCLE = [
  { color: '#CDBFAE', glow: 'rgba(205,191,174,0.28)' },
  { color: '#887759', glow: 'rgba(136,119,89,0.32)' },
  { color: '#FFFFFF', glow: 'rgba(198,164,90,0.26)' },
];
const STEP_MS = 240;

/**
 * Plays once per browser tab session, on the very first page load — not on
 * client-side route changes (those are keyed off history, this is keyed off
 * sessionStorage). Server render and the pre-hydration client render both
 * return null, so there's no hydration mismatch; the decision is made in an
 * effect, which only runs in the browser.
 */
export function IntroLoader() {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'done'>('idle');
  const [step, setStep] = useState(0);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(SESSION_KEY);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (alreadyShown || reduceMotion) {
      sessionStorage.setItem(SESSION_KEY, '1');
      document.documentElement.classList.remove('creova-intro-pending');
      setPhase('done');
      return;
    }

    setPhase('playing');
    sessionStorage.setItem(SESSION_KEY, '1');

    // Advance through the colour cycle, then hold on the final (white) frame.
    const stepper = setInterval(() => {
      setStep((s) => {
        if (s >= CYCLE.length - 1) {
          clearInterval(stepper);
          return s;
        }
        return s + 1;
      });
    }, STEP_MS);

    const hold = STEP_MS * (CYCLE.length - 1) + 380;
    const timer = setTimeout(() => {
      setPhase('done');
      document.documentElement.classList.remove('creova-intro-pending');
    }, hold + 320);

    return () => {
      clearInterval(stepper);
      clearTimeout(timer);
      document.documentElement.classList.remove('creova-intro-pending');
    };
  }, []);

  const current = CYCLE[step];
  const isFinal = step === CYCLE.length - 1;

  return (
    <AnimatePresence>
      {phase === 'playing' && <motion.div
        key="intro"
        data-creova-intro
        className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none overflow-hidden"
        style={{ backgroundColor: '#2D1011' }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }}
      >
        <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: '#C6A45A' }} />
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{ width: 420, height: 420, background: `radial-gradient(circle, ${current.glow} 0%, transparent 68%)` }}
          animate={{ scale: isFinal ? [1, 1.15] : 1, opacity: isFinal ? [0.8, 0.4] : 1 }}
          transition={{ duration: isFinal ? 0.7 : 0.3, ease: 'easeOut' }}
        />

        <AnimatePresence mode="popLayout">
          <motion.div
            key={step}
            className="relative flex flex-col items-center gap-5"
            initial={{ opacity: 0, scale: 0.82, rotate: -6 }}
            animate={{
              opacity: 1,
              scale: isFinal ? [1, 1.06, 1] : 1,
              rotate: 0,
            }}
            exit={{ opacity: 0, scale: 1.12, transition: { duration: 0.18 } }}
            transition={{ duration: isFinal ? 0.6 : 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <Logo color={current.color} className="h-16 sm:h-20 w-auto" interactive={false} />
            {isFinal && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <div className="text-xl sm:text-2xl font-bold tracking-[0.28em]" style={{ color: '#FFFFFF' }}>CREOVA</div>
                <div className="mt-1 text-[9px] uppercase tracking-[0.42em]" style={{ color: '#CDBFAE' }}>Creative Studio</div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>}
    </AnimatePresence>
  );
}
