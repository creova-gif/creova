import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { useLanguage } from '../context/LanguageContext';

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
  onSuccess: (paymentIntentId: string) => void;
  title?: string;
  description?: string;
}

export function PaymentDialog({
  open,
  onOpenChange,
  amount: _amount,
  items: _items,
  onSuccess: _onSuccess,
  title: _title,
  description: _description,
}: PaymentDialogProps) {
  const fr = useLanguage().language === 'fr';
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {fr ? "Ce service n'est plus disponible" : 'This service is no longer available'}
          </DialogTitle>
          <DialogDescription>
            {fr
              ? "Le paiement est fermé. Aucun formulaire de carte n'est affiché et aucun paiement n'est envoyé."
              : 'Checkout is closed. No card form is shown and no payment is sent.'}
          </DialogDescription>
        </DialogHeader>
        <Button type="button" onClick={() => onOpenChange(false)} className="w-full">
          {fr ? 'Fermer' : 'Close'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
