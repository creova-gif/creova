import { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';

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

  useEffect(() => {
    if (!videoSrc) {
      setVideoFailed(true);
      return;
    }
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
  }, [videoSrc]);

  const showVideo = videoSrc && !videoFailed;

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

      {(!showVideo || !videoReady) && (
        <motion.img
          src={fallbackSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 0.8 }}
        />
      )}

      {overlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(18,18,18,0.95) 0%, rgba(18,18,18,0.7) 60%, rgba(18,18,18,0.4) 100%)',
          }}
        />
      )}

      {children && <div className="relative z-10 w-full h-full">{children}</div>}
    </div>
  );
}
