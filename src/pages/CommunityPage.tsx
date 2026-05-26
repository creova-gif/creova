import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, Link } from 'react-router';
import { FloatingOrbs } from '../components/FloatingOrbs';
import { SplitText } from '../components/SplitText';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { 
  Star, 
  Crown,
  Camera,
  Video,
  Palette,
  TrendingUp,
  Heart,
  Users,
  Gift,
  MessageCircle,
  Check,
  ArrowRight,
  Clock,
  ExternalLink,
  Mail,
  Award,
  Calendar
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';
import { Input } from '../components/ui/input';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function CommunityPage() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [notifyEmails, setNotifyEmails] = useState<{ [key: string]: string }>({
    'creator': '',
    'legacy': ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJoinCommunity = () => {
    if (!email || !email.includes('@')) {
      toast.error(language === 'fr' ? 'Veuillez entrer une adresse email valide' : 'Please enter a valid email address');
      return;
    }
    
    toast.success(
      language === 'fr' 
        ? 'Bienvenue dans la communauté CREOVA! Vérifiez votre email.'
        : 'Welcome to CREOVA Community! Check your email.'
    );
    setEmail('');
    
    setTimeout(() => {
      toast.success(
        language === 'fr'
          ? 'Code de réduction de 10%: WELCOME10'
          : '10% discount code: WELCOME10'
      );
    }, 2000);
  };

  const handleNotifyMeLaunch = async (tier: string) => {
    setIsSubmitting(true);
    const email = notifyEmails[tier];
    if (!email || !email.includes('@')) {
      toast.error(language === 'fr' ? 'Veuillez entrer une adresse email valide' : 'Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-feacf0d8/notify-me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email: email,
          type: 'membership',
          item_id: tier
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          language === 'fr'
            ? `Vous serez notifié quand ${tier} sera lancé! 📬`
            : `You'll be notified when ${tier} launches! 📬`
        );
        setNotifyEmails(prev => ({ ...prev, [tier]: '' }));
      } else {
        toast.error(
          language === 'fr'
            ? 'Une erreur s\'est produite. Veuillez réessayer.'
            : 'An error occurred. Please try again.'
        );
      }
    } catch {
      toast.error(
        language === 'fr'
          ? 'Erreur de connexion. Veuillez vérifier votre connexion Internet.'
          : 'Connection error. Please check your internet connection.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const communityPartners = [
    {
      name: 'Black Student Success Centre (BSSC)',
      description: language === 'fr'
        ? 'Le centre académique et personnel de croissance professionnelle pour tous les étudiants noirs à Brock. Établi en 2023, le Centre renforce les connexions entre les étudiants, professeurs, anciens et personnel noirs, favorisant l\'excellence académique et le développement du leadership.'
        : 'The academic and personal hub of professional growth and development for all Black students at Brock. Established in 2023, the Centre strengthens connections between Black students, faculty, alumni, and staff, fostering academic excellence and leadership development.',
      logo: 'black student success',
      website: 'https://brocku.ca/black-student-success-centre/',
      image: '/card-bssc.jpg',
      badge: 'BSSC',
      badgeSub: 'Academic Hub',
      captionLeft: { line1: 'BROCK UNIVERSITY', line2: 'BLACK STUDENT\nSUCCESS CENTRE' },
      captionRight: null,
      objectPosition: 'center 30%',
    },
    {
      name: 'Future Black Female (FBF)',
      description: language === 'fr'
        ? 'À travers de forts réseaux, des programmes d\'avancement des compétences et un plaidoyer basé sur les droits, Future Black Female (FBF) crée un accès à travers le Canada et le monde aux opportunités sociales, politiques et économiques pour les filles et jeunes femmes noires (16-22 ans).'
        : 'Through strong networks, skills advancement programs, and rights-based advocacy, Future Black Female (FBF) creates access across Canada and the globe to social, political and economic opportunities for Black girls and young women (16-22 years).',
      logo: 'black woman empowerment',
      website: 'https://futureblackfemale.com/',
      image: '/card-fbf.jpg',
      badge: 'FBF',
      badgeSub: 'Youth Empowerment',
      captionLeft: { line1: 'CANADA & GLOBAL', line2: 'FUTURE\nBLACK FEMALE' },
      captionRight: null,
      objectPosition: 'center 25%',
    },
    {
      name: 'MSK Project - SSHRC Canada',
      description: language === 'fr'
        ? 'Un projet transformateur financé par SSHRC Canada à travers le programme Match of Minds, dédié à mobiliser les connaissances subjuguées pour favoriser un Niagara juste et inclusif.'
        : 'A transformative project funded by SSHRC Canada through the Match of Minds Program, dedicated to mobilizing subjugated knowledges to foster a just and inclusive Niagara.',
      logo: 'community partnership',
      website: '#',
      image: '/card-msk.jpg',
      badge: 'MSK',
      badgeSub: 'SSHRC Canada',
      captionLeft: { line1: 'NIAGARA REGION', line2: 'MSK\nPROJECT' },
      captionRight: null,
      objectPosition: 'center 30%',
    },
  ];

  const communityBenefits = language === 'fr' ? [
    {
      icon: Users,
      title: 'Réseau de Créateurs',
      description: 'Connectez avec des artistes, entrepreneurs et visionnaires BIPOC à travers le Canada'
    },
    {
      icon: TrendingUp,
      title: 'Opportunités de Croissance',
      description: 'Ateliers, masterclasses et ressources exclusifs pour faire évoluer votre marque'
    },
    {
      icon: Camera,
      title: 'Portfolio & Exposition',
      description: 'Présentez votre travail dans notre galerie communautaire et nos canaux sociaux'
    },
    {
      icon: Gift,
      title: 'Surprises & Cadeaux',
      description: 'Drops inattendus, échantillons exclusifs et contenus bonus tout au long de l\'année'
    },
    {
      icon: MessageCircle,
      title: 'Voix dans la Créativité',
      description: 'Votez sur les nouvelles couleurs, designs et directions de collection'
    },
    {
      icon: Award,
      title: 'Reconnaissance Culturelle',
      description: 'Célébrez vos jalons avec nous - vos victoires sont nos victoires'
    }
  ] : [
    {
      icon: Users,
      title: 'Creator Network',
      description: 'Connect with BIPOC artists, entrepreneurs, and visionaries across Canada'
    },
    {
      icon: TrendingUp,
      title: 'Growth Opportunities',
      description: 'Exclusive workshops, masterclasses, and resources to scale your brand'
    },
    {
      icon: Camera,
      title: 'Portfolio & Exposure',
      description: 'Showcase your work in our community gallery and social channels'
    },
    {
      icon: Gift,
      title: 'Surprises & Gifts',
      description: 'Unexpected drops, exclusive samples, and bonus content throughout the year'
    },
    {
      icon: MessageCircle,
      title: 'Voice in Creativity',
      description: 'Vote on new colorways, designs, and collection directions'
    },
    {
      icon: Award,
      title: 'Cultural Recognition',
      description: 'Celebrate your milestones with us - your wins are our wins'
    }
  ];

  const tiers = [
    {
      id: 'community',
      name: language === 'fr' ? 'Communauté' : 'Community',
      subtitle: language === 'fr' ? 'Rejoignez la famille' : 'Join the Family',
      price: language === 'fr' ? 'Gratuit' : 'Free',
      icon: Heart,
      color: '#A68F59',
      available: true,
      perks: language === 'fr' ? [
        '10% de réduction sur votre première commande SEEN',
        'Accès à la newsletter exclusive mensuelle',
        'Invitations aux événements communautaires',
        'Contenu des coulisses',
        'Récompenses d\'anniversaire (20$ de crédit)',
        'Programme de parrainage (15$ par référence)',
        'Accès aux tutoriels de création de contenu',
        'Support communautaire prioritaire'
      ] : [
        '10% off your first SEEN order',
        'Access to exclusive monthly newsletter',
        'Invitations to community events',
        'Behind-the-scenes content',
        'Birthday rewards ($20 credit)',
        'Referral program ($15 per referral)',
        'Content creation tutorials',
        'Priority community support'
      ]
    },
    {
      id: 'creator',
      name: language === 'fr' ? 'Créateur' : 'Creator',
      subtitle: language === 'fr' ? 'Pour les visionnaires' : 'For Visionaries',
      price: '$49/month',
      priceAnnual: language === 'fr' ? '490$/an (économisez 98$)' : '$490/year (save $98)',
      icon: Star,
      color: '#B1643B',
      available: false,
      launchDate: language === 'fr' ? 'Lancement: Printemps 2026' : 'Launch: Spring 2026',
      perks: language === 'fr' ? [
        'Tous les avantages Communauté',
        '20% de réduction sur tous les produits SEEN',
        'Accès anticipé aux nouvelles collections (48h)',
        'Couleurs exclusives membres uniquement',
        'Réservation prioritaire pour les services (-15%)',
        '1 session photo/vidéo gratuite par an (450$ de valeur)',
        'Carnet de croquis CREOVA + guide de style',
        'Groupe Discord privé des membres',
        'Invitations VIP aux lancements et défilés',
        'Consultation stratégique de marque trimestrielle'
      ] : [
        'All Community perks',
        '20% off all SEEN products',
        'Early access to new collections (48hrs)',
        'Members-only exclusive colorways',
        'Priority booking for services (15% off)',
        '1 free photo/video session per year ($450 value)',
        'CREOVA sketchbook + style guide',
        'Private members Discord group',
        'VIP invites to launches & fashion shows',
        'Quarterly brand strategy consultation'
      ]
    },
    {
      id: 'legacy',
      name: language === 'fr' ? 'Héritage' : 'Legacy',
      subtitle: language === 'fr' ? 'Les icônes culturelles' : 'Cultural Icons',
      price: '$149/month',
      priceAnnual: language === 'fr' ? '1,490$/an (économisez 298$)' : '$1,490/year (save $298)',
      icon: Crown,
      color: '#121212',
      available: false,
      launchDate: language === 'fr' ? 'Lancement: Été 2026' : 'Launch: Summer 2026',
      perks: language === 'fr' ? [
        'Tous les avantages Créateur',
        '30% de réduction sur tous les produits & services',
        'Accès anticipé exclusif (1 semaine avant)',
        'Pièces en édition limitée & collaborations',
        'Forfait services annuel (1,500$ de crédit)',
        'Session portrait de marque annuelle gratuite',
        'Consultation de garde-robe & stylisme personnalisé',
        'Service de conciergerie dédié',
        'Événements exclusifs membres Legacy uniquement',
        'Partenariats de co-création de contenu'
      ] : [
        'All Creator perks',
        '30% off all products & services',
        'Exclusive early access (1 week early)',
        'Limited edition pieces & collaborations',
        'Annual services package ($1,500 credit)',
        'Free annual brand portrait session',
        'Personal wardrobe consultation & styling',
        'Dedicated concierge service',
        'Legacy-only exclusive member events',
        'Content co-creation partnerships'
      ]
    }
  ];

  const services = [
    {
      icon: Camera,
      title: 'Photography',
      description: 'Capturing moments that tell your story with precision and artistry'
    },
    {
      icon: Video,
      title: 'Videography',
      description: 'Cinematic storytelling that brings your vision to life'
    },
    {
      icon: Palette,
      title: 'Brand Management',
      description: 'Crafting visuals that define and elevate your brand identity'
    },
    {
      icon: TrendingUp,
      title: 'Social Media Management',
      description: 'Building your online presence with impactful, data-driven strategies'
    }
  ];

  return (
    <div style={{ backgroundColor: '#F5F1EB' }}>
      {/* Hero Section — Editorial */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
        <FloatingOrbs />
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
              <p className="text-xs tracking-[0.55em] uppercase" style={{ color: '#A68F59' }}>
                {language === 'fr' ? 'Bienvenue' : 'Welcome'}
              </p>
              <div style={{ height: '1px', width: '50px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
            </div>
            <SplitText
              text={language === 'fr' ? 'Notre' : 'Our'}
              tag="h1"
              mode="chars"
              stagger={0.03}
              className="font-light tracking-tight block"
              style={{ fontSize: 'clamp(56px, 9vw, 120px)', color: '#F5F1EB', lineHeight: 1.0, marginBottom: '0.05em' }}
            />
            <SplitText
              text={language === 'fr' ? 'Communauté' : 'Community'}
              tag="h1"
              mode="chars"
              stagger={0.03}
              delay={0.14}
              className="font-light tracking-tight block mb-8"
              style={{
                fontSize: 'clamp(56px, 9vw, 120px)',
                lineHeight: 1.0,
                backgroundImage: 'linear-gradient(135deg, #F5F1EB 0%, #A68F59 60%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            />
            <p className="text-lg mb-10 leading-relaxed" style={{ color: '#7A6F66', maxWidth: '540px', margin: '0 auto 40px' }}>
              {language === 'fr'
                ? 'Une agence créative transformant des idées en expériences captivantes et une communauté culturelle célébrant l\'excellence créative BIPOC'
                : 'A creative agency transforming ideas into engaging experiences and a cultural movement celebrating BIPOC creative excellence'}
            </p>
            <div className="flex flex-wrap gap-6 justify-center items-center">
              {[
                language === 'fr' ? 'Excellence Créative' : 'Creative Excellence',
                language === 'fr' ? 'Communauté BIPOC' : 'BIPOC Community',
                language === 'fr' ? 'Impact Culturel' : 'Cultural Impact'
              ].map((tag, i) => (
                <span key={i} className="flex items-center gap-3">
                  <span className="text-sm tracking-wider" style={{ color: '#A68F59' }}>{tag}</span>
                  {i < 2 && <span style={{ width: '1px', height: '14px', backgroundColor: 'rgba(166,143,89,0.3)', display: 'inline-block' }} />}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-5 mb-6">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(177,100,59,0.4)' }} />
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#B1643B' }}>Mission</p>
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(177,100,59,0.4)' }} />
            </div>
            <h2 className="text-3xl md:text-4xl mb-8 tracking-tight font-light" style={{ color: '#121212' }}>
              {language === 'fr' ? 'Notre Mission' : 'Our Mission'}
            </h2>
            <p className="text-lg leading-relaxed mb-6" style={{ color: '#4A3E36' }}>
              {language === 'fr'
                ? 'Chez CREOVA, nous sommes passionnés par donner vie à votre marque à travers une création de contenu exceptionnelle. Nous ne capturons pas seulement des moments; nous créons des expériences qui génèrent de l\'engagement et laissent une impression durable.'
                : 'At CREOVA, we\'re passionate about bringing your brand to life through exceptional content creation. We don\'t just capture moments; we craft experiences that drive engagement and leave a lasting impression.'}
            </p>
            <p className="text-lg leading-relaxed" style={{ color: '#4A3E36' }}>
              {language === 'fr'
                ? 'Que ce soit de la photographie d\'événements, de la vidéographie, de la gestion de marque ou de la gestion des médias sociaux, notre équipe d\'experts est là pour vous aider à raconter votre histoire unique et à élever la présence en ligne de votre marque.'
                : 'Whether it\'s event photography, videography, brand management, or social media management, our expert team is here to help you tell your unique story and elevate your brand\'s online presence.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#121212' }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(166,143,89,0.06) 0%, transparent 65%)'
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-center gap-5 mb-3">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>Services</p>
            </div>
            <h2 className="text-4xl font-light tracking-tight" style={{ color: '#F5F1EB' }}>
              {language === 'fr' ? 'Ce Que Nous Faisons' : 'What We Do'}
            </h2>
            <p className="text-base mt-2" style={{ color: '#4A3E36' }}>
              {language === 'fr'
                ? 'Services créatifs complets qui donnent vie à votre vision'
                : 'Comprehensive creative services that bring your vision to life'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-7 rounded-xl transition-all duration-300"
                style={{ border: '1px solid rgba(166,143,89,0.18)', backgroundColor: 'rgba(166,143,89,0.04)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(166,143,89,0.4)';
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(166,143,89,0.08)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(166,143,89,0.18)';
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(166,143,89,0.04)';
                }}
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center mb-5"
                  style={{ border: '1px solid rgba(177,100,59,0.35)', backgroundColor: 'rgba(177,100,59,0.1)' }}
                >
                  <service.icon className="w-5 h-5" style={{ color: '#B1643B' }} />
                </div>
                <div style={{ height: '1px', width: '24px', backgroundColor: 'rgba(166,143,89,0.4)', marginBottom: '14px' }} />
                <h3 className="text-lg mb-2 tracking-tight" style={{ color: '#F5F1EB' }}>{service.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7A6F66' }}>{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Vision */}
      <section className="py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div style={{ height: '1px', width: '32px', backgroundColor: 'rgba(177,100,59,0.5)' }} />
                <p className="text-xs tracking-[0.45em] uppercase" style={{ color: '#B1643B' }}>Vision</p>
              </div>
              <h2 className="text-3xl md:text-4xl mb-6 tracking-tight font-light" style={{ color: '#121212' }}>
                {language === 'fr' ? 'Plus Qu\'une Agence' : 'Beyond an Agency'}
              </h2>
              <div className="space-y-4" style={{ color: '#4A3E36' }}>
                <p className="text-lg leading-relaxed">
                  {language === 'fr'
                    ? 'CREOVA est plus qu\'une simple agence créative—c\'est une vision de fusionner la création de contenu, la narration et la culture en quelque chose d\'impactant.'
                    : 'CREOVA is more than just a creative agency—it\'s a vision to merge content creation, storytelling, and culture into something impactful.'}
                </p>
                <p className="text-lg leading-relaxed">
                  {language === 'fr'
                    ? 'Nous nous étendons dans une ligne de vêtements, créant des designs qui célèbrent la culture, la créativité et l\'identité. La mode est une autre façon puissante de raconter des histoires, et nous voulons que CREOVA soit une marque qui résonne mondialement.'
                    : 'We\'re expanding into a clothing line, creating designs that celebrate culture, creativity, and identity. Fashion is another powerful way to tell stories, and we want CREOVA to be a brand that resonates globally.'}
                </p>
                <p className="text-lg leading-relaxed">
                  {language === 'fr'
                    ? 'Au-delà des affaires, notre objectif est de construire des partenariats diasporiques, créant des opportunités pour les créatifs BIPOC dans le monde entier et soutenant les industries créatives.'
                    : 'Beyond business, our goal is to build diaspora partnerships, creating opportunities for BIPOC creatives globally and supporting creative industries.'}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden border-2 hover:shadow-xl transition-all duration-300 group"
              style={{ borderColor: '#A68F59', backgroundColor: '#FFFFFF' }}
            >
              <div className="relative overflow-hidden" style={{ backgroundColor: '#121212', aspectRatio: '4/3' }}>
                <img
                  src="/photo-beyond-agency.jpg"
                  alt="CREOVA — Beyond an Agency"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ objectPosition: 'center center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-5 py-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] tracking-[0.2em] font-semibold mb-1" style={{ color: '#A68F59', fontFamily: 'var(--font-brand)' }}>BROCK UNIVERSITY</p>
                      <h4 className="text-lg font-bold leading-tight" style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>BLACK STUDENT<br />ASSOCIATION</h4>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] tracking-widest uppercase" style={{ color: '#A68F59' }}>President</span>
                        <span className="text-xs font-semibold" style={{ color: '#FFFFFF' }}>Ivie Omoregie</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] tracking-widest uppercase" style={{ color: '#A68F59' }}>Vice President</span>
                        <span className="text-xs font-semibold" style={{ color: '#FFFFFF' }}>Jason Asiruwa</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] tracking-[0.15em] uppercase font-semibold px-2 py-1 rounded" style={{ backgroundColor: '#121212', color: '#A68F59', fontFamily: 'var(--font-brand)' }}>BLSA</span>
                  <span className="text-[10px] tracking-widest uppercase" style={{ color: '#7A6F66' }}>Student Leadership</span>
                </div>
                <h3 className="text-xl mb-3" style={{ color: '#121212' }}>Black Student Association (BLSA)</h3>
                <p className="leading-relaxed mb-4" style={{ color: '#7A6F66' }}>
                  {language === 'fr'
                    ? 'L\'Association des étudiants noirs de l\'Université Brock unit, élève et célèbre les étudiants noirs à travers la culture, le leadership et la communauté.'
                    : 'The Black Student Association at Brock University unites, elevates, and celebrates Black students through culture, leadership, and community.'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4" style={{ color: '#121212' }}>
              {language === 'fr' ? 'Rejoignez Notre Famille' : 'Join Our Family'}
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#7A6F66' }}>
              {language === 'fr'
                ? 'Commencez gratuitement avec la Communauté - niveaux premium à venir!'
                : 'Start free with Community - premium tiers coming soon!'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {tiers.map((tier, index) => {
              const Icon = tier.icon;
              const isAvailable = tier.available;
              
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-3xl p-8 border-2 h-full flex flex-col ${
                    isAvailable ? 'shadow-2xl' : 'shadow-lg'
                  }`}
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    borderColor: isAvailable ? tier.color : '#E3DCD3'
                  }}
                >
                  {isAvailable && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm"
                         style={{ backgroundColor: tier.color, color: '#FFFFFF' }}>
                      {language === 'fr' ? 'DISPONIBLE MAINTENANT' : 'AVAILABLE NOW'}
                    </div>
                  )}

                  {!isAvailable && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm flex items-center gap-2 whitespace-nowrap"
                         style={{ backgroundColor: '#E3DCD3', color: '#121212' }}>
                      <Clock className="w-3 h-3" />
                      {language === 'fr' ? 'BIENTÔT DISPONIBLE' : 'COMING SOON'}
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 rounded-2xl mx-auto mt-2 mb-4 flex items-center justify-center ${!isAvailable && 'grayscale'}`}
                         style={{ backgroundColor: `${tier.color}20` }}>
                      <Icon className="w-8 h-8" style={{ color: tier.color }} />
                    </div>
                    <h3 className="text-3xl mb-2" style={{ color: '#121212' }}>{tier.name}</h3>
                    <p className="text-sm mb-4" style={{ color: '#7A6F66' }}>{tier.subtitle}</p>
                    
                    <div className="h-8 mb-4 flex items-center justify-center">
                      {tier.launchDate && (
                        <p className="text-sm flex items-center gap-2" style={{ color: '#B1643B' }}>
                          <Calendar className="w-4 h-4" />
                          {tier.launchDate}
                        </p>
                      )}
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-4xl" style={{ color: tier.color }}>
                        {tier.price.includes('$') ? tier.price.split('/')[0] : tier.price}
                      </span>
                      {tier.price.includes('/') && (
                        <span className="text-lg" style={{ color: '#7A6F66' }}>
                          /{tier.price.split('/')[1]}
                        </span>
                      )}
                    </div>
                    <div className="h-6">
                      {tier.priceAnnual && (
                        <p className="text-sm" style={{ color: '#7A6F66' }}>{tier.priceAnnual}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-8 flex-grow">
                    {tier.perks.slice(0, isAvailable ? tier.perks.length : 6).map((perk, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: tier.color }} />
                        <span className="text-sm" style={{ color: '#121212' }}>{perk}</span>
                      </div>
                    ))}
                    {!isAvailable && tier.perks.length > 6 && (
                      <p className="text-sm text-center pt-2" style={{ color: '#7A6F66' }}>
                        {language === 'fr' ? `+${tier.perks.length - 6} autres avantages` : `+${tier.perks.length - 6} more benefits`}
                      </p>
                    )}
                  </div>

                  {isAvailable ? (
                    <div className="space-y-3">
                      <Input
                        type="email"
                        placeholder={language === 'fr' ? 'Votre email' : 'Your email'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-xl"
                        style={{ borderColor: tier.color }}
                      />
                      <Button 
                        onClick={handleJoinCommunity}
                        className="w-full rounded-xl py-6 text-lg group relative overflow-hidden"
                        style={{ 
                          backgroundColor: tier.color,
                          color: '#FFFFFF'
                        }}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {language === 'fr' ? 'Rejoindre Gratuitement' : 'Join Free'}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Input
                        type="email"
                        placeholder={language === 'fr' ? 'Votre email' : 'Your email'}
                        value={notifyEmails[tier.id]}
                        onChange={(e) => setNotifyEmails(prev => ({ ...prev, [tier.id]: e.target.value }))}
                        className="rounded-xl"
                        style={{ borderColor: tier.color }}
                      />
                      <Button
                        onClick={() => handleNotifyMeLaunch(tier.id)}
                        className="w-full rounded-xl py-6 text-lg border-2"
                        style={{ 
                          backgroundColor: 'transparent',
                          color: tier.color,
                          borderColor: tier.color
                        }}
                      >
                        <Mail className="w-5 h-5 mr-2" />
                        {language === 'fr' ? 'Me Notifier au Lancement' : 'Notify Me at Launch'}
                      </Button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Benefits */}
      <section className="py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4" style={{ color: '#121212' }}>
              {language === 'fr' ? 'Plus Qu\'une Adhésion' : 'More Than Membership'}
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: '#7A6F66' }}>
              {language === 'fr'
                ? 'Une communauté qui élève, connecte et célèbre l\'excellence créative BIPOC'
                : 'A community that elevates, connects, and celebrates BIPOC creative excellence'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {communityBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl p-6 border-2 hover:shadow-xl transition-all duration-300 group"
                  style={{ backgroundColor: '#F5F1EB', borderColor: '#E3DCD3' }}
                >
                  <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform"
                       style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)' }}>
                    <Icon className="w-6 h-6" style={{ color: '#A68F59' }} />
                  </div>
                  <h3 className="text-xl mb-2" style={{ color: '#121212' }}>{benefit.title}</h3>
                  <p className="leading-relaxed" style={{ color: '#7A6F66' }}>{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Partners */}
      <section className="py-20" style={{ backgroundColor: '#F5F1EB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl mb-4" style={{ color: '#121212' }}>
              {language === 'fr' ? 'Nos Partenaires Communautaires' : 'Our Community Partners'}
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#7A6F66' }}>
              {language === 'fr'
                ? 'Fièrement soutenu par des organisations dédiées à l\'excellence et l\'autonomisation des communautés BIPOC'
                : 'Proudly supported by organizations dedicated to BIPOC community excellence and empowerment'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {communityPartners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl overflow-hidden border-2 hover:shadow-xl transition-all duration-300 group"
                style={{ borderColor: '#E3DCD3', backgroundColor: '#FFFFFF' }}
              >
                <div className="relative overflow-hidden" style={{ backgroundColor: '#121212', aspectRatio: '4/3' }}>
                  <img
                    src={partner.image}
                    alt={partner.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: partner.objectPosition }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 px-5 py-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] tracking-[0.2em] font-semibold mb-1" style={{ color: '#A68F59', fontFamily: 'var(--font-brand)' }}>{partner.captionLeft.line1}</p>
                        <h4 className="text-lg font-bold leading-tight whitespace-pre-line" style={{ color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>{partner.captionLeft.line2}</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] tracking-[0.15em] uppercase font-semibold px-2 py-1 rounded" style={{ backgroundColor: '#121212', color: '#A68F59', fontFamily: 'var(--font-brand)' }}>{partner.badge}</span>
                    <span className="text-[10px] tracking-widest uppercase" style={{ color: '#7A6F66' }}>{partner.badgeSub}</span>
                  </div>
                  <h3 className="text-xl mb-3" style={{ color: '#121212' }}>{partner.name}</h3>
                  <p className="leading-relaxed mb-4" style={{ color: '#7A6F66' }}>
                    {partner.description}
                  </p>
                  {partner.website !== '#' ? (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center group/link p-0 h-auto hover:underline"
                      style={{ color: '#A68F59' }}
                    >
                      {language === 'fr' ? 'En savoir plus' : 'Learn more'}
                      <ExternalLink className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  ) : (
                    <Button
                      variant="ghost"
                      className="group/link p-0 h-auto"
                      style={{ color: '#A68F59' }}
                    >
                      {language === 'fr' ? 'En savoir plus' : 'Learn more'}
                      <ExternalLink className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 relative overflow-hidden" style={{ backgroundColor: '#0E0E0E' }}>
        {/* Ambient gold radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(166,143,89,0.18) 0%, transparent 70%)',
        }} />
        {/* Subtle warm arc — top */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 40% at 50% -10%, rgba(177,100,59,0.12) 0%, transparent 70%)',
        }} />
        {/* Fine grain dot texture */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle, #A68F59 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }} />

        {/* Horizontal gold rule */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #A68F59, transparent)' }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-12" style={{ backgroundColor: '#A68F59' }} />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: '#A68F59', fontFamily: 'var(--font-brand)' }}>
                {language === 'fr' ? 'Rejoignez le Mouvement' : 'Join the Movement'}
              </span>
              <div className="h-px w-12" style={{ backgroundColor: '#A68F59' }} />
            </div>

            <h2 className="text-4xl md:text-6xl mb-6 leading-tight" style={{ color: '#F5F1EB', fontFamily: 'var(--font-display)' }}>
              {language === 'fr'
                ? <>Prêt à Faire Partie de<br /><em style={{ color: '#A68F59' }}>Quelque Chose de Spécial?</em></>
                : <>Ready to Be Part of<br /><em style={{ color: '#A68F59' }}>Something Special?</em></>}
            </h2>

            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(245,241,235,0.65)', fontFamily: 'var(--font-body)' }}>
              {language === 'fr'
                ? 'Rejoignez CREOVA aujourd\'hui et déverrouillez un monde de créativité, communauté et culture.'
                : 'Join CREOVA today and unlock a world of creativity, community, and culture.'}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-10 py-6 rounded-xl text-base font-semibold group"
                style={{ backgroundColor: '#A68F59', color: '#121212' }}
              >
                {language === 'fr' ? 'Commencer Gratuitement' : 'Start Free'}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => navigate('/shop')}
                className="px-10 py-6 rounded-xl text-base font-semibold border"
                style={{
                  backgroundColor: 'transparent',
                  color: '#F5F1EB',
                  borderColor: 'rgba(245,241,235,0.25)',
                }}
              >
                {language === 'fr' ? 'Magasiner SEEN' : 'Shop SEEN'}
              </Button>
            </div>

            <p className="mt-8 text-xs tracking-widest uppercase" style={{ color: 'rgba(245,241,235,0.3)', fontFamily: 'var(--font-brand)' }}>
              {language === 'fr'
                ? 'Aucune carte de crédit requise pour l\'adhésion Communauté'
                : 'No credit card required for Community membership'}
            </p>
          </motion.div>
        </div>

        {/* Bottom gold rule */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #A68F59, transparent)' }} />
      </section>

      {/* Land Acknowledgment */}
      <section className="py-16" style={{ backgroundColor: '#121212' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl mb-6" style={{ color: '#A68F59' }}>
              {language === 'fr' ? 'Reconnaissance du Territoire' : 'Land Acknowledgment'}
            </h2>
            <div className="w-16 h-1 mx-auto mb-8 rounded-full" style={{ backgroundColor: '#B1643B' }}></div>
            <div className="leading-relaxed text-lg space-y-4" style={{ color: '#E3DCD3' }}>
              <p>
                {language === 'fr'
                  ? 'Nous reconnaissons que le territoire sur lequel nous nous réunissons est le territoire traditionnel des peuples Haudenosaunee et Anishinaabe, dont beaucoup continuent de vivre et de travailler ici aujourd\'hui. Ce territoire est couvert par les traités du Haut-Canada et se trouve dans les terres protégées par l\'accord Wampum du Plat à Une Cuillère.'
                  : 'We acknowledge that the land on which we gather is the traditional territory of the Haudenosaunee and Anishinaabe peoples, many of whom continue to live and work here today. This territory is covered by the Upper Canada Treaties and is within the land protected by the Dish With One Spoon Wampum agreement.'}
              </p>
              <p>
                {language === 'fr'
                  ? 'Aujourd\'hui, le foyer de nombreux peuples des Premières Nations, Métis et Inuits est également notre foyer. Nous reconnaissons les sacrifices faits, forcés et librement consentis, par les peuples autochtones du Canada dans la formation du pays que nous appelons notre foyer.'
                  : 'Today, the home to many First Nations, Métis, and Inuit peoples is home to us too. We acknowledge the sacrifices made, forced and freely, by the Indigenous peoples of Canada in the formation of the country we call our home.'}
              </p>
              <p style={{ color: '#F5F1EB' }}>
                {language === 'fr'
                  ? 'Alors que nous reconnaissons leurs contributions continues et leur présence ainsi que la nôtre sur cette terre, nous nous engageons à répondre à la Commission de vérité et réconciliation et à notre relation avec les peuples autochtones.'
                  : 'As we acknowledge their continued contributions and their presence and ours upon this land, we are committed to being responsive to the Truth and Reconciliation Commission and to our relationship with Indigenous peoples.'}
              </p>
            </div>
            <div className="mt-8 pt-8 border-t" style={{ borderColor: 'rgba(166, 143, 89, 0.3)' }}>
              <p className="text-sm" style={{ color: '#7A6F66' }}>
                {language === 'fr'
                  ? '🌿 Avec respect, gratitude et engagement envers la réconciliation'
                  : '🌿 With respect, gratitude, and commitment to reconciliation'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}