import { useState, useMemo } from 'react';
import { useNavigate, Link } from '../i18n/LocaleLink';
import { PageSEO } from '../components/PageSEO';
import { Button } from '../components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Users, Package, PartyPopper, Plane, TrendingUp, Palette, Video, Settings, AlertCircle, Calendar, ArrowRight } from 'lucide-react';
import { useGalleries } from '../hooks/useGalleries';
import { useLanguage } from '../context/LanguageContext';

type ServiceCategory = 'photography' | 'video' | 'brand' | 'social' | 'events' | 'rental' | 'all';

export function ServicesPage() {
  const [activeTab, setActiveTab] = useState<ServiceCategory>('all');
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const navigate = useNavigate();
  const { galleries } = useGalleries();
  const { language } = useLanguage();
  // Services is a commercial page → vous register (see mixed-register decision).
  const fr = language === 'fr';

  const recentGalleries = useMemo(() => {
    // Locked collections don't preview well as a teaser — prefer public ones, unlocked first
    return [...galleries]
      .sort((a, b) => (b.date || `${b.year}-01-01`).localeCompare(a.date || `${a.year}-01-01`))
      .filter(g => !g.locked)
      .slice(0, 6);
  }, [galleries]);

  const tabs = [
    { id: 'all' as ServiceCategory, label: fr ? 'Tous les services' : 'All Services', icon: Settings },
    { id: 'photography' as ServiceCategory, label: fr ? 'Photographie' : 'Photography', icon: Camera },
    { id: 'video' as ServiceCategory, label: fr ? 'Vidéo et drone' : 'Video & Drone', icon: Video },
    { id: 'brand' as ServiceCategory, label: fr ? 'Image de marque' : 'Branding & Design', icon: Palette },
    { id: 'social' as ServiceCategory, label: fr ? 'Médias sociaux' : 'Social Media', icon: TrendingUp },
    { id: 'events' as ServiceCategory, label: fr ? 'Événements' : 'Events', icon: PartyPopper },
    { id: 'rental' as ServiceCategory, label: fr ? "Location d'équipement" : 'Equipment Rental', icon: Package }
  ];

  const services = [
    {
      id: 'family-portraits',
      category: 'photography' as ServiceCategory,
      icon: Users,
      title: fr ? 'Photographie de portraits de famille' : 'Family Portrait Photography',
      description: fr ? "Immortalisez l'héritage de votre famille avec des portraits soignés, ancrés dans votre culture." : 'Capture your family\'s legacy with culturally informed, beautifully crafted portraits.',
      packages: [
        { name: fr ? 'Petits souvenirs' : 'Mini Memories', tagline: fr ? 'La première impression parfaite' : 'Perfect first impression', features: fr ? ['Séance de 45 minutes', '10 photos retouchées', "Jusqu'à 5 membres de la famille", 'Livraison par galerie en ligne'] : ['45-minute session', '10 edited photos', 'Up to 5 family members', 'Online gallery delivery'] },
        { name: fr ? 'Liens intemporels' : 'Timeless Bonds', tagline: fr ? "L'histoire de votre famille, magnifiquement racontée" : "Your family's story, beautifully told", features: fr ? ['Séance de 1 h 30', '25 photos retouchées', "Jusqu'à 10 membres de la famille", "Droits d'impression inclus"] : ['1.5-hour session', '25 edited photos', 'Up to 10 family members', 'Print release included'] },
        { name: fr ? 'Héritage vivant' : 'Legacy Heirloom', tagline: fr ? 'Des moments qui traversent les générations' : 'Generational moments, forever preserved', features: fr ? ['Séance de 2 heures', '40+ photos retouchées', "Jusqu'à 15 membres de la famille", 'Album personnalisé en option'] : ['2-hour session', '40+ edited photos', 'Up to 15 family members', 'Custom album option'] }
      ]
    },
    {
      id: 'brand-photography',
      category: 'photography' as ServiceCategory,
      icon: Camera,
      title: fr ? 'Photographie de marque et portraits corporatifs' : 'Brand Photography & Headshots',
      description: fr ? 'Portraits corporatifs et photographie de marque professionnels pour les entrepreneurs et les équipes.' : 'Professional headshots and brand photography for entrepreneurs and teams.',
      packages: [
        { name: fr ? 'Profil Pro' : 'Profile Pro', tagline: fr ? 'Une autorité nette pour votre équipe' : 'Clean authority for your team', features: fr ? ['Séance de 1 h à 1 h 30', "Jusqu'à 10 membres de l'équipe", '1 portrait retouché chacun', 'Arrière-plans neutres ou de marque'] : ['1-1.5 hour session', 'Up to 10 team members', '1 retouched headshot each', 'Neutral or branded backgrounds'] },
        { name: fr ? "Histoires d'équipe" : 'Workspace Stories', tagline: fr ? 'Votre culture, captée avec authenticité' : 'Culture captured authentically', features: fr ? ['Séance de 2 heures', "Jusqu'à 15 membres de l'équipe", '20+ images retouchées', 'Prises spontanées et posées'] : ['2-hour session', 'Up to 15 team members', '20+ edited images', 'Candid + posed shots'] },
        { name: fr ? 'Suite Vision de marque' : 'Brand Vision Suite', tagline: fr ? "Tout l'univers de votre marque en une séance" : 'Full brand world in one session', features: fr ? ['Couverture de 3 à 4 heures', '50+ photos sélectionnées', "Photos d'équipe et de culture", 'Vidéo de 1 min en option (+300 $)'] : ['3-4 hours coverage', '50+ curated photos', 'Team + culture shots', 'Optional 1-min video (+$300)'] }
      ]
    },
    {
      id: 'product-photography',
      category: 'photography' as ServiceCategory,
      icon: Package,
      title: fr ? 'Photographie de produits' : 'Product Photography',
      description: fr ? 'Du contenu stratégique qui aide votre produit à se vendre et à parler de lui-même.' : 'Strategic content that helps your product sell and speak for itself.',
      packages: [
        { name: fr ? 'Essentiels e-commerce' : 'E-commerce Essentials', tagline: fr ? 'Des produits qui se vendent seuls' : 'Products that sell themselves', features: fr ? ['15 photos de produits stylisées', 'Fond blanc et mise en situation', 'Retouche et correction des couleurs de base', 'Fichiers optimisés pour le web', 'Licence commerciale incluse'] : ['15 styled product photos', 'White background + lifestyle', 'Basic retouching & color correction', 'Web-optimized files', 'Commercial license included'] },
        { name: fr ? 'Trousse Produit Pro' : 'Product Pro Kit', tagline: fr ? 'Du contenu qui convertit' : 'Content that converts', features: fr ? ['25 photos de produits stylisées', 'Vidéo produit de 1 minute', 'Prises en studio et en situation', 'Retouche avancée', 'Licence commerciale incluse', 'Formats pour médias sociaux'] : ['25 styled product photos', '1-minute product video', 'Studio + lifestyle shots', 'Advanced retouching', 'Commercial license included', 'Social media formats'] },
        { name: fr ? 'Collection Lifestyle' : 'Lifestyle Collection', tagline: fr ? 'Une présence de marque haut de gamme' : 'Premium brand presence', features: fr ? ['40+ photos de produits', 'Vidéo produit de 2 à 3 minutes', 'Plusieurs mises en situation', 'Retouche haut de gamme', 'Droits commerciaux complets', 'Livraison accélérée disponible'] : ['40+ product photos', '2-3 minute product video', 'Multiple lifestyle settings', 'Premium retouching', 'Full commercial rights', 'Rush delivery available'] }
      ]
    },
    {
      id: 'aerial-drone',
      category: 'video' as ServiceCategory,
      icon: Plane,
      title: fr ? 'Photographie aérienne et par drone' : 'Aerial & Drone Photography',
      description: fr ? 'Des perspectives cinématographiques qui élèvent votre marque, vue du ciel.' : 'Cinematic perspectives that elevate your brand from above.',
      packages: [
        { name: fr ? 'Séance Vision aérienne' : 'Aerial Vision Session', tagline: fr ? "Une perspective qui capte l'attention" : 'Perspective that commands attention', features: fr ? ['Séance de drone de 1 heure', '20+ photos aériennes', 'Vidéo cinématographique de 30 à 60 s', 'Étalonnage des couleurs de base', 'Licencié et assuré'] : ['1-hour drone session', '20+ aerial photos', '30-60 sec cinematic video', 'Basic colour grading', 'Licensed & insured'] },
        { name: fr ? 'Expérience cinématographique aérienne' : 'Aerial Cinematic Experience', tagline: fr ? 'La narration cinématographique, vue du ciel' : 'Cinematic storytelling from above', features: fr ? ['Séance avancée de 2 heures', '40+ photos haut de gamme', 'Bobine cinématographique de 1 à 2 min', 'Conception sonore incluse', 'Étalonnage des couleurs avancé', 'Licencié et assuré'] : ['2-hour advanced session', '40+ premium photos', '1-2 min cinematic reel', 'Sound design included', 'Advanced colour grading', 'Licensed & insured'] }
      ]
    },
    {
      id: 'videography',
      category: 'video' as ServiceCategory,
      icon: Video,
      title: fr ? 'Vidéographie et création de contenu' : 'Videography & Content Creation',
      description: fr ? "Production vidéo professionnelle pour les marques, les événements et les campagnes marketing." : 'Professional video production for brands, events, and marketing campaigns.',
      packages: [
        { name: fr ? 'Départ' : 'Starter', tagline: fr ? "D'abord les réseaux, toujours la marque" : 'Social-first, brand-forward', features: fr ? ['2 heures de tournage', '1 à 2 vidéos courtes', 'Montage de base', 'Prêtes pour les médias sociaux'] : ['2 hours shoot time', '1-2 short-form videos', 'Basic editing', 'Social media ready'] },
        { name: fr ? 'Créateur' : 'Creator', tagline: fr ? 'Un moteur de contenu pour votre croissance' : 'Content engine for growth', features: fr ? ['4 heures de tournage', '3 à 5 vidéos courtes', 'Optimisation pour les médias sociaux', 'Musique et sous-titres inclus'] : ['4 hours shoot time', '3-5 short-form videos', 'Social media optimization', 'Music & captions included'] },
        { name: fr ? 'Pro' : 'Pro', tagline: fr ? 'Le film phare de votre marque' : 'Flagship brand film', features: fr ? ['8 heures de tournage', '1 vidéo longue (2 à 3 min)', '5 à 7 clips courts', 'Étalonnage des couleurs professionnel'] : ['8 hours shoot time', '1 long-form video (2-3 min)', '5-7 short-form clips', 'Professional color grading'] },
        { name: fr ? 'Campagne' : 'Campaign', tagline: fr ? 'Production complète, de A à Z' : 'Full production, end-to-end', features: fr ? ['2+ jours de production', 'Campagne multi-vidéos', 'Scénarimage et scénarisation', 'Révisions illimitées'] : ['2+ days production', 'Multi-video campaign', 'Storyboarding & scripting', 'Unlimited revisions'] }
      ],
      addOns: [
        { name: fr ? 'Lieu supplémentaire' : 'Extra location', price: '$150-$250' },
        { name: fr ? 'Vidéos supplémentaires' : 'Extra videos', price: fr ? '100 $/vidéo' : '$100/video' }
      ]
    },
    {
      id: 'event-coverage',
      category: 'events' as ServiceCategory,
      icon: PartyPopper,
      title: fr ? "Couverture d'événements" : 'Event Coverage',
      description: fr ? 'Mariages, événements culturels, cérémonies et célébrations captés avec soin.' : 'Weddings, cultural events, ceremonies, and celebrations captured beautifully.',
      packages: [
        { name: fr ? 'Forfait Essence' : 'Essence Package', tagline: fr ? 'Chaque moment clé capté' : 'Every key moment captured', features: fr ? ['3 heures de couverture', '50+ images ou vidéo de 2 à 3 min', '1 lieu', 'Galerie en ligne'] : ['3 hours coverage', '50+ images or 2-3 min video', '1 location', 'Online gallery'] },
        { name: fr ? 'Récit Signature' : 'Signature Story', tagline: fr ? 'Le récit complet, magnifiquement monté' : 'Full narrative, beautifully cut', features: fr ? ['6 heures de couverture hybride', '100+ images', 'Film de moments forts de 3 à 5 min', 'Plusieurs lieux'] : ['6 hours hybrid coverage', '100+ images', '3-5 min highlight film', 'Multi-location'] },
        { name: fr ? 'Expérience Héritage' : 'Heritage Experience', tagline: fr ? "Une documentation cinématographique de l'héritage" : 'Cinematic legacy documentation', features: fr ? ['8 à 10 heures de couverture', '200+ images', 'Film cinématographique de 5 à 7 min', 'Images par drone incluses'] : ['8-10 hours coverage', '200+ images', '5-7 min cinematic film', 'Drone footage included'] }
      ]
    },
    {
      id: 'social-media',
      category: 'social' as ServiceCategory,
      icon: TrendingUp,
      title: fr ? 'Gestion des médias sociaux' : 'Social Media Management',
      description: fr ? 'Des médias sociaux stratégiques, créatifs et constants pour les marques culturelles.' : 'Strategic, creative, and consistent social media for cultural brands.',
      packages: [
        { name: fr ? 'Forfait Départ' : 'Starter Plan', tagline: fr ? 'Une présence constante, zéro stress' : 'Consistent presence, zero stress', features: fr ? ['12 publications sélectionnées', '1 plateforme', '1 appel stratégique/mois', 'Statistiques de base'] : ['12 curated posts', '1 platform', '1 strategy call/month', 'Basic analytics'] },
        { name: fr ? 'Forfait Croissance' : 'Growth Plan', tagline: fr ? "Une communauté bâtie, un engagement maîtrisé" : 'Community built, engagement owned', features: fr ? ['20+ publications', '1 à 2 plateformes', "Gestion de l'engagement", 'Rapports statistiques hebdomadaires'] : ['20+ posts', '1-2 platforms', 'Engagement management', 'Weekly analytics reports'] },
        { name: fr ? 'Forfait Créateur+' : 'Creator+ Plan', tagline: fr ? 'Un partenaire de croissance à service complet' : 'Full-service growth partner', features: fr ? ['Croissance multiplateforme', 'Production de contenu complète', 'Configuration et gestion de publicités payantes', 'Gestionnaire de compte dédié'] : ['Cross-platform growth', 'Full content production', 'Paid ad setup & management', 'Dedicated account manager'] }
      ]
    },
    {
      id: 'brand-design',
      category: 'brand' as ServiceCategory,
      icon: Palette,
      title: fr ? 'Image de marque et identité' : 'Brand Design & Identity',
      description: fr ? "Des identités audacieuses et stratégiques pour les créateurs et les marques culturelles guidés par une vision." : 'Bold, strategic identities for creators and cultural brands who lead with vision.',
      packages: [
        { name: fr ? 'Trousse Essentiels de marque' : 'Brand Essentials Kit', tagline: fr ? "Trousse de départ pour votre identité" : 'Identity starter pack', features: fr ? ['3 gabarits personnalisés', 'Palette de couleurs et polices', 'Mini guide de style', 'Trousse pour médias sociaux'] : ['3 custom templates', 'Color palette + fonts', 'Mini style guide', 'Social media kit'] },
        { name: fr ? 'Identité visuelle de départ' : 'Visual Starter Identity', tagline: fr ? "Une base conçue pour évoluer" : 'Foundation built to scale', features: fr ? ['Logotype/symbole', 'Guide de marque de départ', '5 visuels de marque', 'Conception de carte professionnelle'] : ['Logo wordmark/symbol', 'Starter brand guide', '5 branded visuals', 'Business card design'] },
        { name: fr ? 'Suite Identité Signature' : 'Signature Identity Suite', tagline: fr ? "Tout l'univers de votre marque" : 'Your complete brand world', features: fr ? ['Suite de logos complète', 'Guide de marque exhaustif', "Trousse d'éléments complète", '3 mois de soutien'] : ['Full logo suite', 'Comprehensive brand guide', 'Complete asset kit', '3 months support'] }
      ]
    },
    {
      id: 'event-conference-design',
      category: 'brand' as ServiceCategory,
      icon: Calendar,
      title: fr ? "Conception d'événements et de conférences" : 'Event & Conference Design',
      description: fr ? "Des services de conception spécialisés pour les organisateurs, institutions, universités et événements corporatifs." : 'Specialized design services for organizers, institutions, universities, and corporate events.',
      packages: [
        { name: fr ? "Forfait Essentiels d'événement" : 'Event Essentials Package', tagline: fr ? 'Prêt à lancer en quelques jours' : 'Launch-ready in days', features: fr ? ["1 affiche d'événement / visuel principal", '6 visuels pour médias sociaux', '1 dépliant numérique (PNG + PDF)', "1 bannière/en-tête d'événement", "Jusqu'à 3 révisions", 'Livraison : 5 à 7 jours', 'Idéal pour petits événements et ateliers'] : ['1 Event Poster / Main Key Visual', '6 Social Media Graphics', '1 Digital Flyer (PNG + PDF)', '1 Event Banner/Header', 'Up to 3 revisions', 'Delivery: 5–7 days', 'Best for small events & workshops'] },
        { name: fr ? "Image de marque d'événement standard" : 'Standard Event Branding', tagline: fr ? 'Une présence professionnelle sur tous les canaux' : 'Professional presence across all channels', features: fr ? ["Visuel principal d'événement complet", '12 visuels pour médias sociaux', '3 affiches ou dépliants', 'Trousse promo numérique pour conférenciers', "Horaire / programme d'événement (2 à 3 pages)", 'Forfait bannières web', "Jusqu'à 5 révisions", 'Livraison : 7 à 10 jours'] : ['Full Event Key Visual', '12 Social Media Graphics', '3 Posters or Flyers', 'Digital Promo Kit for Speakers', 'Event Schedule / Program (2–3 pages)', 'Web Banner Package', 'Up to 5 revisions', 'Delivery: 7–10 days'] },
        { name: fr ? "Suite Identité d'événement complète" : 'Full Event Identity Suite', tagline: fr ? "Une conception d'événement immersive, de A à Z" : 'Immersive, end-to-end event design', features: fr ? ["Consultation en image de marque d'événement", 'Visuel principal sur mesure', '20 visuels pour médias sociaux', "Livret de programme d'événement (6 à 10 pages)", 'Visuels de scène (4 à 6 diapositives)', 'Ensemble de bannières web', "Jusqu'à 7 révisions", 'Livraison : 2 à 3 semaines'] : ['Event Branding Consultation', 'Custom Hero Key Visual', '20 Social Media Graphics', 'Event Program Booklet (6–10 pages)', 'Stage Graphics (4–6 slides)', 'Web Banner Set', 'Up to 7 revisions', 'Delivery: 2–3 weeks'] }
      ]
    },
    {
      id: 'event-design-retainer',
      category: 'brand' as ServiceCategory,
      icon: Calendar,
      title: fr ? "Forfait mensuel de conception d'événements" : 'Event Design Retainer',
      description: fr ? "Soutien mensuel en conception pour les universités, organisations et entreprises ayant des événements réguliers." : 'Monthly design support for universities, organizations & companies with ongoing events.',
      packages: [
        { name: fr ? 'Départ' : 'Starter', tagline: fr ? 'Un soutien en conception en continu' : 'Always-on design support', features: fr ? ['6 visuels/mois', '1 affiche/dépliant', 'Délai de 48 à 72 h', 'Parfait pour les petites organisations'] : ['6 graphics/month', '1 poster/flyer', '48–72h turnaround', 'Perfect for small organizations'] },
        { name: fr ? 'Croissance' : 'Growth', tagline: fr ? 'Une file prioritaire, livrée avec fiabilité' : 'Priority pipeline, reliably delivered', features: fr ? ['12 visuels/mois', '2 affiches/dépliants', 'Séance stratégique mensuelle', 'Livraison prioritaire', 'Pour les organisations de taille moyenne'] : ['12 graphics/month', '2 posters/flyers', 'Monthly strategy session', 'Priority delivery', 'For mid-size organizations'] },
        { name: fr ? 'Premium' : 'Premium', tagline: fr ? 'Une direction créative dédiée' : 'Dedicated creative direction', features: fr ? ["Demandes de conception d'événement illimitées", '1 projet actif à la fois', 'Soutien en direction créative', 'Suivis hebdomadaires', 'Pour les grandes institutions'] : ['Unlimited event design requests', '1 active project at a time', 'Creative direction support', 'Weekly check-ins', 'For large institutions'] }
      ]
    },
    {
      category: 'rental' as ServiceCategory,
      icon: Package,
      title: fr ? "Location d'équipement" : 'Equipment Rental',
      description: fr ? "Équipement professionnel de caméra, d'éclairage et de son pour vos projets créatifs." : 'Professional camera, lighting, and audio equipment for your creative projects.',
      packages: [
        {
          name: fr ? 'Trousse Créateur DJI Osmo' : 'DJI Osmo Creator Kit',
          capacity: fr ? 'Contenu de créateur' : 'Creator content',
          deposit: '$400',
          features: fr ? ['DJI Osmo Pocket 3 ou Action 5 Pro', 'Système de micro sans fil (2 émetteurs)', "Perche d'extension et trépied", 'Batteries et stockage supplémentaires', 'Étui de transport protecteur'] : ['DJI Osmo Pocket 3 or Action 5 Pro', 'Wireless Mic System (2x transmitters)', 'Extension Rod & Tripod', 'Extra Batteries & Storage', 'Protective Carry Case']
        },
        {
          name: fr ? 'Trousse Photographie' : 'Photography Kit',
          capacity: fr ? 'Projets de photographie' : 'Photography projects',
          deposit: '$300',
          features: fr ? ['Caméra reflex ou sans miroir', '2 à 3 objectifs (24-70 mm, 50 mm)', 'Cartes SD et batteries', 'Sac de caméra'] : ['DSLR or Mirrorless Camera', '2-3 Lenses (24-70mm, 50mm)', 'SD Cards & Batteries', 'Camera Bag']
        },
        {
          name: fr ? 'Trousse Vidéographie' : 'Videography Kit',
          capacity: fr ? 'Productions vidéo' : 'Video productions',
          deposit: '$500',
          features: fr ? ['Caméra cinéma ou reflex', 'Stabilisateur à cardan', 'Micro-canon', "Panneau d'éclairage DEL", 'Trépied et accessoires'] : ['Cinema Camera or DSLR', 'Gimbal Stabilizer', 'Shotgun Microphone', 'LED Light Panel', 'Tripod & Accessories']
        },
        {
          name: fr ? "Forfait Éclairage" : 'Lighting Package',
          capacity: fr ? 'Tournages en studio' : 'Studio shoots',
          deposit: '$200',
          features: fr ? ['2 panneaux DEL ou flashs', "Pieds d'éclairage", 'Boîtes à lumière/modificateurs', "Câbles d'alimentation et accessoires"] : ['2x LED Panels or Strobes', 'Light Stands', 'Softboxes/Modifiers', 'Power cables & accessories']
        },
        {
          name: fr ? 'Forfait Audio' : 'Audio Package',
          capacity: fr ? 'Captation audio' : 'Audio capture',
          deposit: '$150',
          features: fr ? ['Micro-cravate sans fil', 'Micro-canon', 'Enregistreur audio', 'Perche et accessoires'] : ['Wireless Lavalier Mic', 'Shotgun Microphone', 'Audio Recorder', 'Boom Pole & Accessories']
        }
      ]
    }
  ];

  const filteredServices = activeTab === 'all' 
    ? services 
    : services.filter(s => s.category === activeTab);

  return (
    <div style={{ backgroundColor: '#F5F1EB' }}>
      <PageSEO
        title="Creative Services"
        description="Professional photography, videography, brand design, social media management, and event coverage for BIPOC entrepreneurs and brands across Ontario."
      path="/services"
      />

      {/* Hero — Asymmetric editorial split */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: '#0A0A0A', minHeight: '480px' }}
      >
        {/* Warm left accent stripe */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ background: 'linear-gradient(to bottom, #A68F59, #B1643B)' }}
        />
        {/* Subtle diagonal rule */}
        <div
          className="absolute inset-0 pointer-events-none hidden lg:block"
          style={{
            background: 'linear-gradient(105deg, rgba(166,143,89,0.04) 0%, transparent 50%)'
          }}
        />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.18)' }} />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="flex flex-col lg:flex-row lg:items-end lg:gap-16">

            {/* Left: title block */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3 mb-8"
              >
                <div style={{ width: '32px', height: '1px', backgroundColor: '#A68F59' }} />
                <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>
                  {fr ? 'Histoires créatives' : 'Creative Stories'}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-light leading-none tracking-tighter"
                style={{ fontSize: 'clamp(48px, 9vw, 116px)' }}
              >
                <span className="block" style={{ color: '#F5F1EB' }}>{fr ? 'Ce qu’on' : 'What'}</span>
                <span
                  className="block"
                  style={{
                    backgroundImage: 'linear-gradient(95deg, #A68F59 0%, #E3DCD3 65%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {fr ? 'crée.' : 'We Build.'}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-6 text-base leading-relaxed max-w-sm"
                style={{ color: 'rgba(245,241,235,0.45)' }}
              >
                {fr ? "Photographie, vidéo, image de marque, médias sociaux et événements — pour les marques BIPOC partout en Ontario." : 'Photography, video, brand design, social media, and events — for BIPOC brands across Ontario.'}
              </motion.p>
            </div>

            {/* Right: category count tiles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="grid grid-cols-3 lg:grid-cols-2 gap-3 mt-12 lg:mt-0 lg:w-64 flex-shrink-0"
            >
              {[
                { icon: Camera, label: fr ? 'Photographie' : 'Photography', n: '3' },
                { icon: Video, label: fr ? 'Vidéo et drone' : 'Video & Drone', n: '2' },
                { icon: Palette, label: fr ? 'Image de marque' : 'Brand Design', n: '3' },
                { icon: TrendingUp, label: fr ? 'Médias sociaux' : 'Social Media', n: '3' },
                { icon: PartyPopper, label: fr ? 'Événements' : 'Events', n: '3' },
                { icon: Package, label: fr ? 'Location' : 'Rental', n: '5' },
              ].map(({ icon: Icon, label, n }) => (
                <div
                  key={label}
                  className="flex flex-col gap-2 p-3 rounded-xl border"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(166,143,89,0.12)' }}
                >
                  <Icon className="w-4 h-4" style={{ color: '#A68F59' }} />
                  <div className="text-lg font-light" style={{ color: '#F5F1EB' }}>{n}</div>
                  <div className="text-[9px] tracking-[0.25em] uppercase leading-tight" style={{ color: 'rgba(245,241,235,0.35)' }}>
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Category Tabs — refined */}
      <section id="services-tabs" className="sticky top-16 z-40 border-b" style={{ backgroundColor: '#0E0E0E', borderColor: 'rgba(166,143,89,0.2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-1 py-3 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  const servicesSection = document.querySelector('#services-list');
                  if (servicesSection) {
                    const offset = 150;
                    const elementPosition = servicesSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg whitespace-nowrap transition-all duration-300"
                style={{
                  backgroundColor: activeTab === tab.id ? 'rgba(166,143,89,0.15)' : 'transparent',
                  color: activeTab === tab.id ? '#A68F59' : '#4A3E36',
                  border: activeTab === tab.id ? '1px solid rgba(166,143,89,0.4)' : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.color = '#A68F59';
                    e.currentTarget.style.borderColor = 'rgba(166,143,89,0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.color = '#4A3E36';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="text-xs tracking-wide">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services List — editorial numbered list */}
      <section id="services-list" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ borderTop: '1px solid rgba(166,143,89,0.15)' }}>
            {filteredServices.map((service, index) => (
              <motion.div
                key={index}
                id={'id' in service ? service.id : undefined}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04, duration: 0.5 }}
                onMouseEnter={() => setHoveredService(index)}
                onMouseLeave={() => setHoveredService(null)}
                className="relative cursor-pointer"
                style={{ borderBottom: '1px solid rgba(166,143,89,0.15)' }}
              >
                {/* Hover wash */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-400"
                  style={{
                    background: 'linear-gradient(90deg, rgba(166,143,89,0.05) 0%, transparent 70%)',
                    opacity: hoveredService === index ? 1 : 0
                  }}
                />

                {/* Main row */}
                <div className="relative flex items-center gap-5 md:gap-10 py-7 md:py-9">
                  {/* Number */}
                  <span
                    className="text-xs tracking-[0.4em] flex-shrink-0 w-8 transition-colors duration-300"
                    style={{ color: hoveredService === index ? '#A68F59' : 'rgba(166,143,89,0.3)' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Title */}
                  <h2
                    className="flex-1 font-light tracking-tight transition-colors duration-300"
                    style={{
                      fontSize: 'clamp(1.4rem, 3vw, 2.4rem)',
                      color: hoveredService === index ? '#F5F1EB' : 'rgba(245,241,235,0.55)'
                    }}
                  >
                    {service.title}
                  </h2>

                  {/* Right: category + arrow */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span
                      className="text-[10px] tracking-[0.4em] uppercase hidden md:block transition-opacity duration-300"
                      style={{ color: '#A68F59', opacity: hoveredService === index ? 1 : 0.35 }}
                    >
                      {fr
                        ? ({ photography: 'Photographie', video: 'Vidéo', brand: 'Image de marque', social: 'Médias sociaux', events: 'Événements', rental: 'Équipement' } as Record<string, string>)[service.category]
                        : (service.category === 'rental' ? 'Equipment' : service.category)}
                    </span>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{
                        border: '1px solid rgba(166,143,89,0.25)',
                        backgroundColor: hoveredService === index ? 'rgba(166,143,89,0.12)' : 'transparent',
                        transform: hoveredService === index ? 'translateX(4px)' : 'translateX(0)'
                      }}
                    >
                      <ArrowRight className="w-3.5 h-3.5" style={{ color: '#A68F59' }} />
                    </div>
                  </div>
                </div>

                {/* Expandable: description + CTAs */}
                <AnimatePresence>
                  {hoveredService === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 pl-[3.25rem] md:pl-[4.5rem] flex flex-col sm:flex-row sm:items-center gap-5">
                        <p
                          className="text-sm leading-relaxed flex-1 max-w-xl"
                          style={{ color: 'rgba(245,241,235,0.45)' }}
                        >
                          {service.description}
                        </p>
                        <div className="flex gap-3 flex-shrink-0">
                          <Button
                            className="text-sm px-6 py-4 rounded-xl transition-all duration-300"
                            style={{ backgroundColor: 'rgba(166,143,89,0.12)', color: '#A68F59', border: '1px solid rgba(166,143,89,0.3)' }}
                            onClick={() => navigate(service.category === 'rental' ? '/rental' : `/booking${'id' in service && service.id ? `?service=${service.id}` : ''}`)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#A68F59';
                              e.currentTarget.style.color = '#121212';
                              e.currentTarget.style.borderColor = '#A68F59';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(166,143,89,0.12)';
                              e.currentTarget.style.color = '#A68F59';
                              e.currentTarget.style.borderColor = 'rgba(166,143,89,0.3)';
                            }}
                          >
                            {fr ? 'Démarrer un projet' : 'Start a Project'}
                          </Button>
                          <button
                            type="button"
                            aria-label={fr ? `Voir les forfaits pour ${service.title}` : `See packages for ${service.title}`}
                            className="text-sm px-6 py-4 rounded-xl tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A68F59]"
                            style={{ color: 'rgba(245,241,235,0.4)', border: '1px solid rgba(245,241,235,0.1)' }}
                            onClick={() => navigate('/pricing')}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.color = '#F5F1EB';
                              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,241,235,0.25)';
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.color = 'rgba(245,241,235,0.4)';
                              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,241,235,0.1)';
                            }}
                          >
                            {fr ? 'Voir les forfaits →' : 'See Packages →'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.15)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-px" style={{ backgroundColor: '#A68F59' }} />
              <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>{fr ? 'Notre façon de travailler' : 'How We Work'}</span>
            </div>
            <h2 className="text-4xl font-light tracking-tight" style={{ color: '#F5F1EB' }}>
              {fr ? "Du premier appel à la livraison finale" : 'From first call to final delivery'}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-0 relative">
            {/* Connector line desktop */}
            <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-px" style={{ backgroundColor: 'rgba(166,143,89,0.2)' }} />
            {[
              { step: '01', title: fr ? 'Découvrir' : 'Discover', desc: fr ? "On apprend à connaître votre marque, vos objectifs et votre vision lors d'un appel gratuit de 30 minutes. Sans engagement." : 'We learn your brand, goals, and vision in a free 30-minute call. No obligation.' },
              { step: '02', title: fr ? 'Créer' : 'Create', desc: fr ? "On planifie le tournage ou le sprint de conception, on exécute avec intention et on donne vie à votre histoire." : 'We plan the shoot or design sprint, execute with intent, and bring your story to life.' },
              { step: '03', title: fr ? 'Livrer' : 'Deliver', desc: fr ? "Vous recevez vos fichiers finaux — retouchés, licenciés et prêts à publier dans les délais convenus." : 'You receive your final files — edited, licensed, and ready to publish within agreed timelines.' },
              { step: '04', title: fr ? 'Grandir' : 'Grow', desc: fr ? "On reste dans votre coin. Les clients fidèles obtiennent réservation prioritaire, rabais et soutien continu." : 'We stay in your corner. Returning clients get priority booking, discounts, and ongoing support.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative text-center px-6 py-8"
              >
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center relative z-10"
                  style={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(166,143,89,0.35)' }}
                >
                  <span className="text-xs tracking-[0.25em]" style={{ color: '#A68F59' }}>{item.step}</span>
                </div>
                <h3 className="text-xl tracking-tight mb-3" style={{ color: '#F5F1EB' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7A6F66' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <Button
              size="lg"
              className="px-10 py-6 rounded-xl text-sm tracking-wide transition-all duration-300"
              style={{ backgroundColor: '#A68F59', color: '#121212' }}
              onClick={() => navigate('/contact')}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F5F1EB';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#A68F59';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {fr ? 'Réserver un appel découverte gratuit' : 'Book a Free Discovery Call'}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Marquee + Stats */}
      <section className="overflow-hidden" style={{ backgroundColor: '#0A0A0A', borderTop: '1px solid rgba(166,143,89,0.15)', borderBottom: '1px solid rgba(166,143,89,0.15)' }}>
        {/* Row 1 — scrolls left */}
        <div className="py-5 flex" style={{ borderBottom: '1px solid rgba(166,143,89,0.08)' }}>
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            className="flex gap-10 whitespace-nowrap flex-shrink-0"
          >
            {[...Array(2)].map((_, rep) => (
              <div key={rep} className="flex gap-10 items-center">
                {(fr ? ['Photographie de marque', "Couverture d'événements", 'Vision aérienne', 'Médias sociaux', 'Identité de marque', 'Photographie de produits', 'Vidéographie', 'Direction créative', 'Design graphique', "Location d'équipement"] : ['Brand Photography', 'Event Coverage', 'Aerial Vision', 'Social Media', 'Brand Identity', 'Product Photography', 'Videography', 'Creative Direction', 'Graphic Design', 'Equipment Rental']).map((item) => (
                  <span key={item} className="flex items-center gap-10">
                    <span className="text-sm tracking-[0.3em] uppercase" style={{ color: 'rgba(245,241,235,0.35)' }}>{item}</span>
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: '#A68F59' }} />
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="py-5 flex">
          <motion.div
            animate={{ x: ['-50%', '0%'] }}
            transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
            className="flex gap-10 whitespace-nowrap flex-shrink-0"
          >
            {[...Array(2)].map((_, rep) => (
              <div key={rep} className="flex gap-10 items-center">
                {(fr ? ["L'Ontario et au-delà", 'Marques BIPOC', 'Récits culturels', 'Licencié et assuré', 'Droits commerciaux inclus', 'Guidé par la stratégie', 'Sur place', 'Studio et lifestyle', 'Équipement pro', 'Qualité éditoriale'] : ['Ontario & Beyond', 'BIPOC Brands', 'Cultural Storytelling', 'Licensed & Insured', 'Commercial Rights Included', 'Strategy-Led', 'On-Location', 'Studio & Lifestyle', 'Pro Equipment', 'Editorial Quality']).map((item) => (
                  <span key={item} className="flex items-center gap-10">
                    <span className="text-sm tracking-[0.3em] uppercase italic" style={{ color: 'rgba(166,143,89,0.4)' }}>{item}</span>
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(166,143,89,0.3)' }} />
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-16" style={{ backgroundColor: '#F5F1EB', borderBottom: '1px solid rgba(18,18,18,0.08)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
            {[
              { n: '10+', label: fr ? 'Services offerts' : 'Services offered' },
              { n: '3', label: fr ? 'Niveaux de forfait' : 'Package tiers' },
              { n: 'Ontario', label: fr ? 'Basés ici, déplacements partout au Canada' : 'Based, travel Canada-wide' },
              { n: '100%', label: fr ? 'Droits commerciaux inclus' : 'Commercial rights included' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="text-center md:px-8"
              >
                <p className="text-4xl font-light tracking-tight mb-2" style={{ color: '#121212' }}>{stat.n}</p>
                <p className="text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(18,18,18,0.4)' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#121212' }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(166,143,89,0.05) 0%, transparent 60%)'
        }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-10 h-px" style={{ backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>{fr ? 'Témoignages clients' : 'Client Stories'}</span>
              <div className="w-10 h-px" style={{ backgroundColor: 'rgba(166,143,89,0.5)' }} />
            </div>
            <h2 className="text-4xl font-light tracking-tight" style={{ color: '#F5F1EB' }}>
              {fr ? 'Les résultats parlent.' : 'The results speak.'}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: fr ? "CREOVA a transformé l'image et le ressenti de notre marque en ligne. La photographie a tout rehaussé — les clients remarquent la différence immédiatement." : "CREOVA transformed how our brand looks and feels online. The photography elevated everything — clients notice the difference immediately.",
                author: "Amara N.",
                role: fr ? "Fondatrice, Nairobi Kitchen Co." : "Founder, Nairobi Kitchen Co.",
                accent: '#A68F59',
              },
              {
                quote: fr ? "De la séance de marque à la stratégie sur les médias sociaux, CREOVA a compris notre culture et notre vision. Ils n'ont pas seulement exécuté — ils ont élevé." : "From the brand shoot to the social media strategy, CREOVA understood our culture and our vision. They didn't just execute — they elevated.",
                author: "Marcus T.",
                role: fr ? "Directeur créatif, BLOK Studios" : "Creative Director, BLOK Studios",
                accent: '#B1643B',
              },
              {
                quote: fr ? "La couverture de l'événement était à couper le souffle. Nos invités nous écrivent encore au sujet des photos. CREOVA a capté une énergie qu'on ne se savait même pas en train de créer." : "The event coverage was breathtaking. Our guests still message us about the photos. CREOVA captured energy we didn't even know we were creating.",
                author: "Priya K.",
                role: fr ? "Responsable des événements, AfroFutures Conference" : "Events Lead, AfroFutures Conference",
                accent: '#A68F59',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-8 rounded-2xl flex flex-col gap-6 h-full transition-all duration-300"
                style={{ border: `1px solid ${item.accent}22`, backgroundColor: 'rgba(255,255,255,0.02)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${item.accent}44`;
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.04)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${item.accent}22`;
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.02)';
                }}
              >
                <div style={{ width: '32px', height: '2px', backgroundColor: item.accent }} />
                <p className="text-base leading-relaxed flex-1" style={{ color: '#E3DCD3' }}>
                  "{item.quote}"
                </p>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#F5F1EB' }}>{item.author}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#7A6F66' }}>{item.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Drone & Video Preview */}
      {(activeTab === 'video' || activeTab === 'all') && (
        <section className="relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
          <div className="absolute top-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-px" style={{ backgroundColor: '#A68F59' }} />
                <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#A68F59' }}>{fr ? 'Événements et vidéo' : 'Events & Video'}</span>
              </div>
              <h2 className="text-4xl md:text-5xl tracking-tight font-light" style={{ color: '#F5F1EB' }}>
                {fr ? "L'œuvre en mouvement" : 'See the Work in Motion'}
              </h2>
              <p className="text-base mt-4 max-w-xl leading-relaxed" style={{ color: '#7A6F66' }}>
                {fr ? "Couverture d'événements cinématographique et récit de marque — un aperçu de notre façon de capter les moments et de donner vie aux marques à l'écran. Survolez pour prévisualiser." : 'Cinematic event coverage and brand storytelling — a glimpse of how we capture moments and bring brands to life on screen. Hover to preview.'}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  label: fr ? "Couverture d'événements" : 'Event Coverage',
                  sub: fr ? "Couverture d'événements et de conférences" : 'Events & Conference Coverage',
                  src: '/hero-reel.mp4',
                  poster: '/card-blackprint.jpg',
                  accent: '#A68F59',
                },
                {
                  label: fr ? 'Bobine de marque' : 'Brand Reel',
                  sub: fr ? 'Vidéographie et création de contenu' : 'Videography & Content Creation',
                  src: '/hero-reel.mp4',
                  poster: '/card-blackprint-session.jpg',
                  accent: '#B1643B',
                },
              ].map((vid, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-3xl"
                  style={{ aspectRatio: '16/9', backgroundColor: '#111' }}
                >
                  <video
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-70 transition-opacity duration-700"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={vid.poster}
                    aria-hidden="true"
                  >
                    <source src={vid.src} type="video/mp4" />
                  </video>
                  <img
                    src={vid.poster}
                    alt={vid.label}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-700"
                  />
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.3) 60%, transparent 100%)',
                  }} />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="w-8 h-0.5 mb-3 rounded-full" style={{ backgroundColor: vid.accent }} />
                    <p className="text-xs tracking-[0.35em] uppercase mb-1" style={{ color: vid.accent }}>{vid.sub}</p>
                    <h3 className="text-2xl tracking-tight" style={{ color: '#F5F1EB' }}>{vid.label}</h3>
                    <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500"
                      style={{ color: vid.accent }}>
                      <div className="w-8 h-8 rounded-full border flex items-center justify-center"
                        style={{ borderColor: vid.accent }}>
                        <Plane className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm">{fr ? 'Lire l’aperçu' : 'Play preview'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Add-Ons & Extras */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#0E0E0E' }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(166,143,89,0.06) 0%, transparent 70%)'
        }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-5 mb-3">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>{fr ? 'Bonifications' : 'Enhancements'}</p>
            </div>
            <h2 className="text-4xl font-light tracking-tight" style={{ color: '#F5F1EB' }}>{fr ? 'Options et extras' : 'Add-Ons & Extras'}</h2>
            <p className="text-base mt-2" style={{ color: '#4A3E36' }}>{fr ? "Bonifiez n'importe quel forfait de service" : 'Enhance any service package'}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: fr ? 'Heure supplémentaire (photo/vidéo)' : 'Extra Hour (photo/video)', price: '$100-$150' },
              { name: fr ? 'Option images par drone' : 'Drone Footage Add-On', price: '$200' },
              { name: fr ? 'Caméra cabine 360 (événements)' : '360 Booth Camera (Events)', price: '$650' },
              { name: fr ? 'Séquences brutes non montées' : 'Raw Unedited Footage', price: '$150' },
              { name: fr ? 'Livraison accélérée (72 h)' : 'Expedited Delivery (72 hrs)', price: '$250' },
              { name: fr ? "Album personnalisé (prêt à imprimer)" : 'Custom Album (Print-Ready)', price: fr ? 'À partir de 175 $' : 'From $175' },
              { name: fr ? 'Soutien mensuel en conception' : 'Monthly Design Support', price: fr ? 'À partir de 300 $/mois' : 'From $300/mo' }
            ].map((addon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex justify-between items-center px-6 py-4 rounded-xl transition-all duration-300"
                style={{ border: '1px solid rgba(166,143,89,0.15)', backgroundColor: 'rgba(166,143,89,0.04)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(166,143,89,0.35)';
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(166,143,89,0.08)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(166,143,89,0.15)';
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(166,143,89,0.04)';
                }}
              >
                <span className="text-sm" style={{ color: '#E3DCD3' }}>{addon.name}</span>
                <span className="text-sm font-light" style={{ color: '#A68F59' }}>{addon.price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Rental Terms */}
      {(activeTab === 'rental' || activeTab === 'all') && (
        <section className="py-16" style={{ backgroundColor: '#F5F1EB' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(18,18,18,0.12)' }}
            >
              <div className="px-8 py-5 flex items-center gap-4" style={{ backgroundColor: '#121212' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                     style={{ border: '1px solid rgba(177,100,59,0.4)', backgroundColor: 'rgba(177,100,59,0.1)' }}>
                  <AlertCircle className="w-5 h-5" style={{ color: '#B1643B' }} />
                </div>
                <h3 className="text-xl tracking-tight" style={{ color: '#F5F1EB' }}>{fr ? "Conditions de location d'équipement" : 'Equipment Rental Terms'}</h3>
              </div>

              <div className="p-8 space-y-5" style={{ backgroundColor: '#FFFFFF' }}>
                {[
                  { label: fr ? 'Dépôt requis' : 'Deposit Required', text: fr ? "Dépôt de garantie remboursable exigé au ramassage. Remis dans les 5 jours ouvrables après le retour de l'équipement en bon état." : 'Refundable security deposit due upon pickup. Returned within 5 business days after equipment is returned in good condition.' },
                  { label: fr ? 'Période de location' : 'Rental Period', text: fr ? 'Journée de 24 heures (p. ex. ramassage lundi 9 h, retour mardi avant 9 h). Rabais multi-jours disponibles.' : '24-hour day (e.g., pickup 9am Monday, return by 9am Tuesday). Multi-day discounts available.' },
                  { label: fr ? 'Ramassage/Retour' : 'Pickup/Return', text: fr ? "L'équipement doit être ramassé et retourné à notre local en Ontario. Livraison disponible moyennant des frais supplémentaires." : 'Equipment must be picked up and returned at our Ontario location. Delivery available for additional fee.' },
                  { label: fr ? 'Politique de dommages' : 'Damage Policy', text: fr ? "Le locataire est responsable des dommages ou de la perte de l'équipement. Options d'assurance disponibles." : 'Renter is responsible for equipment damage or loss. Insurance options available.' },
                  { label: fr ? 'Réservation' : 'Reservation', text: fr ? "Réservez au moins 48 heures à l'avance. Pièce d'identité valide et entente de location signée requises." : 'Book at least 48 hours in advance. Valid ID and signed rental agreement required.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 pb-5" style={{ borderBottom: i < 4 ? '1px solid rgba(18,18,18,0.06)' : 'none' }}>
                    <span className="mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#A68F59', marginTop: '8px' }} />
                    <p className="text-sm leading-relaxed" style={{ color: '#4A3E36' }}>
                      <strong style={{ color: '#121212' }}>{item.label}:</strong> {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Recent Work */}
      {recentGalleries.length > 0 && (
        <section className="py-20" style={{ backgroundColor: '#0A0A0A', borderTop: '1px solid rgba(166,143,89,0.12)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
            >
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div style={{ height: '1px', width: '40px', backgroundColor: '#A68F59' }} />
                  <span className="text-xs tracking-[0.45em] uppercase" style={{ color: '#A68F59' }}>{fr ? 'Travaux récents' : 'Recent Work'}</span>
                </div>
                <h2 className="text-4xl md:text-5xl tracking-tight font-light" style={{ color: '#F5F1EB' }}>
                  {fr ? 'À voir en action' : 'See it in action'}
                </h2>
              </div>
              <Link
                to="/work"
                className="inline-flex items-center gap-2 text-sm tracking-wide transition-colors duration-300 flex-shrink-0"
                style={{ color: '#A68F59' }}
              >
                {fr ? 'Parcourir tout le portfolio' : 'Browse full portfolio'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentGalleries.map((gallery, i) => (
                <motion.a
                  key={gallery.id}
                  href={gallery.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative block overflow-hidden rounded-xl cursor-pointer"
                  style={{ aspectRatio: '4/3', backgroundColor: '#111' }}
                >
                  <img
                    src={gallery.image}
                    alt={gallery.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ objectPosition: gallery.objectPosition }}
                  />
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.2) 60%, transparent 100%)'
                  }} />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="w-6 mb-2" style={{ height: '1px', backgroundColor: gallery.accent }} />
                    {gallery.org && (
                      <p className="text-[10px] tracking-[0.25em] uppercase mb-1" style={{ color: gallery.accent }}>{gallery.org}</p>
                    )}
                    <h3 className="text-base tracking-tight leading-tight" style={{ color: '#F5F1EB' }}>{gallery.title}</h3>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community & Loyalty Discounts */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#121212' }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 70% at 50% 100%, rgba(166,143,89,0.07) 0%, transparent 65%)'
        }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-5 mb-3">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>{fr ? 'Pour notre communauté' : 'For Our Community'}</p>
            </div>
            <h2 className="text-4xl font-light tracking-tight" style={{ color: '#F5F1EB' }}>{fr ? 'Rabais communauté et fidélité' : 'Community & Loyalty Discounts'}</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {[
              { title: fr ? 'Étudiants et OBNL' : 'Students & Nonprofits', desc: fr ? 'Tarif communautaire disponible' : 'Community pricing available', discount: fr ? '15 % DE RABAIS' : '15% OFF' },
              { title: fr ? 'Clients fidèles' : 'Returning Clients', desc: fr ? '15 % sur tous les services' : '15% off all services', discount: fr ? '15 % DE RABAIS' : '15% OFF' },
              { title: fr ? 'Prime de recommandation' : 'Referral Bonus', desc: fr ? '25 $ de crédit pour vous et la personne référée' : '$25 credit for you & referral', discount: '$25' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="p-8 rounded-2xl text-center transition-all duration-300"
                style={{ border: '1px solid rgba(166,143,89,0.2)', backgroundColor: 'rgba(166,143,89,0.05)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(166,143,89,0.45)';
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(166,143,89,0.09)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(166,143,89,0.2)';
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(166,143,89,0.05)';
                }}
              >
                <div className="text-4xl font-light tracking-tight mb-4" style={{ color: '#A68F59' }}>
                  {item.discount}
                </div>
                <div style={{ height: '1px', width: '32px', backgroundColor: 'rgba(166,143,89,0.4)', margin: '0 auto 16px' }} />
                <h3 className="text-lg mb-2 tracking-tight" style={{ color: '#F5F1EB' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: '#7A6F66' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="px-10 py-6 rounded-xl text-sm tracking-wide transition-all duration-300"
              style={{ backgroundColor: '#A68F59', color: '#121212' }}
              onClick={() => navigate('/booking')}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F5F1EB';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#A68F59';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {fr ? 'Démarrer un projet' : 'Start a Project'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-10 py-6 rounded-xl text-sm tracking-wide transition-all duration-300 border"
              style={{ backgroundColor: 'transparent', borderColor: 'rgba(166,143,89,0.4)', color: '#A68F59' }}
              onClick={() => navigate('/pricing')}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#A68F59';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(166,143,89,0.4)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {fr ? 'Voir les tarifs' : 'See Pricing'}
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
