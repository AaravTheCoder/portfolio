import { db as realDb } from '@/api/base44Client'; const db = realDb;

import { useState, useEffect } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, X, Plus } from 'lucide-react';
import { toast } from 'sonner';

const categories = ['Programming', 'Engineering', 'AI', 'Extracurricular', 'Other'];
const statuses = ['Completed', 'In Progress', 'Archived'];

export default function ProjectFormDialog({ open, onOpenChange, project, onSaved }) {
  const isEditing = !!project;
  const [form, setForm] = useState({
    title: '', category: 'Programming', description: '', long_description: '',
    images: [], videos: [], tags: [], featured: false, display_order: 0,
    link: '', status: 'Completed',
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title || '',
        category: project.category || 'Programming',
        description: project.description || '',
        long_description: project.long_description || '',
        images: project.images || [],
        videos: project.videos || [],
        tags: project.tags || [],
        featured: project.featured || false,
        display_order: project.display_order || 0,
        link: project.link || '',
        status: project.status || 'Completed',
      });
    } else {
      setForm({
        title: '', category: 'Programming', description: '', long_description: '',
        images: [], videos: [], tags: [], featured: false, display_order: 0,
        link: '', status: 'Completed',
      });
    }
  }, [project, open]);

  const handleUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const urls = [];
    for (const file of files) {
      const { file_url } = await db.integrations.Core.UploadFile({ file });
      urls.push(file_url);
    }
    setForm(prev => ({
      ...prev,
      [type]: [...prev[type], ...urls],
    }));
    setUploading(false);
    e.target.value = '';
  };

  const removeMedia = (type, index) => {
    setForm(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput('');
  };

  const removeTag = (index) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    setSaving(true);
    if (isEditing) {
      await db.entities.Project.update(project.id, form);
    } else {
      await db.entities.Project.create(form);
    }
    setSaving(false);
    onSaved();
    onOpenChange(false);
    toast.success(isEditing ? 'Project updated!' : 'Project created!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Project' : 'Add New Project'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* Title */}
          <div>
            <Label>Title *</Label>
            <Input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="My Awesome Project" />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm(prev => ({ ...prev, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm(prev => ({ ...prev, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Short description */}
          <div>
            <Label>Short Description</Label>
            <Textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Brief overview..." rows={2} />
          </div>

          {/* Long description */}
          <div>
            <Label>Detailed Write-up (Markdown supported)</Label>
            <Textarea value={form.long_description} onChange={e => setForm(prev => ({ ...prev, long_description: e.target.value }))} placeholder="Write about your project in detail..." rows={6} />
          </div>

          {/* Images */}
          <div>
            <Label>Images</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {form.images.map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeMedia('images', i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
                <input type="file" multiple accept="image/*" className="hidden" onChange={e => handleUpload(e, 'images')} />
              </label>
            </div>
          </div>

          {/* Videos */}
          <div>
            <Label>Videos</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {form.videos.map((url, i) => (
                <div key={i} className="relative w-32 h-20 rounded-xl overflow-hidden bg-muted group flex items-center justify-center">
                  <video src={url} className="w-full h-full object-cover" />
                  <button onClick={() => removeMedia('videos', i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="w-32 h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
                <input type="file" multiple accept="video/*" className="hidden" onChange={e => handleUpload(e, 'videos')} />
              </label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mt-2 mb-2">
              {form.tags.map((tag, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-muted text-sm font-medium">
                  {tag}
                  <button onClick={() => removeTag(i)}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Add a tag" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} />
              <Button variant="outline" size="icon" onClick={addTag}><Plus className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* Link */}
          <div>
            <Label>Project Link</Label>
            <Input value={form.link} onChange={e => setForm(prev => ({ ...prev, link: e.target.value }))} placeholder="https://..." />
          </div>

          {/* Order & Featured */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Label>Display Order</Label>
              <Input type="number" className="w-20" value={form.display_order} onChange={e => setForm(prev => ({ ...prev, display_order: Number(e.target.value) }))} />
            </div>
            <div className="flex items-center gap-3">
              <Label>Featured</Label>
              <Switch checked={form.featured} onCheckedChange={v => setForm(prev => ({ ...prev, featured: v }))} />
            </div>
          </div>

          {/* Save */}
          <Button onClick={handleSave} disabled={saving} className="w-full rounded-2xl h-12">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isEditing ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}