import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

const LOGOS = [
  { name: 'Instagram',  src: 'https://svgl.app/library/instagram-icon.svg',  url: 'https://instagram.com' },
  { name: 'TikTok',     src: 'https://svgl.app/library/tiktok-icon-dark.svg', url: 'https://tiktok.com' },
  { name: 'YouTube',    src: 'https://svgl.app/library/youtube.svg',           url: 'https://youtube.com' },
  { name: 'Facebook',   src: 'https://svgl.app/library/facebook-icon.svg',    url: 'https://facebook.com' },
  { name: 'LinkedIn',   src: 'https://svgl.app/library/linkedin.svg',          url: 'https://linkedin.com' },
  { name: 'Figma',      src: 'https://svgl.app/library/figma.svg',             url: 'https://figma.com' },
  { name: 'Canva',      src: 'https://svgl.app/library/canva.svg',             url: 'https://canva.com' },
  { name: 'Shopify',    src: 'https://svgl.app/library/shopify.svg',           url: 'https://shopify.com' },
  { name: 'Adobe',      src: 'https://svgl.app/library/adobe.svg',             url: 'https://adobe.com' },
  { name: 'Squarespace',src: 'https://svgl.app/library/squarespace.svg',       url: 'https://squarespace.com' },
];

export function ClientLogos() {
  const { t } = useLanguage();
  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#F5F1EB' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(166,143,89,0.04) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-5 mb-4">
            <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(18,18,18,0.15)' }} />
            <p className="text-xs tracking-[0.45em] uppercase" style={{ color: '#7A6F66' }}>
              {t('logos.badge')}
            </p>
            <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(18,18,18,0.15)' }} />
          </div>
          <p className="text-sm" style={{ color: '#7A6F66' }}>
            {t('logos.sub')}
          </p>
        </motion.div>

        <div className="grid grid-cols-5 md:grid-cols-10 gap-6 items-center justify-items-center">
          {LOGOS.map((logo, i) => (
            <motion.a
              key={logo.name}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.12, y: -3 }}
              className="flex flex-col items-center gap-2 group"
              title={logo.name}
            >
              <div
                className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl transition-all duration-300 group-hover:shadow-lg"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  loading="lazy"
                  className="w-7 h-7 md:w-8 md:h-8 object-contain transition-opacity duration-300"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                />
              </div>
              <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ color: '#7A6F66' }}>
                {logo.name}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
