import { useState } from 'react';
import { Link } from '../i18n/LocaleLink';
import { useLanguage } from '../context/LanguageContext';
import { PageSEO } from '../components/PageSEO';
import { Button } from '../components/ui/button';
import { CheckCircle2, Check, Target, Award, Shield, Clock, ArrowRight, Star, Users, Briefcase, Package, Plane, PartyPopper, Palette, Plus, Mail, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { BookingModal } from '../components/BookingModal';

export function PricingPage() {
  const { language } = useLanguage();
  // Commercial page → vous register (see mixed-register decision).
  const fr = language === 'fr';
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    name: string;
    price: number;
    description?: string;
  } | null>(null);

  const handleBookNow = (serviceName: string, price: number, description?: string) => {
    setSelectedService({ name: serviceName, price, description });
    setBookingOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div style={{ backgroundColor: '#F5F1EB' }}>
      <PageSEO
        title="Pricing"
        description="Transparent pricing for photography, videography, brand design, social media, and event coverage. Packages starting from $450 across Ontario."
      path="/pricing"
      />
      {/* Availability Banner */}
      <div className="relative z-40 py-3 px-4 text-center" style={{ backgroundColor: '#121212', borderBottom: '1px solid rgba(166,143,89,0.25)' }}>
        <p className="text-xs sm:text-sm tracking-wide" style={{ color: '#E3DCD3' }}>
          <span className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#A68F59' }} />
            <strong style={{ color: '#A68F59' }}>{fr ? 'Places limitées :' : 'Limited availability:'}</strong>
            {' '}{fr ? 'On accepte actuellement 4 nouveaux projets clients pour le T3 2026 —' : 'Currently accepting 4 new client projects for Q3 2026 —'}{' '}
            <Link to="/contact" className="underline underline-offset-2 hover:opacity-80 transition-opacity" style={{ color: '#F5F1EB' }}>
              {fr ? 'réservez votre appel découverte gratuit →' : 'book your free discovery call →'}
            </Link>
          </span>
        </p>
      </div>

      {/* Hero Section — Asymmetric Editorial */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
        {/* Left accent stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: 'linear-gradient(to bottom, #A68F59, #B1643B, transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ backgroundColor: 'rgba(166,143,89,0.3)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-0 items-stretch min-h-[420px]">
            {/* Left: headline */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="py-24 pr-0 lg:pr-16 flex flex-col justify-center"
              style={{ borderRight: '1px solid rgba(166,143,89,0.1)' }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-px" style={{ backgroundColor: '#A68F59' }} />
                <span className="text-xs tracking-[0.45em] uppercase" style={{ color: '#A68F59' }}>{fr ? 'Tarifs transparents' : 'Transparent Pricing'}</span>
              </div>
              <h1 className="tracking-tight leading-none mb-8" style={{ fontSize: 'clamp(3.2rem, 7vw, 7rem)' }}>
                <span className="block font-light mb-3" style={{ color: '#F5F1EB' }}>
                  {fr ? 'Vraie valeur.' : 'Real Value.'}
                </span>
                <span className="block italic" style={{
                  backgroundImage: 'linear-gradient(95deg, #A68F59 0%, #E3DCD3 65%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}>
                  {fr ? 'Vrais résultats.' : 'Real Results.'}
                </span>
              </h1>
              <p className="text-base leading-relaxed max-w-lg" style={{ color: '#7A6F66' }}>
                {fr ? "Du temps créatif dédié, une réflexion stratégique et une valeur de marque à long terme — des tarifs transparents pour chaque entreprise canadienne." : 'Dedicated creative time, strategic thinking, and long-term brand value — transparent pricing for every Canadian business.'}
              </p>
              <div className="flex flex-wrap gap-6 mt-8">
                {(fr ? ['Équipement pro', 'Montage expert', 'Licence commerciale'] : ['Pro Equipment', 'Expert Editing', 'Commercial License']).map((tag, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#A68F59' }} />
                    <span className="text-sm" style={{ color: 'rgba(245,241,235,0.5)' }}>{tag}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: price anchor cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="py-16 pl-0 lg:pl-12 flex flex-col justify-center gap-3"
            >
              {[
                { label: fr ? 'Photographie' : 'Photography', target: '#family', range: fr ? 'à partir de 450 $' : 'from $450', icon: '📷' },
                { label: fr ? 'Vidéographie' : 'Videography', target: '#events', range: fr ? 'à partir de 500 $' : 'from $500', icon: '🎥' },
                { label: fr ? 'Marque et design' : 'Brand & Design', target: '#brand', range: fr ? 'à partir de 750 $' : 'from $750', icon: '🎨' },
                { label: fr ? 'Événements' : 'Events', target: '#events', range: fr ? 'à partir de 750 $' : 'from $750', icon: '🎉' },
                { label: fr ? 'Médias sociaux' : 'Social Media', target: '#design', range: fr ? 'à partir de 950 $/mois' : 'from $950/mo', icon: '📱' },
                { label: fr ? 'Aérien' : 'Aerial', target: '#aerial', range: fr ? 'à partir de 600 $' : 'from $600', icon: '🚁' },
              ].map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  onClick={() => scrollToSection(item.target)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 group"
                  style={{ backgroundColor: 'rgba(245,241,235,0.03)', border: '1px solid rgba(166,143,89,0.1)' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(166,143,89,0.07)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(245,241,235,0.03)')}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-sm font-medium" style={{ color: '#F5F1EB' }}>{item.label}</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: '#A68F59' }}>{item.range}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Category Navigation */}
      <section className="py-16" style={{ backgroundColor: '#F5F1EB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-5 mb-3">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(18,18,18,0.2)' }} />
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>{fr ? 'Parcourir par catégorie' : 'Browse By Category'}</p>
            </div>
            <h2 className="text-3xl font-light tracking-tight" style={{ color: '#121212' }}>{fr ? 'Choisissez votre service' : 'Choose Your Service'}</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: fr ? 'Famille' : 'Family', id: '#family', icon: Users },
              { name: fr ? 'Marque' : 'Brand', id: '#brand', icon: Briefcase },
              { name: fr ? 'Produit' : 'Product', id: '#commerce', icon: Package },
              { name: fr ? 'Aérien' : 'Aerial', id: '#aerial', icon: Plane },
              { name: fr ? 'Événements' : 'Events', id: '#events', icon: PartyPopper },
              { name: fr ? 'Design' : 'Design', id: '#design', icon: Palette }
            ].map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.button
                  key={index}
                  onClick={() => scrollToSection(category.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="rounded-xl p-5 text-center transition-all duration-300"
                  style={{ border: '1px solid rgba(18,18,18,0.12)', backgroundColor: '#FFFFFF' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(166,143,89,0.5)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(166,143,89,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(18,18,18,0.12)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <IconComponent className="w-6 h-6 mx-auto mb-2" style={{ color: '#A68F59' }} />
                  <div className="text-xs tracking-wide" style={{ color: '#121212' }}>{category.name}</div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value Statement */}
      <section className="py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-5 mb-3">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(18,18,18,0.2)' }} />
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>{fr ? 'Notre valeur' : 'Our Value'}</p>
            </div>
            <h2 className="text-4xl font-light tracking-tight" style={{ color: '#121212' }}>
              {fr ? 'Pourquoi nos tarifs reflètent notre valeur' : 'Why Our Pricing Reflects Our Value'}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Clock,
                title: fr ? 'Temps dédié' : 'Dedicated Time',
                description: fr ? "On suit nos heures pour garantir un travail de grande qualité et réfléchi — jamais bâclé" : 'We track our hours to maintain high-quality, intentional work — not rushed outputs'
              },
              {
                icon: Award,
                title: fr ? 'Centrés sur le client' : 'Client-Focused',
                description: fr ? 'On se concentre sur les clients qui valorisent le design, le récit et des résultats mesurables' : 'We focus on clients who value design, storytelling, and measurable results'
              },
              {
                icon: Target,
                title: fr ? 'Normes élevées' : 'High Standards',
                description: fr ? 'Chaque offre est conçue pour établir un plus haut standard de valeur créative' : 'Every offering is built to set a higher precedent of creative value'
              },
              {
                icon: Shield,
                title: fr ? 'Bâtir des marques' : 'Brand Building',
                description: fr ? 'On n’est pas là pour seulement « faire du contenu » — on bâtit des marques qui ont du sens' : 'We\'re not here to just "make content" — we build brands with meaning'
              }
            ].map((item, index) => (
              <RevealOnScroll key={index} mode='3d' delay={index * 0.1}>
                <div
                  className="group bg-white border-2 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-500"
                  style={{ borderColor: '#E3DCD3' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#B1643B';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E3DCD3';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
                       style={{ backgroundColor: 'rgba(177, 100, 59, 0.1)' }}>
                    <item.icon className="w-7 h-7" style={{ color: '#B1643B' }} />
                  </div>
                  <h3 className="text-xl mb-3" style={{ color: '#121212' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#7A6F66' }}>
                    {item.description}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* All Packages Include - Enhanced */}
      <section className="py-20" style={{ backgroundColor: '#F5F1EB' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="h-1 w-20 mx-auto mb-6" style={{ backgroundColor: '#A68F59' }}></div>
            <h2 className="text-4xl mb-4" style={{ color: '#121212' }}>
              {fr ? 'Tous les forfaits incluent' : 'All Packages Include'}
            </h2>
            <p className="text-xl" style={{ color: '#7A6F66' }}>
              {fr ? 'Des caractéristiques haut de gamme incluses dans chaque service' : 'Premium features included in every service'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: fr ? 'Équipement professionnel' : 'Professional Equipment',
                description: fr ? "Caméras, éclairage et logiciels de montage aux normes de l'industrie" : 'Industry-standard cameras, lighting, and editing software'
              },
              {
                title: fr ? 'Livraison en ligne' : 'Online Delivery',
                description: fr ? 'Livraison sécurisée par galerie ou vidéo avec accès au téléchargement' : 'Secure gallery or video delivery with download access'
              },
              {
                title: fr ? 'Consultation avant séance' : 'Pre-Session Consultation',
                description: fr ? 'Appel de planification pour aligner la vision et les objectifs' : 'Planning call to align on vision and goals'
              },
              {
                title: fr ? "Licence d'utilisation" : 'Usage License',
                description: fr ? 'Droits commerciaux ou personnels inclus' : 'Commercial or personal use rights included'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: '#A68F59' }} />
                  <div>
                    <h3 className="mb-2" style={{ color: '#121212' }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#7A6F66' }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 text-center border-2"
            style={{ borderColor: '#E3DCD3' }}
          >
            <p className="text-sm" style={{ color: '#7A6F66' }}>
              <span style={{ color: '#121212' }}>{fr ? 'Note :' : 'Note:'}</span> {fr ? 'Tous les prix sont en dollars canadiens et assujettis à la TVH de 13 % (Ontario)' : 'All prices are in CAD and subject to 13% HST (Ontario)'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Family Photography */}
      <section id="family" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl mb-4" style={{ color: '#121212' }}>
              {fr ? 'Photographie de portraits de famille' : 'Family Portrait Photography'}
            </h2>
            <p className="text-xl" style={{ color: '#7A6F66' }}>
              {fr ? 'Immortalisez des moments intemporels avec vos proches' : 'Capture timeless moments with your loved ones'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: fr ? 'Petits souvenirs' : 'Mini Memories', price: '$450', time: '45 min', photos: fr ? '10 photos' : '10 photos', popular: false, priceNum: 450 },
              { name: fr ? 'Liens intemporels' : 'Timeless Bonds', price: '$650', time: fr ? '1 h 30' : '1.5 hours', photos: '25 photos', popular: true, priceNum: 650 },
              { name: fr ? 'Héritage vivant' : 'Legacy Heirloom', price: '$950', time: fr ? '2 heures' : '2 hours', photos: '40+ photos', popular: false, priceNum: 950 }
            ].map((pkg, index) => (
              <RevealOnScroll key={index} mode='3d' delay={index * 0.1}>
              <div
                className={`relative bg-white rounded-2xl p-8 text-center transition-all duration-500 hover:shadow-2xl ${
                  pkg.popular ? 'border-2' : 'border'
                }`}
                style={{ borderColor: pkg.popular ? '#A68F59' : '#E3DCD3' }}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs"
                       style={{ backgroundColor: '#A68F59', color: '#F5F1EB' }}>
                    {fr ? 'LE PLUS POPULAIRE' : 'MOST POPULAR'}
                  </div>
                )}
                <h3 className="text-2xl mb-4" style={{ color: '#121212' }}>{pkg.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl" style={{ color: '#121212' }}>{pkg.price}</span>
                  <p className="text-sm mt-2" style={{ color: '#7A6F66' }}>CAD</p>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#7A6F66' }}>
                    <Clock className="w-4 h-4" />
                    <span>{pkg.time}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#7A6F66' }}>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{pkg.photos}</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleBookNow(pkg.name, pkg.priceNum, fr ? `Séance de ${pkg.time} • ${pkg.photos}` : `${pkg.time} session • ${pkg.photos}`)}
                  className="w-full rounded-xl py-6 transition-all duration-300"
                  style={{ backgroundColor: pkg.popular ? '#121212' : '#F5F1EB', color: pkg.popular ? '#F5F1EB' : '#121212' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#A68F59';
                    e.currentTarget.style.color = '#F5F1EB';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = pkg.popular ? '#121212' : '#F5F1EB';
                    e.currentTarget.style.color = pkg.popular ? '#F5F1EB' : '#121212';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {fr ? 'Réserver une séance' : 'Book Session'}
                </Button>
              </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Photography - Enhanced */}
      <section id="brand" className="py-24" style={{ backgroundColor: '#F5F1EB' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="h-1 w-20 mx-auto mb-6" style={{ backgroundColor: '#B1643B' }}></div>
            <h2 className="text-4xl mb-4" style={{ color: '#121212' }}>
              {fr ? "Série Identité de marque CREOVA" : 'CREOVA Brand Identity Series'}
            </h2>
            <p className="text-xl" style={{ color: '#7A6F66' }}>
              {fr ? 'Un récit visuel professionnel pour les entreprises et les entrepreneurs' : 'Professional visual storytelling for businesses and entrepreneurs'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: fr ? 'Profil Pro' : 'Profile Pro',
                price: '$750',
                description: fr ? "Des portraits corporatifs nets et cohérents qui représentent les gens de votre marque avec professionnalisme" : 'Clean, consistent headshots that represent your brand\'s people with professionalism',
                features: fr ? ['Séance de 1 h à 1 h 30', "Jusqu'à 10 membres de l'équipe", '1 tenue par personne', 'Arrière-plans neutres', '1 portrait retouché par personne'] : ['1 to 1.5-hour session', 'Up to 10 team members', '1 outfit per person', 'Neutral backgrounds', '1 retouched headshot per person'],
                addon: fr ? 'Membres supplémentaires 50 $/personne' : 'Additional team members $50/person',
                highlighted: false
              },
              {
                name: fr ? "Histoires d'équipe" : 'Workspace Stories',
                price: '$1,100',
                description: fr ? "Captez l'énergie, le flux de travail et la culture de votre marque de façon authentique" : 'Capture your brand\'s energy, workflow, and culture in an authentic way',
                features: fr ? ['Séance de 2 heures sur place', 'Portraits de groupe et spontanés', "Jusqu'à 15 membres de l'équipe", '20+ photos retouchées', 'Prêtes pour le web et les réseaux'] : ['2-hour on-location session', 'Group headshots + candids', 'Up to 15 team members', '20+ edited photos', 'Website & social ready'],
                addon: fr ? 'Membres supplémentaires 40 $/personne' : 'Additional team members $40/person',
                highlighted: true
              },
              {
                name: fr ? 'Suite Vision de marque' : 'Brand Vision Suite',
                price: '$1,600',
                description: fr ? "Une expérience d'identité visuelle complète pour les marques prêtes à raconter leur histoire" : 'Complete visual identity experience for brands ready to showcase their story',
                features: fr ? ['3 à 4 heures de direction guidée', "Portraits d'équipe et coulisses", 'Photographie de culture/espace', '50+ photos sélectionnées', 'Vidéo de 1 min en option (+300 $)'] : ['3–4 hours guided direction', 'Team headshots + BTS', 'Culture/space photography', '50+ curated photos', 'Optional 1-min video (+$300)'],
                addon: fr ? 'Membres supplémentaires 35 $/personne' : 'Additional team members $35/person',
                highlighted: false
              }
            ].map((pkg, index) => (
              <RevealOnScroll key={index} mode='3d' delay={index * 0.12}>
              <div
                className={`relative bg-white rounded-2xl p-8 transition-all duration-500 hover:shadow-2xl ${
                  pkg.highlighted ? 'border-2' : 'border'
                }`}
                style={{ borderColor: pkg.highlighted ? '#B1643B' : '#E3DCD3' }}
              >
                {pkg.highlighted && (
                  <div className="absolute -top-4 right-6 px-4 py-1.5 rounded-full text-xs"
                       style={{ backgroundColor: '#B1643B', color: '#F5F1EB' }}>
                    {fr ? 'RECOMMANDÉ' : 'RECOMMENDED'}
                  </div>
                )}
                <h3 className="text-2xl mb-3" style={{ color: '#121212' }}>{pkg.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl" style={{ color: '#121212' }}>{pkg.price}</span>
                  <span className="text-sm ml-2" style={{ color: '#7A6F66' }}>{fr ? 'à partir de' : 'starting at'}</span>
                </div>
                <p className="text-sm mb-6 leading-relaxed" style={{ color: '#7A6F66' }}>
                  {pkg.description}
                </p>
                <div className="space-y-3 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#A68F59' }} />
                      <span style={{ color: '#7A6F66' }}>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t mb-6" style={{ borderColor: '#E3DCD3' }}>
                  <p className="text-xs" style={{ color: '#7A6F66' }}>
                    {fr ? 'Option : ' : 'Add-on: '}{pkg.addon}
                  </p>
                </div>
                <Button 
                  asChild
                  className="w-full rounded-xl py-6 transition-all duration-300"
                  style={{ backgroundColor: '#121212', color: '#F5F1EB' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#B1643B';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#121212';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Link to="/booking">{fr ? 'Commencer' : 'Get Started'}</Link>
                </Button>
              </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Product Photography */}
      <section id="commerce" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl mb-4" style={{ color: '#121212' }}>
              {fr ? 'Collection Commerce CREOVA' : 'CREOVA Commerce Collection'}
            </h2>
            <p className="text-xl" style={{ color: '#7A6F66' }}>
              {fr ? 'Pour les artisans, les entrepreneurs et les conteurs de produits' : 'For makers, entrepreneurs, and product storytellers'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border-2 rounded-2xl p-10"
            style={{ borderColor: '#E3DCD3' }}
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl mb-4" style={{ color: '#121212' }}>{fr ? 'Vitrine Produit' : 'Product Spotlight'}</h3>
              <div className="mb-4">
                <span className="text-5xl" style={{ color: '#121212' }}>$750</span>
                <span className="text-lg ml-2" style={{ color: '#7A6F66' }}>{fr ? 'à partir de' : 'starting at'}</span>
              </div>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: '#7A6F66' }}>
                {fr ? 'Du contenu stratégique qui aide votre produit à se vendre et à parler de lui-même' : 'Strategic content that helps your product sell and speak for itself'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                ...(fr ? [
                  '10 photos de produits stylisées sur mesure (studio ou mise en situation)',
                  'Vidéo produit de 1 minute (démo, caractéristique ou mise en situation)',
                  "Photos à plat, scènes d'utilisation ou style éditorial créatif",
                  "Licence d'utilisation commerciale en ligne incluse",
                  'Consultation de style (accessoires, guide de planche tendance)',
                  'Optimisées pour Shopify, Instagram, Amazon'
                ] : [
                '10 custom-styled product photos (studio or lifestyle)',
                '1-minute product video (demo, feature, or lifestyle)',
                'Flat-lays, in-use scenes, or creative editorial style',
                'Online commercial use license included',
                'Styling consultation (props, moodboard guidance)',
                'Optimized for Shopify, Instagram, Amazon'
                ])
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                       style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)' }}>
                    <Check className="w-4 h-4" style={{ color: '#A68F59' }} />
                  </div>
                  <span className="text-sm" style={{ color: '#7A6F66' }}>{feature}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button 
                asChild
                size="lg"
                className="px-8 py-6 rounded-xl transition-all duration-300"
                style={{ backgroundColor: '#121212', color: '#F5F1EB' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#A68F59';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#121212';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Link to="/booking">
                  <span className="flex items-center gap-2">
                    {fr ? 'Réserver une séance produit' : 'Book Product Session'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Aerial Vision */}
      <section id="aerial" className="py-24" style={{ backgroundColor: '#F5F1EB' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4 tracking-tight flex items-center justify-center gap-3" style={{ color: '#121212' }}>
              <Plane className="w-10 h-10" style={{ color: '#A68F59' }} />
              {fr ? 'Forfaits Vision aérienne CREOVA' : 'CREOVA Aerial Vision Packages'}
            </h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#7A6F66' }}>
              {fr ? 'Des perspectives cinématographiques qui élèvent votre marque, vue du ciel' : 'Cinematic perspectives that elevate your brand from above'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Package 1: Aerial Vision Session */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white border-2 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500"
              style={{ borderColor: '#E3DCD3' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#A68F59';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E3DCD3';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl mb-4" style={{ color: '#121212' }}>{fr ? 'Séance Vision aérienne' : 'Aerial Vision Session'}</h3>
                <div className="mb-4">
                  <span className="text-5xl" style={{ color: '#121212' }}>$500</span>
                  <span className="text-lg ml-2" style={{ color: '#7A6F66' }}>{fr ? 'à partir de' : 'starting at'}</span>
                </div>
                <p className="text-base leading-relaxed" style={{ color: '#7A6F66' }}>
                  {fr ? "Un forfait de contenu aérien net et percutant pour l'immobilier, les événements et les paysages." : 'A clean, powerful aerial content package for real estate, events, and landscapes.'}
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  ...(fr ? [
                  'Séance de drone professionnelle de 1 heure',
                  '20+ photos aériennes haute résolution',
                  'Vidéo aérienne cinématographique de 30 à 60 s',
                  'Opérateur de drone licencié et assuré',
                  'Étalonnage des couleurs de base',
                  'Livraison en 3 à 5 jours'
                  ] : [
                  '1-hour professional drone session',
                  '20+ high-resolution aerial photos',
                  '30–60 second cinematic aerial video',
                  'Licensed & insured drone operator',
                  'Basic colour grading',
                  'Delivery within 3–5 days'
                  ])
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#A68F59' }} />
                    <span className="text-sm" style={{ color: '#7A6F66' }}>{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                asChild
                size="lg"
                className="w-full px-8 py-6 rounded-xl transition-all duration-300"
                style={{ backgroundColor: '#121212', color: '#F5F1EB' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#A68F59';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#121212';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Link to="/booking">
                  <span className="flex items-center justify-center gap-2">
                    {fr ? 'Réserver une séance aérienne' : 'Book Aerial Session'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </Button>
            </motion.div>

            {/* Package 2: Aerial Cinematic Experience */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white border-2 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 relative"
              style={{ borderColor: '#B1643B' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#A68F59';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#B1643B';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Premium Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs tracking-wider" style={{ backgroundColor: 'rgba(177, 100, 59, 0.1)', color: '#B1643B' }}>
                PREMIUM
              </div>

              <div className="text-center mb-8">
                <h3 className="text-3xl mb-4" style={{ color: '#121212' }}>{fr ? 'Expérience cinématographique aérienne' : 'Aerial Cinematic Experience'}</h3>
                <div className="mb-4">
                  <span className="text-5xl" style={{ color: '#121212' }}>$900</span>
                  <span className="text-lg ml-2" style={{ color: '#7A6F66' }}>{fr ? 'à partir de' : 'starting at'}</span>
                </div>
                <p className="text-base leading-relaxed" style={{ color: '#7A6F66' }}>
                  {fr ? "Un récit aérien cinématographique haut de gamme pour les marques, les événements et les campagnes touristiques qui exigent plus de profondeur et de valeur de production." : 'Premium cinematic aerial storytelling for brands, events, and tourism campaigns that need more depth and production value.'}
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  ...(fr ? [
                  'Séance de drone avancée de 2 heures',
                  '40+ photos aériennes haut de gamme',
                  'Bobine aérienne cinématographique de 1 à 2 min',
                  'Conception sonore incluse',
                  'Transitions animées créatives',
                  'Formats prêts pour les réseaux et le web',
                  'Étalonnage des couleurs avancé et retouches',
                  "Repérage de lieux (au besoin)",
                  'Opérateur licencié et assuré',
                  'Livraison en 5 à 7 jours'
                  ] : [
                  '2-hour advanced drone session',
                  '40+ premium-grade aerial photos',
                  '1–2 minute cinematic aerial reel',
                  'Sound design included',
                  'Creative motion transitions',
                  'Social + website-ready formats',
                  'Advanced colour grading & enhancements',
                  'Location scouting (if needed)',
                  'Licensed & insured operator',
                  'Delivery within 5–7 days'
                  ])
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#B1643B' }} />
                    <span className="text-sm" style={{ color: '#7A6F66' }}>{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                asChild
                size="lg"
                className="w-full px-8 py-6 rounded-xl transition-all duration-300"
                style={{ backgroundColor: '#B1643B', color: '#F5F1EB' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#A68F59';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#B1643B';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Link to="/booking">
                  <span className="flex items-center justify-center gap-2">
                    {fr ? "Réserver l'expérience premium" : 'Book Premium Experience'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Optional Enhancements */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border-2 rounded-2xl p-8"
            style={{ borderColor: '#E3DCD3' }}
          >
            <h4 className="text-2xl mb-6 text-center flex items-center justify-center gap-2" style={{ color: '#121212' }}>
              <Plus className="w-6 h-6" style={{ color: '#A68F59' }} />
              {fr ? 'Bonifications optionnelles' : 'Optional Enhancements'}
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: fr ? 'Bobine aérienne longue' : 'Long-Form Aerial Reel', detail: fr ? '2 à 3 minutes' : '2–3 minutes', price: '+ $200' },
                { name: fr ? 'Combo photo + drone' : 'Photo + Drone Combo', detail: fr ? 'Sol et aérien' : 'Ground & aerial', price: fr ? 'à partir de 750 $' : 'from $750' },
                { name: fr ? 'Script de voix hors champ + narration' : 'Voiceover Script + Narration', detail: fr ? 'Voix hors champ pro' : 'Professional VO', price: '+ $150' },
                { name: fr ? 'Livraison accélérée' : 'Rush Delivery', detail: fr ? '48 heures' : '48 hours', price: '+ $100' },
                { name: fr ? 'Gestion des permis' : 'Permit Handling', detail: fr ? 'Si requis' : 'If required', price: fr ? 'Sur devis' : 'Quoted' },
                { name: fr ? 'Lieu supplémentaire' : 'Additional Location', detail: fr ? 'Par lieu' : 'Per location', price: '+ $150' }
              ].map((enhancement, idx) => (
                <div key={idx} className="p-4 rounded-xl border" style={{ borderColor: '#E3DCD3', backgroundColor: '#F5F1EB' }}>
                  <div className="mb-2" style={{ color: '#121212' }}>{enhancement.name}</div>
                  <div className="text-xs mb-2" style={{ color: '#7A6F66' }}>{enhancement.detail}</div>
                  <div className="text-sm" style={{ color: '#A68F59' }}>{enhancement.price}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events Coverage */}
      <section id="events" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl mb-4" style={{ color: '#121212' }}>
              {fr ? "Couverture d'événements (photo + vidéo)" : 'Event Coverage (Photo + Video)'}
            </h2>
            <p className="text-xl" style={{ color: '#7A6F66' }}>
              {fr ? 'Une documentation complète de vos occasions spéciales' : 'Comprehensive documentation of your special occasions'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: fr ? 'Forfait Essence' : 'Essence Package', price: '$750', time: fr ? '3 heures' : '3 hours' },
              { name: fr ? 'Récit Signature' : 'Signature Story', price: '$1,350', time: fr ? '6 heures' : '6 hours' },
              { name: fr ? 'Expérience Héritage' : 'Heritage Experience', price: '$2,550', time: fr ? '8 à 10 heures' : '8-10 hours' }
            ].map((pkg, index) => (
              <RevealOnScroll key={index} mode='3d' delay={index * 0.1}>
              <div
                className="bg-white border-2 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-500"
                style={{ borderColor: '#E3DCD3' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#B1643B';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E3DCD3';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <h3 className="text-2xl mb-4" style={{ color: '#121212' }}>{pkg.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl" style={{ color: '#121212' }}>{pkg.price}</span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-8" style={{ color: '#7A6F66' }}>
                  <Clock className="w-4 h-4" />
                  <span>{pkg.time}</span>
                </div>
                <Button
                  asChild
                  className="w-full rounded-xl py-6 transition-all duration-300"
                  style={{ backgroundColor: '#F5F1EB', color: '#121212' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#121212';
                    e.currentTarget.style.color = '#F5F1EB';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F5F1EB';
                    e.currentTarget.style.color = '#121212';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Link to="/booking">{fr ? "Réserver l'événement" : 'Book Event'}</Link>
                </Button>
              </div>
              </RevealOnScroll>
            ))}
          </div>

          {/* Add-Ons for Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-white border-2 rounded-2xl p-8"
            style={{ borderColor: '#E3DCD3' }}
          >
            <h3 className="text-2xl mb-6 text-center" style={{ color: '#121212' }}>
              {fr ? "Options d'événement populaires" : 'Popular Event Add-Ons'}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-4 rounded-xl" style={{ backgroundColor: '#F5F1EB' }}>
                <span style={{ color: '#121212' }}>{fr ? 'Caméra cabine 360' : '360 Booth Camera'}</span>
                <span style={{ color: '#A68F59' }}>+$650</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl" style={{ backgroundColor: '#F5F1EB' }}>
                <span style={{ color: '#121212' }}>{fr ? 'Images par drone' : 'Drone Footage'}</span>
                <span style={{ color: '#A68F59' }}>+$200</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl" style={{ backgroundColor: '#F5F1EB' }}>
                <span style={{ color: '#121212' }}>{fr ? 'Heure de couverture supplémentaire' : 'Extra Hour Coverage'}</span>
                <span style={{ color: '#A68F59' }}>+$150</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl" style={{ backgroundColor: '#F5F1EB' }}>
                <span style={{ color: '#121212' }}>{fr ? 'Vidéo montée le jour même' : 'Same-Day Edit Video'}</span>
                <span style={{ color: '#A68F59' }}>+$300</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Graphic Design */}
      <section id="design" className="py-24" style={{ backgroundColor: '#F5F1EB' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="h-1 w-20 mx-auto mb-6" style={{ backgroundColor: '#B1643B' }}></div>
            <h2 className="text-4xl mb-4" style={{ color: '#121212' }}>
              {fr ? 'Design graphique et image de marque' : 'Graphic Design & Branding'}
            </h2>
            <p className="text-xl" style={{ color: '#7A6F66' }}>
              {fr ? "Des systèmes d'identité visuelle complets pour votre marque" : 'Complete visual identity systems for your brand'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: fr ? 'Trousse Essentiels de marque' : 'Brand Essentials Kit', price: '$600', desc: fr ? 'Trousse de démarrage rapide' : 'Quick-start pack' },
              { name: fr ? 'Identité visuelle de départ' : 'Visual Starter Identity', price: '$1,200', desc: fr ? 'Système de base' : 'Foundation system' },
              { name: fr ? 'Suite Identité Signature' : 'Signature Identity Suite', price: '$3,000+', desc: fr ? 'Univers visuel complet' : 'Full visual world' }
            ].map((pkg, index) => (
              <RevealOnScroll key={index} mode='3d' delay={index * 0.1}>
              <div
                className="bg-white border-2 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-500"
                style={{ borderColor: '#E3DCD3' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#A68F59';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E3DCD3';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <h3 className="text-2xl mb-4" style={{ color: '#121212' }}>{pkg.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl" style={{ color: '#121212' }}>{pkg.price}</span>
                </div>
                <p className="text-sm mb-8" style={{ color: '#7A6F66' }}>{pkg.desc}</p>
                <Button
                  asChild
                  className="w-full rounded-xl py-6 transition-all duration-300"
                  style={{ backgroundColor: '#F5F1EB', color: '#121212' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#121212';
                    e.currentTarget.style.color = '#F5F1EB';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F5F1EB';
                    e.currentTarget.style.color = '#121212';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Link to="/booking">{fr ? 'Obtenir un devis' : 'Get Quote'}</Link>
                </Button>
              </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Add-Ons & Extras - Enhanced */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl mb-4" style={{ color: '#121212' }}>
              {fr ? 'Options et extras' : 'Add-Ons & Extras'}
            </h2>
            <p className="text-xl" style={{ color: '#7A6F66' }}>
              {fr ? "Bonifiez n'importe quel forfait avec ces services optionnels" : 'Enhance any package with these optional services'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: fr ? 'Heure supplémentaire (photo/vidéo)' : 'Extra Hour (photo/video)', price: '$100$150', desc: fr ? 'Prolongez la couverture de votre séance' : 'Extend your session coverage' },
              { name: fr ? 'Images par drone' : 'Drone Footage', price: '$200', desc: fr ? 'Ajoutez des perspectives aériennes' : 'Add aerial perspectives' },
              { name: fr ? 'Séquences brutes (non montées)' : 'Raw (Unedited) Footage', price: '$150', desc: fr ? 'Accès à tous les fichiers bruts' : 'Access to all raw files' },
              { name: fr ? 'Livraison accélérée' : 'Expedited Delivery', price: '$100', desc: fr ? 'Délai de 72 heures' : '72-hour turnaround' },
              { name: fr ? 'Album personnalisé' : 'Custom Album', price: fr ? 'à partir de 175 $' : 'from $175', desc: fr ? 'Livre photo professionnel' : 'Professional photo book' },
              { name: fr ? "Déplacement hors de la ville" : 'Travel Outside City', price: fr ? 'Sur mesure' : 'Custom', desc: fr ? 'Sur devis selon la distance' : 'Quoted per distance' }
            ].map((addon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="bg-white border rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                style={{ borderColor: '#E3DCD3' }}
              >
                <h3 className="mb-3" style={{ color: '#121212' }}>{addon.name}</h3>
                <p className="text-2xl sm:text-3xl mb-2" style={{ color: '#A68F59' }}>{addon.price}</p>
                <p className="text-sm" style={{ color: '#7A6F66' }}>{addon.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers - Enhanced */}
      <section className="py-24" style={{ backgroundColor: '#F5F1EB' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="h-1 w-20 mx-auto mb-6" style={{ backgroundColor: '#A68F59' }}></div>
            <h2 className="text-4xl mb-4" style={{ color: '#121212' }}>
              {fr ? 'Offres spéciales et rabais' : 'Special Offers & Discounts'}
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Community Rates */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-2xl mb-6 flex items-center justify-center"
                   style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)' }}>
                <Star className="w-6 h-6" style={{ color: '#A68F59' }} />
              </div>
              <h3 className="text-2xl mb-4" style={{ color: '#121212' }}>
                {fr ? 'Tarifs communauté et étudiants' : 'Community & Student Rates'}
              </h3>
              <p className="mb-4 leading-relaxed" style={{ color: '#7A6F66' }}>
                {fr ? "Tarifs réduits offerts aux étudiants, aux OBNL et aux organisations communautaires." : 'Discounted pricing available for students, nonprofits, and grassroots organizations.'}
              </p>
              <p className="text-sm" style={{ color: '#7A6F66' }}>
                {fr ? "Une preuve d'affiliation peut être exigée" : 'Proof of affiliation may be required'}
              </p>
            </motion.div>

            {/* Loyalty Discounts */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-2xl mb-6 flex items-center justify-center"
                   style={{ backgroundColor: 'rgba(177, 100, 59, 0.1)' }}>
                <Award className="w-6 h-6" style={{ color: '#B1643B' }} />
              </div>
              <h3 className="text-2xl mb-4" style={{ color: '#121212' }}>
                {fr ? 'Rabais fidélité et recommandation' : 'Loyalty & Referral Discounts'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm mb-1" style={{ color: '#7A6F66' }}>{fr ? 'Forfait photo + vidéo' : 'Photo + Video Bundle'}</p>
                  <p className="text-2xl" style={{ color: '#A68F59' }}>{fr ? '10 % DE RABAIS' : '10% OFF'}</p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: '#7A6F66' }}>{fr ? 'Clients fidèles' : 'Returning Clients'}</p>
                  <p className="text-2xl" style={{ color: '#A68F59' }}>{fr ? '15 % DE RABAIS' : '15% OFF'}</p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: '#7A6F66' }}>{fr ? 'Prime de recommandation' : 'Referral Bonus'}</p>
                  <p className="text-2xl" style={{ color: '#A68F59' }}>$25</p>
                  <p className="text-xs" style={{ color: '#7A6F66' }}>{fr ? 'crédit pour les deux' : 'credit for both'}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 rounded-2xl p-8 text-center"
            style={{ backgroundColor: '#121212' }}
          >
            <h3 className="text-2xl mb-4" style={{ color: '#F5F1EB' }}>
              {fr ? 'Réservation et contact' : 'Booking & Contact'}
            </h3>
            <div className="flex flex-wrap gap-6 justify-center items-center text-lg" style={{ color: '#E3DCD3' }}>
              <span className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                creativeinnovationspace@gmail.com
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {fr ? 'Ontario – Déplacements partout au Canada' : 'Ontario – Travel Canada-wide'}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Policies Section - Simplified */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl mb-4" style={{ color: '#121212' }}>
              {fr ? 'Politiques et conditions de réservation' : 'Booking Policies & Terms'}
            </h2>
            <p className="text-xl" style={{ color: '#7A6F66' }}>
              {fr ? 'Des conditions claires et professionnelles pour chaque projet' : 'Clear, professional terms for every project'}
            </p>
          </motion.div>
          
          <div className="space-y-6">
            {[
              {
                title: fr ? 'Modalités de paiement' : 'Payment Terms',
                items: fr ? [
                  'Acompte requis pour réserver votre date (non remboursable)',
                  'Le paiement complet doit être effectué avant de recevoir les fichiers finaux',
                  'Tous les principaux modes de paiement acceptés',
                  'Ententes de service professionnelles fournies pour toutes les réservations'
                ] : [
                  'Retainer required to secure your booking date (non-refundable)',
                  'Full payment must be completed before receiving final files',
                  'All major payment methods accepted',
                  'Professional service agreements provided for all bookings'
                ]
              },
              {
                title: fr ? "Politique d'annulation et de report" : 'Cancellation & Rescheduling Policy',
                items: fr ? [
                  "Préavis de 24 heures requis pour les annulations ou reports",
                  "Des frais d'annulation de 150 $ CA s'appliquent pour toute annulation dans les 24 heures",
                  'On fera de notre mieux pour accommoder les reports selon les disponibilités',
                  "Les acomptes sont non remboursables, mais applicables aux séances reportées"
                ] : [
                  '24-hour notice required for cancellations or rescheduling',
                  '$150 CAD cancellation fee applies for cancellations within 24 hours',
                  'We\'ll work to accommodate rescheduling based on availability',
                  'Retainer fees are non-refundable but applicable to rescheduled sessions'
                ]
              },
              {
                title: fr ? 'Ce que vous recevrez' : 'What You\'ll Receive',
                items: fr ? [
                  'Images haute résolution optimisées pour le web, les médias sociaux et l’impression',
                  'Montage et étalonnage des couleurs professionnels sur tous les livrables',
                  'Galerie en ligne sécurisée avec accès au téléchargement',
                  "Licence d'utilisation commerciale ou personnelle incluse"
                ] : [
                  'High-resolution images optimized for web, social media, and print',
                  'Professional editing and color grading on all deliverables',
                  'Secure online gallery with download access',
                  'Commercial or personal use license included'
                ]
              }
            ].map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border-2 rounded-2xl p-8"
                style={{ borderColor: '#E3DCD3' }}
              >
                <h3 className="text-xl mb-6 flex items-center gap-3" style={{ color: '#121212' }}>
                  <CheckCircle2 className="w-6 h-6" style={{ color: '#A68F59' }} />
                  {section.title}
                </h3>
                <div className="space-y-3">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" 
                           style={{ backgroundColor: '#A68F59' }}></div>
                      <span style={{ color: '#7A6F66' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Enhanced */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#121212' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(circle at 70% 30%, #A68F59 0%, transparent 50%), 
                             radial-gradient(circle at 30% 70%, #B1643B 0%, transparent 50%)` 
          }}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl mb-6" style={{ color: '#F5F1EB' }}>
              {fr ? 'Prêt à commencer ?' : 'Ready to Get Started?'}
            </h2>
            <p className="text-xl mb-10" style={{ color: '#E3DCD3' }}>
              {fr ? 'Réservez votre séance ou demandez un devis personnalisé adapté à vos besoins' : 'Book your session or request a custom quote tailored to your needs'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                className="px-8 py-6 rounded-xl text-lg transition-all duration-300"
                style={{ backgroundColor: '#F5F1EB', color: '#121212' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#A68F59';
                  e.currentTarget.style.color = '#F5F1EB';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F5F1EB';
                  e.currentTarget.style.color = '#121212';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Link to="/booking">{fr ? 'Réserver votre séance' : 'Book Your Session'}</Link>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline"
                className="px-8 py-6 rounded-xl text-lg border-2 transition-all duration-300"
                style={{ 
                  backgroundColor: 'transparent',
                  borderColor: '#F5F1EB',
                  color: '#F5F1EB'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F5F1EB';
                  e.currentTarget.style.color = '#121212';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#F5F1EB';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Link to="/services">{fr ? 'Voir tous les services' : 'View All Services'}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Booking Dialog */}
      {selectedService && (
        <BookingModal
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
          service={selectedService.name}
          package={selectedService.description}
          price={selectedService.price}
        />
      )}
    </div>
  );
}