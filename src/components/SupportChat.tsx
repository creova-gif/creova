import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import logoWhite from '../assets/logo-mark-white.png';
import logoNavy from '../assets/logo-mark-navy.png';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

/**
 * The site-wide support chat widget. Was branded as "Sankofa" (a bird avatar
 * with its own backstory modal) — now a plain CREOVA Support assistant using
 * the real brand mark. The Sankofa story itself wasn't deleted, just moved:
 * it's a proper section on /about now, alongside the founder's own story,
 * rather than living inside a chat-widget info popup.
 */
export function SupportChat() {
  // Read at render time, so guard for the server during prerendering.
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
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
    window.addEventListener('support-chat:open', handleOpen);
    return () => window.removeEventListener('support-chat:open', handleOpen);
  }, []);

  // Move focus into the panel on open, close on Escape, restore focus to the toggle on close
  useEffect(() => {
    if (!isOpen) return;
    chatWindowRef.current?.querySelector<HTMLInputElement>('input')?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      toggleButtonRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message when first opened
      const welcomeMsg: Message = {
        id: Date.now().toString(),
        text: language === 'fr'
          ? "Bonjour! Je suis le soutien CREOVA. Comment puis-je vous aider aujourd'hui?"
          : "Hello! I'm CREOVA Support. How can I help you today?",
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
      pricing: "Les tarifs sont établis dans une proposition après compréhension de la portée, de l'utilisation, de l'échéancier et des livrables. Commencez à /start-a-project pour obtenir une portée et des conditions écrites.",
      services: "CREOVA offre la photographie, la vidéo, les systèmes de marque et visuels, les campagnes, les expériences numériques ainsi que le récit et la documentation d'événements. SEEN et VERSE sont des projets internes à différentes étapes. Consultez /services ou /start-a-project.",
      booking: "Pour démarrer, remplissez le formulaire à /start-a-project. CREOVA confirmera la réception, puis la portée, l'échéancier et les conditions par écrit.",
      seen: "SEEN est la plateforme de narration numérique de CREOVA, actuellement en développement, avec une bêta visée pour décembre 2026. Consultez /ventures pour son état actuel.",
      shop: "VERSE est la marque lifestyle de CREOVA, actuellement en incubation. Le dossier technique est prêt, mais il n'y a ni boutique, ni précommande, ni date de lancement annoncée. Consultez /ventures pour voir son état actuel.",
      digital: "CREOVA développe ses propres produits numériques, dont SEEN. Consultez /ventures pour leur état actuel ou /start-a-project pour discuter d'un projet client.",
      booth: "La vidéo 360 peut être intégrée à certains projets événementiels. Décrivez l'événement à /start-a-project pour confirmer la disponibilité, la portée et les conditions.",
      rental: "La location autonome n'est pas offerte dans le parcours public actuel. Décrivez vos besoins à /start-a-project pour vérifier si l'équipement peut faire partie d'un projet CREOVA.",
      eventdesign: "CREOVA offre des systèmes visuels pour événements et conférences, des visuels promotionnels aux identités complètes et au soutien continu. Commencez à /start-a-project pour définir la portée et les livrables.",
      location: "Basé en Ontario, Canada\n• Voyages partout au Canada\n• Déplacements internationaux disponibles\n\nPour les services hors ville, des frais de déplacement peuvent s'appliquer.",
      payment: "Les conditions de paiement sont confirmées dans une proposition après définition de la portée. Commencez à /start-a-project pour obtenir une portée et des conditions écrites.",
      default: "Je peux vous aider avec les services CREOVA, les réalisations, les projets communautaires, SEEN, VERSE et le démarrage d'un projet. Que souhaitez-vous savoir?"
    } : {
      // English responses
      greeting: "Hello! How can I help you with CREOVA services today?",
      pricing: "Pricing is confirmed in a proposal after CREOVA understands the scope, intended use, timing, and deliverables. Start at /start-a-project for written scope and terms.",
      services: "CREOVA offers photography, videography, brand and visual systems, campaigns, digital experiences, and event story/documentation. SEEN and VERSE are owned ventures at different development stages. Visit /services or start at /start-a-project.",
      booking: "To get started, submit the form at /start-a-project. CREOVA will confirm receipt, then scope, timing, and terms in writing.",
      seen: "SEEN is CREOVA's digital storytelling platform, currently in development, with a beta targeted for December 2026. Visit /ventures for its current status.",
      shop: "VERSE is CREOVA's lifestyle brand, currently incubating. The tech pack is ready, but there is no shop, preorder, or announced launch date. Visit /ventures for its current status.",
      digital: "CREOVA is developing owned digital products, including SEEN. Visit /ventures for their current status or /start-a-project to discuss client work.",
      booth: "360 video can be included in selected event projects. Describe the event at /start-a-project to confirm availability, scope, and terms.",
      rental: "Standalone rental is not offered in the current public journey. Describe your needs at /start-a-project to ask whether equipment can be included in a CREOVA project.",
      eventdesign: "CREOVA offers visual systems for events and conferences, from promotional assets to full identities and ongoing support. Start at /start-a-project to define scope and deliverables.",
      location: "Based in Ontario, Canada\n• Travel across Canada\n• International bookings available\n\nTravel fees may apply for out-of-city services.",
      payment: "Payment terms are confirmed in a project proposal after scope is understood. Start at /start-a-project for a written scope and terms.",
      default: "I can help with CREOVA services, selected work, community projects, SEEN, VERSE, and starting a project. What would you like to know?"
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
    if (msg.match(/seen/)) {
      return responses.seen;
    }
    if (msg.match(/shop|store|fashion|vêtement|boutique|clothes|merchandise|merch|apparel/)) {
      return responses.shop;
    }
    if (msg.match(/digital|preset|template|lut|guide|télécharger|download|numérique|contract|moodboard|resource|ressource/)) {
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
    { label: 'Boutique', message: 'Parlez-moi de la collection VERSE' },
    { label: 'Services', message: 'Quels services offrez-vous?' }
  ] : [
    { label: 'Pricing', message: 'What are your prices?' },
    { label: 'Book Session', message: 'How do I book a session?' },
    { label: 'Shop', message: 'Tell me about the VERSE collection' },
    { label: 'Services', message: 'What services do you offer?' }
  ];

  return (
    <>
      {/* Chat Button — the CREOVA mark, not a mascot */}
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
              ref={toggleButtonRef}
              onClick={() => setIsOpen(true)}
              aria-label={language === 'fr' ? 'Ouvrir le clavardage CREOVA Support' : 'Open CREOVA Support chat'}
              aria-expanded={isOpen}
              className="w-16 h-16 rounded-full shadow-2xl relative overflow-hidden group p-0"
              style={{ backgroundColor: '#B1643B' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4A843] to-[#121212] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.img
                src={logoWhite}
                alt=""
                aria-hidden="true"
                className="relative z-10 w-8 h-auto mx-auto"
                whileHover={{ scale: 1.08, rotate: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
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
          <div
            ref={chatWindowRef}
            role="dialog"
            aria-label={language === 'fr' ? 'Assistant CREOVA Support' : 'CREOVA Support assistant'}
            className="contents"
          >
            {/* Header */}
            <div className="relative p-4 border-b" style={{ backgroundColor: '#121212', borderColor: '#2A2A2A' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4A843]/20 to-[#B1643B]/20" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden p-1.5" style={{ backgroundColor: '#FFFFFF' }}>
                    <img
                      src={logoNavy}
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2" style={{ backgroundColor: '#D4A843', borderColor: '#121212' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: '#F8F9FA' }}>CREOVA Support</h3>
                    <p className="text-xs" style={{ color: '#E0E0E0' }}>
                      {language === 'fr' ? 'On répond généralement vite' : 'We usually reply fast'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  aria-label={language === 'fr' ? 'Fermer le clavardage' : 'Close chat'}
                  className="rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" style={{ color: '#F8F9FA' }} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: '#F8F9FA' }}>
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
                      color: message.sender === 'user' ? '#F8F9FA' : '#121212'
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
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#D4A843', animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#D4A843', animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#D4A843', animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="px-4 py-2 border-t flex gap-2 overflow-x-auto" style={{ borderColor: '#E0E0E0', backgroundColor: '#FFFFFF' }}>
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(action.message);
                      setTimeout(() => handleSend(), 100);
                    }}
                    className="text-xs px-3 py-2 rounded-full whitespace-nowrap border hover:shadow-md transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: '#F8F9FA',
                      borderColor: '#D4A843',
                      color: '#121212'
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t" style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0' }}>
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={language === 'fr' ? 'Écrivez votre message...' : 'Type your message...'}
                  className="flex-1 rounded-xl border-2"
                  style={{ borderColor: '#E0E0E0' }}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="rounded-xl px-4"
                  style={{ backgroundColor: '#121212', color: '#F8F9FA' }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
