import { motion } from 'motion/react';
import logoBSSC from '../assets/logo-bssc.png';
import logoBLSA from '../assets/logo-blsa.png';
import logoBrock from '../assets/logo-brock-university.webp';

const IMG_CLIENTS = [
  { name: 'Black Student Success Centre', logo: logoBSSC, url: 'https://brocku.ca/black-student-success-centre/' },
  { name: 'BLSA Brock University', logo: logoBLSA, url: '#' },
  { name: 'Brock University', logo: logoBrock, url: 'https://brocku.ca' },
];

// Only list a specific organization here once its partnership is verified —
// see FBF above (real, linked). Until then, use a generic category label
// instead of naming a specific club/association we haven't confirmed.
const TEXT_CLIENTS = [
  { abbr: 'FBF', name: 'Future Black Female', url: 'https://futureblackfemale.com/' },
  { abbr: 'Clubs', name: 'Student Clubs', url: '#' },
  { abbr: 'Culture', name: 'Cultural Associations', url: '#' },
  { abbr: 'Community', name: 'Community Groups', url: '#' },
];

export function ClientLogos() {
  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(212,168,67,0.04) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-5 mb-4">
            <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(18,18,18,0.15)' }} />
            <p className="text-xs tracking-[0.45em] uppercase" style={{ color: '#777777' }}>Trusted By</p>
            <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(18,18,18,0.15)' }} />
          </div>
          <p className="text-sm" style={{ color: '#777777' }}>
            BIPOC organizations, student unions & community institutions across Ontario
          </p>
        </motion.div>

        {/* Logo images row */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-8">
          {IMG_CLIENTS.map((client, i) => (
            <motion.a
              key={client.name}
              href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.08, y: -3 }}
              className="flex items-center justify-center transition-all duration-300"
              title={client.name}
            >
              <img
                src={client.logo}
                alt={client.name}
                loading="lazy"
                className="object-contain opacity-100 transition-transform duration-300"
                style={{ height: '48px', maxWidth: '140px' }}
              />
            </motion.a>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1" style={{ height: '1px', backgroundColor: 'rgba(18,18,18,0.08)' }} />
          <span className="text-[10px] tracking-[0.35em] uppercase" style={{ color: 'rgba(18,18,18,0.25)' }}>And More</span>
          <div className="flex-1" style={{ height: '1px', backgroundColor: 'rgba(18,18,18,0.08)' }} />
        </div>

        {/* Text-badge clients — real, linked partners render as links;
            generic category placeholders (no confirmed url) render as
            plain badges so they don't look like dead/broken links. */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {TEXT_CLIENTS.map((client, i) => {
            const isLinked = client.url !== '#';
            const Tag: any = isLinked ? motion.a : motion.div;
            return (
              <Tag
                key={client.name}
                {...(isLinked ? { href: client.url, target: '_blank', rel: 'noopener noreferrer' } : {})}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 rounded-lg transition-all duration-300"
                style={{
                  border: '1px solid rgba(18,18,18,0.12)',
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  color: '#777777',
                  cursor: isLinked ? 'pointer' : 'default',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.4)';
                  (e.currentTarget as HTMLElement).style.color = '#D4A843';
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(18,18,18,0.12)';
                  (e.currentTarget as HTMLElement).style.color = '#777777';
                }}
                title={client.name}
              >
                <span className="text-xs tracking-wide font-medium">{client.abbr}</span>
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
