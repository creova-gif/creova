import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import { Captcha } from '../components/Captcha';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Calendar, Star, Award, Globe, Linkedin } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useLanguage } from '../context/LanguageContext';
import { logger } from '../utils/logger';

export function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    budget: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    logger.log('CAPTCHA verified successfully');
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
    logger.log('CAPTCHA expired, please verify again');
    toast.error(t('contact.toast.captcha.expired'));
  };

  const handleCaptchaError = (error: string) => {
    setCaptchaToken(null);
    if (window.location.hostname === 'creova.ca') {
      toast.error(t('contact.toast.captcha.issue'), {
        description: error || t('contact.toast.captcha.desc')
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // CAPTCHA validation
    if (!captchaToken) {
      toast.error(t('contact.toast.captcha.missing'));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-feacf0d8/submit-contact`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ ...formData, captchaToken })
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Send admin notification email
        try {
          await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-feacf0d8/send-contact-notification`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`
              },
              body: JSON.stringify(formData)
            }
          );
        } catch {
          // Don't block success message if email notification fails
        }

        toast.success(t('contact.form.success.title'), {
          description: t('contact.form.success.description')
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: '',
          budget: '',
          timeline: ''
        });
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      toast.error(t('contact.form.error.title'), {
        description: t('contact.form.error.description')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#F5F1EB' }}>
      {/* Hero Section — Editorial */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 55% 80% at 20% 50%, rgba(166,143,89,0.09) 0%, transparent 60%),
                       radial-gradient(ellipse 40% 60% at 80% 60%, rgba(177,100,59,0.07) 0%, transparent 55%)`
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(166,143,89,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-center gap-5 mb-10">
              <div style={{ height: '1px', width: '50px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="text-xs tracking-[0.55em] uppercase" style={{ color: '#A68F59' }}>{t('contact.badge.getintouch')}</p>
              <div style={{ height: '1px', width: '50px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
            </div>
            <h1
              className="font-light tracking-tight mb-8"
              style={{ fontSize: 'clamp(36px, 6vw, 72px)', color: '#F5F1EB', lineHeight: 1.1 }}
            >
              {t('contact.hero.title')}
            </h1>
            <p className="text-lg mb-10 leading-relaxed" style={{ color: '#7A6F66', maxWidth: '500px', margin: '0 auto 40px' }}>
              {t('contact.hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-6 justify-center items-center">
              {[t('contact.tag.book'), t('contact.tag.collaborate'), t('contact.tag.inquiries')].map((tag, i) => (
                <span key={i} className="flex items-center gap-3">
                  <span className="text-sm tracking-wider" style={{ color: '#A68F59' }}>{tag}</span>
                  {i < 2 && <span style={{ width: '1px', height: '14px', backgroundColor: 'rgba(166,143,89,0.3)', display: 'inline-block' }} />}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16" style={{ backgroundColor: '#F5F1EB' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Booking Callout — dark card */}
            <div className="rounded-2xl p-6 mb-8 overflow-hidden" style={{ backgroundColor: '#121212', border: '1px solid rgba(166,143,89,0.25)' }}>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-lg mb-1 tracking-tight" style={{ color: '#F5F1EB' }}>
                    {t('contact.book.title')}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: '#7A6F66' }}>
                    {t('contact.book.desc')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      style={{ backgroundColor: '#A68F59', color: '#121212' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F1EB'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#A68F59'; }}
                      asChild
                    >
                      <Link to="/booking">{t('contact.book.btn.now')}</Link>
                    </Button>
                    <Button
                      variant="outline"
                      style={{ borderColor: 'rgba(166,143,89,0.4)', color: '#A68F59', backgroundColor: 'transparent' }}
                      onClick={() => {
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                      }}
                    >
                      {t('contact.book.btn.chat')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-8">
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(18,18,18,0.1)' }} />
              <p className="text-xs tracking-widest uppercase" style={{ color: '#7A6F66' }}>{t('contact.form.or')}</p>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(18,18,18,0.1)' }} />
            </div>

            <div className="rounded-2xl p-8 md:p-12" style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(18,18,18,0.1)' }}>
              <h2 className="text-2xl mb-6">{t('contact.form.title')}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">{t('contact.form.label.name')}</Label>
                    <Input
                      id="name"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t('contact.form.placeholder.name')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">{t('contact.form.label.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t('contact.form.placeholder.email')}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">
                    {t('contact.form.label.phone')}
                    <span className="text-xs ml-1" style={{ color: '#7A6F66' }}>({t('form.optional')})</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t('contact.form.placeholder.phone')}
                  />
                </div>

                <div>
                  <Label htmlFor="service">{t('contact.form.label.service')}</Label>
                  <select
                    id="service"
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full border border-neutral-300 rounded-md px-3 py-2"
                  >
                    <option value="">{t('contact.form.select.service')}</option>
                    <option value="family-photography">{t('contact.form.opt.family')}</option>
                    <option value="brand-photography">{t('contact.form.opt.brand')}</option>
                    <option value="product-photography">{t('contact.form.opt.product')}</option>
                    <option value="event-coverage">{t('contact.form.opt.event')}</option>
                    <option value="drone-aerial">{t('contact.form.opt.drone')}</option>
                    <option value="social-media">{t('contact.form.opt.social')}</option>
                    <option value="brand-management">{t('contact.form.opt.brandmgt')}</option>
                    <option value="collaboration">{t('contact.form.opt.collab')}</option>
                    <option value="other">{t('contact.form.opt.other')}</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="budget">
                      {t('contact.form.label.budget')}
                      <span className="text-xs ml-1" style={{ color: '#7A6F66' }}>({t('form.optional')})</span>
                    </Label>
                    <Input
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder={t('contact.form.placeholder.budget')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="timeline">
                      {t('contact.form.label.timeline')}
                      <span className="text-xs ml-1" style={{ color: '#7A6F66' }}>({t('form.optional')})</span>
                    </Label>
                    <Input
                      id="timeline"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      placeholder={t('contact.form.placeholder.timeline')}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">{t('contact.form.label.message')}</Label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t('contact.form.placeholder.message')}
                    rows={6}
                  />
                </div>

                {/* CAPTCHA Verification */}
                <div className="border-t pt-6" style={{ borderColor: '#E3DCD3' }}>
                  <h3 className="text-lg mb-2" style={{ color: '#121212' }}>{t('contact.form.security')}</h3>
                  <p className="text-xs mb-4" style={{ color: '#7A6F66' }}>
                    {t('contact.captcha.security')}
                  </p>
                  <Captcha 
                    onVerify={handleCaptchaVerify} 
                    onExpire={handleCaptchaExpire} 
                    onError={handleCaptchaError} 
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t('contact.form.btn.sending') : t('contact.form.btn.send')}
                </Button>

                <p className="text-sm text-neutral-500 text-center">
                  {t('contact.form.disclaimer')}
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="py-20 relative overflow-hidden" style={{ backgroundColor: '#121212' }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 60% at 50% 100%, rgba(166,143,89,0.06) 0%, transparent 65%)'
        }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center gap-5 mb-3">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>{t('contact.faq.badge')}</p>
            </div>
            <h2 className="text-4xl font-light tracking-tight" style={{ color: '#F5F1EB' }}>{t('contact.faq.title')}</h2>
          </div>
          
          <Accordion 
            type="single" 
            collapsible 
            className="space-y-3"
            onValueChange={(value) => {
              if (value) {
                const faqSection = document.getElementById('faq-section');
                if (faqSection) {
                  const offset = 100;
                  const elementPosition = faqSection.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - offset;
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
              }
            }}
          >
            {[
              { q: t('contact.faq.q1'), a: t('contact.faq.a1') },
              { q: t('contact.faq.q2'), a: t('contact.faq.a2') },
              { q: t('contact.faq.q3'), a: t('contact.faq.a3') },
              { q: t('contact.faq.q4'), a: t('contact.faq.a4') },
              { q: t('contact.faq.q5'), a: t('contact.faq.a5') },
              { q: t('contact.faq.q6'), a: t('contact.faq.a6') }
            ].map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i + 1}`}
                className="px-6 rounded-xl"
                style={{ border: '1px solid rgba(166,143,89,0.18)', backgroundColor: 'rgba(166,143,89,0.04)' }}
              >
                <AccordionTrigger className="hover:no-underline py-5">
                  <span className="text-base text-left" style={{ color: '#F5F1EB' }}>{item.q}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="leading-relaxed pb-4 text-sm" style={{ color: '#7A6F66' }}>{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}