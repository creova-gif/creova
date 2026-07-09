import { motion } from 'motion/react';
import { 
  Shield, BarChart3, DollarSign, 
  Mail, ArrowRight, Lock, Activity, Database
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { PageSEO } from '../components/PageSEO';

export function AdminHubPage() {
  const navigate = useNavigate();

  const adminTools = [
    {
      title: 'Contact Submissions',
      description: 'View and manage all contact form submissions and collaboration requests',
      icon: Mail,
      path: '/admin/submissions',
      color: '#B1643B',
      stats: 'Manage inquiries'
    },
    {
      title: 'Website Analytics',
      description: 'Track visitor behavior, traffic sources, and website performance metrics',
      icon: BarChart3,
      path: '/analytics/dashboard',
      color: '#A68F59',
      stats: 'View insights'
    },
    {
      title: 'Refund Management',
      description: 'Process full and partial refunds for customer payments via Stripe',
      icon: DollarSign,
      path: '/admin/refunds',
      color: '#A68F59',
      stats: 'Process refunds'
    },
    {
      title: 'Database Access',
      description: 'Direct access to Supabase database with ready-to-use SQL queries',
      icon: Database,
      path: '/admin/database',
      color: '#A68F59',
      stats: 'View data'
    }
  ];

  return (
    <div style={{ backgroundColor: '#F5F1EB', minHeight: '100vh' }}>
      <PageSEO
        title="Admin Hub"
        description="CREOVA staff admin dashboard."
        path="/admin/hub"
        noIndex
      />
      {/* Header */}
      <section className="py-16" style={{ backgroundColor: '#121212' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
              style={{ backgroundColor: 'rgba(177, 100, 59, 0.2)' }}
            >
              <Shield className="w-10 h-10" style={{ color: '#B1643B' }} />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl mb-4"
              style={{ color: '#F5F1EB' }}
            >
              Admin Dashboard
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl max-w-2xl mx-auto"
              style={{ color: '#E3DCD3' }}
            >
              Manage your CREOVA website with professional admin tools
            </motion.p>
          </div>
        </div>
      </section>

      {/* Admin Tools Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminTools.map((tool, index) => (
              <motion.div
                key={tool.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(tool.path)}
                className="bg-white rounded-3xl p-8 shadow-lg border cursor-pointer group hover:shadow-xl transition-all"
                style={{ borderColor: '#E3DCD3' }}
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${tool.color}20` }}
                >
                  <tool.icon className="w-8 h-8" style={{ color: tool.color }} />
                </div>

                <h3 className="text-2xl mb-3" style={{ color: '#121212' }}>
                  {tool.title}
                </h3>

                <p className="text-base mb-6" style={{ color: '#7A6F66' }}>
                  {tool.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: tool.color }}>
                    {tool.stats}
                  </span>
                  <ArrowRight 
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                    style={{ color: tool.color }} 
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 bg-white rounded-3xl p-8 shadow-lg border"
            style={{ borderColor: '#E3DCD3' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6" style={{ color: '#B1643B' }} />
              <h3 className="text-2xl" style={{ color: '#121212' }}>
                Admin Information
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm mb-3" style={{ color: '#7A6F66' }}>
                  🔐 Security
                </h4>
                <ul className="space-y-2 text-sm" style={{ color: '#121212' }}>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#B1643B' }}>•</span>
                    <span>All admin pages are password-protected</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#B1643B' }}>•</span>
                    <span>Sessions expire after 4 hours of inactivity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#B1643B' }}>•</span>
                    <span>Automatic logout for security</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm mb-3" style={{ color: '#7A6F66' }}>
                  📊 Features
                </h4>
                <ul className="space-y-2 text-sm" style={{ color: '#121212' }}>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#B1643B' }}>•</span>
                    <span>Real-time visitor tracking and analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#B1643B' }}>•</span>
                    <span>Contact form submission management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#B1643B' }}>•</span>
                    <span>Full and partial refund processing</span>
                  </li>
                </ul>
              </div>
            </div>

            <div 
              className="mt-6 p-4 rounded-xl border"
              style={{ backgroundColor: 'rgba(166,143,89,0.08)', borderColor: 'rgba(166,143,89,0.3)' }}
            >
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 mt-0.5" style={{ color: '#A68F59' }} />
                <div>
                  <p className="text-sm mb-1" style={{ color: '#121212' }}>
                    <strong>Admin Password</strong>
                  </p>
                  <p className="text-xs" style={{ color: '#7A6F66' }}>
                    Set via <code>VITE_ADMIN_PASSWORD</code> environment variable
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Documentation Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 grid md:grid-cols-2 gap-6"
          >
            <div 
              className="bg-white rounded-2xl p-6 shadow-lg border"
              style={{ borderColor: '#E3DCD3' }}
            >
              <h4 className="text-lg mb-3 flex items-center gap-2" style={{ color: '#121212' }}>
                <BarChart3 className="w-5 h-5" style={{ color: '#B1643B' }} />
                Analytics Guide
              </h4>
              <p className="text-sm mb-4" style={{ color: '#7A6F66' }}>
                Learn how to read visitor data, track campaigns, and understand user behavior
              </p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded" style={{ color: '#121212' }}>
                /ANALYTICS_SYSTEM_GUIDE.md
              </code>
            </div>

            <div 
              className="bg-white rounded-2xl p-6 shadow-lg border"
              style={{ borderColor: '#E3DCD3' }}
            >
              <h4 className="text-lg mb-3 flex items-center gap-2" style={{ color: '#121212' }}>
                <Shield className="w-5 h-5" style={{ color: '#B1643B' }} />
                Security & Refund Guide
              </h4>
              <p className="text-sm mb-4" style={{ color: '#7A6F66' }}>
                Complete documentation for security features and refund processing
              </p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded" style={{ color: '#121212' }}>
                /SECURITY_AND_REFUND_GUIDE.md
              </code>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}