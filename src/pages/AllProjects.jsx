import { db as realDb } from '@/api/base44Client'; const db = realDb;

import { useState, useEffect } from 'react';

import ProjectCard from '../components/ProjectCard';
import CategoryFilter from '../components/CategoryFilter';
import ScrollReveal from '../components/ScrollReveal';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await db.entities.Project.list('display_order', 200);
      setProjects(data);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = projects.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = !search ||
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-center mb-3">
            All Projects
          </h1>
          <p className="text-muted-foreground text-center mb-10">Browse my complete collection of projects & accomplishments

          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-md mx-auto mb-8">
            <div className="glass-strong rounded-2xl flex items-center px-4 gap-3">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <Input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0" />
              
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mb-10">
            <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
          </div>
        </ScrollReveal>

        {loading ?
        <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div> :
        filtered.length === 0 ?
        <div className="text-center py-20">
            <div className="glass-strong inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <p className="text-muted-foreground">No projects match your search.</p>
          </div> :

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) =>
          <ProjectCard key={project.id} project={project} index={i} />
          )}
          </div>
        }
      </div>
    </div>);

}