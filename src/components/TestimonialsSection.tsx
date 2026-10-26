import { motion } from 'motion/react';
import { MessageCircle, Quote, MapPin, Star } from 'lucide-react';
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
      color: '#887759'
    },
    {
      name: 'Emily Katabaro',
      location: 'Thorold, ON',
      role: t('testimonials.role.emily'),
      quote: t('testimonials.quote.emily'),
      initials: 'EK',
      color: '#C6A45A'
    },
    {
      name: 'Winston Omondi',
      location: 'Birmingham, UK',
      role: t('testimonials.role.winston'),
      quote: t('testimonials.quote.winston'),
      initials: 'WO',
      color: '#887759'
    }
  ];


  // Auto-advance testimonial every 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeTestimonial, testimonials.length]);

  return (
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#2D1011' }}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full" style={{ backgroundColor: '#887759', filter: 'blur(100px)' }}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full" style={{ backgroundColor: '#C6A45A', filter: 'blur(120px)' }}></div>
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
            style={{ backgroundColor: 'rgba(136,119,89, 0.1)', border: '1px solid rgba(136,119,89, 0.3)' }}
          >
            <MessageCircle className="w-4 h-4" style={{ color: '#887759' }} />
            <span className="text-sm tracking-wide" style={{ color: '#887759' }}>{t('testimonials.badge')}</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl mb-6 tracking-tight" style={{ color: '#FFFFFF' }}>
            {t('testimonials.heading')}
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#E0E0E0' }}>
            {t('testimonials.sub')}
          </p>
        </motion.div>

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
              backgroundColor: 'rgba(255,255,255, 0.03)',
              borderColor: 'rgba(136,119,89, 0.3)',
              boxShadow: '0 20px 60px rgba(136,119,89, 0.15)'
            }}
          >
            {/* Decorative Quote Mark */}
            <div className="absolute top-8 right-8 opacity-10">
              <Quote className="w-32 h-32 md:w-48 md:h-48" style={{ color: '#887759' }} />
            </div>

            <div className="relative z-10">
              {/* Avatar & Info */}
              <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-2xl"
                  style={{ 
                    backgroundColor: testimonials[activeTestimonial].color,
                    color: '#FFFFFF',
                    boxShadow: '0 8px 24px rgba(136,119,89, 0.3)'
                  }}
                >
                  {testimonials[activeTestimonial].initials}
                </motion.div>

                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl mb-2" style={{ color: '#FFFFFF' }}>
                    {testimonials[activeTestimonial].name}
                  </h3>
                  <p className="text-lg mb-1" style={{ color: '#C6A45A' }}>
                    {testimonials[activeTestimonial].role}
                  </p>
                  <p className="text-sm flex items-center gap-1" style={{ color: '#E0E0E0' }}>
                    <MapPin className="w-4 h-4" />
                    {testimonials[activeTestimonial].location}
                  </p>
                </div>

                {/* Rating - 5 stars */}
                <div className="hidden md:flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(198,164,90, 0.2)' }}
                    >
                      <Star className="h-4 w-4 fill-current" aria-hidden="true" style={{ color: '#C6A45A' }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <p className="text-xl md:text-2xl leading-relaxed mb-8" style={{ color: '#E0E0E0' }}>
                "{testimonials[activeTestimonial].quote}"
              </p>

              {/* Mobile Rating */}
              <div className="flex md:hidden gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(198,164,90, 0.2)' }}
                  >
                    <Star className="h-4 w-4 fill-current" aria-hidden="true" style={{ color: '#C6A45A' }} />
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
                    backgroundColor: activeTestimonial === index ? '#887759' : 'rgba(224, 224, 224, 0.3)',
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
          <h3 className="text-2xl md:text-3xl mb-8" style={{ color: '#FFFFFF' }}>
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
                  backgroundColor: 'rgba(255,255,255, 0.05)',
                  borderColor: 'rgba(198,164,90, 0.3)',
                  color: '#E0E0E0'
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
