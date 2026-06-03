import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { PageSEO } from '../components/PageSEO';
import { Button } from '../components/ui/button';
import { CheckCircle2, Check, Target, Award, Shield, Clock, ArrowRight, Star, Users, Briefcase, Package, Plane, PartyPopper, Palette, Plus, Mail, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { BookingModal } from '../components/BookingModal';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from '../context/LanguageContext';
import { SplitText } from '../components/SplitText';
import { Magnetic } from '../components/Magnetic';

export function PricingPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
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
    <div style={{ backgroundColor: '#0A0A0A' }} className="overflow-x-hidden">
      <PageSEO
        title="Pricing"
        description="Transparent pricing for photography, videography, brand design, social media, and event coverage. Packages starting from $450 across Ontario."
      />
      {/* Availability Banner */}
      <div className="relative z-40 py-3 px-4 text-center border-b" style={{ backgroundColor: '#121212', borderColor: 'rgba(166,143,89,0.25)' }}>
        <p className="text-xs sm:text-sm tracking-wide" style={{ color: '#E3DCD3' }}>
          <span className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#A68F59' }} />
            <strong style={{ color: '#A68F59' }}>Limited availability:</strong>
            {' '}Currently accepting 4 new client projects for Q3 2026 —{' '}
            <Link to="/contact" className="underline underline-offset-2 hover:opacity-80 transition-opacity" style={{ color: '#F5F1EB' }}>
              book your free discovery call →
            </Link>
          </span>
        </p>
      </div>

      {/* Hero Section — Asymmetric Editorial */}
      <section className="relative overflow-hidden border-b" style={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(166,143,89,0.15)' }}>
        <div className="crosshair-guides" />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 38%, rgba(166,143,89,0.12) 0%, transparent 70%)',
        }} />

        {/* Left accent stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: 'linear-gradient(to bottom, #A68F59, #B1643B, transparent)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                <span className="mono-label">{t('pricing.hero.title')}</span>
              </div>
              
              <SplitText
                text="Real Value."
                tag="h1"
                className="display-hero mb-2"
                style={{ color: '#F5F1EB' }}
                delay={0.1}
                stagger={0.05}
                mode="chars"
              />
              <SplitText
                text="Real Results."
                tag="h1"
                className="display-hero mb-8 text-gold-gradient"
                delay={0.4}
                stagger={0.05}
                mode="chars"
              />
              <p className="text-base sm:text-lg leading-relaxed max-w-lg" style={{ color: '#C8C0B8' }}>
                Dedicated creative time, strategic thinking, and long-term brand value — transparent pricing for every Canadian business.
              </p>
              <div className="flex flex-wrap gap-6 mt-8">
                {['Pro Equipment', 'Expert Editing', 'Commercial License'].map((tag, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#A68F59' }} />
                    <span className="text-sm font-medium tracking-wide uppercase" style={{ color: 'rgba(245,241,235,0.6)' }}>{tag}</span>
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
                { label: 'Photography', range: 'from $450', icon: '📷' },
                { label: 'Videography', range: 'from $500', icon: '🎥' },
                { label: 'Brand & Design', range: 'from $750', icon: '🎨' },
                { label: 'Events', range: 'from $750', icon: '🎉' },
                { label: 'Social Media', range: 'from $950/mo', icon: '📱' },
                { label: 'Aerial', range: 'from $600', icon: '🚁' },
              ].map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  onClick={() => scrollToSection(`#${item.label.toLowerCase().split(' ')[0]}`)}
                  className="flex items-center justify-between px-5 py-4 rounded-xl text-left transition-all duration-300 group hover:-translate-y-0.5"
                  style={{ backgroundColor: 'rgba(18,18,18,0.8)', border: '1px solid rgba(166,143,89,0.15)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(166,143,89,0.12)';
                    e.currentTarget.style.borderColor = 'rgba(166,143,89,0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(18,18,18,0.8)';
                    e.currentTarget.style.borderColor = 'rgba(166,143,89,0.15)';
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium tracking-widest uppercase" style={{ color: '#F5F1EB' }}>{item.label}</span>
                  </div>
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#A68F59' }}>{item.range}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Category Navigation */}
      <section className="py-20 border-b" style={{ backgroundColor: '#0E0E0E', borderColor: 'rgba(166,143,89,0.15)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
                <div style={{ height: '1px', width: '30px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
                <p className="mono-label">Browse By Category</p>
                <div className="sm:hidden" style={{ height: '1px', width: '30px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              </div>
              <h2 className="display-grotesk text-3xl sm:text-4xl md:text-5xl" style={{ color: '#F5F1EB' }}>Choose Your Service</h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Family', id: '#family', icon: Users },
              { name: 'Brand', id: '#brand', icon: Briefcase },
              { name: 'Product', id: '#commerce', icon: Package },
              { name: 'Aerial', id: '#aerial', icon: Plane },
              { name: 'Events', id: '#events', icon: PartyPopper },
              { name: 'Design', id: '#design', icon: Palette }
            ].map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.button
                  key={index}
                  onClick={() => scrollToSection(category.id)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="rounded-xl p-6 text-center transition-all duration-400 group"
                  style={{ border: '1px solid rgba(166,143,89,0.15)', backgroundColor: '#121212' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(166,143,89,0.4)';
                    e.currentTarget.style.backgroundColor = 'rgba(166,143,89,0.06)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(166,143,89,0.15)';
                    e.currentTarget.style.backgroundColor = '#121212';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <IconComponent className="w-6 h-6 mx-auto mb-3 transition-transform duration-300 group-hover:scale-110" style={{ color: '#A68F59' }} />
                  <div className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#F5F1EB' }}>{category.name}</div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value Statement */}
      <section className="py-24 relative overflow-hidden border-b" style={{ backgroundColor: '#121212', borderColor: 'rgba(166,143,89,0.15)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(166,143,89,0.04) 0%, transparent 60%)'
        }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center flex flex-col items-center"
          >
            <div className="flex items-center gap-4 mb-5">
              <div style={{ height: '1px', width: '30px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="mono-label">Our Value</p>
              <div style={{ height: '1px', width: '30px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
            </div>
            <h2 className="display-grotesk text-4xl sm:text-5xl md:text-6xl max-w-3xl leading-none" style={{ color: '#F5F1EB' }}>
              Why Our Pricing Reflects Our Value
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: 'Dedicated Time', description: 'We track our hours to maintain high-quality, intentional work — not rushed outputs' },
              { icon: Award, title: 'Client-Focused', description: 'We focus on clients who value design, storytelling, and measurable results' },
              { icon: Target, title: 'High Standards', description: 'Every offering is built to set a higher precedent of creative value' },
              { icon: Shield, title: 'Brand Building', description: 'We\'re not here to just "make content" — we build brands with meaning' }
            ].map((item, index) => (
              <RevealOnScroll key={index} mode='3d' delay={index * 0.1}>
                <div
                  className="group rounded-2xl p-8 transition-all duration-500 relative overflow-hidden"
                  style={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(166,143,89,0.15)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(166,143,89,0.4)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(166,143,89,0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 transition-all duration-500 opacity-0 group-hover:opacity-100" style={{ backgroundColor: '#A68F59' }} />
                  <div className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
                       style={{ backgroundColor: 'rgba(166,143,89,0.08)', border: '1px solid rgba(166,143,89,0.2)' }}>
                    <item.icon className="w-6 h-6" style={{ color: '#A68F59' }} />
                  </div>
                  <h3 className="text-lg font-semibold tracking-wide uppercase mb-3" style={{ color: '#F5F1EB', fontFamily: 'var(--font-grotesk)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#9A9088' }}>
                    {item.description}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* All Packages Include */}
      <section className="py-24 border-b" style={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(166,143,89,0.15)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="flex items-center justify-center gap-4 mb-5">
              <div style={{ height: '1px', width: '30px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="mono-label">Inclusions</p>
              <div style={{ height: '1px', width: '30px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
            </div>
            <h2 className="display-grotesk text-4xl sm:text-5xl md:text-6xl mb-6" style={{ color: '#F5F1EB' }}>
              All Packages Include
            </h2>
            <p className="text-lg sm:text-xl" style={{ color: '#9A9088' }}>
              Premium features included in every service
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { title: 'Professional Equipment', description: 'Industry-standard cameras, lighting, and editing software' },
              { title: 'Online Delivery', description: 'Secure gallery or video delivery with download access' },
              { title: 'Pre-Session Consultation', description: 'Planning call to align on vision and goals' },
              { title: 'Usage License', description: 'Commercial or personal use rights included' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="rounded-2xl p-6 transition-all duration-300 relative group"
                style={{ backgroundColor: '#121212', border: '1px solid rgba(166,143,89,0.15)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(166,143,89,0.35)'; e.currentTarget.style.backgroundColor = 'rgba(166,143,89,0.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(166,143,89,0.15)'; e.currentTarget.style.backgroundColor = '#121212'; }}
              >
                <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-100 transition-opacity">
                  <Check className="w-8 h-8" style={{ color: '#A68F59' }} />
                </div>
                <div className="flex flex-col h-full justify-between gap-8 relative z-10">
                  <h3 className="text-lg font-bold tracking-wide uppercase" style={{ color: '#F5F1EB', fontFamily: 'var(--font-grotesk)' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#C8C0B8' }}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-6 text-center border"
            style={{ backgroundColor: 'rgba(166,143,89,0.03)', borderColor: 'rgba(166,143,89,0.2)' }}
          >
            <p className="text-sm font-medium tracking-wide uppercase" style={{ color: '#9A9088' }}>
              <span style={{ color: '#A68F59' }}>Note:</span> All prices are in CAD and subject to 13% HST (Ontario)
            </p>
          </motion.div>
        </div>
      </section>

      {/* Family Photography */}
      <section id="family" className="py-32 border-b relative" style={{ backgroundColor: '#0E0E0E', borderColor: 'rgba(166,143,89,0.15)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 flex flex-col items-center"
          >
            <div className="flex items-center gap-4 mb-5">
              <div style={{ height: '1px', width: '30px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="mono-label">Personal Photography</p>
              <div style={{ height: '1px', width: '30px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
            </div>
            <h2 className="display-grotesk text-4xl sm:text-5xl md:text-6xl mb-6" style={{ color: '#F5F1EB' }}>
              Family Portrait Packages
            </h2>
            <p className="text-lg" style={{ color: '#9A9088' }}>
              Capture timeless moments with your loved ones
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Mini Memories', price: '$450', time: '45 min', photos: '10 photos', popular: false, priceNum: 450 },
              { name: 'Timeless Bonds', price: '$650', time: '1.5 hours', photos: '25 photos', popular: true, priceNum: 650 },
              { name: 'Legacy Heirloom', price: '$950', time: '2 hours', photos: '40+ photos', popular: false, priceNum: 950 }
            ].map((pkg, index) => (
              <RevealOnScroll key={index} mode='3d' delay={index * 0.1}>
              <div
                className={`relative rounded-2xl p-10 text-center transition-all duration-500 hover:shadow-2xl flex flex-col h-full`}
                style={{ 
                  backgroundColor: '#121212',
                  border: `1px solid ${pkg.popular ? 'rgba(166,143,89,0.6)' : 'rgba(166,143,89,0.15)'}`
                }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg"
                       style={{ backgroundColor: '#A68F59', color: '#121212' }}>
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold tracking-widest uppercase mb-6 mt-4" style={{ color: '#F5F1EB', fontFamily: 'var(--font-grotesk)' }}>{pkg.name}</h3>
                <div className="mb-8">
                  <span className="text-5xl font-light" style={{ color: '#F5F1EB' }}>{pkg.price}</span>
                  <p className="text-xs tracking-widest uppercase mt-3" style={{ color: '#A68F59' }}>CAD</p>
                </div>
                <div className="space-y-4 mb-10 flex-grow">
                  <div className="flex items-center justify-center gap-3 text-sm font-medium tracking-wide uppercase" style={{ color: '#C8C0B8' }}>
                    <Clock className="w-4 h-4" style={{ color: '#A68F59' }} />
                    <span>{pkg.time}</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-sm font-medium tracking-wide uppercase" style={{ color: '#C8C0B8' }}>
                    <CheckCircle2 className="w-4 h-4" style={{ color: '#A68F59' }} />
                    <span>{pkg.photos}</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleBookNow(pkg.name, pkg.priceNum, `${pkg.time} session • ${pkg.photos}`)}
                  className="w-full rounded-full py-6 transition-all duration-400 font-bold tracking-widest uppercase text-xs"
                  style={pkg.popular 
                    ? { backgroundColor: '#F5F1EB', color: '#0A0A0A' } 
                    : { backgroundColor: 'transparent', color: '#A68F59', border: '1px solid rgba(166,143,89,0.5)' }}
                  onMouseEnter={(e) => {
                    if (pkg.popular) {
                      e.currentTarget.style.backgroundColor = '#A68F59';
                      e.currentTarget.style.color = '#121212';
                    } else {
                      e.currentTarget.style.backgroundColor = 'rgba(166,143,89,0.1)';
                      e.currentTarget.style.borderColor = 'rgba(166,143,89,0.8)';
                    }
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    if (pkg.popular) {
                      e.currentTarget.style.backgroundColor = '#F5F1EB';
                      e.currentTarget.style.color = '#0A0A0A';
                    } else {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(166,143,89,0.5)';
                    }
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Book Session
                </Button>
              </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Photography */}
      <section id="brand" className="py-32 border-b" style={{ backgroundColor: '#121212', borderColor: 'rgba(166,143,89,0.15)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 flex flex-col items-center"
          >
            <div className="flex items-center gap-4 mb-5">
              <div style={{ height: '1px', width: '30px', backgroundColor: 'rgba(177,100,59,0.5)' }} />
              <p className="mono-label" style={{ color: '#B1643B' }}>Commercial Content</p>
              <div style={{ height: '1px', width: '30px', backgroundColor: 'rgba(177,100,59,0.5)' }} />
            </div>
            <h2 className="display-grotesk text-4xl sm:text-5xl md:text-6xl mb-6" style={{ color: '#F5F1EB' }}>
              CREOVA Brand Identity Series
            </h2>
            <p className="text-lg" style={{ color: '#9A9088' }}>
              Professional visual storytelling for businesses and entrepreneurs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Profile Pro',
                price: '$750',
                description: 'Clean, consistent headshots that represent your brand\'s people with professionalism',
                features: ['1 to 1.5-hour session', 'Up to 10 team members', '1 outfit per person', 'Neutral backgrounds', '1 retouched headshot per person'],
                addon: 'Additional team members $50/person',
                highlighted: false
              },
              {
                name: 'Workspace Stories',
                price: '$1,100',
                description: 'Capture your brand\'s energy, workflow, and culture in an authentic way',
                features: ['2-hour on-location session', 'Group headshots + candids', 'Up to 15 team members', '20+ edited photos', 'Website & social ready'],
                addon: 'Additional team members $40/person',
                highlighted: true
              },
              {
                name: 'Brand Vision Suite',
                price: '$1,600',
                description: 'Complete visual identity experience for brands ready to showcase their story',
                features: ['3–4 hours guided direction', 'Team headshots + BTS', 'Culture/space photography', '50+ curated photos', 'Optional 1-min video (+$300)'],
                addon: 'Additional team members $35/person',
                highlighted: false
              }
            ].map((pkg, index) => (
              <RevealOnScroll key={index} mode='3d' delay={index * 0.12}>
              <div
                className={`relative rounded-2xl p-8 transition-all duration-500 hover:shadow-2xl flex flex-col h-full`}
                style={{ 
                  backgroundColor: 'rgba(166,143,89,0.04)',
                  border: `1px solid ${pkg.highlighted ? 'rgba(177,100,59,0.6)' : 'rgba(166,143,89,0.15)'}`
                }}
              >
                {pkg.highlighted && (
                  <div className="absolute top-0 inset-x-0 h-1 rounded-t-2xl" style={{ backgroundColor: '#B1643B' }} />
                )}
                {pkg.highlighted && (
                  <div className="absolute -top-3 right-8 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg"
                       style={{ backgroundColor: '#B1643B', color: '#F5F1EB' }}>
                    RECOMMENDED
                  </div>
                )}
                <h3 className="text-xl font-bold tracking-widest uppercase mb-4 mt-2" style={{ color: '#F5F1EB', fontFamily: 'var(--font-grotesk)' }}>{pkg.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-light" style={{ color: '#F5F1EB' }}>{pkg.price}</span>
                  <span className="text-xs tracking-widest uppercase ml-3" style={{ color: '#A68F59' }}>starting at</span>
                </div>
                <p className="text-sm mb-8 leading-relaxed" style={{ color: '#9A9088' }}>
                  {pkg.description}
                </p>
                <div className="space-y-4 mb-8 flex-grow">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: pkg.highlighted ? '#B1643B' : '#A68F59' }} />
                      <span style={{ color: '#C8C0B8' }}>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="text-xs font-medium tracking-wide mb-6 py-3 px-4 rounded-lg text-center border" style={{ color: '#A68F59', borderColor: 'rgba(166,143,89,0.2)', backgroundColor: 'rgba(10,10,10,0.5)' }}>
                  {pkg.addon}
                </div>
                <Button 
                  asChild
                  className="w-full rounded-full py-6 transition-all duration-400 font-bold tracking-widest uppercase text-xs group"
                  style={pkg.highlighted 
                    ? { backgroundColor: '#F5F1EB', color: '#0A0A0A' } 
                    : { backgroundColor: 'transparent', color: '#A68F59', border: '1px solid rgba(166,143,89,0.5)' }}
                >
                  <Link to="/booking">
                    <span className="flex items-center gap-2">
                      Get Started
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Button>
              </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Product Photography */}
      <section id="commerce" className="py-32 border-b" style={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(166,143,89,0.15)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 flex flex-col items-center"
          >
            <div className="flex items-center gap-4 mb-5">
              <div style={{ height: '1px', width: '30px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="mono-label">E-Commerce</p>
              <div style={{ height: '1px', width: '30px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
            </div>
            <h2 className="display-grotesk text-4xl sm:text-5xl md:text-6xl mb-6" style={{ color: '#F5F1EB' }}>
              CREOVA Commerce Collection
            </h2>
            <p className="text-lg" style={{ color: '#9A9088' }}>
              For makers, entrepreneurs, and product storytellers
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-10 md:p-14 relative overflow-hidden"
            style={{ backgroundColor: '#121212', border: '1px solid rgba(166,143,89,0.15)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: '#A68F59' }} />
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-5 pointer-events-none" style={{ backgroundColor: '#A68F59', filter: 'blur(40px)' }} />

            <div className="text-center mb-12 relative z-10">
              <h3 className="text-2xl font-bold tracking-widest uppercase mb-6" style={{ color: '#F5F1EB', fontFamily: 'var(--font-grotesk)' }}>Product Spotlight</h3>
              <div className="mb-6 flex justify-center items-end gap-3">
                <span className="text-6xl font-light" style={{ color: '#F5F1EB' }}>$750</span>
                <span className="text-xs font-bold tracking-widest uppercase pb-2" style={{ color: '#A68F59' }}>starting at</span>
              </div>
              <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#C8C0B8' }}>
                Strategic content that helps your product sell and speak for itself
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-y-6 gap-x-10 mb-12 relative z-10">
              {[
                '10 custom-styled product photos (studio or lifestyle)',
                '1-minute product video (demo, feature, or lifestyle)',
                'Flat-lays, in-use scenes, or creative editorial style',
                'Online commercial use license included',
                'Styling consultation (props, moodboard guidance)',
                'Optimized for Shopify, Instagram, Amazon'
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                       style={{ backgroundColor: 'rgba(166, 143, 89, 0.15)' }}>
                    <Check className="w-3 h-3" style={{ color: '#A68F59' }} />
                  </div>
                  <span className="text-sm md:text-base" style={{ color: '#C8C0B8' }}>{feature}</span>
                </div>
              ))}
            </div>

            <div className="text-center relative z-10">
              <Magnetic strength={0.2}>
                <Button 
                  asChild
                  size="lg"
                  className="px-10 py-7 rounded-full transition-all duration-400 font-bold tracking-widest uppercase text-sm group"
                  style={{ backgroundColor: '#F5F1EB', color: '#0A0A0A' }}
                >
                  <Link to="/booking">
                    <span className="flex items-center gap-3">
                      Book Product Session
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
                    </span>
                  </Link>
                </Button>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Aerial Vision */}
      <section id="aerial" className="py-32 border-b" style={{ backgroundColor: '#0E0E0E', borderColor: 'rgba(166,143,89,0.15)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 flex flex-col items-center"
          >
            <Plane className="w-8 h-8 mb-6" style={{ color: '#A68F59' }} />
            <h2 className="display-grotesk text-4xl sm:text-5xl md:text-6xl mb-6" style={{ color: '#F5F1EB' }}>
              CREOVA Aerial Vision Packages
            </h2>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: '#9A9088' }}>
              Cinematic perspectives that elevate your brand from above
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Package 1: Aerial Vision Session */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl p-10 transition-all duration-500 flex flex-col h-full group"
              style={{ backgroundColor: '#121212', border: '1px solid rgba(166,143,89,0.15)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(166,143,89,0.4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(166,143,89,0.15)'; }}
            >
              <div className="text-center mb-10">
                <h3 className="text-xl font-bold tracking-widest uppercase mb-4" style={{ color: '#F5F1EB', fontFamily: 'var(--font-grotesk)' }}>Aerial Vision Session</h3>
                <div className="mb-5 flex justify-center items-end gap-3">
                  <span className="text-5xl font-light" style={{ color: '#F5F1EB' }}>$500</span>
                  <span className="text-xs font-bold tracking-widest uppercase pb-1" style={{ color: '#A68F59' }}>starting at</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#9A9088' }}>
                  A clean, powerful aerial content package for real estate, events, and landscapes.
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {[
                  '1-hour professional drone session',
                  '20+ high-resolution aerial photos',
                  '30–60 second cinematic aerial video',
                  'Licensed & insured drone operator',
                  'Basic colour grading',
                  'Delivery within 3–5 days'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#A68F59' }} />
                    <span className="text-sm" style={{ color: '#C8C0B8' }}>{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                asChild
                className="w-full rounded-full py-6 transition-all duration-400 font-bold tracking-widest uppercase text-xs"
                style={{ backgroundColor: 'transparent', color: '#A68F59', border: '1px solid rgba(166,143,89,0.5)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(166,143,89,0.1)'; e.currentTarget.style.borderColor = 'rgba(166,143,89,0.8)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(166,143,89,0.5)'; }}
              >
                <Link to="/booking">
                  Book Aerial Session
                </Link>
              </Button>
            </motion.div>

            {/* Package 2: Aerial Cinematic Experience */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl p-10 transition-all duration-500 relative flex flex-col h-full"
              style={{ backgroundColor: '#121212', border: '1px solid rgba(177,100,59,0.5)' }}
            >
              <div className="absolute top-0 inset-x-0 h-1.5 rounded-t-2xl" style={{ backgroundColor: '#B1643B' }} />
              <div className="absolute -top-3 right-8 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg" style={{ backgroundColor: '#B1643B', color: '#F5F1EB' }}>
                PREMIUM
              </div>

              <div className="text-center mb-10 mt-2">
                <h3 className="text-xl font-bold tracking-widest uppercase mb-4" style={{ color: '#F5F1EB', fontFamily: 'var(--font-grotesk)' }}>Aerial Cinematic Experience</h3>
                <div className="mb-5 flex justify-center items-end gap-3">
                  <span className="text-5xl font-light" style={{ color: '#F5F1EB' }}>$900</span>
                  <span className="text-xs font-bold tracking-widest uppercase pb-1" style={{ color: '#A68F59' }}>starting at</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#9A9088' }}>
                  Premium cinematic aerial storytelling for brands, events, and tourism campaigns that need more depth and production value.
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {[
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
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#B1643B' }} />
                    <span className="text-sm" style={{ color: '#C8C0B8' }}>{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                asChild
                className="w-full rounded-full py-6 transition-all duration-400 font-bold tracking-widest uppercase text-xs group"
                style={{ backgroundColor: '#F5F1EB', color: '#0A0A0A' }}
              >
                <Link to="/booking">
                  <span className="flex items-center justify-center gap-2">
                    Book Premium Experience
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
            className="rounded-2xl p-10 border"
            style={{ backgroundColor: '#121212', borderColor: 'rgba(166,143,89,0.15)' }}
          >
            <h4 className="text-xl font-bold tracking-widest uppercase mb-8 text-center flex items-center justify-center gap-3" style={{ color: '#F5F1EB', fontFamily: 'var(--font-grotesk)' }}>
              <Plus className="w-5 h-5" style={{ color: '#A68F59' }} />
              Optional Enhancements
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Long-Form Aerial Reel', detail: '2–3 minutes', price: '+ $200' },
                { name: 'Photo + Drone Combo', detail: 'Ground & aerial', price: 'from $750' },
                { name: 'Voiceover Script', detail: 'Professional VO', price: '+ $150' },
                { name: 'Rush Delivery', detail: '48 hours', price: '+ $100' },
                { name: 'Permit Handling', detail: 'If required', price: 'Quoted' },
                { name: 'Additional Location', detail: 'Per location', price: '+ $150' }
              ].map((enhancement, idx) => (
                <div key={idx} className="p-5 rounded-xl border flex flex-col justify-between" style={{ borderColor: 'rgba(166,143,89,0.15)', backgroundColor: 'rgba(245,241,235,0.02)' }}>
                  <div>
                    <div className="text-sm font-semibold tracking-wide uppercase mb-1" style={{ color: '#F5F1EB' }}>{enhancement.name}</div>
                    <div className="text-xs mb-3" style={{ color: '#9A9088' }}>{enhancement.detail}</div>
                  </div>
                  <div className="text-sm font-bold tracking-widest uppercase" style={{ color: '#A68F59' }}>{enhancement.price}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events Coverage */}
      <section id="events" className="py-32 border-b" style={{ backgroundColor: '#121212', borderColor: 'rgba(166,143,89,0.15)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 flex flex-col items-center"
          >
            <div className="flex items-center gap-4 mb-5">
              <div style={{ height: '1px', width: '30px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="mono-label">Event Documentation</p>
              <div style={{ height: '1px', width: '30px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
            </div>
            <h2 className="display-grotesk text-4xl sm:text-5xl md:text-6xl mb-6" style={{ color: '#F5F1EB' }}>
              Event Coverage (Photo + Video)
            </h2>
            <p className="text-lg" style={{ color: '#9A9088' }}>
              Comprehensive documentation of your special occasions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Essence Package', price: '$750', time: '3 hours' },
              { name: 'Signature Story', price: '$1,350', time: '6 hours' },
              { name: 'Heritage Experience', price: '$2,550', time: '8-10 hours' }
            ].map((pkg, index) => (
              <RevealOnScroll key={index} mode='3d' delay={index * 0.1}>
              <div
                className="rounded-2xl p-10 text-center hover:-translate-y-2 transition-transform duration-500 relative"
                style={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(166,143,89,0.2)' }}
              >
                <div className="absolute top-0 inset-x-0 h-1 transition-all duration-500 opacity-0 group-hover:opacity-100" style={{ backgroundColor: '#A68F59' }} />
                <h3 className="text-xl font-bold tracking-widest uppercase mb-6" style={{ color: '#F5F1EB', fontFamily: 'var(--font-grotesk)' }}>{pkg.name}</h3>
                <div className="mb-8">
                  <span className="text-5xl font-light" style={{ color: '#F5F1EB' }}>{pkg.price}</span>
                </div>
                <div className="flex items-center justify-center gap-3 mb-10 text-sm font-medium tracking-wide uppercase" style={{ color: '#C8C0B8' }}>
                  <Clock className="w-4 h-4" style={{ color: '#A68F59' }} />
                  <span>{pkg.time}</span>
                </div>
                <Button
                  asChild
                  className="w-full rounded-full py-6 transition-all duration-400 font-bold tracking-widest uppercase text-xs group"
                  style={{ backgroundColor: '#F5F1EB', color: '#0A0A0A' }}
                >
                  <Link to="/booking">Book Event</Link>
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
            className="mt-16 rounded-2xl p-10 border"
            style={{ backgroundColor: 'rgba(166,143,89,0.03)', borderColor: 'rgba(166,143,89,0.15)' }}
          >
            <h3 className="text-xl font-bold tracking-widest uppercase mb-8 text-center" style={{ color: '#F5F1EB', fontFamily: 'var(--font-grotesk)' }}>
              Popular Event Add-Ons
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-5 rounded-xl border" style={{ backgroundColor: '#121212', borderColor: 'rgba(166,143,89,0.1)' }}>
                <span className="text-sm font-medium tracking-wide uppercase" style={{ color: '#C8C0B8' }}>360 Booth Camera</span>
                <span className="text-sm font-bold" style={{ color: '#A68F59' }}>+$650</span>
              </div>
              <div className="flex justify-between items-center p-5 rounded-xl border" style={{ backgroundColor: '#121212', borderColor: 'rgba(166,143,89,0.1)' }}>
                <span className="text-sm font-medium tracking-wide uppercase" style={{ color: '#C8C0B8' }}>Drone Footage</span>
                <span className="text-sm font-bold" style={{ color: '#A68F59' }}>+$200</span>
              </div>
              <div className="flex justify-between items-center p-5 rounded-xl border" style={{ backgroundColor: '#121212', borderColor: 'rgba(166,143,89,0.1)' }}>
                <span className="text-sm font-medium tracking-wide uppercase" style={{ color: '#C8C0B8' }}>Extra Hour Coverage</span>
                <span className="text-sm font-bold" style={{ color: '#A68F59' }}>+$150</span>
              </div>
              <div className="flex justify-between items-center p-5 rounded-xl border" style={{ backgroundColor: '#121212', borderColor: 'rgba(166,143,89,0.1)' }}>
                <span className="text-sm font-medium tracking-wide uppercase" style={{ color: '#C8C0B8' }}>Same-Day Edit Video</span>
                <span className="text-sm font-bold" style={{ color: '#A68F59' }}>+$300</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Graphic Design */}
      <section id="design" className="py-32 border-b" style={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(166,143,89,0.15)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 flex flex-col items-center"
          >
            <div className="flex items-center gap-4 mb-5">
              <div style={{ height: '1px', width: '30px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="mono-label">Visual Systems</p>
              <div style={{ height: '1px', width: '30px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
            </div>
            <h2 className="display-grotesk text-4xl sm:text-5xl md:text-6xl mb-6" style={{ color: '#F5F1EB' }}>
              Graphic Design & Branding
            </h2>
            <p className="text-lg" style={{ color: '#9A9088' }}>
              Complete visual identity systems for your brand
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Brand Essentials Kit', price: '$600', desc: 'Quick-start pack' },
              { name: 'Visual Starter Identity', price: '$1,200', desc: 'Foundation system' },
              { name: 'Signature Identity Suite', price: '$3,000+', desc: 'Full visual world' }
            ].map((pkg, index) => (
              <RevealOnScroll key={index} mode='3d' delay={index * 0.1}>
              <div
                className="rounded-2xl p-10 text-center transition-all duration-500 hover:-translate-y-2 group"
                style={{ backgroundColor: '#121212', border: '1px solid rgba(166,143,89,0.15)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(166,143,89,0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(166,143,89,0.15)'; }}
              >
                <h3 className="text-xl font-bold tracking-widest uppercase mb-6" style={{ color: '#F5F1EB', fontFamily: 'var(--font-grotesk)' }}>{pkg.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-light" style={{ color: '#F5F1EB' }}>{pkg.price}</span>
                </div>
                <p className="text-sm mb-10 uppercase tracking-widest font-medium" style={{ color: '#A68F59' }}>{pkg.desc}</p>
                <Button
                  asChild
                  className="w-full rounded-full py-6 transition-all duration-400 font-bold tracking-widest uppercase text-xs"
                  style={{ backgroundColor: 'transparent', color: '#A68F59', border: '1px solid rgba(166,143,89,0.5)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(166,143,89,0.1)'; e.currentTarget.style.borderColor = 'rgba(166,143,89,0.8)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(166,143,89,0.5)'; }}
                >
                  <Link to="/booking">Get Quote</Link>
                </Button>
              </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Add-Ons & Extras */}
      <section className="py-24 border-b" style={{ backgroundColor: '#0E0E0E', borderColor: 'rgba(166,143,89,0.15)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="display-grotesk text-4xl sm:text-5xl mb-4" style={{ color: '#F5F1EB' }}>
              Add-Ons & Extras
            </h2>
            <p className="text-lg" style={{ color: '#9A9088' }}>
              Enhance any package with these optional services
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Extra Hour (photo/video)', price: '$100-$150', desc: 'Extend your session coverage' },
              { name: 'Drone Footage', price: '$200', desc: 'Add aerial perspectives' },
              { name: 'Raw (Unedited) Footage', price: '$150', desc: 'Access to all raw files' },
              { name: 'Expedited Delivery', price: '$100', desc: '72-hour turnaround' },
              { name: 'Custom Album', price: 'from $175', desc: 'Professional photo book' },
              { name: 'Travel Outside City', price: 'Custom', desc: 'Quoted per distance' }
            ].map((addon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="rounded-2xl p-8 transition-all duration-300 relative group overflow-hidden"
                style={{ backgroundColor: '#121212', border: '1px solid rgba(166,143,89,0.1)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(166,143,89,0.3)'; e.currentTarget.style.backgroundColor = 'rgba(166,143,89,0.03)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(166,143,89,0.1)'; e.currentTarget.style.backgroundColor = '#121212'; }}
              >
                <div className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: '#A68F59' }} />
                <h4 className="text-sm font-bold tracking-wide uppercase mb-3" style={{ color: '#F5F1EB', fontFamily: 'var(--font-grotesk)' }}>{addon.name}</h4>
                <p className="text-2xl sm:text-3xl mb-3 font-light" style={{ color: '#A68F59' }}>{addon.price}</p>
                <p className="text-sm" style={{ color: '#9A9088' }}>{addon.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-24 border-b" style={{ backgroundColor: '#121212', borderColor: 'rgba(166,143,89,0.15)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="flex items-center justify-center gap-4 mb-5">
              <div style={{ height: '1px', width: '30px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="mono-label">Investments</p>
              <div style={{ height: '1px', width: '30px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
            </div>
            <h2 className="display-grotesk text-4xl sm:text-5xl mb-4" style={{ color: '#F5F1EB' }}>
              Special Offers & Discounts
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Community Rates */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl p-10 hover:-translate-y-2 transition-transform duration-500"
              style={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(166,143,89,0.15)' }}
            >
              <div className="w-12 h-12 rounded-xl mb-8 flex items-center justify-center"
                   style={{ backgroundColor: 'rgba(166,143,89,0.08)', border: '1px solid rgba(166,143,89,0.2)' }}>
                <Star className="w-5 h-5" style={{ color: '#A68F59' }} />
              </div>
              <h3 className="text-xl font-bold tracking-widest uppercase mb-4" style={{ color: '#F5F1EB', fontFamily: 'var(--font-grotesk)' }}>
                Community & Student Rates
              </h3>
              <p className="mb-6 leading-relaxed text-sm" style={{ color: '#C8C0B8' }}>
                Discounted pricing available for students, nonprofits, and grassroots organizations.
              </p>
              <p className="text-xs uppercase tracking-widest" style={{ color: '#9A9088' }}>
                * Proof of affiliation may be required
              </p>
            </motion.div>

            {/* Loyalty Discounts */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl p-10 hover:-translate-y-2 transition-transform duration-500"
              style={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(177,100,59,0.2)' }}
            >
              <div className="w-12 h-12 rounded-xl mb-8 flex items-center justify-center"
                   style={{ backgroundColor: 'rgba(177, 100, 59, 0.08)', border: '1px solid rgba(177,100,59,0.2)' }}>
                <Award className="w-5 h-5" style={{ color: '#B1643B' }} />
              </div>
              <h3 className="text-xl font-bold tracking-widest uppercase mb-6" style={{ color: '#F5F1EB', fontFamily: 'var(--font-grotesk)' }}>
                Loyalty & Referral Discounts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: '#C8C0B8' }}>Photo + Video Bundle</p>
                  <p className="text-3xl font-light" style={{ color: '#B1643B' }}>10% OFF</p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: '#C8C0B8' }}>Returning Clients</p>
                  <p className="text-3xl font-light" style={{ color: '#B1643B' }}>15% OFF</p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: '#C8C0B8' }}>Referral Bonus</p>
                  <p className="text-3xl font-light inline-block mr-1" style={{ color: '#B1643B' }}>$25</p>
                  <p className="text-xs inline-block" style={{ color: '#9A9088' }}>credit</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 rounded-2xl p-8 text-center border"
            style={{ backgroundColor: 'rgba(166,143,89,0.03)', borderColor: 'rgba(166,143,89,0.15)' }}
          >
            <h3 className="text-sm font-bold tracking-widest uppercase mb-5" style={{ color: '#F5F1EB', fontFamily: 'var(--font-grotesk)' }}>
              Booking & Contact
            </h3>
            <div className="flex flex-wrap gap-8 justify-center items-center text-sm tracking-wide" style={{ color: '#C8C0B8' }}>
              <a href="mailto:creativeinnovationspace@gmail.com" className="flex items-center gap-2 hover:text-[#A68F59] transition-colors">
                <Mail className="w-4 h-4" />
                creativeinnovationspace@gmail.com
              </a>
              <span className="hidden sm:inline" style={{ color: '#A68F59' }}>•</span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Ontario – Travel Canada-wide
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Policies Section */}
      <section className="py-24 border-b" style={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(166,143,89,0.15)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="display-grotesk text-3xl sm:text-4xl mb-4" style={{ color: '#F5F1EB' }}>
              Booking Policies & Terms
            </h2>
            <p className="text-lg" style={{ color: '#9A9088' }}>
              Clear, professional terms for every project
            </p>
          </motion.div>
          
          <div className="space-y-6">
            {[
              {
                title: 'Payment Terms',
                items: [
                  'Retainer required to secure your booking date (non-refundable)',
                  'Full payment must be completed before receiving final files',
                  'All major payment methods accepted',
                  'Professional service agreements provided for all bookings'
                ]
              },
              {
                title: 'Cancellation & Rescheduling Policy',
                items: [
                  '24-hour notice required for cancellations or rescheduling',
                  '$150 CAD cancellation fee applies for cancellations within 24 hours',
                  'We\'ll work to accommodate rescheduling based on availability',
                  'Retainer fees are non-refundable but applicable to rescheduled sessions'
                ]
              },
              {
                title: 'What You\'ll Receive',
                items: [
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
                className="border rounded-2xl p-8"
                style={{ borderColor: 'rgba(166,143,89,0.15)', backgroundColor: '#121212' }}
              >
                <h3 className="text-lg font-bold tracking-wide uppercase mb-6 flex items-center gap-4" style={{ color: '#F5F1EB', fontFamily: 'var(--font-grotesk)' }}>
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#A68F59' }} />
                  {section.title}
                </h3>
                <div className="space-y-4 pl-9">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" 
                           style={{ backgroundColor: 'rgba(166,143,89,0.4)' }}></div>
                      <span className="text-sm" style={{ color: '#C8C0B8' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(166,143,89,0.06) 0%, transparent 70%)'
        }} />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="display-grotesk text-5xl md:text-7xl mb-6" style={{ color: '#F5F1EB' }}>
              Ready to Get Started?
            </h2>
            <p className="text-lg mb-12 max-w-xl mx-auto" style={{ color: '#9A9088' }}>
              Book your session or request a custom quote tailored to your needs
            </p>
            <div className="flex flex-wrap gap-5 justify-center">
              <Magnetic strength={0.2}>
                <Button 
                  asChild
                  size="lg" 
                  className="px-10 py-7 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(166,143,89,0.2)]"
                  style={{ backgroundColor: '#F5F1EB', color: '#0A0A0A' }}
                >
                  <Link to="/booking">Book Your Session</Link>
                </Button>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Button 
                  asChild
                  size="lg" 
                  variant="outline"
                  className="px-10 py-7 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-400 hover:-translate-y-1"
                  style={{ 
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(166,143,89,0.5)',
                    color: '#A68F59'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(166,143,89,0.8)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(166,143,89,0.5)'; }}
                >
                  <Link to="/services">View All Services</Link>
                </Button>
              </Magnetic>
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
