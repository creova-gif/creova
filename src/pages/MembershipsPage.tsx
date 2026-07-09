import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PageSEO } from '../components/PageSEO';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
import { Star, Crown, Check, Mail, Loader2, Users, Smartphone, Palette, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function MembershipsPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [selectedMembership, setSelectedMembership] = useState<'creator' | 'legacy' | null>(null);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '' });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);

  const content = {
    en: {
      title: 'Memberships',
      subtitle: 'Join the CREOVA creative family — free to start, powerful to grow',
      availableBadge: 'AVAILABLE NOW',
      seenBadge: 'SEEN APP — COMING SUMMER 2026',
      seenNote: 'Members get priority early access to the SEEN app launching Summer 2026 — our platform where creatives and artists collaborate on exclusive collection drops.',
      notifyTitle: 'Stay Updated',
      notifyPlaceholder: 'Enter your email for updates',
      notifyButton: 'Subscribe',
      notifySuccess: '✓ You\'ll receive membership updates!',
      community: {
        name: 'COMMUNITY',
        price: 'Free',
        period: '',
        description: 'Create your account and become part of the CREOVA family',
        badge: 'GET STARTED',
        features: [
          'CREOVA Community member profile',
          'Access to community events & RSVP',
          'Browse the full SEEN collection',
          'SEEN App — join the early access waitlist',
          'Members-only newsletter & drops',
          'Community feed & creator network',
          'Early RSVP for CREOVA events',
        ]
      },
      creator: {
        name: 'CREATOR',
        price: '$199',
        period: '/year',
        description: 'For creative professionals ready to grow their brand with CREOVA',
        badge: 'MOST POPULAR',
        features: [
          'Everything in Community',
          '20% off all CREOVA services & workshops',
          '15% off SEEN collection products',
          'Submit your creative work to the SEEN collection',
          'SEEN App — confirmed beta tester (early access)',
          'Monthly creator meetups (virtual + in-person)',
          'Equipment rental discounts',
          'Quarterly portfolio review session',
          'Priority booking for services',
          'CREOVA Creator digital badge',
          'Members-only resource library',
        ]
      },
      legacy: {
        name: 'LEGACY',
        price: '$499',
        period: '/year',
        description: 'For established creatives building lasting cultural impact with CREOVA',
        badge: 'PREMIUM',
        features: [
          'Everything in Creator',
          '30% off all CREOVA services & workshops',
          '25% off SEEN collection products',
          'Featured as a collab artist in SEEN drops',
          'Co-design SEEN pieces with the CREOVA team',
          'SEEN App — founding member (lifetime early access)',
          'Quarterly 1-on-1 mentorship sessions',
          'Annual professional photoshoot (included)',
          'Featured in CREOVA creator spotlight',
          'Exclusive networking & industry events',
          '2× complimentary equipment rental per year',
          'Co-marketing opportunities with CREOVA',
          'Lifetime archive of member creative work',
          'Legacy physical badge & certificate',
        ]
      },
      joinFree: 'Create Free Account',
      joinNow: 'Subscribe Now',
      checkoutTitle: 'Complete Your Membership',
      checkoutDescription: 'Enter your details to start your annual membership subscription',
      nameLabel: 'Full Name',
      emailLabel: 'Email Address',
      cancel: 'Cancel',
      proceed: 'Proceed to Payment'
    },
    fr: {
      title: 'Adhésions',
      subtitle: 'Rejoignez la famille créative CREOVA — gratuit pour commencer, puissant pour grandir',
      availableBadge: 'DISPONIBLE MAINTENANT',
      seenBadge: 'APP SEEN — ÉTÉ 2026',
      seenNote: 'Les membres obtiennent un accès prioritaire à l\'application SEEN qui lance l\'été 2026 — notre plateforme où les créatifs et artistes collaborent sur des drops de collection exclusifs.',
      notifyTitle: 'Restez Informé',
      notifyPlaceholder: 'Entrez votre courriel pour les mises à jour',
      notifyButton: 'S\'abonner',
      notifySuccess: '✓ Vous recevrez les mises à jour d\'adhésion!',
      community: {
        name: 'COMMUNAUTÉ',
        price: 'Gratuit',
        period: '',
        description: 'Créez votre compte et devenez membre de la famille CREOVA',
        badge: 'COMMENCER',
        features: [
          'Profil de membre de la communauté CREOVA',
          'Accès aux événements communautaires et RSVP',
          'Parcourir toute la collection SEEN',
          'App SEEN — rejoindre la liste d\'attente d\'accès anticipé',
          'Bulletin et drops réservés aux membres',
          'Fil de la communauté et réseau de créateurs',
          'RSVP anticipé pour les événements CREOVA',
        ]
      },
      creator: {
        name: 'CRÉATEUR',
        price: '199$',
        period: '/an',
        description: 'Pour les professionnels créatifs prêts à développer leur marque avec CREOVA',
        badge: 'LE PLUS POPULAIRE',
        features: [
          'Tout dans Communauté',
          '20% de rabais sur tous les services et ateliers CREOVA',
          '15% de rabais sur les produits de la collection SEEN',
          'Soumettre votre travail créatif à la collection SEEN',
          'App SEEN — bêta-testeur confirmé (accès anticipé)',
          'Rencontres mensuelles de créateurs (virtuel + en personne)',
          'Rabais de location d\'équipement',
          'Session trimestrielle de révision de portfolio',
          'Réservation prioritaire pour les services',
          'Badge numérique CREOVA Créateur',
          'Bibliothèque de ressources réservée aux membres',
        ]
      },
      legacy: {
        name: 'HÉRITAGE',
        price: '499$',
        period: '/an',
        description: 'Pour les créatifs établis construisant un impact culturel durable avec CREOVA',
        badge: 'PREMIUM',
        features: [
          'Tout dans Créateur',
          '30% de rabais sur tous les services et ateliers CREOVA',
          '25% de rabais sur les produits de la collection SEEN',
          'Présenté comme artiste collaborateur dans les drops SEEN',
          'Co-concevoir des pièces SEEN avec l\'équipe CREOVA',
          'App SEEN — membre fondateur (accès anticipé à vie)',
          'Séances de mentorat trimestrielles 1-à-1',
          'Séance photo professionnelle annuelle (incluse)',
          'Mise en vedette dans le spotlight des créateurs CREOVA',
          'Événements exclusifs de réseautage et d\'industrie',
          '2× location d\'équipement gratuite par an',
          'Opportunités de co-marketing avec CREOVA',
          'Archive à vie du travail créatif des membres',
          'Badge physique et certificat Héritage',
        ]
      },
      joinFree: 'Créer un Compte Gratuit',
      joinNow: 'S\'abonner',
      checkoutTitle: 'Complétez Votre Adhésion',
      checkoutDescription: 'Entrez vos détails pour commencer votre abonnement annuel',
      nameLabel: 'Nom Complet',
      emailLabel: 'Adresse Courriel',
      cancel: 'Annuler',
      proceed: 'Procéder au Paiement'
    }
  };

  const t = content[language];

  const handleNotifyMe = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-feacf0d8/notify-me`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: notifyEmail,
          type: 'membership_updates',
          item_id: 'all'
        })
      });

      if (response.ok) {
        setNotifySuccess(true);
        setNotifyEmail('');
        setTimeout(() => setNotifySuccess(false), 5000);
        toast.success('Subscribed to membership updates!');
      }
    } catch {
      toast.error('Failed to subscribe');
    }
  };

  const handleSelectMembership = (type: 'creator' | 'legacy') => {
    setSelectedMembership(type);
    setShowCheckoutDialog(true);
    setCustomerInfo({ name: '', email: '' });
    setAgreedToTerms(false);
  };

  const handleProceedToPayment = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      toast.error('Please enter your name and email');
      return;
    }

    if (!selectedMembership) {
      toast.error('Please select a membership tier');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-feacf0d8/create-subscription-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            membership_type: selectedMembership,
            customer_email: customerInfo.email,
            customer_name: customerInfo.name
          })
        }
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch {
      toast.error('Failed to start checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1EB' }}>
      <PageSEO
        title="Memberships"
        description="Join the CREOVA creative family. Free community membership, or upgrade to Creator ($199/yr) or Legacy ($499/yr) for exclusive discounts, mentorship, and benefits."
      path="/memberships"
      />
      {/* Hero Section — Editorial */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: 'linear-gradient(to bottom, transparent, #B1643B, #A68F59, transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ backgroundColor: 'rgba(166,143,89,0.25)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-0 items-center">
            {/* Left: headline */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="py-24 pr-0 lg:pr-16"
              style={{ borderRight: '1px solid rgba(166,143,89,0.1)' }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
                style={{ backgroundColor: 'rgba(177,100,59,0.12)', border: '1px solid rgba(177,100,59,0.3)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#B1643B' }} />
                <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ color: '#B1643B' }}>{t.availableBadge}</span>
              </motion.div>
              <h1 className="tracking-tight leading-none mb-8" style={{ fontSize: 'clamp(3rem, 7vw, 7rem)' }}>
                <span className="block font-light mb-2" style={{ color: '#F5F1EB' }}>
                  {language === 'fr' ? 'Rejoignez' : 'Join the'}
                </span>
                <span className="block italic" style={{
                  backgroundImage: 'linear-gradient(95deg, #A68F59 0%, #E3DCD3 65%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}>
                  {language === 'fr' ? 'Famille.' : 'Family.'}
                </span>
              </h1>
              <p className="text-base leading-relaxed max-w-lg" style={{ color: '#7A6F66' }}>
                {t.subtitle}
              </p>
            </motion.div>

            {/* Right: tier preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="py-16 pl-0 lg:pl-12 flex flex-col gap-3"
            >
              {[
                { icon: Users, label: language === 'fr' ? 'Communauté' : 'Community', price: language === 'fr' ? 'Gratuit' : 'Free', accent: '#7A6F66' },
                { icon: Star, label: 'Creator', price: '$199/yr', accent: '#A68F59' },
                { icon: Crown, label: 'Legacy', price: '$499/yr', accent: '#B1643B' },
              ].map((tier, i) => (
                <motion.div
                  key={tier.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl"
                  style={{ backgroundColor: 'rgba(245,241,235,0.03)', border: `1px solid ${tier.accent}22` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${tier.accent}15` }}>
                      <tier.icon className="w-4 h-4" style={{ color: tier.accent }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#F5F1EB' }}>{tier.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold" style={{ color: tier.accent }}>{tier.price}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-40" style={{ color: '#F5F1EB' }} />
                  </div>
                </motion.div>
              ))}
              <p className="text-[10px] mt-2" style={{ color: 'rgba(245,241,235,0.25)' }}>
                * CAD. 13% HST applies. Auto-renews annually.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEEN App Early Access Banner */}
      <div className="py-6 px-4" style={{ backgroundColor: '#A68F59' }}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3 flex-shrink-0">
            <Smartphone className="w-8 h-8" style={{ color: '#121212' }} />
            <span className="font-semibold tracking-widest text-sm uppercase" style={{ color: '#121212' }}>
              {t.seenBadge}
            </span>
          </div>
          <div className="h-px sm:h-8 w-full sm:w-px" style={{ backgroundColor: 'rgba(18,18,18,0.2)' }} />
          <p className="text-sm" style={{ color: '#121212' }}>
            {t.seenNote}
          </p>
        </div>
      </div>

      {/* Membership Tiers */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm mb-10" style={{ color: '#7A6F66' }}>
            * Paid plans in CAD. 13% HST (Ontario) applies. Memberships auto-renew annually.
          </p>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Community — Free */}
            <Card className="p-8 border-2 bg-white hover:shadow-xl transition-shadow flex flex-col" style={{ borderColor: '#E3DCD3' }}>
              <div className="mb-6">
                <div className="inline-block px-3 py-1 rounded-full text-xs tracking-widest uppercase mb-4" style={{ backgroundColor: '#F5F1EB', color: '#7A6F66', border: '1px solid #E3DCD3' }}>
                  {t.community.badge}
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-7 h-7" style={{ color: '#7A6F66' }} />
                  <h2 className="text-2xl tracking-wide" style={{ color: '#121212' }}>{t.community.name}</h2>
                </div>
                <div className="mb-3">
                  <span className="text-5xl font-light" style={{ color: '#121212' }}>{t.community.price}</span>
                </div>
                <p className="text-sm" style={{ color: '#7A6F66' }}>{t.community.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {t.community.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#A68F59' }} />
                    <span className="text-sm" style={{ color: '#4A3E36' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => navigate('/auth')}
                className="w-full py-6 text-base"
                style={{ backgroundColor: '#121212', color: '#F5F1EB' }}
              >
                {t.joinFree}
              </Button>
            </Card>

            {/* Creator */}
            <Card className="p-8 border-2 bg-white hover:shadow-2xl transition-shadow flex flex-col relative" style={{ borderColor: '#A68F59' }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase" style={{ backgroundColor: '#A68F59', color: '#F5F1EB' }}>
                {t.creator.badge}
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3 mt-2">
                  <Star className="w-7 h-7" style={{ color: '#A68F59' }} />
                  <h2 className="text-2xl tracking-wide" style={{ color: '#121212' }}>{t.creator.name}</h2>
                </div>
                <div className="mb-3">
                  <span className="text-5xl font-light" style={{ color: '#121212' }}>{t.creator.price}</span>
                  <span className="text-base ml-1" style={{ color: '#7A6F66' }}>{t.creator.period}</span>
                </div>
                <p className="text-sm" style={{ color: '#7A6F66' }}>{t.creator.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {t.creator.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#A68F59' }} />
                    <span className="text-sm" style={{ color: '#4A3E36' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectMembership('creator')}
                className="w-full py-6 text-base"
                style={{ backgroundColor: '#A68F59', color: '#F5F1EB' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#B1643B')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#A68F59')}
              >
                {t.joinNow}
              </Button>
            </Card>

            {/* Legacy */}
            <Card className="p-8 border-2 bg-white hover:shadow-2xl transition-shadow flex flex-col relative" style={{ borderColor: '#B1643B' }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase" style={{ backgroundColor: '#B1643B', color: '#F5F1EB' }}>
                {t.legacy.badge}
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3 mt-2">
                  <Crown className="w-7 h-7" style={{ color: '#B1643B' }} />
                  <h2 className="text-2xl tracking-wide" style={{ color: '#121212' }}>{t.legacy.name}</h2>
                </div>
                <div className="mb-3">
                  <span className="text-5xl font-light" style={{ color: '#121212' }}>{t.legacy.price}</span>
                  <span className="text-base ml-1" style={{ color: '#7A6F66' }}>{t.legacy.period}</span>
                </div>
                <p className="text-sm" style={{ color: '#7A6F66' }}>{t.legacy.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {t.legacy.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#B1643B' }} />
                    <span className="text-sm" style={{ color: '#4A3E36' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectMembership('legacy')}
                className="w-full py-6 text-base"
                style={{ backgroundColor: '#B1643B', color: '#F5F1EB' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#121212')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#B1643B')}
              >
                {t.joinNow}
              </Button>
            </Card>

          </div>
        </div>
      </div>

      {/* Why Create an Account — Value Props */}
      <div className="py-20 px-4" style={{ backgroundColor: '#121212' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-4" style={{ color: '#F5F1EB' }}>
            {language === 'en' ? 'Why Join the CREOVA Family?' : 'Pourquoi rejoindre la famille CREOVA?'}
          </h2>
          <p className="text-center mb-14 text-lg" style={{ color: '#E3DCD3' }}>
            {language === 'en'
              ? 'Every account unlocks a world of creative community and opportunity.'
              : 'Chaque compte ouvre un monde de communauté créative et d\'opportunité.'}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8" style={{ color: '#A68F59' }} />,
                title: language === 'en' ? 'Community First' : 'Communauté d\'abord',
                desc: language === 'en'
                  ? 'Connect with BIPOC creatives, artists, and entrepreneurs across Ontario.'
                  : 'Connectez-vous avec des créatifs, artistes et entrepreneurs BIPOC en Ontario.'
              },
              {
                icon: <Smartphone className="w-8 h-8" style={{ color: '#A68F59' }} />,
                title: language === 'en' ? 'SEEN App Access' : 'Accès App SEEN',
                desc: language === 'en'
                  ? 'Be among the first to experience our app where artists and collectors meet.'
                  : 'Soyez parmi les premiers à découvrir notre app où artistes et collectionneurs se rencontrent.'
              },
              {
                icon: <Palette className="w-8 h-8" style={{ color: '#A68F59' }} />,
                title: language === 'en' ? 'Collab on SEEN Drops' : 'Collabs SEEN',
                desc: language === 'en'
                  ? 'Creator and Legacy members can submit work and co-design pieces in the SEEN collection.'
                  : 'Les membres Créateur et Héritage peuvent soumettre leur travail et co-concevoir des pièces SEEN.'
              },
              {
                icon: <Zap className="w-8 h-8" style={{ color: '#A68F59' }} />,
                title: language === 'en' ? 'Exclusive Access' : 'Accès Exclusif',
                desc: language === 'en'
                  ? 'Members-only events, workshops, discounts, and priority booking for all CREOVA services.'
                  : 'Événements, ateliers, rabais et réservation prioritaire réservés aux membres.'
              }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-lg mb-2" style={{ color: '#F5F1EB' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: '#7A6F66' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Button
              onClick={() => navigate('/auth')}
              className="px-10 py-6 text-base rounded-full"
              style={{ backgroundColor: '#A68F59', color: '#F5F1EB' }}
            >
              {language === 'en' ? 'Create Your Free Account' : 'Créer Votre Compte Gratuit'}
            </Button>
          </div>
        </div>
      </div>

      {/* Notify Me */}
      <div className="py-12 px-4" style={{ backgroundColor: '#E3DCD3' }}>
        <div className="max-w-md mx-auto text-center">
          <Mail className="w-10 h-10 mx-auto mb-4" style={{ color: '#B1643B' }} />
          <h3 className="text-2xl mb-2" style={{ color: '#121212' }}>{t.notifyTitle}</h3>
          <p className="text-sm mb-6" style={{ color: '#7A6F66' }}>
            {language === 'en'
              ? 'Get notified about new SEEN drops, events, and membership updates.'
              : 'Soyez informé des nouveaux drops SEEN, événements et mises à jour d\'adhésion.'}
          </p>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder={t.notifyPlaceholder}
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleNotifyMe}
              style={{ backgroundColor: '#121212', color: '#F5F1EB' }}
            >
              {t.notifyButton}
            </Button>
          </div>
          {notifySuccess && (
            <p className="mt-3" style={{ color: '#A68F59' }}>{t.notifySuccess}</p>
          )}
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl" style={{ color: '#121212' }}>
              {t.checkoutTitle}
            </DialogTitle>
            <DialogDescription style={{ color: '#7A6F66' }}>
              {t.checkoutDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">{t.nameLabel}</Label>
              <Input
                id="name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                placeholder="Jane Doe"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email">{t.emailLabel}</Label>
              <Input
                id="email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                placeholder="jane@example.com"
                className="mt-2"
              />
            </div>

            {selectedMembership && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5F1EB' }}>
                <div className="flex justify-between items-center">
                  <span className="font-medium" style={{ color: '#121212' }}>
                    {selectedMembership === 'creator' ? t.creator.name : t.legacy.name} Membership
                  </span>
                  <span className="text-xl" style={{ color: '#B1643B' }}>
                    {selectedMembership === 'creator' ? t.creator.price : t.legacy.price}
                    <span className="text-sm" style={{ color: '#7A6F66' }}>
                      {selectedMembership === 'creator' ? t.creator.period : t.legacy.period}
                    </span>
                  </span>
                </div>
                <p className="text-xs mt-2" style={{ color: '#7A6F66' }}>
                  {language === 'en' ? '+ 13% HST (Ontario). Auto-renews annually.' : '+ 13% TVH (Ontario). Renouvellement automatique annuel.'}
                </p>
              </div>
            )}

            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                required
              />
              <div>
                <Label htmlFor="terms" className="cursor-pointer text-sm" style={{ color: '#121212' }}>
                  {language === 'en' ? (
                    <>
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() => window.open('/terms-of-service', '_blank')}
                        className="underline"
                        style={{ color: '#A68F59' }}
                      >
                        Terms of Service
                      </button>
                      {' '}and{' '}
                      <button
                        type="button"
                        onClick={() => window.open('/privacy-policy', '_blank')}
                        className="underline"
                        style={{ color: '#A68F59' }}
                      >
                        Privacy Policy
                      </button>
                    </>
                  ) : (
                    <>
                      J'accepte les{' '}
                      <button
                        type="button"
                        onClick={() => window.open('/terms-of-service', '_blank')}
                        className="underline"
                        style={{ color: '#A68F59' }}
                      >
                        Conditions d'utilisation
                      </button>
                      {' '}et la{' '}
                      <button
                        type="button"
                        onClick={() => window.open('/privacy-policy', '_blank')}
                        className="underline"
                        style={{ color: '#A68F59' }}
                      >
                        Politique de confidentialité
                      </button>
                    </>
                  )}
                </Label>
                <p className="text-xs mt-1" style={{ color: '#7A6F66' }}>
                  {language === 'en'
                    ? 'Required for subscription. Your membership will auto-renew annually.'
                    : 'Requis pour l\'abonnement. Votre adhésion se renouvelle automatiquement chaque année.'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCheckoutDialog(false)}
              disabled={isProcessing}
              className="flex-1"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={handleProceedToPayment}
              disabled={isProcessing}
              className="flex-1 text-[#F5F1EB]"
              style={{ backgroundColor: '#121212' }}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                t.proceed
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
