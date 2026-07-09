import { useState } from 'react';
import { toast } from 'sonner';
import { PageSEO } from '../components/PageSEO';
import { Calendar, MapPin, Users, Clock, Lightbulb, Handshake, Star, ArrowRight, Award, FileText, ExternalLink, Check } from 'lucide-react';
import photoSpotlight1 from '../assets/photo-event-networking.jpg';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { RevealOnScroll } from '../components/RevealOnScroll';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Captcha } from '../components/Captcha';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { logger } from '../utils/logger';
const bsscImage = '/card-bssc.jpg';
const blsaImage = '/card-blsa.jpg';
const busuClubsImage = '/card-busu.jpg';
const fbfImage = '/card-fbf.jpg';

const warmGradient = 'linear-gradient(135deg, #A68F59 0%, #B1643B 100%)';

export function EventsCollaboratePage() {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    collaborationType: '',
    projectDescription: '',
    timeline: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    logger.log('CAPTCHA verified successfully');
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
    logger.log('CAPTCHA expired, please verify again');
    toast.error('Security verification expired. Please verify again.');
  };

  const handleCaptchaError = (error: string) => {
    setCaptchaToken(null);
    if (window.location.hostname === 'creova.ca') {
      toast.error('Security Verification Issue', {
        description: error || 'Unable to verify. Please refresh and try again.'
      });
    }
  };

  const upcomingEvents = [
    {
      id: 'fall-brand-photography',
      name: 'Brand Photography Workshop for Entrepreneurs',
      date: 'September 9, 2026',
      time: '2:00 PM - 5:00 PM EST',
      location: 'St. Catharines, ON (In-Person)',
      capacity: '15 spots',
      price: 125,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&q=80&fit=crop',
      description: 'Learn how to create stunning brand photos for your business. Hands-on workshop covering lighting, composition, and editing for entrepreneurs at every level.',
      includes: ['3-hour workshop', 'Workbook & templates', 'Light refreshments', 'Certificate of completion']
    },
    {
      id: 'social-media-masterclass',
      name: 'Social Media Content Creation Masterclass',
      date: 'September 23, 2026',
      time: '6:00 PM - 8:30 PM EST',
      location: 'Virtual (Zoom)',
      capacity: '50 spots',
      price: 75,
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=900&q=80&fit=crop',
      description: 'Master the art of creating scroll-stopping content for Instagram, TikTok, and Pinterest. Includes content planning, strategy, and hands-on execution.',
      includes: ['2.5-hour virtual class', 'Content calendar template', 'Q&A session', 'Recording access for 30 days']
    },
    {
      id: 'autumn-videography-niagara',
      name: 'Outdoor Videography: Autumn in Niagara Falls',
      date: 'October 1, 2026',
      time: '10:00 AM - 1:00 PM EST',
      location: 'Niagara Falls, ON (In-Person)',
      capacity: '18 spots',
      price: 95,
      image: 'https://images.unsplash.com/photo-1579187707643-35646d22b596?w=900&q=80&fit=crop',
      description: 'Shoot cinematic outdoor video content against Niagara\'s breathtaking fall landscape. Covers filming techniques, stabilization, and audio for outdoor shoots.',
      includes: ['3-hour workshop', 'Equipment demos', 'Footage review', 'Editing cheat sheet']
    },
    {
      id: 'bipoc-creatives-fall-mixer',
      name: 'BIPOC Creatives Fall Networking Mixer',
      date: 'October 7, 2026',
      time: '7:00 PM - 10:00 PM EST',
      location: 'Niagara Falls, ON (In-Person)',
      capacity: '40 spots',
      price: 35,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80&fit=crop',
      description: 'Connect with fellow BIPOC photographers, designers, videographers, and entrepreneurs in Greater Niagara. An evening of genuine community and creative conversation.',
      includes: ['Networking event', 'Food & beverages', 'Portfolio reviews', 'Swag bag']
    },
    {
      id: 'vineyard-brand-shoot',
      name: 'Brand Photography: Harvest Season Vineyard Edition',
      date: 'October 15, 2026',
      time: '1:00 PM - 4:00 PM EST',
      location: 'Niagara Wine Country, ON (In-Person)',
      capacity: '12 spots',
      price: 145,
      image: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=900&q=80&fit=crop',
      description: 'Create stunning autumn brand content at a picturesque Niagara vineyard during harvest season. Perfect for entrepreneurs and small business owners seeking elevated imagery.',
      includes: ['3-hour vineyard session', 'Location access included', 'Editing workshop', 'Wine tasting']
    },
    {
      id: 'lightroom-editing-workshop',
      name: 'Lightroom Editing for Photographers',
      date: 'October 22, 2026',
      time: '1:00 PM - 4:00 PM EST',
      location: 'Virtual (Zoom)',
      capacity: '30 spots',
      price: 95,
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=900&q=80&fit=crop',
      description: 'Deep dive into Adobe Lightroom. Learn professional editing workflows, colour grading, and how to develop your unique visual signature style.',
      includes: ['3-hour live class', 'RAW practice files', 'Preset pack', 'Lifetime recording access']
    },
    {
      id: 'bipoc-fall-harvest-social',
      name: 'BIPOC Creatives Fall Harvest Social',
      date: 'October 28, 2026',
      time: '5:00 PM - 8:00 PM EST',
      location: 'St. Catharines, ON (In-Person)',
      capacity: '35 spots',
      price: 40,
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80&fit=crop',
      description: 'Celebrate the fall season with fellow BIPOC creatives at a warm harvest social. Networking, collaboration, and community — the CREOVA way.',
      includes: ['Seasonal networking', 'Harvest refreshments', 'Portfolio reviews', 'Swag bag']
    },
    {
      id: 'pricing-strategies-workshop',
      name: 'Pricing Your Creative Services Workshop',
      date: 'November 5, 2026',
      time: '10:00 AM - 12:00 PM EST',
      location: 'Virtual (Zoom)',
      capacity: '25 spots',
      price: 65,
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80&fit=crop',
      description: 'Stop undercharging! Learn how to price your photography, design, and creative services for profitability and real market value.',
      includes: ['2-hour workshop', 'Pricing calculator template', 'Pricing guide template', 'Q&A session']
    },
    {
      id: 'golden-hour-portraits-autumn',
      name: 'Golden Hour Portraits: Niagara Autumn Edition',
      date: 'November 12, 2026',
      time: '4:00 PM - 7:00 PM EST',
      location: 'Grimsby, ON (In-Person)',
      capacity: '15 spots',
      price: 85,
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80&fit=crop',
      description: 'Master autumn golden hour portrait photography across stunning Greater Niagara locations. Learn natural light techniques, posing, and fall colour editing.',
      includes: ['3-hour workshop', 'Outdoor photo session', 'Editing guide', 'Certificate of completion']
    },
    {
      id: 'fall-creative-showcase',
      name: 'CREOVA Fall Creative Showcase',
      date: 'November 19, 2026',
      time: '6:00 PM - 10:00 PM EST',
      location: 'St. Catharines, ON (In-Person)',
      capacity: '100 spots',
      price: 45,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900&q=80&fit=crop',
      description: 'Celebrate BIPOC creativity at our flagship fall showcase! Exhibition featuring local photographers, artists, and designers. Live music, art, food, and community.',
      includes: ['Gallery access', 'Live performances', 'Food & drinks', 'Vendor marketplace']
    },
    {
      id: 'fall-foliage-photo-walk',
      name: 'Fall Foliage Photo Walk: Niagara-on-the-Lake',
      date: 'December 2, 2026',
      time: '2:00 PM - 5:00 PM EST',
      location: 'Niagara-on-the-Lake, ON (In-Person)',
      capacity: '20 spots',
      price: 45,
      image: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=900&q=80&fit=crop',
      description: 'Capture the last colours of fall along the charming streets and vineyards of Niagara-on-the-Lake. Guided photo walk with expert tips on landscape and street photography.',
      includes: ['3-hour guided walk', 'Photography tips', 'Light refreshments', 'Group photo critique']
    },
    {
      id: 'holiday-showcase-niagara',
      name: 'CREOVA Holiday Showcase: Greater Niagara Edition',
      date: 'December 10, 2026',
      time: '4:00 PM - 9:00 PM EST',
      location: 'Niagara Falls, ON (In-Person)',
      capacity: '100 spots',
      price: 50,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&q=80&fit=crop',
      description: 'Close out the year celebrating BIPOC creativity! Indoor gallery, live performances, food vendors, and community connection at Niagara Falls — a joyful holiday gathering.',
      includes: ['Indoor gallery access', 'Live music & performances', 'Food & drinks', 'Vendor marketplace']
    }
  ];

  const collaborationTypes = [
    {
      icon: Users,
      title: 'Brand Partnerships',
      description: 'Partner with CREOVA for co-branded content, campaigns, or creative activations',
      examples: ['Co-branded photo series', 'Social media campaigns', 'Product launches', 'Fashion capsule collaborations']
    },
    {
      icon: Lightbulb,
      title: 'Creative Projects',
      description: 'Collaborate on artistic projects, exhibitions, or cultural initiatives',
      examples: ['Photography exhibitions', 'Documentary projects', 'Art installations', 'Community storytelling initiatives']
    },
    {
      icon: Handshake,
      title: 'Community Initiatives',
      description: 'Work together on workshops, events, or programs that support BIPOC creatives',
      examples: ['Free storytelling workshops', 'Skill-building panels', 'Mentorship programs', 'Cultural celebration events']
    },
    {
      icon: Star,
      title: 'Custom Collaborations',
      description: 'Have a unique idea? Let\'s explore how we can work together',
      examples: ['Podcast features', 'Educational content', 'Research projects', 'Creative retreats', 'Sponsored content']
    }
  ];

  const previousCollaborations = [
    {
      title: 'Black Student Success Centre',
      partner: 'Brock University',
      image: bsscImage,
      description: 'Stock photography for the BSSC - February 2025',
      date: 'February 2025',
      social: {
        instagram: 'https://www.instagram.com/brockbssc/',
        website: 'https://brocku.ca/student-life-success/equity-diversity-inclusion/black-student-success-centre/'
      }
    },
    {
      title: 'Black Students Association',
      partner: 'Brock University - BLSA',
      image: blsaImage,
      description: 'New executive team photos for 2025/26 school year at Cairn Complex',
      date: 'September 2025',
      social: {
        instagram: 'https://www.instagram.com/brockblsa/',
        website: 'https://brocku.ca/'
      }
    },
    {
      title: 'Black BUSU Clubs',
      partner: 'Brock University',
      image: busuClubsImage,
      description: 'Welcome Bash event photography - welcoming new Black students to Brock campus',
      date: '2025',
      social: {
        instagram: 'https://www.instagram.com/brocku/',
        website: 'https://busu.net/'
      }
    },
    {
      title: 'Future Black Female',
      partner: 'NGO - Niagara',
      image: fbfImage,
      description: 'Stock photography for upcoming podcast launch and research initiatives',
      date: 'October 2025',
      social: {
        instagram: 'https://www.instagram.com/futureblackfemale_/',
        website: 'https://www.futureblackfemale.com/'
      }
    }
  ];

  const handleBuyTicket = (event: typeof upcomingEvents[0]) => {
    if (event.id === 'innovation-showcase-2026') {
      window.open('https://brocku.ca/linc/innovation-showcase/', '_blank');
      return;
    }
    addItem({
      id: event.id,
      name: event.name,
      price: event.price,
      type: 'event',
      image: event.image
    });
    toast.success('Ticket added to cart!', {
      description: event.price > 0
        ? `${event.name} - $${event.price} CAD (plus 13% HST at checkout)`
        : `${event.name} - FREE`
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      toast.error('Please complete the CAPTCHA verification');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-feacf0d8/submit-collaboration`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${publicAnonKey}` },
          body: JSON.stringify({ ...formData, captchaToken })
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success('Collaboration request submitted!', {
          description: 'We\'ll review your proposal and get back to you within 2-3 business days.'
        });
        setFormData({ name: '', email: '', organization: '', collaborationType: '', projectDescription: '', timeline: '', budget: '' });
      } else {
        throw new Error(data.error || 'Failed to submit collaboration request');
      }
    } catch {
      toast.error('Failed to submit request', { description: 'Please try again or email us directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ backgroundColor: '#F5F1EB' }}>
      <PageSEO
        title="Experience & Events"
        description="Attend CREOVA's events, workshops, and creative experiences across Ontario. Collaborate with BIPOC creatives and cultural storytellers."
      />

      {/* Hero — Asymmetric scale-contrast editorial */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: warmGradient }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ backgroundColor: 'rgba(166,143,89,0.25)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-0 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="py-24 pr-0 lg:pr-16"
              style={{ borderRight: '1px solid rgba(166,143,89,0.1)' }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-px" style={{ backgroundColor: '#A68F59' }} />
                <span className="text-xs tracking-[0.45em] uppercase" style={{ color: '#A68F59' }}>Experience</span>
              </div>
              {/* Scale contrast: MASSIVE first line, small italic second */}
              <h1 className="font-light leading-none tracking-tighter mb-1" style={{ fontSize: 'clamp(64px, 12vw, 160px)', color: '#F5F1EB' }}>
                Events &
              </h1>
              <div className="flex items-end gap-4 mb-8">
                <h1 className="italic leading-none tracking-tight" style={{
                  fontSize: 'clamp(22px, 3.5vw, 42px)',
                  backgroundImage: warmGradient,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}>
                  / Collaborations.
                </h1>
              </div>
              <p className="text-base leading-relaxed max-w-md" style={{ color: '#7A6F66' }}>
                Join CREOVA's creative community through professional workshops, networking events, and meaningful partnerships across Ontario.
              </p>
            </motion.div>

            {/* Right: experience type tiles */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="py-16 pl-0 lg:pl-12 grid grid-cols-2 gap-3"
            >
              {[
                { icon: Calendar, label: 'Cultural Events', count: '10+' },
                { icon: Lightbulb, label: 'Workshops', count: 'Quarterly' },
                { icon: Handshake, label: 'Brand Collabs', count: 'Open' },
                { icon: Users, label: 'Community', count: '500+' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 + i * 0.07 }}
                  className="p-5 rounded-2xl flex flex-col gap-3"
                  style={{ backgroundColor: 'rgba(245,241,235,0.03)', border: '1px solid rgba(166,143,89,0.1)' }}
                >
                  <item.icon className="w-5 h-5" style={{ color: '#A68F59' }} />
                  <div>
                    <div className="text-xl font-light" style={{ color: '#F5F1EB' }}>{item.count}</div>
                    <div className="text-xs tracking-wide uppercase mt-0.5" style={{ color: 'rgba(245,241,235,0.35)' }}>{item.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navigation Cards — bold 2×2 dark grid */}
      <section className="py-16" style={{ backgroundColor: '#0E0E0E' }}>
        <div className="absolute left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.2)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">

            {/* Workshops */}
            <motion.button
              onClick={() => scrollToSection('#workshops')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="group relative rounded-2xl p-7 overflow-hidden text-left transition-all duration-400"
              style={{ border: '1px solid rgba(166,143,89,0.2)', backgroundColor: 'rgba(166,143,89,0.05)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(166,143,89,0.5)';
                e.currentTarget.style.backgroundColor = 'rgba(166,143,89,0.1)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(166,143,89,0.2)';
                e.currentTarget.style.backgroundColor = 'rgba(166,143,89,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                   style={{ border: '1px solid rgba(166,143,89,0.3)', backgroundColor: 'rgba(166,143,89,0.1)' }}>
                <Calendar className="w-4 h-4" style={{ color: '#A68F59' }} />
              </div>
              <h3 className="text-lg tracking-tight mb-2" style={{ color: '#F5F1EB' }}>Upcoming Workshops</h3>
              <p className="text-xs leading-relaxed mb-5" style={{ color: '#4A3E36' }}>Photography & content creation workshops across Ontario</p>
              <div className="flex items-center gap-2 text-xs group-hover:translate-x-1.5 transition-transform duration-300" style={{ color: '#A68F59' }}>
                <span>Explore Events</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </motion.button>

            {/* Partnerships */}
            <motion.button
              onClick={() => scrollToSection('#collaboration')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="group relative rounded-2xl p-7 overflow-hidden text-left transition-all duration-400"
              style={{ border: '1px solid rgba(177,100,59,0.2)', backgroundColor: 'rgba(177,100,59,0.05)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(177,100,59,0.5)';
                e.currentTarget.style.backgroundColor = 'rgba(177,100,59,0.1)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(177,100,59,0.2)';
                e.currentTarget.style.backgroundColor = 'rgba(177,100,59,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                   style={{ border: '1px solid rgba(177,100,59,0.3)', backgroundColor: 'rgba(177,100,59,0.1)' }}>
                <Handshake className="w-4 h-4" style={{ color: '#B1643B' }} />
              </div>
              <h3 className="text-lg tracking-tight mb-2" style={{ color: '#F5F1EB' }}>Partnership Opportunities</h3>
              <p className="text-xs leading-relaxed mb-5" style={{ color: '#4A3E36' }}>Co-branded campaigns, creative projects & community initiatives</p>
              <div className="flex items-center gap-2 text-xs group-hover:translate-x-1.5 transition-transform duration-300" style={{ color: '#B1643B' }}>
                <span>View Opportunities</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </motion.button>

            {/* Previous Work */}
            <motion.button
              onClick={() => scrollToSection('#past-work')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="group relative rounded-2xl p-7 overflow-hidden text-left transition-all duration-400"
              style={{ border: '1px solid rgba(166,143,89,0.2)', backgroundColor: 'rgba(166,143,89,0.05)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(166,143,89,0.5)';
                e.currentTarget.style.backgroundColor = 'rgba(166,143,89,0.1)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(166,143,89,0.2)';
                e.currentTarget.style.backgroundColor = 'rgba(166,143,89,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                   style={{ border: '1px solid rgba(166,143,89,0.3)', backgroundColor: 'rgba(166,143,89,0.1)' }}>
                <Award className="w-4 h-4" style={{ color: '#A68F59' }} />
              </div>
              <h3 className="text-lg tracking-tight mb-2" style={{ color: '#F5F1EB' }}>Past Collaborations</h3>
              <p className="text-xs leading-relaxed mb-5" style={{ color: '#4A3E36' }}>Partner orgs, universities and community organizations</p>
              <div className="flex items-center gap-2 text-xs group-hover:translate-x-1.5 transition-transform duration-300" style={{ color: '#A68F59' }}>
                <span>See Our Work</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </motion.button>

            {/* Submit Proposal — warm gradient card */}
            <motion.button
              onClick={() => scrollToSection('#contact-form')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="group relative rounded-2xl p-7 overflow-hidden text-left transition-all duration-400"
              style={{ background: warmGradient }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(177,100,59,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                   style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <FileText className="w-4 h-4" style={{ color: '#FFFFFF' }} />
              </div>
              <h3 className="text-lg tracking-tight mb-2" style={{ color: '#FFFFFF' }}>Submit Proposal</h3>
              <p className="text-xs leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.75)' }}>Have an idea? Tell us about your project or partnership vision</p>
              <div className="flex items-center gap-2 text-xs group-hover:translate-x-1.5 transition-transform duration-300" style={{ color: 'rgba(255,255,255,0.85)' }}>
                <span>Get Started</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </motion.button>

          </div>
        </div>
      </section>

      {/* Upcoming Workshops — editorial magazine rows */}
      <section id="workshops" className="py-24" style={{ backgroundColor: '#F5F1EB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-5 mb-3">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(18,18,18,0.2)' }} />
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>Fall / Winter 2026</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight" style={{ color: '#121212' }}>
              Upcoming Workshops & Events
            </h2>
            <p className="text-base mt-3 max-w-2xl" style={{ color: '#7A6F66' }}>
              Professional photography workshops, content creation masterclasses, and networking events for BIPOC creatives in Toronto, Hamilton, Niagara Falls, and St. Catharines
            </p>
          </motion.div>

          <div className="space-y-5">
            {upcomingEvents.map((event, index) => (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="group overflow-hidden rounded-2xl"
                style={{ border: '1px solid rgba(18,18,18,0.1)' }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left: image */}
                  <div className="md:w-72 lg:w-80 relative overflow-hidden flex-shrink-0" style={{ backgroundColor: '#121212', minHeight: '200px' }}>
                    <ImageWithFallback
                      src={event.image}
                      alt={`${event.name} - CREOVA Workshop in Ontario`}
                      className="w-full h-full object-cover aspect-[4/3] md:aspect-auto group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0" style={{
                      background: 'linear-gradient(to right, rgba(18,18,18,0.5) 0%, transparent 60%)'
                    }} />
                    {/* Price badge over image */}
                    <div className="absolute bottom-4 left-4">
                      <div
                        className="text-3xl font-light tracking-tight"
                        style={{
                          color: '#FFFFFF',
                          textShadow: '0 1px 8px rgba(0,0,0,0.6)'
                        }}
                      >
                        ${event.price}
                      </div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                        {event.price === 0 ? 'FREE' : 'CAD + HST'}
                      </div>
                    </div>
                  </div>

                  {/* Right: content */}
                  <div className="flex-1 p-7" style={{ backgroundColor: '#FFFFFF' }}>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span
                        className="text-xs px-3 py-1 rounded-full tracking-wide"
                        style={{
                          background: event.location.includes('Virtual')
                            ? 'rgba(166,143,89,0.1)'
                            : 'rgba(18,18,18,0.07)',
                          color: event.location.includes('Virtual') ? '#A68F59' : '#121212',
                          border: `1px solid ${event.location.includes('Virtual') ? 'rgba(166,143,89,0.3)' : 'rgba(18,18,18,0.15)'}`
                        }}
                      >
                        {event.location.includes('Virtual') ? 'Virtual' : 'In-Person'}
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full tracking-wide"
                            style={{ backgroundColor: 'rgba(18,18,18,0.04)', color: '#7A6F66', border: '1px solid rgba(18,18,18,0.1)' }}>
                        {event.capacity}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl tracking-tight mb-3" style={{ color: '#121212' }}>
                      {event.name}
                    </h3>
                    <p className="text-sm mb-5 leading-relaxed" style={{ color: '#7A6F66' }}>
                      {event.description}
                    </p>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-5">
                      {[
                        { icon: Calendar, label: event.date },
                        { icon: Clock, label: event.time },
                        { icon: MapPin, label: event.location }
                      ].map((meta, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <meta.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#A68F59' }} />
                          <span className="text-xs" style={{ color: '#4A3E36' }}>{meta.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Includes */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-6">
                      {event.includes.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: warmGradient }} />
                          <span className="text-xs" style={{ color: '#7A6F66' }}>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Button
                      size="sm"
                      onClick={() => handleBuyTicket(event)}
                      className="px-6 py-4 rounded-lg text-sm transition-all duration-300"
                      style={{ background: warmGradient, color: '#FFFFFF', border: 'none' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.9';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(177,100,59,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <span className="flex items-center gap-2">
                        Register Now
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join — dark editorial */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#121212' }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(166,143,89,0.06) 0%, transparent 65%)'
        }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-center gap-5 mb-3">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>Community</p>
            </div>
            <h2 className="text-4xl font-light tracking-tight" style={{ color: '#F5F1EB' }}>
              Why Join CREOVA's Creative Community?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Users,
                title: 'BIPOC Creative Network',
                description: 'Connect with photographers, designers, and entrepreneurs building meaningful careers in the creative industry'
              },
              {
                icon: Calendar,
                title: 'Expert-Led Workshops',
                description: 'Learn from working professionals with real industry experience in photography, branding, and content creation'
              },
              {
                icon: MapPin,
                title: 'Accessible Locations',
                description: 'Virtual and in-person events across Ontario including Toronto, Hamilton, Niagara Falls, and St. Catharines'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="p-7 rounded-xl transition-all duration-300"
                style={{ border: '1px solid rgba(166,143,89,0.18)', backgroundColor: 'rgba(166,143,89,0.04)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(166,143,89,0.4)';
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(166,143,89,0.08)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(166,143,89,0.18)';
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(166,143,89,0.04)';
                }}
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center mb-5"
                  style={{ background: warmGradient }}
                >
                  <item.icon className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                </div>
                <div style={{ height: '1px', width: '24px', backgroundColor: 'rgba(166,143,89,0.4)', marginBottom: '14px' }} />
                <h3 className="text-lg mb-2 tracking-tight" style={{ color: '#F5F1EB' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7A6F66' }}>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration Opportunities */}
      <section id="collaboration" className="py-24" style={{ backgroundColor: '#F9F6F1' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-center gap-5 mb-3">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(177,100,59,0.4)' }} />
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#B1643B' }}>Partner With Us</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight" style={{ color: '#121212' }}>Partner with CREOVA</h2>
            <p className="text-base mt-3 max-w-2xl" style={{ color: '#7A6F66' }}>
              From brand partnerships to community initiatives, we collaborate with organizations, businesses, and creatives who share our commitment to amplifying BIPOC voices
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {collaborationTypes.map((type, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="overflow-hidden rounded-2xl"
                style={{ border: '1px solid rgba(18,18,18,0.1)' }}
              >
                {/* Card header */}
                <div className="px-7 py-6 flex items-center gap-4" style={{ backgroundColor: '#121212' }}>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ border: '1px solid rgba(177,100,59,0.4)', backgroundColor: 'rgba(177,100,59,0.12)' }}
                  >
                    <type.icon className="w-4 h-4" style={{ color: '#B1643B' }} />
                  </div>
                  <h3 className="text-lg tracking-tight" style={{ color: '#F5F1EB' }}>{type.title}</h3>
                </div>

                {/* Card body */}
                <div className="p-7" style={{ backgroundColor: '#FFFFFF' }}>
                  <p className="text-sm mb-5 leading-relaxed" style={{ color: '#7A6F66' }}>{type.description}</p>
                  <p className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: '#A68F59' }}>Examples</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {type.examples.map((example, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: warmGradient }} />
                        <span className="text-xs leading-relaxed" style={{ color: '#4A3E36' }}>{example}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CREOVA in the Spotlight */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(166,143,89,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-center gap-5 mb-3">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>Featured Moments</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight" style={{ color: '#F5F1EB' }}>
              CREOVA in the Spotlight
            </h2>
            <p className="text-base mt-3" style={{ color: '#4A3E36' }}>
              Moments where our community showed up, spoke up, and made an impact
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Innovation Showcase */}
            <motion.a
              href="https://www.linkedin.com/posts/brock-linc_innovationshowcase2027-activity-7435428477895569408-uYf7"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group overflow-hidden rounded-2xl block"
              style={{ border: '1px solid rgba(166,143,89,0.2)' }}
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src="/card-justin-panel.jpg"
                  alt="Justin Mafie presenting CREOVA at the Innovation Showcase at Brock University LINC"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  style={{ objectPosition: 'center 20%' }}
                />
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to top, rgba(10,10,10,0.94) 0%, rgba(10,10,10,0.3) 55%, transparent 100%)'
                }} />
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                  style={{ backgroundColor: 'rgba(166,143,89,0.9)', color: '#121212' }}>
                  <ExternalLink className="w-3 h-3" />
                  View Recap on LinkedIn
                </div>
              </div>
              <div className="p-7" style={{ backgroundColor: '#111111' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ backgroundColor: 'rgba(166,143,89,0.12)', color: '#A68F59', border: '1px solid rgba(166,143,89,0.25)' }}>
                    Past Event · Recap
                  </span>
                  <span className="text-xs" style={{ color: '#4A3E36' }}>Brock University LINC</span>
                </div>
                <h3 className="text-2xl tracking-tight mb-3" style={{ color: '#F5F1EB' }}>Innovation Showcase</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#7A6F66' }}>
                  CREOVA was selected to present at Brock University's prestigious Innovation Showcase — a celebration of entrepreneurship and creative impact in the Niagara region.
                </p>
                <div className="flex items-center gap-2 text-sm group-hover:translate-x-2 transition-transform duration-300" style={{ color: '#A68F59' }}>
                  <span>See the full recap</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.a>

            {/* The Black Print */}
            <motion.a
              href="https://www.instagram.com/creova.ca"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              whileHover={{ y: -5 }}
              className="group overflow-hidden rounded-2xl block"
              style={{ border: '1px solid rgba(177,100,59,0.2)' }}
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src="/card-blackprint-session.jpg"
                  alt="The Black Print closing session at the Black Student Success Centre"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  style={{ objectPosition: 'center 40%' }}
                />
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to top, rgba(10,10,10,0.94) 0%, rgba(10,10,10,0.3) 55%, transparent 100%)'
                }} />
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                  style={{ backgroundColor: 'rgba(177,100,59,0.9)', color: '#F5F1EB' }}>
                  <ExternalLink className="w-3 h-3" />
                  View on Instagram
                </div>
              </div>
              <div className="p-7" style={{ backgroundColor: '#111111' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{ backgroundColor: 'rgba(177,100,59,0.12)', color: '#B1643B', border: '1px solid rgba(177,100,59,0.25)' }}>
                    Community Event
                  </span>
                  <span className="text-xs" style={{ color: '#4A3E36' }}>Black Student Success Centre</span>
                </div>
                <h3 className="text-2xl tracking-tight mb-3" style={{ color: '#F5F1EB' }}>The Black Print — Closing Session</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#7A6F66' }}>
                  Wednesday's closing session of The Black Print, in partnership with the Black Student Success Centre — a conversation filled with joy, good vibes, and powerful moments of connection.
                </p>
                <div className="flex items-center gap-2 text-sm group-hover:translate-x-2 transition-transform duration-300" style={{ color: '#B1643B' }}>
                  <span>Read the post</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.a>
          </div>
        </div>
      </section>

      {/* Previous Collaborations */}
      <section id="past-work" className="py-24" style={{ backgroundColor: '#F5F1EB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-center gap-5 mb-3">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(18,18,18,0.2)' }} />
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>Our Partners</p>
            </div>
            <h2 className="text-4xl font-light tracking-tight" style={{ color: '#121212' }}>
              Trusted by Community and Organizations
            </h2>
            <p className="text-base mt-3" style={{ color: '#7A6F66' }}>
              CREOVA has partnered with universities, NGOs, and community organizations across Ontario
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {previousCollaborations.map((collab, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group overflow-hidden rounded-2xl"
                style={{ border: '1px solid rgba(18,18,18,0.1)', backgroundColor: '#FFFFFF' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(166,143,89,0.4)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(166,143,89,0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(18,18,18,0.1)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '4/3', backgroundColor: '#121212' }}>
                  <img
                    src={collab.image}
                    alt={collab.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-5">
                  <time className="text-xs mb-2 block tracking-wide" style={{ color: '#A68F59' }}>{collab.date}</time>
                  <div style={{ height: '1px', width: '20px', backgroundImage: warmGradient, marginBottom: '10px' }} />
                  <h3 className="text-base tracking-tight mb-1" style={{ color: '#121212' }}>{collab.title}</h3>
                  <p className="text-xs mb-2 font-medium" style={{ color: '#B1643B' }}>{collab.partner}</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#7A6F66' }}>{collab.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration Process — warm-dot vertical timeline */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#121212' }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '1px', backgroundColor: 'rgba(166,143,89,0.3)' }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="flex items-center gap-5 mb-3">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.5)' }} />
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>How We Work</p>
            </div>
            <h2 className="text-4xl font-light tracking-tight" style={{ color: '#F5F1EB' }}>Our Collaboration Process</h2>
            <p className="text-base mt-3" style={{ color: '#4A3E36' }}>A simple, transparent approach to working together</p>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-4 bottom-4 w-px" style={{ background: 'linear-gradient(to bottom, rgba(166,143,89,0.6), rgba(177,100,59,0.6))' }} />

            <div className="space-y-6">
              {[
                { step: '01', title: 'Initial Review & Assessment', description: 'We review your proposal within 2-3 business days and assess alignment with our values, mission, and current capacity' },
                { step: '02', title: 'Discovery Call', description: 'If it\'s a strong fit, we\'ll schedule a video call to discuss your vision, goals, timeline, and budget in detail' },
                { step: '03', title: 'Custom Proposal & Agreement', description: 'We create a tailored proposal outlining project scope, deliverables, timeline, and pricing with a professional service agreement' },
                { step: '04', title: 'Collaboration Launch', description: 'We begin the project with clear communication, regular check-ins, and milestone-based delivery to ensure quality results' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex gap-8 pl-0"
                >
                  {/* Step dot */}
                  <div className="flex-shrink-0 relative z-10">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-light tracking-wider"
                      style={{ background: warmGradient, color: '#FFFFFF' }}
                    >
                      {item.step}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <h3 className="text-lg tracking-tight mb-2" style={{ color: '#F5F1EB' }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#7A6F66' }}>{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Form */}
      <section id="contact-form" className="py-24" style={{ backgroundColor: '#F5F1EB' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-5 mb-3">
              <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(18,18,18,0.2)' }} />
              <p className="text-xs tracking-[0.5em] uppercase" style={{ color: '#A68F59' }}>Submit a Proposal</p>
            </div>
            <h2 className="text-4xl font-light tracking-tight" style={{ color: '#121212' }}>
              Submit a Collaboration Proposal
            </h2>
            <p className="text-base mt-3" style={{ color: '#7A6F66' }}>
              Tell us about your project, partnership idea, or event concept and let's explore how we can work together
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl"
            style={{ border: '1px solid rgba(18,18,18,0.1)' }}
          >
            {/* Form header */}
            <div className="px-8 py-5" style={{ backgroundColor: '#121212', borderBottom: '1px solid rgba(166,143,89,0.2)' }}>
              <p className="text-sm" style={{ color: '#7A6F66' }}>We review all proposals within 2-3 business days and respond to all inquiries</p>
            </div>

            <div className="p-8 md:p-10 space-y-6" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-xs tracking-widest uppercase mb-2 block" style={{ color: '#7A6F66' }}>Full Name *</Label>
                  <Input id="name" autoComplete="name" required value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name" className="rounded-xl border-2 focus:border-[#A68F59] transition-colors" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs tracking-widest uppercase mb-2 block" style={{ color: '#7A6F66' }}>Email Address *</Label>
                  <Input id="email" type="email" autoComplete="email" required value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com" className="rounded-xl border-2 focus:border-[#A68F59] transition-colors" />
                </div>
              </div>

              <div>
                <Label htmlFor="organization" className="text-xs tracking-widest uppercase mb-2 block" style={{ color: '#7A6F66' }}>Organization / Brand Name</Label>
                <Input id="organization" value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="Your organization, company, or personal brand"
                  className="rounded-xl border-2 focus:border-[#A68F59] transition-colors" />
              </div>

              <div>
                <Label htmlFor="collaborationType" className="text-xs tracking-widest uppercase mb-2 block" style={{ color: '#7A6F66' }}>Type of Collaboration *</Label>
                <select
                  id="collaborationType" required
                  value={formData.collaborationType}
                  onChange={(e) => setFormData({ ...formData, collaborationType: e.target.value })}
                  className="w-full border-2 rounded-xl px-4 py-3 focus:border-[#A68F59] focus:outline-none transition-colors"
                  style={{ color: '#121212' }}
                >
                  <option value="">Select collaboration type</option>
                  <option value="brand-partnership">Brand Partnership</option>
                  <option value="creative-project">Creative Project</option>
                  <option value="community-initiative">Community Initiative</option>
                  <option value="event-workshop">Event or Workshop</option>
                  <option value="custom">Custom Collaboration</option>
                </select>
              </div>

              <div>
                <Label htmlFor="projectDescription" className="text-xs tracking-widest uppercase mb-2 block" style={{ color: '#7A6F66' }}>Project Description *</Label>
                <Textarea id="projectDescription" required value={formData.projectDescription}
                  onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                  placeholder="Describe your collaboration idea, goals, what you envision, and how CREOVA can contribute..."
                  rows={6} className="rounded-xl border-2 focus:border-[#A68F59] transition-colors" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="timeline" className="text-xs tracking-widest uppercase mb-2 block" style={{ color: '#7A6F66' }}>Preferred Timeline</Label>
                  <Input id="timeline" value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    placeholder="e.g., Q1 2026, 3 months, ASAP"
                    className="rounded-xl border-2 focus:border-[#A68F59] transition-colors" />
                </div>
                <div>
                  <Label htmlFor="budget" className="text-xs tracking-widest uppercase mb-2 block" style={{ color: '#7A6F66' }}>Budget Range (CAD)</Label>
                  <Input id="budget" value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="e.g., $2,000-$5,000"
                    className="rounded-xl border-2 focus:border-[#A68F59] transition-colors" />
                </div>
              </div>

              <div className="border-t pt-8" style={{ borderColor: '#E3DCD3' }}>
                <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#7A6F66' }}>Security Verification</p>
                <Captcha onVerify={handleCaptchaVerify} onExpire={handleCaptchaExpire} onError={handleCaptchaError} />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full py-6 rounded-xl text-sm tracking-wide transition-all duration-300"
                style={{ background: warmGradient, color: '#FFFFFF', border: 'none' }}
                disabled={isSubmitting}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 8px 28px rgba(177,100,59,0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  {isSubmitting ? 'Submitting...' : 'Submit Collaboration Proposal'}
                  {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                </span>
              </Button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Final CTA — warm gradient hero (the signature moment) */}
      <section className="py-28 relative overflow-hidden" style={{ background: warmGradient }}>
        {/* Fine dot texture over gradient */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
        {/* Ambient dark shadows at edges */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.2) 100%)'
        }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-5 mb-10">
              <div style={{ height: '1px', width: '50px', backgroundColor: 'rgba(255,255,255,0.4)' }} />
              <p className="text-xs tracking-[0.55em] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>Let's Connect</p>
              <div style={{ height: '1px', width: '50px', backgroundColor: 'rgba(255,255,255,0.4)' }} />
            </div>

            <h2
              className="font-light tracking-tight mb-6"
              style={{ fontSize: 'clamp(32px, 5vw, 68px)', color: '#FFFFFF', lineHeight: 1.1 }}
            >
              Ready to Create Something Meaningful?
            </h2>
            <p className="text-lg mb-12 leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '520px', margin: '0 auto 48px' }}>
              Whether you're booking a workshop ticket or exploring a partnership opportunity, we're here to collaborate
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => scrollToSection('#workshops')}
                className="px-10 py-6 rounded-xl text-sm tracking-wide transition-all duration-300"
                style={{ backgroundColor: '#FFFFFF', color: '#B1643B' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#121212';
                  e.currentTarget.style.color = '#F5F1EB';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#B1643B';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                View Workshops
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('#contact-form')}
                className="px-10 py-6 rounded-xl text-sm tracking-wide border-2 transition-all duration-300"
                style={{ backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.6)', color: '#FFFFFF' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.borderColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Submit Proposal
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
