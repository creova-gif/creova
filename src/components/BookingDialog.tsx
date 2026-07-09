import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { createBooking, CustomerInfo, BookingDetails } from '../utils/payment';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentDialog } from './PaymentDialog';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: {
    name: string;
    price: number;
    description?: string;
  };
  onSuccess?: () => void;
}

export function BookingDialog({
  open,
  onOpenChange,
  service,
  onSuccess
}: BookingDialogProps) {
  const [step, setStep] = useState<'booking' | 'payment' | 'success'>('booking');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: ''
  });
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    service: service.name,
    date: '',
    time: '',
    location: '',
    notes: '',
    package: service.name
  });
  const [isCreating, setIsCreating] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await createBooking(
        service.name,
        customerInfo,
        bookingDetails,
        service.price
      );

      toast.success('Booking created!', {
        description: 'Proceeding to payment...'
      });

      // Show payment dialog
      setShowPayment(true);
      setIsCreating(false);
    } catch (error: any) {
      toast.error('Booking failed', {
        description: error.message
      });
      setIsCreating(false);
    }
  };

  const handlePaymentSuccess = () => {
    setStep('success');
    setTimeout(() => {
      onSuccess?.();
      handleClose();
    }, 3000);
  };

  const handleClose = () => {
    setStep('booking');
    setShowPayment(false);
    setCustomerInfo({ name: '', email: '', phone: '' });
    setBookingDetails({
      service: service.name,
      date: '',
      time: '',
      location: '',
      notes: '',
      package: service.name
    });
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open && !showPayment} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {step === 'success' ? 'Booking Confirmed!' : `Book ${service.name}`}
            </DialogTitle>
          </DialogHeader>

          {step === 'success' ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: '#A68F59' }} />
              <h3 className="text-xl mb-2">Booking & Payment Successful!</h3>
              <p className="text-sm mb-4" style={{ color: '#4A3E36' }}>
                You'll receive a confirmation email at {customerInfo.email} with all the details.
              </p>
              <p className="text-xs" style={{ color: '#7A6F66' }}>
                We'll contact you within 24 hours to finalize the details.
              </p>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Service Info */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5F1EB' }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 style={{ color: '#121212' }}>{service.name}</h4>
                    {service.description && (
                      <p className="text-sm mt-1" style={{ color: '#4A3E36' }}>
                        {service.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div style={{ color: '#B1643B' }}>${service.price.toFixed(2)}</div>
                    <div className="text-xs" style={{ color: '#7A6F66' }}>CAD</div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-3">
                <h4 className="text-sm" style={{ color: '#A68F59' }}>Your Information</h4>
                
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
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-3">
                <h4 className="text-sm" style={{ color: '#A68F59' }}>Booking Details</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="date">Preferred Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      required
                      value={bookingDetails.date}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="time">Preferred Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={bookingDetails.time}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, time: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location / Address</Label>
                  <Input
                    id="location"
                    value={bookingDetails.location}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, location: e.target.value })}
                    placeholder="Niagara Falls, ON"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={bookingDetails.notes}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, notes: e.target.value })}
                    placeholder="Any special requirements or preferences..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="text-xs" style={{ color: '#7A6F66' }}>
                * A 50% deposit (${(service.price * 0.5).toFixed(2)} CAD) is required to secure your booking. 
                The remaining balance is due on the day of service.
              </div>

              <div className="flex gap-3 pt-2">
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
                      Processing...
                    </>
                  ) : (
                    'Continue to Payment'
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <PaymentDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        amount={service.price * 0.5} // 50% deposit
        items={[{
          id: service.name,
          name: `${service.name} - Deposit (50%)`,
          price: service.price * 0.5,
          quantity: 1,
          category: 'service-booking'
        }]}
        onSuccess={handlePaymentSuccess}
        title="Complete Booking Payment"
        description={`Pay 50% deposit ($${(service.price * 0.5).toFixed(2)} CAD) to secure your booking`}
      />
    </>
  );
}
