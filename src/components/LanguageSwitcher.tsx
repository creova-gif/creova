import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'desktop' | 'mobile';
}

export function LanguageSwitcher({ variant = 'desktop' }: LanguageSwitcherProps) {
  const { language, setLanguage, isChanging } = useLanguage();
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const rippleId = useRef(0);

  const isFR = language === 'fr';

  function handleSwitch(lang: 'en' | 'fr') {
    if (lang === language) return;
    setLanguage(lang);
  }

  function handleClick(e: React.MouseEvent, lang: 'en' | 'fr') {
    if (lang === language) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    rippleId.current += 1;
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, id: rippleId.current });
    setTimeout(() => setRipple(null), 500);
    handleSwitch(lang);
  }

  if (variant === 'mobile') {
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs tracking-[0.3em] uppercase" style={{ color: '#777777' }}>
          {isFR ? 'Langue' : 'Language'}
        </span>
        <div
          className="relative flex rounded-xl overflow-hidden"
          style={{
            backgroundColor: 'rgba(45,16,17,0.06)',
            border: '1px solid rgba(198,164,90,0.2)',
            padding: '3px',
          }}
        >
          {/* Sliding pill */}
          <motion.div
            className="absolute top-[3px] bottom-[3px] rounded-lg"
            style={{ backgroundColor: '#2D1011', width: 'calc(50% - 3px)' }}
            animate={{ x: isFR ? 'calc(100% + 3px)' : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 38, mass: 0.6 }}
          />
          {(['en', 'fr'] as const).map((lang) => (
            <button
              key={lang}
              onClick={(e) => handleClick(e, lang)}
              className="relative z-10 px-5 py-2 rounded-lg text-sm font-semibold tracking-wider transition-colors duration-200 min-w-[52px] overflow-hidden"
              style={{ color: language === lang ? '#FFFFFF' : '#777777' }}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Desktop variant — premium pill with spring animation
  return (
    <motion.div
      animate={{ scale: isChanging ? 0.96 : 1, opacity: isChanging ? 0.7 : 1 }}
      transition={{ duration: 0.12 }}
      className="flex items-center"
    >
      <div
        className="relative flex items-center rounded-full overflow-hidden select-none"
        style={{
          backgroundColor: 'rgba(45,16,17,0.05)',
          border: '1px solid rgba(198,164,90,0.22)',
          padding: '3px',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Sliding pill bg */}
        <motion.div
          className="absolute top-[3px] bottom-[3px] rounded-full"
          style={{
            backgroundColor: '#2D1011',
            width: 'calc(50% - 3px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          }}
          animate={{ x: isFR ? 'calc(100% + 3px)' : 0 }}
          transition={{ type: 'spring', stiffness: 550, damping: 40, mass: 0.55 }}
        />

        {(['en', 'fr'] as const).map((lang) => (
          <button
            key={lang}
            onClick={(e) => handleClick(e, lang)}
            aria-pressed={language === lang}
            aria-label={lang === 'en' ? 'Switch to English' : 'Passer en français'}
            className="relative z-10 overflow-hidden rounded-full flex items-center justify-center px-3.5 py-1.5 text-[11px] font-bold tracking-[0.14em] transition-colors duration-200"
            style={{ color: language === lang ? '#FFFFFF' : '#777777', minWidth: '44px' }}
          >
            {/* Label with crossfade */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={`${lang}-${language}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.14 }}
              >
                {lang.toUpperCase()}
              </motion.span>
            </AnimatePresence>

            {/* Ripple */}
            {ripple && (
              <motion.span
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: ripple.x - 20,
                  top: ripple.y - 20,
                  width: 40,
                  height: 40,
                  backgroundColor: 'rgba(198,164,90,0.3)',
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
