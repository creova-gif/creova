import { motion } from 'motion/react';

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden">
      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Image skeleton */}
        <div 
          className="aspect-square mb-4 rounded-lg"
          style={{ backgroundColor: '#E0E0E0' }}
        />
        
        {/* Title skeleton */}
        <div 
          className="h-4 mb-2 rounded"
          style={{ backgroundColor: '#E0E0E0', width: '70%' }}
        />
        
        {/* Price skeleton */}
        <div 
          className="h-3 rounded"
          style={{ backgroundColor: '#E0E0E0', width: '30%' }}
        />
      </motion.div>
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="py-20" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="space-y-8"
        >
          {/* Header skeleton */}
          <div className="space-y-4">
            <div 
              className="h-8 rounded mx-auto"
              style={{ backgroundColor: '#E0E0E0', width: '40%' }}
            />
            <div 
              className="h-4 rounded mx-auto"
              style={{ backgroundColor: '#E0E0E0', width: '60%' }}
            />
          </div>

          {/* Grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
