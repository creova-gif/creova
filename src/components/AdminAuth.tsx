import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'CREOVA2025!';

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already authenticated
    const authToken = sessionStorage.getItem('creova_admin_auth');
    const authTime = sessionStorage.getItem('creova_admin_auth_time');
    
    if (authToken === 'authenticated' && authTime) {
      const timeElapsed = Date.now() - parseInt(authTime);
      const fourHours = 4 * 60 * 60 * 1000;
      
      if (timeElapsed < fourHours) {
        setIsAuthenticated(true);
      } else {
        // Session expired
        sessionStorage.removeItem('creova_admin_auth');
        sessionStorage.removeItem('creova_admin_auth_time');
      }
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('creova_admin_auth', 'authenticated');
      sessionStorage.setItem('creova_admin_auth_time', Date.now().toString());
      setIsAuthenticated(true);
      toast.success('Welcome back! Admin access granted.');
    } else {
      toast.error('Incorrect password. Access denied.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('creova_admin_auth');
    sessionStorage.removeItem('creova_admin_auth_time');
    setIsAuthenticated(false);
    setPassword('');
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F1EB' }}>
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
                className="w-full py-6 rounded-xl text-base"
                style={{ backgroundColor: '#B1643B', color: '#F5F1EB' }}
              >
                <Lock className="w-5 h-5 mr-2" />
                Login to Admin Dashboard
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