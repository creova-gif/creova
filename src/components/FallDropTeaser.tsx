import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ArrowRight, Mail, CheckCircle2 } from 'lucide-react';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const warmGradient = 'linear-gradient(135deg, #A68F59 0%, #B1643B 100%)';
const LAUNCH_DATE = new Date('2026-10-01T00:00:00');

// Real style codes from the FW2026 tech pack — names redacted
const DROP_01 = [
  { code: 'CREOVA_TEE_LS_001',   label: '████████ Long-Sleeve Tee',     cat: 'Apparel'    },
  { code: 'CREOVA_SHELL_001',    label: '████████ Shell Jacket',         cat: 'Apparel'    },
  { code: 'CREOVA_FLEECE_001',   label: '████████ Fit Hoodie',           cat: 'Apparel'    },
  { code: 'CREOVA_BTM_001',      label: '████████ Cargo / Utility Pant', cat: 'Apparel'    },
  { code: 'CREOVA_BTM_002',      label: '████████ Terry Jogger',         cat: 'Apparel'    },
  { code: 'CREOVA_HEAD_001',     label: '████████ Headwear Capsule',     cat: 'Accessories'},
  { code: 'CREOVA_ACC_001',      label: '████████ Canvas Tote',          cat: 'Accessories'},
  { code: 'CREOVA_ACC_002',      label: '████████ ████████',             cat: 'Accessories'},
];

const DROP_02 = [
  { code: 'CREOVA_TRACK_001',    label: '████████ Tracksuit Set',        cat: 'Apparel'    },
  { code: 'CREOVA_SHIRT_001',    label: '████████ Collar Overshirt',     cat: 'Apparel'    },
  { code: 'CREOVA_DENIM_001',    label: '████████ Trucker Jacket',       cat: 'Apparel'    },
  { code: 'CREOVA_KNIT_001',     label: '████████ Cable Crew',           cat: 'Apparel'    },
  { code: 'CREOVA_FOOT_001',     label: '████████ Court Sneaker',        cat: 'Footwear'   },
  { code: 'CREOVA_ACC_003',      label: '████████ ████████',             cat: 'Accessories'},
];

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="text-2xl sm:text-3xl font-light leading-none tabular-nums"
        style={{ color: '#F5F1EB', fontFamily: 'var(--font-display)' }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-[8px] tracking-[0.4em] uppercase mt-1" style={{ color: 'rgba(245,241,235,0.3)' }}>
        {label}
      </div>
    </div>
  );
}

function StyleRow({ code, label, cat, index }: { code: string; label: string; cat: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="flex items-center gap-3 py-2.5 border-b"
      style={{ borderColor: 'rgba(166,143,89,0.08)' }}
    >
      {/* Lock icon */}
      <Lock className="w-3 h-3 flex-shrink-0" style={{ color: 'rgba(166,143,89,0.4)' }} />

      {/* Style code — visible */}
      <span
        className="text-[10px] tracking-[0.25em] font-mono flex-shrink-0 w-44"
        style={{ color: 'rgba(166,143,89,0.7)' }}
      >
        {code}
      </span>

      {/* Redacted name */}
      <span
        className="text-[11px] flex-1 select-none"
        style={{ color: 'rgba(245,241,235,0.18)', fontFamily: 'var(--font-brand)', letterSpacing: '0.05em' }}
      >
        {label}
      </span>

      {/* Category pill */}
      <span
        className="text-[8px] tracking-[0.3em] uppercase px-2 py-0.5 rounded-sm flex-shrink-0 hidden sm:block"
        style={{ backgroundColor: 'rgba(166,143,89,0.08)', color: 'rgba(166,143,89,0.5)' }}
      >
        {cat}
      </span>
    </motion.div>
  );
}

