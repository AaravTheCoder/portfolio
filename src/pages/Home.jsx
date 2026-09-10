import { db as realDb } from '@/api/base44Client'; const db = realDb;

import { useState, useEffect, useRef } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import HeroSection from '../components/HeroSection';
import ScrollScene from '../components/ScrollScene';
import ProjectCard from '../components/ProjectCard';
import CategoryFilter from '../components/CategoryFilter';
import StatsSection from '../components/StatsSection';
import ScrollReveal from '../components/ScrollReveal';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [contactOpen, setContactOpen] = useState(false);

  const scrollSceneRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const LIGHT = '#f4f5f9';
    const DARK = '#0b0d13';

    const lerp = (a, b, t) => {
      const parse = (hex) => [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
      ];
      const ca = parse(a), cb = parse(b);
      const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
      const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
      const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
      return `rgb(${r},${g},${bl})`;
    };

    const update = () => {
      if (!scrollSceneRef.current || !rootRef.current) return;
      const el = scrollSceneRef.current;
      const sceneTop = el.offsetTop;
      const sceneHeight = el.offsetHeight;
      const scroll = window.scrollY;
      const FADE_IN = sceneHeight * 0.04;
      const FADE_OUT = sceneHeight * 0.10;

      let color;
      if (scroll < sceneTop) {
        color = LIGHT;
      } else if (scroll < sceneTop + FADE_IN) {
        color = lerp(LIGHT, DARK, (scroll - sceneTop) / FADE_IN);
      } else if (scroll < sceneTop + sceneHeight - FADE_OUT) {
        color = DARK;
      } else if (scroll < sceneTop + sceneHeight) {
        color = lerp(DARK, LIGHT, (scroll - (sceneTop + sceneHeight - FADE_OUT)) / FADE_OUT);
      } else {
        color = LIGHT;
      }
      rootRef.current.style.background = color;
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      const data = await db.entities.Project.list('display_order', 100);
      setProjects(data);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = activeCategory === 'All' ?
  projects :
  projects.filter((p) => p.category === activeCategory);

  const featured = projects.filter((p) => p.featured);

  return (
    <div ref={rootRef} style={{ background: '#f4f5f9' }}>
      <HeroSection />

      {/* ── Scroll-driven 3D particle animation ── */}
      <div ref={scrollSceneRef}>
        <ScrollScene />
      </div>

      {loading ?
      <div className="flex justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div> :

      <>
          {/* Stats */}
          {projects.length > 0 &&
        <section className="px-6 py-16">
              <StatsSection projects={projects} />
            </section>
        }

          {/* Featured */}
          {featured.length > 0 &&
        <section className="px-6 py-16">
              <ScrollReveal>
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-center">
                    Featured Work
                  </h2>
                  <p className="text-muted-foreground text-center mb-12 text-sm">
                    Highlights from my journey
                  </p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featured.map((project, i) =>
                <ProjectCard key={project.id} project={project} index={i} />
                )}
                  </div>
                </div>
              </ScrollReveal>
            </section>
        }

          {/* All Projects */}
          <section id="projects" className="px-6 py-16 scroll-mt-24">
            <ScrollReveal>
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-center">All Projects & Achievements

              </h2>
                <p className="text-muted-foreground text-center mb-10 text-sm">Browse everything I've built & all my achievements

              </p>
                <div className="mb-10">
                  <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
                </div>

                {filtered.length === 0 ?
              <div className="text-center py-20">
                    <div className="glass-strong inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4">
                      <span className="text-3xl">🚀</span>
                    </div>
                    <p className="text-muted-foreground">
                      {projects.length === 0 ?
                  'No projects yet. Head to Manage to add your first!' :
                  'No projects in this category.'}
                    </p>
                  </div> :

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((project, i) =>
                <ProjectCard key={project.id} project={project} index={i} />
                )}
                  </div>
              }
              </div>
            </ScrollReveal>
          </section>

          {/* Footer */}
          <footer className="px-6 py-16 text-center">
            <ScrollReveal>
              <div className="glass-strong rounded-3xl max-w-2xl mx-auto p-10">
                <h3 className="text-2xl font-bold mb-2">Let's Connect</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Interested in collaborating or learning more about my work?
                </p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setContactOpen(true)} className="glass px-6 py-2.5 rounded-2xl text-sm font-medium hover:scale-105 transition-transform cursor-pointer">
                    Get in Touch
                  </button>
                </div>

              <Dialog open={contactOpen} onOpenChange={setContactOpen}>
                <DialogContent className="max-w-sm text-center">
                  <DialogHeader>
                    <DialogTitle>Get in Touch</DialogTitle>
                    <DialogDescription className="mt-2">
                      Feel free to reach out via email!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <a href="mailto:kalaaarav@gmail.com">
                      <Button className="w-full rounded-2xl">✉️ kalaaarav@gmail.com</Button>
                    </a>
                  </div>
                </DialogContent>
              </Dialog>
              </div>
            </ScrollReveal>
          </footer>
        </>
      }
    </div>);

}