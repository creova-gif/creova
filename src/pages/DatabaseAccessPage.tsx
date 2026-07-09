import { motion } from 'motion/react';
import { Database, ExternalLink, Copy, Code, FileText, Download, Search, BarChart3, Shield, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { AdminAuth } from '../components/AdminAuth';
import { PageSEO } from '../components/PageSEO';

export function DatabaseAccessPage() {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const queries = [
    {
      title: 'All Contact Forms',
      icon: FileText,
      sql: `SELECT 
  key,
  value->>'name' as name,
  value->>'email' as email,
  value->>'service' as service,
  value->>'status' as status,
  value->>'created_at' as submitted_at
FROM kv_store_feacf0d8 
WHERE key LIKE 'contact_%' 
ORDER BY created_at DESC;`
    },
    {
      title: 'All Collaboration Requests',
      icon: FileText,
      sql: `SELECT 
  key,
  value->>'name' as name,
  value->>'email' as email,
  value->>'organization' as organization,
  value->>'collaborationType' as type,
  value->>'status' as status
FROM kv_store_feacf0d8 
WHERE key LIKE 'collaboration_%' 
ORDER BY created_at DESC;`
    },
    {
      title: 'All Shop Orders',
      icon: BarChart3,
      sql: `SELECT 
  key,
  value->'customer_info'->>'name' as customer,
  value->'customer_info'->>'email' as email,
  value->>'amount' as amount,
  value->>'status' as status,
  value->>'created_at' as order_date
FROM kv_store_feacf0d8 
WHERE key LIKE 'order_%' 
ORDER BY created_at DESC;`
    },
    {
      title: 'All Event Tickets',
      icon: BarChart3,
      sql: `SELECT 
  key,
  value->>'ticket_code' as ticket_code,
  value->'customer_info'->>'name' as customer,
  value->>'quantity' as quantity,
  value->>'total_amount' as amount,
  value->>'status' as status
FROM kv_store_feacf0d8 
WHERE key LIKE 'ticket_%' 
ORDER BY created_at DESC;`
    },
    {
      title: 'All Memberships',
      icon: Shield,
      sql: `SELECT 
  key,
  value->>'member_number' as member_number,
  value->>'membership_type' as type,
  value->'customer_info'->>'name' as member_name,
  value->'customer_info'->>'email' as email,
  value->>'status' as status,
  value->>'expires_at' as expires
FROM kv_store_feacf0d8 
WHERE key LIKE 'membership_%' 
ORDER BY created_at DESC;`
    },
    {
      title: 'Revenue Summary',
      icon: BarChart3,
      sql: `SELECT 
  CASE 
    WHEN key LIKE 'order_%' THEN 'Shop Orders'
    WHEN key LIKE 'ticket_%' THEN 'Event Tickets'
    WHEN key LIKE 'booking_%' THEN 'Bookings'
    WHEN key LIKE 'rental_%' THEN 'Rentals'
  END as source,
  COUNT(*) as transactions,
  SUM(CAST(value->>'amount' AS DECIMAL)) as total
FROM kv_store_feacf0d8
WHERE key LIKE 'order_%' 
   OR key LIKE 'ticket_%' 
   OR key LIKE 'booking_%'
   OR key LIKE 'rental_%'
GROUP BY source
ORDER BY total DESC;`
    },
    {
      title: 'Last 7 Days Activity',
      icon: Search,
      sql: `SELECT * FROM kv_store_feacf0d8
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;`
    },
    {
      title: 'Search by Email',
      icon: Search,
      sql: `SELECT * FROM kv_store_feacf0d8
WHERE value::text LIKE '%customer@email.com%';
-- Replace with actual email`
    }
  ];

  const dataTypes = [
    { prefix: 'contact_', type: 'Contact Forms', color: '#A68F59' },
    { prefix: 'collaboration_', type: 'Collaboration Requests', color: '#B1643B' },
    { prefix: 'order_', type: 'Shop Orders', color: '#A68F59' },
    { prefix: 'ticket_', type: 'Event Tickets', color: '#B1643B' },
    { prefix: 'membership_', type: 'Memberships', color: '#A68F59' },
    { prefix: 'rental_', type: 'Equipment Rentals', color: '#B1643B' },
    { prefix: 'digital_', type: 'Digital Products', color: '#A68F59' },
    { prefix: 'notification_', type: 'Email Signups', color: '#B1643B' },
    { prefix: 'booking_', type: 'Service Bookings', color: '#A68F59' },
    { prefix: 'preorder_', type: 'Pre-orders', color: '#B1643B' }
  ];

  return (
    <AdminAuth>
      <PageSEO
        title="Database Access"
        description="CREOVA staff admin dashboard."
        path="/admin/database"
        noIndex
      />
      <div className="min-h-screen" style={{ backgroundColor: '#F5F1EB' }}>
        {/* Header */}
        <div className="border-b" style={{ backgroundColor: '#FFFFFF', borderColor: '#E3DCD3' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)' }}
                >
                  <Database className="w-8 h-8" style={{ color: '#A68F59' }} />
                </div>
                <div>
                  <h1 className="text-3xl mb-1" style={{ color: '#121212' }}>
                    Supabase Database Access
                  </h1>
                  <p style={{ color: '#7A6F66' }}>
                    Direct access to your CREOVA data
                  </p>
                </div>
              </div>
              <Button
                onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                className="flex items-center gap-2"
                style={{ backgroundColor: '#121212' }}
              >
                Open Supabase Dashboard
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Quick Access Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E3DCD3' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" style={{ color: '#A68F59' }} />
                  Quick Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#F5F1EB' }}>
                    <div className="text-sm mb-2" style={{ color: '#7A6F66' }}>Database Table</div>
                    <div className="flex items-center justify-between gap-4">
                      <code className="text-lg" style={{ color: '#121212' }}>kv_store_feacf0d8</code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard('kv_store_feacf0d8', 'Table name')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#F5F1EB' }}>
                    <div className="text-sm mb-2" style={{ color: '#7A6F66' }}>Dashboard URL</div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-sm" style={{ color: '#121212' }}>supabase.com/dashboard</div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div 
                  className="p-4 rounded-xl border-l-4"
                  style={{ backgroundColor: 'rgba(166, 143, 89, 0.1)', borderColor: '#A68F59' }}
                >
                  <div className="flex items-start gap-3">
                    <Database className="w-5 h-5 mt-0.5" style={{ color: '#A68F59' }} />
                    <div>
                      <div className="mb-1" style={{ color: '#121212' }}>How to Access:</div>
                      <ol className="text-sm space-y-1 list-decimal list-inside" style={{ color: '#7A6F66' }}>
                        <li>Go to supabase.com/dashboard</li>
                        <li>Login to your account</li>
                        <li>Select your CREOVA project</li>
                        <li>Click "Table Editor" in left sidebar</li>
                        <li>Open "kv_store_feacf0d8" table</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Types Reference */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-2xl mb-6" style={{ color: '#121212' }}>
              Data Types in Your Database
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataTypes.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl border-l-4 cursor-pointer hover:shadow-md transition-shadow"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    borderColor: item.color
                  }}
                  onClick={() => copyToClipboard(item.prefix, 'Key prefix')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm mb-1" style={{ color: '#7A6F66' }}>
                        Key Prefix
                      </div>
                      <code className="text-sm" style={{ color: item.color }}>
                        {item.prefix}
                      </code>
                    </div>
                    <Copy className="w-4 h-4" style={{ color: '#7A6F66' }} />
                  </div>
                  <div className="mt-2" style={{ color: '#121212' }}>
                    {item.type}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* SQL Query Templates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl mb-6" style={{ color: '#121212' }}>
              Ready-to-Use SQL Queries
            </h2>
            <div className="grid gap-6">
              {queries.map((query, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E3DCD3' }}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <query.icon className="w-5 h-5" style={{ color: '#A68F59' }} />
                          {query.title}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => copyToClipboard(query.sql, 'Query')}
                          style={{ backgroundColor: '#121212' }}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Query
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div 
                        className="p-4 rounded-lg overflow-x-auto"
                        style={{ backgroundColor: '#1e1e1e' }}
                      >
                        <pre className="text-sm" style={{ color: '#d4d4d4' }}>
                          <code>{query.sql}</code>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Additional Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E3DCD3' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" style={{ color: '#A68F59' }} />
                  Additional Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <a
                    href="https://supabase.com/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl border-2 hover:shadow-md transition-all"
                    style={{ borderColor: '#E3DCD3' }}
                  >
                    <Code className="w-6 h-6 mb-2" style={{ color: '#A68F59' }} />
                    <div className="mb-1" style={{ color: '#121212' }}>Supabase Docs</div>
                    <div className="text-sm" style={{ color: '#7A6F66' }}>
                      Complete documentation
                    </div>
                  </a>

                  <a
                    href="https://supabase.com/docs/guides/database/overview"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl border-2 hover:shadow-md transition-all"
                    style={{ borderColor: '#E3DCD3' }}
                  >
                    <Database className="w-6 h-6 mb-2" style={{ color: '#B1643B' }} />
                    <div className="mb-1" style={{ color: '#121212' }}>SQL Reference</div>
                    <div className="text-sm" style={{ color: '#7A6F66' }}>
                      Learn SQL queries
                    </div>
                  </a>

                  <button
                    onClick={() => {
                      window.open('https://supabase.com/docs/guides/database/overview', '_blank');
                      toast.success('Opening documentation in new tab');
                    }}
                    className="p-4 rounded-xl border-2 hover:shadow-md transition-all text-left"
                    style={{ borderColor: '#E3DCD3' }}
                  >
                    <Download className="w-6 h-6 mb-2" style={{ color: '#A68F59' }} />
                    <div className="mb-1" style={{ color: '#121212' }}>Full Guide</div>
                    <div className="text-sm" style={{ color: '#7A6F66' }}>
                      View complete documentation
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminAuth>
  );
}