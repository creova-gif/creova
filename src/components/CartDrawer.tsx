import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

const warmGradient = 'linear-gradient(135deg, #A68F59 0%, #B1643B 100%)';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    toast.success(t('cart.removed'));
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col"
            style={{ backgroundColor: '#0A0A0A' }}
          >
            {/* Warm gradient top stripe */}
            <div style={{ height: '2px', background: warmGradient, flexShrink: 0 }} />

            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: '1px solid rgba(166,143,89,0.15)', flexShrink: 0 }}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" style={{ color: '#A68F59' }} />
                <div>
                  <p className="text-xs tracking-[0.4em] uppercase mb-0.5" style={{ color: '#A68F59' }}>
                    {t('cart.title')}
                  </p>
                  {items.length > 0 && (
                    <p className="text-xs" style={{ color: '#7A6F66' }}>
                      {items.length} {items.length === 1 ? t('cart.item') : t('cart.items')}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                style={{ backgroundColor: 'rgba(166,143,89,0.08)', color: '#C8C0B8' }}
                aria-label={t('a11y.close')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-grow overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-8 py-16 text-center">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: 'rgba(166,143,89,0.08)', border: '1px solid rgba(166,143,89,0.18)' }}
                  >
                    <ShoppingBag className="w-7 h-7" style={{ color: '#A68F59' }} />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div style={{ height: '1px', width: '28px', backgroundColor: 'rgba(166,143,89,0.35)' }} />
                    <p className="text-xs tracking-[0.4em] uppercase" style={{ color: '#A68F59' }}>{t('cart.bag')}</p>
                    <div style={{ height: '1px', width: '28px', backgroundColor: 'rgba(166,143,89,0.35)' }} />
                  </div>
                  <p className="text-lg font-light mb-2" style={{ color: '#F5F1EB' }}>{t('cart.empty')}</p>
                  <p className="text-sm mb-8 leading-relaxed" style={{ color: '#7A6F66' }}>
                    {t('cart.empty.desc')}
                  </p>
                  <button
                    onClick={() => { onClose(); navigate('/shop'); }}
                    className="w-full py-3 rounded-lg text-sm font-medium text-white mb-3"
                    style={{ background: warmGradient }}
                  >
                    {t('cart.btn.shop')}
                  </button>
                  <button
                    onClick={() => { onClose(); navigate('/digital-products'); }}
                    className="w-full py-3 rounded-lg text-sm font-medium border"
                    style={{ borderColor: 'rgba(166,143,89,0.3)', color: '#C8C0B8', backgroundColor: 'transparent' }}
                  >
                    {t('cart.btn.digital')}
                  </button>
                </div>
              ) : (
                <div className="px-6 py-4 space-y-0">
                  {items.map((item, i) => (
                    <div
                      key={item.id}
                      className="flex gap-4 py-5"
                      style={{
                        borderBottom: i < items.length - 1 ? '1px solid rgba(166,143,89,0.1)' : 'none'
                      }}
                    >
                      {item.image && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0" style={{ border: '1px solid rgba(166,143,89,0.15)' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-grow min-w-0">
                        <h3 className="text-sm font-medium mb-1 truncate" style={{ color: '#F5F1EB' }}>{item.name}</h3>
                        <p className="text-sm mb-3" style={{ color: '#A68F59' }}>${item.price}{t('cart.cad')}</p>
                        <div className="flex items-center justify-between">
                          <div
                            className="flex items-center gap-0 rounded-lg overflow-hidden"
                            style={{ backgroundColor: 'rgba(166,143,89,0.08)', border: '1px solid rgba(166,143,89,0.18)' }}
                          >
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center transition-colors"
                              style={{ color: '#C8C0B8' }}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs w-8 text-center font-medium" style={{ color: '#F5F1EB' }}>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center transition-colors"
                              style={{ color: '#C8C0B8' }}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id, item.name)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                            style={{ color: '#7A6F66', backgroundColor: 'rgba(255,80,80,0.06)' }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                className="px-6 py-6 space-y-4"
                style={{ borderTop: '1px solid rgba(166,143,89,0.15)', flexShrink: 0 }}
              >
                <div className="flex justify-between items-baseline">
                  <span className="text-xs tracking-[0.35em] uppercase" style={{ color: '#7A6F66' }}>{t('cart.total')}</span>
                  <span className="text-xl font-light" style={{ color: '#F5F1EB' }}>${totalPrice.toFixed(2)} <span className="text-sm" style={{ color: '#7A6F66' }}>{t('cart.cad')}</span></span>
                </div>
                <button
                  className="w-full py-3.5 rounded-xl text-sm font-medium text-white"
                  style={{ background: warmGradient }}
                  onClick={() => { onClose(); navigate('/checkout'); }}
                >
                  {t('cart.checkout')}
                </button>
                <button
                  className="w-full py-3 rounded-xl text-sm border transition-colors"
                  style={{ borderColor: 'rgba(166,143,89,0.25)', color: '#C8C0B8', backgroundColor: 'transparent' }}
                  onClick={onClose}
                >
                  {t('cart.continue')}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
