import { useState, useEffect, useRef } from 'react';
import { X, Mail, Camera, Video, Palette, Calendar, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from '../context/LanguageContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const SERVICES = [
  { icon: Camera, label: 'Photography', price: 'from $450' },
  { icon: Video, label: 'Videography', price: 'from $500' },
  { icon: Palette, label: 'Brand Design', price: 'from $750' },
  { icon: Calendar, label: 'Events', price: 'from $750' },
];

export function ExitIntentModal() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const hasShownRef = useRef(false);

  const triggerModal = () => {
    if (hasShownRef.current) return;
    hasShownRef.current = true;
    setHasShown(true);
    setIsVisible(true);
  };

  useEffect(() => {
    if (hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) triggerModal();
    };
    const mobileTimer = setTimeout(triggerModal, 60000);
    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (scrolled / total >= 0.8) triggerModal();
    };
    const activationTimer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, 10000);

    return () => {
      clearTimeout(activationTimer);
      clearTimeout(mobileTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error(t('exit.toast.invalid'));
        setIsSubmitting(false);
        return;
      }

      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-feacf0d8/subscribe-lead-magnet`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email,
            name: '',
            leadMagnetId: 'exit_intent',
            leadMagnetTitle: 'Exit Intent Offer',
            subscribedAt: new Date().toISOString(),
          }),
        }
      );

      try {
        const existing = JSON.parse(localStorage.getItem('exitIntentEmails') || '[]');
        existing.push({ email, timestamp: new Date().toISOString() });
        localStorage.setItem('exitIntentEmails', JSON.stringify(existing));
      } catch {}

      setSubmitted(true);
      setEmail('');
    } catch {
      toast.error(t('exit.toast.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm"
            onClick={() => setIsVisible(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[calc(100%-2rem)] max-w-2xl"
          >
            <div
              className="relative rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
              style={{ backgroundColor: '#0D0D0D', border: '1px solid rgba(166,143,89,0.18)' }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-px" style={{
                background: 'linear-gradient(90deg, transparent, #A68F59, #B1643B, transparent)',
              }} />

              {/* Close */}
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-20"
                style={{ backgroundColor: 'rgba(245,241,235,0.07)', color: '#F5F1EB' }}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid md:grid-cols-[1fr_1.1fr]">
                {/* ── LEFT: Editorial ── */}
                <div className="relative p-8 flex flex-col justify-between overflow-hidden"
                  style={{ borderRight: '1px solid rgba(166,143,89,0.1)' }}>
                  {/* BG texture */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
                    backgroundImage: 'radial-gradient(circle, #A68F59 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }} />
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'radial-gradient(ellipse 80% 60% at 20% 60%, rgba(166,143,89,0.08) 0%, transparent 70%)',
                  }} />

                  <div className="relative">
                    {/* Badge */}
                    <motion.div
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                      style={{ backgroundColor: 'rgba(177,100,59,0.12)', border: '1px solid rgba(177,100,59,0.3)' }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#B1643B' }} />
                      <span className="text-xs tracking-[0.25em] uppercase font-medium" style={{ color: '#B1643B' }}>
                        Limited offer
                      </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h2 className="font-light leading-none tracking-tight mb-2" style={{
                        fontSize: 'clamp(2.4rem, 5vw, 3.2rem)',
                        color: '#F5F1EB',
                      }}>
                        Wait —
                      </h2>
                      <h2 className="italic leading-none tracking-tight mb-6" style={{
                        fontSize: 'clamp(2.4rem, 5vw, 3.2rem)',
                        backgroundImage: 'linear-gradient(95deg, #A68F59 0%, #E3DCD3 70%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                      }}>
                        15% off yours.
                      </h2>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(245,241,235,0.5)' }}>
                        Subscribe and unlock 15% off your first booking — photography, video, brand, or events.
                      </p>
                    </motion.div>

                    {/* Service price pills */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 }}
                      className="mt-6 grid grid-cols-2 gap-2"
                    >
                      {SERVICES.map((s, i) => (
                        <motion.div
                          key={s.label}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.38 + i * 0.06 }}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl"
                          style={{ backgroundColor: 'rgba(245,241,235,0.04)', border: '1px solid rgba(166,143,89,0.1)' }}
                        >
                          <s.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#A68F59' }} />
                          <div>
                            <div className="text-[10px] font-medium leading-tight" style={{ color: 'rgba(245,241,235,0.7)' }}>{s.label}</div>
                            <div className="text-[10px]" style={{ color: '#A68F59' }}>{s.price}</div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="relative mt-8 flex gap-6"
                  >
                    <div>
                      <div className="text-xl font-semibold" style={{ color: '#A68F59' }}>100+</div>
                      <div className="text-[10px] tracking-wide uppercase" style={{ color: 'rgba(245,241,235,0.35)' }}>Projects</div>
                    </div>
                    <div className="w-px self-stretch" style={{ backgroundColor: 'rgba(166,143,89,0.15)' }} />
                    <div>
                      <div className="text-xl font-semibold" style={{ color: '#A68F59' }}>5.0★</div>
                      <div className="text-[10px] tracking-wide uppercase" style={{ color: 'rgba(245,241,235,0.35)' }}>Google Rating</div>
                    </div>
                    <div className="w-px self-stretch" style={{ backgroundColor: 'rgba(166,143,89,0.15)' }} />
                    <div>
                      <div className="text-xl font-semibold" style={{ color: '#A68F59' }}>ON</div>
                      <div className="text-[10px] tracking-wide uppercase" style={{ color: 'rgba(245,241,235,0.35)' }}>Canada</div>
                    </div>
                  </motion.div>
                </div>

                {/* ── RIGHT: Form ── */}
                <div className="p-8 flex flex-col justify-center" style={{ backgroundColor: '#111111' }}>
                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-6"
                      >
                        <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl"
                          style={{ backgroundColor: 'rgba(166,143,89,0.12)', border: '1px solid rgba(166,143,89,0.3)' }}>
                          🎉
                        </div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: '#F5F1EB' }}>You're in!</h3>
                        <p className="text-sm mb-6" style={{ color: 'rgba(245,241,235,0.5)' }}>
                          Check your inbox — your 15% discount code is on its way.
                        </p>
                        <button
                          onClick={() => setIsVisible(false)}
                          className="inline-flex items-center gap-2 text-sm"
                          style={{ color: '#A68F59' }}
                        >
                          Continue browsing <ArrowRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-1" style={{ color: '#F5F1EB' }}>
                            Unlock your discount
                          </h3>
                          <p className="text-sm" style={{ color: 'rgba(245,241,235,0.45)' }}>
                            Drop your email and we'll send your code instantly.
                          </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A68F59' }} />
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className="pl-10 py-5 text-sm rounded-xl border"
                              style={{
                                backgroundColor: 'rgba(245,241,235,0.05)',
                                borderColor: 'rgba(166,143,89,0.2)',
                                color: '#F5F1EB',
                              }}
                            />
                          </div>

                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-5 text-sm font-semibold rounded-xl tracking-wide transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:-translate-y-px"
                            style={{ backgroundColor: '#B1643B', color: '#F5F1EB', border: 'none' }}
                          >
                            {isSubmitting ? 'Sending…' : 'Claim 15% Off →'}
                          </Button>
                        </form>

                        {/* What you get */}
                        <div className="mt-5 space-y-2">
                          {[
                            '15% off any first booking',
                            'Priority booking access',
                            'Behind-the-scenes content',
                          ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2.5">
                              <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: '#A68F59' }} />
                              <span className="text-xs" style={{ color: 'rgba(245,241,235,0.45)' }}>{item}</span>
                            </div>
                          ))}
                        </div>

                        <p className="text-[10px] mt-5 leading-relaxed" style={{ color: 'rgba(245,241,235,0.25)' }}>
                          No spam. Unsubscribe anytime. By subscribing you agree to our privacy policy.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
