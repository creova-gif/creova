import { useEffect, useRef, useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

const warmGradient = 'linear-gradient(135deg, #A68F59 0%, #B1643B 100%)';

function useLiveClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-CA', {
        hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Toronto',
      }).replace(' ', ' ') + ' EST');
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function ContactInfoBanner() {
  const { t } = useLanguage();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const liveTime = useLiveClock();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 40 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const contactInfo = [
    { icon: Phone, label: t('banner.call'), value: '+1 (437) 260-8925', href: 'tel:+14372608925' },
    { icon: Mail, label: t('banner.email'), value: 'support@creova.ca', href: 'mailto:support@creova.ca' },
    { icon: MapPin, label: t('banner.location'), value: t('banner.location.value'), href: 'https://maps.google.com/?q=Niagara+Region+Ontario+Canada' },
    { icon: Clock, label: 'Local Time', value: liveTime || 'Niagara, ON · EST', href: null },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: hidden ? 0 : 1, y: hidden ? -8 : 0, height: hidden ? 0 : 'auto' }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      style={{ backgroundColor: '#0A0A0A', borderBottom: '1px solid rgba(166,143,89,0.18)', overflow: 'hidden' }}
    >
      {/* Warm gradient top stripe */}
      <div style={{ height: '2px', background: warmGradient }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mobile: compact 2-item row */}
        <div className="flex md:hidden items-center justify-between py-2">
          <a
            href="tel:+14372608925"
            className="flex items-center gap-2 group min-w-0"
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-sm flex-shrink-0"
              style={{ backgroundColor: 'rgba(166,143,89,0.12)' }}>
              <Phone className="w-3 h-3" style={{ color: '#A68F59' }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs tracking-[0.3em] uppercase leading-none mb-0.5" style={{ color: '#4A3E36' }}>{t('banner.call')}</p>
              <p className="text-xs truncate group-hover:opacity-70 transition-opacity" style={{ color: '#E3DCD3' }}>+1 (437) 260-8925</p>
            </div>
          </a>
          <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(166,143,89,0.2)' }} />
          <a
            href="mailto:support@creova.ca"
            className="flex items-center gap-2 group min-w-0"
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-sm flex-shrink-0"
              style={{ backgroundColor: 'rgba(166,143,89,0.12)' }}>
              <Mail className="w-3 h-3" style={{ color: '#A68F59' }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs tracking-[0.3em] uppercase leading-none mb-0.5" style={{ color: '#4A3E36' }}>{t('banner.email')}</p>
              <p className="text-xs truncate group-hover:opacity-70 transition-opacity" style={{ color: '#E3DCD3' }}>support@creova.ca</p>
            </div>
          </a>
        </div>

        {/* Desktop: columns + availability signal */}
        <div className="hidden md:flex items-stretch py-0">
          {contactInfo.map((item, index) => {
            const inner = (
              <div className="flex items-center gap-3 px-5 py-3 w-full group">
                <div
                  className="w-7 h-7 flex items-center justify-center rounded-sm flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                  style={{ backgroundColor: 'rgba(166,143,89,0.1)', border: '1px solid rgba(166,143,89,0.15)' }}
                >
                  <item.icon className="w-3.5 h-3.5" style={{ color: '#A68F59' }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] tracking-[0.4em] uppercase leading-none mb-1" style={{ color: '#4A3E36' }}>
                    {item.label}
                  </p>
                  <p className="text-xs tracking-wide truncate leading-none transition-colors duration-200 group-hover:text-[#A68F59]"
                    style={{ color: '#C8C0B8' }}>
                    {item.value}
                  </p>
                </div>
              </div>
            );

            return (
              <div
                key={index}
                className="flex-1"
                style={{ borderRight: '1px solid rgba(166,143,89,0.12)' }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="block w-full h-full"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="w-full h-full">{inner}</div>
                )}
              </div>
            );
          })}

          {/* Availability signal — rightmost */}
          <div className="flex items-center gap-3 px-5 py-3 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ backgroundColor: '#A68F59' }} />
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase leading-none mb-1" style={{ color: '#4A3E36' }}>Availability</p>
              <p className="text-xs leading-none whitespace-nowrap" style={{ color: '#C8C0B8' }}>
                Accepting projects · Q3 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