export function FallDropTeaser() {
  const countdown = useCountdown(LAUNCH_DATE);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Enter a valid email address');
      return;
    }
    setSubmitting(true);
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-feacf0d8/subscribe-lead-magnet`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}` },
          body: JSON.stringify({
            email,
            name: '',
            leadMagnetId: 'fw2026_waitlist',
            leadMagnetTitle: 'CREOVA FW 2026 Early Access',
            subscribedAt: new Date().toISOString(),
          }),
        }
      );
      setSubmitted(true);
      setEmail('');
    } catch {
      toast.error('Something went wrong — try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#080808' }}>
      {/* Top gradient stripe */}
      <div className="absolute top-0 left-0 right-0" style={{ height: '2px', background: warmGradient }} />

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(166,143,89,0.06) 0%, transparent 70%)'
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div>
            {/* Classified badge */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm mb-5"
              style={{ backgroundColor: 'rgba(177,100,59,0.1)', border: '1px solid rgba(177,100,59,0.25)' }}
            >
              <Lock className="w-2.5 h-2.5" style={{ color: '#B1643B' }} />
              <span className="text-[9px] tracking-[0.4em] uppercase font-medium" style={{ color: '#B1643B' }}>
                Classified · Fall/Winter Capsule · Vol. 01
              </span>
            </motion.div>

            {/* Scale-contrast headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-light leading-none tracking-tighter"
              style={{ fontSize: 'clamp(48px, 8vw, 112px)', color: '#F5F1EB' }}
            >
              SEEN.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="italic leading-none"
              style={{
                fontSize: 'clamp(18px, 2.8vw, 36px)',
                backgroundImage: warmGradient,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              / Fall/Winter Capsule.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-sm font-light mt-5 max-w-xs"
              style={{ color: 'rgba(245,241,235,0.35)' }}
            >
              14 styles. 2 drops. Zero leaks — until the day it lands.
            </motion.p>
          </div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-5 p-6 rounded-2xl flex-shrink-0"
            style={{ backgroundColor: 'rgba(245,241,235,0.03)', border: '1px solid rgba(166,143,89,0.12)' }}
          >
            <CountUnit value={countdown.days}    label="Days"    />
            <div className="text-xl font-light" style={{ color: 'rgba(166,143,89,0.3)' }}>:</div>
            <CountUnit value={countdown.hours}   label="Hours"   />
            <div className="text-xl font-light" style={{ color: 'rgba(166,143,89,0.3)' }}>:</div>
            <CountUnit value={countdown.minutes} label="Minutes" />
            <div className="text-xl font-light" style={{ color: 'rgba(166,143,89,0.3)' }}>:</div>
            <CountUnit value={countdown.seconds} label="Seconds" />
          </motion.div>
        </div>

        {/* ── STYLE MANIFEST ── */}
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-0 mb-14">

          {/* DROP 01 */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-[9px] tracking-[0.45em] uppercase px-2 py-1"
                style={{ backgroundColor: 'rgba(166,143,89,0.1)', color: '#A68F59', border: '1px solid rgba(166,143,89,0.2)' }}
              >
                Drop 01
              </span>
              <div style={{ height: '1px', flex: 1, backgroundColor: 'rgba(166,143,89,0.12)' }} />
              <span className="text-[9px]" style={{ color: 'rgba(245,241,235,0.2)' }}>8 styles</span>
            </div>
            {DROP_01.map((s, i) => (
              <StyleRow key={s.code} {...s} index={i} />
            ))}
          </motion.div>

          {/* DROP 02 */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-[9px] tracking-[0.45em] uppercase px-2 py-1"
                style={{ backgroundColor: 'rgba(177,100,59,0.1)', color: '#B1643B', border: '1px solid rgba(177,100,59,0.2)' }}
              >
                Drop 02
              </span>
              <div style={{ height: '1px', flex: 1, backgroundColor: 'rgba(166,143,89,0.12)' }} />
              <span className="text-[9px]" style={{ color: 'rgba(245,241,235,0.2)' }}>6 styles</span>
            </div>
            {DROP_02.map((s, i) => (
              <StyleRow key={s.code} {...s} index={i} />
            ))}
          </motion.div>
        </div>

        {/* ── CATEGORIES STRIP ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-14"
        >
          {['Apparel', 'Footwear', 'Accessories', 'Headwear', '14 Styles Total', 'Inclusive Sizing'].map((tag) => (
            <span
              key={tag}
              className="text-[10px] tracking-[0.35em] uppercase px-3 py-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(245,241,235,0.04)', border: '1px solid rgba(166,143,89,0.12)', color: 'rgba(245,241,235,0.4)' }}
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* ── WAITLIST CAPTURE ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <p className="text-[10px] tracking-[0.4em] uppercase mb-1" style={{ color: 'rgba(166,143,89,0.6)' }}>
            Early Access · FW Capsule
          </p>
          <p className="text-xs mb-4 font-light" style={{ color: 'rgba(245,241,235,0.3)' }}>
            Be first in line when SEEN Fall/Winter 2026 drops.
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#A68F59' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: '#F5F1EB' }}>You're on the list.</p>
                  <p className="text-xs" style={{ color: 'rgba(245,241,235,0.4)' }}>
                    You'll be the first to know when the drop goes live.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'rgba(166,143,89,0.5)' }} />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 py-5 text-sm rounded-xl border"
                    style={{
                      backgroundColor: 'rgba(245,241,235,0.04)',
                      borderColor: 'rgba(166,143,89,0.2)',
                      color: '#F5F1EB',
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium tracking-wide flex-shrink-0 transition-all duration-300 hover:opacity-90 hover:-translate-y-px"
                  style={{ background: warmGradient, color: '#F5F1EB' }}
                >
                  {submitting ? 'Joining…' : 'Get Early Access'}
                  {!submitting && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-[10px] mt-3" style={{ color: 'rgba(245,241,235,0.2)' }}>
            No spam. Drop access only. Unsubscribe anytime.
          </p>
        </motion.div>

        {/* Bottom stamp */}
        <div className="mt-16 pt-8 border-t flex flex-wrap items-center justify-between gap-4" style={{ borderColor: 'rgba(166,143,89,0.1)' }}>
          <span className="text-[9px] tracking-[0.5em] uppercase" style={{ color: 'rgba(245,241,235,0.15)' }}>
            SEEN · Fall/Winter Capsule · Vol. 01 · Apparel · Footwear · Accessories
          </span>
          <span className="text-[9px] tracking-[0.5em] uppercase" style={{ color: 'rgba(245,241,235,0.15)' }}>
            Studio CREOVA · FW 2026 · Confidential
          </span>
        </div>
      </div>
    </section>
  );
}
