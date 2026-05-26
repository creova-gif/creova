import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { CheckCircle2, Check, Target, Award, Shield, Clock, ArrowRight, Star, Users, Briefcase, Package, Plane, PartyPopper, Palette, Plus, Mail, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { FloatingOrbs } from '../components/FloatingOrbs';
import { SplitText } from '../components/SplitText';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { BookingModal } from '../components/BookingModal';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from '../context/LanguageContext';

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
    <div style={{ backgroundColor: '#F5F1EB' }}>
      {/* Availability Banner */}
      <div className="relative z-40 py-3 px-4 text-center" style={{ backgroundColor: '#121212', borderBottom: '1px solid rgba(166,143,89,0.25)' }}>
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
              <p className="text-xs tracking-[0.55em] uppercase" style={{ color: '#A68F59' }}>Transparent Pricing</p>
              <div style={{ height: '1px', width: '50px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
            </div>
            <SplitText
              text="Real Value."
              tag="h1"
              mode="chars"
              stagger={0.03}
              className="font-light tracking-tight block"
              style={{ fontSize: 'clamp(56px, 9vw, 120px)', color: '#F5F1EB', lineHeight: 1.0, marginBottom: '0.1em' }}
            />
            <SplitText
              text="Real Results."
              tag="h1"
              mode="chars"
              stagger={0.03}
              delay={0.18}
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
            <p className="text-lg mb-10 leading-relaxed" style={{ color: '#7A6F66', maxWidth: '520px', margin: '0 auto 40px' }}>
              Our pricing reflects dedicated creative time, strategic thinking, and long-term brand value for Canadian businesses
            </p>
            <div className="flex flex-wrap gap-6 justify-center items-center">
              {['Professional Equipment', 'Expert Editing', 'Commercial License'].map((tag, i) => (
                <span key={i} className="flex items-center gap-3">
                  <span className="text-sm tracking-wider" style={{ color: '#A68F59' }}>{tag}</span>
                  {i < 2 && <span style={{ width: '1px', height: '14px', backgroundColor: 'rgba(166,143,89,0.3)', display: 'inline-block' }} />}
                </span>
              ))}
            </div>
          </motion.div>
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
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>Browse By Category</p>
            </div>
            <h2 className="text-3xl font-light tracking-tight" style={{ color: '#121212' }}>Choose Your Service</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
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
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>Our Value</p>
            </div>
            <h2 className="text-4xl font-light tracking-tight" style={{ color: '#121212' }}>
              Why Our Pricing Reflects Our Value
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Clock,
                title: 'Dedicated Time',
                description: 'We track our hours to maintain high-quality, intentional work — not rushed outputs'
              },
              {
                icon: Award,
                title: 'Client-Focused',
                description: 'We focus on clients who value design, storytelling, and measurable results'
              },
              {
                icon: Target,
                title: 'High Standards',
                description: 'Every offering is built to set a higher precedent of creative value'
              },
              {
                icon: Shield,
                title: 'Brand Building',
                description: 'We\'re not here to just "make content" — we build brands with meaning'
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
              All Packages Include
            </h2>
            <p className="text-xl" style={{ color: '#7A6F66' }}>
              Premium features included in every service
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: 'Professional Equipment',
                description: 'Industry-standard cameras, lighting, and editing software'
              },
              {
                title: 'Online Delivery',
                description: 'Secure gallery or video delivery with download access'
              },
              {
                title: 'Pre-Session Consultation',
                description: 'Planning call to align on vision and goals'
              },
              {
                title: 'Usage License',
                description: 'Commercial or personal use rights included'
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
              <span style={{ color: '#121212' }}>Note:</span> All prices are in CAD and subject to 13% HST (Ontario)
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
              Family Portrait Photography
            </h2>
            <p className="text-xl" style={{ color: '#7A6F66' }}>
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
                className={`relative bg-white rounded-2xl p-8 text-center transition-all duration-500 hover:shadow-2xl ${
                  pkg.popular ? 'border-2' : 'border'
                }`}
                style={{ borderColor: pkg.popular ? '#A68F59' : '#E3DCD3' }}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs"
                       style={{ backgroundColor: '#A68F59', color: '#F5F1EB' }}>
                    MOST POPULAR
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
                  onClick={() => handleBookNow(pkg.name, pkg.priceNum, `${pkg.time} session • ${pkg.photos}`)}
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
                  Book Session
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
              CREOVA Brand Identity Series
            </h2>
            <p className="text-xl" style={{ color: '#7A6F66' }}>
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
                className={`relative bg-white rounded-2xl p-8 transition-all duration-500 hover:shadow-2xl ${
                  pkg.highlighted ? 'border-2' : 'border'
                }`}
                style={{ borderColor: pkg.highlighted ? '#B1643B' : '#E3DCD3' }}
              >
                {pkg.highlighted && (
                  <div className="absolute -top-4 right-6 px-4 py-1.5 rounded-full text-xs"
                       style={{ backgroundColor: '#B1643B', color: '#F5F1EB' }}>
                    RECOMMENDED
                  </div>
                )}
                <h3 className="text-2xl mb-3" style={{ color: '#121212' }}>{pkg.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl" style={{ color: '#121212' }}>{pkg.price}</span>
                  <span className="text-sm ml-2" style={{ color: '#7A6F66' }}>starting at</span>
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
                    Add-on: {pkg.addon}
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
                  <Link to="/booking">Get Started</Link>
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
              CREOVA Commerce Collection
            </h2>
            <p className="text-xl" style={{ color: '#7A6F66' }}>
              For makers, entrepreneurs, and product storytellers
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
              <h3 className="text-3xl mb-4" style={{ color: '#121212' }}>Product Spotlight</h3>
              <div className="mb-4">
                <span className="text-5xl" style={{ color: '#121212' }}>$750</span>
                <span className="text-lg ml-2" style={{ color: '#7A6F66' }}>starting at</span>
              </div>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: '#7A6F66' }}>
                Strategic content that helps your product sell and speak for itself
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                '10 custom-styled product photos (studio or lifestyle)',
                '1-minute product video (demo, feature, or lifestyle)',
                'Flat-lays, in-use scenes, or creative editorial style',
                'Online commercial use license included',
                'Styling consultation (props, moodboard guidance)',
                'Optimized for Shopify, Instagram, Amazon'
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
                    Book Product Session
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
              CREOVA Aerial Vision Packages
            </h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#7A6F66' }}>
              Cinematic perspectives that elevate your brand from above
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
                <h3 className="text-3xl mb-4" style={{ color: '#121212' }}>Aerial Vision Session</h3>
                <div className="mb-4">
                  <span className="text-5xl" style={{ color: '#121212' }}>$500</span>
                  <span className="text-lg ml-2" style={{ color: '#7A6F66' }}>starting at</span>
                </div>
                <p className="text-base leading-relaxed" style={{ color: '#7A6F66' }}>
                  A clean, powerful aerial content package for real estate, events, and landscapes.
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  '1-hour professional drone session',
                  '20+ high-resolution aerial photos',
                  '30–60 second cinematic aerial video',
                  'Licensed & insured drone operator',
                  'Basic colour grading',
                  'Delivery within 3–5 days'
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
                    Book Aerial Session
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
                <h3 className="text-3xl mb-4" style={{ color: '#121212' }}>Aerial Cinematic Experience</h3>
                <div className="mb-4">
                  <span className="text-5xl" style={{ color: '#121212' }}>$900</span>
                  <span className="text-lg ml-2" style={{ color: '#7A6F66' }}>starting at</span>
                </div>
                <p className="text-base leading-relaxed" style={{ color: '#7A6F66' }}>
                  Premium cinematic aerial storytelling for brands, events, and tourism campaigns that need more depth and production value.
                </p>
              </div>

              <div className="space-y-3 mb-8">
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
                    Book Premium Experience
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
              Optional Enhancements
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Long-Form Aerial Reel', detail: '2–3 minutes', price: '+ $200' },
                { name: 'Photo + Drone Combo', detail: 'Ground & aerial', price: 'from $750' },
                { name: 'Voiceover Script + Narration', detail: 'Professional VO', price: '+ $150' },
                { name: 'Rush Delivery', detail: '48 hours', price: '+ $100' },
                { name: 'Permit Handling', detail: 'If required', price: 'Quoted' },
                { name: 'Additional Location', detail: 'Per location', price: '+ $150' }
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
              Event Coverage (Photo + Video)
            </h2>
            <p className="text-xl" style={{ color: '#7A6F66' }}>
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
            className="mt-12 bg-white border-2 rounded-2xl p-8"
            style={{ borderColor: '#E3DCD3' }}
          >
            <h3 className="text-2xl mb-6 text-center" style={{ color: '#121212' }}>
              Popular Event Add-Ons
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-4 rounded-xl" style={{ backgroundColor: '#F5F1EB' }}>
                <span style={{ color: '#121212' }}>360 Booth Camera</span>
                <span style={{ color: '#A68F59' }}>+$650</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl" style={{ backgroundColor: '#F5F1EB' }}>
                <span style={{ color: '#121212' }}>Drone Footage</span>
                <span style={{ color: '#A68F59' }}>+$200</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl" style={{ backgroundColor: '#F5F1EB' }}>
                <span style={{ color: '#121212' }}>Extra Hour Coverage</span>
                <span style={{ color: '#A68F59' }}>+$150</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl" style={{ backgroundColor: '#F5F1EB' }}>
                <span style={{ color: '#121212' }}>Same-Day Edit Video</span>
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
              Graphic Design & Branding
            </h2>
            <p className="text-xl" style={{ color: '#7A6F66' }}>
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
                  <Link to="/booking">Get Quote</Link>
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
              Add-Ons & Extras
            </h2>
            <p className="text-xl" style={{ color: '#7A6F66' }}>
              Enhance any package with these optional services
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Extra Hour (photo/video)', price: '$100$150', desc: 'Extend your session coverage' },
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
                className="bg-white border rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                style={{ borderColor: '#E3DCD3' }}
              >
                <h4 className="mb-3" style={{ color: '#121212' }}>{addon.name}</h4>
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
              Special Offers & Discounts
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
                Community & Student Rates
              </h3>
              <p className="mb-4 leading-relaxed" style={{ color: '#7A6F66' }}>
                Discounted pricing available for students, nonprofits, and grassroots organizations.
              </p>
              <p className="text-sm" style={{ color: '#7A6F66' }}>
                Proof of affiliation may be required
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
                Loyalty & Referral Discounts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm mb-1" style={{ color: '#7A6F66' }}>Photo + Video Bundle</p>
                  <p className="text-2xl" style={{ color: '#A68F59' }}>10% OFF</p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: '#7A6F66' }}>Returning Clients</p>
                  <p className="text-2xl" style={{ color: '#A68F59' }}>15% OFF</p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: '#7A6F66' }}>Referral Bonus</p>
                  <p className="text-2xl" style={{ color: '#A68F59' }}>$25</p>
                  <p className="text-xs" style={{ color: '#7A6F66' }}>credit for both</p>
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
              Booking & Contact
            </h3>
            <div className="flex flex-wrap gap-6 justify-center items-center text-lg" style={{ color: '#E3DCD3' }}>
              <span className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                creativeinnovationspace@gmail.com
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Ontario – Travel Canada-wide
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
              Booking Policies & Terms
            </h2>
            <p className="text-xl" style={{ color: '#7A6F66' }}>
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
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-10" style={{ color: '#E3DCD3' }}>
              Book your session or request a custom quote tailored to your needs
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
                <Link to="/booking">Book Your Session</Link>
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
                <Link to="/services">View All Services</Link>
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