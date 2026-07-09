import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useLanguage } from '../context/LanguageContext';

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
  const { t } = useLanguage();

  const sizeData = [
    { size: 'XS', chest: '32-34', waist: '24-26', hips: '34-36' },
    { size: 'S', chest: '34-36', waist: '26-28', hips: '36-38' },
    { size: 'M', chest: '38-40', waist: '30-32', hips: '40-42' },
    { size: 'L', chest: '42-44', waist: '34-36', hips: '44-46' },
    { size: 'XL', chest: '46-48', waist: '38-40', hips: '48-50' },
    { size: '2XL', chest: '50-52', waist: '42-44', hips: '52-54' },
    { size: '3XL', chest: '54-56', waist: '46-48', hips: '56-58' },
  ];

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <AnimatePresence>
        {isOpen && (
          <DialogPrimitive.Portal forceMount>
            {/* Backdrop */}
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
            </DialogPrimitive.Overlay>

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
              <DialogPrimitive.Content asChild forceMount aria-describedby={undefined}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl p-8 pointer-events-auto outline-none"
                  style={{ backgroundColor: '#F5F1EB' }}
                >
                  {/* Close Button */}
                  <DialogPrimitive.Close asChild>
                    <button
                      className="absolute top-4 right-4 p-2 rounded-full transition-colors"
                      style={{ backgroundColor: '#FFFFFF', color: '#121212' }}
                      aria-label={t('a11y.close')}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </DialogPrimitive.Close>

                  <DialogPrimitive.Title asChild>
                    <h2 className="text-2xl mb-6 tracking-tight" style={{ color: '#121212' }}>
                      {t('size.guide.title')}
                    </h2>
                  </DialogPrimitive.Title>

                  <p className="text-sm mb-6" style={{ color: '#4A3E36' }}>
                    {t('size.measurements')}
                  </p>

              {/* Size Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: '#121212', color: '#F5F1EB' }}>
                      <th className="p-3 text-left text-sm">{t('cart.size')}</th>
                      <th className="p-3 text-left text-sm">{t('size.chest')}</th>
                      <th className="p-3 text-left text-sm">{t('size.waist')}</th>
                      <th className="p-3 text-left text-sm">{t('size.hips')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeData.map((row, index) => (
                      <tr
                        key={row.size}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#E3DCD3',
                          color: '#121212'
                        }}
                      >
                        <td className="p-3 text-sm">{row.size}</td>
                        <td className="p-3 text-sm">{row.chest}</td>
                        <td className="p-3 text-sm">{row.waist}</td>
                        <td className="p-3 text-sm">{row.hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* How to Measure */}
              <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: '#E3DCD3' }}>
                <h3 className="text-lg mb-4" style={{ color: '#121212' }}>
                  How to Measure
                </h3>
                <ul className="space-y-2 text-sm" style={{ color: '#4A3E36' }}>
                  <li><strong>Chest:</strong> Measure around the fullest part of your chest</li>
                  <li><strong>Waist:</strong> Measure around your natural waistline</li>
                  <li><strong>Hips:</strong> Measure around the fullest part of your hips</li>
                </ul>
              </div>
                </motion.div>
              </DialogPrimitive.Content>
            </div>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
