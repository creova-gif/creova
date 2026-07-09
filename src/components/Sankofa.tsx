import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Send, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
const sankofaLogo = '/sankofa-profile.jpg';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function Sankofa() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [isOpen, setIsOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { pathname } = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('sankofa:open', handleOpen);
    return () => window.removeEventListener('sankofa:open', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message when first opened
      const welcomeMsg: Message = {
        id: Date.now().toString(),
        text: language === 'fr' 
          ? "Bonjour! Je suis Sankofa, votre assistant CREOVA. Comment puis-je vous aider aujourd'hui?"
          : "Hello! I'm Sankofa, your CREOVA assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMsg]);
    }
  }, [isOpen]);

  // Hide on homepage — all hooks must be called before any early return
  if (pathname === '/') return null;

  const getBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    // Bilingual responses based on language
    const responses = language === 'fr' ? {
      // French responses
      greeting: "Bonjour! Comment puis-je vous aider avec les services CREOVA aujourd'hui?",
      pricing: "Nos prix varient selon le service:\n\n• Photographie familiale: 450$ - 950$ CAD\n• Photographie de marque: 750$ - 1,600$ CAD\n• Photographie de produits: 600$ - 1,400$ CAD\n• Drone/Aérien: 500$ - 900$ CAD\n• Couverture d'événements: 750$ - 2,550$ CAD\n• Design graphique: 600$ - 3,000$+ CAD\n• Design d'événements/conférences: 600$ - 2,500$ CAD\n• Forfaits mensuels design: 450$ - 1,600$/mois\n• Location DJI Osmo: 175$/jour\n\nVoulez-vous des détails sur un service spécifique?",
      services: "CREOVA offre:\n\nVideographie professionnelle\n• Photographie (familiale, marque, produits)\n• Gestion de marque & design\n• Design d'événements & conférences\n• Gestion des médias sociaux\n• Marchandise SEEN (Lancement Novembre 2026)\n• Produits numériques (Lancement Novembre 2026)\n• Couverture d'événements\n• Photographie aérienne/drone\n• Location d'équipement créatif\n\nQuel service vous intéresse?",
      booking: "Pour réserver une session:\n\n1. Visitez notre page Tarifs\n2. Choisissez votre forfait\n3. Cliquez sur 'Réserver'\n4. Un acompte de 50% sécurise votre date\n\nOu écrivez-nous: support@creova.ca",
      shop: "BIENTÔT — NOVEMBRE 2026!\n\nSEEN est l'écosystème complet de CREOVA — une application de narration et une collection vestimentaire, lancées ensemble ce novembre.\n\nLa collection FW2026:\n• T-shirts signature (35$ CAD)\n• Chandails à capuche (65$ CAD)\n• Coupe-vent (85$ CAD)\n• Casquettes & accessoires (20$ - 30$ CAD)\n\nInscrivez-vous à la liste d'attente au /shop, ou découvrez l'application au /seen",
      digital: "BIENTÔT — NOVEMBRE 2026!\n\nNos produits numériques arrivent ce novembre:\n\n• Packs de presets Lightroom (29$ CAD)\n• Templates de marque (49$ CAD)\n• Pack LUT cinématique (39$ CAD)\n• Guides & ressources (15$ - 35$ CAD)\n\nInscrivez-vous à la liste d'attente au /digital-products",
      booth: "Notre cabine 360 est parfaite pour les événements!\n\n• Capture des vidéos dynamiques à 360°\n• 650$ CAD par événement\n• Idéal pour: mariages, fêtes corporatives, lancements\n• Engagement instantané sur les médias sociaux\n\nAjoutez-le à n'importe quel forfait événement!",
      rental: "Location d'équipement professionnel:\n\n• Kit DJI Osmo Creator: 175$/jour\n   - DJI Osmo Pocket 3 ou Action 5 Pro\n   - Système de micro sans fil (2x émetteurs)\n   - Perche d'extension & trépied\n   - Batteries & stockage supplémentaires\n   - Dépôt: 400$ CAD\n\n• Kit photographie: 150$/jour\n• Kit vidéographie: 250$/jour\n• Pack éclairage: 100$/jour\n• Pack audio: 75$/jour\n\nRéservation 48h à l'avance requise!",
      eventdesign: "Design d'événements & conférences:\n\nForfaits projets:\n• Event Essentials: 600$ CAD\n• Standard Event Branding: 1,200$ CAD\n• Full Event Identity Suite: 2,500$ CAD\n\nForfaits mensuels:\n• Starter: 450$/mois\n• Growth: 850$/mois\n• Premium: 1,600$/mois\n\nParfait pour universités, organisations et entreprises!",
      location: "Basé en Ontario, Canada\n• Voyages partout au Canada\n• Déplacements internationaux disponibles\n\nPour les services hors ville, des frais de déplacement peuvent s'appliquer.",
      payment: "Nous acceptons:\n\n• Cartes de crédit/débit\n• Apple Pay\n• Google Pay\n• Paiement Stripe\n\nPaiement sécurisé: 50% d'acompte + solde avant livraison.",
      default: "Je peux vous aider avec:\n\n• Tarifs & forfaits\n• Réservation de sessions\n• SEEN — notre écosystème application + collection (Novembre 2026)\n• Produits numériques (Novembre 2026)\n• Détails des services\n• Location d'équipement\n• Localisation & déplacements\n• Informations de paiement\n\nQue souhaitez-vous savoir?"
    } : {
      // English responses
      greeting: "Hello! How can I help you with CREOVA services today?",
      pricing: "Our pricing varies by service:\n\n• Family Photography: $450 - $950 CAD\n• Brand Photography: $750 - $1,600 CAD\n• Product Photography: $600 - $1,400 CAD\n• Drone/Aerial: $500 - $900 CAD\n• Event Coverage: $750 - $2,550 CAD\n• Graphic Design: $600 - $3,000+ CAD\n• Event/Conference Design: $600 - $2,500 CAD\n• Monthly Design Retainers: $450 - $1,600/mo\n• DJI Osmo Rental: $175/day\n\nWould you like details on a specific service?",
      services: "CREOVA offers:\n\nProfessional Videography\n• Photography (family, brand, product)\n• Brand Management & Design\n• Event & Conference Design\n• Social Media Management\n• SEEN Merchandise (Coming November 2026)\n• Digital Products (Coming November 2026)\n• Event Coverage\n• Aerial/Drone Photography\n• Creative Equipment Rentals\n\nWhich service interests you?",
      booking: "To book a session:\n\n1. Visit our Pricing page\n2. Choose your package\n3. Click 'Book Session'\n4. 50% deposit secures your date\n\nOr email us: support@creova.ca",
      shop: "COMING NOVEMBER 2026!\n\nSEEN is CREOVA's full ecosystem — a storytelling app and a wearable capsule, launching together this November.\n\nThe FW2026 collection:\n• Signature Tees ($35 CAD)\n• Hoodies ($65 CAD)\n• Windbreakers ($85 CAD)\n• Caps & Accessories ($20 - $30 CAD)\n\nJoin the waitlist at /shop, or explore the app at /seen",
      digital: "COMING NOVEMBER 2026!\n\nOur digital products launch this November:\n\n• Lightroom Preset Packs ($29 CAD)\n• Brand Template Kits ($49 CAD)\n• Cinematic LUT Pack ($39 CAD)\n• Guides & Resources ($15 - $35 CAD)\n\nJoin the waitlist at /digital-products",
      booth: "Our 360 Booth Camera is perfect for events!\n\n• Captures dynamic 360° videos\n• $650 CAD per event\n• Great for: weddings, corporate parties, launches\n• Instant social media engagement\n\nAdd it to any event package!",
      rental: "Professional equipment rentals:\n\n• DJI Osmo Creator Kit: $175/day\n   - DJI Osmo Pocket 3 or Action 5 Pro\n   - Wireless Mic System (2x transmitters)\n   - Extension Rod & Tripod\n   - Extra Batteries & Storage\n   - Deposit: $400 CAD\n\n• Photography Kit: $150/day\n• Videography Kit: $250/day\n• Lighting Package: $100/day\n• Audio Package: $75/day\n\nBook 48 hours in advance!",
      eventdesign: "Event & Conference Design packages:\n\nProject-based:\n• Event Essentials Package: $600 CAD\n• Standard Event Branding: $1,200 CAD\n• Full Event Identity Suite: $2,500 CAD\n\nMonthly Retainers:\n• Starter: $450/month\n• Growth: $850/month\n• Premium: $1,600/month\n\nPerfect for universities, organizations & companies!",
      location: "Based in Ontario, Canada\n• Travel across Canada\n• International bookings available\n\nTravel fees may apply for out-of-city services.",
      payment: "We accept:\n\n• Credit/Debit Cards\n• Apple Pay\n• Google Pay\n• Stripe Payments\n\nSecure 50% deposit + balance before delivery.",
      default: "I can help you with:\n\n• Pricing & packages\n• Booking sessions\n• SEEN — our app + capsule ecosystem (November 2026)\n• Digital Products (November 2026)\n• Service details\n• Equipment rentals\n• Location & travel\n• Payment info\n\nWhat would you like to know?"
    };

    // Match user intent
    if (msg.match(/hello|hi|hey|bonjour|salut/)) {
      return responses.greeting;
    }
    if (msg.match(/price|pricing|cost|prix|tarif|combien/)) {
      return responses.pricing;
    }
    if (msg.match(/service|what do you|qu'est-ce que|quoi/)) {
      return responses.services;
    }
    if (msg.match(/book|booking|réserver|rendez-vous|appointment/)) {
      return responses.booking;
    }
    if (msg.match(/shop|store|fashion|seen|vêtement|boutique|clothes|merchandise|merch|apparel/)) {
      return responses.shop;
    }
    if (msg.match(/digital|preset|template|lut|guide|télécharger|download|numérique/)) {
      return responses.digital;
    }
    if (msg.match(/360|booth|cabine/)) {
      return responses.booth;
    }
    if (msg.match(/rent|rental|location|équipement|equipment|osmo|dji/)) {
      return responses.rental;
    }
    if (msg.match(/event.*design|conference.*design|design.*event|design.*conference|retainer|university|organiz/)) {
      return responses.eventdesign;
    }
    
    return responses.default;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot typing and respond
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = language === 'fr' ? [
    { label: 'Tarification', message: 'Quels sont vos prix?' },
    { label: 'Réserver', message: 'Comment réserver une session?' },
    { label: 'Boutique', message: 'Parlez-moi de la collection SEEN' },
    { label: 'Services', message: 'Quels services offrez-vous?' }
  ] : [
    { label: 'Pricing', message: 'What are your prices?' },
    { label: 'Book Session', message: 'How do I book a session?' },
    { label: 'Shop', message: 'Tell me about SEEN collection' },
    { label: 'Services', message: 'What services do you offer?' }
  ];

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 rounded-full shadow-2xl relative overflow-hidden group p-0"
              style={{ backgroundColor: '#B1643B' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#A68F59] to-[#121212] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img 
                src={sankofaLogo} 
                alt="Sankofa" 
                className="relative z-10 w-full h-full object-cover rounded-full"
              />
              
              {/* Pulse animation */}
              <span className={`absolute inset-0 rounded-full opacity-20${prefersReduced ? '' : ' animate-ping'}`} style={{ backgroundColor: '#B1643B' }} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 w-[90vw] sm:w-96 h-[600px] max-h-[80vh] z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            {/* Header */}
            <div className="relative p-4 border-b" style={{ backgroundColor: '#121212', borderColor: '#2C2C2C' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#A68F59]/20 to-[#B1643B]/20" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden p-0" style={{ backgroundColor: '#FFFFFF' }}>
                    <img 
                      src={sankofaLogo} 
                      alt="Sankofa" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2" style={{ backgroundColor: '#A68F59', borderColor: '#121212' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: '#F5F1EB' }}>Sankofa</h3>
                    <p className="text-xs" style={{ color: '#E3DCD3' }}>
                      {language === 'fr' ? 'Assistant CREOVA' : 'CREOVA Assistant'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInfo(true)}
                    className="rounded-full hover:bg-white/10"
                    title={language === 'fr' ? 'En savoir plus sur Sankofa' : 'Learn about Sankofa'}
                  >
                    <HelpCircle className="w-5 h-5" style={{ color: '#F5F1EB' }} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full hover:bg-white/10"
                  >
                    <X className="w-5 h-5" style={{ color: '#F5F1EB' }} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: '#F5F1EB' }}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
                    }`}
                    style={{
                      backgroundColor: message.sender === 'user' ? '#121212' : '#FFFFFF',
                      color: message.sender === 'user' ? '#F5F1EB' : '#121212'
                    }}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                    <p className="text-[10px] mt-1 opacity-60">
                      {message.timestamp.toLocaleTimeString(language === 'fr' ? 'fr-CA' : 'en-CA', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#A68F59', animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#A68F59', animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#A68F59', animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="px-4 py-2 border-t flex gap-2 overflow-x-auto" style={{ borderColor: '#E3DCD3', backgroundColor: '#FFFFFF' }}>
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(action.message);
                      setTimeout(() => handleSend(), 100);
                    }}
                    className="text-xs px-3 py-2 rounded-full whitespace-nowrap border hover:shadow-md transition-all duration-200 hover:scale-105"
                    style={{ 
                      backgroundColor: '#F5F1EB',
                      borderColor: '#A68F59',
                      color: '#121212'
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t" style={{ backgroundColor: '#FFFFFF', borderColor: '#E3DCD3' }}>
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={language === 'fr' ? 'Écrivez votre message...' : 'Type your message...'}
                  className="flex-1 rounded-xl border-2"
                  style={{ borderColor: '#E3DCD3' }}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="rounded-xl px-4"
                  style={{ backgroundColor: '#121212', color: '#F5F1EB' }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfo(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[80vh] z-[70] rounded-2xl shadow-2xl overflow-hidden"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              {/* Header */}
              <div className="relative p-6 border-b" style={{ backgroundColor: '#121212', borderColor: '#2C2C2C' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-[#A68F59]/20 to-[#B1643B]/20" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={sankofaLogo} 
                      alt="Sankofa" 
                      className="w-12 h-12 rounded-full"
                      style={{ filter: 'sepia(1) saturate(2) hue-rotate(-10deg) brightness(0.6)' }}
                    />
                    <div>
                      <h2 className="text-xl" style={{ color: '#F5F1EB' }}>
                        {language === 'fr' ? 'À propos de Sankofa' : 'About Sankofa'}
                      </h2>
                      <p className="text-sm" style={{ color: '#E3DCD3' }}>
                        {language === 'fr' ? 'Symbole Adinkra de sagesse et d\'apprentissage' : 'Adinkra Symbol of Wisdom and Learning'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInfo(false)}
                    className="rounded-full hover:bg-white/10"
                  >
                    <X className="w-5 h-5" style={{ color: '#F5F1EB' }} />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]" style={{ backgroundColor: '#F5F1EB' }}>
                <div className="space-y-6">
                  {/* Meaning */}
                  <div>
                    <h3 className="text-lg mb-3" style={{ color: '#121212' }}>
                      {language === 'fr' ? 'La Sagesse de Sankofa' : 'The Wisdom of Sankofa'}
                    </h3>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: '#121212' }}>
                      {language === 'fr' 
                        ? 'Le symbole Sankofa représente un oiseau regardant en arrière tout en tenant un œuf dans son bec, incarnant l\'importance de retourner au passé pour récupérer des connaissances et des traditions précieuses afin de construire un meilleur avenir.'
                        : 'The Sankofa symbol represents a bird looking backward while holding an egg in its beak, embodying the importance of returning to the past to retrieve valuable knowledge and traditions for building a better future.'}
                    </p>
                    <p className="text-sm leading-relaxed italic px-4 py-3 rounded-lg" style={{ backgroundColor: '#FFFFFF', color: '#121212' }}>
                      <strong>"Se wo were fi na wosankofa a yenkyi"</strong><br />
                      {language === 'fr' 
                        ? '"Il n\'est pas mal de retourner chercher ce que vous avez oublié"'
                        : '"It is not wrong to go back for that which you have forgotten"'}
                    </p>
                  </div>

                  {/* Founder Connection */}
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                    <h3 className="text-lg mb-3" style={{ color: '#121212' }}>
                      {language === 'fr' ? 'Connexion avec le fondateur de CREOVA' : 'Connection to CREOVA\'s Founder'}
                    </h3>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: '#121212' }}>
                      {language === 'fr'
                        ? 'En 2024, le fondateur de CREOVA a développé les actifs créatifs pour le Mois de l\'histoire des Noirs et le Mois du patrimoine africain à l\'Université Brock en partenariat avec Human Rights & Equity (HRE).'
                        : 'In 2024, CREOVA\'s founder developed creative assets for Black History Month and African Heritage Month at Brock University in partnership with Human Rights & Equity (HRE).'}
                    </p>
                  </div>

                  {/* Thematic Rationale */}
                  <div>
                    <h3 className="text-lg mb-3" style={{ color: '#121212' }}>
                      {language === 'fr' ? 'Fondement thématique' : 'Thematic Rationale'}
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                        <h4 className="text-sm mb-2" style={{ color: '#B1643B' }}>
                          {language === 'fr' ? '1. Sankofa : Réfléchir au passé pour éclairer l\'avenir' : '1. Sankofa: Reflecting on the Past to Inform the Future'}
                        </h4>
                        <p className="text-sm leading-relaxed" style={{ color: '#121212' }}>
                          {language === 'fr'
                            ? 'Cela s\'aligne parfaitement avec l\'engagement de la Charte de Scarborough à aborder les barrières systémiques en reconnaissant les injustices historiques et en favorisant la responsabilité institutionnelle.'
                            : 'This aligns seamlessly with the Scarborough Charter\'s commitment to addressing systemic barriers by acknowledging historical injustices and fostering accountability in institutions.'}
                        </p>
                      </div>

                      <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                        <h4 className="text-sm mb-2" style={{ color: '#B1643B' }}>
                          {language === 'fr' ? '2. Intersectionnalité et la vision de Lorde' : '2. Intersectionality and Lorde\'s Vision'}
                        </h4>
                        <p className="text-sm leading-relaxed mb-2" style={{ color: '#121212' }}>
                          {language === 'fr'
                            ? 'La citation d\'Audre Lorde nous rappelle la nature interconnectée des luttes telles que le racisme, le sexisme et d\'autres oppressions systémiques :'
                            : 'Audre Lorde\'s quote reminds us of the interconnected nature of struggles such as racism, sexism, and other systemic oppressions:'}
                        </p>
                        <p className="text-sm italic px-3 py-2 rounded" style={{ backgroundColor: '#F5F1EB', color: '#121212' }}>
                          {language === 'fr'
                            ? '"Il n\'y a pas de lutte à un seul problème parce que nous ne vivons pas de vies à un seul problème."'
                            : '"There is no such thing as a single-issue struggle because we do not live single-issue lives."'}
                        </p>
                      </div>

                      <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                        <h4 className="text-sm mb-2" style={{ color: '#B1643B' }}>
                          {language === 'fr' ? '3. La Charte de Scarborough et la transformation institutionnelle' : '3. The Scarborough Charter and Institutional Transformation'}
                        </h4>
                        <p className="text-sm leading-relaxed" style={{ color: '#121212' }}>
                          {language === 'fr'
                            ? 'Enracinée dans les valeurs d\'équité, de décolonisation et d\'anti-racisme envers les Noirs, la Charte de Scarborough est un plan pour une transformation inclusive au sein du milieu académique.'
                            : 'Rooted in the values of equity, decolonization, and anti-Black racism, the Scarborough Charter is a blueprint for inclusive transformation within academia.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Why Sankofa for CREOVA */}
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#A68F59', color: '#121212' }}>
                    <h3 className="text-lg mb-3">
                      {language === 'fr' ? 'Pourquoi Sankofa pour CREOVA' : 'Why Sankofa for CREOVA'}
                    </h3>
                    <p className="text-sm leading-relaxed">
                      {language === 'fr'
                        ? 'Sankofa représente l\'engagement de CREOVA à honorer l\'héritage culturel, à apprendre de l\'histoire et à créer un avenir inclusif grâce à l\'excellence créative. Cela incarne notre mission d\'autonomiser les communautés BIPOC à travers la narration visuelle et l\'expression culturelle.'
                        : 'Sankofa represents CREOVA\'s commitment to honoring cultural heritage, learning from history, and creating an inclusive future through creative excellence. It embodies our mission to empower BIPOC communities through visual storytelling and cultural expression.'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}