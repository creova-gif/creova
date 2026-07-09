import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Check, ShoppingBag } from 'lucide-react';

interface AddToCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    sizes: string[];
    colors: string[];
  };
  colorPalette: Record<string, string>;
  onAddToCart: (productId: string, size: string, color: { name: string; hex: string }) => void;
}

export function AddToCartDialog({
  open,
  onOpenChange,
  product,
  colorPalette,
  onAddToCart
}: AddToCartDialogProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);

  const handleAddToCart = () => {
    if (!selectedSize) {
      return;
    }
    
    const color = selectedColor || { 
      name: product.colors[0], 
      hex: colorPalette[product.colors[0]] 
    };
    
    onAddToCart(product.id, selectedSize, color);
    onOpenChange(false);
    
    // Reset selections
    setSelectedSize('');
    setSelectedColor(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Options</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="aspect-square rounded-lg overflow-hidden" style={{ backgroundColor: '#F5F1EB' }}>
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details & Options */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl mb-2" style={{ color: '#121212' }}>
                {product.name}
              </h3>
              <p className="text-2xl" style={{ color: '#121212' }}>
                ${product.price} CAD
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm tracking-wider" style={{ color: '#121212' }}>
                  SIZE {!selectedSize && <span style={{ color: '#B1643B' }}>*</span>}
                </label>
                <button
                  className="text-xs underline"
                  style={{ color: '#A68F59' }}
                  onClick={() => {/* Open size guide */}}
                >
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="relative px-4 py-3 text-sm border-2 rounded-lg transition-all duration-200"
                    style={{
                      borderColor: selectedSize === size ? '#121212' : '#E3DCD3',
                      backgroundColor: selectedSize === size ? '#121212' : '#FFFFFF',
                      color: selectedSize === size ? '#FFFFFF' : '#121212'
                    }}
                  >
                    {size}
                    {selectedSize === size && (
                      <Check className="absolute top-1 right-1 w-3 h-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            {product.colors.length > 1 && (
              <div>
                <label className="block text-sm tracking-wider mb-3" style={{ color: '#121212' }}>
                  COLOR {selectedColor && `- ${selectedColor.name}`}
                </label>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((colorName) => (
                    <button
                      key={colorName}
                      onClick={() => setSelectedColor({ 
                        name: colorName, 
                        hex: colorPalette[colorName] 
                      })}
                      className="relative group"
                      title={colorName}
                    >
                      <div
                        className="w-10 h-10 rounded-full border-2 transition-all duration-200"
                        style={{
                          backgroundColor: colorPalette[colorName],
                          borderColor: selectedColor?.name === colorName ? '#121212' : '#E3DCD3',
                          transform: selectedColor?.name === colorName ? 'scale(1.1)' : 'scale(1)'
                        }}
                      />
                      {selectedColor?.name === colorName && (
                        <Check 
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5"
                          style={{ 
                            color: colorName === 'Jet Black' || colorName === 'Charcoal Gray' 
                              ? '#FFFFFF' 
                              : '#121212' 
                          }}
                        />
                      )}
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: '#7A6F66' }}>
                        {colorName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="pt-4 border-t" style={{ borderColor: '#E3DCD3' }}>
              <Button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="w-full py-6 text-sm tracking-wider transition-all duration-300"
                style={{
                  backgroundColor: selectedSize ? '#121212' : '#E3DCD3',
                  color: selectedSize ? '#F5F1EB' : '#7A6F66'
                }}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                {selectedSize ? 'ADD TO CART' : 'SELECT A SIZE'}
              </Button>
              
              {!selectedSize && (
                <p className="text-xs text-center mt-2" style={{ color: '#B1643B' }}>
                  Please select a size to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
