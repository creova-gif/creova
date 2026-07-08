import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, Search, Filter, RefreshCw, AlertCircle, 
  CheckCircle, Clock, XCircle, CreditCard, Calendar
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner@2.0.3';
import { adminFetch } from '../utils/supabase/adminSession';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

interface Payment {
  paymentId: string;
  stripe_payment_intent_id: string;
  amount: number;
  currency: string;
  customer_email: string;
  customer_name: string;
  items?: Array<{ name: string; price: number; quantity: number }>;
  status: string;
  refund_status?: string;
  refund_amount?: number;
  created_at: string;
  refunded_at?: string;
}

interface Refund {
  refundId: string;
  stripeRefundId: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  reason: string;
  status: string;
  created_at: string;
}

export function RefundManagementPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'refunded' | 'not_refunded'>('all');
  
  // Refund dialog state
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('requested_by_customer');
  const [isRefunding, setIsRefunding] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [paymentsRes, refundsRes] = await Promise.all([
        adminFetch('/payments'),
        adminFetch('/refunds')
      ]);

      const paymentsData = await paymentsRes.json();
      const refundsData = await refundsRes.json();

      if (paymentsRes.ok) {
        setPayments(paymentsData.payments || []);
      }
      
      if (refundsRes.ok) {
        setRefunds(refundsData.refunds || []);
      }
    } catch {
      toast.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefund = async () => {
    if (!selectedPayment) return;

    setIsRefunding(true);
    try {
      const response = await adminFetch('/create-refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: selectedPayment.stripe_payment_intent_id,
          amount: refundAmount ? parseFloat(refundAmount) : undefined,
          reason: refundReason
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Refund processed successfully!');
        setSelectedPayment(null);
        setRefundAmount('');
        setRefundReason('requested_by_customer');
        fetchData(); // Refresh data
      } else {
        throw new Error(data.error || 'Failed to process refund');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to process refund');
    } finally {
      setIsRefunding(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.stripe_payment_intent_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filterStatus === 'all' ? true :
      filterStatus === 'refunded' ? payment.refund_status :
      filterStatus === 'not_refunded' ? !payment.refund_status : true;

    return matchesSearch && matchesFilter;
  });

  const totalPayments = payments.length;
  const totalRefunds = refunds.length;
  const totalRefundedAmount = refunds.reduce((sum, r) => sum + r.amount, 0);
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F1EB' }}>
        <div className="text-center">
          <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: '#B1643B' }} />
          <p style={{ color: '#121212' }}>Loading payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F5F1EB', minHeight: '100vh' }}>
      {/* Header */}
      <section className="py-16" style={{ backgroundColor: '#121212' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl mb-3" style={{ color: '#F5F1EB' }}>
                Refund Management
              </h1>
              <p className="text-lg" style={{ color: '#E3DCD3' }}>
                Process refunds and manage payment transactions
              </p>
            </div>
            <Button 
              onClick={fetchData}
              className="px-6 py-3 rounded-xl"
              style={{ backgroundColor: '#B1643B', color: '#F5F1EB' }}
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-6" style={{ borderColor: '#E3DCD3', border: '1px solid' }}>
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6" style={{ color: '#B1643B' }} />
                <span className="text-sm" style={{ color: '#7A6F66' }}>Total Revenue</span>
              </div>
              <div className="text-3xl" style={{ color: '#121212' }}>
                ${totalRevenue.toFixed(2)}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6" style={{ borderColor: '#E3DCD3', border: '1px solid' }}>
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-6 h-6" style={{ color: '#A68F59' }} />
                <span className="text-sm" style={{ color: '#7A6F66' }}>Total Payments</span>
              </div>
              <div className="text-3xl" style={{ color: '#121212' }}>
                {totalPayments}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6" style={{ borderColor: '#E3DCD3', border: '1px solid' }}>
              <div className="flex items-center gap-3 mb-2">
                <RefreshCw className="w-6 h-6" style={{ color: '#A68F59' }} />
                <span className="text-sm" style={{ color: '#7A6F66' }}>Total Refunds</span>
              </div>
              <div className="text-3xl" style={{ color: '#121212' }}>
                {totalRefunds}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6" style={{ borderColor: '#E3DCD3', border: '1px solid' }}>
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6" style={{ color: '#7A6F66' }} />
                <span className="text-sm" style={{ color: '#7A6F66' }}>Refunded Amount</span>
              </div>
              <div className="text-3xl" style={{ color: '#121212' }}>
                ${totalRefundedAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border" style={{ borderColor: '#E3DCD3' }}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#7A6F66' }} />
              <Input
                type="text"
                placeholder="Search by customer name, email, or payment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              {(['all', 'refunded', 'not_refunded'] as const).map((status) => (
                <Button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1 rounded-xl"
                  style={
                    filterStatus === status
                      ? { backgroundColor: '#B1643B', color: '#F5F1EB' }
                      : { color: '#121212', borderColor: '#E3DCD3' }
                  }
                >
                  {status === 'all' && 'All Payments'}
                  {status === 'refunded' && 'Refunded'}
                  {status === 'not_refunded' && 'Not Refunded'}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl shadow-lg border overflow-hidden" style={{ borderColor: '#E3DCD3' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#F5F1EB' }}>
                <tr>
                  <th className="text-left py-4 px-6 text-sm" style={{ color: '#121212' }}>Customer</th>
                  <th className="text-left py-4 px-6 text-sm" style={{ color: '#121212' }}>Payment ID</th>
                  <th className="text-left py-4 px-6 text-sm" style={{ color: '#121212' }}>Amount</th>
                  <th className="text-left py-4 px-6 text-sm" style={{ color: '#121212' }}>Date</th>
                  <th className="text-left py-4 px-6 text-sm" style={{ color: '#121212' }}>Status</th>
                  <th className="text-left py-4 px-6 text-sm" style={{ color: '#121212' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center" style={{ color: '#7A6F66' }}>
                      No payments found
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.paymentId} style={{ borderTop: '1px solid #E3DCD3' }}>
                      <td className="py-4 px-6">
                        <div>
                          <div className="text-sm" style={{ color: '#121212' }}>
                            {payment.customer_name || 'N/A'}
                          </div>
                          <div className="text-xs" style={{ color: '#7A6F66' }}>
                            {payment.customer_email}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded" style={{ color: '#121212' }}>
                          {payment.stripe_payment_intent_id?.substring(0, 20)}...
                        </code>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm" style={{ color: '#121212' }}>
                          ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                        </div>
                        {payment.refund_amount && (
                          <div className="text-xs" style={{ color: '#B1643B' }}>
                            Refunded: ${payment.refund_amount.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-xs" style={{ color: '#7A6F66' }}>
                          {new Date(payment.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {payment.refund_status ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-green-100" style={{ color: '#22c55e' }}>
                            <CheckCircle className="w-3 h-3" />
                            Refunded
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-blue-100" style={{ color: '#3b82f6' }}>
                            <Clock className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {!payment.refund_status ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  setRefundAmount(payment.amount.toString());
                                }}
                                className="rounded-xl"
                                style={{ backgroundColor: '#B1643B', color: '#F5F1EB' }}
                              >
                                Process Refund
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle style={{ color: '#121212' }}>Process Refund</DialogTitle>
                                <DialogDescription style={{ color: '#7A6F66' }}>
                                  Issue a full or partial refund for this payment
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4 py-4">
                                <div>
                                  <Label className="text-sm mb-2 block" style={{ color: '#121212' }}>
                                    Customer
                                  </Label>
                                  <div className="text-sm" style={{ color: '#7A6F66' }}>
                                    {selectedPayment?.customer_name} ({selectedPayment?.customer_email})
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm mb-2 block" style={{ color: '#121212' }}>
                                    Original Amount
                                  </Label>
                                  <div className="text-2xl" style={{ color: '#B1643B' }}>
                                    ${selectedPayment?.amount.toFixed(2)} {selectedPayment?.currency.toUpperCase()}
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="refund-amount" className="text-sm mb-2 block" style={{ color: '#121212' }}>
                                    Refund Amount
                                  </Label>
                                  <Input
                                    id="refund-amount"
                                    type="number"
                                    step="0.01"
                                    value={refundAmount}
                                    onChange={(e) => setRefundAmount(e.target.value)}
                                    placeholder="Enter amount to refund"
                                  />
                                  <p className="text-xs mt-1" style={{ color: '#7A6F66' }}>
                                    Leave blank for full refund
                                  </p>
                                </div>

                                <div>
                                  <Label htmlFor="refund-reason" className="text-sm mb-2 block" style={{ color: '#121212' }}>
                                    Reason
                                  </Label>
                                  <select
                                    id="refund-reason"
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    style={{ borderColor: '#E3DCD3' }}
                                  >
                                    <option value="requested_by_customer">Requested by Customer</option>
                                    <option value="duplicate">Duplicate Payment</option>
                                    <option value="fraudulent">Fraudulent</option>
                                  </select>
                                </div>

                                <div 
                                  className="p-3 rounded-lg border flex items-start gap-2"
                                  style={{ backgroundColor: '#FFF3E0', borderColor: '#FFB84D' }}
                                >
                                  <AlertCircle className="w-5 h-5 mt-0.5" style={{ color: '#FF9800' }} />
                                  <div>
                                    <p className="text-sm" style={{ color: '#121212' }}>
                                      <strong>Warning:</strong> This action cannot be undone.
                                    </p>
                                    <p className="text-xs mt-1" style={{ color: '#7A6F66' }}>
                                      The customer will receive the refund in 5-10 business days.
                                    </p>
                                  </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="flex-1 rounded-xl"
                                      style={{ borderColor: '#E3DCD3' }}
                                    >
                                      Cancel
                                    </Button>
                                  </DialogTrigger>
                                  <Button
                                    onClick={handleRefund}
                                    disabled={isRefunding}
                                    className="flex-1 rounded-xl"
                                    style={{ backgroundColor: '#B1643B', color: '#F5F1EB' }}
                                  >
                                    {isRefunding ? (
                                      <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Processing...
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Confirm Refund
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <span className="text-sm" style={{ color: '#7A6F66' }}>
                            Refunded
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Refunds */}
        {refunds.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl mb-6" style={{ color: '#121212' }}>
              Recent Refunds
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {refunds.slice(0, 6).map((refund) => (
                <motion.div
                  key={refund.refundId}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border"
                  style={{ borderColor: '#E3DCD3' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(177, 100, 59, 0.1)' }}
                    >
                      <RefreshCw className="w-5 h-5" style={{ color: '#B1643B' }} />
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100" style={{ color: '#22c55e' }}>
                      {refund.status}
                    </span>
                  </div>

                  <div className="text-2xl mb-2" style={{ color: '#B1643B' }}>
                    ${refund.amount.toFixed(2)}
                  </div>

                  <div className="text-xs mb-4" style={{ color: '#7A6F66' }}>
                    {refund.reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>

                  <div className="flex items-center gap-2 text-xs" style={{ color: '#7A6F66' }}>
                    <Calendar className="w-3 h-3" />
                    {new Date(refund.created_at).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
