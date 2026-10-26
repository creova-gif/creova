import { useScroll, motion, useSpring } from 'motion/react';

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 280, damping: 35 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 pointer-events-none z-[9000]"
      style={{
        height: '2px',
        scaleX,
        transformOrigin: '0% 50%',
        background: 'linear-gradient(90deg, #C6A45A 0%, #887759 60%, #C6A45A 100%)',
        backgroundSize: '200% 100%',
      }}
    />
  );
}
