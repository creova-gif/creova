import { motion } from 'motion/react';
import { MessageCircle, Quote, Globe, TrendingUp, CheckCircle, MapPin, Award, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

import { useLanguage } from '../context/LanguageContext';

export function TestimonialsSection() {
  const { t } = useLanguage();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'Mimi',
      location: 'Niagara Falls, ON',
      role: t('testimonials.role.mimi'),
      quote: t('testimonials.quote.mimi'),
      initials: 'MM',
      color: '#B1643B'
    },
    {
      name: 'Emily Katabaro',
      location: 'Thorold, ON',
      role: t('testimonials.role.emily'),
      quote: t('testimonials.quote.emily'),
      initials: 'EK',
      color: '#A68F59'
    },
    {
      name: 'Winston Omondi',
      location: 'Birmingham, UK',
      role: t('testimonials.role.winston'),
      quote: t('testimonials.quote.winston'),
      initials: 'WO',
      color: '#B1643B'
    }
  ];

  const stats = [
    { value: '15+', label: t('testimonials.stat.projects'), icon: Award },
    { value: '5★', label: t('testimonials.stat.rating'), icon: CheckCircle },
    { value: '1+', label: t('testimonials.stat.years'), icon: TrendingUp },
    { value: '5+', label: t('testimonials.stat.communities'), icon: Globe }
  ];

  // Auto-advance testimonial every 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeTestimonial, testimonials.length]);

  return (
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#121212' }}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full" style={{ backgroundColor: '#B1643B', filter: 'blur(100px)' }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full" style={{ backgroundColor: '#A68F59', filter: 'blur(120px)' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: 'rgba(177, 100, 59, 0.1)', border: '1px solid rgba(177, 100, 59, 0.3)' }}
          >
            <MessageCircle className="w-4 h-4" style={{ color: '#B1643B' }} />
            <span className="text-sm tracking-wide" style={{ color: '#B1643B' }}>{t('testimonials.badge')}</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl mb-6 tracking-tight" style={{ color: '#F5F1EB' }}>
            {t('testimonials.heading')}
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#E3DCD3' }}>
            {t('testimonials.sub')}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center p-8 rounded-2xl border backdrop-blur-sm group"
              style={{ 
                backgroundColor: 'rgba(245, 241, 235, 0.05)', 
                borderColor: 'rgba(227, 220, 211, 0.1)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              <stat.icon 
                className="w-10 h-10 mx-auto mb-3 transition-transform group-hover:scale-110" 
                style={{ color: '#B1643B' }} 
              />
              <div className="text-3xl md:text-4xl mb-2" style={{ color: '#B1643B' }}>{stat.value}</div>
              <div className="text-xs tracking-wider uppercase" style={{ color: '#E3DCD3' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Featured Testimonial Carousel */}
        <div className="max-w-5xl mx-auto mb-12">
          <motion.div
            key={activeTestimonial}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
            className="relative p-10 md:p-16 rounded-3xl overflow-hidden border"
            style={{ 
              backgroundColor: 'rgba(245, 241, 235, 0.03)',
              borderColor: 'rgba(177, 100, 59, 0.3)',
              boxShadow: '0 20px 60px rgba(177, 100, 59, 0.15)'
            }}
          >
            {/* Decorative Quote Mark */}
            <div className="absolute top-8 right-8 opacity-10">
              <Quote className="w-32 h-32 md:w-48 md:h-48" style={{ color: '#B1643B' }} />
            </div>

            <div className="relative z-10">
              {/* Avatar & Info */}
              <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-2xl"
                  style={{ 
                    backgroundColor: testimonials[activeTestimonial].color,
                    color: '#F5F1EB',
                    boxShadow: '0 8px 24px rgba(177, 100, 59, 0.3)'
                  }}
                >
                  {testimonials[activeTestimonial].initials}
                </motion.div>

                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl mb-2" style={{ color: '#F5F1EB' }}>
                    {testimonials[activeTestimonial].name}
                  </h3>
                  <p className="text-lg mb-1" style={{ color: '#A68F59' }}>
                    {testimonials[activeTestimonial].role}
                  </p>
                  <p className="text-sm flex items-center gap-1" style={{ color: '#E3DCD3' }}>
                    <MapPin className="w-4 h-4" />
                    {testimonials[activeTestimonial].location}
                  </p>
                </div>

                {/* Rating - 5 Stars */}
                <div className="hidden md:flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(166, 143, 89, 0.2)' }}
                    >
                      <span style={{ color: '#A68F59' }}>★</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <p className="text-xl md:text-2xl leading-relaxed mb-8" style={{ color: '#E3DCD3' }}>
                "{testimonials[activeTestimonial].quote}"
              </p>

              {/* Mobile Rating */}
              <div className="flex md:hidden gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(166, 143, 89, 0.2)' }}
                  >
                    <span style={{ color: '#A68F59' }}>★</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className="group"
                aria-label={`View testimonial ${index + 1}`}
              >
                <div
                  className="w-3 h-3 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: activeTestimonial === index ? '#B1643B' : 'rgba(227, 220, 211, 0.3)',
                    transform: activeTestimonial === index ? 'scale(1.2)' : 'scale(1)'
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl md:text-3xl mb-8" style={{ color: '#F5F1EB' }}>
            {t('testimonials.values.heading')}
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              t('testimonials.value.1'),
              t('testimonials.value.2'), 
              t('testimonials.value.3'),
              t('testimonials.value.4'),
              t('testimonials.value.5'),
              t('testimonials.value.6')
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 rounded-full border backdrop-blur-sm"
                style={{
                  backgroundColor: 'rgba(245, 241, 235, 0.05)',
                  borderColor: 'rgba(166, 143, 89, 0.3)',
                  color: '#E3DCD3'
                }}
              >
                {value}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}