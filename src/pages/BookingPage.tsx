import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useNavigate } from '../i18n/LocaleLink';
import { PageSEO } from '../components/PageSEO';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Captcha } from '../components/Captcha';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { motion } from 'motion/react';
import { Camera, Video, Users, Package, PartyPopper, Wind, Palette, TrendingUp, Calendar as CalendarIcon, Clock, CheckCircle2, ArrowLeft, Star, Award } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { format } from 'date-fns';
import { logger } from '../utils/logger';
import { useLanguage } from '../context/LanguageContext';

export function BookingPage() {
  const navigate = useNavigate();
  // Commercial page → vous register.
  const fr = useLanguage().language === 'fr';
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || '';
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    service: initialService,
    package: '',
    name: '',
    email: '',
    phone: '',
    preferredTime: '',
    location: '',
    numberOfPeople: '',
    specialRequests: '',
    budget: '',
    hearAboutUs: ''
  });

  const M = fr ? '/mois' : '/mo';
  const FROM = fr ? 'À partir de ' : 'From ';
  const services = [
    {
      id: 'family-portraits',
      name: fr ? 'Photographie de portraits de famille' : 'Family Portrait Photography',
      icon: Users,
      packages: [
        { id: 'mini-memories', name: `${fr ? 'Petits souvenirs' : 'Mini Memories'} - $450`, price: 450 },
        { id: 'timeless-bonds', name: `${fr ? 'Liens intemporels' : 'Timeless Bonds'} - $650`, price: 650 },
        { id: 'legacy-heirloom', name: `${fr ? 'Héritage vivant' : 'Legacy Heirloom'} - $950`, price: 950 }
      ]
    },
    {
      id: 'brand-photography',
      name: fr ? 'Photographie de marque et portraits corporatifs' : 'Brand Photography & Headshots',
      icon: Camera,
      packages: [
        { id: 'profile-pro', name: `${fr ? 'Profil Pro' : 'Profile Pro'} - $750`, price: 750 },
        { id: 'workspace-stories', name: `${fr ? "Histoires d'équipe" : 'Workspace Stories'} - $1,100`, price: 1100 },
        { id: 'brand-vision', name: `${fr ? 'Suite Vision de marque' : 'Brand Vision Suite'} - $1,600`, price: 1600 }
      ]
    },
    {
      id: 'product-photography',
      name: fr ? 'Photographie de produits' : 'Product Photography',
      icon: Package,
      packages: [
        { id: 'product-essentials', name: `${fr ? 'Essentiels e-commerce' : 'E-commerce Essentials'} - $600`, price: 600 },
        { id: 'product-pro', name: `${fr ? 'Trousse Produit Pro' : 'Product Pro Kit'} - $950`, price: 950 },
        { id: 'product-lifestyle', name: `${fr ? 'Collection Lifestyle' : 'Lifestyle Collection'} - $1,400`, price: 1400 }
      ]
    },
    {
      id: 'videography',
      name: fr ? 'Vidéographie et création de contenu' : 'Videography & Content Creation',
      icon: Video,
      packages: [
        { id: 'starter', name: `${fr ? 'Départ' : 'Starter'} - $500`, price: 500 },
        { id: 'creator', name: `${fr ? 'Créateur' : 'Creator'} - $850`, price: 850 },
        { id: 'pro', name: `Pro - ${FROM}$1,500`, price: 1500 },
        { id: 'campaign', name: `${fr ? 'Campagne' : 'Campaign'} - ${FROM}$3,000`, price: 3000 }
      ]
    },
    {
      id: 'aerial-drone',
      name: fr ? 'Photographie aérienne et par drone' : 'Aerial & Drone Photography',
      icon: Wind,
      packages: [
        { id: 'aerial-vision', name: `${fr ? 'Séance Vision aérienne' : 'Aerial Vision Session'} - ${FROM}$500`, price: 500 }
      ]
    },
    {
      id: 'event-coverage',
      name: fr ? "Couverture d'événements" : 'Event Coverage',
      icon: PartyPopper,
      packages: [
        { id: 'essence-package', name: `${fr ? 'Forfait Essence' : 'Essence Package'} - $750`, price: 750 },
        { id: 'signature-story', name: `${fr ? 'Récit Signature' : 'Signature Story'} - $1,350`, price: 1350 },
        { id: 'heritage-experience', name: `${fr ? 'Expérience Héritage' : 'Heritage Experience'} - $2,550`, price: 2550 }
      ]
    },
    {
      id: 'social-media',
      name: fr ? 'Gestion des médias sociaux' : 'Social Media Management',
      icon: TrendingUp,
      packages: [
        { id: 'starter-plan', name: `${fr ? 'Forfait Départ' : 'Starter Plan'} - $950${M}`, price: 950 },
        { id: 'growth-plan', name: `${fr ? 'Forfait Croissance' : 'Growth Plan'} - $1,500${M}`, price: 1500 },
        { id: 'creator-plus', name: `${fr ? 'Forfait Créateur+' : 'Creator+ Plan'} - ${FROM}$2,500${M}`, price: 2500 }
      ]
    },
    {
      id: 'brand-design',
      name: fr ? 'Image de marque et identité' : 'Brand Design & Identity',
      icon: Palette,
      packages: [
        { id: 'brand-essentials', name: `${fr ? 'Trousse Essentiels de marque' : 'Brand Essentials Kit'} - $600`, price: 600 },
        { id: 'visual-starter', name: `${fr ? 'Identité visuelle de départ' : 'Visual Starter Identity'} - $1,200`, price: 1200 },
        { id: 'signature-identity', name: `${fr ? 'Suite Identité Signature' : 'Signature Identity Suite'} - ${FROM}$3,000`, price: 3000 }
      ]
    },
    {
      id: 'event-conference-design',
      name: fr ? "Conception d'événements et de conférences" : 'Event & Conference Design',
      icon: CalendarIcon,
      packages: [
        { id: 'event-essentials', name: `${fr ? "Forfait Essentiels d'événement" : 'Event Essentials Package'} - $600`, price: 600 },
        { id: 'standard-event', name: `${fr ? "Image de marque d'événement standard" : 'Standard Event Branding'} - $1,200`, price: 1200 },
        { id: 'full-event-identity', name: `${fr ? "Suite Identité d'événement complète" : 'Full Event Identity Suite'} - $2,500`, price: 2500 }
      ]
    },
    {
      id: 'event-design-retainer',
      name: fr ? "Forfait mensuel de conception d'événements" : 'Event Design Retainer (Monthly)',
      icon: CalendarIcon,
      packages: [
        { id: 'retainer-starter', name: `${fr ? 'Départ' : 'Starter'} - $450${M}`, price: 450 },
        { id: 'retainer-growth', name: `${fr ? 'Croissance' : 'Growth'} - $850${M}`, price: 850 },
        { id: 'retainer-premium', name: `Premium - $1,600${M}`, price: 1600 }
      ]
    }
  ];

  const selectedService = services.find(s => s.id === formData.service);

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    logger.log('CAPTCHA verified successfully');
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
    logger.log('CAPTCHA expired, please verify again');
    toast.error(fr ? 'La vérification de sécurité a expiré. Veuillez vérifier de nouveau.' : 'Security verification expired. Please verify again.');
  };

  const handleCaptchaError = (error: string) => {
    setCaptchaToken(null);
    if (window.location.hostname === 'creova.ca') {
      toast.error(fr ? 'Problème de vérification de sécurité' : 'Security Verification Issue', {
        description: error || (fr ? 'Vérification impossible. Veuillez actualiser et réessayer.' : 'Unable to verify. Please refresh and try again.')
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.service || !formData.name || !formData.email || !formData.phone) {
      toast.error(fr ? 'Veuillez remplir tous les champs obligatoires' : 'Please fill in all required fields');
      return;
    }

    if (!date) {
      toast.error(fr ? 'Veuillez sélectionner une date préférée' : 'Please select a preferred date');
      return;
    }

    if (!captchaToken) {
      toast.error(fr ? 'Veuillez compléter le CAPTCHA' : 'Please complete the CAPTCHA');
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
            ...formData,
            preferredDate: format(date, 'PPP'),
            submittedAt: new Date().toISOString(),
            captchaToken: captchaToken
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error(data.error || 'Failed to submit booking');
      }
    } catch {
      toast.error(fr ? "Échec de l'envoi de la réservation" : 'Failed to submit booking', {
        description: fr ? 'Veuillez réessayer ou nous joindre directement.' : 'Please try again or contact us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F5F1EB' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'rgba(166,143,89,0.12)', border: '1px solid rgba(166,143,89,0.3)' }}
          >
            <CheckCircle2 className="w-10 h-10" style={{ color: '#A68F59' }} />
          </div>
          <h1 className="text-3xl font-light mb-3" style={{ color: '#121212' }}>{fr ? 'Demande de réservation reçue' : 'Booking Request Received'}</h1>
          <p className="text-base mb-8 leading-relaxed" style={{ color: '#7A6F66' }}>
            {fr ? 'Merci ! Nous vous joindrons dans les 24 heures pour confirmer votre séance et discuter des détails.' : "Thank you! We'll reach out within 24 hours to confirm your session and discuss details."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate('/')}
              className="px-8 py-3 rounded-xl"
              style={{ backgroundColor: '#121212', color: '#F5F1EB' }}
            >
              {fr ? "Retour à l'accueil" : 'Back to Home'}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/services')}
              className="px-8 py-3 rounded-xl"
            >
              {fr ? 'Explorer les services' : 'Explore Services'}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1EB' }}>
      <PageSEO
        title="Book a Session"
        description="Book your photography, videography, brand design, or social media session with CREOVA. Professional creative services across Ontario starting from $450."
      path="/booking"
      />
      {/* Hero — Editorial asymmetric */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0A0A0A', minHeight: '400px' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 50% 80% at 0% 50%, rgba(166,143,89,0.07) 0%, transparent 60%),
                       radial-gradient(ellipse 35% 55% at 100% 30%, rgba(177,100,59,0.05) 0%, transparent 60%)`
        }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.2)' }} />
        <div className="absolute top-0 left-0 right-0" style={{ height: '3px', background: 'linear-gradient(135deg, #A68F59 0%, #B1643B 100%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-[1fr_auto] gap-0 items-center py-14 sm:py-20">

            {/* LEFT — typographic headline */}
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate('/pricing')}
                className="mb-8 text-xs px-0 tracking-widest uppercase"
                style={{ color: 'rgba(166,143,89,0.6)' }}
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                {fr ? 'Retour aux tarifs' : 'Back to Pricing'}
              </Button>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3 mb-6"
              >
                <div style={{ height: '1px', width: '32px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
                <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>{fr ? 'Services créatifs professionnels' : 'Professional Creative Services'}</span>
              </motion.div>

              {/* MASSIVE "Book" */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-light leading-none tracking-tighter"
                style={{ fontSize: 'clamp(64px, 12vw, 160px)', color: '#F5F1EB' }}
              >
                {fr ? 'Réservez.' : 'Book.'}
              </motion.h1>

              {/* Small italic */}
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22 }}
                className="italic leading-none tracking-tight mb-8"
                style={{
                  fontSize: 'clamp(20px, 3.2vw, 42px)',
                  backgroundImage: 'linear-gradient(135deg, #A68F59 0%, #B1643B 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {fr ? '/ Votre séance.' : '/ Your Session.'}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm font-light max-w-sm"
                style={{ color: 'rgba(245,241,235,0.4)' }}
              >
                {fr ? 'Partagez votre vision — nous répondons dans les 24 heures.' : "Share your vision — we'll respond within 24 hours."}
              </motion.p>
            </div>

            {/* RIGHT — trust signals */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden md:flex flex-col gap-3 w-56 ml-16"
            >
              {[
                { icon: Award, label: fr ? '20+ projets' : '20+ Projects', desc: fr ? "Livrés partout en Ontario" : 'Delivered across Ontario' },
                { icon: CheckCircle2, label: fr ? 'Dirigée par des BIPOC' : 'BIPOC-Led', desc: fr ? 'Équipe créative diversifiée' : 'Diverse creative team' },
                { icon: Star, label: fr ? '5,0 ★' : '5.0 ★ Rating', desc: fr ? 'Avis vérifiés sur Google' : 'Google verified reviews' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-4 px-5 py-4 rounded-xl"
                  style={{
                    backgroundColor: 'rgba(245,241,235,0.04)',
                    border: '1px solid rgba(166,143,89,0.12)',
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(166,143,89,0.1)' }}>
                    <item.icon className="w-4 h-4" style={{ color: '#A68F59' }} />
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#F5F1EB' }}>{item.label}</div>
                    <p className="text-[11px] mt-0.5" style={{ color: 'rgba(245,241,235,0.3)' }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16" style={{ backgroundColor: '#F5F1EB' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="rounded-2xl p-8 md:p-12"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(18,18,18,0.1)' }}
          >
            <div className="space-y-8">
              {/* Service Selection */}
              <div>
                <h2 className="text-2xl mb-2" style={{ color: '#121212' }}>
                  {fr ? 'Commençons par votre projet' : "Let's Start With Your Project"}
                </h2>
                <p className="text-sm mb-4" style={{ color: '#7A6F66' }}>
                  {fr ? 'Choisissez le service qui correspond le mieux à votre vision' : 'Choose the service that best fits your vision'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => {
                    const Icon = service.icon;
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, service: service.id, package: '' })}
                        className="p-4 rounded-xl border-2 transition-all duration-300 text-left"
                        style={{
                          borderColor: formData.service === service.id ? '#A68F59' : '#E3DCD3',
                          backgroundColor: formData.service === service.id ? 'rgba(166, 143, 89, 0.05)' : '#FFFFFF'
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-6 h-6" style={{ color: formData.service === service.id ? '#A68F59' : '#121212' }} />
                          <span className="text-sm font-medium" style={{ color: '#121212' }}>
                            {service.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Package Selection */}
              {selectedService && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <Label htmlFor="package" className="text-base mb-3 block" style={{ color: '#121212' }}>
                    {fr ? 'Choisissez votre forfait *' : 'Choose Your Package *'}
                  </Label>
                  <Select value={formData.package} onValueChange={(value) => setFormData({ ...formData, package: value })}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={fr ? 'Sélectionner un forfait' : 'Select a package'} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedService.packages.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.id}>
                          {pkg.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}

              <div className="border-t pt-8" style={{ borderColor: '#E3DCD3' }}>
                <h2 className="text-2xl mb-2" style={{ color: '#121212' }}>
                  {fr ? 'Comment pouvons-nous vous joindre ?' : 'How Can We Reach You?'}
                </h2>
                <p className="text-sm mb-6" style={{ color: '#7A6F66' }}>
                  {fr ? 'Nous nous en servirons pour vous envoyer la confirmation de réservation et les détails de la séance' : "We'll use this to send you booking confirmation and session details"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <Label htmlFor="name" className="mb-2 block" style={{ color: '#121212' }}>
                      {fr ? 'Nom complet *' : 'Full Name *'}
                    </Label>
                    <Input
                      id="name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-12"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="mb-2 block" style={{ color: '#121212' }}>
                      {fr ? 'Adresse courriel *' : 'Email Address *'}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-12"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="mb-2 block" style={{ color: '#121212' }}>
                      {fr ? 'Numéro de téléphone *' : 'Phone Number *'}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="h-12"
                      placeholder="(416) 123-4567"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <Label className="mb-2 block" style={{ color: '#121212' }}>
                      {fr ? 'Date préférée *' : 'Preferred Date *'}
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-12 justify-start text-left font-normal"
                          style={{ color: date ? '#121212' : '#7A6F66' }}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, 'PPP') : (fr ? 'Choisir une date' : 'Pick a date')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <Label htmlFor="preferredTime" className="mb-2 block" style={{ color: '#121212' }}>
                      {fr ? 'Heure préférée' : 'Preferred Time'}
                    </Label>
                    <Select value={formData.preferredTime} onValueChange={(value) => setFormData({ ...formData, preferredTime: value })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={fr ? 'Sélectionner une heure' : 'Select a time'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">{fr ? 'Matin (9 h - 12 h)' : 'Morning (9 AM - 12 PM)'}</SelectItem>
                        <SelectItem value="afternoon">{fr ? 'Après-midi (12 h - 16 h)' : 'Afternoon (12 PM - 4 PM)'}</SelectItem>
                        <SelectItem value="evening">{fr ? 'Soir (16 h - 20 h)' : 'Evening (4 PM - 8 PM)'}</SelectItem>
                        <SelectItem value="flexible">{fr ? 'Flexible' : 'Flexible'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div>
                    <Label htmlFor="location" className="mb-2 block" style={{ color: '#121212' }}>
                      {fr ? 'Lieu/Emplacement' : 'Location/Venue'}
                    </Label>
                    <Input
                      id="location"
                      autoComplete="street-address"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="h-12"
                      placeholder="St. Catharines, ON"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="border-t pt-8" style={{ borderColor: '#E3DCD3' }}>
                <h2 className="text-2xl mb-6" style={{ color: '#121212' }}>
                  {fr ? 'Détails supplémentaires' : 'Additional Details'}
                </h2>

                <div className="space-y-6">
                  {/* Number of People */}
                  <div>
                    <Label htmlFor="numberOfPeople" className="mb-2 block" style={{ color: '#121212' }}>
                      {fr ? 'Nombre de personnes (le cas échéant)' : 'Number of People (if applicable)'}
                    </Label>
                    <Input
                      id="numberOfPeople"
                      value={formData.numberOfPeople}
                      onChange={(e) => setFormData({ ...formData, numberOfPeople: e.target.value })}
                      className="h-12"
                      placeholder={fr ? 'p. ex. 5 membres de la famille' : 'e.g., 5 family members'}
                    />
                  </div>

                  {/* Special Requests */}
                  <div>
                    <Label htmlFor="specialRequests" className="mb-2 block" style={{ color: '#121212' }}>
                      {fr ? 'Demandes spéciales ou vision' : 'Special Requests or Vision'}
                    </Label>
                    <Textarea
                      id="specialRequests"
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      rows={4}
                      placeholder={fr ? 'Parlez-nous de votre vision, des prises précises souhaitées, des thèmes ou des exigences particulières...' : "Tell us about your vision, any specific shots you'd like, themes, or special requirements..."}
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <Label htmlFor="budget" className="mb-2 block" style={{ color: '#121212' }}>
                      {fr ? 'Fourchette budgétaire' : 'Budget Range'}
                    </Label>
                    <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={fr ? 'Sélectionner votre fourchette budgétaire' : 'Select your budget range'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-500">{fr ? 'Moins de 500 $' : 'Under $500'}</SelectItem>
                        <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                        <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                        <SelectItem value="2000-5000">$2,000 - $5,000</SelectItem>
                        <SelectItem value="over-5000">{fr ? 'Plus de 5 000 $' : 'Over $5,000'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* How did you hear about us */}
                  <div>
                    <Label htmlFor="hearAboutUs" className="mb-2 block" style={{ color: '#121212' }}>
                      {fr ? 'Comment avez-vous entendu parler de nous ?' : 'How did you hear about us?'}
                    </Label>
                    <Select value={formData.hearAboutUs} onValueChange={(value) => setFormData({ ...formData, hearAboutUs: value })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={fr ? 'Sélectionner une option' : 'Select an option'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="google">{fr ? 'Recherche Google' : 'Google Search'}</SelectItem>
                        <SelectItem value="referral">{fr ? "Recommandation d'un ami" : 'Referral from Friend'}</SelectItem>
                        <SelectItem value="event">{fr ? 'Événement/Atelier' : 'Event/Workshop'}</SelectItem>
                        <SelectItem value="other">{fr ? 'Autre' : 'Other'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* CAPTCHA */}
              <div className="border-t pt-8" style={{ borderColor: '#E3DCD3' }}>
                <h2 className="text-2xl mb-6" style={{ color: '#121212' }}>
                  {fr ? 'Vérifiez votre réservation' : 'Verify Your Booking'}
                </h2>
                <Captcha onVerify={handleCaptchaVerify} onExpire={handleCaptchaExpire} onError={handleCaptchaError} />
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-14 text-base group"
                  style={{ backgroundColor: '#121212' }}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-5 h-5 mr-2 animate-spin" />
                      {fr ? 'Envoi...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      {fr ? 'Envoyer la demande de réservation' : 'Submit Booking Request'}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/pricing')}
                  className="h-14 px-8"
                >
                  {fr ? 'Annuler' : 'Cancel'}
                </Button>
              </div>

              <p className="text-xs text-center" style={{ color: '#7A6F66' }}>
                {fr ? "En soumettant ce formulaire, vous acceptez d'être contacté par CREOVA au sujet de votre demande de réservation. Nous répondons généralement dans les 24 heures." : 'By submitting this form, you agree to be contacted by CREOVA regarding your booking request. We typically respond within 24 hours.'}
              </p>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Why Book With Us */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#121212' }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 70% at 50% 100%, rgba(166,143,89,0.07) 0%, transparent 65%)'
        }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center gap-5 mb-3">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>{fr ? 'Notre promesse' : 'Our Promise'}</p>
            </div>
            <h2 className="text-4xl font-light tracking-tight" style={{ color: '#F5F1EB' }}>{fr ? 'Pourquoi réserver avec CREOVA ?' : 'Why Book With CREOVA?'}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Star,
                title: fr ? 'Équipe professionnelle' : 'Professional Team',
                description: fr ? "Des créatifs experts avec plus de 20 projets réussis et des avis 5 étoiles" : 'Expert creatives with 20+ successful projects and 5-star reviews'
              },
              {
                icon: Award,
                title: fr ? 'Authenticité culturelle' : 'Cultural Authenticity',
                description: fr ? 'Agence dirigée par des BIPOC offrant un récit authentique pour des communautés diversifiées' : 'BIPOC-led agency providing authentic storytelling for diverse communities'
              },
              {
                icon: CheckCircle2,
                title: fr ? 'Excellence garantie' : 'Guaranteed Excellence',
                description: fr ? 'Garantie de satisfaction à 100 % avec révisions illimitées sur certains forfaits' : '100% satisfaction guarantee with unlimited revisions on select packages'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl"
                style={{ border: '1px solid rgba(166,143,89,0.18)', backgroundColor: 'rgba(166,143,89,0.04)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ border: '1px solid rgba(166,143,89,0.3)', backgroundColor: 'rgba(166,143,89,0.08)' }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: '#A68F59' }} />
                </div>
                <div style={{ height: '1px', width: '24px', backgroundColor: 'rgba(166,143,89,0.4)', marginBottom: '16px' }} />
                <h3 className="text-lg mb-3 tracking-tight" style={{ color: '#F5F1EB' }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7A6F66' }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}