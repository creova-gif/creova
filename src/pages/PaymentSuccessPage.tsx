import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { CheckCircle2, ArrowRight, Crown, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import { PageSEO } from '../components/PageSEO';

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [membershipType, setMembershipType] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Check if this is a membership purchase
    const membership = searchParams.get('membership');
    if (membership) {
      setMembershipType(membership);
    }
  }, [searchParams]);

  const isMembership = !!membershipType;

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F1EB' }}>
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
          {isMembership ? (
            membershipType === 'legacy' ? (
              <Crown 
                className="w-24 h-24 mx-auto mb-8" 
                style={{ color: '#B1643B' }} 
              />
            ) : (
              <Star 
                className="w-24 h-24 mx-auto mb-8" 
                style={{ color: '#A68F59' }} 
              />
            )
          ) : (
            <CheckCircle2 
              className="w-24 h-24 mx-auto mb-8" 
              style={{ color: '#A68F59' }} 
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl mb-4" style={{ color: '#121212' }}>
            {isMembership ? 'Welcome to CREOVA!' : 'Payment Successful!'}
          </h1>
          <p className="text-xl mb-8" style={{ color: '#4A3E36' }}>
            {isMembership ? (
              <>
                Your <strong>{membershipType === 'creator' ? 'Creator' : 'Legacy'}</strong> membership is now active.
                <br />
                Welcome to the creative community!
              </>
            ) : (
              'Thank you for your order. We\'ll send you a confirmation email shortly.'
            )}
          </p>

          <div className="space-y-4 mb-12" style={{ color: '#7A6F66' }}>
            {isMembership ? (
              <>
                <div className="bg-white p-6 rounded-2xl border-2" style={{ borderColor: membershipType === 'legacy' ? '#B1643B' : '#A68F59' }}>
                  <p className="text-base mb-3" style={{ color: '#121212' }}>
                    <strong>What's Next?</strong>
                  </p>
                  <ul className="text-left space-y-2 max-w-md mx-auto">
                    <li>✓ Check your email for membership details</li>
                    <li>✓ Access exclusive member resources</li>
                    <li>✓ Join our monthly creator meetups</li>
                    <li>✓ Start enjoying your membership benefits</li>
                  </ul>
                </div>
                <p className="text-sm">
                  Questions about your membership?{' '}
                  <a 
                    href="mailto:support@creova.ca"
                    className="underline"
                    style={{ color: '#A68F59' }}
                  >
                    support@creova.ca
                  </a>
                </p>
              </>
            ) : (
              <>
                <p>
                  Your order is being processed and you'll receive an update within 24 hours.
                </p>
                <p className="text-sm">
                  If you have any questions, feel free to contact us at{' '}
                  <a 
                    href="mailto:support@creova.ca"
                    className="underline"
                    style={{ color: '#A68F59' }}
                  >
                    support@creova.ca
                  </a>
                </p>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              size="lg"
              variant="outline"
              className="px-8"
            >
              Back to Home
            </Button>
            <Button
              onClick={() => navigate(isMembership ? '/community' : '/shop')}
              size="lg"
              className="px-8"
              style={{ backgroundColor: '#121212', color: '#F5F1EB' }}
            >
              {isMembership ? 'Explore Community' : 'Continue Shopping'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}