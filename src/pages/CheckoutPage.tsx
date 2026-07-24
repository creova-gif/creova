import { useState, useEffect } from 'react';
import { useNavigate } from '../i18n/LocaleLink';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { motion } from 'motion/react';
import { CreditCard, Lock, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { PageSEO } from '../components/PageSEO';
import { useLanguage } from '../context/LanguageContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '');

interface CheckoutFormProps {
  clientSecret: string;
  customerInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
}

function CheckoutForm({ customerInfo }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  // Commercial page → vous register.
  const fr = useLanguage().language === 'fr';
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage('');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/order-confirmation',
        payment_method_data: {
          billing_details: {
            name: customerInfo.name,
            email: customerInfo.email,
            address: {
              line1: customerInfo.address,
              city: customerInfo.city,
              state: customerInfo.province,
              postal_code: customerInfo.postalCode,
              country: 'CA'
            }
          }
        }
      },
      redirect: 'if_required'
    });

    if (error) {
      setMessage(error.message || (fr ? "Une erreur s'est produite" : 'An error occurred'));
      setIsProcessing(false);
      toast.error(fr ? 'Échec du paiement' : 'Payment failed', {
        description: error.message
      });
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      toast.success(fr ? 'Paiement réussi !' : 'Payment successful!');
      clearCart();
      navigate('/order-confirmation?payment_intent=' + paymentIntent.id);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border-2" style={{ borderColor: '#E3DCD3' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" 
               style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)' }}>
            <CreditCard className="w-5 h-5" style={{ color: '#A68F59' }} />
          </div>
          <div>
            <h3 className="text-lg" style={{ color: '#121212' }}>{fr ? 'Informations de paiement' : 'Payment Information'}</h3>
            <p className="text-sm" style={{ color: '#7A6F66' }}>{fr ? 'Paiement sécurisé propulsé par Stripe' : 'Secure payment powered by Stripe'}</p>
          </div>
        </div>

        <PaymentElement 
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['card', 'apple_pay']
          }}
        />
      </div>

      {message && (
        <div className="p-4 rounded-xl border" style={{ backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }}>
          <p className="text-sm" style={{ color: '#991B1B' }}>{message}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-6 rounded-xl text-lg transition-all duration-300"
        style={{ backgroundColor: '#121212' }}
        onMouseEnter={(e) => {
          if (!isProcessing) {
            e.currentTarget.style.backgroundColor = '#A68F59';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isProcessing) {
            e.currentTarget.style.backgroundColor = '#121212';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            {fr ? 'Traitement du paiement...' : 'Processing Payment...'}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Lock className="w-5 h-5" />
            {fr ? 'Compléter le paiement sécurisé' : 'Complete Secure Payment'}
          </span>
        )}
      </Button>

      <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#7A6F66' }}>
        <Lock className="w-4 h-4" />
        <span>{fr ? 'Sécurisé par Stripe • Chiffrement SSL' : 'Secured by Stripe • SSL Encrypted'}</span>
      </div>
    </form>
  );
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const fr = useLanguage().language === 'fr';
  const { items, totalPrice } = useCart();
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    province: 'ON',
    postalCode: ''
  });

  const subtotal = totalPrice;
  const hst = subtotal * 0.13; // 13% HST for Ontario
  const shipping = subtotal >= 100 ? 0 : 15; // Free shipping over $100
  const total = subtotal + hst + shipping;

  useEffect(() => {
    // No redirect — handled by empty state below
  }, [items, navigate]);

  const handleCreatePaymentIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate customer info
    if (!customerInfo.name || !customerInfo.email || !customerInfo.address || 
        !customerInfo.city || !customerInfo.postalCode) {
      toast.error(fr ? 'Veuillez remplir tous les champs obligatoires' : 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-feacf0d8/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            amount: Math.round(total * 100), // Convert to cents
            currency: 'cad',
            customer_info: customerInfo,
            items: items.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity
            }))
          })
        }
      );

      const data = await response.json();

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        throw new Error('Failed to create payment intent');
      }
    } catch (error) {
      toast.error(fr ? "Échec de l'initialisation du paiement" : 'Failed to initialize payment', {
        description: fr ? 'Veuillez réessayer ou joindre le soutien' : 'Please try again or contact support'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const provinces = [
    'ON', 'QC', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'NT', 'YT', 'NU'
  ];

  if (items.length === 0) {
    return (
      <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh' }}>
        <PageSEO title="Checkout" description="Complete your CREOVA purchase." path="/checkout" noIndex />
        {/* Warm gradient top stripe */}
        <div style={{ height: '2px', background: 'linear-gradient(135deg, #A68F59 0%, #B1643B 100%)' }} />
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
            style={{ backgroundColor: 'rgba(166,143,89,0.1)', border: '1px solid rgba(166,143,89,0.2)' }}
          >
            <CreditCard className="w-8 h-8" style={{ color: '#A68F59' }} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.4)' }} />
            <p className="text-xs tracking-[0.45em] uppercase" style={{ color: '#A68F59' }}>{fr ? 'Paiement' : 'Checkout'}</p>
            <div style={{ height: '1px', width: '40px', backgroundColor: 'rgba(166,143,89,0.4)' }} />
          </div>
          <h1 className="text-3xl md:text-4xl font-light mb-4" style={{ color: '#F5F1EB' }}>{fr ? 'Votre panier est vide' : 'Your cart is empty'}</h1>
          <p className="text-base mb-10 max-w-sm" style={{ color: '#7A6F66' }}>
            {fr ? 'Parcourez la collection SEEN ou nos ressources numériques pour trouver quelque chose qui en vaut la peine.' : 'Browse the SEEN collection or our digital resources to find something worth owning.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-3 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #A68F59 0%, #B1643B 100%)' }}
            >
              {fr ? 'Parcourir la boutique SEEN' : 'Browse the SEEN Shop'}
            </button>
            <button
              onClick={() => navigate('/shop/digital')}
              className="px-8 py-3 rounded-lg text-sm font-medium border transition-colors"
              style={{ borderColor: 'rgba(166,143,89,0.35)', color: '#C8C0B8', backgroundColor: 'transparent' }}
            >
              {fr ? 'Ressources numériques' : 'Digital Resources'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F5F1EB', minHeight: '100vh' }}>
      <PageSEO
        title="Checkout"
        description="Complete your CREOVA purchase."
        path="/checkout"
        noIndex
      />
      {/* Header */}
      <section className="py-12 bg-white border-b" style={{ borderColor: '#E3DCD3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/shop')}
              className="mb-4 hover:bg-transparent"
              style={{ color: '#7A6F66' }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {fr ? 'Retour à la boutique' : 'Back to Shop'}
            </Button>
            <h1 className="text-3xl md:text-4xl" style={{ color: '#121212' }}>{fr ? 'Paiement sécurisé' : 'Secure Checkout'}</h1>
            <p className="text-lg mt-2" style={{ color: '#7A6F66' }}>
              {fr ? 'Complétez votre achat avec un paiement sécurisé' : 'Complete your purchase with secure payment'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Customer Info & Payment */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {!clientSecret ? (
                <form onSubmit={handleCreatePaymentIntent} className="space-y-6">
                  {/* Customer Information */}
                  <div className="bg-white rounded-2xl p-8">
                    <h2 className="text-2xl mb-6" style={{ color: '#121212' }}>
                      {fr ? 'Coordonnées' : 'Contact Information'}
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">{fr ? 'Nom complet *' : 'Full Name *'}</Label>
                        <Input
                          id="name"
                          autoComplete="name"
                          required
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                          placeholder="John Doe"
                          className="rounded-xl"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">{fr ? 'Adresse courriel *' : 'Email Address *'}</Label>
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                          placeholder="john@example.com"
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-white rounded-2xl p-8">
                    <h2 className="text-2xl mb-6" style={{ color: '#121212' }}>
                      {fr ? 'Adresse de livraison' : 'Shipping Address'}
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">{fr ? 'Adresse municipale *' : 'Street Address *'}</Label>
                        <Input
                          id="address"
                          autoComplete="street-address"
                          required
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                          placeholder="123 Main St"
                          className="rounded-xl"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">{fr ? 'Ville *' : 'City *'}</Label>
                          <Input
                            id="city"
                            autoComplete="address-level2"
                            required
                            value={customerInfo.city}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                            placeholder="Toronto"
                            className="rounded-xl"
                          />
                        </div>

                        <div>
                          <Label htmlFor="province">{fr ? 'Province *' : 'Province *'}</Label>
                          <select
                            id="province"
                            autoComplete="address-level1"
                            required
                            value={customerInfo.province}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, province: e.target.value })}
                            className="w-full border-2 rounded-xl px-4 py-3 focus:border-[#A68F59] focus:outline-none"
                            style={{ borderColor: '#E3DCD3' }}
                          >
                            {provinces.map(prov => (
                              <option key={prov} value={prov}>{prov}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="postalCode">{fr ? 'Code postal *' : 'Postal Code *'}</Label>
                        <Input
                          id="postalCode"
                          autoComplete="postal-code"
                          required
                          value={customerInfo.postalCode}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, postalCode: e.target.value.toUpperCase() })}
                          placeholder="M5V 3A8"
                          className="rounded-xl"
                          maxLength={7}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl text-base font-medium text-white transition-opacity disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #A68F59 0%, #B1643B 100%)', boxShadow: '0 4px 14px rgba(166,143,89,0.3)' }}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {fr ? 'Chargement...' : 'Loading...'}
                      </span>
                    ) : (
                      fr ? 'Continuer vers le paiement' : 'Continue to Payment'
                    )}
                  </button>
                </form>
              ) : (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm clientSecret={clientSecret} customerInfo={customerInfo} />
                </Elements>
              )}
            </motion.div>

            {/* Right Column - Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white rounded-2xl p-8 sticky top-24">
                <h2 className="text-2xl mb-6" style={{ color: '#121212' }}>
                  {fr ? 'Récapitulatif de commande' : 'Order Summary'}
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b" style={{ borderColor: '#E3DCD3' }}>
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="mb-1" style={{ color: '#121212' }}>{item.name}</h3>
                        <p className="text-sm mb-1" style={{ color: '#7A6F66' }}>
                          {fr ? 'Quantité' : 'Quantity'}: {item.quantity}
                        </p>
                        <p style={{ color: '#A68F59' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 pb-4 mb-4 border-b" style={{ borderColor: '#E3DCD3' }}>
                  <div className="flex justify-between">
                    <span style={{ color: '#7A6F66' }}>{fr ? 'Sous-total' : 'Subtotal'}</span>
                    <span style={{ color: '#121212' }}>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#7A6F66' }}>{fr ? 'Livraison' : 'Shipping'}</span>
                    <span style={{ color: '#121212' }}>
                      {shipping === 0 ? (fr ? 'GRATUIT' : 'FREE') : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#7A6F66' }}>{fr ? 'TVH (13 %)' : 'HST (13%)'}</span>
                    <span style={{ color: '#121212' }}>${hst.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl" style={{ color: '#121212' }}>{fr ? 'Total' : 'Total'}</span>
                  <span className="text-3xl" style={{ color: '#121212' }}>
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Security Badges */}
                <div className="pt-6 border-t space-y-3" style={{ borderColor: '#E3DCD3' }}>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#7A6F66' }}>
                    <CheckCircle2 className="w-4 h-4" style={{ color: '#A68F59' }} />
                    <span>{fr ? 'Chiffrement SSL sécurisé' : 'Secure SSL encryption'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#7A6F66' }}>
                    <CheckCircle2 className="w-4 h-4" style={{ color: '#A68F59' }} />
                    <span>{fr ? 'Traitement des paiements conforme PCI' : 'PCI compliant payment processing'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#7A6F66' }}>
                    <CheckCircle2 className="w-4 h-4" style={{ color: '#A68F59' }} />
                    <span>{fr ? 'Garantie de remboursement' : 'Money-back guarantee'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}