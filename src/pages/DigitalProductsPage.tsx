import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner@2.0.3';
import { Download, Heart, ChevronDown, Gift, Star, FileText, Camera, Palette } from 'lucide-react';
import { motion } from 'motion/react';
import { LeadMagnetModal } from '../components/LeadMagnetModal';
import { FloatingOrbs } from '../components/FloatingOrbs';
import { useState } from 'react';

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
    toast.success('Added to waitlist!', { description: `${product.name} — You'll be notified at launch this Summer 2026` });
  };

  const filterTabs = [
    { label: 'ALL', value: 'all' },
    { label: 'BRANDING', value: 'branding' },
    { label: 'CONTENT', value: 'content' },
    { label: 'BUSINESS', value: 'business' },
    { label: 'PHOTOGRAPHY', value: 'photography' },
    { label: 'VIDEO', value: 'video' }
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
    <div style={{ backgroundColor: '#F5F1EB' }}>

      {/* Hero — editorial dark */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
        <FloatingOrbs />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 55% 70% at 10% 60%, rgba(166,143,89,0.08) 0%, transparent 55%),
                       radial-gradient(ellipse 45% 55% at 90% 30%, rgba(177,100,59,0.07) 0%, transparent 55%)`
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(166,143,89,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />
        <div className="absolute top-0 left-0 right-0" style={{ height: '3px', background: warmGradient }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.25)' }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <div className="flex items-center gap-5 mb-8">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="text-xs tracking-[0.55em] uppercase" style={{ color: '#A68F59' }}>CREOVA Digital Studio</p>
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
            </div>

            <h1 className="font-light tracking-tight mb-3" style={{ fontSize: 'clamp(36px, 8vw, 90px)', color: '#F5F1EB', lineHeight: 1 }}>
              DIGITAL
            </h1>
            <h1
              className="font-light tracking-tight mb-6"
              style={{
                fontSize: 'clamp(36px, 8vw, 90px)',
                lineHeight: 1,
                backgroundImage: warmGradient,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              RESOURCES
            </h1>
            <p className="text-sm sm:text-base mb-8 max-w-md font-light" style={{ color: '#7A6F66' }}>
              Templates · Presets · Tools for creative entrepreneurs — built with intention.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-wide"
              style={{ background: warmGradient, color: '#FFFFFF' }}>
              <Download className="w-3.5 h-3.5" />
              Coming Summer 2026 — Join the waitlist
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dark filter bar */}
      <section className="sticky top-0 z-40" style={{ backgroundColor: '#0E0E0E', borderBottom: '1px solid rgba(166,143,89,0.15)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
              {filterTabs.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  className="px-4 sm:px-5 py-4 text-xs tracking-[0.3em] whitespace-nowrap transition-all duration-200 relative flex-shrink-0"
                  style={{ color: filter === item.value ? '#F5F1EB' : '#4A3E36' }}
                >
                  {item.label}
                  {filter === item.value && (
                    <div className="absolute bottom-0 left-4 right-4" style={{ height: '2px', background: warmGradient }} />
                  )}
                </button>
              ))}
            </div>
            <button className="hidden md:flex items-center gap-1 text-xs tracking-widest pr-2 flex-shrink-0" style={{ color: '#4A3E36' }}>
              SORT <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-10" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Image area */}
                <div className="relative aspect-[4/3] mb-3 overflow-hidden" style={{ backgroundColor: '#F5F1EB' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
                    style={{
                      opacity: hoveredProduct === product.id ? 0.85 : 1,
                      transform: hoveredProduct === product.id ? 'scale(1.04)' : 'scale(1)'
                    }}
                  />

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 text-[8px] tracking-widest z-10"
                      style={{ background: warmGradient, color: '#FFFFFF' }}>
                      {product.badge}
                    </div>
                  )}

                  {/* Type badge */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 text-[8px] tracking-widest z-10"
                    style={{ backgroundColor: typeColor[product.type] || 'rgba(18,18,18,0.85)', color: '#FFFFFF' }}>
                    {product.type.toUpperCase()}
                  </div>

                  {/* Hover actions */}
                  <div
                    className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 transition-all duration-300"
                    style={{
                      opacity: hoveredProduct === product.id ? 1 : 0,
                      transform: hoveredProduct === product.id ? 'translateY(0)' : 'translateY(12px)',
                      background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 100%)'
                    }}
                  >
                    <button
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] tracking-widest transition-all"
                      style={{ background: warmGradient, color: '#FFFFFF' }}
                      onClick={() => handlePurchase(product)}
                    >
                      <Download className="w-3 h-3" />
                      PRE-ORDER
                    </button>
                    <button
                      className="w-9 flex items-center justify-center transition-colors"
                      style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#F5F1EB' }}
                    >
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Product info */}
                <div className="space-y-1">
                  <h3 className="text-[10px] tracking-wider leading-snug" style={{ color: '#121212' }}>{product.name}</h3>
                  <p className="text-[9px] tracking-wide leading-relaxed" style={{ color: '#7A6F66' }}>{product.includes}</p>
                  <p className="text-sm font-light" style={{ color: '#121212' }}>${product.price} CAD</p>

                  {/* Description on hover */}
                  {hoveredProduct === product.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-1">
                      <p className="text-[10px] leading-relaxed" style={{ color: '#4A3E36' }}>{product.description}</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info bar — dark editorial */}
      <section className="py-16 relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
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
              <div key={i}>
                <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center rounded-sm" style={{ background: warmGradient }}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-[10px] tracking-[0.4em] mb-2 uppercase" style={{ color: '#F5F1EB' }}>{item.title}</h3>
                <p className="text-xs" style={{ color: '#7A6F66' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — warm gradient section */}
      <section className="py-20 relative overflow-hidden" style={{ background: warmGradient }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xs tracking-[0.5em] mb-4 uppercase" style={{ color: 'rgba(255,255,255,0.65)' }}>Custom Work</p>
            <h2 className="text-2xl sm:text-3xl tracking-tight mb-4 font-light" style={{ color: '#FFFFFF' }}>
              NEED CUSTOM TEMPLATES?
            </h2>
            <p className="text-sm tracking-wide mb-8 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
              We create custom digital products tailored to your brand and business needs
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 text-xs tracking-[0.35em] uppercase transition-all hover:opacity-90"
              style={{ backgroundColor: '#0A0A0A', color: '#F5F1EB' }}
            >
              REQUEST CUSTOM WORK
            </a>
          </motion.div>
        </div>
      </section>

      {/* Free Lead Magnets — editorial cream */}
      <section className="py-20" style={{ backgroundColor: '#F5F1EB' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-5 mb-5">
                <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
                <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>Free Resources</p>
                <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              </div>
              <h2 className="text-2xl sm:text-3xl tracking-tight mb-3 font-light" style={{ color: '#121212' }}>
                FREE LEAD MAGNETS
              </h2>
              <p className="text-sm" style={{ color: '#7A6F66' }}>Exclusive resources to enhance your brand and content strategy</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leadMagnets.map((magnet) => (
                <div
                  key={magnet.id}
                  className="overflow-hidden"
                  style={{ border: '1px solid rgba(18,18,18,0.08)', backgroundColor: '#FFFFFF' }}
                >
                  {/* Dark header band */}
                  <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: '#121212' }}>
                    <div className="flex items-center gap-2">
                      <magnet.icon className="w-4 h-4" style={{ color: '#A68F59' }} />
                      <span className="text-[9px] tracking-widest uppercase" style={{ color: '#A68F59' }}>{magnet.fileType}</span>
                    </div>
                    <span className="text-xs" style={{ color: '#F5F1EB' }}>{magnet.value} value</span>
                  </div>

                  {/* Content body */}
                  <div className="p-5">
                    <h3 className="text-xs tracking-wide mb-2 leading-snug" style={{ color: '#121212' }}>
                      {magnet.title}
                    </h3>
                    <p className="text-xs leading-relaxed mb-4" style={{ color: '#7A6F66' }}>
                      {magnet.description}
                    </p>
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-[9px] tracking-widest uppercase transition-all"
                      style={{ backgroundColor: 'rgba(166,143,89,0.12)', color: '#7A6F66', cursor: 'not-allowed', border: '1px solid rgba(166,143,89,0.2)' }}
                      disabled
                    >
                      <Gift className="w-3 h-3" />
                      Coming Summer 2026
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <LeadMagnetModal isOpen={isLeadMagnetModalOpen} onClose={() => setIsLeadMagnetModalOpen(false)} magnet={selectedLeadMagnet} />
    </div>
  );
}
