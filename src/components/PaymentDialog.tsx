import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>This service is no longer available</DialogTitle>
          <DialogDescription>
            Checkout is closed. No card form is shown and no payment is sent.
          </DialogDescription>
        </DialogHeader>
        <Button type="button" onClick={() => onOpenChange(false)} className="w-full">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
