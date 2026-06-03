import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { PageSEO } from '../components/PageSEO';
import { useNavigate, Link } from 'react-router';
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
import { toast } from 'sonner';
import { useState } from 'react';
import { Input } from '../components/ui/input';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { SplitText } from '../components/SplitText';
import { Magnetic } from '../components/Magnetic';

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
      color: '#F5F1EB',
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
    <div className="overflow-x-hidden" style={{ backgroundColor: '#0A0A0A' }}>
      <PageSEO
        title={t('community.title')}
        description="Join the CREOVA community — a home for BIPOC creatives, entrepreneurs, and cultural storytellers across Canada. Connect, collaborate, and grow."
      />

      {/* Hero Section — Asymmetric Editorial */}
      <section className="relative overflow-hidden min-h-[90vh] flex flex-col justify-center pt-24" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="crosshair-guides" />
        <div className="guide-ring hidden md:block" style={{ width: '40vw', height: '40vw', top: '40%', left: '50%', transform: 'translate(-50%,-50%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-0 items-center">
            {/* Left: headline + description */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="py-12 pr-0 lg:pr-16"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-px" style={{ backgroundColor: '#A68F59' }} />
                <span className="mono-label">
                  {language === 'fr' ? 'Bienvenue' : 'Welcome'}
                </span>
              </div>
              <SplitText 
                text={language === 'fr' ? 'Notre' : 'Our'}
                className="display-hero block mb-0"
                style={{ color: '#F5F1EB' }}
                delay={0.2}
              />
              <SplitText 
                text={language === 'fr' ? 'Communauté.' : 'Community.'}
                className="display-hero block mb-8 text-gold-gradient"
                delay={0.4}
              />
              <p className="text-base sm:text-lg leading-relaxed max-w-lg mt-6" style={{ color: '#C8C0B8' }}>
                {language === 'fr'
                  ? 'Une agence créative transformant des idées en expériences captivantes et une communauté culturelle célébrant l\'excellence créative BIPOC'
                  : 'A creative agency transforming ideas into engaging experiences and a cultural movement celebrating BIPOC creative excellence'}
              </p>
            </motion.div>

            {/* Right: community stat tiles */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="py-16 pl-0 lg:pl-12 grid grid-cols-2 gap-4"
            >
              {[
                { value: '5+', label: language === 'fr' ? 'Communautés' : 'Communities', icon: Users },
                { value: '50+', label: language === 'fr' ? 'Projets' : 'Projects', icon: Award },
                { value: 'BIPOC', label: language === 'fr' ? 'Dirigée' : 'Led', icon: Heart },
                { value: 'ON', label: language === 'fr' ? 'Canada' : 'Canada', icon: Star },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                  className="p-6 rounded-2xl flex flex-col gap-4 relative group overflow-hidden"
                  style={{ backgroundColor: '#121212', border: '1px solid rgba(166,143,89,0.14)' }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                    background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(166,143,89,0.08) 0%, transparent 70%)',
                  }} />
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(166,143,89,0.1)', border: '1px solid rgba(166,143,89,0.2)' }}>
                    <stat.icon className="w-4 h-4" style={{ color: '#A68F59' }} />
                  </div>
                  <div>
                    <div className="display-grotesk text-3xl mb-1" style={{ color: '#F5F1EB', textTransform: 'none' }}>{stat.value}</div>
                    <div className="mono-label" style={{ color: '#9A9088' }}>{stat.label}</div>
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: '#A68F59', opacity: 0.3 }} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#0E0E0E' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 80% at 50% 50%, rgba(166,143,89,0.05) 0%, transparent 70%)',
        }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-5 mb-8">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.4)' }} />
              <p className="mono-label">Mission</p>
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.4)' }} />
            </div>
            <h2 className="display-grotesk text-3xl md:text-5xl mb-10" style={{ color: '#F5F1EB' }}>
              {language === 'fr' ? 'Notre Mission' : 'Our Mission'}
            </h2>
            <div className="space-y-8 text-lg sm:text-xl leading-relaxed" style={{ color: '#C8C0B8' }}>
              <p>
                {language === 'fr'
                  ? 'Chez CREOVA, nous sommes passionnés par donner vie à votre marque à travers une création de contenu exceptionnelle. Nous ne capturons pas seulement des moments; nous créons des expériences qui génèrent de l\'engagement et laissent une impression durable.'
                  : 'At CREOVA, we\'re passionate about bringing your brand to life through exceptional content creation. We don\'t just capture moments; we craft experiences that drive engagement and leave a lasting impression.'}
              </p>
              <p style={{ color: '#9A9088' }}>
                {language === 'fr'
                  ? 'Que ce soit de la photographie d\'événements, de la vidéographie, de la gestion de marque ou de la gestion des médias sociaux, notre équipe d\'experts est là pour vous aider à raconter votre histoire unique et à élever la présence en ligne de votre marque.'
                  : 'Whether it\'s event photography, videography, brand management, or social media management, our expert team is here to help you tell your unique story and elevate your brand\'s online presence.'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#121212', borderTop: '1px solid rgba(166,143,89,0.1)', borderBottom: '1px solid rgba(166,143,89,0.1)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(166,143,89,0.06) 0%, transparent 65%)'
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-5 mb-5">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="mono-label">Services</p>
            </div>
            <h2 className="display-grotesk text-4xl sm:text-5xl" style={{ color: '#F5F1EB' }}>
              {language === 'fr' ? 'Ce Que Nous Faisons' : 'What We Do'}
            </h2>
            <p className="text-base sm:text-lg mt-4 max-w-2xl" style={{ color: '#9A9088' }}>
              {language === 'fr'
                ? 'Services créatifs complets qui donnent vie à votre vision'
                : 'Comprehensive creative services that bring your vision to life'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <RevealOnScroll key={index} mode='3d' delay={index * 0.1}>
                <div
                  className="p-8 rounded-2xl transition-all duration-300 h-full flex flex-col group"
                  style={{ border: '1px solid rgba(166,143,89,0.14)', backgroundColor: '#0A0A0A' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(166,143,89,0.4)';
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(166,143,89,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(166,143,89,0.14)';
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#0A0A0A';
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                    style={{ border: '1px solid rgba(166,143,89,0.3)', backgroundColor: 'rgba(166,143,89,0.1)' }}
                  >
                    <service.icon className="w-5 h-5" style={{ color: '#A68F59' }} />
                  </div>
                  <div style={{ height: '1px', width: '24px', backgroundColor: 'rgba(166,143,89,0.4)', marginBottom: '20px' }} />
                  <h3 className="display-grotesk text-xl mb-3" style={{ color: '#F5F1EB', textTransform: 'none', letterSpacing: '0' }}>{service.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#C8C0B8' }}>{service.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* The Vision */}
      <section className="py-32" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div style={{ height: '1px', width: '32px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
                <p className="mono-label">Vision</p>
              </div>
              <h2 className="display-grotesk text-3xl sm:text-5xl mb-8 leading-tight" style={{ color: '#F5F1EB' }}>
                {language === 'fr'
                  ? 'Autonomiser les Voix. Amplifier l\'Impact.'
                  : 'Empowering Voices. Amplifying Impact.'}
              </h2>
              <div className="space-y-6 text-base sm:text-lg leading-relaxed" style={{ color: '#C8C0B8' }}>
                <p>
                  {language === 'fr'
                    ? 'En combinant créativité, stratégie et impact, CREOVA n\'est pas juste un service—c\'est une plateforme qui permet aux marques et aux individus de transformer leur vision en réalité.'
                    : 'By combining creativity, strategy, and impact, CREOVA is not just a service—it\'s a platform that empowers brands and individuals to turn their vision into reality.'}
                </p>
                <p style={{ color: '#9A9088' }}>
                  {language === 'fr'
                    ? 'Notre vision est de créer un impact durable à travers les industries par l\'expression créative et la collaboration, tout en construisant des ponts entre les créatifs BIPOC mondialement à travers des partenariats de la diaspora et des échanges culturels.'
                    : 'Our vision is to create lasting impact across industries through creative expression and collaboration, while building bridges between BIPOC creatives globally through diaspora partnerships and cultural exchange.'}
                </p>
              </div>
              
              <Magnetic strength={0.2}>
                <Button 
                  className="mt-10 rounded-full px-8 py-6 group text-base"
                  style={{ backgroundColor: '#F5F1EB', color: '#0A0A0A' }}
                  asChild
                >
                  <Link to="/services" className="flex items-center gap-2">
                    {language === 'fr' ? 'Explorer nos services' : 'Explore Services'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </Magnetic>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden" style={{ border: '1px solid rgba(166,143,89,0.2)' }}>
                <img 
                  src="/photo-beyond-agency.jpg" 
                  alt="CREOVA Vision" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 50%)' }} />
              </div>
              <div 
                className="absolute -bottom-8 -left-8 p-8 rounded-2xl max-w-xs hidden sm:block"
                style={{ backgroundColor: '#121212', border: '1px solid rgba(166,143,89,0.2)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Star className="w-5 h-5" style={{ color: '#A68F59' }} />
                  <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: '#F5F1EB' }}>Excellence</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#9A9088' }}>
                  {language === 'fr'
                    ? 'Engagés à livrer une qualité premium et une narration authentique pour chaque client.'
                    : 'Committed to delivering premium quality and authentic storytelling for every client.'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Partners */}
      <section className="py-32 relative" style={{ backgroundColor: '#0E0E0E' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div style={{ height: '1px', width: '32px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="mono-label">Network</p>
              <div style={{ height: '1px', width: '32px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
            </div>
            <h2 className="display-grotesk text-3xl sm:text-5xl mb-6" style={{ color: '#F5F1EB' }}>
              {language === 'fr' ? 'Nos Partenaires Communautaires' : 'Our Community Partners'}
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: '#9A9088' }}>
              {language === 'fr'
                ? 'De fières collaborations avec des organisations qui partagent notre engagement envers l\'excellence, l\'équité et l\'avancement communautaire.'
                : 'Proud collaborations with organizations that share our commitment to excellence, equity, and community advancement.'}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {communityPartners.map((partner, index) => (
              <RevealOnScroll key={index} delay={index * 0.1}>
                <div 
                  className="flex flex-col h-full rounded-3xl overflow-hidden group"
                  style={{ backgroundColor: '#121212', border: '1px solid rgba(166,143,89,0.15)' }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={partner.image} 
                      alt={partner.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ objectPosition: partner.objectPosition }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                    <div className="absolute top-4 left-4 flex flex-col gap-1">
                      <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full backdrop-blur-md"
                        style={{ backgroundColor: 'rgba(10,10,10,0.6)', color: '#F5F1EB', border: '1px solid rgba(166,143,89,0.3)' }}>
                        {partner.badge}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="display-grotesk text-2xl mb-4" style={{ color: '#F5F1EB', textTransform: 'none', letterSpacing: '0' }}>{partner.name}</h3>
                    <p className="text-sm leading-relaxed mb-8 flex-1" style={{ color: '#C8C0B8' }}>{partner.description}</p>
                    
                    {partner.website && partner.website !== '#' && (
                      <a 
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-semibold transition-colors mt-auto"
                        style={{ color: '#A68F59' }}
                      >
                        {language === 'fr' ? 'Visiter le site' : 'Visit Website'}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers Section */}
      <section className="py-32 relative" style={{ backgroundColor: '#0A0A0A', borderTop: '1px solid rgba(166,143,89,0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div style={{ height: '1px', width: '32px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="mono-label">Memberships</p>
              <div style={{ height: '1px', width: '32px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
            </div>
            <h2 className="display-grotesk text-3xl sm:text-5xl mb-6" style={{ color: '#F5F1EB' }}>
              {language === 'fr' ? 'Rejoignez le Mouvement' : 'Join the Movement'}
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: '#9A9088' }}>
              {language === 'fr'
                ? 'Choisissez votre niveau d\'accès. Des ressources communautaires gratuites aux expériences créatives premium.'
                : 'Choose your level of access. From free community resources to premium creative experiences.'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <RevealOnScroll key={tier.id} delay={index * 0.1} mode="slide-up">
                <div 
                  className={`relative flex flex-col h-full rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 group`}
                  style={{ 
                    backgroundColor: tier.id === 'creator' ? 'rgba(177,100,59,0.05)' : '#121212',
                    border: `1px solid ${tier.id === 'creator' ? 'rgba(177,100,59,0.3)' : 'rgba(166,143,89,0.15)'}`
                  }}
                >
                  {tier.id === 'creator' && (
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ backgroundColor: '#B1643B' }} />
                  )}
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(245,241,235,0.05)', border: `1px solid ${tier.color}40` }}>
                      <tier.icon className="w-6 h-6" style={{ color: tier.color }} />
                    </div>
                    <div>
                      <h3 className="display-grotesk text-2xl" style={{ color: '#F5F1EB', textTransform: 'none', letterSpacing: '0' }}>{tier.name}</h3>
                      <p className="text-sm uppercase tracking-widest font-semibold mt-1" style={{ color: tier.color }}>{tier.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="mb-8 pb-8 border-b" style={{ borderColor: 'rgba(166,143,89,0.1)' }}>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-4xl font-light tracking-tight" style={{ color: '#F5F1EB' }}>{tier.price}</span>
                    </div>
                    {tier.priceAnnual && (
                      <p className="text-sm" style={{ color: '#9A9088' }}>{tier.priceAnnual}</p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-10 flex-1">
                    {tier.perks.map((perk, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: tier.color }} />
                        <span className="text-sm leading-relaxed" style={{ color: '#C8C0B8' }}>{perk}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    {tier.available ? (
                      <div className="space-y-3">
                        <Input 
                          type="email" 
                          placeholder={language === 'fr' ? 'Votre adresse email' : 'Your email address'}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="rounded-xl"
                          style={{ backgroundColor: 'rgba(245,241,235,0.05)', borderColor: 'rgba(166,143,89,0.2)', color: '#F5F1EB' }}
                        />
                        <Button 
                          className="w-full rounded-xl py-6 text-sm font-semibold uppercase tracking-wider"
                          style={{ backgroundColor: '#F5F1EB', color: '#0A0A0A' }}
                          onClick={handleJoinCommunity}
                        >
                          {language === 'fr' ? 'Rejoindre Gratuitement' : 'Join for Free'}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-4 justify-center">
                          <Clock className="w-4 h-4" style={{ color: '#9A9088' }} />
                          <span className="text-sm font-medium uppercase tracking-wider" style={{ color: '#9A9088' }}>{tier.launchDate}</span>
                        </div>
                        <Input 
                          type="email" 
                          placeholder={language === 'fr' ? 'Soyez notifié du lancement' : 'Get notified on launch'}
                          value={notifyEmails[tier.id]}
                          onChange={(e) => setNotifyEmails(prev => ({ ...prev, [tier.id]: e.target.value }))}
                          className="rounded-xl"
                          style={{ backgroundColor: 'rgba(245,241,235,0.05)', borderColor: 'rgba(166,143,89,0.2)', color: '#F5F1EB' }}
                        />
                        <Button 
                          className="w-full rounded-xl py-6 text-sm font-semibold uppercase tracking-wider transition-all duration-300"
                          style={{ 
                            backgroundColor: 'transparent', 
                            color: tier.color, 
                            border: `1px solid ${tier.color}`,
                          }}
                          onClick={() => handleNotifyMeLaunch(tier.id)}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? '...' : (language === 'fr' ? 'M\'avertir' : 'Notify Me')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
