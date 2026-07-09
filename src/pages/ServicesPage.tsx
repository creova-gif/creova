import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router';
import { PageSEO } from '../components/PageSEO';
import { Button } from '../components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Users, Package, PartyPopper, Plane, TrendingUp, Palette, Video, Settings, AlertCircle, Calendar, ArrowRight } from 'lucide-react';
import { useGalleries } from '../hooks/useGalleries';

type ServiceCategory = 'photography' | 'video' | 'brand' | 'social' | 'events' | 'rental' | 'all';

export function ServicesPage() {
  const [activeTab, setActiveTab] = useState<ServiceCategory>('all');
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const navigate = useNavigate();
  const { galleries } = useGalleries();

  const recentGalleries = useMemo(() => {
    // Locked collections don't preview well as a teaser — prefer public ones, unlocked first
    return [...galleries]
      .sort((a, b) => (b.date || `${b.year}-01-01`).localeCompare(a.date || `${a.year}-01-01`))
      .filter(g => !g.locked)
      .slice(0, 6);
  }, [galleries]);

  const tabs = [
    { id: 'all' as ServiceCategory, label: 'All Services', icon: Settings },
    { id: 'photography' as ServiceCategory, label: 'Photography', icon: Camera },
    { id: 'video' as ServiceCategory, label: 'Video & Drone', icon: Video },
    { id: 'brand' as ServiceCategory, label: 'Branding & Design', icon: Palette },
    { id: 'social' as ServiceCategory, label: 'Social Media', icon: TrendingUp },
    { id: 'events' as ServiceCategory, label: 'Events', icon: PartyPopper },
    { id: 'rental' as ServiceCategory, label: 'Equipment Rental', icon: Package }
  ];

  const services = [
    {
      id: 'family-portraits',
      category: 'photography' as ServiceCategory,
      icon: Users,
      title: 'Family Portrait Photography',
      description: 'Capture your family\'s legacy with culturally informed, beautifully crafted portraits.',
      packages: [
        { name: 'Mini Memories', tagline: 'Perfect first impression', features: ['45-minute session', '10 edited photos', 'Up to 5 family members', 'Online gallery delivery'] },
        { name: 'Timeless Bonds', tagline: "Your family's story, beautifully told", features: ['1.5-hour session', '25 edited photos', 'Up to 10 family members', 'Print release included'] },
        { name: 'Legacy Heirloom', tagline: 'Generational moments, forever preserved', features: ['2-hour session', '40+ edited photos', 'Up to 15 family members', 'Custom album option'] }
      ]
    },
    {
      id: 'brand-photography',
      category: 'photography' as ServiceCategory,
      icon: Camera,
      title: 'Brand Photography & Headshots',
      description: 'Professional headshots and brand photography for entrepreneurs and teams.',
      packages: [
        { name: 'Profile Pro', tagline: 'Clean authority for your team', features: ['1-1.5 hour session', 'Up to 10 team members', '1 retouched headshot each', 'Neutral or branded backgrounds'] },
        { name: 'Workspace Stories', tagline: 'Culture captured authentically', features: ['2-hour session', 'Up to 15 team members', '20+ edited images', 'Candid + posed shots'] },
        { name: 'Brand Vision Suite', tagline: 'Full brand world in one session', features: ['3-4 hours coverage', '50+ curated photos', 'Team + culture shots', 'Optional 1-min video (+$300)'] }
      ]
    },
    {
      id: 'product-photography',
      category: 'photography' as ServiceCategory,
      icon: Package,
      title: 'Product Photography',
      description: 'Strategic content that helps your product sell and speak for itself.',
      packages: [
        { name: 'E-commerce Essentials', tagline: 'Products that sell themselves', features: ['15 styled product photos', 'White background + lifestyle', 'Basic retouching & color correction', 'Web-optimized files', 'Commercial license included'] },
        { name: 'Product Pro Kit', tagline: 'Content that converts', features: ['25 styled product photos', '1-minute product video', 'Studio + lifestyle shots', 'Advanced retouching', 'Commercial license included', 'Social media formats'] },
        { name: 'Lifestyle Collection', tagline: 'Premium brand presence', features: ['40+ product photos', '2-3 minute product video', 'Multiple lifestyle settings', 'Premium retouching', 'Full commercial rights', 'Rush delivery available'] }
      ]
    },
    {
      id: 'aerial-drone',
      category: 'video' as ServiceCategory,
      icon: Plane,
      title: 'Aerial & Drone Photography',
      description: 'Cinematic perspectives that elevate your brand from above.',
      packages: [
        { name: 'Aerial Vision Session', tagline: 'Perspective that commands attention', features: ['1-hour drone session', '20+ aerial photos', '30-60 sec cinematic video', 'Basic colour grading', 'Licensed & insured'] },
        { name: 'Aerial Cinematic Experience', tagline: 'Cinematic storytelling from above', features: ['2-hour advanced session', '40+ premium photos', '1-2 min cinematic reel', 'Sound design included', 'Advanced colour grading', 'Licensed & insured'] }
      ]
    },
    {
      id: 'videography',
      category: 'video' as ServiceCategory,
      icon: Video,
      title: 'Videography & Content Creation',
      description: 'Professional video production for brands, events, and marketing campaigns.',
      packages: [
        { name: 'Starter', tagline: 'Social-first, brand-forward', features: ['2 hours shoot time', '1-2 short-form videos', 'Basic editing', 'Social media ready'] },
        { name: 'Creator', tagline: 'Content engine for growth', features: ['4 hours shoot time', '3-5 short-form videos', 'Social media optimization', 'Music & captions included'] },
        { name: 'Pro', tagline: 'Flagship brand film', features: ['8 hours shoot time', '1 long-form video (2-3 min)', '5-7 short-form clips', 'Professional color grading'] },
        { name: 'Campaign', tagline: 'Full production, end-to-end', features: ['2+ days production', 'Multi-video campaign', 'Storyboarding & scripting', 'Unlimited revisions'] }
      ],
      addOns: [
        { name: 'Extra location', price: '$150-$250' },
        { name: 'Extra videos', price: '$100/video' }
      ]
    },
    {
      id: 'event-coverage',
      category: 'events' as ServiceCategory,
      icon: PartyPopper,
      title: 'Event Coverage',
      description: 'Weddings, cultural events, ceremonies, and celebrations captured beautifully.',
      packages: [
        { name: 'Essence Package', tagline: 'Every key moment captured', features: ['3 hours coverage', '50+ images or 2-3 min video', '1 location', 'Online gallery'] },
        { name: 'Signature Story', tagline: 'Full narrative, beautifully cut', features: ['6 hours hybrid coverage', '100+ images', '3-5 min highlight film', 'Multi-location'] },
        { name: 'Heritage Experience', tagline: 'Cinematic legacy documentation', features: ['8-10 hours coverage', '200+ images', '5-7 min cinematic film', 'Drone footage included'] }
      ]
    },
    {
      id: 'social-media',
      category: 'social' as ServiceCategory,
      icon: TrendingUp,
      title: 'Social Media Management',
      description: 'Strategic, creative, and consistent social media for cultural brands.',
      packages: [
        { name: 'Starter Plan', tagline: 'Consistent presence, zero stress', features: ['12 curated posts', '1 platform', '1 strategy call/month', 'Basic analytics'] },
        { name: 'Growth Plan', tagline: 'Community built, engagement owned', features: ['20+ posts', '1-2 platforms', 'Engagement management', 'Weekly analytics reports'] },
        { name: 'Creator+ Plan', tagline: 'Full-service growth partner', features: ['Cross-platform growth', 'Full content production', 'Paid ad setup & management', 'Dedicated account manager'] }
      ]
    },
    {
      id: 'brand-design',
      category: 'brand' as ServiceCategory,
      icon: Palette,
      title: 'Brand Design & Identity',
      description: 'Bold, strategic identities for creators and cultural brands who lead with vision.',
      packages: [
        { name: 'Brand Essentials Kit', tagline: 'Identity starter pack', features: ['3 custom templates', 'Color palette + fonts', 'Mini style guide', 'Social media kit'] },
        { name: 'Visual Starter Identity', tagline: 'Foundation built to scale', features: ['Logo wordmark/symbol', 'Starter brand guide', '5 branded visuals', 'Business card design'] },
        { name: 'Signature Identity Suite', tagline: 'Your complete brand world', features: ['Full logo suite', 'Comprehensive brand guide', 'Complete asset kit', '3 months support'] }
      ]
    },
    {
      id: 'event-conference-design',
      category: 'brand' as ServiceCategory,
      icon: Calendar,
      title: 'Event & Conference Design',
      description: 'Specialized design services for organizers, institutions, universities, and corporate events.',
      packages: [
        { name: 'Event Essentials Package', tagline: 'Launch-ready in days', features: ['1 Event Poster / Main Key Visual', '6 Social Media Graphics', '1 Digital Flyer (PNG + PDF)', '1 Event Banner/Header', 'Up to 3 revisions', 'Delivery: 5–7 days', 'Best for small events & workshops'] },
        { name: 'Standard Event Branding', tagline: 'Professional presence across all channels', features: ['Full Event Key Visual', '12 Social Media Graphics', '3 Posters or Flyers', 'Digital Promo Kit for Speakers', 'Event Schedule / Program (2–3 pages)', 'Web Banner Package', 'Up to 5 revisions', 'Delivery: 7–10 days'] },
        { name: 'Full Event Identity Suite', tagline: 'Immersive, end-to-end event design', features: ['Event Branding Consultation', 'Custom Hero Key Visual', '20 Social Media Graphics', 'Event Program Booklet (6–10 pages)', 'Stage Graphics (4–6 slides)', 'Web Banner Set', 'Up to 7 revisions', 'Delivery: 2–3 weeks'] }
      ]
    },
    {
      id: 'event-design-retainer',
      category: 'brand' as ServiceCategory,
      icon: Calendar,
      title: 'Event Design Retainer',
      description: 'Monthly design support for universities, organizations & companies with ongoing events.',
      packages: [
        { name: 'Starter', tagline: 'Always-on design support', features: ['6 graphics/month', '1 poster/flyer', '48–72h turnaround', 'Perfect for small organizations'] },
        { name: 'Growth', tagline: 'Priority pipeline, reliably delivered', features: ['12 graphics/month', '2 posters/flyers', 'Monthly strategy session', 'Priority delivery', 'For mid-size organizations'] },
        { name: 'Premium', tagline: 'Dedicated creative direction', features: ['Unlimited event design requests', '1 active project at a time', 'Creative direction support', 'Weekly check-ins', 'For large institutions'] }
      ]
    },
    {
      category: 'rental' as ServiceCategory,
      icon: Package,
      title: 'Equipment Rental',
      description: 'Professional camera, lighting, and audio equipment for your creative projects.',
      packages: [
        {
          name: 'DJI Osmo Creator Kit',
          capacity: 'Creator content',
          deposit: '$400',
          features: ['DJI Osmo Pocket 3 or Action 5 Pro', 'Wireless Mic System (2x transmitters)', 'Extension Rod & Tripod', 'Extra Batteries & Storage', 'Protective Carry Case']
        },
        {
          name: 'Photography Kit',
          capacity: 'Photography projects',
          deposit: '$300',
          features: ['DSLR or Mirrorless Camera', '2-3 Lenses (24-70mm, 50mm)', 'SD Cards & Batteries', 'Camera Bag']
        },
        {
          name: 'Videography Kit',
          capacity: 'Video productions',
          deposit: '$500',
          features: ['Cinema Camera or DSLR', 'Gimbal Stabilizer', 'Shotgun Microphone', 'LED Light Panel', 'Tripod & Accessories']
        },
        {
          name: 'Lighting Package',
          capacity: 'Studio shoots',
          deposit: '$200',
          features: ['2x LED Panels or Strobes', 'Light Stands', 'Softboxes/Modifiers', 'Power cables & accessories']
        },
        {
          name: 'Audio Package',
          capacity: 'Audio capture',
          deposit: '$150',
          features: ['Wireless Lavalier Mic', 'Shotgun Microphone', 'Audio Recorder', 'Boom Pole & Accessories']
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
                  Creative Stories
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-light leading-none tracking-tighter"
                style={{ fontSize: 'clamp(48px, 9vw, 116px)' }}
              >
                <span className="block" style={{ color: '#F5F1EB' }}>What</span>
                <span
                  className="block"
                  style={{
                    backgroundImage: 'linear-gradient(95deg, #A68F59 0%, #E3DCD3 65%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  We Build.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-6 text-base leading-relaxed max-w-sm"
                style={{ color: 'rgba(245,241,235,0.45)' }}
              >
                Photography, video, brand design, social media, and events — for BIPOC brands across Ontario.
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
                { icon: Camera, label: 'Photography', n: '3' },
                { icon: Video, label: 'Video & Drone', n: '2' },
                { icon: Palette, label: 'Brand Design', n: '3' },
                { icon: TrendingUp, label: 'Social Media', n: '3' },
                { icon: PartyPopper, label: 'Events', n: '3' },
                { icon: Package, label: 'Rental', n: '5' },
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
                      {service.category === 'rental' ? 'Equipment' : service.category}
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
                            Start a Project
                          </Button>
                          <button
                            type="button"
                            aria-label={`See packages for ${service.title}`}
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
                            See Packages →
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
              <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>How We Work</span>
            </div>
            <h2 className="text-4xl font-light tracking-tight" style={{ color: '#F5F1EB' }}>
              From first call to final delivery
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-0 relative">
            {/* Connector line desktop */}
            <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-px" style={{ backgroundColor: 'rgba(166,143,89,0.2)' }} />
            {[
              { step: '01', title: 'Discover', desc: 'We learn your brand, goals, and vision in a free 30-minute call. No obligation.' },
              { step: '02', title: 'Create', desc: 'We plan the shoot or design sprint, execute with intent, and bring your story to life.' },
              { step: '03', title: 'Deliver', desc: 'You receive your final files — edited, licensed, and ready to publish within agreed timelines.' },
              { step: '04', title: 'Grow', desc: 'We stay in your corner. Returning clients get priority booking, discounts, and ongoing support.' },
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
              Book a Free Discovery Call
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
                {['Brand Photography', 'Event Coverage', 'Aerial Vision', 'Social Media', 'Brand Identity', 'Product Photography', 'Videography', 'Creative Direction', 'Graphic Design', 'Equipment Rental'].map((item) => (
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
                {['Ontario & Beyond', 'BIPOC Brands', 'Cultural Storytelling', 'Licensed & Insured', 'Commercial Rights Included', 'Strategy-Led', 'On-Location', 'Studio & Lifestyle', 'Pro Equipment', 'Editorial Quality'].map((item) => (
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
              { n: '10+', label: 'Services offered' },
              { n: '3', label: 'Package tiers' },
              { n: 'Ontario', label: 'Based, travel Canada-wide' },
              { n: '100%', label: 'Commercial rights included' },
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
              <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>Client Stories</span>
              <div className="w-10 h-px" style={{ backgroundColor: 'rgba(166,143,89,0.5)' }} />
            </div>
            <h2 className="text-4xl font-light tracking-tight" style={{ color: '#F5F1EB' }}>
              The results speak.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "CREOVA transformed how our brand looks and feels online. The photography elevated everything — clients notice the difference immediately.",
                author: "Amara N.",
                role: "Founder, Nairobi Kitchen Co.",
                accent: '#A68F59',
              },
              {
                quote: "From the brand shoot to the social media strategy, CREOVA understood our culture and our vision. They didn't just execute — they elevated.",
                author: "Marcus T.",
                role: "Creative Director, BLOK Studios",
                accent: '#B1643B',
              },
              {
                quote: "The event coverage was breathtaking. Our guests still message us about the photos. CREOVA captured energy we didn't even know we were creating.",
                author: "Priya K.",
                role: "Events Lead, AfroFutures Conference",
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
                <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#A68F59' }}>Events & Video</span>
              </div>
              <h2 className="text-4xl md:text-5xl tracking-tight font-light" style={{ color: '#F5F1EB' }}>
                See the Work in Motion
              </h2>
              <p className="text-base mt-4 max-w-xl leading-relaxed" style={{ color: '#7A6F66' }}>
                Cinematic event coverage and brand storytelling — a glimpse of how we capture moments and bring brands to life on screen. Hover to preview.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  label: 'Event Coverage',
                  sub: 'Events & Conference Coverage',
                  src: '/hero-reel.mp4',
                  poster: '/card-blackprint.jpg',
                  accent: '#A68F59',
                },
                {
                  label: 'Brand Reel',
                  sub: 'Videography & Content Creation',
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
                      <span className="text-sm">Play preview</span>
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
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>Enhancements</p>
            </div>
            <h2 className="text-4xl font-light tracking-tight" style={{ color: '#F5F1EB' }}>Add-Ons & Extras</h2>
            <p className="text-base mt-2" style={{ color: '#4A3E36' }}>Enhance any service package</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: 'Extra Hour (photo/video)', price: '$100-$150' },
              { name: 'Drone Footage Add-On', price: '$200' },
              { name: '360 Booth Camera (Events)', price: '$650' },
              { name: 'Raw Unedited Footage', price: '$150' },
              { name: 'Expedited Delivery (72 hrs)', price: '$250' },
              { name: 'Custom Album (Print-Ready)', price: 'From $175' },
              { name: 'Monthly Design Support', price: 'From $300/mo' }
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
                <h3 className="text-xl tracking-tight" style={{ color: '#F5F1EB' }}>Equipment Rental Terms</h3>
              </div>

              <div className="p-8 space-y-5" style={{ backgroundColor: '#FFFFFF' }}>
                {[
                  { label: 'Deposit Required', text: 'Refundable security deposit due upon pickup. Returned within 5 business days after equipment is returned in good condition.' },
                  { label: 'Rental Period', text: '24-hour day (e.g., pickup 9am Monday, return by 9am Tuesday). Multi-day discounts available.' },
                  { label: 'Pickup/Return', text: 'Equipment must be picked up and returned at our Ontario location. Delivery available for additional fee.' },
                  { label: 'Damage Policy', text: 'Renter is responsible for equipment damage or loss. Insurance options available.' },
                  { label: 'Reservation', text: 'Book at least 48 hours in advance. Valid ID and signed rental agreement required.' }
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
                  <span className="text-xs tracking-[0.45em] uppercase" style={{ color: '#A68F59' }}>Recent Work</span>
                </div>
                <h2 className="text-4xl md:text-5xl tracking-tight font-light" style={{ color: '#F5F1EB' }}>
                  See it in action
                </h2>
              </div>
              <Link
                to="/work"
                className="inline-flex items-center gap-2 text-sm tracking-wide transition-colors duration-300 flex-shrink-0"
                style={{ color: '#A68F59' }}
              >
                Browse full portfolio
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
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>For Our Community</p>
            </div>
            <h2 className="text-4xl font-light tracking-tight" style={{ color: '#F5F1EB' }}>Community & Loyalty Discounts</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {[
              { title: 'Students & Nonprofits', desc: 'Community pricing available', discount: '15% OFF' },
              { title: 'Returning Clients', desc: '15% off all services', discount: '15% OFF' },
              { title: 'Referral Bonus', desc: '$25 credit for you & referral', discount: '$25' }
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
              Start a Project
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
              See Pricing
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
