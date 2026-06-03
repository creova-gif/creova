import { useState } from 'react';
import { Link } from 'react-router';
import { PageSEO } from '../components/PageSEO';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import { Captcha } from '../components/Captcha';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useLanguage } from '../context/LanguageContext';
import { logger } from '../utils/logger';
import { SplitText } from '../components/SplitText';
import { Magnetic } from '../components/Magnetic';

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

  const inputStyle = {
    backgroundColor: '#121212',
    borderColor: 'rgba(166,143,89,0.2)',
    color: '#F5F1EB'
  };

  return (
    <div style={{ backgroundColor: '#0A0A0A' }} className="overflow-x-hidden">
      <PageSEO
        title="Contact Us"
        description="Get in touch with CREOVA. Book a consultation, ask about our creative services, or start your photography, videography, or brand design project today."
      />
      {/* Hero — X-Axis style */}
      <section
        className="relative overflow-hidden min-h-[70vh] flex flex-col justify-center"
        style={{ backgroundColor: '#0A0A0A' }}
      >
        <div className="crosshair-guides" />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 38%, rgba(166,143,89,0.12) 0%, transparent 70%)',
        }} />
        <div className="guide-ring hidden md:block" style={{ width: '48vw', height: '48vw', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        
        {/* Top accent stripe */}
        <div className="absolute top-0 left-0 right-0 z-20" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(166,143,89,0.5), transparent)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
            {/* Left: headline */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3 mb-8"
              >
                <div style={{ width: '32px', height: '1px', backgroundColor: '#A68F59' }} />
                <span className="mono-label">
                  {t('contact.badge.getintouch')}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <SplitText
                  text="LET'S"
                  tag="span"
                  className="display-hero block cursor-default select-none"
                  style={{ color: '#F5F1EB' }}
                  delay={0.3}
                  mode="chars"
                />
                
                <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10 -mt-2 sm:-mt-6">
                  <motion.span
                    className="block font-light italic leading-none tracking-tight cursor-default select-none display-grotesk lowercase"
                    style={{
                      fontSize: 'clamp(40px, 8vw, 90px)',
                      backgroundImage: 'linear-gradient(95deg, #B1643B 0%, #A68F59 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                    whileHover={{ x: 10 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  >
                    connect.
                  </motion.span>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="flex items-center gap-3 pb-2 sm:pb-4 flex-shrink-0"
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#A68F59' }} />
                    <span className="mono-label" style={{ color: 'rgba(245,241,235,0.5)' }}>
                      Replies within 24 hrs
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-10 text-base leading-relaxed max-w-md"
                style={{ color: '#C8C0B8' }}
              >
                {t('contact.hero.subtitle')}
              </motion.p>
            </div>

            {/* Right: contact info tiles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="grid grid-cols-2 gap-4 lg:w-80 flex-shrink-0"
            >
              {[
                { icon: Phone, label: 'Call Us', value: '+1 (437) 260-8925', href: 'tel:+14372608925' },
                { icon: Mail, label: 'Email', value: 'support@creova.ca', href: 'mailto:support@creova.ca' },
                { icon: MapPin, label: 'Location', value: 'Niagara, Ontario', href: null },
                { icon: Clock, label: 'Hours', value: 'Mon–Fri 9AM–6PM', href: null },
              ].map(({ icon: Icon, label, value, href }) => {
                const inner = (
                  <div className="flex flex-col gap-3 p-5 rounded-2xl transition-all duration-300 group hover:bg-white/5" style={{ backgroundColor: 'rgba(166,143,89,0.06)', border: '1px solid rgba(166,143,89,0.15)' }}>
                    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" style={{ color: '#A68F59' }} />
                    <div>
                      <div className="mono-label mb-1" style={{ color: 'rgba(245,241,235,0.4)', fontSize: '0.6rem' }}>{label}</div>
                      <div className="text-sm font-medium tracking-wide" style={{ color: '#E3DCD3' }}>{value}</div>
                    </div>
                  </div>
                );
                return href ? (
                  <a key={label} href={href} className="block">{inner}</a>
                ) : (
                  <div key={label}>{inner}</div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24 relative" style={{ backgroundColor: '#121212' }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.15)' }} />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Booking Callout */}
            <div className="rounded-3xl p-8 sm:p-10 mb-12 relative overflow-hidden" style={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(166,143,89,0.25)' }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, #A68F59, #B1643B, transparent)' }} />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex-1">
                  <h3 className="display-grotesk text-2xl sm:text-3xl mb-3 tracking-tight" style={{ color: '#F5F1EB', textTransform: 'none' }}>
                    {t('contact.book.title')}
                  </h3>
                  <p className="text-base" style={{ color: '#9A9088' }}>
                    {t('contact.book.desc')}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Magnetic strength={0.2}>
                    <Button
                      className="group px-8 py-6 rounded-full text-sm tracking-wide font-medium transition-all duration-300"
                      style={{ backgroundColor: '#F5F1EB', color: '#0A0A0A' }}
                      asChild
                    >
                      <Link to="/booking" className="flex items-center gap-2">
                        {t('contact.book.btn.now')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </Magnetic>
                  <Magnetic strength={0.2}>
                    <Button
                      className="px-8 py-6 rounded-full text-sm tracking-wide font-medium transition-all duration-300"
                      style={{ borderColor: 'rgba(166,143,89,0.4)', color: '#A68F59', backgroundColor: 'transparent', border: '1px solid' }}
                      onClick={() => window.dispatchEvent(new CustomEvent('sankofa:open'))}
                    >
                      {t('contact.book.btn.chat')}
                    </Button>
                  </Magnetic>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-6 mb-12">
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(166,143,89,0.15)' }} />
              <p className="mono-label">{t('contact.form.or')}</p>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(166,143,89,0.15)' }} />
            </div>

            {/* Form */}
            <div className="rounded-3xl p-8 sm:p-12" style={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(166,143,89,0.12)' }}>
              <div className="flex items-center gap-4 mb-10">
                <div style={{ width: '24px', height: '1px', backgroundColor: '#A68F59' }} />
                <h2 className="display-grotesk text-2xl sm:text-3xl" style={{ color: '#F5F1EB', textTransform: 'none' }}>
                  {t('contact.form.title')}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="name" style={{ color: '#C8C0B8', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('contact.form.label.name')}</Label>
                    <Input
                      id="name"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t('contact.form.placeholder.name')}
                      style={inputStyle}
                      className="h-12 px-4 focus-visible:ring-[#A68F59] focus-visible:ring-offset-0 focus-visible:border-[#A68F59]"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" style={{ color: '#C8C0B8', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('contact.form.label.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t('contact.form.placeholder.email')}
                      style={inputStyle}
                      className="h-12 px-4 focus-visible:ring-[#A68F59] focus-visible:ring-offset-0 focus-visible:border-[#A68F59]"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phone" style={{ color: '#C8C0B8', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {t('contact.form.label.phone')}
                    <span className="text-[10px] ml-2" style={{ color: '#9A9088' }}>({t('form.optional')})</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t('contact.form.placeholder.phone')}
                    style={inputStyle}
                    className="h-12 px-4 focus-visible:ring-[#A68F59] focus-visible:ring-offset-0 focus-visible:border-[#A68F59]"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="service" style={{ color: '#C8C0B8', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('contact.form.label.service')}</Label>
                  <select
                    id="service"
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full rounded-md px-4 h-12 outline-none focus-visible:ring-2 focus-visible:ring-[#A68F59] transition-all"
                    style={{ ...inputStyle, border: '1px solid rgba(166,143,89,0.2)' }}
                  >
                    <option value="" disabled style={{ color: '#9A9088' }}>{t('contact.form.select.service')}</option>
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

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="budget" style={{ color: '#C8C0B8', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {t('contact.form.label.budget')}
                      <span className="text-[10px] ml-2" style={{ color: '#9A9088' }}>({t('form.optional')})</span>
                    </Label>
                    <Input
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder={t('contact.form.placeholder.budget')}
                      style={inputStyle}
                      className="h-12 px-4 focus-visible:ring-[#A68F59] focus-visible:ring-offset-0 focus-visible:border-[#A68F59]"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="timeline" style={{ color: '#C8C0B8', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {t('contact.form.label.timeline')}
                      <span className="text-[10px] ml-2" style={{ color: '#9A9088' }}>({t('form.optional')})</span>
                    </Label>
                    <Input
                      id="timeline"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      placeholder={t('contact.form.placeholder.timeline')}
                      style={inputStyle}
                      className="h-12 px-4 focus-visible:ring-[#A68F59] focus-visible:ring-offset-0 focus-visible:border-[#A68F59]"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="message" style={{ color: '#C8C0B8', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t('contact.form.label.message')}</Label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t('contact.form.placeholder.message')}
                    rows={6}
                    style={inputStyle}
                    className="p-4 focus-visible:ring-[#A68F59] focus-visible:ring-offset-0 focus-visible:border-[#A68F59] resize-none"
                  />
                </div>

                {/* CAPTCHA Verification */}
                <div className="border-t pt-8" style={{ borderColor: 'rgba(166,143,89,0.15)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#A68F59' }} />
                    <h3 className="mono-label" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>{t('contact.form.security')}</h3>
                  </div>
                  <p className="text-sm mb-6" style={{ color: '#9A9088' }}>
                    {t('contact.captcha.security')}
                  </p>
                  <Captcha 
                    onVerify={handleCaptchaVerify} 
                    onExpire={handleCaptchaExpire} 
                    onError={handleCaptchaError} 
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 rounded-full text-sm tracking-wide font-medium group" 
                  disabled={isSubmitting}
                  style={{ backgroundColor: '#F5F1EB', color: '#0A0A0A' }}
                >
                  <span className="flex items-center gap-2">
                    {isSubmitting ? t('contact.form.btn.sending') : t('contact.form.btn.send')}
                    {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </span>
                </Button>

                <p className="text-xs text-center tracking-wide" style={{ color: '#7A6F66' }}>
                  {t('contact.form.disclaimer')}
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.15)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 100%, rgba(166,143,89,0.06) 0%, transparent 65%)'
        }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="mono-label">{t('contact.faq.badge')}</p>
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
            </div>
            <h2 className="display-grotesk text-3xl sm:text-5xl" style={{ color: '#F5F1EB', textTransform: 'none' }}>
              {t('contact.faq.title')}
            </h2>
          </motion.div>
          
          <Accordion 
            type="single" 
            collapsible 
            className="space-y-4"
            onValueChange={(value) => {
              if (value) {
                setTimeout(() => {
                  const faqSection = document.getElementById('faq-section');
                  if (faqSection) {
                    const offset = 100;
                    const elementPosition = faqSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }, 100);
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
                className="px-6 sm:px-8 rounded-2xl overflow-hidden transition-colors"
                style={{ border: '1px solid rgba(166,143,89,0.12)', backgroundColor: 'rgba(166,143,89,0.03)' }}
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  <span className="text-base sm:text-lg text-left font-medium tracking-wide" style={{ color: '#F5F1EB' }}>
                    {item.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="leading-relaxed pb-6 text-base" style={{ color: '#9A9088' }}>
                    {item.a}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
