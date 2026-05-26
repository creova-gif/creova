import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  const dotX = useSpring(x, { stiffness: 700, damping: 32 });
  const dotY = useSpring(y, { stiffness: 700, damping: 32 });
  const ringX = useSpring(x, { stiffness: 180, damping: 20 });
  const ringY = useSpring(y, { stiffness: 180, damping: 20 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const style = document.createElement('style');
    style.id = 'cc-no-cursor';
    style.textContent = '*, *::before, *::after { cursor: none !important; }';
    document.head.appendChild(style);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);
    const down = () => setClicking(true);
    const up = () => setClicking(false);

    const over = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, [role="button"], input, textarea, select, label, [data-interactive]')) {
        setHovering(true);
      }
    };
    const out = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button, [role="button"], input, textarea, select, label, [data-interactive]')) {
        setHovering(false);
      }
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);
    document.addEventListener('mousedown', down);
    document.addEventListener('mouseup', up);
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
      document.removeEventListener('mousedown', down);
      document.removeEventListener('mouseup', up);
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseout', out);
      document.getElementById('cc-no-cursor')?.remove();
    };
  }, [x, y]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Dot — fast, tight tracking */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: 7,
          height: 7,
          backgroundColor: '#A68F59',
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.4 : hovering ? 0 : 1,
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Ring — slow, spring lag */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 38,
          height: 38,
          borderColor: 'rgba(166,143,89,0.65)',
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.65 : hovering ? 1.55 : 1,
          backgroundColor: hovering ? 'rgba(166,143,89,0.06)' : 'transparent',
        }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
