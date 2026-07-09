import { useState } from 'react';
import { motion } from 'motion/react';
import { ImagePlus, Trash2, Pencil, X, ExternalLink, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { adminFetch } from '../utils/supabase/adminSession';
import { PageSEO } from '../components/PageSEO';
import { useGalleries, type Gallery, type GalleryCategory } from '../hooks/useGalleries';

const CATEGORIES: GalleryCategory[] = ['events', 'sports', 'brand', 'conference'];

const EMPTY_FORM = {
  title: '',
  subtitle: '',
  category: 'events' as GalleryCategory,
  org: '',
  year: String(new Date().getFullYear()),
  image: '',
  objectPosition: 'center',
  url: '',
  accent: '#A68F59',
  featured: false,
};

export function AdminGalleriesPage() {
  const { galleries, loading, refetch } = useGalleries();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (gallery: Gallery) => {
    setEditingId(gallery.id);
    setForm({
      title: gallery.title,
      subtitle: gallery.subtitle,
      category: gallery.category,
      org: gallery.org,
      year: gallery.year,
      image: gallery.image,
      objectPosition: gallery.objectPosition,
      url: gallery.url,
      accent: gallery.accent,
      featured: gallery.featured,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!form.title || !form.image || !form.url) {
      toast.error('Title, cover image, and Pixieset URL are required');
      return;
    }
    setSaving(true);
    try {
      const res = await adminFetch(editingId ? '/admin/galleries/update' : '/admin/galleries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : { ...form, order: galleries.length }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(editingId ? 'Gallery updated' : 'Gallery added');
        closeForm();
        refetch();
      } else {
        toast.error(data.error || 'Failed to save gallery');
      }
    } catch {
      toast.error('Failed to save gallery');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    try {
      const res = await adminFetch('/admin/galleries/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast.success('Gallery deleted');
        refetch();
      } else {
        toast.error('Failed to delete gallery');
      }
    } catch {
      toast.error('Failed to delete gallery');
    }
  };

  return (
    <div style={{ backgroundColor: '#F5F1EB', minHeight: '100vh' }}>
      <PageSEO
        title="Manage Galleries"
        description="CREOVA staff admin dashboard."
        path="/admin/galleries"
        noIndex
      />

      <section className="py-12" style={{ backgroundColor: '#121212' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl mb-2" style={{ color: '#F5F1EB' }}>
              Work Portfolio
            </h1>
            <p className="text-sm" style={{ color: '#A68F59' }}>
              Add, edit, or remove galleries shown on /work and the homepage
            </p>
          </div>
          <Button onClick={openCreateForm} style={{ backgroundColor: '#A68F59', color: '#121212' }}>
            <ImagePlus className="w-4 h-4 mr-2" />
            Add Gallery
          </Button>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 mb-8 shadow-lg border"
              style={{ borderColor: '#E3DCD3' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl" style={{ color: '#121212' }}>
                  {editingId ? 'Edit Gallery' : 'New Gallery'}
                </h2>
                <button onClick={closeForm} style={{ color: '#7A6F66' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#121212' }}>Title *</label>
                  <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Afro Caribbean Night" />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#121212' }}>Subtitle</label>
                  <Input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} placeholder="e.g. Part II" />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#121212' }}>Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value as GalleryCategory })}
                    className="w-full px-3 py-2 rounded-xl border text-sm"
                    style={{ borderColor: '#E3DCD3' }}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#121212' }}>Organization</label>
                  <Input value={form.org} onChange={e => setForm({ ...form, org: e.target.value })} placeholder="e.g. BSSC · Brock University" />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#121212' }}>Year</label>
                  <Input value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="2026" />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#121212' }}>Accent color</label>
                  <Input value={form.accent} onChange={e => setForm({ ...form, accent: e.target.value })} placeholder="#A68F59" />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#121212' }}>
                    Cover image path *
                  </label>
                  <Input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="/card-example.jpg" />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#121212' }}>Image position</label>
                  <Input value={form.objectPosition} onChange={e => setForm({ ...form, objectPosition: e.target.value })} placeholder="center 30%" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1" style={{ color: '#121212' }}>Pixieset gallery URL *</label>
                  <Input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://creova.pixieset.com/..." />
                </div>
                <label className="flex items-center gap-2 md:col-span-2 text-sm" style={{ color: '#121212' }}>
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                  Featured (appears larger in the "All Work" grid)
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={handleSave} disabled={saving} style={{ backgroundColor: '#121212', color: '#F5F1EB' }}>
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Gallery'}
                </Button>
                <Button variant="outline" onClick={closeForm}>Cancel</Button>
              </div>
            </motion.div>
          )}

          {loading ? (
            <p style={{ color: '#7A6F66' }}>Loading galleries...</p>
          ) : galleries.length === 0 ? (
            <p style={{ color: '#7A6F66' }}>No galleries yet. Click "Add Gallery" to create one.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleries.map(gallery => (
                <div key={gallery.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border" style={{ borderColor: '#E3DCD3' }}>
                  <div className="relative" style={{ aspectRatio: '4/3', backgroundColor: '#111' }}>
                    <img src={gallery.image} alt={gallery.title} className="w-full h-full object-cover" style={{ objectPosition: gallery.objectPosition }} />
                    {gallery.featured && (
                      <div className="absolute top-2 left-2 px-2 py-1 rounded-full flex items-center gap-1 text-[10px] uppercase" style={{ backgroundColor: 'rgba(166,143,89,0.9)', color: '#121212' }}>
                        <Star className="w-3 h-3" /> Featured
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: gallery.accent }}>{gallery.org}</p>
                    <h3 className="text-lg mb-1" style={{ color: '#121212' }}>{gallery.title}</h3>
                    <p className="text-sm mb-3" style={{ color: '#7A6F66' }}>{gallery.subtitle} · {gallery.category} · {gallery.year}</p>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditForm(gallery)}>
                        <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(gallery.id, gallery.title)}>
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" style={{ color: '#B1643B' }} />
                      </Button>
                      <a href={gallery.url} target="_blank" rel="noopener noreferrer" className="ml-auto">
                        <ExternalLink className="w-4 h-4" style={{ color: '#7A6F66' }} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
