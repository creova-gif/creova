import { useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { PageSEO } from '../components/PageSEO';
import { Button } from '../components/ui/button';
import {
  Camera, Video, Palette, TrendingUp, ShoppingBag, Calendar,
  CheckCircle2, Globe, Users, ArrowRight, Heart, Award,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { CommunityInsights } from '../components/CommunityInsights';
import { TrustSignals } from '../components/TrustSignals';
import { ClientLogos } from '../components/ClientLogos';
import { CaseStudy } from '../components/CaseStudy';
import { useLanguage } from '../context/LanguageContext';
import { VideoHero } from '../components/VideoHero';
import { SplitText } from '../components/SplitText';
import { InfiniteMarquee } from '../components/InfiniteMarquee';
import { ScrollScrubText } from '../components/ScrollScrubText';
import heroBackground from '../assets/photo-community-celebration.jpg';
import heroImage1 from '../assets/photo-duo-portrait.jpg';
import heroImage3 from '../assets/photo-duo-bench.jpg';
import teamPhoto from '../assets/photo-team-atrium.jpg';
import photoEvent1 from '../assets/photo-event-market.jpg';
import photoCommunity2 from '../assets/photo-community-chess.jpg';
import photoServicePhotography from '../assets/photo-carnival-portrait.jpg';
import photoSocialLaptop from '../assets/photo-social-laptop.jpg';
import photoServiceEvents from '../assets/photo-service-events.jpg';
import photoServiceVideography from '../assets/photo-service-videography.jpg';
import photoCollage2 from '../assets/photo-collage-2.jpg';
import anime from 'animejs';
import { FloatingOrbs } from '../components/FloatingOrbs';
import { Magnetic } from '../components/Magnetic';
import { TiltCard } from '../components/TiltCard';

function AnimatedStat({ number, label, icon: Icon, delay }: {
  number: string;
  label: string;
  icon: React.ElementType;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const numericStr = number.replace(/[^0-9.]/g, '');
    const suffix = number.replace(/[0-9.]/g, '');
    const target = parseFloat(numericStr) || 0;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !triggered.current) {
          triggered.current = true;
          if (prefersReduced) {
            const display = el.querySelector('[data-counter]');
            if (display) display.textContent = number;
            return;
          }
          const counter = { value: 0 };
          anime({
            targets: counter,
            value: target,
            duration: 1800,
            delay,
            easing: 'easeOutExpo',
            update() {
              const display = el.querySelector('[data-counter]');
              if (display) {
                display.textContent = Math.floor(counter.value) + suffix;
              }
            },
          });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [number, delay]);

  return (
    <div ref={ref} className="flex-1 flex flex-col items-center justify-center text-center py-14 px-8 relative group cursor-default">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(166,143,89,0.05) 0%, transparent 70%)',
      }} />
      <motion.div
        className="relative"
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.4 }}
      >
        <span
          data-counter
          className="block font-light tracking-tight leading-none"
          style={{
            fontSize: 'clamp(64px, 8vw, 112px)',
            color: '#A68F59',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          0{number.replace(/[0-9.]/g, '')}
        </span>
      </motion.div>
      <div className="w-10 my-4" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.45)' }} />
      <p className="text-xs tracking-[0.4em] uppercase" style={{ color: '#7A6F66' }}>{label}</p>
    </div>
  );
}

