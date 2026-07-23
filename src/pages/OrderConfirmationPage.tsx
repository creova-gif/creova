import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useNavigate } from '../i18n/LocaleLink';
import { motion } from 'motion/react';
import { CheckCircle2, Package, Mail, ArrowRight, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';

export function OrderConfirmationPage() {
  const navigate = useNavigate();
  const fr = useLanguage().language === 'fr';
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const paymentIntentId = searchParams.get('payment_intent');

  useEffect(() => {
    if (!paymentIntentId) {
      navigate('/shop');
      return;
    }

    // In a real implementation, you would fetch order details from your backend
    // For now, we'll show a success message
    setOrderDetails({
      orderId: paymentIntentId.slice(-8).toUpperCase(),
      status: 'confirmed'
    });
  }, [paymentIntentId, navigate]);

  if (!orderDetails) {
    return null;
  }

  return (
    <div style={{ backgroundColor: '#F5F1EB', minHeight: '100vh' }}>
      <PageSEO
        title="Order Confirmation"
        description="Your CREOVA order confirmation."
        path="/order-confirmation"
        noIndex
      />
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center"
              style={{ backgroundColor: '#A68F59' }}
            >
              <CheckCircle2 className="w-12 h-12" style={{ color: '#F5F1EB' }} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl mb-4"
              style={{ color: '#121212' }}
            >
              {fr ? 'Commande confirmée !' : 'Order Confirmed!'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl mb-8"
              style={{ color: '#7A6F66' }}
            >
              {fr ? 'Merci pour votre achat. Votre commande a été traitée avec succès.' : 'Thank you for your purchase. Your order has been successfully processed.'}
            </motion.p>

            {/* Order Number */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-8 mb-8"
            >
              <p className="text-sm mb-2" style={{ color: '#7A6F66' }}>{fr ? 'Numéro de commande' : 'Order Number'}</p>
              <p className="text-3xl mb-6" style={{ color: '#121212' }}>
                #{orderDetails.orderId}
              </p>

              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                       style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)' }}>
                    <Mail className="w-5 h-5" style={{ color: '#A68F59' }} />
                  </div>
                  <div>
                    <h3 className="mb-1" style={{ color: '#121212' }}>{fr ? 'Courriel envoyé' : 'Email Sent'}</h3>
                    <p className="text-sm" style={{ color: '#7A6F66' }}>
                      {fr ? 'Confirmation de commande envoyée à votre courriel' : 'Order confirmation sent to your email'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                       style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)' }}>
                    <Package className="w-5 h-5" style={{ color: '#A68F59' }} />
                  </div>
                  <div>
                    <h3 className="mb-1" style={{ color: '#121212' }}>{fr ? 'Traitement' : 'Processing'}</h3>
                    <p className="text-sm" style={{ color: '#7A6F66' }}>
                      {fr ? 'Votre commande est en préparation' : 'Your order is being prepared'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                       style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)' }}>
                    <Download className="w-5 h-5" style={{ color: '#A68F59' }} />
                  </div>
                  <div>
                    <h3 className="mb-1" style={{ color: '#121212' }}>{fr ? 'Reçu' : 'Receipt'}</h3>
                    <p className="text-sm" style={{ color: '#7A6F66' }}>
                      {fr ? 'Disponible dans votre courriel' : 'Available in your email'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* What's Next */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-8 mb-8 text-left"
            >
              <h2 className="text-2xl mb-6" style={{ color: '#121212' }}>
                {fr ? 'Et ensuite ?' : "What's Next?"}
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                       style={{ backgroundColor: '#A68F59' }}>
                    <span className="text-xs" style={{ color: '#F5F1EB' }}>1</span>
                  </div>
                  <div>
                    <h3 className="mb-1" style={{ color: '#121212' }}>{fr ? 'Traitement de la commande' : 'Order Processing'}</h3>
                    <p className="text-sm" style={{ color: '#7A6F66' }}>
                      {fr ? 'Nous préparons vos articles pour expédition. Cela prend généralement 1 à 2 jours ouvrables.' : "We're preparing your items for shipment. This typically takes 1-2 business days."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                       style={{ backgroundColor: '#A68F59' }}>
                    <span className="text-xs" style={{ color: '#F5F1EB' }}>2</span>
                  </div>
                  <div>
                    <h3 className="mb-1" style={{ color: '#121212' }}>{fr ? "Avis d'expédition" : 'Shipping Notification'}</h3>
                    <p className="text-sm" style={{ color: '#7A6F66' }}>
                      {fr ? "Vous recevrez un courriel avec les informations de suivi dès que votre commande sera expédiée." : "You'll receive an email with tracking information once your order ships."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                       style={{ backgroundColor: '#A68F59' }}>
                    <span className="text-xs" style={{ color: '#F5F1EB' }}>3</span>
                  </div>
                  <div>
                    <h3 className="mb-1" style={{ color: '#121212' }}>{fr ? 'Livraison' : 'Delivery'}</h3>
                    <p className="text-sm" style={{ color: '#7A6F66' }}>
                      {fr ? 'Livraison estimée : 5 à 7 jours ouvrables pour la livraison standard.' : 'Estimated delivery: 5-7 business days for standard shipping.'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Button
                asChild
                size="lg"
                className="px-8 py-6 rounded-xl text-lg transition-all duration-300"
                style={{ backgroundColor: '#121212' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#A68F59';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#121212';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Link to="/shop">
                  <span className="flex items-center gap-2">
                    {fr ? 'Continuer vos achats' : 'Continue Shopping'}
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="px-8 py-6 rounded-xl text-lg border-2 transition-all duration-300"
                style={{ borderColor: '#E3DCD3', color: '#121212' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#A68F59';
                  e.currentTarget.style.color = '#A68F59';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E3DCD3';
                  e.currentTarget.style.color = '#121212';
                }}
              >
                <Link to="/">{fr ? "Aller à l'accueil" : 'Go to Homepage'}</Link>
              </Button>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 pt-8 border-t"
              style={{ borderColor: '#E3DCD3' }}
            >
              <p className="text-sm" style={{ color: '#7A6F66' }}>
                {fr ? 'Des questions sur votre commande ?' : 'Questions about your order?'}{' '}
                <Link to="/contact" className="underline" style={{ color: '#A68F59' }}>
                  {fr ? 'Contactez notre équipe de soutien' : 'Contact our support team'}
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}