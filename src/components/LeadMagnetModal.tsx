import { useState } from 'react';
import { X, Download, Mail, CheckCircle2, Gift, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface LeadMagnet {
  id: string;
  title: string;
  description: string;
  fileType: string;
  value: string;
  downloadUrl?: string;
}

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadMagnet: LeadMagnet;
}

export function LeadMagnetModal({ isOpen, onClose, leadMagnet }: LeadMagnetModalProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !name) {
      toast.error(t('leadmagnet.error.fields'));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-feacf0d8/subscribe-lead-magnet`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email,
            name,
            leadMagnetId: leadMagnet.id,
            leadMagnetTitle: leadMagnet.title,
            subscribedAt: new Date().toISOString()
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        
        // Track conversion
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'generate_lead', {
            event_category: 'Lead Magnet',
            event_label: leadMagnet.title,
            value: 0
          });
        }

        toast.success(t('leadmagnet.success.title'), {
          description: t('leadmagnet.success.desc')
        });

        // Close modal after 3 seconds
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setEmail('');
          setName('');
        }, 3000);
      } else {
        throw new Error(data.error || t('leadmagnet.error.submit'));
      }
    } catch {
      toast.error(t('leadmagnet.error.wrong.title'), {
        description: t('leadmagnet.error.wrong.desc')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full transition-colors"
              style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
              aria-label="Close"
            >
              <X className="w-5 h-5" style={{ color: '#121212' }} />
            </button>

            {/* Success State */}
            {isSuccess ? (
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                  style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)' }}
                >
                  <CheckCircle2 className="w-10 h-10" style={{ color: '#A68F59' }} />
                </motion.div>

                <h3 className="text-2xl mb-3" style={{ color: '#121212' }}>
                  {t('leadmagnet.success.heading')}
                </h3>
                <p style={{ color: '#7A6F66' }}>
                  {t('leadmagnet.success.text1')}<strong>{email}</strong>
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-8 pb-6 text-center" style={{ backgroundColor: '#F5F1EB' }}>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'rgba(166, 143, 89, 0.2)' }}>
                    <Gift className="w-8 h-8" style={{ color: '#A68F59' }} />
                  </div>
                  
                  <h2 className="text-2xl mb-2" style={{ color: '#121212' }}>
                    {t('leadmagnet.get.free')}{leadMagnet.fileType}
                  </h2>
                  <p className="text-lg mb-3" style={{ color: '#121212' }}>
                    {leadMagnet.title}
                  </p>
                  <p className="text-sm" style={{ color: '#7A6F66' }}>
                    {leadMagnet.description}
                  </p>
                  
                  <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)', border: '1px solid #A68F59' }}>
                    <Star className="w-4 h-4" style={{ color: '#A68F59' }} />
                    <span className="text-sm" style={{ color: '#A68F59' }}>
                      {t('leadmagnet.value')}{leadMagnet.value}{t('leadmagnet.yours.free')}
                    </span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="mb-2 block" style={{ color: '#121212' }}>
                        {t('leadmagnet.label.name')}
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('leadmagnet.placeholder.name')}
                        required
                        className="h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="mb-2 block" style={{ color: '#121212' }}>
                        {t('leadmagnet.label.email')}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('leadmagnet.placeholder.email')}
                        required
                        className="h-12"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 text-base group"
                      style={{ backgroundColor: '#121212' }}
                    >
                      {isSubmitting ? (
                        <>
                          <Mail className="w-5 h-5 mr-2 animate-pulse" />
                          {t('leadmagnet.btn.sending')}
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                          {t('leadmagnet.btn.get')}{leadMagnet.fileType}
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center pt-2" style={{ color: '#7A6F66' }}>
                      {t('leadmagnet.fineprint')}
                    </p>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}