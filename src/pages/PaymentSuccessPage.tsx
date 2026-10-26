import { useEffect } from 'react';
import { useNavigate } from '../i18n/LocaleLink';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const fr = useLanguage().language === 'fr';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
      <PageSEO
        title="Payment Successful"
        description="Your CREOVA payment was successful."
        path="/payment-success"
        noIndex
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <CheckCircle2
            className="w-24 h-24 mx-auto mb-8"
            style={{ color: '#C6A45A' }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl mb-4" style={{ color: '#2D1011' }}>
            {fr ? 'Paiement réussi !' : 'Payment Successful!'}
          </h1>
          <p className="text-xl mb-8" style={{ color: '#777777' }}>
            {fr ? "Merci pour votre commande. Nous vous enverrons un courriel de confirmation sous peu." : "Thank you for your order. We'll send you a confirmation email shortly."}
          </p>

          <div className="space-y-4 mb-12" style={{ color: '#777777' }}>
            <p>
              {fr ? "Votre commande est en cours de traitement et vous recevrez une mise à jour dans les 24 heures." : "Your order is being processed and you'll receive an update within 24 hours."}
            </p>
            <p className="text-sm">
              {fr ? 'Pour toute question, écrivez-nous à ' : 'If you have any questions, feel free to contact us at '}{' '}
              <a
                href="mailto:support@creova.one"
                className="underline"
                style={{ color: '#C6A45A' }}
              >
                support@creova.one
              </a>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              size="lg"
              variant="outline"
              className="px-8"
            >
              {fr ? "Retour à l'accueil" : 'Back to Home'}
            </Button>
            <Button
              onClick={() => navigate('/shop')}
              size="lg"
              className="px-8"
              style={{ backgroundColor: '#2D1011', color: '#FFFFFF' }}
            >
              {fr ? 'Continuer vos achats' : 'Continue Shopping'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
