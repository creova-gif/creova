import { useState, useEffect } from 'react';
import { X, Gift, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from '../context/LanguageContext';

export function ExitIntentModal() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Only show once per session
    if (hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from top of viewport (intent to close tab/window)
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    // Add delay before activating (user needs to be on site for at least 10 seconds)
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 10000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error(t('exit.toast.invalid'));
        setIsSubmitting(false);
        return;
      }

      // Store email in localStorage (in production, this would go to your backend)
      const existingEmails = JSON.parse(localStorage.getItem('exitIntentEmails') || '[]');
      existingEmails.push({
        email,
        timestamp: new Date().toISOString(),
        type: 'exit_intent_april_2026'
      });
      localStorage.setItem('exitIntentEmails', JSON.stringify(existingEmails));

      toast.success(t('exit.toast.success'));
      
      setIsVisible(false);
      setEmail('');
    } catch (error) {
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
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={() => setIsVisible(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[calc(100%-2rem)] max-w-lg"
          >
            <div className="rounded-3xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#F5F1EB' }}>
              {/* Close Button */}
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors z-10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" style={{ color: '#121212' }} />
              </button>

              {/* Header with Accent */}
              <div className="p-8 pb-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ 
                  backgroundImage: `radial-gradient(circle at 30% 50%, #A68F59 0%, transparent 70%)` 
                }}></div>
                
                <div className="relative">
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#A68F59' }}>
                    <Gift className="w-10 h-10" style={{ color: '#FFFFFF' }} />
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#121212' }}>
                    {t('exit.heading')}
                  </h2>
                  
                  <p className="text-lg mb-2" style={{ color: '#4A3E36' }}>
                    {t('exit.sub')} <strong>{t('exit.launch')}</strong>
                  </p>
                  
                  <p className="text-base" style={{ color: '#7A6F66' }}>
                    {t('exit.offer')} <strong className="text-[#B1643B]">{t('exit.offer.bold')}</strong> {t('exit.offer.rest')}
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#A68F59' }} />
                    <Input
                      type="email"
                      placeholder={t('exit.email.placeholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-12 py-6 text-base rounded-xl border-2"
                      style={{ 
                        borderColor: '#E3DCD3',
                        backgroundColor: '#FFFFFF',
                        color: '#121212'
                      }}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-6 text-base font-semibold rounded-xl tracking-wide hover:shadow-lg transition-all duration-300"
                    style={{
                      backgroundColor: '#121212',
                      color: '#F5F1EB'
                    }}
                  >
                    {isSubmitting ? t('exit.joining') : t('exit.cta')}
                  </Button>

                  <p className="text-xs text-center" style={{ color: '#7A6F66' }}>
                    {t('exit.disclaimer')}
                  </p>
                </form>

                {/* Trust Indicators */}
                <div className="mt-6 pt-6 border-t flex justify-center gap-8" style={{ borderColor: '#E3DCD3' }}>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: '#121212' }}>
                      {t('exit.trust1.value')}
                    </div>
                    <div className="text-xs" style={{ color: '#7A6F66' }}>
                      {t('exit.trust1.label')}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: '#121212' }}>
                      {t('exit.trust2.value')}
                    </div>
                    <div className="text-xs" style={{ color: '#7A6F66' }}>
                      {t('exit.trust2.label')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}