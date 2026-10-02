import { motion } from 'motion/react';
import { Database, Copy, Code, FileText, Download, Search, BarChart3, CheckCircle } from 'lucide-react';
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
      sql: "SELECT key,\n  json_extract(value, '$.name') AS name,\n  json_extract(value, '$.email') AS email,\n  json_extract(value, '$.service') AS service,\n  json_extract(value, '$.status') AS status,\n  updated_at\nFROM kv\nWHERE key >= 'contact_' AND key < 'contact`'\nORDER BY updated_at DESC;"
    },
    {
      title: 'All Collaboration Requests',
      icon: FileText,
      sql: "SELECT key,\n  json_extract(value, '$.name') AS name,\n  json_extract(value, '$.email') AS email,\n  json_extract(value, '$.organization') AS organization,\n  json_extract(value, '$.status') AS status,\n  updated_at\nFROM kv\nWHERE key >= 'collaboration_' AND key < 'collaboration`'\nORDER BY updated_at DESC;"
    },
    {
      title: 'Bookings and Rentals',
      icon: BarChart3,
      sql: "SELECT 'booking' AS source, COUNT(*) AS n FROM kv WHERE key >= 'booking_' AND key < 'booking`'\nUNION ALL\nSELECT 'rental', COUNT(*) FROM kv WHERE key >= 'rental_' AND key < 'rental`'\nUNION ALL\nSELECT 'contact', COUNT(*) FROM kv WHERE key >= 'contact_' AND key < 'contact`';"
    },
    {
      title: 'Galleries',
      icon: Search,
      sql: "SELECT key, json_extract(value, '$.title') AS title, updated_at\nFROM kv\nWHERE key >= 'gallery_' AND key < 'gallery`'\nORDER BY key;"
    },
    {
      title: 'Search Contacts by Email',
      icon: Search,
      sql: "SELECT key, value\nFROM kv\nWHERE key >= 'contact_' AND key < 'contact`'\n  AND json_extract(value, '$.email') = 'customer@example.com';"
    }
  ];

  const dataTypes = [
    { prefix: 'contact_', type: 'Contact Forms', color: '#D4A843' },
    { prefix: 'collaboration_', type: 'Collaboration Requests', color: '#B1643B' },
    { prefix: 'booking_', type: 'Service Bookings', color: '#D4A843' },
    { prefix: 'rental_', type: 'Equipment Rentals', color: '#B1643B' },
    { prefix: 'gallery_', type: 'Work Galleries', color: '#D4A843' },
    { prefix: 'notification_', type: 'Email Signups', color: '#B1643B' },
    { prefix: 'lead_magnet_', type: 'Lead Magnets', color: '#D4A843' },
    { prefix: 'event_interest_', type: 'Event Interest', color: '#B1643B' }
  ];

  return (
    <AdminAuth>
      <PageSEO
        title="Database Access"
        description="CREOVA staff admin dashboard."
        path="/admin/database"
        noIndex
      />
      <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
        {/* Header */}
        <div className="border-b" style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(212, 168, 67, 0.1)' }}
                >
                  <Database className="w-8 h-8" style={{ color: '#D4A843' }} />
                </div>
                <div>
                  <h1 className="text-3xl mb-1" style={{ color: '#121212' }}>
                    D1 database
                  </h1>
                  <p style={{ color: '#777777' }}>
                    Leads and galleries in the creova D1 table kv
                  </p>
                </div>
              </div>
              <Button
                onClick={() => copyToClipboard("npx wrangler d1 execute creova --remote --command \"SELECT key FROM kv LIMIT 5;\"", 'Command')}
                className="flex items-center gap-2"
                style={{ backgroundColor: '#121212' }}
              >
                Copy wrangler command
                <Copy className="w-4 h-4" />
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
            <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" style={{ color: '#D4A843' }} />
                  Quick Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#F8F9FA' }}>
                    <div className="text-sm mb-2" style={{ color: '#777777' }}>Database Table</div>
                    <div className="flex items-center justify-between gap-4">
                      <code className="text-lg" style={{ color: '#121212' }}>kv</code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard('kv', 'Table name')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#F8F9FA' }}>
                    <div className="text-sm mb-2" style={{ color: '#777777' }}>Database</div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-sm" style={{ color: '#121212' }}>D1 creova</div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard('creova', 'Database name')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div 
                  className="p-4 rounded-xl border-l-4"
                  style={{ backgroundColor: 'rgba(212, 168, 67, 0.1)', borderColor: '#D4A843' }}
                >
                  <div className="flex items-start gap-3">
                    <Database className="w-5 h-5 mt-0.5" style={{ color: '#D4A843' }} />
                    <div>
                      <div className="mb-1" style={{ color: '#121212' }}>How to Access:</div>
                      <ol className="text-sm space-y-1 list-decimal list-inside" style={{ color: '#777777' }}>
                        <li>From workers/api, run npx wrangler login</li>
                        <li>Run npx wrangler d1 execute creova --remote</li>
                        <li>Or open the Cloudflare dashboard, D1, database creova, Console</li>
                        <li>Query the kv table with a primary-key range, not LIKE</li>
                        <li>Shop, ticket, and membership rows are not written. Those routes return 410</li>
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
                      <div className="text-sm mb-1" style={{ color: '#777777' }}>
                        Key Prefix
                      </div>
                      <code className="text-sm" style={{ color: item.color }}>
                        {item.prefix}
                      </code>
                    </div>
                    <Copy className="w-4 h-4" style={{ color: '#777777' }} />
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
                  <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0' }}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <query.icon className="w-5 h-5" style={{ color: '#D4A843' }} />
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
            <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" style={{ color: '#D4A843' }} />
                  Additional Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <a
                    href="https://developers.cloudflare.com/d1/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl border-2 hover:shadow-md transition-all"
                    style={{ borderColor: '#E0E0E0' }}
                  >
                    <Code className="w-6 h-6 mb-2" style={{ color: '#D4A843' }} />
                    <div className="mb-1" style={{ color: '#121212' }}>D1 docs</div>
                    <div className="text-sm" style={{ color: '#777777' }}>
                      Cloudflare D1
                    </div>
                  </a>

                  <a
                    href="https://developers.cloudflare.com/d1/worker-api/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl border-2 hover:shadow-md transition-all"
                    style={{ borderColor: '#E0E0E0' }}
                  >
                    <Database className="w-6 h-6 mb-2" style={{ color: '#B1643B' }} />
                    <div className="mb-1" style={{ color: '#121212' }}>Worker API</div>
                    <div className="text-sm" style={{ color: '#777777' }}>
                      Prepared statements
                    </div>
                  </a>

                  <a
                    href="https://developers.cloudflare.com/d1/platform/pricing/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl border-2 hover:shadow-md transition-all"
                    style={{ borderColor: '#E0E0E0' }}
                  >
                    <Download className="w-6 h-6 mb-2" style={{ color: '#D4A843' }} />
                    <div className="mb-1" style={{ color: '#121212' }}>Free-tier limits</div>
                    <div className="text-sm" style={{ color: '#777777' }}>
                      Rows read and written
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminAuth>
  );
}