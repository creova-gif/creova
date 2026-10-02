import { useNavigate } from '../i18n/LocaleLink';
import { CreditCard } from 'lucide-react';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';

export function CheckoutPage() {
  const navigate = useNavigate();
  const fr = useLanguage().language === 'fr';

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
      <PageSEO title="Checkout" description="Complete your CREOVA purchase." path="/checkout" noIndex />
      <div style={{ height: '2px', background: 'linear-gradient(135deg, #D4A843 0%, #B1643B 100%)' }} />
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
          style={{ backgroundColor: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)' }}
        >
          <CreditCard className="w-8 h-8" style={{ color: '#D4A843' }} />
        </div>
        <h1 className="text-3xl md:text-4xl font-light mb-4" style={{ color: '#F8F9FA' }}>
          {fr ? "Ce service n'est plus disponible" : 'This service is no longer available'}
        </h1>
        <p className="text-base mb-10 max-w-md" style={{ color: '#777777' }}>
          {fr
            ? "La boutique, le paiement et les abonnements sont fermés. Aucun paiement n'est demandé."
            : 'Shop checkout, tickets, and memberships are closed. No payment is collected.'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-8 py-3 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #D4A843 0%, #B1643B 100%)' }}
        >
          {fr ? "Retour à l'accueil" : 'Back home'}
        </button>
      </div>
    </div>
  );
}
