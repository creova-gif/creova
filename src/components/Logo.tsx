import { motion } from 'motion/react';

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
    <motion.svg
      role="img"
      aria-label="CREOVA"
      viewBox="0 267 2048 1513"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        flexShrink: 0,
        color: color ?? MARK_COLORS[variant],
      }}
      initial={animateIn ? { opacity: 0, scale: 0.85, rotate: -6 } : false}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={interactive ? { scale: 1.06, rotate: -3 } : undefined}
      whileTap={interactive ? { scale: 0.96 } : undefined}
    >
      <path d="M47.9235 713.584C79.9163 629.595 124.391 554.264 181.413 487.559C238.402 420.921 304.95 365.509 380.958 321.325C417.483 300.155 455.126 282.013 494.049 267L646.623 479.197C609.999 490.786 574.984 506.59 541.644 526.542C462.221 574.183 398.695 638.254 351.165 718.753C303.669 799.319 279.888 888.05 279.888 985.045C279.888 1082.04 303.209 1172.98 349.852 1252.62C396.527 1332.3 459.987 1395.97 540.363 1443.58C620.707 1491.22 710.148 1515.03 808.59 1515.03C898.459 1515.03 980.938 1494.68 1056.09 1453.98C1127.24 1415.5 1187.15 1363.74 1235.86 1298.85L1403.12 1531.49C1349.68 1588.25 1287.56 1636.45 1216.78 1676.09C1093.27 1745.36 957.157 1780 808.558 1780C696.287 1780 591.276 1759.62 493.655 1718.96C396.067 1678.26 310.534 1622 237.088 1550.09C163.676 1478.22 105.8 1393.8 63.4601 1296.8C21.1862 1199.84 0 1095.93 0 985.078C0 888.083 15.9964 797.64 47.9235 713.584Z" fill="currentColor" />
      <path d="M949.273 268.12H1133.22L1289.24 482.127H1103.65L949.273 268.12Z" fill="currentColor" />
      <path d="M1763.55 1530.91H1569.75L650.894 268.12L850.733 268.12L1763.55 1530.91Z" fill="currentColor" />
      <path d="M2048 1530.91L1864.06 1531.49L1138.14 528.221H1322.08L2048 1530.91Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M805.47 584.488C651.516 584.488 526.666 709.601 526.666 863.949C526.666 1018.3 651.484 1143.41 805.47 1143.41C959.456 1143.41 1084.27 1018.3 1084.27 863.949C1084.27 709.601 959.456 584.488 805.47 584.488ZM805.47 1048.98C703.513 1048.98 620.903 966.146 620.903 863.949C620.903 761.753 703.513 678.915 805.47 678.915C907.426 678.915 990.069 761.753 990.069 863.949C990.069 966.146 907.459 1048.98 805.47 1048.98Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M805.47 524.896C569.433 524.896 378.067 716.712 378.067 953.339C378.067 1189.97 569.433 1381.78 805.47 1381.78C1041.51 1381.78 1232.91 1189.97 1232.91 953.339C1232.91 716.712 1041.54 524.896 805.47 524.896ZM805.47 1236.98C649.185 1236.98 522.528 1109.96 522.528 953.306C522.528 796.652 649.185 669.631 805.47 669.631C961.756 669.631 1088.48 796.652 1088.48 953.306C1088.48 1109.96 961.821 1236.98 805.47 1236.98Z" fill="currentColor" />
      <path d="M940.437 850.714C940.437 855.192 940.207 859.603 939.813 863.949C933.178 795.467 875.565 741.932 805.503 741.932C735.44 741.932 677.827 795.467 671.192 863.949C670.798 859.603 670.568 855.192 670.568 850.714C670.568 776.009 730.973 715.461 805.503 715.461C880.032 715.461 940.437 776.009 940.437 850.714Z" fill="currentColor" />
    </motion.svg>
  );
}