export function HomePage() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroScrollY } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroParallax = useTransform(heroScrollY, [0, 1], ['0%', '20%']);
  const heroOpacityOut = useTransform(heroScrollY, [0, 0.7], [1, 0]);

  const features = [
    { icon: Camera, title: t('home.feature.1.title'), description: t('home.feature.1.desc'), link: '/services', image: photoServicePhotography, objectPosition: 'center 25%', accent: '#A68F59', startingPrice: '$450' },
    { icon: Video, title: t('home.feature.2.title'), description: t('home.feature.2.desc'), link: '/services', image: photoServiceVideography, objectPosition: 'center top', accent: '#B1643B', startingPrice: '$500' },
    { icon: Palette, title: t('home.feature.3.title'), description: t('home.feature.3.desc'), link: '/services', image: photoCommunity2, objectPosition: 'center 20%', accent: '#A68F59', startingPrice: '$750' },
    { icon: TrendingUp, title: t('home.feature.4.title'), description: t('home.feature.4.desc'), link: '/services', image: photoSocialLaptop, objectPosition: 'center top', accent: '#B1643B', startingPrice: '$950/mo' },
    { icon: ShoppingBag, title: t('home.feature.5.title'), description: t('home.feature.5.desc'), link: '/shop', image: photoEvent1, objectPosition: 'center top', accent: '#A68F59', startingPrice: '$15' },
    { icon: Calendar, title: t('home.feature.6.title'), description: t('home.feature.6.desc'), link: '/experience', image: photoServiceEvents, objectPosition: 'center 40%', accent: '#B1643B', startingPrice: '$750' },
  ];

  const stats = [
    { number: '100+', label: t('home.stat.projects'), icon: Award },
    { number: '5+', label: t('home.stat.communities'), icon: Globe },
    { number: '98%', label: 'Client Satisfaction', icon: Heart },
  ];

  const marqueeItems = [
    t('home.marquee.1'), t('home.marquee.2'), t('home.marquee.3'), t('home.marquee.4'),
    t('home.marquee.5'), t('home.marquee.6'), t('home.marquee.7'), t('home.marquee.8'),
    t('home.marquee.9'), t('home.marquee.10'), t('home.marquee.11'), t('home.marquee.12'),
  ];

  return (
    <div className="overflow-x-hidden" style={{ backgroundColor: '#F5F1EB' }}>
      <PageSEO
        title="BIPOC-Led Creative Agency in Ontario"
        description="CREOVA is a BIPOC-led creative agency offering photography, videography, brand design, and social media services across Ontario and Canada."
      />

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ backgroundColor: '#121212' }}
      >
        <motion.div className="absolute inset-0" style={{ y: heroParallax }}>
          <VideoHero
            videoSrc="/hero-reel.mp4"
            posterSrc={heroBackground}
            fallbackSrc={heroBackground}
            overlay={false}
            className="w-full h-full"
          />
        </motion.div>

        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to right, rgba(18,18,18,0.97) 0%, rgba(18,18,18,0.75) 55%, rgba(18,18,18,0.35) 100%)',
        }} />
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, #A68F59 0%, transparent 50%),
                            radial-gradient(circle at 70% 70%, #B1643B 0%, transparent 60%)`,
        }} />
        <FloatingOrbs />

        <motion.div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10 w-full"
          style={{ opacity: heroOpacityOut }}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(166, 143, 89, 0.15)', border: '1px solid rgba(166, 143, 89, 0.3)' }}
              >
                <Award className="w-4 h-4" style={{ color: '#A68F59' }} />
                <span className="text-sm tracking-wide" style={{ color: '#A68F59' }}>{t('home.hero.badge')}</span>
              </motion.div>

              <div className="mb-8">
                <SplitText
                  text="CREOVA"
                  tag="h1"
                  className="tracking-tight mb-6"
                  style={{ color: '#F5F1EB', lineHeight: '1.02', fontFamily: 'var(--font-display)', fontSize: 'clamp(3.5rem, 6.5vw, 5.5rem)' }}
                  delay={0.2}
                  stagger={0.06}
                  mode="chars"
                />
                <motion.p
                  className="text-xl md:text-2xl font-medium leading-tight mb-2"
                  style={{ color: '#A68F59', letterSpacing: '0.02em' }}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.8 }}
                >
                  {t('home.hero.tagline1')}
                </motion.p>
                <motion.p
                  className="text-xl md:text-2xl font-light"
                  style={{ color: '#7A6F66', letterSpacing: '0.02em' }}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0, duration: 0.8 }}
                >
                  {t('home.hero.tagline2')}
                </motion.p>
              </div>

              <motion.p
                className="text-lg mb-8 leading-relaxed max-w-xl"
                style={{ color: '#E3DCD3' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}
              >
                {t('home.hero.body')}
              </motion.p>

              {/* Availability signal */}
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.35, duration: 0.7 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ backgroundColor: 'rgba(177,100,59,0.1)', border: '1px solid rgba(177,100,59,0.25)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#B1643B' }} />
                <span className="text-xs tracking-wide" style={{ color: '#B1643B' }}>
                  {t('home.hero.availability')}
                </span>
              </motion.div>

              <motion.div className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8 }}>
                <Magnetic strength={0.22}>
                  <Button size="lg"
                    className="group px-6 py-4 sm:px-8 sm:py-6 rounded-xl text-base sm:text-lg border-2 hover:shadow-2xl transition-all duration-500"
                    style={{ backgroundColor: '#F5F1EB', color: '#121212', borderColor: '#F5F1EB' }} asChild>
                    <Link to="/contact" className="flex items-center gap-2">
                      {t('home.cta.get.in.touch')}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </Magnetic>
                <Magnetic strength={0.22}>
                  <Button size="lg" variant="outline"
                    className="px-6 py-4 sm:px-8 sm:py-6 rounded-xl text-base sm:text-lg border-2 backdrop-blur-sm hover:backdrop-blur-md transition-all duration-500"
                    style={{ borderColor: '#A68F59', color: '#A68F59', backgroundColor: 'rgba(166, 143, 89, 0.05)' }} asChild>
                    <Link to="/services">{t('home.cta.our.services')}</Link>
                  </Button>
                </Magnetic>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.8 }}
                className="flex flex-wrap gap-6 mt-10 pt-8 border-t" style={{ borderColor: 'rgba(227, 220, 211, 0.2)' }}>
                {[
                  { icon: Award, text: t('home.hero.badge1') },
                  { icon: Heart, text: t('home.hero.badge2') },
                  { icon: CheckCircle2, text: t('home.hero.badge3') },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <badge.icon className="w-5 h-5" style={{ color: '#A68F59' }} />
                    <span className="text-sm" style={{ color: '#E3DCD3' }}>{badge.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block relative">
              <div className="grid grid-cols-3 gap-6">
                {[
                  { src: heroImage1, alt: 'CREOVA Team', offset: '', rotate: -1 },
                  { src: teamPhoto, alt: 'CREOVA Together', offset: 'mt-16', rotate: 1 },
                  { src: heroImage3, alt: 'CREOVA Community', offset: '', rotate: -1 },
                ].map((img, i) => (
                  <TiltCard
                    key={i}
                    maxAngle={10}
                    className={`aspect-[3/4] overflow-hidden rounded-3xl shadow-2xl ${img.offset}`}
                  >
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="eager" />
                  </TiltCard>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: 'reverse' }}>
          <div className="w-6 h-10 border-2 rounded-full flex items-start justify-center p-2" style={{ borderColor: '#A68F59' }}>
            <div className="w-1 h-2 rounded-full" style={{ backgroundColor: '#A68F59' }} />
          </div>
        </motion.div>
      </section>

      {/* Infinite Marquee */}
      <div className="py-5 overflow-hidden border-y" style={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(166,143,89,0.2)' }}>
        <InfiniteMarquee items={marqueeItems} speed={45} direction="left" />
      </div>

      {/* Stats — anime.js count-up */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.35)' }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.35)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 80% at 50% 50%, rgba(166,143,89,0.07) 0%, transparent 70%)',
        }} />
        <div className="relative flex flex-col md:flex-row">
          {stats.map((stat, index) => (
            <div key={index} className="relative" style={{ flex: 1 }}>
              {index > 0 && (
                <div className="hidden md:block absolute left-0 top-8 bottom-8"
                  style={{ width: '1px', backgroundColor: 'rgba(166,143,89,0.2)' }} />
              )}
              <AnimatedStat number={stat.number} label={stat.label} icon={stat.icon} delay={index * 150} />
            </div>
          ))}
        </div>
      </section>

      {/* SEEN Platform Teaser */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#121212' }}>
        <FloatingOrbs />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 70% 50%, #A68F59 0%, transparent 55%),
                             radial-gradient(circle at 20% 70%, #B1643B 0%, transparent 50%)`,
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#A68F59' }} />
                <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#A68F59' }}>{t('home.seen.badge')}</span>
              </div>
              <h2 className="italic leading-none mb-6 tracking-tight" style={{
                fontSize: 'clamp(4rem, 10vw, 7rem)', color: 'transparent',
                backgroundImage: 'linear-gradient(135deg, #F5F1EB 0%, #A68F59 55%, #B1643B 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
              }}>SEEN</h2>
              <p className="text-base md:text-lg mb-4 leading-relaxed" style={{ color: '#E3DCD3' }}>
                {t('home.seen.desc')}
              </p>
              <p className="text-sm mb-10" style={{ color: '#7A6F66' }}>
                {t('home.seen.features')}
              </p>
              <Magnetic strength={0.22}>
                <Link to="/seen"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-medium tracking-wide transition-all duration-500 hover:shadow-2xl group"
                  style={{ backgroundColor: '#F5F1EB', color: '#121212' }}>
                  {t('home.seen.cta')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Magnetic>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }} viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: t('home.seen.f1.label'), desc: t('home.seen.f1.desc') },
                { label: t('home.seen.f2.label'), desc: t('home.seen.f2.desc') },
                { label: t('home.seen.f3.label'), desc: t('home.seen.f3.desc') },
                { label: t('home.seen.f4.label'), desc: t('home.seen.f4.desc') },
              ].map((item, i) => (
                <motion.div key={item.label}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }} viewport={{ once: true }}
                  className="p-5 rounded-2xl"
                  style={{ backgroundColor: 'rgba(166, 143, 89, 0.07)', border: '1px solid rgba(166, 143, 89, 0.15)' }}>
                  <div className="w-8 h-1 rounded-full mb-3" style={{ backgroundColor: '#A68F59' }} />
                  <div className="text-sm font-medium mb-1" style={{ color: '#F5F1EB' }}>{item.label}</div>
                  <div className="text-xs leading-relaxed" style={{ color: '#7A6F66' }}>{item.desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-32 relative" style={{ backgroundColor: '#121212' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-1/2 h-full" style={{
            backgroundImage: `repeating-linear-gradient(90deg, #A68F59 0px, transparent 1px, transparent 80px)`,
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }} viewport={{ once: true }} className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px" style={{ backgroundColor: '#A68F59' }} />
              <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#A68F59' }}>{t('home.services.badge')}</span>
            </div>
            <SplitText text={t('home.services.heading')} tag="h2"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight"
              style={{ color: '#F5F1EB' }} mode="words" stagger={0.07} />
            <p className="text-base sm:text-xl mt-6 max-w-2xl leading-relaxed" style={{ color: '#7A6F66' }}>
              {t('home.services.sub')}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div key={index}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.08 }} viewport={{ once: true }}>
                <TiltCard
                  spotlight
                  spotlightColor="rgba(166,143,89,0.14)"
                  maxAngle={6}
                  className="group rounded-3xl overflow-hidden transition-shadow duration-700 hover:shadow-2xl"
                  style={{ height: '380px' }}
                >
                  <Link to={feature.link} className="absolute inset-0 z-10" aria-label={feature.title} />
                  <img src={feature.image} alt={feature.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    style={{ objectPosition: feature.objectPosition || 'center center' }}
                    loading="lazy" />
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to top, rgba(18,18,18,0.95) 0%, rgba(18,18,18,0.5) 50%, rgba(18,18,18,0.1) 100%)',
                  }} />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end z-[3]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundColor: 'rgba(166, 143, 89, 0.15)', border: `1px solid rgba(166,143,89,0.3)` }}>
                        <feature.icon className="w-5 h-5" style={{ color: feature.accent }} />
                      </div>
                      <span className="text-xs font-semibold tracking-wide px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: 'rgba(18,18,18,0.7)', color: feature.accent, border: `1px solid ${feature.accent}40`, backdropFilter: 'blur(4px)' }}>
                        From {feature.startingPrice}
                      </span>
                    </div>
                    <h3 className="text-2xl mb-2 tracking-tight" style={{ color: '#F5F1EB' }}>{feature.title}</h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: '#E3DCD3' }}>{feature.description}</p>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500"
                      style={{ color: feature.accent }}>
                      <span className="text-sm font-medium">{t('home.services.explore')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <div className="h-px mt-3 w-0 group-hover:w-full transition-all duration-700"
                      style={{ backgroundColor: feature.accent }} />
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By — real client logos */}
      <ClientLogos />

      {/* Selected Work */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 60% at 50% 0%, rgba(166,143,89,0.07) 0%, transparent 60%)'
        }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
          >
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div style={{ height: '1px', width: '40px', backgroundColor: '#A68F59' }} />
                <span className="text-xs tracking-[0.45em] uppercase" style={{ color: '#A68F59' }}>Selected Work</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight" style={{ color: '#F5F1EB' }}>
                Events we've shot
              </h2>
            </div>
            <Link
              to="/work"
              className="inline-flex items-center gap-2 text-sm tracking-wide transition-colors duration-300 flex-shrink-0"
              style={{ color: '#A68F59' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#F5F1EB'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#A68F59'}
            >
              View all 10 galleries
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* 2×3 preview grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Afro Caribbean Night', subtitle: 'Part II', org: 'BSSC', image: '/card-blackprint-session.jpg', pos: 'center 30%', url: 'https://creova.pixieset.com/afrocaribbeannightpart2/', accent: '#B1643B' },
              { title: 'Hoop for Stars', subtitle: 'BLSA × BUGA', org: 'BLSA · BUGA', image: '/card-blsa.jpg', pos: 'center 35%', url: 'https://creova.pixieset.com/hoopforstarsblsaxbuga/', accent: '#A68F59' },
              { title: 'FBF Podcast Stocks', subtitle: 'Brand Photography', org: 'Future Black Female', image: '/card-fbf.jpg', pos: 'center 20%', url: 'https://creova.pixieset.com/futureblackfemalefbfpodcaststocks/', accent: '#B1643B' },
              { title: 'Level Up Symposium', subtitle: 'Brock University', org: 'Brock University', image: '/card-justin-panel.jpg', pos: 'center 25%', url: 'https://creova.pixieset.com/levelupsymposiumbrockuniversity/', accent: '#A68F59' },
              { title: 'MASLAB × Always Carnival', subtitle: 'Cultural Night', org: 'BSSC', image: '/community-photo.jpg', pos: 'center 25%', url: 'https://creova.pixieset.com/maslabbsscxalwayscarnival/', accent: '#A68F59' },
              { title: 'BLSA Photoshoot', subtitle: 'Brand & Portraits', org: 'BLSA', image: '/photo-beyond-agency.jpg', pos: 'center 25%', url: 'https://creova.pixieset.com/blsaphotoshoot/', accent: '#B1643B' },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.url}
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
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: item.pos }}
                />
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.2) 60%, transparent 100%)'
                }} />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="w-6 mb-2" style={{ height: '1px', backgroundColor: item.accent }} />
                  <p className="text-[10px] tracking-[0.25em] uppercase mb-1" style={{ color: item.accent }}>{item.org}</p>
                  <h3 className="text-base tracking-tight leading-tight" style={{ color: '#F5F1EB' }}>{item.title}</h3>
                  <p className="text-xs mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: 'rgba(245,241,235,0.5)' }}>{item.subtitle}</p>
                </div>
              </motion.a>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/work"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-sm tracking-wide transition-all duration-300"
              style={{ border: '1px solid rgba(166,143,89,0.35)', color: '#A68F59', backgroundColor: 'transparent' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(166,143,89,0.1)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(166,143,89,0.6)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(166,143,89,0.35)';
              }}
            >
              Browse all galleries
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Scroll Scrub Manifesto */}
      <section className="py-32 px-6 relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(166,143,89,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-12 h-px" style={{ backgroundColor: 'rgba(166,143,89,0.5)' }} />
            <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#A68F59' }}>{t('home.manifesto.badge')}</span>
          </div>
          <ScrollScrubText
            text={t('home.manifesto.text')}
            className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed"
            style={{ color: '#F5F1EB', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}
          />
        </div>
      </section>

      <CommunityInsights />

      {/* Fall 2026 Season */}
      <section className="py-28 relative overflow-hidden" style={{ backgroundColor: '#F5F1EB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-3xl aspect-[4/5]">
                  <img src={heroImage1} alt="CREOVA community portrait" className="w-full h-full object-cover" style={{ objectPosition: 'center 20%' }} loading="lazy" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(18,18,18,0.4) 0%, transparent 60%)' }} />
                </div>
                <div className="relative overflow-hidden rounded-3xl aspect-square">
                  <img src="/community-chess-new.jpg" alt="CREOVA community chess session" className="w-full h-full object-cover" style={{ objectPosition: 'center 40%' }} loading="lazy" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative overflow-hidden rounded-3xl aspect-square">
                  <img src={photoCollage2} alt="CREOVA community members" className="w-full h-full object-cover" style={{ objectPosition: 'center 20%' }} loading="lazy" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(18,18,18,0.3) 0%, transparent 70%)' }} />
                </div>
                <div className="relative overflow-hidden rounded-3xl aspect-[4/5]">
                  <img src={teamPhoto} alt="CREOVA team in atrium" className="w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} loading="lazy" />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-px" style={{ backgroundColor: '#B1643B' }} />
                <span className="text-xs tracking-[0.4em] uppercase" style={{ color: '#B1643B' }}>{t('home.fall.badge')}</span>
              </div>
              <SplitText text={t('home.fall.heading')} tag="h2"
                className="text-4xl md:text-5xl mb-6 tracking-tight leading-tight"
                style={{ color: '#121212' }} mode="words" stagger={0.05} />
              <p className="text-lg mb-8 leading-relaxed" style={{ color: '#4A3E36' }}>
                {t('home.fall.desc')}
              </p>
              <div className="space-y-4 mb-10">
                {[
                  { label: t('home.fall.sep.label'), desc: t('home.fall.sep.desc') },
                  { label: t('home.fall.oct.label'), desc: t('home.fall.oct.desc') },
                  { label: t('home.fall.nov.label'), desc: t('home.fall.nov.desc') },
                  { label: t('home.fall.dec.label'), desc: t('home.fall.dec.desc') },
                ].map((item, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }} viewport={{ once: true }}
                    className="flex items-start gap-4 p-4 rounded-2xl"
                    style={{ backgroundColor: 'rgba(166,143,89,0.06)', border: '1px solid rgba(166,143,89,0.12)' }}>
                    <div className="text-sm font-medium w-24 flex-shrink-0 pt-0.5" style={{ color: '#A68F59' }}>{item.label}</div>
                    <div className="text-sm" style={{ color: '#4A3E36' }}>{item.desc}</div>
                  </motion.div>
                ))}
              </div>
              <Link to="/experience"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-medium tracking-wide transition-all duration-500 hover:shadow-xl group"
                style={{ backgroundColor: '#121212', color: '#F5F1EB' }}>
                {t('home.fall.cta')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Editorial Quote Strip */}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#0A0A0A', minHeight: '520px' }}>
        <img src="/community-photo.jpg" alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 30%', opacity: 0.18 }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(166,143,89,0.10) 0%, transparent 70%)',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(166,143,89,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="absolute top-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.35)' }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.35)' }} />
        <div className="relative flex items-center justify-center" style={{ minHeight: '520px', padding: '80px 24px' }}>
          <motion.div className="text-center max-w-5xl"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }} viewport={{ once: true }}>
            <div className="flex items-center justify-center gap-5 mb-10">
              <div style={{ height: '1px', width: '60px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="text-xs tracking-[0.55em] uppercase" style={{ color: '#A68F59' }}>{t('home.editorial.badge')}</p>
              <div style={{ height: '1px', width: '60px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
            </div>
            <div className="leading-none mb-2 select-none" style={{
              fontSize: 'clamp(100px, 14vw, 180px)', color: 'rgba(166,143,89,0.12)',
              fontFamily: 'Georgia, "Times New Roman", serif', lineHeight: '0.6', marginBottom: '-10px',
            }}>"</div>
            <motion.h2
              className="font-light italic text-center"
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 4.5rem)',
                lineHeight: 1.3,
                color: '#F5F1EB',
                letterSpacing: '-0.02em',
                fontFamily: 'var(--font-display)',
              }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              {t('home.editorial.quote')}<br />
              {t('home.editorial.quote2')}{' '}
              <span style={{ color: '#A68F59' }}>{t('home.editorial.highlight')}</span>
            </motion.h2>
            <div className="flex items-center justify-center gap-4 mt-10">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.4)' }} />
              <p className="text-xs tracking-[0.4em] uppercase" style={{ color: 'rgba(166,143,89,0.65)' }}>
                {t('home.editorial.credit')}
              </p>
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.4)' }} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Why CREOVA */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }} viewport={{ once: true }}>
            <div className="h-1 w-24 mb-10" style={{ backgroundColor: '#B1643B' }} />
            <div className="mb-12">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }} viewport={{ once: true }}>
                <SplitText text={t('home.why.heading')} tag="h2"
                  className="text-4xl md:text-5xl lg:text-6xl mb-8 tracking-tight"
                  style={{ color: '#121212' }} mode="words" stagger={0.06} />
                <p className="text-xl mb-10 leading-relaxed" style={{ color: '#4A3E36' }}>
                  {t('home.why.sub')}
                </p>
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { icon: Globe, title: t('home.why.v1.title'), desc: t('home.why.v1.desc') },
                    { icon: TrendingUp, title: t('home.why.v2.title'), desc: t('home.why.v2.desc') },
                    { icon: Users, title: t('home.why.v3.title'), desc: t('home.why.v3.desc') },
                    { icon: Award, title: t('home.why.v4.title'), desc: t('home.why.v4.desc') },
                  ].map((item, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.1 }} viewport={{ once: true }}
                      className="group flex gap-4 p-5 rounded-2xl hover:shadow-lg transition-all duration-300"
                      style={{ backgroundColor: '#F5F1EB' }}>
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: 'rgba(177, 100, 59, 0.1)' }}>
                        <item.icon className="w-6 h-6" style={{ color: '#B1643B' }} />
                      </div>
                      <div>
                        <h3 className="text-lg mb-2 group-hover:text-[#A68F59] transition-colors" style={{ color: '#121212' }}>{item.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: '#4A3E36' }}>{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-10">
                  <Button size="lg"
                    className="group px-8 py-6 rounded-xl text-base border-2 hover:shadow-xl hover:scale-105 transition-all duration-300"
                    style={{ backgroundColor: '#121212', color: '#F5F1EB', borderColor: '#121212' }} asChild>
                    <Link to="/community" className="flex items-center gap-2">
                      {t('home.why.cta')}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <TrustSignals />
      <TestimonialsSection />

      {/* Google Reviews CTA */}
      <section className="py-16 relative overflow-hidden" style={{ backgroundColor: '#F5F1EB' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-between gap-8 rounded-3xl p-8 md:p-10"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E3DCD3', boxShadow: '0 4px 40px rgba(18,18,18,0.06)' }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Google G */}
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold select-none"
                style={{ background: 'linear-gradient(135deg, #4285F4 0%, #34A853 33%, #FBBC05 66%, #EA4335 100%)', color: '#FFFFFF' }}>
                G
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="#FBBC05" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-sm font-semibold" style={{ color: '#121212' }}>5.0</span>
                </div>
                <p className="text-sm font-medium" style={{ color: '#121212' }}>Rated 5 stars on Google</p>
                <p className="text-xs mt-0.5" style={{ color: '#7A6F66' }}>Happy with our work? Share your experience.</p>
              </div>
            </div>
            <a
              href="https://g.page/r/creova/review"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:-translate-y-px"
              style={{ backgroundColor: '#121212', color: '#F5F1EB' }}
            >
              Leave a Review
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      <CaseStudy />

      {/* Urgency + Mini Conversion Block */}
      <section className="py-20" style={{ backgroundColor: '#F5F1EB' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} viewport={{ once: true }}
            className="bg-white rounded-3xl p-10 md:p-14 border-2 shadow-xl"
            style={{ borderColor: '#E3DCD3' }}>
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
                  style={{ backgroundColor: 'rgba(177,100,59,0.08)', border: '1px solid rgba(177,100,59,0.2)' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#B1643B' }} />
                  <span className="text-xs tracking-wide" style={{ color: '#B1643B' }}>{t('home.urgency.badge')}</span>
                </div>
                <h3 className="text-2xl md:text-3xl mb-4 tracking-tight" style={{ color: '#121212' }}>
                  {t('home.urgency.heading')}
                </h3>
                <p className="text-base mb-6 leading-relaxed" style={{ color: '#7A6F66' }}>
                  {t('home.urgency.desc')}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    className="px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300"
                    style={{ backgroundColor: '#121212', color: '#F5F1EB' }} asChild>
                    <Link to="/contact" className="flex items-center gap-2">
                      {t('home.urgency.cta')}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="outline"
                    className="px-6 py-3 rounded-xl border-2 hover:scale-105 transition-all duration-300"
                    style={{ borderColor: '#A68F59', color: '#A68F59' }} asChild>
                    <Link to="/pricing">{t('home.cta.pricing')}</Link>
                  </Button>
                </div>
              </div>
              <div className="flex-shrink-0 flex flex-col gap-4 w-full md:w-48">
                {[
                  { label: t('home.urgency.check1'), check: true },
                  { label: t('home.urgency.check2'), check: true },
                  { label: t('home.urgency.check3'), check: true },
                  { label: t('home.urgency.check4'), check: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#A68F59' }} />
                    <span className="text-sm" style={{ color: '#4A3E36' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden" style={{ backgroundColor: '#121212' }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 70% 30%, #A68F59 0%, transparent 50%),
                             radial-gradient(circle at 30% 70%, #B1643B 0%, transparent 50%)`,
          }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }} viewport={{ once: true }}>
            <div className="h-1 w-24 mx-auto mb-10" style={{ backgroundColor: '#A68F59' }} />
            <SplitText text={t('home.cta.heading')}
              tag="h2" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 sm:mb-8 tracking-tight"
              style={{ color: '#F5F1EB', lineHeight: '1.1' }} mode="words" stagger={0.04} />
            <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto" style={{ color: '#E3DCD3' }}>
              {t('home.cta.desc')}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center items-center">
              <Button size="lg"
                className="group w-full sm:w-auto px-8 py-5 sm:px-10 sm:py-7 rounded-xl text-base sm:text-xl border-2 hover:shadow-2xl hover:scale-105 transition-all duration-500"
                style={{ backgroundColor: '#F5F1EB', color: '#121212', borderColor: '#F5F1EB' }} asChild>
                <Link to="/contact" className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#A68F59' }} />
                  {t('home.cta.book')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline"
                className="w-full sm:w-auto px-8 py-5 sm:px-10 sm:py-7 rounded-xl text-base sm:text-xl border-2 backdrop-blur-sm hover:backdrop-blur-md hover:scale-105 transition-all duration-500"
                style={{ borderColor: '#A68F59', color: '#A68F59', backgroundColor: 'rgba(166, 143, 89, 0.1)' }} asChild>
                <Link to="/pricing">{t('home.cta.pricing')}</Link>
              </Button>
            </div>
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }} viewport={{ once: true }}
              className="text-xs mt-4" style={{ color: '#7A6F66' }}>
              {t('home.cta.note')}
            </motion.p>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }} viewport={{ once: true }}
              className="flex flex-wrap gap-8 justify-center mt-16 pt-12 border-t"
              style={{ borderColor: 'rgba(227, 220, 211, 0.2)' }}>
              {[{ icon: Users, text: t('home.cta.badge1') }, { icon: CheckCircle2, text: t('home.cta.badge2') }, { icon: Globe, text: t('home.cta.badge3') }].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <item.icon className="w-6 h-6" style={{ color: '#A68F59' }} />
                  <span className="text-sm tracking-wide" style={{ color: '#E3DCD3' }}>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
