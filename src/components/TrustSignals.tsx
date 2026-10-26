import { motion } from 'motion/react';
import { Award, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import logoBrockU from '../assets/logo-brock-university.webp';
import logoBSSC from '../assets/logo-bssc.png';
import logoBLSA from '../assets/logo-blsa.png';

export function TrustSignals() {
  const { t } = useLanguage();

  const partners = [
    {
      nameKey: 'trust.partner1.name',
      descKey: 'trust.partner1.desc',
      logo: logoBrockU,
      logoAlt: 'Brock University',
      logoBg: '#CC0000',
      year: '2024',
    },
    {
      nameKey: 'trust.partner2.name',
      descKey: 'trust.partner2.desc',
      logo: logoBSSC,
      logoAlt: 'BSSC — Black Student Success Centre',
      logoBg: '#2D1011',
      year: '2025',
    },
    {
      nameKey: 'trust.partner3.name',
      descKey: 'trust.partner3.desc',
      logo: logoBLSA,
      logoAlt: 'BLSA — Black Student Association Brock University',
      logoBg: '#FFFFFF',
      year: '2024-2025',
    },
  ];

  const testimonials = [
    {
      quoteKey: 'trust.test1.quote',
      authorKey: 'trust.test1.author',
      orgKey: 'trust.test1.org',
      rating: 5,
    },
    {
      quoteKey: 'trust.test2.quote',
      authorKey: 'trust.test2.author',
      orgKey: 'trust.test2.org',
      rating: 5,
    },
    {
      quoteKey: 'trust.test3.quote',
      authorKey: 'trust.test3.author',
      orgKey: 'trust.test3.org',
      rating: 5,
    },
  ];


  return (
    <section className="py-20" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trusted By Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(198,164,90, 0.1)', border: '1px solid rgba(198,164,90, 0.2)' }}>
            <Award className="w-4 h-4" style={{ color: '#C6A45A' }} />
            <span className="text-sm tracking-wide font-medium" style={{ color: '#C6A45A' }}>{t('trust.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl mb-4" style={{ color: '#2D1011' }}>
            {t('trust.heading')}
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#777777' }}>
            {t('trust.sub')}
          </p>
        </motion.div>

        {/* Partner Logos Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.nameKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-8 rounded-2xl text-center hover:shadow-xl transition-all duration-300"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0' }}
            >
              <div
                className="w-24 h-24 rounded-2xl mx-auto mb-5 flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: partner.logoBg }}
              >
                <img
                  src={partner.logo}
                  alt={partner.logoAlt}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#2D1011' }}>
                {t(partner.nameKey)}
              </h3>
              <p className="text-sm mb-3" style={{ color: '#777777' }}>
                {t(partner.descKey)}
              </p>
              <div className="text-xs tracking-wide" style={{ color: '#C6A45A' }}>
                {t('trust.since')} {partner.year}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(136,119,89, 0.1)', border: '1px solid rgba(136,119,89, 0.2)' }}>
            <Star className="w-4 h-4" style={{ color: '#887759' }} />
            <span className="text-sm tracking-wide font-medium" style={{ color: '#887759' }}>{t('trust.testimonials.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl mb-4" style={{ color: '#2D1011' }}>
            {t('trust.testimonials.heading')}
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-8 rounded-2xl hover:shadow-xl transition-all duration-300"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E0E0E0' }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" style={{ color: '#C6A45A' }} />
                ))}
              </div>
              <p className="text-lg mb-6 italic leading-relaxed" style={{ color: '#777777' }}>
                "{t(testimonial.quoteKey)}"
              </p>
              <div className="border-t pt-4" style={{ borderColor: '#E0E0E0' }}>
                <p className="font-semibold mb-1" style={{ color: '#2D1011' }}>
                  {t(testimonial.authorKey)}
                </p>
                <p className="text-sm" style={{ color: '#777777' }}>
                  {t(testimonial.orgKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
