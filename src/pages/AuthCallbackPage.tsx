import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../utils/supabase/client';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your account...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the auth code from URL
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          setTimeout(() => navigate('/auth'), 3000);
          return;
        }

        if (data.session) {
          setStatus('success');
          setMessage('Successfully authenticated! Redirecting...');
          setTimeout(() => navigate('/memberships'), 2000);
        } else {
          setStatus('error');
          setMessage('No active session found.');
          setTimeout(() => navigate('/auth'), 3000);
        }
      } catch {
        setStatus('error');
        setMessage('An unexpected error occurred.');
        setTimeout(() => navigate('/auth'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F1EB' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin" style={{ color: '#A68F59' }} />
            <h2 className="text-2xl mb-2" style={{ color: '#121212' }}>{message}</h2>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: '#A68F59' }} />
            <h2 className="text-2xl mb-2" style={{ color: '#121212' }}>{message}</h2>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#DC2626' }} />
            <h2 className="text-2xl mb-2" style={{ color: '#121212' }}>{message}</h2>
          </>
        )}
      </motion.div>
    </div>
  );
}