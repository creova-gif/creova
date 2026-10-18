import { useState } from 'react';
import { PageSEO } from '../components/PageSEO';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import { Captcha } from '../components/Captcha';
import { MapPin, Phone, Mail, Clock, Star } from 'lucide-react';
import { GOOGLE_REVIEW_URL } from '../config';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { publicAnonKey } from '../utils/supabase/info';
import { useLanguage } from '../context/LanguageContext';
import { logger } from '../utils/logger';
import { publicFormStatusMessage } from '../utils/publicFormStatus';
import { createRequestId, isIntakeReceipt, type IntakeReceipt } from '../contracts/intake';
import { publicApiUrl, usesDurableIntakeApi } from '../utils/api';

export function ContactPage() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    projectType: '',
    eventDate: '',
    dateNotSet: false,
    description: '',
    budget: '',
    context: '',
  });
  const [requestId, setRequestId] = useState(() => createRequestId());
  const [receipt, setReceipt] = useState<IntakeReceipt | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaReset, setCaptchaReset] = useState(0);

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
    if (window.location.hostname === 'creova.one') {
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
    if (!formData.dateNotSet && !formData.eventDate) {
      toast.error(language === 'fr' ? 'Choisissez une date ou indiquez qu’elle n’est pas déterminée.' : 'Choose a date or mark it as not set.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        publicApiUrl('/v1/intakes', '/submit-contact'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(usesDurableIntakeApi ? {} : { 'Authorization': `Bearer ${publicAnonKey}` }),
          },
          body: JSON.stringify({
            requestId,
            ...formData,
            eventDate: formData.dateNotSet ? null : formData.eventDate || null,
            captchaToken,
            // Compatibility fields for the current edge handler while the
            // durable Worker endpoint is rolled out.
            service: formData.projectType,
            message: formData.description,
            timeline: formData.dateNotSet ? 'Not set' : formData.eventDate,
          })
        }
      );

      if (response.ok) {
        const body: unknown = await response.json().catch(() => null);
        const parsedReceipt = isIntakeReceipt(body)
          ? body
          : body && typeof body === 'object' && 'contactId' in body && typeof body.contactId === 'string'
            ? {
                requestId: body.contactId,
                status: 'received' as const,
                receivedAt: new Date().toISOString(),
                responseDueAt: '',
              }
            : null;

        if (!parsedReceipt) {
          throw new Error('The server did not return a durable receipt');
        }

        setReceipt(parsedReceipt);

        toast.success(t('contact.form.success.title'), {
          description: parsedReceipt.responseDueAt
            ? `${t('contact.form.success.description')} ${new Intl.DateTimeFormat(language === 'fr' ? 'fr-CA' : 'en-CA', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Toronto' }).format(new Date(parsedReceipt.responseDueAt))}`
            : t('contact.form.success.description')
        });
        setFormData({
          name: '',
          email: '',
          organization: '',
          phone: '',
          projectType: '',
          eventDate: '',
          dateNotSet: false,
          description: '',
          budget: '',
          context: '',
        });
        setRequestId(createRequestId());
        setCaptchaToken(null);
        setCaptchaReset((n) => n + 1);
      } else {
        setCaptchaToken(null);
        setCaptchaReset((n) => n + 1);
        const statusMessage = publicFormStatusMessage(response.status, language === 'fr');
        if (statusMessage) {
          toast.error(statusMessage);
          return;
        }
        toast.error(t('contact.form.error.title'), {
          description: t('contact.form.error.description')
        });
        return;
      }
    } catch {
      setCaptchaToken(null);
      setCaptchaReset((n) => n + 1);
      toast.error(t('contact.form.error.title'), {
        description: t('contact.form.error.description')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#F8F9FA' }}>
      <PageSEO
        title="Start a Project"
        description="Tell CREOVA about your photography, videography, brand, digital, or event storytelling project. Submit an inquiry and receive a dated response receipt."
        path="/start-a-project"
      />
      {/* Hero — full-width dark with large email CTA treatment */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: '#121212', borderBottom: '1px solid rgba(212,168,67,0.15)' }}
      >
        {/* Top accent stripe */}
        <div style={{ height: '2px', background: 'linear-gradient(90deg, #D4A843, #B1643B, transparent)' }} />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            {/* Left: headline */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3 mb-8"
              >
                <div style={{ width: '32px', height: '1px', backgroundColor: '#D4A843' }} />
                <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: '#D4A843' }}>
                  {t('contact.badge.getintouch')}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="leading-none">
                {/* Massive "Let's" */}
                <motion.span
                  className="block font-light tracking-tighter cursor-default select-none"
                  style={{ fontSize: 'clamp(72px, 14vw, 190px)', color: '#F8F9FA' }}
                  whileHover={{ x: 6, color: 'rgba(248,249,250,0.7)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  Let's
                </motion.span>
                {/* Small italic "Connect." — the scale contrast */}
                <span className="flex items-end justify-between gap-4">
                  <motion.span
                    className="block italic leading-none tracking-tight cursor-default select-none"
                    style={{
                      fontSize: 'clamp(20px, 3.2vw, 42px)',
                      backgroundImage: 'linear-gradient(95deg, #B1643B 0%, #D4A843 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                    whileHover={{ x: 10 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  >
                    Connect.
                  </motion.span>
                  {/* Live response signal */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="hidden sm:flex items-center gap-2 pb-1 flex-shrink-0"
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#D4A843' }} />
                    <span className="text-[9px] tracking-[0.4em] uppercase" style={{ color: 'rgba(248,249,250,0.25)' }}>
                      {language === 'fr' ? 'Échéance confirmée après envoi' : 'Response due date confirmed on receipt'}
                    </span>
                  </motion.div>
                </span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-6 text-base leading-relaxed max-w-sm"
                style={{ color: 'rgba(248,249,250,0.42)' }}
              >
                {t('contact.hero.subtitle')}
              </motion.p>
            </div>

            {/* Right: contact info tiles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="grid grid-cols-2 gap-3 lg:w-72 flex-shrink-0"
            >
              {[
                { icon: Phone, label: 'Call Us', value: '+1 (437) 260-8925', href: 'tel:+14372608925' },
                { icon: Mail, label: 'Email', value: 'support@creova.one', href: 'mailto:support@creova.one' },
                { icon: MapPin, label: 'Location', value: 'Niagara, Ontario', href: null },
                { icon: Clock, label: 'Hours', value: 'Mon–Fri 9AM–6PM', href: null },
              ].map(({ icon: Icon, label, value, href }) => {
                const inner = (
                  <div className="flex flex-col gap-2 p-4 rounded-xl border transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(212,168,67,0.12)' }}>
                    <Icon className="w-4 h-4" style={{ color: '#D4A843' }} />
                    <div className="text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(248,249,250,0.3)' }}>{label}</div>
                    <div className="text-xs leading-tight" style={{ color: 'rgba(248,249,250,0.7)' }}>{value}</div>
                  </div>
                );
                return href ? (
                  <a key={label} href={href} className="block hover:opacity-80 transition-opacity">{inner}</a>
                ) : (
                  <div key={label}>{inner}</div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Intake promise — dark card */}
            <div className="rounded-2xl p-6 mb-8 overflow-hidden" style={{ backgroundColor: '#121212', border: '1px solid rgba(212,168,67,0.25)' }}>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-lg mb-1 tracking-tight" style={{ color: '#F8F9FA' }}>
                    {language === 'fr' ? 'Parlez-nous du projet.' : 'Tell us about the project.'}
                  </h2>
                  <p className="text-sm mb-4" style={{ color: '#777777' }}>
                    {language === 'fr'
                      ? 'Nous enregistrons d’abord votre demande, puis nous affichons son identifiant et l’échéance de réponse.'
                      : 'We persist your request first, then show its request ID and response due date.'}
                  </p>
                  <p className="text-xs tracking-wide" style={{ color: '#D4A843' }}>
                    {language === 'fr' ? 'Du lundi au vendredi · heure de Toronto' : 'Monday–Friday · Toronto time'}
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-8">
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(18,18,18,0.1)' }} />
              <p className="text-xs tracking-widest uppercase" style={{ color: '#777777' }}>{language === 'fr' ? 'Démarrer un projet' : 'Start a project'}</p>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(18,18,18,0.1)' }} />
            </div>

            <div className="rounded-2xl p-8 md:p-12" style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(18,18,18,0.1)' }}>
              <h2 className="text-2xl mb-6">{t('contact.form.title')}</h2>

              {receipt && (
                <div className="mb-8 rounded-xl p-5" role="status" style={{ backgroundColor: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)' }}>
                  <p className="font-medium mb-2">{language === 'fr' ? 'Demande enregistrée' : 'Request received'}</p>
                  <p className="text-sm break-all" style={{ color: '#555' }}>{language === 'fr' ? 'Identifiant' : 'Request ID'}: {receipt.requestId}</p>
                  {receipt.responseDueAt && (
                    <p className="text-sm mt-1" style={{ color: '#555' }}>
                      {language === 'fr' ? 'Réponse prévue avant le' : 'Response due by'}{' '}
                      {new Intl.DateTimeFormat(language === 'fr' ? 'fr-CA' : 'en-CA', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Toronto' }).format(new Date(receipt.responseDueAt))}
                    </p>
                  )}
                </div>
              )}
              
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
                  <Label htmlFor="organization">{language === 'fr' ? 'Organisation *' : 'Organization *'}</Label>
                  <Input
                    id="organization"
                    autoComplete="organization"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder={language === 'fr' ? 'Nom de votre organisation' : 'Your organization name'}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">
                    {t('contact.form.label.phone')}
                    <span className="text-xs ml-1" style={{ color: '#777777' }}>({t('form.optional')})</span>
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
                  <Label htmlFor="projectType">{language === 'fr' ? 'Type de projet *' : 'Project type *'}</Label>
                  <select
                    id="projectType"
                    required
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full border border-neutral-300 rounded-md px-3 py-2"
                  >
                    <option value="">{t('contact.form.select.service')}</option>
                    <option value="event-story">{language === 'fr' ? 'Récit et documentation d’événement' : 'Event story and documentation'}</option>
                    <option value="brand-system">{language === 'fr' ? 'Marque et système visuel' : 'Brand and visual system'}</option>
                    <option value="digital-experience">{language === 'fr' ? 'Expérience numérique ou technologie' : 'Digital experience or technology'}</option>
                    <option value="campaign">{language === 'fr' ? 'Campagne et contenu' : 'Campaign and content'}</option>
                    <option value="partnership">{language === 'fr' ? 'Partenariat ou collaboration' : 'Partnership or collaboration'}</option>
                    <option value="other">{t('contact.form.opt.other')}</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="eventDate">{language === 'fr' ? 'Date du projet' : 'Project or event date'}</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      disabled={formData.dateNotSet}
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    />
                    <label className="mt-2 flex items-center gap-2 text-sm" style={{ color: '#555' }}>
                      <input
                        type="checkbox"
                        checked={formData.dateNotSet}
                        onChange={(e) => setFormData({ ...formData, dateNotSet: e.target.checked, eventDate: e.target.checked ? '' : formData.eventDate })}
                      />
                      {language === 'fr' ? 'Date non déterminée' : 'Date not set'}
                    </label>
                  </div>
                  <div>
                    <Label htmlFor="budget">
                      {t('contact.form.label.budget')}
                      <span className="text-xs ml-1" style={{ color: '#777777' }}>({t('form.optional')})</span>
                    </Label>
                    <Input
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder={t('contact.form.placeholder.budget')}
                    />
                  </div>

                </div>

                <div>
                  <Label htmlFor="description">{language === 'fr' ? 'Description du projet *' : 'Project description *'}</Label>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={t('contact.form.placeholder.message')}
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="context">
                    {language === 'fr' ? 'Contexte ou liens utiles' : 'Helpful context or links'}
                    <span className="text-xs ml-1" style={{ color: '#777777' }}>({t('form.optional')})</span>
                  </Label>
                  <Textarea
                    id="context"
                    value={formData.context}
                    onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                    placeholder={language === 'fr' ? 'Objectifs, public, références ou liens…' : 'Goals, audience, references, or links…'}
                    rows={3}
                  />
                </div>

                {/* CAPTCHA Verification */}
                <div className="border-t pt-6" style={{ borderColor: '#E0E0E0' }}>
                  <h3 className="text-lg mb-2" style={{ color: '#121212' }}>{t('contact.form.security')}</h3>
                  <p className="text-xs mb-4" style={{ color: '#777777' }}>
                    {t('contact.captcha.security')}
                  </p>
                  <Captcha 
                    action="contact"
                    resetNonce={captchaReset}
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
        <div className="absolute top-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(212,168,67,0.3)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 60% at 50% 100%, rgba(212,168,67,0.06) 0%, transparent 65%)'
        }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center gap-5 mb-3">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(212,168,67,0.5)' }} />
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#D4A843' }}>{t('contact.faq.badge')}</p>
            </div>
            <h2 className="text-4xl font-light tracking-tight" style={{ color: '#F8F9FA' }}>{t('contact.faq.title')}</h2>
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
                style={{ border: '1px solid rgba(212,168,67,0.18)', backgroundColor: 'rgba(212,168,67,0.04)' }}
              >
                <AccordionTrigger className="hover:no-underline py-5">
                  <span className="text-base text-left" style={{ color: '#F8F9FA' }}>{item.q}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="leading-relaxed pb-4 text-sm" style={{ color: '#777777' }}>{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Leave-a-review CTA */}
      <section className="py-16" style={{ backgroundColor: '#121212' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl p-8" style={{ backgroundColor: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.18)' }}>
            <div className="flex items-center gap-4 text-center sm:text-left">
              <span className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(212,168,67,0.15)' }}>
                <Star className="w-6 h-6" style={{ color: '#D4A843' }} />
              </span>
              <div>
                <p className="text-base font-medium mb-1" style={{ color: '#F8F9FA' }}>{t('home.review.title')}</p>
                <p className="text-sm" style={{ color: '#8C7B75' }}>{t('home.review.sub')}</p>
              </div>
            </div>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 hover:-translate-y-px hover:shadow-lg"
              style={{ backgroundColor: '#B1643B', color: '#F8F9FA' }}
            >
              {t('home.review.cta')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
