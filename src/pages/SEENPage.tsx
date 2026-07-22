import { useState, useRef, useCallback } from 'react';
import { Link } from '../i18n/LocaleLink';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { ArrowRight, Play, Globe, Shield, Mic, BookOpen, Heart, Star, ChevronDown, Lock, Layers, Award } from 'lucide-react';
import seenForyou from '../assets/seen-foryou.jpg';
import seenOnboard from '../assets/seen-onboard.jpg';
import seenRoles from '../assets/seen-roles.jpg';
import seenSplash from '../assets/seen-splash.jpg';
import { PageSEO } from '../components/PageSEO';

const storyWorlds = [
  {
    title: "Black Atlantic Canada",
    description: "Oral histories, music, and resistance from the oldest Black communities in North America.",
    lang: "EN / FR",
  },
  {
    title: "Montreal's Jazz Scene",
    description: "The underground sounds and hidden stories of a city that shaped Canadian music forever.",
    lang: "EN / FR",
  },
  {
    title: "Langues Autochtones",
    description: "Indigenous language revitalization through story — Cree, Ojibwe, Michif, and more.",
    lang: "FR / Indigenous",
  },
  {
    title: "First Generation",
    description: "Immigrant stories of arrival, belonging, and becoming Canadian — in every language.",
    lang: "EN / FR / ES",
  }
];

const pillars = [
  {
    icon: BookOpen,
    title: "Story Worlds",
    description: "Not just content — immersive experiences combining narration, ambient audio, and text that transport you into a cultural moment.",
  },
  {
    icon: Lock,
    title: "Creator Ownership",
    description: "You keep full IP rights. Always. SEEN makes no claims on your work. Publish, earn, and own your narrative.",
  },
  {
    icon: Shield,
    title: "Cultural Moderation",
    description: "Content flagging that includes \"cultural appropriation\" as a category, with escalation to cultural advisors — not just automated bans.",
  },
  {
    icon: Mic,
    title: "Multilingual First",
    description: "English, French, Spanish, and Indigenous languages. Accessibility customization built into onboarding from day one.",
  },
  {
    icon: Layers,
    title: "Audio-First Design",
    description: "Cinematic soundscapes and narration carry the story. SEEN is built for listening as much as reading.",
  }
];

