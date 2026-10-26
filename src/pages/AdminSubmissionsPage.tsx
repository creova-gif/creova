import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Calendar, DollarSign, Briefcase, FileText, RefreshCw, Check, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { adminFetch } from '../utils/supabase/adminSession';
import { PageSEO } from '../components/PageSEO';

interface Submission {
  key: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message?: string;
  budget?: string;
  timeline?: string;
  organization?: string;
  collaborationType?: string;
  projectDescription?: string;
  status: string;
  type: string;
  created_at: string;
  updated_at?: string;
}

export function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'contact' | 'collaboration'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'completed'>('all');

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await adminFetch('/submissions');

      const data = await response.json();

      if (response.ok) {
        setSubmissions(data.submissions || []);
      } else {
        throw new Error(data.error || 'Failed to fetch submissions');
      }
    } catch {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (submissionId: string, newStatus: string) => {
    try {
      const response = await adminFetch('/update-submission-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          status: newStatus
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Status updated successfully');
        fetchSubmissions(); // Refresh the list
      } else {
        throw new Error(data.error || 'Failed to update status');
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter(sub => {
    if (filter !== 'all' && sub.type !== filter) return false;
    if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return '#887759';
      case 'contacted': return '#C6A45A';
      case 'completed': return '#4CAF50';
      default: return '#777777';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="w-4 h-4" />;
      case 'contacted': return <Mail className="w-4 h-4" />;
      case 'completed': return <Check className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <PageSEO
        title="Admin Submissions"
        description="CREOVA staff admin dashboard."
        path="/admin/submissions"
        noIndex
      />
      {/* Header */}
      <section className="py-16" style={{ backgroundColor: '#2D1011' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl mb-3" style={{ color: '#FFFFFF' }}>
                Contact Submissions
              </h1>
              <p className="text-lg" style={{ color: '#E0E0E0' }}>
                Manage all contact and collaboration requests
              </p>
            </div>
            <Button 
              onClick={fetchSubmissions}
              className="px-6 py-3 rounded-xl"
              style={{ backgroundColor: '#7D6D51', color: '#FFFFFF' }}
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </section>

      {/* Filters & Stats */}
      <section className="py-8" style={{ backgroundColor: '#2D1011', borderBottom: '1px solid #E0E0E0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Type Filter */}
            <div className="flex gap-2">
              <Button
                onClick={() => setFilter('all')}
                variant={filter === 'all' ? 'default' : 'outline'}
                className="rounded-xl"
                style={filter === 'all' ? { backgroundColor: '#7D6D51', color: '#FFFFFF' } : { color: '#FFFFFF', borderColor: '#E0E0E0' }}
              >
                All ({submissions.length})
              </Button>
              <Button
                onClick={() => setFilter('contact')}
                variant={filter === 'contact' ? 'default' : 'outline'}
                className="rounded-xl"
                style={filter === 'contact' ? { backgroundColor: '#7D6D51', color: '#FFFFFF' } : { color: '#FFFFFF', borderColor: '#E0E0E0' }}
              >
                Contact ({submissions.filter(s => s.type === 'contact').length})
              </Button>
              <Button
                onClick={() => setFilter('collaboration')}
                variant={filter === 'collaboration' ? 'default' : 'outline'}
                className="rounded-xl"
                style={filter === 'collaboration' ? { backgroundColor: '#7D6D51', color: '#FFFFFF' } : { color: '#FFFFFF', borderColor: '#E0E0E0' }}
              >
                Collaboration ({submissions.filter(s => s.type === 'collaboration').length})
              </Button>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 ml-auto">
              <Button
                onClick={() => setStatusFilter('all')}
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                className="rounded-xl text-sm"
                style={statusFilter === 'all' ? { backgroundColor: '#C6A45A', color: '#FFFFFF' } : { color: '#FFFFFF', borderColor: '#E0E0E0' }}
              >
                All Status
              </Button>
              <Button
                onClick={() => setStatusFilter('new')}
                variant={statusFilter === 'new' ? 'default' : 'outline'}
                className="rounded-xl text-sm"
                style={statusFilter === 'new' ? { backgroundColor: '#C6A45A', color: '#FFFFFF' } : { color: '#FFFFFF', borderColor: '#E0E0E0' }}
              >
                New
              </Button>
              <Button
                onClick={() => setStatusFilter('contacted')}
                variant={statusFilter === 'contacted' ? 'default' : 'outline'}
                className="rounded-xl text-sm"
                style={statusFilter === 'contacted' ? { backgroundColor: '#C6A45A', color: '#FFFFFF' } : { color: '#FFFFFF', borderColor: '#E0E0E0' }}
              >
                Contacted
              </Button>
              <Button
                onClick={() => setStatusFilter('completed')}
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                className="rounded-xl text-sm"
                style={statusFilter === 'completed' ? { backgroundColor: '#C6A45A', color: '#FFFFFF' } : { color: '#FFFFFF', borderColor: '#E0E0E0' }}
              >
                Completed
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Submissions List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: '#887759' }} />
              <p style={{ color: '#2D1011' }}>Loading submissions...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: '#777777' }} />
              <h3 className="text-2xl mb-2" style={{ color: '#2D1011' }}>No submissions found</h3>
              <p style={{ color: '#777777' }}>There are no submissions matching your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission, index) => (
                <motion.div
                  key={submission.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border"
                  style={{ borderColor: '#E0E0E0' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl" style={{ color: '#2D1011' }}>{submission.name}</h3>
                        <span 
                          className="px-3 py-1 rounded-full text-xs flex items-center gap-1"
                          style={{ backgroundColor: getStatusColor(submission.status) + '20', color: getStatusColor(submission.status) }}
                        >
                          {getStatusIcon(submission.status)}
                          {submission.status.toUpperCase()}
                        </span>
                        <span 
                          className="px-3 py-1 rounded-full text-xs"
                          style={{ backgroundColor: submission.type === 'contact' ? '#C6A45A20' : '#88775920', color: submission.type === 'contact' ? '#C6A45A' : '#887759' }}
                        >
                          {submission.type.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm mb-3" style={{ color: '#777777' }}>
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${submission.email}`} className="hover:underline">{submission.email}</a>
                        </div>
                        {submission.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <a href={`tel:${submission.phone}`} className="hover:underline">{submission.phone}</a>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(submission.created_at).toLocaleDateString('en-CA', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>

                      {/* Contact Form Fields */}
                      {submission.type === 'contact' && (
                        <div className="space-y-2">
                          {submission.service && (
                            <div className="flex items-start gap-2">
                              <Briefcase className="w-4 h-4 mt-1" style={{ color: '#C6A45A' }} />
                              <div>
                                <span className="text-sm" style={{ color: '#777777' }}>Service: </span>
                                <span style={{ color: '#2D1011' }}>{submission.service}</span>
                              </div>
                            </div>
                          )}
                          {submission.budget && (
                            <div className="flex items-start gap-2">
                              <DollarSign className="w-4 h-4 mt-1" style={{ color: '#C6A45A' }} />
                              <div>
                                <span className="text-sm" style={{ color: '#777777' }}>Budget: </span>
                                <span style={{ color: '#2D1011' }}>{submission.budget}</span>
                              </div>
                            </div>
                          )}
                          {submission.timeline && (
                            <div className="flex items-start gap-2">
                              <Clock className="w-4 h-4 mt-1" style={{ color: '#C6A45A' }} />
                              <div>
                                <span className="text-sm" style={{ color: '#777777' }}>Timeline: </span>
                                <span style={{ color: '#2D1011' }}>{submission.timeline}</span>
                              </div>
                            </div>
                          )}
                          {submission.message && (
                            <div className="mt-3 p-4 rounded-xl" style={{ backgroundColor: '#FFFFFF' }}>
                              <p className="text-sm mb-1" style={{ color: '#777777' }}>Message:</p>
                              <p style={{ color: '#2D1011' }}>{submission.message}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Collaboration Form Fields */}
                      {submission.type === 'collaboration' && (
                        <div className="space-y-2">
                          {submission.organization && (
                            <div className="flex items-start gap-2">
                              <Briefcase className="w-4 h-4 mt-1" style={{ color: '#887759' }} />
                              <div>
                                <span className="text-sm" style={{ color: '#777777' }}>Organization: </span>
                                <span style={{ color: '#2D1011' }}>{submission.organization}</span>
                              </div>
                            </div>
                          )}
                          {submission.collaborationType && (
                            <div className="flex items-start gap-2">
                              <FileText className="w-4 h-4 mt-1" style={{ color: '#887759' }} />
                              <div>
                                <span className="text-sm" style={{ color: '#777777' }}>Type: </span>
                                <span style={{ color: '#2D1011' }}>{submission.collaborationType}</span>
                              </div>
                            </div>
                          )}
                          {submission.budget && (
                            <div className="flex items-start gap-2">
                              <DollarSign className="w-4 h-4 mt-1" style={{ color: '#887759' }} />
                              <div>
                                <span className="text-sm" style={{ color: '#777777' }}>Budget: </span>
                                <span style={{ color: '#2D1011' }}>{submission.budget}</span>
                              </div>
                            </div>
                          )}
                          {submission.timeline && (
                            <div className="flex items-start gap-2">
                              <Clock className="w-4 h-4 mt-1" style={{ color: '#887759' }} />
                              <div>
                                <span className="text-sm" style={{ color: '#777777' }}>Timeline: </span>
                                <span style={{ color: '#2D1011' }}>{submission.timeline}</span>
                              </div>
                            </div>
                          )}
                          {submission.projectDescription && (
                            <div className="mt-3 p-4 rounded-xl" style={{ backgroundColor: '#FFFFFF' }}>
                              <p className="text-sm mb-1" style={{ color: '#777777' }}>Project Description:</p>
                              <p style={{ color: '#2D1011' }}>{submission.projectDescription}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t" style={{ borderColor: '#E0E0E0' }}>
                    <Button
                      onClick={() => updateStatus(submission.key, 'new')}
                      size="sm"
                      variant="outline"
                      className="rounded-lg"
                      disabled={submission.status === 'new'}
                      style={{ borderColor: '#E0E0E0', color: '#2D1011' }}
                    >
                      Mark as New
                    </Button>
                    <Button
                      onClick={() => updateStatus(submission.key, 'contacted')}
                      size="sm"
                      variant="outline"
                      className="rounded-lg"
                      disabled={submission.status === 'contacted'}
                      style={{ borderColor: '#E0E0E0', color: '#2D1011' }}
                    >
                      Mark as Contacted
                    </Button>
                    <Button
                      onClick={() => updateStatus(submission.key, 'completed')}
                      size="sm"
                      variant="outline"
                      className="rounded-lg"
                      disabled={submission.status === 'completed'}
                      style={{ borderColor: '#E0E0E0', color: '#2D1011' }}
                    >
                      Mark as Completed
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
