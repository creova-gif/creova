import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise, CustomerInfo, createPaymentIntent } from '../utils/payment';
import { Loader2, CheckCircle2, CreditCard } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
  }>;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

function CheckoutForm({ 
  amount, 
  items, 
  onSuccess,
  onCancel 
}: { 
  amount: number;
  items: any[];
  onSuccess?: () => void;
  onCancel: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        toast.error('Payment failed', {
          description: error.message
        });
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
        toast.success('Payment successful!', {
          description: 'Your order has been confirmed.'
        });
        
        setTimeout(() => {
          onSuccess?.();
          onCancel();
        }, 2000);
      }
    } catch (err: any) {
      toast.error('Payment failed', {
        description: err.message || 'An unexpected error occurred'
      });
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: '#A68F59' }} />
        <h3 className="text-xl mb-2">Payment Successful!</h3>
        <p className="text-sm" style={{ color: '#4A3E36' }}>
          Thank you for your purchase. You'll receive a confirmation email shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      <div className="border-t pt-4" style={{ borderColor: '#E3DCD3' }}>
        <div className="flex justify-between items-center mb-4">
          <span style={{ color: '#4A3E36' }}>Total Amount:</span>
          <span className="text-xl" style={{ color: '#121212' }}>
            ${amount.toFixed(2)} CAD
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={!stripe || isProcessing}
          style={{ backgroundColor: '#121212' }}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${amount.toFixed(2)} CAD`
          )}
        </Button>
      </div>
    </form>
  );
}

export function PaymentDialog({
  open,
  onOpenChange,
  amount,
  items,
  onSuccess,
  title = 'Complete Your Purchase',
  description = 'Enter your payment details to complete the transaction'
}: PaymentDialogProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: ''
  });
  const [clientSecret, setClientSecret] = useState<string>('');
  const [showPayment, setShowPayment] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const result = await createPaymentIntent(amount, customerInfo, items);
      setClientSecret(result.clientSecret);
      setShowPayment(true);
    } catch (error: any) {
      toast.error('Failed to initialize payment', {
        description: error.message
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setShowPayment(false);
    setClientSecret('');
    setCustomerInfo({ name: '', email: '', phone: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {!showPayment ? (
          <form onSubmit={handleCustomerSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                required
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                required
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="border-t pt-4" style={{ borderColor: '#E3DCD3' }}>
              <div className="flex justify-between items-center mb-4">
                <span style={{ color: '#4A3E36' }}>Total Amount:</span>
                <span className="text-xl" style={{ color: '#121212' }}>
                  ${amount.toFixed(2)} CAD
                </span>
              </div>
              
              <div className="space-y-1 text-sm" style={{ color: '#7A6F66' }}>
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isCreating}
                style={{ backgroundColor: '#121212' }}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Continue to Payment'
                )}
              </Button>
            </div>
          </form>
        ) : (
          clientSecret && (
            <Elements 
              stripe={stripePromise} 
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#121212',
                  }
                }
              }}
            >
              <CheckoutForm 
                amount={amount} 
                items={items}
                onSuccess={onSuccess}
                onCancel={handleClose}
              />
            </Elements>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}