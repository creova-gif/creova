import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Home, Mail } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-[#121212]">
      <div className="text-center max-w-lg mx-auto">
        {/* 404 number */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-8xl font-bold leading-none tracking-tight"
          style={{ color: '#A68F59' }}
          aria-hidden="true"
        >
          404
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mx-auto my-6 h-px w-16"
          style={{ backgroundColor: '#A68F59', opacity: 0.5 }}
        />

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-3xl font-semibold tracking-wide mb-4"
          style={{ color: '#F5F1EB' }}
        >
          Page not found
        </motion.h1>

        {/* Body copy */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-base leading-relaxed mb-10"
          style={{ color: '#7A6F66' }}
        >
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-7 py-3 rounded text-sm font-medium tracking-wide transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: '#A68F59', color: '#121212' }}
          >
            <Home size={16} />
            Go Home
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-3 rounded text-sm font-medium tracking-wide border transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              borderColor: '#A68F59',
              color: '#F5F1EB',
              backgroundColor: 'transparent',
            }}
          >
            <Mail size={16} />
            Contact Us
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
