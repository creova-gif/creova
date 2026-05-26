import { useRef, useCallback, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxAngle?: number;
  spotlight?: boolean;
  spotlightColor?: string;
  onClick?: () => void;
  [key: string]: unknown;
}

export function TiltCard({
  children,
  className = '',
  style,
  maxAngle = 8,
  spotlight = false,
  spotlightColor = 'rgba(166,143,89,0.12)',
  onClick,
  ...rest
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springRotX = useSpring(rotX, { stiffness: 250, damping: 24 });
  const springRotY = useSpring(rotY, { stiffness: 250, damping: 24 });

  const [spotPos, setSpotPos] = useState({ x: 0, y: 0 });
  const [spotVisible, setSpotVisible] = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rotY.set(nx * maxAngle * 2);
    rotX.set(-ny * maxAngle * 2);
    if (spotlight) {
      setSpotPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setSpotVisible(true);
    }
  }, [rotX, rotY, maxAngle, spotlight]);

  const onLeave = useCallback(() => {
    rotX.set(0);
    rotY.set(0);
    setSpotVisible(false);
  }, [rotX, rotY]);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        ...style,
        rotateX: springRotX,
        rotateY: springRotY,
      }}
      transformTemplate={(_, t) => `perspective(900px) ${t}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      {...(rest as object)}
    >
      {spotlight && (
        <div
          className="absolute pointer-events-none rounded-full transition-opacity duration-300"
          style={{
            width: 280,
            height: 280,
            left: spotPos.x - 140,
            top: spotPos.y - 140,
            background: `radial-gradient(circle, ${spotlightColor} 0%, transparent 65%)`,
            opacity: spotVisible ? 1 : 0,
            zIndex: 2,
          }}
        />
      )}
      {children}
    </motion.div>
  );
}
