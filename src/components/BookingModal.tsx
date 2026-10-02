import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';
import { logger } from '../utils/logger';
import { motion } from 'motion/react';
import { useNavigate } from '../i18n/LocaleLink';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Captcha } from './Captcha';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: string;
  package?: string;
  price?: number;
}

export function BookingModal({ isOpen, onClose, service, package: packageName, price }: BookingModalProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: service || '',
    package: packageName || '',
    message: ''
  });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.date) {
      toast.error(t('booking.error.fields'));
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error(t('booking.error.email'));
      return;
    }

    if (!captchaToken) {
      toast.error(t('contact.toast.captcha.missing'));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-feacf0d8/submit-booking`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            service: formData.service,
            package: formData.package,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            preferredDate: formData.date,
            preferredTime: formData.time,
            specialRequests: formData.message,
            captchaToken
          })
        }
      );

      if (!response.ok) {
        toast.error(t('booking.error.fields'));
        return;
      }

      toast.success(t('booking.success.received'));
      logger.log('Booking request stored');
      onClose();
      navigate('/checkout', {
        state: {
          bookingDetails: formData,
          type: 'service'
        }
      });
    } catch {
      toast.error(t('booking.error.fields'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    t('booking.service.family'),
    t('booking.service.brand'),
    t('booking.service.product'),
    t('booking.service.drone'),
    t('booking.service.event'),
    t('booking.service.graphic'),
    t('booking.service.social'),
    t('booking.service.video'),
    t('booking.service.rental')
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl flex items-center gap-2" style={{ color: '#121212' }}>
            <Calendar className="w-7 h-7" style={{ color: '#D4A843' }} />
            {t('booking.title')}
          </DialogTitle>
          <DialogDescription style={{ color: '#777777' }}>
            {t('booking.desc')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2" style={{ color: '#121212' }}>
              <User className="w-5 h-5" style={{ color: '#D4A843' }} />
              {t('booking.info.personal')}
            </h3>
            
            <div>
              <Label htmlFor="name">{t('booking.label.name')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder={t('booking.placeholder.name')}
                required
                className="mt-2"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">{t('booking.label.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="email@example.com"
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="phone">{t('booking.label.phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  required
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2" style={{ color: '#121212' }}>
              <Calendar className="w-5 h-5" style={{ color: '#D4A843' }} />
              {t('booking.info.service')}
            </h3>

            <div>
              <Label htmlFor="service">{t('booking.label.service')}</Label>
              <Select value={formData.service} onValueChange={(value) => handleChange('service', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={t('booking.placeholder.service')} />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.package && (
              <div>
                <Label>{t('booking.label.package')}</Label>
                <div className="mt-2 p-3 rounded-lg border-2" style={{ borderColor: '#D4A843', backgroundColor: '#F8F9FA' }}>
                  <p style={{ color: '#121212' }}>{formData.package}</p>
                  {price && (
                    <p className="text-sm mt-1" style={{ color: '#777777' }}>
                      {price.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">{t('booking.label.date')}</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="time">{t('booking.label.time')}</Label>
                <Select value={formData.time} onValueChange={(value) => handleChange('time', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder={t('booking.placeholder.time')} />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <Label htmlFor="message">{t('booking.label.message')}</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder={t('booking.placeholder.message')}
              rows={4}
              className="mt-2"
            />
          </div>

          {/* Deposit Information */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-lg border-2"
            style={{ backgroundColor: '#F8F9FA', borderColor: '#D4A843' }}
          >
            <p className="text-sm mb-2" style={{ color: '#121212' }}>
              <strong>{t('booking.deposit.title')}</strong>
            </p>
            <p className="text-sm" style={{ color: '#777777' }}>
              {t('booking.deposit.desc')}
            </p>
            {price && (
              <p className="text-lg mt-2" style={{ color: '#B1643B' }}>
                <strong>
                  {t('booking.deposit.label')}
                  {(price * 0.5).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}
                </strong>
              </p>
            )}
          </motion.div>

          <Captcha
            onVerify={(token) => setCaptchaToken(token)}
            onExpire={() => setCaptchaToken(null)}
            onError={() => setCaptchaToken(null)}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl py-6"
            >
              {t('booking.btn.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl py-6 group"
              style={{ backgroundColor: '#121212', color: '#F8F9FA' }}
            >
              {t('booking.btn.continue')}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}