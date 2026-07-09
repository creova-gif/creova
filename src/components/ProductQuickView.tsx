import { useState } from 'react';
import { X, Heart, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  hoverImage?: string;
  description?: string;
  sizes?: string[];
  colors?: string[];
  category: string;
}

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [currentImage, setCurrentImage] = useState<string>('');
  const { addItem } = useCart();
  const { t } = useLanguage();

  if (!product) return null;

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error(t('shop.select.size'));
      return;
    }

    const variant = [selectedSize, selectedColor || product.colors?.[0]].filter(Boolean).join(' / ');
    addItem({
      id: variant ? `${product.id}-${variant}` : product.id,
      name: variant ? `${product.name} (${variant})` : product.name,
      price: product.price,
      image: product.image,
      type: 'clothing'
    });

    toast.success(t('cart.added'));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl"
              style={{ backgroundColor: '#F5F1EB' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full transition-colors"
                style={{ backgroundColor: '#FFFFFF', color: '#121212' }}
                aria-label={t('a11y.close')}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden rounded-lg" style={{ backgroundColor: '#E3DCD3' }}>
                  <img
                    src={currentImage || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onMouseEnter={() => product.hoverImage && setCurrentImage(product.hoverImage)}
                    onMouseLeave={() => setCurrentImage('')}
                  />
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <button
                      className="p-2 rounded-full transition-all hover:scale-110"
                      style={{ backgroundColor: '#FFFFFF', color: '#121212' }}
                      aria-label={t('product.add.wishlist')}
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 rounded-full transition-all hover:scale-110"
                      style={{ backgroundColor: '#FFFFFF', color: '#121212' }}
                      aria-label={t('product.share')}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex flex-col">
                  <div className="mb-2 text-xs tracking-wider uppercase" style={{ color: '#A68F59' }}>
                    {product.category}
                  </div>
                  
                  <h2 className="text-2xl mb-2 tracking-tight" style={{ color: '#121212' }}>
                    {product.name}
                  </h2>
                  
                  <div className="text-xl mb-4" style={{ color: '#121212' }}>
                    ${product.price} {t('common.currency')}
                  </div>

                  <div className="mb-6 text-sm" style={{ color: '#4A3E36' }}>
                    {product.description || 'Premium quality garment from the SEEN collection.'}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00C851' }}></div>
                    <span className="text-sm" style={{ color: '#121212' }}>
                      {t('product.in.stock')}
                    </span>
                  </div>

                  {/* Size Selection */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm" style={{ color: '#121212' }}>
                          {t('cart.size')}
                        </label>
                        <button 
                          className="text-xs underline hover:no-underline" 
                          style={{ color: '#A68F59' }}
                        >
                          {t('product.size.guide')}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className="px-4 py-2 border transition-all text-sm"
                            style={{
                              backgroundColor: selectedSize === size ? '#121212' : 'transparent',
                              color: selectedSize === size ? '#F5F1EB' : '#121212',
                              borderColor: selectedSize === size ? '#121212' : '#E3DCD3'
                            }}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color Selection */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-sm mb-3" style={{ color: '#121212' }}>
                        {t('shop.colors')}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className="px-3 py-1 border text-xs transition-all"
                            style={{
                              backgroundColor: selectedColor === color ? '#121212' : 'transparent',
                              color: selectedColor === color ? '#F5F1EB' : '#121212',
                              borderColor: selectedColor === color ? '#121212' : '#E3DCD3'
                            }}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="w-full transition-all hover:scale-[1.02]"
                    style={{
                      backgroundColor: '#121212',
                      color: '#F5F1EB'
                    }}
                  >
                    {t('shop.add.bag')}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}