import { motion } from 'motion/react';
import logoBSSC from '../assets/logo-bssc.png';
import logoBLSA from '../assets/logo-blsa.png';
import logoBrock from '../assets/logo-brock-university.webp';

const IMG_CLIENTS = [
  { name: 'Black Student Success Centre', logo: logoBSSC, url: 'https://brocku.ca/black-student-success-centre/' },
  { name: 'BLSA Brock University', logo: logoBLSA, url: '#' },
  { name: 'Brock University', logo: logoBrock, url: 'https://brocku.ca' },
];

const TEXT_CLIENTS = [
  { abbr: 'FBF', name: 'Future Black Female', url: 'https://futureblackfemale.com/' },
  { abbr: 'BUGA', name: 'Brock University Ghana Association', url: '#' },
  { abbr: 'EASC', name: 'East African Students Club', url: '#' },
  { abbr: 'NSA', name: 'Nigerian Students Association', url: '#' },
  { abbr: 'Tray\nArts', name: 'Tray Arts', url: '#' },
];

export function ClientLogos() {
  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#F5F1EB' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(166,143,89,0.04) 1px, transparent 1px)',
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
            <p className="text-xs tracking-[0.45em] uppercase" style={{ color: '#7A6F66' }}>Trusted By</p>
            <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(18,18,18,0.15)' }} />
          </div>
          <p className="text-sm" style={{ color: '#7A6F66' }}>
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
                className="object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-400"
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

        {/* Text-badge clients */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {TEXT_CLIENTS.map((client, i) => (
            <motion.a
              key={client.name}
              href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-lg transition-all duration-300"
              style={{
                border: '1px solid rgba(18,18,18,0.12)',
                backgroundColor: 'rgba(255,255,255,0.6)',
                color: '#4A3E36',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(166,143,89,0.4)';
                (e.currentTarget as HTMLElement).style.color = '#A68F59';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(18,18,18,0.12)';
                (e.currentTarget as HTMLElement).style.color = '#4A3E36';
              }}
              title={client.name}
            >
              <span className="text-xs tracking-wide font-medium">{client.abbr}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
