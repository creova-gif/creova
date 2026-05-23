const fs = require('fs');
const path = require('path');

const contextPath = path.join(__dirname, 'src/context/LanguageContext.tsx');
let content = fs.readFileSync(contextPath, 'utf-8');

const newEnKeys = `
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
`;

const newFrKeys = `
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
    'nav.pricing.brand.desc': 'Profile Pro, Histoires d\\'Espace de Travail',
    'nav.pricing.product': 'Photographie de Produits',
    'nav.pricing.product.desc': 'Photos de produits e-commerce et style de vie',
    'nav.pricing.aerial': 'Aérien/Drone',
    'nav.pricing.aerial.desc': 'Perspectives aériennes cinématographiques',
    'nav.pricing.events': 'Couverture d\\'Événements',
    'nav.pricing.events.desc': 'Forfaits photo + vidéo',
    'nav.pricing.social': 'Médias Sociaux',
    'nav.pricing.social.desc': 'Forfaits de gestion mensuelle',
    'nav.pricing.design': 'Design Graphique',
    'nav.pricing.design.desc': 'Branding et identité visuelle',
    'nav.book.call': 'Réserver un Appel',
    'nav.seen.label': 'SEEN — Plateforme à Venir',
    'nav.book.call.mobile': 'Réserver un Appel Découverte',
    'nav.pricing': 'Tarification',
    'nav.cart.aria': 'Panier d\\'achat',
    'trust.test1.quote': "Le travail de CREOVA sur notre campagne du Mois de l'Histoire des Noirs a été exceptionnel. Ils ont compris notre vision et ont livré au-delà des attentes.",
    'trust.test1.author': 'Droits de la Personne & Équité',
    'trust.test1.org': 'Université Brock',
    'trust.test2.quote': 'Professionnel, créatif et conscient de la culture. CREOVA apporte de l\\'authenticité à chaque projet.',
    'trust.test2.author': 'Équipe BSSC',
    'trust.test2.org': 'Centre de Réussite des Étudiants Noirs',
    'trust.test3.quote': 'Leur photographie capture l\\'essence de notre communauté. CREOVA est notre partenaire créatif de choix.',
    'trust.test3.author': 'Leadership BSA',
    'trust.test3.org': 'Association des Étudiants Noirs',
`;

content = content.replace(/(en:\s*\{)/, "$1\\n" + newEnKeys);
content = content.replace(/(fr:\s*\{)/, "$1\\n" + newFrKeys);

fs.writeFileSync(contextPath, content);
console.log('LanguageContext.tsx patched successfully.');