function AppPreview3D() {
  const stageRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springX = useSpring(rawX, { stiffness: 60, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 60, damping: 20 });

  // MacBook: tilted left, mouse adds dynamic pitch/yaw
  const mbRotateY = useTransform(springX, [-1, 1], prefersReduced ? [-26, -26] : [-38, -14]);
  const mbRotateX = useTransform(springY, [-1, 1], prefersReduced ? [8, 8] : [14, 2]);

  // iPhone: opposite tilt, pops toward viewer
  const ipRotateY = useTransform(springX, [-1, 1], prefersReduced ? [19, 19] : [10, 28]);
  const ipRotateX = useTransform(springY, [-1, 1], prefersReduced ? [-4, -4] : [-10, 2]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const el = stageRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const nx = ((e.clientX - left) / width) * 2 - 1;
    const ny = ((e.clientY - top) / height) * 2 - 1;
    rawX.set(nx);
    rawY.set(ny);
  }, [rawX, rawY]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  const particles = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    dur: Math.random() * 6 + 5,
    delay: Math.random() * 4,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <section
      ref={stageRef}
      className="relative overflow-hidden select-none"
      style={{ backgroundColor: '#080808', paddingTop: '6rem', paddingBottom: '6rem' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <PageSEO
        title="SEEN — Multilingual Storytelling Platform"
        description="SEEN is CREOVA's upcoming multilingual audio storytelling platform celebrating BIPOC voices and cultural narratives across Canada."
        path="/seen"
      />
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: p.id % 3 === 0 ? '#A68F59' : p.id % 3 === 1 ? '#B1643B' : '#F5F1EB',
              opacity: p.opacity,
            }}
            animate={{ y: [0, -28, 0], opacity: [p.opacity, p.opacity * 0.3, p.opacity] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Deep ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '900px', height: '900px',
            top: '50%', left: '50%',
            x: '-50%', y: '-50%',
            background: 'radial-gradient(circle, rgba(166,143,89,0.12) 0%, transparent 65%)',
          }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute rounded-full" style={{
          width: '500px', height: '500px',
          top: '30%', left: '15%',
          background: 'radial-gradient(circle, rgba(177,100,59,0.07) 0%, transparent 70%)',
        }} />
      </div>

      {/* Perspective grid floor */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" style={{
        background: 'linear-gradient(to top, rgba(166,143,89,0.04) 0%, transparent 100%)',
        maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
      }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.5em] uppercase mb-4" style={{ color: '#A68F59' }}>App Preview</p>
          <h2 className="text-3xl md:text-5xl mb-4" style={{ color: '#F5F1EB' }}>Experience SEEN</h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#7A6F66' }}>
            A cultural operating system — available on every screen. Move your cursor to explore.
          </p>
        </motion.div>

        {/* 3D Stage */}
        <div className="relative flex flex-col lg:flex-row items-center justify-center" style={{ minHeight: '520px', perspective: '1400px' }}>

          {/* ── MacBook 3D ── */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            style={{
              rotateY: mbRotateY,
              rotateX: mbRotateX,
              transformStyle: 'preserve-3d',
              zIndex: 10,
            }}
          >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div style={{
              width: 'min(560px, 88vw)',
              filter: 'drop-shadow(0 60px 100px rgba(0,0,0,0.9)) drop-shadow(0 0 40px rgba(166,143,89,0.15))',
              transformStyle: 'preserve-3d',
            }}>
              {/* Lid */}
              <div className="rounded-t-2xl overflow-hidden relative" style={{
                backgroundColor: '#1c1c1e',
                padding: '16px 16px 0',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1), 0 -4px 20px rgba(166,143,89,0.08)',
                transformStyle: 'preserve-3d',
              }}>
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: '#3a3a3a' }} />
                <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '16/10', backgroundColor: '#000' }}>
                  <motion.img src={seenOnboard} alt="SEEN onboarding" className="w-full h-full object-cover absolute inset-0"
                    animate={{ opacity: [1, 1, 0, 0, 1] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'linear', times: [0, 0.38, 0.5, 0.88, 1] }}
                  />
                  <motion.img src={seenRoles} alt="SEEN roles" className="w-full h-full object-cover absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0, 1, 1, 0] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'linear', times: [0, 0.38, 0.5, 0.88, 1] }}
                  />
                  {/* Screen glow */}
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 55%)',
                    pointerEvents: 'none',
                  }} />
                  {/* Screen reflection at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-8" style={{
                    background: 'linear-gradient(to top, rgba(166,143,89,0.08), transparent)',
                    pointerEvents: 'none',
                  }} />
                </div>
              </div>
              {/* Hinge */}
              <div style={{ height: '4px', background: 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)' }} />
              {/* Base */}
              <div className="rounded-b-xl flex flex-col items-center" style={{
                backgroundColor: '#1c1c1e',
                padding: '12px 28px 16px',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)',
              }}>
                {[0.88, 0.95, 0.90, 0.72].map((w, i) => (
                  <div key={i} className="rounded-sm mb-1 w-full" style={{
                    height: '5px',
                    width: `${w * 100}%`,
                    backgroundColor: 'rgba(255,255,255,0.045)',
                  }} />
                ))}
                <div className="rounded-lg mt-2" style={{ width: '26%', height: '30px', backgroundColor: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.06)' }} />
              </div>
              {/* Ground shadow */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full"
                style={{ width: '75%', height: '16px', background: 'radial-gradient(ellipse, rgba(0,0,0,0.7) 0%, transparent 80%)', opacity: 0.6 }} />
            </div>

            {/* Web label */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-10 left-4 px-3 py-1.5 rounded-full text-xs tracking-widest uppercase backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(166,143,89,0.15)', border: '1px solid rgba(166,143,89,0.35)', color: '#A68F59' }}
            >
              Web
            </motion.div>
          </motion.div>
          </motion.div>

          {/* ── iPhone 3D ── */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="lg:-ml-12 lg:translate-y-16"
            style={{
              rotateY: ipRotateY,
              rotateX: ipRotateX,
              transformStyle: 'preserve-3d',
              zIndex: 20,
            }}
          >
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
          >
            <div style={{
              width: 'min(196px, 50vw)',
              filter: 'drop-shadow(0 60px 120px rgba(0,0,0,1)) drop-shadow(0 0 30px rgba(177,100,59,0.2))',
              transformStyle: 'preserve-3d',
            }}>
              <div className="relative rounded-[2.8rem]" style={{
                backgroundColor: '#181818',
                padding: '14px 7px 10px',
                boxShadow: '0 0 0 1.5px rgba(255,255,255,0.12), inset 0 0 0 1px rgba(255,255,255,0.05)',
              }}>
                {/* Dynamic Island */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 rounded-full"
                  style={{ width: '68px', height: '20px', backgroundColor: '#000' }} />
                {/* Buttons */}
                <div className="absolute rounded-r-full" style={{ left: '-2px', top: '22%', width: '3px', height: '36px', backgroundColor: '#2a2a2a' }} />
                <div className="absolute rounded-r-full" style={{ left: '-2px', top: '38%', width: '3px', height: '36px', backgroundColor: '#2a2a2a' }} />
                <div className="absolute rounded-l-full" style={{ right: '-2px', top: '30%', width: '3px', height: '50px', backgroundColor: '#2a2a2a' }} />
                {/* Screen */}
                <div className="rounded-[2.3rem] overflow-hidden relative" style={{ aspectRatio: '9/19.5', backgroundColor: '#000' }}>
                  <motion.img src={seenSplash} alt="SEEN splash" className="w-full h-full object-cover absolute inset-0"
                    animate={{ opacity: [1, 1, 0, 0, 1] }}
                    transition={{ duration: 11, repeat: Infinity, ease: 'linear', times: [0, 0.32, 0.44, 0.88, 1] }}
                  />
                  <motion.img src={seenForyou} alt="SEEN For You" className="w-full h-full object-cover absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0, 1, 1, 0] }}
                    transition={{ duration: 11, repeat: Infinity, ease: 'linear', times: [0, 0.32, 0.44, 0.88, 1] }}
                  />
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'linear-gradient(155deg, rgba(255,255,255,0.07) 0%, transparent 40%)',
                  }} />
                </div>
                {/* Home bar */}
                <div className="flex justify-center mt-2.5">
                  <div className="rounded-full" style={{ width: '38px', height: '4px', backgroundColor: 'rgba(255,255,255,0.22)' }} />
                </div>
                {/* Ground shadow */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full"
                  style={{ width: '65%', height: '14px', background: 'radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, transparent 80%)', opacity: 0.7 }} />
              </div>

              {/* iOS label */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                className="absolute -top-10 right-0 px-3 py-1.5 rounded-full text-xs tracking-widest uppercase backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(177,100,59,0.15)', border: '1px solid rgba(177,100,59,0.35)', color: '#B1643B' }}
              >
                iOS · Android
              </motion.div>
            </div>
          </motion.div>
          </motion.div>
        </div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mt-20"
        >
          {['For You Feed', 'Stories in Motion', 'CREOVA Music', 'Films & Collections', 'Creator · Viewer · Moderator', 'Cultural Moderation'].map(label => (
            <span key={label} className="px-4 py-2 rounded-full text-xs tracking-wide" style={{
              backgroundColor: 'rgba(245,241,235,0.05)',
              border: '1px solid rgba(245,241,235,0.09)',
              color: '#7A6F66',
            }}>
              {label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function SEENPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  const faqs = [
    {
      q: "When does SEEN launch?",
      a: "SEEN is currently in development. We're aiming for a beta with select creators by end of 2026, followed by a broader Canadian launch. Join the waitlist to be first."
    },
    {
      q: "Can I publish my own stories on SEEN?",
      a: "Yes — SEEN is built for creators first. You retain full IP rights. During our early access phase, we're onboarding a curated cohort of Canadian storytellers."
    },
    {
      q: "What languages does SEEN support?",
      a: "We're building multilingual from the ground up: English, French, Spanish, and select Indigenous languages. Accessibility customization is core to the onboarding experience."
    },
    {
      q: "Is SEEN free for listeners?",
      a: "We're exploring multiple access models. Our priority is ensuring underrepresented communities can access authentic cultural narratives without barriers."
    },
    {
      q: "How is SEEN different from Spotify or Netflix?",
      a: "Those platforms optimize for mass engagement. SEEN is optimized for cultural depth, community ownership, and authentic Canadian representation."
    }
  ];

  return (
    <div className="overflow-hidden" style={{ backgroundColor: '#1A1A2E' }}>

      {/* Hero — Motion Graphics */}
      <style>{`
        @keyframes seenShimmer {
          0%   { background-position: -400% center; }
          100% { background-position: 400% center; }
        }
        @keyframes scanBeam {
          0%   { transform: translateX(-120%); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateX(120%); opacity: 0; }
        }
        @keyframes sonarPulse {
          0%   { transform: scale(0.4); opacity: 0.6; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes driftUp {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: 0.5; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(-160px) translateX(20px); opacity: 0; }
        }
        @keyframes orbitCW {
          from { transform: rotate(0deg) translateX(260px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(260px) rotate(-360deg); }
        }
        @keyframes orbitCCW {
          from { transform: rotate(0deg) translateX(200px) rotate(0deg); }
          to   { transform: rotate(-360deg) translateX(200px) rotate(360deg); }
        }
        @keyframes auroraShift {
          0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
          33%  { transform: translate(-48%, -52%) scale(1.12) rotate(8deg); }
          66%  { transform: translate(-52%, -48%) scale(0.94) rotate(-6deg); }
        }
      `}</style>

      <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-4">

        {/* Aurora glow — SEEN teal palette */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            width: '140%', height: '140%',
            background: 'radial-gradient(ellipse 60% 50% at 35% 45%, rgba(20,143,119,0.28) 0%, transparent 65%), radial-gradient(ellipse 50% 55% at 68% 60%, rgba(13,107,85,0.18) 0%, transparent 60%)',
            animation: 'auroraShift 12s ease-in-out infinite',
          }} />
        </div>

        {/* Perspective grid — CREOVA gold */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `repeating-linear-gradient(90deg, #A68F59 0px, transparent 1px, transparent 80px),
                            repeating-linear-gradient(0deg, #A68F59 0px, transparent 1px, transparent 80px)`
        }} />

        {/* Sonar rings — SEEN teal */}
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="absolute rounded-full pointer-events-none" style={{
            width: '320px', height: '320px',
            top: '50%', left: '50%',
            marginTop: '-160px', marginLeft: '-160px',
            border: '1px solid rgba(20,143,119,0.55)',
            animation: `sonarPulse 4s ease-out infinite`,
            animationDelay: `${i * 1}s`,
          }} />
        ))}

        {/* Orbiting dots */}
        <div className="absolute pointer-events-none" style={{ top: '50%', left: '50%', width: 0, height: 0 }}>
          <div style={{
            position: 'absolute',
            width: '8px', height: '8px',
            borderRadius: '50%',
            backgroundColor: '#148F77',
            boxShadow: '0 0 14px 5px rgba(20,143,119,0.7)',
            animation: 'orbitCW 8s linear infinite',
            marginTop: '-4px', marginLeft: '-4px',
          }} />
          <div style={{
            position: 'absolute',
            width: '5px', height: '5px',
            borderRadius: '50%',
            backgroundColor: '#D4A843',
            boxShadow: '0 0 10px 3px rgba(212,168,67,0.6)',
            animation: 'orbitCCW 13s linear infinite',
            marginTop: '-2.5px', marginLeft: '-2.5px',
          }} />
          <div style={{
            position: 'absolute',
            width: '4px', height: '4px',
            borderRadius: '50%',
            backgroundColor: '#F5F1EB',
            opacity: 0.6,
            animation: 'orbitCW 20s linear infinite',
            animationDelay: '-6s',
            marginTop: '-2px', marginLeft: '-2px',
          }} />
        </div>

        {/* Floating cultural words */}
        {[
          { word: 'stories', x: '12%', delay: '0s', dur: '9s' },
          { word: 'identity', x: '78%', delay: '2s', dur: '11s' },
          { word: 'culture', x: '88%', delay: '4.5s', dur: '8s' },
          { word: 'sound', x: '6%', delay: '7s', dur: '12s' },
          { word: 'image', x: '70%', delay: '1s', dur: '10s' },
          { word: 'community', x: '22%', delay: '5.5s', dur: '9s' },
          { word: 'belong', x: '55%', delay: '3s', dur: '13s' },
        ].map(({ word, x, delay, dur }) => (
          <div key={word} className="absolute bottom-24 text-xs tracking-[0.35em] uppercase pointer-events-none select-none" style={{
            left: x,
            color: '#148F77',
            animation: `driftUp ${dur} ease-in-out infinite`,
            animationDelay: delay,
          }}>
            {word}
          </div>
        ))}

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-6 whitespace-nowrap"
          >
            <motion.div
              animate={{ scaleX: [1, 1.4, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="h-px w-8 flex-shrink-0" style={{ backgroundColor: '#148F77' }}
            />
            <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#148F77', fontFamily: 'var(--font-display)' }}>
              A CREOVA ORIGINAL PLATFORM
            </span>
            <motion.div
              animate={{ scaleX: [1, 1.4, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              className="h-px w-8 flex-shrink-0" style={{ backgroundColor: '#148F77' }}
            />
          </motion.div>

          {/* SEEN wordmark — deep 3D motion */}
          <div className="relative mb-6" style={{ perspective: '800px' }}>

            <motion.h1
              className="font-bold tracking-tight leading-none select-none relative"
              style={{
                fontSize: 'clamp(6rem, 22vw, 18rem)',
                backgroundImage: 'linear-gradient(135deg, #0A4A3A 0%, #148F77 28%, #CCFFEE 50%, #148F77 72%, #0D6B55 100%)',
                backgroundSize: '300% auto',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                animation: 'seenShimmer 10s linear infinite',
                fontFamily: 'var(--font-display)',
                textShadow: 'none',
                transformStyle: 'preserve-3d',
              }}
              initial={{ opacity: 0, rotateX: 30, y: 40 }}
              animate={{
                opacity: 1,
                rotateX: [0, -4, 2, -2, 0],
                rotateY: [0, 3, -3, 1.5, 0],
                y: 0,
              }}
              transition={{
                opacity: { duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
                rotateX: { duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1.5 },
                rotateY: { duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 1.5 },
                y: { duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
              }}
            >
              SEEN
            </motion.h1>

            {/* Glow halo behind text */}
            <motion.div
              className="absolute inset-0 -z-10 blur-3xl"
              animate={{ opacity: [0.15, 0.35, 0.15], scale: [0.9, 1.05, 0.9] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ background: 'radial-gradient(ellipse, rgba(20,143,119,0.55) 0%, transparent 70%)' }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-2xl mb-4 tracking-wide italic"
            style={{ color: '#CCFFEE', fontFamily: 'var(--font-display)' }}
          >
            Canada's Cultural Storytelling Platform
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55 }}
            className="text-sm md:text-base max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ color: 'rgba(204,255,238,0.6)', fontFamily: 'var(--font-body)' }}
          >
            Where Indigenous, Black Canadian, francophone, and immigrant voices own their stories — and audiences find the authentic Canada that mainstream platforms miss.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-widest uppercase"
              style={{ backgroundColor: 'rgba(20,143,119,0.12)', border: '1px solid rgba(20,143,119,0.4)', color: '#148F77' }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#148F77' }} />
              In Development
            </span>
            <span className="text-xs" style={{ color: 'rgba(204,255,238,0.45)' }}>
              Beta launching end of 2026 · Canada-wide launch to follow
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="max-w-md mx-auto"
          >
            {submitted ? (
              <div
                className="py-4 px-6 rounded-2xl text-center"
                style={{ backgroundColor: 'rgba(20,143,119,0.12)', border: '1px solid rgba(20,143,119,0.35)' }}
              >
                <Star className="w-6 h-6 mx-auto mb-2" style={{ color: '#148F77' }} />
                <p className="text-sm" style={{ color: '#CCFFEE' }}>You're on the list. We'll reach out first.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(20,143,119,0.3)',
                    color: '#CCFFEE',
                    caretColor: '#148F77'
                  }}
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 hover:opacity-90 flex items-center gap-2"
                  style={{ backgroundColor: '#148F77', color: '#FFFFFF' }}
                >
                  Join Waitlist
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
            <p className="text-xs mt-3" style={{ color: 'rgba(204,255,238,0.4)' }}>
              No spam. Early access for creators &amp; cultural communities.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 rounded-full flex items-start justify-center p-2" style={{ borderColor: '#148F77' }}>
            <div className="w-1 h-2 rounded-full" style={{ backgroundColor: '#148F77' }} />
          </div>
        </motion.div>
      </section>

      {/* App Preview — 3D Device Mockups */}
      <AppPreview3D />

      {/* The Problem */}
      <section className="py-28 px-4" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-xs tracking-[0.4em] uppercase mb-6" style={{ color: '#B1643B' }}>The Gap</p>
            <h2 className="text-3xl md:text-5xl mb-8 leading-tight" style={{ color: '#F5F1EB' }}>
              Canada is one of the world's most multicultural countries.{' '}
              <span style={{ color: '#4A3E36' }}>
                Yet its streaming platforms tell one story.
              </span>
            </h2>
            <p className="text-base md:text-lg leading-relaxed mb-6" style={{ color: '#7A6F66' }}>
              Indigenous, Black Canadian, francophone, immigrant, and other equity-deserving communities are chronically underrepresented in the stories Canadians can access. Cultural knowledge — oral histories, community narratives, multilingual stories — gets lost in algorithm-driven platforms optimized for mass engagement.
            </p>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: '#7A6F66' }}>
              Canadian creators from these communities have no dedicated, safe space to publish and own their work. Many lose IP rights to larger platforms.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Worlds Preview */}
      <section className="py-24 px-4" style={{ backgroundColor: '#121212' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: '#A68F59' }}>Story Worlds</p>
            <h2 className="text-3xl md:text-5xl" style={{ color: '#F5F1EB' }}>
              Enter the narrative.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {storyWorlds.map((world, i) => (
              <motion.div
                key={world.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="relative p-6 rounded-3xl overflow-hidden cursor-pointer"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(166, 143, 89, 0.15)' }}
              >
                <div
                  className="absolute inset-0 opacity-10 rounded-3xl"
                  style={{ background: `radial-gradient(circle at 70% 20%, #A68F59, transparent 60%)` }}
                />
                <div className="relative z-10">
                  <div
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] tracking-widest mb-4"
                    style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)', color: '#A68F59', border: '1px solid rgba(166, 143, 89, 0.25)' }}
                  >
                    <Play className="w-2.5 h-2.5" />
                    {world.lang}
                  </div>
                  <h3 className="text-lg font-medium mb-3" style={{ color: '#F5F1EB' }}>{world.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#7A6F66' }}>{world.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs mt-8 tracking-wider" style={{ color: '#4A3E36' }}>
            + MORE WORLDS IN DEVELOPMENT
          </p>
        </div>
      </section>

      {/* 6 Pillars */}
      <section className="py-28 px-4" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: '#B1643B' }}>What SEEN Provides</p>
            <h2 className="text-3xl md:text-5xl" style={{ color: '#F5F1EB' }}>
              Built different. By design.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl"
                style={{ backgroundColor: '#121212', border: '1px solid rgba(166, 143, 89, 0.1)' }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)' }}
                >
                  <pillar.icon className="w-5 h-5" style={{ color: '#A68F59' }} />
                </div>
                <h3 className="text-lg font-medium mb-3" style={{ color: '#F5F1EB' }}>{pillar.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7A6F66' }}>{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Credibility Bar */}
      <section className="py-16 px-4" style={{ borderTop: '1px solid rgba(166, 143, 89, 0.15)', borderBottom: '1px solid rgba(166, 143, 89, 0.15)', backgroundColor: '#121212' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: 'CA', label: 'Canadian-Built for Canadian Voices' },
              { stat: '3+', label: 'Languages at Launch' },
              { stat: '100%', label: 'Creator IP Ownership' },
              { stat: 'BIPOC', label: 'Led & Community-First' }
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#A68F59' }}>{item.stat}</div>
                <div className="text-xs tracking-wide" style={{ color: '#7A6F66' }}>{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 px-4" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: '#A68F59' }}>Questions</p>
            <h2 className="text-3xl md:text-4xl" style={{ color: '#F5F1EB' }}>Common questions about SEEN</h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                viewport={{ once: true }}
                className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(166, 143, 89, 0.15)' }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left transition-colors"
                  style={{ backgroundColor: openFaq === i ? 'rgba(166, 143, 89, 0.06)' : '#121212' }}
                >
                  <span className="text-sm md:text-base font-medium pr-4" style={{ color: '#F5F1EB' }}>{faq.q}</span>
                  <ChevronDown
                    className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
                    style={{ color: '#A68F59', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6" style={{ backgroundColor: '#121212' }}>
                    <p className="text-sm leading-relaxed" style={{ color: '#7A6F66' }}>{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEEN Ecosystem — App + Capsule */}
      <section className="py-24 px-4" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: '#A68F59' }}>
              One Ecosystem, Two Expressions
            </p>
            <h2 className="text-3xl md:text-5xl mb-6" style={{ color: '#F5F1EB' }}>
              SEEN is a platform — and a collection.
            </h2>
            <p className="text-base max-w-xl mx-auto mb-10" style={{ color: '#7A6F66' }}>
              Alongside the storytelling app, SEEN by CREOVA is also a wearable FW2026 capsule —
              built by the same creative team, launching this November. Same name, same story, worn on your sleeve.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 hover:opacity-90"
              style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)', border: '1px solid rgba(166, 143, 89, 0.3)', color: '#A68F59' }}
            >
              Explore the FW2026 Capsule
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 text-center relative overflow-hidden" style={{ backgroundColor: '#121212' }}>
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #A68F59 0%, transparent 60%)`
          }} />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div
              className="w-16 h-16 mx-auto mb-8 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)' }}
            >
              <Heart className="w-8 h-8" style={{ color: '#A68F59' }} />
            </div>
            <h2 className="text-3xl md:text-5xl mb-6" style={{ color: '#F5F1EB' }}>
              Your story deserves to be seen.
            </h2>
            <p className="text-base mb-10" style={{ color: '#7A6F66' }}>
              Join thousands of Canadians waiting for a platform built for them.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
              {[
                { icon: Award, text: 'Beta Late 2026' },
                { icon: Globe, text: 'Canada-Wide 2026' },
                { icon: Shield, text: 'BIPOC Led' }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2">
                  <badge.icon className="w-4 h-4" style={{ color: '#A68F59' }} />
                  <span className="text-sm" style={{ color: '#E3DCD3' }}>{badge.text}</span>
                </div>
              ))}
            </div>

            {submitted ? (
              <div
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl"
                style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)', border: '1px solid rgba(166, 143, 89, 0.3)', color: '#A68F59' }}
              >
                <Star className="w-4 h-4" />
                You're on the list
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                  style={{
                    backgroundColor: 'rgba(245, 241, 235, 0.07)',
                    border: '1px solid rgba(227, 220, 211, 0.15)',
                    color: '#F5F1EB',
                  }}
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 hover:opacity-90"
                  style={{ backgroundColor: '#F5F1EB', color: '#121212' }}
                >
                  Get Early Access
                </button>
              </form>
            )}

            <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(166, 143, 89, 0.15)' }}>
              <p className="text-xs mb-3" style={{ color: '#4A3E36' }}>A platform by</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm tracking-widest transition-opacity hover:opacity-70"
                style={{ color: '#E3DCD3' }}
              >
                CREOVA
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
