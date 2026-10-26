import { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface VideoHeroProps {
  videoSrc?: string;
  posterSrc?: string;
  fallbackSrc: string;
  overlay?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function VideoHero({
  videoSrc,
  posterSrc,
  fallbackSrc,
  overlay = true,
  className = '',
  children,
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  // The prerendered static HTML is generated once, server-side, with no way
  // to know any individual visitor's reduced-motion preference — so it can
  // never safely contain a `<video autoplay>` tag. A browser's native HTML
  // parser starts that autoplay the instant it parses the markup, before any
  // JS has loaded to check the real preference. Gating on hasMounted (only
  // ever true client-side, after this effect runs) keeps the initial/server
  // render on the plain poster image unconditionally, and only swaps in the
  // real <video> element once we can actually check prefersReduced.
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const attemptVideo = hasMounted && !prefersReduced && !!videoSrc;
  const showVideo = attemptVideo && !videoFailed;

  useEffect(() => {
    if (!attemptVideo) return;
    const vid = videoRef.current;
    if (!vid) return;

    const onCanPlay = () => setVideoReady(true);
    const onError = () => setVideoFailed(true);

    vid.addEventListener('canplaythrough', onCanPlay);
    vid.addEventListener('error', onError);
    return () => {
      vid.removeEventListener('canplaythrough', onCanPlay);
      vid.removeEventListener('error', onError);
    };
  }, [attemptVideo]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {showVideo && (
        <motion.video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc || fallbackSrc}
          initial={{ opacity: 0 }}
          animate={{ opacity: videoReady ? 0.45 : 0 }}
          transition={{ duration: 1.5 }}
          aria-hidden="true"
        >
          <source src={videoSrc} type="video/mp4" />
        </motion.video>
      )}

      {/* Before mount (incl. the static prerendered HTML) and whenever
          reduced motion is preferred, always the plain poster — never the
          animated crossfade, which would itself be an unnecessary motion. */}
      {!hasMounted || prefersReduced ? (
        <img
          src={posterSrc || fallbackSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.3 }}
        />
      ) : (
        (!showVideo || !videoReady) && (
          <motion.img
            src={fallbackSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 0.8 }}
          />
        )
      )}

      {overlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(45,16,17,0.95) 0%, rgba(45,16,17,0.7) 60%, rgba(45,16,17,0.4) 100%)',
          }}
        />
      )}

      {children && <div className="relative z-10 w-full h-full">{children}</div>}
    </div>
  );
}
