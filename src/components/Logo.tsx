import { motion } from 'motion/react';
import logoNavy from '../assets/logo-mark-navy.png';

const MARK_COLORS = {
  navy: '#2D1011',
  white: '#FFFFFF',
  red: '#887759',
  blue: '#CDBFAE',
  gold: '#C6A45A',
} as const;

interface LogoProps {
  variant?: keyof typeof MARK_COLORS;
  color?: string;
  className?: string;
  /** Plays the entrance animation once on mount instead of just sitting in resting state. */
  animateIn?: boolean;
  /** Adds a subtle hover tilt + scale, meant for interactive contexts like nav links. */
  interactive?: boolean;
}

export function Logo({ variant = 'navy', color, className = 'h-12 w-auto', animateIn = false, interactive = true }: LogoProps) {
  return (
    <motion.span
      role="img"
      aria-label="CREOVA"
      className={className}
      style={{
        aspectRatio: '2048 / 1593',
        display: 'inline-block',
        flexShrink: 0,
        backgroundColor: color ?? MARK_COLORS[variant],
        WebkitMaskImage: `url(${logoNavy})`,
        maskImage: `url(${logoNavy})`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
      initial={animateIn ? { opacity: 0, scale: 0.85, rotate: -6 } : false}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={interactive ? { scale: 1.06, rotate: -3 } : undefined}
      whileTap={interactive ? { scale: 0.96 } : undefined}
    />
  );
}
