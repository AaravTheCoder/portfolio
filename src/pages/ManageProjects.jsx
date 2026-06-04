import { db as realDb } from '@/api/base44Client'; const db = realDb;

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Loader2, GripVertical, Star, Lock } from 'lucide-react';
import ProjectFormDialog from '../components/ProjectFormDialog';
import ScrollReveal from '../components/ScrollReveal';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const MANAGE_PASSWORD = 'Aarav4321';

function PasswordGate({ onUnlock }) {
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === MANAGE_PASSWORD) {
      onUnlock();
    } else {
      setPasswordError(true);
      setPasswordInput('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-strong rounded-3xl p-10 w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-1">Admin Access</h2>
        <p className="text-muted-foreground text-sm mb-8">Enter the password to manage projects</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Password"
            value={passwordInput}
            onChange={e => { setPasswordInput(e.target.value); setPasswordError(false); }}
            className={`text-center rounded-2xl h-12 ${passwordError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            autoFocus
          />
          {passwordError && <p className="text-destructive text-xs">Incorrect password. Try again.</p>}
          <Button type="submit" className="w-full rounded-2xl h-12">Unlock</Button>
        </form>
      </div>
    </div>
  );
}

function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const loadProjects = async () => {
    const data = await db.entities.Project.list('display_order', 200);
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => { loadProjects(); }, []);

  const handleDelete = async () => {
    await db.entities.Project.delete(deleteId);
    setDeleteId(null);
    loadProjects();
    toast.success('Project deleted');
  };

  const handleEdit = (project) => {
    setEditProject(project);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditProject(null);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Manage Projects</h1>
              <p className="text-muted-foreground text-sm mt-1">Add, edit, or remove your portfolio items</p>
            </div>
            <Button onClick={handleAdd} className="rounded-2xl gap-2">
              <Plus className="w-4 h-4" />
              Add Project
            </Button>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : projects.length === 0 ? (
          <ScrollReveal>
            <div className="glass-strong rounded-3xl p-16 text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">No projects yet</h3>
              <p className="text-muted-foreground text-sm mb-6">Start by adding your first project</p>
              <Button onClick={handleAdd} className="rounded-2xl gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Project
              </Button>
            </div>
          </ScrollReveal>
        ) : (
          <div className="space-y-3">
            {projects.map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 0.05}>
                <div className="glass-strong rounded-2xl p-4 flex items-center gap-4 group hover:scale-[1.01] transition-transform duration-200">
                  <GripVertical className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                    {project.images?.[0] ? (
                      <img src={project.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-lg">📁</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{project.title}</h3>
                      {project.featured && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-md bg-muted">{project.category}</span>
                      <span>{project.status}</span>
                      <span>•</span>
                      <span>{(project.images?.length || 0) + (project.videos?.length || 0)} media</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => handleEdit(project)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-xl text-destructive hover:text-destructive" onClick={() => setDeleteId(project.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>

      <ProjectFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={editProject}
        onSaved={loadProjects}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this project from your portfolio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function ManageProjects() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  return <ProjectManager />;
}