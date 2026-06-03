import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { PageSEO } from '../components/PageSEO';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { Download, Heart, ChevronDown, Gift, Star, FileText, Camera, Palette, Package, Sliders, Wrench, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { LeadMagnetModal } from '../components/LeadMagnetModal';
import { useState } from 'react';
import { SplitText } from '../components/SplitText';
import { Magnetic } from '../components/Magnetic';
import { Link } from 'react-router';

const warmGradient = 'linear-gradient(135deg, #A68F59 0%, #B1643B 100%)';

export function DigitalProductsPage() {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [selectedLeadMagnet, setSelectedLeadMagnet] = useState<any>(null);
  const [isLeadMagnetModalOpen, setIsLeadMagnetModalOpen] = useState(false);

  const leadMagnets = [
    { id: 'photoshoot-checklist', title: 'Ultimate Photoshoot Preparation Checklist', description: 'Complete guide to prepare for your professional photoshoot - what to bring, how to pose, and styling tips.', fileType: 'PDF', value: '$25', icon: Camera, downloadUrl: '#' },
    { id: 'camera-ready-tips', title: '10 Tips for Looking Camera-Ready', description: 'Professional secrets from our photographers on how to look your absolute best on camera.', fileType: 'PDF', value: '$20', icon: Star, downloadUrl: '#' },
    { id: 'brand-color-guide', title: 'Brand Color Psychology Guide', description: 'Learn which colors resonate with your brand values and how to choose the perfect palette.', fileType: 'PDF', value: '$30', icon: Palette, downloadUrl: '#' },
    { id: 'content-planning-template', title: 'Monthly Content Planning Template', description: 'Notion template to organize your content strategy, plan posts, and track performance.', fileType: 'Template', value: '$35', icon: FileText, downloadUrl: '#' }
  ];

  const handleLeadMagnetClick = (magnet: any) => {
    setSelectedLeadMagnet(magnet);
    setIsLeadMagnetModalOpen(true);
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'view_item', { event_category: 'Lead Magnet', event_label: magnet.title });
    }
  };

  const digitalProducts = [
    { id: 'brand-kit-template', name: 'BRAND IDENTITY KIT', price: 69, image: 'https://images.unsplash.com/photo-1727755868081-c25d2b427ce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwYnJhbmQlMjBpZGVudGl0eSUyMGRlc2lnbnxlbnwxfHx8fDE3NjMyMzE2OTF8MA&ixlib=rb-4.1.0&q=80&w=1080', hoverImage: 'https://images.unsplash.com/photo-1727755868081-c25d2b427ce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwYnJhbmQlMjBpZGVudGl0eSUyMGRlc2lnbnxlbnwxfHx8fDE3NjMyMzE2OTF8MA&ixlib=rb-4.1.0&q=80&w=1080', type: 'Templates', description: 'Complete Canva template kit with logo layouts, color palettes, and social media templates', includes: '10+ Canva templates · Brand guide · Social kit', category: 'branding', badge: 'NEW' },
    { id: 'social-media-templates', name: 'SOCIAL MEDIA TEMPLATES', price: 42, image: 'https://images.unsplash.com/photo-1521572089244-e5aaacacca6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMHRlbXBsYXRlJTIwbW9ja3VwfGVufDF8fHx8MTc2MzIyODk0MHww&ixlib=rb-4.1.0&q=80&w=1080', hoverImage: 'https://images.unsplash.com/photo-1521572089244-e5aaacacca6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMHRlbXBsYXRlJTIwbW9ja3VwfGVufDF8fHx8MTc2MzIyODk0MHww&ixlib=rb-4.1.0&q=80&w=1080', type: 'Templates', description: '50+ Instagram, TikTok, and Pinterest templates designed for BIPOC entrepreneurs', includes: '50+ templates · Story & post layouts · Reels covers', category: 'content', badge: 'NEW' },
    { id: 'content-calendar', name: 'CONTENT CALENDAR', price: 28, image: 'https://images.unsplash.com/photo-1676287567295-135ce512839a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW50JTIwY2FsZW5kYXIlMjBwbGFubmluZ3xlbnwxfHx8fDE3NjMyMjg5NDB8MA&ixlib=rb-4.1.0&q=80&w=1080', hoverImage: 'https://images.unsplash.com/photo-1676287567295-135ce512839a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW50JTIwY2FsZW5kYXIlMjBwbGFubmluZ3xlbnwxfHx8fDE3NjMyMjg5NDB8MA&ixlib=rb-4.1.0&q=80&w=1080', type: 'Planning', description: 'Pre-planned social media calendar with prompts, themes, and posting schedules', includes: '30-day plan · Caption prompts · Notion template', category: 'content' },
    { id: 'pricing-guide-template', name: 'PRICING GUIDE', price: 55, image: 'https://images.unsplash.com/photo-1623667322051-18662ce6334c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmljaW5nJTIwZ3VpZGUlMjBkb2N1bWVudHxlbnwxfHx8fDE3NjMyMjg5NDB8MA&ixlib=rb-4.1.0&q=80&w=1080', hoverImage: 'https://images.unsplash.com/photo-1623667322051-18662ce6334c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmljaW5nJTIwZ3VpZGUlMjBkb2N1bWVudHxlbnwxfHx8fDE3NjMyMjg5NDB8MA&ixlib=rb-4.1.0&q=80&w=1080', type: 'Business', description: 'Editable pricing guide template for photographers, designers, and creatives', includes: 'InDesign + Canva files · 3 layouts · Calculator', category: 'business' },
    { id: 'lightroom-presets', name: 'LIGHTROOM PRESETS', price: 48, image: 'https://images.unsplash.com/photo-1629590100332-6fb96692f3f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90byUyMGVkaXRpbmclMjBsaWdodHJvb218ZW58MXx8fHwxNzYzMjI4OTQxfDA&ixlib=rb-4.1.0&q=80&w=1080', hoverImage: 'https://images.unsplash.com/photo-1629590100332-6fb96692f3f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90byUyMGVkaXRpbmclMjBsaWdodHJvb218ZW58MXx8fHwxNzYzMjI4OTQxfDA&ixlib=rb-4.1.0&q=80&w=1080', type: 'Presets', description: 'Professional Lightroom presets for warm, vibrant, culturally rich tones', includes: '15 desktop presets · 15 mobile presets · Tutorial', category: 'photography', badge: 'NEW' },
    { id: 'video-intro-templates', name: 'VIDEO TEMPLATES', price: 65, image: 'https://images.unsplash.com/photo-1682506457554-b34c9682e985?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGVkaXRpbmclMjB0ZW1wbGF0ZXN8ZW58MXx8fHwxNzYzMjI4OTQxfDA&ixlib=rb-4.1.0&q=80&w=1080', hoverImage: 'https://images.unsplash.com/photo-1682506457554-b34c9682e985?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGVkaXRpbmclMjB0ZW1wbGF0ZXN8ZW58MXx8fHwxNzYzMjI4OTQxfDA&ixlib=rb-4.1.0&q=80&w=1080', type: 'Video', description: 'Animated video templates for YouTube, TikTok, and Instagram Reels', includes: '5 intro templates · 5 outro templates · Tutorial', category: 'video' },
    { id: 'client-onboarding-kit', name: 'CLIENT ONBOARDING KIT', price: 82, image: 'https://images.unsplash.com/photo-1758519288480-1489c17b1519?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbnRyYWN0JTIwZG9jdW1lbnRzfGVufDF8fHx8MTc2MzIyODk0MXww&ixlib=rb-4.1.0&q=80&w=1080', hoverImage: 'https://images.unsplash.com/photo-1758519288480-1489c17b1519?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbnRyYWN0JTIwZG9jdW1lbnRzfGVufDF8fHx8MTc2MzIyODk0MXww&ixlib=rb-4.1.0&q=80&w=1080', type: 'Business', description: 'Complete onboarding system with contracts, questionnaires, and workflows', includes: 'Contracts · Intake forms · Welcome guide · Emails', category: 'business' },
    { id: 'brand-strategy-workbook', name: 'BRAND STRATEGY WORKBOOK', price: 35, image: 'https://images.unsplash.com/photo-1533749871411-5e21e14bcc7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhdGVneSUyMHdvcmtib29rJTIwcGxhbm5pbmd8ZW58MXx8fHwxNjMyMjg5NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080', hoverImage: 'https://images.unsplash.com/photo-1533749871411-5e21e14bcc7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhdGVneSUyMHdvcmtib29rJTIwcGxhbm5pbmd8ZW58MXx8fHwxNjMyMjg5NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080', type: 'Planning', description: 'Interactive PDF workbook to define your brand voice, values, and visual identity', includes: '40+ pages · Brand exercises · Mood boards', category: 'branding' },
    { id: 'email-marketing-templates', name: 'EMAIL MARKETING SUITE', price: 52, image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWFpbCUyMG1hcmtldGluZyUyMHRlbXBsYXRlfGVufDF8fHx8MTYzMjI4OTQyfDA&ixlib=rb-4.1.0&q=80&w=1080', hoverImage: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWFpbCUyMG1hcmtldGluZyUyMHRlbXBsYXRlfGVufDF8fHx8MTYzMjI4OTQyfDA&ixlib=rb-4.1.0&q=80&w=1080', type: 'Marketing', description: 'Professional email templates for newsletters, promotions, and client communications', includes: '25+ email templates · Welcome sequence · Mailchimp/Klaviyo ready', category: 'content', badge: 'NEW' }
  ];

  const filteredProducts = filter === 'all' ? digitalProducts : digitalProducts.filter(p => p.category === filter);

  const handlePurchase = (product: typeof digitalProducts[0]) => {
    addItem({ id: product.id, name: product.name, price: product.price, type: 'digital', image: product.image });
    toast.success('Added to waitlist!', { description: `${product.name} — You'll be notified at launch this July 2026` });
  };

  const filterTabs = [
    { label: t('digital.filter.all').toUpperCase(), value: 'all' },
    { label: t('digital.filter.branding').toUpperCase(), value: 'branding' },
    { label: t('digital.filter.content').toUpperCase(), value: 'content' },
    { label: t('digital.filter.business').toUpperCase(), value: 'business' },
    { label: t('digital.filter.photography').toUpperCase(), value: 'photography' },
    { label: t('digital.filter.video').toUpperCase(), value: 'video' }
  ];

  const typeColor: Record<string, string> = {
    Templates: 'rgba(166,143,89,0.85)',
    Planning: 'rgba(74,62,54,0.85)',
    Business: 'rgba(18,18,18,0.85)',
    Presets: 'rgba(177,100,59,0.85)',
    Video: 'rgba(18,18,18,0.85)',
    Marketing: 'rgba(166,143,89,0.85)'
  };

  return (
    <div style={{ backgroundColor: '#0A0A0A' }}>
      <PageSEO
        title="Digital Products"
        description="Premium templates, presets, and tools for creatives — brand kits, social media templates, Lightroom presets, content calendars, and more. Launching July 2026."
      />

      {/* Hero — editorial asymmetric split */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0A0A0A', minHeight: '480px' }}>
        {/* Blueprint crosshair + ambient guides */}
        <div className="crosshair-guides" />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 50% 80% at 0% 50%, rgba(166,143,89,0.07) 0%, transparent 60%),
                       radial-gradient(ellipse 40% 60% at 100% 20%, rgba(177,100,59,0.05) 0%, transparent 60%)`
        }} />
        <div className="absolute top-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.2)' }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.2)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-[1fr_auto] gap-0 items-center py-20 sm:py-28">

            {/* LEFT — typographic headline */}
            <div className="relative">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3 mb-6"
              >
                <div style={{ height: '1px', width: '32px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
                <span className="mono-label">CREOVA Digital Studio</span>
                <span className="text-[9px] tracking-[0.3em] uppercase px-2 py-0.5 rounded-sm ml-2" style={{ backgroundColor: 'rgba(166,143,89,0.12)', border: '1px solid rgba(166,143,89,0.25)', color: '#A68F59' }}>July 2026</span>
              </motion.div>

              {/* MASSIVE "Digital." */}
              <SplitText
                text="Digital."
                tag="h1"
                className="display-hero"
                style={{ color: '#F5F1EB' }}
                delay={0.1}
                stagger={0.05}
                mode="chars"
              />

              {/* Small italic "/ Resources." */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22 }}
                className="italic leading-none tracking-tight mb-8"
                style={{
                  fontFamily: 'var(--font-brand)',
                  fontSize: 'clamp(28px, 4vw, 54px)',
                  backgroundImage: warmGradient,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                / Resources.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-base font-light max-w-sm mb-8"
                style={{ color: '#C8C0B8' }}
              >
                Templates · Presets · Tools built for creative entrepreneurs.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs tracking-widest uppercase"
                style={{ backgroundColor: 'rgba(166,143,89,0.1)', color: '#A68F59', border: '1px solid rgba(166,143,89,0.3)' }}
              >
                <Download className="w-3.5 h-3.5" />
                Coming July 2026 — Join waitlist
              </motion.div>
            </div>

            {/* RIGHT — product category tiles */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden md:flex flex-col gap-3 w-64 ml-16 relative z-10"
            >
              {[
                { icon: Package, label: 'Templates', count: '12+', desc: 'Canva · Notion · InDesign', color: '#A68F59' },
                { icon: Sliders, label: 'Presets', count: '30+', desc: 'Lightroom · Mobile', color: '#B1643B' },
                { icon: Wrench, label: 'Tools', count: '8+', desc: 'Workbooks · Guides', color: '#A68F59' },
              ].map((cat, i) => (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-4 px-5 py-4 rounded-xl"
                  style={{
                    backgroundColor: '#121212',
                    border: '1px solid rgba(166,143,89,0.18)',
                  }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(166,143,89,0.1)', border: `1px solid ${cat.color}30` }}>
                    <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium" style={{ color: '#F5F1EB' }}>{cat.label}</span>
                      <span className="text-xs font-semibold" style={{ color: cat.color }}>{cat.count}</span>
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: '#9A9088' }}>{cat.desc}</p>
                  </div>
                </motion.div>
              ))}
              <div className="mt-1 flex items-center gap-2 px-1">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ backgroundColor: '#A68F59' }} />
                <span className="text-[10px] tracking-wide uppercase" style={{ color: '#7A6F66' }}>Launching July 2026</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dark filter bar */}
      <section className="sticky z-40" style={{ top: '64px', backgroundColor: '#0E0E0E', borderBottom: '1px solid rgba(166,143,89,0.2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
              {filterTabs.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  className="px-4 sm:px-5 py-4 text-xs tracking-[0.3em] whitespace-nowrap transition-all duration-200 relative flex-shrink-0"
                  style={{ color: filter === item.value ? '#F5F1EB' : '#7A6F66' }}
                >
                  {item.label}
                  {filter === item.value && (
                    <div className="absolute bottom-0 left-4 right-4" style={{ height: '2px', background: warmGradient }} />
                  )}
                </button>
              ))}
            </div>
            <button className="hidden md:flex items-center gap-1 text-xs tracking-[0.2em] pr-2 flex-shrink-0 uppercase" style={{ color: '#7A6F66' }}>
              SORT <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 relative" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg mb-2" style={{ color: '#F5F1EB' }}>No products in this category yet</p>
              <p className="text-sm" style={{ color: '#9A9088' }}>New digital products dropping July 2026.</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group cursor-pointer rounded-2xl overflow-hidden"
                style={{ backgroundColor: '#121212', border: '1px solid rgba(166,143,89,0.15)' }}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Image area */}
                <div className="relative aspect-[4/3] overflow-hidden" style={{ backgroundColor: '#0E0E0E' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                    style={{
                      opacity: hoveredProduct === product.id ? 0.75 : 1,
                      transform: hoveredProduct === product.id ? 'scale(1.05)' : 'scale(1)'
                    }}
                  />
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to top, rgba(18,18,18,0.9) 0%, transparent 60%)',
                  }} />

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-4 left-4 px-2.5 py-1 text-[9px] tracking-widest z-10 rounded-sm"
                      style={{ background: warmGradient, color: '#FFFFFF' }}>
                      {product.badge}
                    </div>
                  )}

                  {/* Type badge */}
                  <div className="absolute top-4 right-4 px-2.5 py-1 text-[9px] tracking-widest z-10 rounded-sm"
                    style={{ backgroundColor: typeColor[product.type] || 'rgba(18,18,18,0.85)', color: '#FFFFFF' }}>
                    {product.type.toUpperCase()}
                  </div>

                  {/* Hover actions */}
                  <div
                    className="absolute inset-0 p-4 flex flex-col justify-end gap-2 transition-all duration-300"
                    style={{
                      opacity: hoveredProduct === product.id ? 1 : 0,
                      transform: hoveredProduct === product.id ? 'translateY(0)' : 'translateY(12px)',
                    }}
                  >
                    <div className="flex gap-2">
                      <button
                        className="flex-1 flex items-center justify-center gap-2 py-3 text-[10px] tracking-widest uppercase transition-all rounded-sm hover:opacity-90"
                        style={{ backgroundColor: '#F5F1EB', color: '#0A0A0A' }}
                        onClick={() => handlePurchase(product)}
                      >
                        <Download className="w-3.5 h-3.5" />
                        PRE-ORDER
                      </button>
                      <button
                        className="w-10 flex items-center justify-center transition-colors rounded-sm"
                        style={{ backgroundColor: 'rgba(245,241,235,0.1)', color: '#F5F1EB', border: '1px solid rgba(245,241,235,0.2)' }}
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product info */}
                <div className="p-5 space-y-2 relative">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#A68F59] to-[#B1643B] opacity-50" />
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm tracking-wider leading-snug font-medium uppercase" style={{ color: '#F5F1EB' }}>{product.name}</h3>
                    <p className="text-sm font-medium" style={{ color: '#A68F59' }}>${product.price}</p>
                  </div>
                  <p className="text-[11px] tracking-wide leading-relaxed" style={{ color: '#C8C0B8' }}>{product.includes}</p>

                  {/* Description on hover */}
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: hoveredProduct === product.id ? 'auto' : 0, opacity: hoveredProduct === product.id ? 1 : 0 }} 
                    className="overflow-hidden"
                  >
                    <p className="text-xs leading-relaxed pt-2 mt-2 border-t" style={{ color: '#9A9088', borderColor: 'rgba(166,143,89,0.15)' }}>{product.description}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info bar — dark editorial */}
      <section className="py-16 relative overflow-hidden" style={{ backgroundColor: '#0E0E0E' }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.25)' }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.25)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(166,143,89,0.04) 0%, transparent 65%)'
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { title: 'INSTANT DOWNLOAD', desc: 'Access your files immediately after purchase', icon: Download },
              { title: 'COMMERCIAL LICENSE', desc: 'Use freely for client work and business projects', icon: FileText },
              { title: 'LIFETIME UPDATES', desc: 'Free updates and new version drops included', icon: Star }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-10 h-10 mb-4 flex items-center justify-center rounded-full" style={{ border: '1px solid rgba(166,143,89,0.3)', backgroundColor: 'rgba(166,143,89,0.1)' }}>
                  <item.icon className="w-4 h-4 text-[#A68F59]" />
                </div>
                <h3 className="mono-label mb-2">{item.title}</h3>
                <p className="text-xs" style={{ color: '#9A9088' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — dark editorial custom work */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#121212' }}>
        <div className="crosshair-guides" />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(166,143,89,0.08) 0%, transparent 50%)'
        }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="mono-label" style={{ color: '#A68F59' }}>Custom Work</p>
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
            </div>
            <h2 className="display-grotesk text-3xl sm:text-5xl mb-6" style={{ color: '#F5F1EB' }}>
              NEED CUSTOM <span className="text-gold-gradient">TEMPLATES?</span>
            </h2>
            <p className="text-base mb-10 max-w-lg mx-auto" style={{ color: '#C8C0B8' }}>
              We create bespoke digital products, brand kits, and strategy documents tailored to your unique business needs.
            </p>
            <Magnetic strength={0.2}>
              <Button asChild size="lg" className="group px-8 py-6 rounded-full text-sm font-semibold uppercase tracking-widest hover:-translate-y-1 transition-all" style={{ backgroundColor: '#F5F1EB', color: '#0A0A0A' }}>
                <Link to="/contact" className="flex items-center gap-2">
                  REQUEST CUSTOM WORK
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </Magnetic>
          </motion.div>
        </div>
      </section>

      {/* Free Lead Magnets — dark editorial */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#0A0A0A', borderTop: '1px solid rgba(166,143,89,0.15)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(166,143,89,0.1) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.3
        }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
                <p className="mono-label">Free Resources</p>
                <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              </div>
              <h2 className="display-grotesk text-3xl sm:text-5xl mb-4" style={{ color: '#F5F1EB' }}>
                LEAD MAGNETS
              </h2>
              <p className="text-base" style={{ color: '#C8C0B8' }}>Exclusive resources to enhance your brand and content strategy.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leadMagnets.map((magnet, index) => (
                <motion.div
                  key={magnet.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="overflow-hidden rounded-2xl group"
                  style={{ border: '1px solid rgba(166,143,89,0.18)', backgroundColor: '#121212' }}
                >
                  {/* Dark header band */}
                  <div className="px-6 py-4 flex items-center justify-between border-b" style={{ backgroundColor: '#0E0E0E', borderColor: 'rgba(166,143,89,0.12)' }}>
                    <div className="flex items-center gap-3">
                      <magnet.icon className="w-4 h-4" style={{ color: '#A68F59' }} />
                      <span className="text-[10px] tracking-widest uppercase" style={{ color: '#A68F59' }}>{magnet.fileType}</span>
                    </div>
                    <span className="text-xs font-semibold tracking-wider" style={{ color: '#F5F1EB' }}>{magnet.value} value</span>
                  </div>

                  {/* Content body */}
                  <div className="p-6 relative">
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: '#A68F59', opacity: 0.5 }} />
                    <h3 className="text-base tracking-wide mb-3 leading-snug uppercase font-medium" style={{ color: '#F5F1EB' }}>
                      {magnet.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: '#9A9088' }}>
                      {magnet.description}
                    </p>
                    <button
                      className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-semibold tracking-widest uppercase transition-all rounded-sm"
                      style={{ backgroundColor: 'transparent', color: '#7A6F66', cursor: 'not-allowed', border: '1px solid rgba(166,143,89,0.3)' }}
                      disabled
                    >
                      <Gift className="w-3.5 h-3.5" />
                      Coming July 2026
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <LeadMagnetModal isOpen={isLeadMagnetModalOpen} onClose={() => setIsLeadMagnetModalOpen(false)} magnet={selectedLeadMagnet} />
    </div>
  );
}
