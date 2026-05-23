import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isChanging: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// SEO-optimized translations
const translations = {
  en: {
    // Home Arrays
    'home.feature.1.title': 'Photography',
    'home.feature.1.desc': 'Brand, family, and professional portraiture',
    'home.feature.2.title': 'Videography',
    'home.feature.2.desc': 'Cinematic storytelling and event coverage',
    'home.feature.3.title': 'Brand Identity',
    'home.feature.3.desc': 'Visual systems and strategic design',
    'home.feature.4.title': 'Social Media',
    'home.feature.4.desc': 'Content strategy and digital growth',
    'home.feature.5.title': 'Shop SEEN',
    'home.feature.5.desc': 'CREOVA apparel and accessories',
    'home.feature.6.title': 'Events',
    'home.feature.6.desc': 'Workshops and creative gatherings',
    'home.marquee.1': 'Photography',
    'home.marquee.2': 'Videography',
    'home.marquee.3': 'Brand Identity',
    'home.marquee.4': 'Social Media',
    'home.marquee.5': 'Events',
    'home.marquee.6': 'Community',
    'home.marquee.7': 'BIPOC Creative',
    'home.marquee.8': 'Ontario',
    'home.marquee.9': 'SEEN Platform',
    'home.marquee.10': 'Drone Aerial',
    'home.marquee.11': 'Content Creation',
    'home.marquee.12': 'Cultural Storytelling',

    // SEO Keys
    'seo.title': 'CREOVA | Black-Owned Creative Agency Ontario | Photography, Videography, Brand Design',
    'seo.description': 'CREOVA is a Black-owned creative agency in Ontario, Canada specializing in professional photography, videography, brand management, and digital content creation. Serving BIPOC communities across Niagara, Toronto & GTA with authentic storytelling and premium creative services.',
    'seo.keywords': 'Black-owned creative agency Ontario, BIPOC photographer Niagara, videography services Toronto, brand photography Ontario, creative studio Canada, Black photographer Toronto, Niagara videographer, brand design Ontario, social media management, Ontario creative agency, African Canadian photographer',
    'seo.og.title': 'CREOVA | Black-Owned Creative Agency Ontario',
    'seo.og.description': 'Professional photography, videography, brand management & digital content creation for BIPOC communities across Ontario. Book your creative session today.',
    'seo.schema.desc': 'Black-owned creative agency specializing in photography, videography, and brand design',
    'seo.schema.catalog': 'Creative Services',
    'seo.schema.photo.name': 'Photography Services',
    'seo.schema.photo.desc': 'Professional family, brand, and product photography',
    'seo.schema.video.name': 'Videography Services',
    'seo.schema.video.desc': 'Cinematic videography and event coverage',
    'seo.schema.brand.name': 'Brand Design Services',
    'seo.schema.brand.desc': 'Brand identity, logo design, and visual systems',

    // Extra newly extracted keys
    'footer.marquee.bipoc': 'BIPOC Creative',
    'footer.marquee.ontario': 'Ontario',
    'footer.marquee.cultural': 'Cultural Storytelling',
    'footer.social.instagram': 'Instagram',
    'footer.social.linkedin': 'LinkedIn',
    'footer.social.email': 'Email',
    'footer.contact.review': 'Leave a Google Review',
    'nav.pricing.all.label': 'All Pricing',
    'nav.pricing.all.desc': 'View complete pricing guide',
    'nav.pricing.family': 'Family Portraits',
    'nav.pricing.family.desc': 'Mini Memories, Timeless Bonds, Legacy Heirloom',
    'nav.pricing.brand': 'Brand Identity',
    'nav.pricing.brand.desc': 'Profile Pro, Workspace Stories, Brand Vision',
    'nav.pricing.product': 'Product Photography',
    'nav.pricing.product.desc': 'E-commerce & lifestyle product shots',
    'nav.pricing.aerial': 'Aerial/Drone',
    'nav.pricing.aerial.desc': 'Cinematic aerial perspectives',
    'nav.pricing.events': 'Event Coverage',
    'nav.pricing.events.desc': 'Photo + video packages',
    'nav.pricing.social': 'Social Media',
    'nav.pricing.social.desc': 'Monthly management plans',
    'nav.pricing.design': 'Graphic Design',
    'nav.pricing.design.desc': 'Branding & visual identity',
    'nav.book.call': 'Book a Call',
    'nav.seen.label': 'SEEN — Upcoming Platform',
    'nav.book.call.mobile': 'Book a Discovery Call',
    'nav.pricing': 'Pricing',
    'nav.cart.aria': 'Shopping cart',
    'trust.test1.quote': "CREOVA's work on our Black History Month campaign was exceptional. They understood our vision and delivered beyond expectations.",
    'trust.test1.author': 'Human Rights & Equity',
    'trust.test1.org': 'Brock University',
    'trust.test2.quote': 'Professional, creative, and culturally aware. CREOVA brings authenticity to every project.',
    'trust.test2.author': 'BSSC Team',
    'trust.test2.org': 'Black Student Success Centre',
    'trust.test3.quote': 'Their photography captures the essence of our community. CREOVA is our go-to creative partner.',
    'trust.test3.author': 'BSA Leadership',
    'trust.test3.org': 'Black Students Association',
    'cart.cad': ' CAD',
    'common.loading': 'Loading...',
    
    // Contact Page Keys
    'contact.toast.captcha.expired': 'Security verification expired. Please verify again.',
    'contact.toast.captcha.issue': 'Security Verification Issue',
    'contact.toast.captcha.desc': 'Unable to verify. Please refresh and try again.',
    'contact.toast.captcha.missing': 'Please complete the CAPTCHA verification',
    'contact.badge.getintouch': 'Get In Touch',
    'contact.tag.book': 'Book Services',
    'contact.tag.collaborate': 'Collaborate',
    'contact.tag.inquiries': 'General Inquiries',
    'contact.book.title': 'Ready to book a session?',
    'contact.book.desc': "Skip the inquiry form and book directly — we'll confirm your session within 4 business hours.",
    'contact.book.btn.now': 'Book Session Now',
    'contact.book.btn.chat': 'Chat with Sankofa First',
    'contact.form.or': 'or send a general inquiry',
    'contact.form.title': 'Send Us a Message',
    'contact.form.label.name': 'Name *',
    'contact.form.placeholder.name': 'Your full name',
    'contact.form.label.email': 'Email *',
    'contact.form.placeholder.email': 'your@email.com',
    'contact.form.label.phone': 'Phone Number',
    'contact.form.placeholder.phone': '(123) 456-7890',
    'contact.form.label.service': 'Service Interested In *',
    'contact.form.select.service': 'Select a service',
    'contact.form.opt.family': 'Family Photography',
    'contact.form.opt.brand': 'Brand Photography',
    'contact.form.opt.product': 'Product Photography',
    'contact.form.opt.event': 'Event Coverage (Photo/Video)',
    'contact.form.opt.drone': 'Drone & Aerial Photography',
    'contact.form.opt.social': 'Social Media Management',
    'contact.form.opt.brandmgt': 'Brand Management',
    'contact.form.opt.collab': 'Collaboration Opportunity',
    'contact.form.opt.other': 'Other/Not Sure',
    'contact.form.label.budget': 'Budget Range',
    'contact.form.placeholder.budget': 'e.g., $500-$1000',
    'contact.form.label.timeline': 'Timeline/Event Date',
    'contact.form.placeholder.timeline': 'e.g., June 2026',
    'contact.form.label.message': 'Message *',
    'contact.form.placeholder.message': "Tell us about your project, event, or what you're looking for...",
    'contact.form.security': 'Security Verification',
    'contact.form.btn.sending': 'Sending...',
    'contact.form.btn.send': 'Send Message',
    'contact.form.disclaimer': 'By submitting this form, you agree to be contacted by CREOVA regarding your inquiry',
    'contact.faq.badge': 'Quick Answers',
    'contact.faq.title': 'Frequently Asked Questions',
    'contact.faq.q1': 'How far in advance should I book?',
    'contact.faq.a1': 'For events and weddings, we recommend booking 3-6 months in advance. For brand photography and other services, 2-4 weeks notice is typically sufficient, but we can sometimes accommodate rush requests.',
    'contact.faq.q2': 'Do you travel outside of Niagara?',
    'contact.faq.a2': 'Yes! We serve clients across Ontario and Canada-wide. Travel fees may apply for locations outside Niagara city limits and will be quoted based on distance.',
    'contact.faq.q3': "What's your cancellation policy?",
    'contact.faq.a3': 'We require a deposit to secure your booking. Cancellations made 14+ days before your session receive a 50% refund. Cancellations within 14 days forfeit the deposit. We can discuss rescheduling options for weather or emergencies.',
    'contact.faq.q4': 'How long until I receive my photos/videos?',
    'contact.faq.a4': 'Standard turnaround is 2-3 weeks for photography and 3-4 weeks for video projects. Expedited delivery (48-72 hours) is available for an additional fee.',
    'contact.faq.q5': 'Do you offer payment plans?',
    'contact.faq.a5': 'Yes, we offer payment plans for packages over $1,000. Typically, this includes a 50% deposit to book and the remaining balance due before or on the day of service.',
    'contact.faq.q6': 'What equipment do you use?',
    'contact.faq.a6': 'We use professional-grade Canon and Sony cameras, professional lighting equipment, DJI drones (licensed and insured), and industry-standard editing software including Adobe Creative Suite and Final Cut Pro.',

    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.pricing': 'Pricing',
    'nav.shop': 'Shop',
    'nav.digital': 'Digital Products',
    'nav.experience': 'Experience',
    'nav.community': 'Community',
    'nav.contact': 'Contact',
    'nav.cart': 'Cart',
    
    // Home Page - SEO Optimized
    'home.hero.title': 'Black-Led Creative Studio in Ontario, Canada',
    'home.hero.subtitle': 'Videography, Photography, Brand Management & Fashion Design',
    'home.hero.cta': 'Explore Our Services',
    'home.hero.cta2': 'Shop SEEN Collection',
    
    // Services - SEO
    'services.title': 'Professional Creative Services in Ontario',
    'services.subtitle': 'Videography, Photography, Branding & Content Creation',
    'services.video.title': 'Professional Videography Services',
    'services.video.desc': 'Documentary-style storytelling, commercial video production, event coverage, and social media content creation for brands and businesses.',
    'services.photo.title': 'Commercial Photography Services',
    'services.photo.desc': 'Portrait photography, product photography, event photography, and brand photography services for Ontario businesses.',
    'services.brand.title': 'Brand Management & Strategy',
    'services.brand.desc': 'Complete brand identity development, visual identity systems, brand strategy consulting, and brand guidelines for growing businesses.',
    'services.social.title': 'Social Media Management',
    'services.social.desc': 'Content strategy, social media marketing, community management, and analytics for Instagram, TikTok, and other platforms.',
    
    // Shop - SEO
    'shop.title': 'SEEN: A Season of Soft Power',
    'shop.subtitle': 'Black-Led Fashion Brand | Afro-Minimalism | Age-Inclusive Design',
    'shop.description': 'Shop the SEEN collection: premium streetwear, graphic tees, hoodies, and accessories designed for ages 5-90. Sustainable fashion with timeless style.',
    'shop.filter.all': 'All',
    'shop.filter.tees': 'Tees',
    'shop.filter.hoodies': 'Hoodies',
    'shop.filter.jackets': 'Jackets',
    'shop.filter.pants': 'Pants',
    'shop.filter.sets': 'Sets',
    'shop.filter.accessories': 'Accessories',
    'shop.add.bag': 'Add to Bag',
    'shop.select.size': 'Select Size',
    'shop.colors': 'Colors',
    
    // Digital Products - SEO
    'digital.title': 'Digital Resources for Creative Entrepreneurs',
    'digital.subtitle': 'Templates, Presets, Tools & Business Resources',
    'digital.description': 'Download professional Canva templates, Lightroom presets, social media templates, and business tools designed for BIPOC entrepreneurs and creatives.',
    
    // Experience - SEO
    'experience.title': 'Creative Workshops & Community Events',
    'experience.subtitle': 'Photography Workshops, Brand Strategy Sessions & Networking Events',
    'experience.description': 'Join CREOVA community events, creative workshops, and collaborative projects. Connect with other creators and learn new skills.',
    
    // Community - SEO
    'community.title': 'About CREOVA | Black-Led Creative Agency Ontario',
    'community.mission': 'Our Mission',
    'community.mission.text': 'CREOVA is a Black-led creative studio based in Ontario, Canada, dedicated to authentic storytelling and community empowerment through visual arts, fashion, and strategic branding.',
    'community.values': 'Our Values',
    'community.team': 'Meet the Team',
    
    // Contact - SEO
    'contact.title': 'Contact CREOVA | Book a Consultation',
    'contact.subtitle': 'Get in Touch for Creative Services',
    'contact.description': 'Ready to start your project? Contact CREOVA for videography, photography, branding, or fashion inquiries. Serving Ontario and beyond.',
    'contact.name': 'Full Name',
    'contact.email': 'Email Address',
    'contact.phone': 'Phone Number',
    'contact.service': 'Service Interest',
    'contact.message': 'Project Details',
    'contact.submit': 'Send Message',
    'contact.captcha.security': '🔒 Security verification helps us prevent spam and protect your information.',
    'contact.form.success.title': 'Message sent successfully!',
    'contact.form.success.description': 'We\'ll get back to you within 1-2 business days.',
    'contact.form.error.title': 'Failed to send message',
    'contact.form.error.description': 'Please try again or email us directly.',
    
    // Footer - SEO
    'footer.services': 'Services',
    'footer.company': 'Company',
    'footer.legal': 'Legal',
    'footer.newsletter': 'Subscribe to Newsletter',
    'footer.email.placeholder': 'Enter your email',
    'footer.subscribe': 'Subscribe',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.learn.more': 'Learn More',
    'common.book.now': 'Book Now',
    'common.get.started': 'Get Started',
    'common.view.all': 'View All',
    'common.read.more': 'Read More',
    'common.currency': 'CAD',
    
    // HomePage - NEW
    'home.hero.creative.stories': 'Creative Stories.',
    'home.hero.digital.impact': 'Digital Impact.',
    'home.hero.description': 'We craft visual narratives that elevate brands and preserve cultural moments. From strategic branding to cinematic storytelling, we deliver excellence for BIPOC communities across Canada.',
    'home.cta.our.services': 'Our Services',
    'home.cta.view.work': 'View Our Work',
    'home.cta.explore.community': 'Explore Community',
    'home.cta.get.in.touch': 'Get in Touch',
    'home.trust.black.owned': 'Black-Owned',
    'home.trust.ontario.based': 'Ontario Based',
    'home.trust.professional': 'Professional',
    'home.trust.certified': 'Certified',
    
    // Pricing Page - NEW
    'pricing.hero.title': 'Transparent Pricing',
    'pricing.hero.subtitle': 'Choose Your Package',
    'pricing.category.videography': 'Videography',
    'pricing.category.photography': 'Photography',
    'pricing.category.aerial': 'Aerial/Drone',
    'pricing.category.brand': 'Brand Management',
    'pricing.category.digital': 'Digital Products',
    'pricing.category.events': 'Events & Workshops',
    'pricing.packages.title': 'Photography & Videography Packages',
    'pricing.package.starting': 'Starting at',
    'pricing.package.book': 'Book This Package',
    'pricing.package.details': 'Package Details',
    'pricing.addons.title': 'Add-Ons & Extras',
    'pricing.addon.extra.hour': 'Extra Hour',
    'pricing.addon.drone': 'Drone Footage',
    'pricing.addon.raw': 'Raw (Unedited) Footage',
    'pricing.addon.expedited': 'Expedited Delivery',
    'pricing.addon.album': 'Custom Album',
    'pricing.addon.travel': 'Travel Outside City',
    'pricing.offers.title': 'Special Offers & Discounts',
    'pricing.policy.title': 'Booking Policies',
    'pricing.cta.ready': 'Ready to Book?',
    'pricing.cta.book.session': 'Book Your Session',
    'pricing.cta.custom.quote': 'Get Custom Quote',
    
    // Contact Page - NEW
    'contact.hero.title': 'Get in Touch',
    'contact.hero.subtitle': 'Let\'s Create Something Amazing Together',
    'contact.priority.booking': 'Priority Booking',
    'contact.priority.subtitle': 'Ready to book? Skip the form and schedule directly',
    'contact.priority.button': 'Book Now - Fast Track',
    'contact.form.title': 'Send Us a Message',
    'contact.form.description': 'Have questions? Fill out the form and we\'ll get back to you within 24 hours.',
    'contact.info.call': 'Call Us',
    'contact.info.email': 'Email Us',
    'contact.info.location': 'Location',
    'contact.info.hours': 'Business Hours',
    'contact.info.hours.value': 'Mon-Fri: 9AM-6PM EST',
    'contact.faq.title': 'Frequently Asked Questions',
    
    // Navigation - NEW
    'nav.pricing.all': 'View All Pricing',
    'nav.mobile.menu': 'Menu',
    'nav.mobile.close': 'Close Menu',
    
    // Footer - NEW
    'footer.section.services': 'Services',
    'footer.section.company': 'Company',
    'footer.section.legal': 'Legal',
    'footer.tagline': 'Black-Led Creative Studio | Ontario, Canada',
    'footer.description': 'Professional videography, photography, brand management, and fashion design.',
    'footer.newsletter.title': 'Stay Updated',
    'footer.newsletter.subtitle': 'Get the latest news and exclusive offers',
    'footer.newsletter.placeholder': 'Enter your email',
    'footer.newsletter.button': 'Subscribe',
    'footer.social.follow': 'Follow Us',
    'footer.copyright': '© 2026 CREOVA. All rights reserved.',
    'footer.link.about': 'About',
    'footer.link.careers': 'Careers',
    'footer.link.press': 'Press Kit',
    'footer.link.refund': 'Refund Policy',
    
    // About Page
    'about.hero.title': 'About CREOVA',
    'about.services.title': 'What We Do',
    'about.problems.title': 'The Problems We Solve',
    'about.values.title': 'Our Core Values',
    'about.network.title': 'Our Network',
    'about.network.subtitle': 'An interconnected ecosystem where creativity, technology, and cultural impact converge to shape the future',
    'about.network.creative': 'Creative Collaborators',
    'about.network.community': 'Community & Cultural Allies',
    'about.network.distribution': 'Distribution & Retail',
    'about.network.marketing': 'Marketing Partners',
    'about.network.business': 'Business Enablers',
    'about.network.knowledge': 'Knowledge Partners',
    'about.synopsis.title': 'Empowering Voices.',
    'about.synopsis.title2': 'Amplifying Impact.',
    'about.synopsis.p1': 'By combining creativity, strategy, and impact, CREOVA is not just a service—it\'s a platform that empowers brands and individuals to turn their vision into reality.',
    'about.synopsis.p2': 'Our vision is to create lasting impact across industries through creative expression and collaboration, while building bridges between BIPOC creatives globally through diaspora partnerships and cultural exchange.',
    'about.cta.services': 'Explore Services',
    'about.cta.work': 'Work With Us',
    'about.connect': 'Stay Connected',
    
    // Shopping Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.empty.subtitle': 'Add some items to get started',
    'cart.continue': 'Continue Shopping',
    'cart.checkout': 'Checkout',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.total': 'Total',
    'cart.remove': 'Remove',
    'cart.quantity': 'Quantity',
    'cart.size': 'Size',
    'cart.color': 'Color',
    'cart.added': 'Added to cart!',
    'cart.removed': 'Removed from cart',
    'cart.updated': 'Cart updated',
    
    // Product Actions
    'product.quick.view': 'Quick View',
    'product.add.wishlist': 'Add to Wishlist',
    'product.remove.wishlist': 'Remove from Wishlist',
    'product.size.guide': 'Size Guide',
    'product.in.stock': 'In Stock',
    'product.low.stock': 'Low Stock',
    'product.out.stock': 'Out of Stock',
    'product.preorder': 'Pre-Order',
    'product.share': 'Share',
    'product.details': 'Product Details',
    'product.reviews': 'Reviews',
    'product.shipping.info': 'Shipping Information',
    'product.you.may.like': 'You May Also Like',
    'product.recently.viewed': 'Recently Viewed',
    
    // Size Guide
    'size.guide.title': 'Size Guide',
    'size.chest': 'Chest',
    'size.waist': 'Waist',
    'size.hips': 'Hips',
    'size.length': 'Length',
    'size.measurements': 'Measurements in inches',
    
    // Search
    'search.placeholder': 'Search products...',
    'search.no.results': 'No results found',
    'search.showing': 'Showing',
    'search.results': 'results',
    
    // Filters
    'filter.sort': 'Sort By',
    'filter.price.low': 'Price: Low to High',
    'filter.price.high': 'Price: High to Low',
    'filter.newest': 'Newest',
    'filter.popular': 'Most Popular',
    'filter.category': 'Category',
    'filter.price.range': 'Price Range',
    'filter.clear': 'Clear Filters',
    'filter.apply': 'Apply',
    
    // Forms
    'form.required': 'Required',
    'form.optional': 'Optional',
    'form.invalid.email': 'Invalid email address',
    'form.invalid.phone': 'Invalid phone number',
    'form.message.sent': 'Message sent successfully!',
    'form.error.generic': 'Something went wrong. Please try again.',
    'form.saving': 'Saving...',
    
    // Accessibility
    'a11y.skip.content': 'Skip to content',
    'a11y.back.top': 'Back to top',
    'a11y.close': 'Close',
    'a11y.open.menu': 'Open menu',
    'a11y.close.menu': 'Close menu',
    'a11y.loading': 'Loading',
  },
  
  fr: {
    // Home Arrays
    'home.feature.1.title': 'Photographie',
    'home.feature.1.desc': 'Portraits de marque, de famille et professionnels',
    'home.feature.2.title': 'Vidéographie',
    'home.feature.2.desc': 'Narration cinématographique et couverture d\'événements',
    'home.feature.3.title': 'Identité de Marque',
    'home.feature.3.desc': 'Systèmes visuels et conception stratégique',
    'home.feature.4.title': 'Médias Sociaux',
    'home.feature.4.desc': 'Stratégie de contenu et croissance numérique',
    'home.feature.5.title': 'Boutique SEEN',
    'home.feature.5.desc': 'Vêtements et accessoires CREOVA',
    'home.feature.6.title': 'Événements',
    'home.feature.6.desc': 'Ateliers et rencontres créatives',
    'home.marquee.1': 'Photographie',
    'home.marquee.2': 'Vidéographie',
    'home.marquee.3': 'Identité de Marque',
    'home.marquee.4': 'Médias Sociaux',
    'home.marquee.5': 'Événements',
    'home.marquee.6': 'Communauté',
    'home.marquee.7': 'Créatif PABCN',
    'home.marquee.8': 'Ontario',
    'home.marquee.9': 'Plateforme SEEN',
    'home.marquee.10': 'Drone Aérien',
    'home.marquee.11': 'Création de Contenu',
    'home.marquee.12': 'Narration Culturelle',

    // SEO Keys
    'seo.title': 'CREOVA | Agence Créative Appartenant à des Noirs en Ontario | Photographie, Vidéographie, Design de Marque',
    'seo.description': 'CREOVA est une agence créative appartenant à des Noirs en Ontario, Canada, spécialisée dans la photographie professionnelle, la vidéographie, la gestion de marque et la création de contenu numérique. Servir les communautés PABCN à travers Niagara, Toronto et le RGT avec une narration authentique et des services créatifs de premier ordre.',
    'seo.keywords': 'Agence créative appartenant à des Noirs Ontario, photographe PABCN Niagara, services de vidéographie Toronto, photographie de marque Ontario, studio créatif Canada, photographe Noir Toronto, vidéaste Niagara, design de marque Ontario, gestion des médias sociaux, agence créative Ontario, photographe afro-canadien',
    'seo.og.title': 'CREOVA | Agence Créative Appartenant à des Noirs en Ontario',
    'seo.og.description': 'Photographie professionnelle, vidéographie, gestion de marque et création de contenu numérique pour les communautés PABCN à travers l\'Ontario. Réservez votre session créative aujourd\'hui.',
    'seo.schema.desc': 'Agence créative appartenant à des Noirs spécialisée dans la photographie, la vidéographie et le design de marque',
    'seo.schema.catalog': 'Services Créatifs',
    'seo.schema.photo.name': 'Services de Photographie',
    'seo.schema.photo.desc': 'Photographie professionnelle de famille, de marque et de produits',
    'seo.schema.video.name': 'Services de Vidéographie',
    'seo.schema.video.desc': 'Vidéographie cinématographique et couverture d\'événements',
    'seo.schema.brand.name': 'Services de Design de Marque',
    'seo.schema.brand.desc': 'Identité de marque, création de logo et systèmes visuels',

    // Extra newly extracted keys
    'footer.marquee.bipoc': 'Créatifs BIPOC',
    'footer.marquee.ontario': 'Ontario',
    'footer.marquee.cultural': 'Narration Culturelle',
    'footer.social.instagram': 'Instagram',
    'footer.social.linkedin': 'LinkedIn',
    'footer.social.email': 'Courriel',
    'footer.contact.review': 'Laisser un Avis Google',
    'nav.pricing.all.label': 'Toute la Tarification',
    'nav.pricing.all.desc': 'Voir le guide des prix complet',
    'nav.pricing.family': 'Portraits de Famille',
    'nav.pricing.family.desc': 'Mini Souvenirs, Liens Intemporels, Héritage',
    'nav.pricing.brand': 'Identité de Marque',
    'nav.pricing.brand.desc': 'Profile Pro, Histoires d\'Espace de Travail',
    'nav.pricing.product': 'Photographie de Produits',
    'nav.pricing.product.desc': 'Photos de produits e-commerce et style de vie',
    'nav.pricing.aerial': 'Aérien/Drone',
    'nav.pricing.aerial.desc': 'Perspectives aériennes cinématographiques',
    'nav.pricing.events': 'Couverture d\'Événements',
    'nav.pricing.events.desc': 'Forfaits photo + vidéo',
    'nav.pricing.social': 'Médias Sociaux',
    'nav.pricing.social.desc': 'Forfaits de gestion mensuelle',
    'nav.pricing.design': 'Design Graphique',
    'nav.pricing.design.desc': 'Branding et identité visuelle',
    'nav.book.call': 'Réserver un Appel',
    'nav.seen.label': 'SEEN — Plateforme à Venir',
    'nav.book.call.mobile': 'Réserver un Appel Découverte',
    'nav.pricing': 'Tarification',
    'nav.cart.aria': 'Panier d\'achat',
    'trust.test1.quote': "Le travail de CREOVA sur notre campagne du Mois de l'Histoire des Noirs a été exceptionnel. Ils ont compris notre vision et ont livré au-delà des attentes.",
    'trust.test1.author': 'Droits de la Personne & Équité',
    'trust.test1.org': 'Université Brock',
    'trust.test2.quote': 'Professionnel, créatif et conscient de la culture. CREOVA apporte de l\'authenticité à chaque projet.',
    'trust.test2.author': 'Équipe BSSC',
    'trust.test2.org': 'Centre de Réussite des Étudiants Noirs',
    'trust.test3.quote': 'Leur photographie capture l\'essence de notre communauté. CREOVA est notre partenaire créatif de choix.',
    'trust.test3.author': 'Leadership BSA',
    'trust.test3.org': 'Association des Étudiants Noirs',

    // Contact Page Keys
    'contact.toast.captcha.expired': 'La vérification de sécurité a expiré. Veuillez vérifier à nouveau.',
    'contact.toast.captcha.issue': 'Problème de Vérification de Sécurité',
    'contact.toast.captcha.desc': 'Impossible de vérifier. Veuillez rafraîchir et réessayer.',
    'contact.toast.captcha.missing': 'Veuillez compléter la vérification CAPTCHA',
    'contact.badge.getintouch': 'Contactez-nous',
    'contact.tag.book': 'Réserver des Services',
    'contact.tag.collaborate': 'Collaborer',
    'contact.tag.inquiries': 'Demandes Générales',
    'contact.book.title': 'Prêt à réserver une session ?',
    'contact.book.desc': "Passez le formulaire de demande et réservez directement — nous confirmerons votre session dans les 4 heures ouvrables.",
    'contact.book.btn.now': 'Réserver une Session Maintenant',
    'contact.book.btn.chat': 'Discuter avec Sankofa d\'Abord',
    'contact.form.or': 'ou envoyez une demande générale',
    'contact.form.title': 'Envoyez-nous un Message',
    'contact.form.label.name': 'Nom *',
    'contact.form.placeholder.name': 'Votre nom complet',
    'contact.form.label.email': 'Email *',
    'contact.form.placeholder.email': 'votre@email.com',
    'contact.form.label.phone': 'Numéro de Téléphone',
    'contact.form.placeholder.phone': '(123) 456-7890',
    'contact.form.label.service': 'Service Souhaité *',
    'contact.form.select.service': 'Sélectionner un service',
    'contact.form.opt.family': 'Photographie de Famille',
    'contact.form.opt.brand': 'Photographie de Marque',
    'contact.form.opt.product': 'Photographie de Produit',
    'contact.form.opt.event': 'Couverture d\'Événements (Photo/Vidéo)',
    'contact.form.opt.drone': 'Photographie par Drone & Aérienne',
    'contact.form.opt.social': 'Gestion des Médias Sociaux',
    'contact.form.opt.brandmgt': 'Gestion de Marque',
    'contact.form.opt.collab': 'Opportunité de Collaboration',
    'contact.form.opt.other': 'Autre/Pas Sûr',
    'contact.form.label.budget': 'Fourchette de Budget',
    'contact.form.placeholder.budget': 'ex. 500$-1000$',
    'contact.form.label.timeline': 'Calendrier/Date de l\'Événement',
    'contact.form.placeholder.timeline': 'ex. Juin 2026',
    'contact.form.label.message': 'Message *',
    'contact.form.placeholder.message': "Parlez-nous de votre projet, événement, ou de ce que vous recherchez...",
    'contact.form.security': 'Vérification de Sécurité',
    'contact.form.btn.sending': 'Envoi en cours...',
    'contact.form.btn.send': 'Envoyer le Message',
    'contact.form.disclaimer': 'En soumettant ce formulaire, vous acceptez d\'être contacté par CREOVA concernant votre demande',
    'contact.faq.badge': 'Réponses Rapides',
    'contact.faq.title': 'Foire Aux Questions',
    'contact.faq.q1': 'Combien de temps à l\'avance dois-je réserver ?',
    'contact.faq.a1': 'Pour les événements et mariages, nous recommandons de réserver 3-6 mois à l\'avance. Pour la photographie de marque et autres services, un préavis de 2-4 semaines est généralement suffisant, mais nous pouvons parfois accommoder des demandes urgentes.',
    'contact.faq.q2': 'Vous déplacez-vous en dehors de Niagara ?',
    'contact.faq.a2': 'Oui ! Nous servons des clients partout en Ontario et au Canada. Des frais de déplacement peuvent s\'appliquer pour les lieux en dehors des limites de Niagara et seront indiqués en fonction de la distance.',
    'contact.faq.q3': "Quelle est votre politique d'annulation ?",
    'contact.faq.a3': 'Nous demandons un dépôt pour garantir votre réservation. Les annulations effectuées plus de 14 jours avant votre session recevront un remboursement de 50 %. Les annulations dans les 14 jours entraînent la perte du dépôt. Nous pouvons discuter des options de report en cas de météo ou d\'urgence.',
    'contact.faq.q4': 'Combien de temps avant de recevoir mes photos/vidéos ?',
    'contact.faq.a4': 'Le délai standard est de 2-3 semaines pour la photographie et de 3-4 semaines pour les projets vidéo. Une livraison accélérée (48-72 heures) est disponible moyennant des frais supplémentaires.',
    'contact.faq.q5': 'Proposez-vous des plans de paiement ?',
    'contact.faq.a5': 'Oui, nous proposons des plans de paiement pour les forfaits de plus de 1 000 $. En général, cela inclut un dépôt de 50 % à la réservation et le solde dû avant ou le jour du service.',
    'contact.faq.q6': 'Quel équipement utilisez-vous ?',
    'contact.faq.a6': 'Nous utilisons des appareils photo de qualité professionnelle Canon et Sony, de l\'équipement d\'éclairage professionnel, des drones DJI (sous licence et assurés) et des logiciels de montage de référence comme Adobe Creative Suite et Final Cut Pro.',

    // Navigation
    'nav.home': 'Accueil',
    'nav.services': 'Services',
    'nav.pricing': 'Tarification',
    'nav.shop': 'Boutique',
    'nav.digital': 'Produits Numériques',
    'nav.experience': 'Expérience',
    'nav.community': 'Communauté',
    'nav.contact': 'Contact',
    'nav.cart': 'Panier',
    
    // Home Page - SEO Optimized
    'home.hero.title': 'Studio Créatif Dirigé par des Noirs en Ontario, Canada',
    'home.hero.subtitle': 'Vidéographie, Photographie, Gestion de Marque & Design de Mode',
    'home.hero.cta': 'Découvrir Nos Services',
    'home.hero.cta2': 'Magasiner la Collection SEEN',
    
    // Services - SEO
    'services.title': 'Services Créatifs Professionnels en Ontario',
    'services.subtitle': 'Vidéographie, Photographie, Image de Marque & Création de Contenu',
    'services.video.title': 'Services de Vidéographie Professionnelle',
    'services.video.desc': 'Narration documentaire, production vidéo commerciale, couverture d\'événements et création de contenu pour les médias sociaux pour les marques et entreprises.',
    'services.photo.title': 'Services de Photographie Commerciale',
    'services.photo.desc': 'Photographie de portrait, photographie de produits, photographie d\'événements et services de photographie de marque pour les entreprises en Ontario.',
    'services.brand.title': 'Gestion de Marque & Stratégie',
    'services.brand.desc': 'Développement complet d\'identité de marque, systèmes d\'identité visuelle, conseil en stratégie de marque et directives de marque pour les entreprises en croissance.',
    'services.social.title': 'Gestion des Médias Sociaux',
    'services.social.desc': 'Stratégie de contenu, marketing sur les médias sociaux, gestion de communauté et analyses pour Instagram, TikTok et autres plateformes.',
    
    // Shop - SEO
    'shop.title': 'SEEN : Une Saison de Pouvoir Doux',
    'shop.subtitle': 'Marque de Mode Dirigée par des Noirs | Afro-Minimalisme | Design Inclusif',
    'shop.description': 'Magasinez la collection SEEN : vêtements urbains haut de gamme, t-shirts graphiques, chandails à capuche et accessoires conçus pour les âges de 5 à 90 ans. Mode durable au style intemporel.',
    'shop.filter.all': 'Tout',
    'shop.filter.tees': 'T-Shirts',
    'shop.filter.hoodies': 'Chandails',
    'shop.filter.jackets': 'Vestes',
    'shop.filter.pants': 'Pantalons',
    'shop.filter.sets': 'Ensembles',
    'shop.filter.accessories': 'Accessoires',
    'shop.add.bag': 'Ajouter au Panier',
    'shop.select.size': 'Sélectionner la Taille',
    'shop.colors': 'Couleurs',
    
    // Digital Products - SEO
    'digital.title': 'Ressources Numériques pour Entrepreneurs Créatifs',
    'digital.subtitle': 'Modèles, Préréglages, Outils & Ressources Commerciales',
    'digital.description': 'Téléchargez des modèles Canva professionnels, des préréglages Lightroom, des modèles de médias sociaux et des outils commerciaux conçus pour les entrepreneurs et créatifs BIPOC.',
    
    // Experience - SEO
    'experience.title': 'Ateliers Créatifs & Événements Communautaires',
    'experience.subtitle': 'Ateliers de Photographie, Sessions de Stratégie de Marque & Événements de Réseautage',
    'experience.description': 'Rejoignez les événements communautaires CREAOVA, les ateliers créatifs et les projets collaboratifs. Connectez-vous avec d\'autres créateurs et apprenez de nouvelles compétences.',
    
    // Community - SEO
    'community.title': 'À Propos de CREAOVA | Agence Créative Dirigée par des Noirs Ontario',
    'community.mission': 'Notre Mission',
    'community.mission.text': 'CREAOVA est un studio créatif dirigé par des Noirs basé en Ontario, Canada, dédié à la narration authentique et à l\'autonomisation communautaire à travers les arts visuels, la mode et l\'image de marque stratégique.',
    'community.values': 'Nos Valeurs',
    'community.team': 'Rencontrez l\'Équipe',
    
    // Contact - SEO
    'contact.title': 'Contacter CREAOVA | Réserver une Consultation',
    'contact.subtitle': 'Contactez-Nous pour Services Créatifs',
    'contact.description': 'Prêt à démarrer votre projet? Contactez CREAOVA pour des demandes de vidéographie, photographie, image de marque ou mode. Servant l\'Ontario et au-delà.',
    'contact.name': 'Nom Complet',
    'contact.email': 'Adresse Courriel',
    'contact.phone': 'Numéro de Téléphone',
    'contact.service': 'Service d\'Intérêt',
    'contact.message': 'Détails du Projet',
    'contact.submit': 'Envoyer le Message',
    'contact.captcha.security': '🔒 La vérification de sécurité nous aide à prévenir le spam et à protéger vos informations.',
    'contact.form.success.title': 'Message envoyé avec succès!',
    'contact.form.success.description': 'Nous vous répondrons dans les 1-2 jours ouvrés.',
    'contact.form.error.title': 'Échec de l\'envoi du message',
    'contact.form.error.description': 'Veuillez réessayer ou nous contacter directement par courriel.',
    
    // Footer - SEO
    'footer.services': 'Services',
    'footer.company': 'Entreprise',
    'footer.legal': 'Légal',
    'footer.newsletter': 'S\'abonner à l\'Infolettre',
    'footer.email.placeholder': 'Entrez votre courriel',
    'footer.subscribe': 'S\'abonner',
    'footer.rights': 'Tous droits réservés.',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.terms': 'Conditions d\'Utilisation',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.learn.more': 'En Savoir Plus',
    'common.book.now': 'Réserver Maintenant',
    'common.get.started': 'Commencer',
    'common.view.all': 'Voir Tout',
    'common.read.more': 'Lire Plus',
    'common.currency': 'CAD',
    
    // HomePage - NEW
    'home.hero.creative.stories': 'Histoires Créatives.',
    'home.hero.digital.impact': 'Impact Numérique.',
    'home.hero.description': 'Nous créons des récits visuels qui élèvent les marques et préservent des moments culturels. Du branding stratégique au storytelling cinématographique, nous livrons de l\'excellence pour les communautés BIPOC à travers le Canada.',
    'home.cta.our.services': 'Nos Services',
    'home.cta.view.work': 'Voir Notre Travail',
    'home.cta.explore.community': 'Explorer la Communauté',
    'home.cta.get.in.touch': 'Nous Contacter',
    'home.trust.black.owned': 'Propriété Noire',
    'home.trust.ontario.based': 'Basé en Ontario',
    'home.trust.professional': 'Professionnel',
    'home.trust.certified': 'Certifié',
    
    // Pricing Page - NEW
    'pricing.hero.title': 'Tarification Transparente',
    'pricing.hero.subtitle': 'Choisissez Votre Forfait',
    'pricing.category.videography': 'Vidéographie',
    'pricing.category.photography': 'Photographie',
    'pricing.category.aerial': 'Aérien/Drone',
    'pricing.category.brand': 'Gestion de Marque',
    'pricing.category.digital': 'Produits Numériques',
    'pricing.category.events': 'Événements & Ateliers',
    'pricing.packages.title': 'Forfaits de Photographie & Vidéographie',
    'pricing.package.starting': 'À partir de',
    'pricing.package.book': 'Réserver Ce Forfait',
    'pricing.package.details': 'Détails du Forfait',
    'pricing.addons.title': 'Options & Extras',
    'pricing.addon.extra.hour': 'Heure Supplémentaire',
    'pricing.addon.drone': 'Images Drone',
    'pricing.addon.raw': 'Images Brutes (Non Éditées)',
    'pricing.addon.expedited': 'Livraison Accélérée',
    'pricing.addon.album': 'Album Personalisé',
    'pricing.addon.travel': 'Déplacement en dehors de la Ville',
    'pricing.offers.title': 'Offres Spéciales & Remises',
    'pricing.policy.title': 'Politiques de Réservation',
    'pricing.cta.ready': 'Prêt à Réserver?',
    'pricing.cta.book.session': 'Réserver Votre Session',
    'pricing.cta.custom.quote': 'Obtenir un Devis Personnalisé',
    
    // Contact Page - NEW
    'contact.hero.title': 'Contactez-Nous',
    'contact.hero.subtitle': 'Créons Quelque Chose d\'Incroyable Ensemble',
    'contact.priority.booking': 'Réservation Prioritaire',
    'contact.priority.subtitle': 'Prêt à réserver? Passez le formulaire et planifiez directement',
    'contact.priority.button': 'Réserver Maintenant - Accès Rapide',
    'contact.form.title': 'Envoyez-Nous un Message',
    'contact.form.description': 'Vous avez des questions? Remplissez le formulaire et nous vous répondrons dans les 24 heures.',
    'contact.info.call': 'Appelez-Nous',
    'contact.info.email': 'Envoyez-Nous un Courriel',
    'contact.info.location': 'Localisation',
    'contact.info.hours': 'Heures d\'Ouverture',
    'contact.info.hours.value': 'Lun-Ven: 9h-18h EST',
    'contact.faq.title': 'Questions Fréquemment Posées',
    
    // Navigation - NEW
    'nav.pricing.all': 'Voir Toute la Tarification',
    'nav.mobile.menu': 'Menu',
    'nav.mobile.close': 'Fermer le Menu',
    
    // Footer - NEW
    'footer.section.services': 'Services',
    'footer.section.company': 'Entreprise',
    'footer.section.legal': 'Légal',
    'footer.tagline': 'Studio Créatif Dirigé par des Noirs | Ontario, Canada',
    'footer.description': 'Vidéographie professionnelle, photographie, gestion de marque et design de mode.',
    'footer.newsletter.title': 'Restez Informé',
    'footer.newsletter.subtitle': 'Recevez les dernières nouvelles et offres exclusives',
    'footer.newsletter.placeholder': 'Entrez votre courriel',
    'footer.newsletter.button': 'S\'abonner',
    'footer.social.follow': 'Suivez-Nous',
    'footer.copyright': '© 2026 CREOVA. Tous droits réservés.',
    'footer.link.about': 'À Propos',
    'footer.link.careers': 'Carrières',
    'footer.link.press': 'Kit de Presse',
    'footer.link.refund': 'Politique de Remboursement',
    
    // About Page
    'about.hero.title': 'À Propos de CREOVA',
    'about.services.title': 'Ce Que Nous Faisons',
    'about.problems.title': 'Les Problèmes Que Nous Résolvons',
    'about.values.title': 'Nos Valeurs Fondamentales',
    'about.network.title': 'Notre Réseau',
    'about.network.subtitle': 'Un écosystème interconnecté où la créativité, la technologie et l\'impact culturel convergent pour façonner l\'avenir',
    'about.network.creative': 'Collaborateurs Créatifs',
    'about.network.community': 'Alliés Communautaires & Culturels',
    'about.network.distribution': 'Distribution & Vente au Détail',
    'about.network.marketing': 'Partenaires Marketing',
    'about.network.business': 'Facilitateurs d\'Affaires',
    'about.network.knowledge': 'Partenaires de Connaissance',
    'about.synopsis.title': 'Amplifier les Voix.',
    'about.synopsis.title2': 'Maximiser l\'Impact.',
    'about.synopsis.p1': 'En combinant créativité, stratégie et impact, CREOVA n\'est pas seulement un service—c\'est une plateforme qui permet aux marques et aux individus de transformer leur vision en réalité.',
    'about.synopsis.p2': 'Notre vision est de créer un impact durable dans tous les secteurs grâce à l\'expression créative et à la collaboration, tout en construisant des ponts entre les créatifs BIPOC du monde entier à travers des partenariats diasporiques et des échanges culturels.',
    'about.cta.services': 'Explorer les Services',
    'about.cta.work': 'Travailler Avec Nous',
    'about.connect': 'Restez Connecté',
    
    // Shopping Cart
    'cart.title': 'Panier d\'Achat',
    'cart.empty': 'Votre panier est vide',
    'cart.empty.subtitle': 'Ajoutez des articles pour commencer',
    'cart.continue': 'Continuer les Achats',
    'cart.checkout': 'Passer la Commande',
    'cart.subtotal': 'Sous-total',
    'cart.shipping': 'Livraison',
    'cart.total': 'Total',
    'cart.remove': 'Retirer',
    'cart.quantity': 'Quantité',
    'cart.size': 'Taille',
    'cart.color': 'Couleur',
    'cart.added': 'Ajouté au panier!',
    'cart.removed': 'Retiré du panier',
    'cart.updated': 'Panier mis à jour',
    
    // Product Actions
    'product.quick.view': 'Aperçu Rapide',
    'product.add.wishlist': 'Ajouter aux Favoris',
    'product.remove.wishlist': 'Retirer des Favoris',
    'product.size.guide': 'Guide des Tailles',
    'product.in.stock': 'En Stock',
    'product.low.stock': 'Stock Limité',
    'product.out.stock': 'Rupture de Stock',
    'product.preorder': 'Précommande',
    'product.share': 'Partager',
    'product.details': 'Détails du Produit',
    'product.reviews': 'Avis',
    'product.shipping.info': 'Informations de Livraison',
    'product.you.may.like': 'Vous Aimerez Aussi',
    'product.recently.viewed': 'Récemment Consultés',
    
    // Size Guide
    'size.guide.title': 'Guide des Tailles',
    'size.chest': 'Poitrine',
    'size.waist': 'Taille',
    'size.hips': 'Hanches',
    'size.length': 'Longueur',
    'size.measurements': 'Mesures en pouces',
    
    // Search
    'search.placeholder': 'Rechercher des produits...',
    'search.no.results': 'Aucun résultat trouvé',
    'search.showing': 'Affichage de',
    'search.results': 'résultats',
    
    // Filters
    'filter.sort': 'Trier Par',
    'filter.price.low': 'Prix: Bas à Élevé',
    'filter.price.high': 'Prix: Élevé à Bas',
    'filter.newest': 'Plus Récent',
    'filter.popular': 'Plus Populaire',
    'filter.category': 'Catégorie',
    'filter.price.range': 'Gamme de Prix',
    'filter.clear': 'Effacer les Filtres',
    'filter.apply': 'Appliquer',
    
    // Forms
    'form.required': 'Requis',
    'form.optional': 'Optionnel',
    'form.invalid.email': 'Adresse courriel invalide',
    'form.invalid.phone': 'Numéro de téléphone invalide',
    'form.message.sent': 'Message envoyé avec succès!',
    'form.error.generic': 'Une erreur s\'est produite. Veuillez réessayer.',
    'form.saving': 'Enregistrement...',
    
    // Accessibility
    'a11y.skip.content': 'Aller au contenu',
    'a11y.back.top': 'Retour en haut',
    'a11y.close': 'Fermer',
    'a11y.open.menu': 'Ouvrir le menu',
    'a11y.close.menu': 'Fermer le menu',
    'a11y.loading': 'Chargement',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage or browser language
    const saved = localStorage.getItem('creova-language') as Language;
    if (saved && (saved === 'en' || saved === 'fr')) return saved;
    
    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('fr')) return 'fr';
    return 'en';
  });
  const [isChanging, setIsChanging] = useState(false);

  const setLanguage = (lang: Language) => {
    if (lang === language) return;
    setIsChanging(true);
    
    // Cinematic swap effect
    setTimeout(() => {
      setLanguageState(lang);
      localStorage.setItem('creova-language', lang);
      // Update HTML lang attribute for SEO
      document.documentElement.lang = lang;
      
      setTimeout(() => {
        setIsChanging(false);
      }, 150); // slight delay after content swap to remove overlay
    }, 150); // delay to let overlay fade in
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Set initial HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isChanging }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}