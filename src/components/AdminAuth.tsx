import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { adminLogin, clearAdminToken, getAdminToken } from '../utils/supabase/adminSession';
import { PageSEO } from './PageSEO';

// The password itself is never shipped to the client and never compared
// here — it's checked once, server-side, in /admin-login. This component
// only tracks whether a valid session token exists; the server verifies
// that token on every admin request, which is the actual security boundary.
const AUTH_TIME_KEY = 'creova_admin_auth_time';
const SESSION_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours, matches the server-issued token's expiry

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAdminToken();
    const authTime = sessionStorage.getItem(AUTH_TIME_KEY);

    if (token && authTime && Date.now() - parseInt(authTime, 10) < SESSION_TTL_MS) {
      setIsAuthenticated(true);
    } else {
      clearAdminToken();
      sessionStorage.removeItem(AUTH_TIME_KEY);
    }

    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await adminLogin(password);

    if (result.ok) {
      sessionStorage.setItem(AUTH_TIME_KEY, Date.now().toString());
      setIsAuthenticated(true);
      toast.success('Welcome back! Admin access granted.');
    } else {
      toast.error(result.error || 'Incorrect password. Access denied.');
      setPassword('');
    }
    setSubmitting(false);
  };

  const handleLogout = () => {
    clearAdminToken();
    sessionStorage.removeItem(AUTH_TIME_KEY);
    setIsAuthenticated(false);
    setPassword('');
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F1EB' }}>
        <PageSEO title="Admin" description="CREOVA staff admin dashboard." path={typeof window !== 'undefined' ? window.location.pathname : '/admin'} noIndex />
        <div className="animate-pulse text-center">
          <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: '#B1643B' }} />
          <p style={{ color: '#121212' }}>Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F5F1EB' }}>
        <PageSEO title="Admin Access" description="CREOVA staff admin dashboard." path={typeof window !== 'undefined' ? window.location.pathname : '/admin'} noIndex />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div 
            className="bg-white rounded-3xl p-8 shadow-2xl border"
            style={{ borderColor: '#E3DCD3' }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(177, 100, 59, 0.1)' }}
              >
                <Lock className="w-8 h-8" style={{ color: '#B1643B' }} />
              </div>
              <h2 className="text-3xl mb-2" style={{ color: '#121212' }}>
                Admin Access
              </h2>
              <p style={{ color: '#7A6F66' }}>
                Enter password to access CREOVA admin dashboard
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm mb-2" style={{ color: '#121212' }}>
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="pr-12"
                    style={{ borderColor: '#E3DCD3' }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#7A6F66' }}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full py-6 rounded-xl text-base disabled:opacity-60"
                style={{ backgroundColor: '#B1643B', color: '#F5F1EB' }}
              >
                <Lock className="w-5 h-5 mr-2" />
                {submitting ? 'Verifying...' : 'Login to Admin Dashboard'}
              </Button>
            </form>

            {/* Security Notice */}
            <div 
              className="mt-6 p-4 rounded-xl border"
              style={{ backgroundColor: '#F5F1EB', borderColor: '#E3DCD3' }}
            >
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 mt-0.5" style={{ color: '#B1643B' }} />
                <div>
                  <p className="text-sm mb-1" style={{ color: '#121212' }}>
                    <strong>Secure Access</strong>
                  </p>
                  <p className="text-xs" style={{ color: '#7A6F66' }}>
                    Your session will automatically expire after 4 hours of inactivity
                  </p>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Logout Button - Fixed Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={handleLogout}
          size="sm"
          className="rounded-xl shadow-lg"
          style={{ backgroundColor: '#121212', color: '#F5F1EB' }}
        >
          <Lock className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
      {children}
    </>
  );
}