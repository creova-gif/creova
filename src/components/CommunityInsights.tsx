import { motion } from 'motion/react';
import { Globe, Heart, TrendingUp, Camera, ShoppingBag, Calendar, Palette } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function CommunityInsights() {
  const { t } = useLanguage();
  const topInterests = [
    { icon: Camera, label: t('insights.interest1'), percentage: '85%', color: '#B1643B' },
    { icon: ShoppingBag, label: t('insights.interest2'), percentage: '75%', color: '#A68F59' },
    { icon: Calendar, label: t('insights.interest3'), percentage: '70%', color: '#A2542D' },
    { icon: Palette, label: t('insights.interest4'), percentage: '65%', color: '#8A9777' }
  ];

  const contentDesires = [
    t('insights.content1'),
    t('insights.content2'),
    t('insights.content3'),
    t('insights.content4'),
    t('insights.content5'),
    t('insights.content6'),
  ];

  const globalReach = [
    'Canada',
    t('insights.global.us') || 'United States',
    t('insights.global.uk') || 'United Kingdom',
    'Nigeria',
    'Ghana',
    'Jamaica',
    'Kenya',
    'South Africa',
  ];

  return (
    <section className="py-20" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="h-1 w-16 mx-auto mb-8" style={{ backgroundColor: '#B1643B' }}></div>
          <h2 className="text-3xl md:text-4xl mb-4 tracking-tight" style={{ color: '#121212' }}>
            {t('insights.heading')}
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#4A3E36' }}>
            {t('insights.sub')}
          </p>
        </motion.div>

        {/* Top Interests */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {topInterests.map((interest, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-8 border"
              style={{ backgroundColor: '#F5F1EB', borderColor: '#E3DCD3' }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <interest.icon className="w-8 h-8" style={{ color: interest.color }} />
              </div>
              <div className="text-3xl mb-2" style={{ color: interest.color }}>{interest.percentage}</div>
              <div className="text-sm" style={{ color: '#4A3E36' }}>{interest.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Content Desires */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="p-8 border"
            style={{ backgroundColor: '#F5F1EB', borderColor: '#E3DCD3' }}
          >
            <Heart className="w-8 h-8 mb-4" style={{ color: '#B1643B' }} />
            <h3 className="text-2xl mb-6 tracking-tight" style={{ color: '#121212' }}>
              {t('insights.content.heading')}
            </h3>
            <div className="space-y-3">
              {contentDesires.map((desire, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#A68F59' }}></div>
                  <span style={{ color: '#4A3E36' }}>{desire}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Global Reach */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="p-8 border"
            style={{ backgroundColor: '#F5F1EB', borderColor: '#E3DCD3' }}
          >
            <Globe className="w-8 h-8 mb-4" style={{ color: '#B1643B' }} />
            <h3 className="text-2xl mb-6 tracking-tight" style={{ color: '#121212' }}>
              {t('insights.global.heading')}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {globalReach.slice(0, 8).map((location, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#A68F59' }}></div>
                  <span style={{ color: '#4A3E36' }}>{location}</span>
                </div>
              ))}
              <div className="text-sm mt-2" style={{ color: '#A68F59' }}>{t('insights.global.more')}</div>
            </div>
          </motion.div>
        </div>

        {/* Key Finding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center p-8"
          style={{ backgroundColor: '#121212' }}
        >
          <TrendingUp className="w-10 h-10 mx-auto mb-4" style={{ color: '#A68F59' }} />
          <h3 className="text-2xl mb-3" style={{ color: '#F5F1EB' }}>
            {t('insights.finding.heading')}
          </h3>
          <p className="text-lg" style={{ color: '#E3DCD3' }}>
            {t('insights.finding.desc')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}