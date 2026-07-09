import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Eye, MousePointer, Clock, TrendingUp, Globe, 
  Monitor, RefreshCw, Calendar,
  BarChart3, PieChart, Activity, ExternalLink
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { adminFetch } from '../utils/supabase/adminSession';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  status: string;
  period: {
    days: number;
    startDate: string;
    endDate: string;
  };
  summary: {
    totalPageviews: number;
    uniqueVisitors: number;
    totalSessions: number;
    avgPageviewsPerSession: string;
    totalEvents: number;
  };
  topPages: Array<{ page: string; count: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
  devices: Array<{ device: string; count: number }>;
  browsers: Array<{ browser: string; count: number }>;
  dailyViews: Array<{ date: string; views: number }>;
  topEvents: Array<{ event: string; count: number }>;
  recentPageviews: Array<{
    page: string;
    referrer: string;
    timestamp: string;
    userAgent: string;
  }>;
}

export function AnalyticsDashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30); // Default: last 30 days

  const COLORS = ['#B1643B', '#A68F59', '#A68F59', '#E3DCD3', '#121212'];

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await adminFetch(`/analytics?days=${period}`);

      const data = await response.json();

      if (response.ok) {
        setAnalytics(data);
      } else {
        throw new Error(data.error || 'Failed to fetch analytics');
      }
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const StatCard = ({ icon: Icon, label, value, change, color }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-6 shadow-lg border"
      style={{ borderColor: '#E3DCD3' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        {change && (
          <div className="flex items-center gap-1 text-sm" style={{ color: '#4CAF50' }}>
            <TrendingUp className="w-4 h-4" />
            <span>{change}</span>
          </div>
        )}
      </div>
      <div className="text-3xl mb-1" style={{ color: '#121212' }}>{value}</div>
      <div className="text-sm" style={{ color: '#7A6F66' }}>{label}</div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F1EB' }}>
        <div className="text-center">
          <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: '#B1643B' }} />
          <p style={{ color: '#121212' }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F1EB' }}>
        <div className="text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4" style={{ color: '#7A6F66' }} />
          <h3 className="text-2xl mb-2" style={{ color: '#121212' }}>No analytics data</h3>
          <p style={{ color: '#7A6F66' }}>Start tracking to see your data here</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F5F1EB', minHeight: '100vh' }}>
      {/* Header */}
      <section className="py-16" style={{ backgroundColor: '#121212' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl mb-3" style={{ color: '#F5F1EB' }}>
                Website Analytics
              </h1>
              <p className="text-lg" style={{ color: '#E3DCD3' }}>
                Track visitor behavior and website performance
              </p>
            </div>
            <Button 
              onClick={fetchAnalytics}
              className="px-6 py-3 rounded-xl"
              style={{ backgroundColor: '#B1643B', color: '#F5F1EB' }}
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </section>

      {/* Period Selector */}
      <section className="py-6" style={{ backgroundColor: '#121212', borderBottom: '1px solid #E3DCD3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" style={{ color: '#E3DCD3' }} />
            <span className="text-sm mr-4" style={{ color: '#E3DCD3' }}>Time Period:</span>
            {[7, 30, 90].map((days) => (
              <Button
                key={days}
                onClick={() => setPeriod(days)}
                variant={period === days ? 'default' : 'outline'}
                size="sm"
                className="rounded-xl"
                style={
                  period === days
                    ? { backgroundColor: '#B1643B', color: '#F5F1EB' }
                    : { color: '#F5F1EB', borderColor: '#E3DCD3' }
                }
              >
                Last {days} days
              </Button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={Eye}
            label="Total Pageviews"
            value={analytics.summary.totalPageviews.toLocaleString()}
            color="#B1643B"
          />
          <StatCard
            icon={Users}
            label="Unique Visitors"
            value={analytics.summary.uniqueVisitors.toLocaleString()}
            color="#A68F59"
          />
          <StatCard
            icon={MousePointer}
            label="Total Sessions"
            value={analytics.summary.totalSessions.toLocaleString()}
            color="#8B7355"
          />
          <StatCard
            icon={Clock}
            label="Avg Pages/Session"
            value={analytics.summary.avgPageviewsPerSession}
            color="#7A6F66"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Traffic Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border"
            style={{ borderColor: '#E3DCD3' }}
          >
            <h3 className="text-xl mb-4 flex items-center gap-2" style={{ color: '#121212' }}>
              <Activity className="w-5 h-5" style={{ color: '#B1643B' }} />
              Daily Traffic
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.dailyViews}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3DCD3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#7A6F66' }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fill: '#7A6F66' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#F5F1EB', border: '1px solid #E3DCD3', borderRadius: '8px' }}
                  labelStyle={{ color: '#121212' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#B1643B" 
                  strokeWidth={2}
                  dot={{ fill: '#B1643B', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Top Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border"
            style={{ borderColor: '#E3DCD3' }}
          >
            <h3 className="text-xl mb-4 flex items-center gap-2" style={{ color: '#121212' }}>
              <BarChart3 className="w-5 h-5" style={{ color: '#B1643B' }} />
              Top Pages
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.topPages.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E3DCD3" />
                <XAxis type="number" tick={{ fill: '#7A6F66' }} />
                <YAxis 
                  dataKey="page" 
                  type="category" 
                  tick={{ fill: '#7A6F66' }}
                  width={100}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#F5F1EB', border: '1px solid #E3DCD3', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#B1643B" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Device Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border"
            style={{ borderColor: '#E3DCD3' }}
          >
            <h3 className="text-xl mb-4 flex items-center gap-2" style={{ color: '#121212' }}>
              <Monitor className="w-5 h-5" style={{ color: '#B1643B' }} />
              Devices
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie
                  data={analytics.devices}
                  dataKey="count"
                  nameKey="device"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.device}: ${entry.count}`}
                >
                  {analytics.devices.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#F5F1EB', border: '1px solid #E3DCD3', borderRadius: '8px' }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Browser Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border"
            style={{ borderColor: '#E3DCD3' }}
          >
            <h3 className="text-xl mb-4 flex items-center gap-2" style={{ color: '#121212' }}>
              <Globe className="w-5 h-5" style={{ color: '#B1643B' }} />
              Browsers
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie
                  data={analytics.browsers}
                  dataKey="count"
                  nameKey="browser"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.browser}: ${entry.count}`}
                >
                  {analytics.browsers.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#F5F1EB', border: '1px solid #E3DCD3', borderRadius: '8px' }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Top Referrers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border"
            style={{ borderColor: '#E3DCD3' }}
          >
            <h3 className="text-xl mb-4 flex items-center gap-2" style={{ color: '#121212' }}>
              <ExternalLink className="w-5 h-5" style={{ color: '#B1643B' }} />
              Traffic Sources
            </h3>
            <div className="space-y-3">
              {analytics.topReferrers.slice(0, 5).map((referrer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm truncate" style={{ color: '#121212' }}>
                    {referrer.referrer === 'direct' ? '🔗 Direct' : `🌐 ${referrer.referrer}`}
                  </span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${(referrer.count / analytics.topReferrers[0].count) * 100}px`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    />
                    <span className="text-sm" style={{ color: '#7A6F66' }}>{referrer.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Events */}
        {analytics.topEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg border mb-6"
            style={{ borderColor: '#E3DCD3' }}
          >
            <h3 className="text-xl mb-4 flex items-center gap-2" style={{ color: '#121212' }}>
              <PieChart className="w-5 h-5" style={{ color: '#B1643B' }} />
              Top Events
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.topEvents.map((event, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl border"
                  style={{ backgroundColor: '#F5F1EB', borderColor: '#E3DCD3' }}
                >
                  <div className="text-2xl mb-1" style={{ color: '#B1643B' }}>{event.count}</div>
                  <div className="text-sm" style={{ color: '#121212' }}>{event.event}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg border"
          style={{ borderColor: '#E3DCD3' }}
        >
          <h3 className="text-xl mb-4 flex items-center gap-2" style={{ color: '#121212' }}>
            <Activity className="w-5 h-5" style={{ color: '#B1643B' }} />
            Recent Pageviews
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '2px solid #E3DCD3' }}>
                  <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A6F66' }}>Page</th>
                  <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A6F66' }}>Referrer</th>
                  <th className="text-left py-3 px-4 text-sm" style={{ color: '#7A6F66' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentPageviews.slice(0, 10).map((pv, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #E3DCD3' }}>
                    <td className="py-3 px-4 text-sm" style={{ color: '#121212' }}>{pv.page}</td>
                    <td className="py-3 px-4 text-sm" style={{ color: '#7A6F66' }}>
                      {pv.referrer || 'Direct'}
                    </td>
                    <td className="py-3 px-4 text-sm" style={{ color: '#7A6F66' }}>
                      {new Date(pv.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
