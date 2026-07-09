import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../utils/supabase/client';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { PageSEO } from '../components/PageSEO';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your account...');

  useEffect(() => {
    let redirectTimer: ReturnType<typeof setTimeout>;
    let fallbackTimer: ReturnType<typeof setTimeout>;
    let settled = false;

    const succeed = () => {
      if (settled) return;
      settled = true;
      setStatus('success');
      setMessage('Successfully authenticated! Redirecting...');
      redirectTimer = setTimeout(() => navigate('/community'), 2000);
    };

    const fail = (msg: string) => {
      if (settled) return;
      settled = true;
      setStatus('error');
      setMessage(msg);
      redirectTimer = setTimeout(() => navigate('/auth'), 3000);
    };

    // Listen for auth state changes (fires when PKCE code exchange completes)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) succeed();
      else if (event === 'INITIAL_SESSION' && !session && settled === false) {
        // INITIAL_SESSION fires with null → code exchange not done yet, wait
      }
    });

    // Also check immediately in case session already established
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) fail('Authentication failed. Please try again.');
      else if (data.session) succeed();
      // else: wait for onAuthStateChange to fire after code exchange
    });

    // Fallback: if nothing resolves in 12 seconds, give up
    fallbackTimer = setTimeout(() => fail('Authentication timed out. Please try again.'), 12000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(redirectTimer);
      clearTimeout(fallbackTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F1EB' }}>
      <PageSEO
        title="Signing In"
        description="Completing authentication."
        path="/auth/callback"
        noIndex
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin" style={{ color: '#A68F59' }} />
            <h1 className="text-2xl mb-2" style={{ color: '#121212' }}>{message}</h1>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: '#A68F59' }} />
            <h1 className="text-2xl mb-2" style={{ color: '#121212' }}>{message}</h1>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#DC2626' }} />
            <h1 className="text-2xl mb-2" style={{ color: '#121212' }}>{message}</h1>
          </>
        )}
      </motion.div>
    </div>
  );
}