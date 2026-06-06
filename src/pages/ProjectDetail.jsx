import { db as realDb } from '@/api/base44Client'; const db = realDb;

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Play, Image as ImageIcon, Loader2 } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import ReactMarkdown from 'react-markdown';
// 1. Import Giscus at the top
import Giscus from '@giscus/react';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await db.entities.Project.filter({ id });
      if (data.length > 0) setProject(data[0]);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <Link to="/" className="text-primary hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  const allMedia = [
    ...(project.images || []).map(url => ({ type: 'image', url })),
    ...(project.videos || []).map(url => ({ type: 'video', url })),
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="glass inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              {project.category}
            </span>
            {project.status && project.status !== 'Completed' && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-500">
                {project.status}
              </span>
            )}
            {project.featured && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent">
                ★ Featured
              </span>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            {project.title}
          </h1>
          {project.description && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {project.description}
            </p>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="glass inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium hover:scale-105 transition-transform"
            >
              <ExternalLink className="w-4 h-4" />
              View Project
            </a>
          )}
        </motion.div>

        {/* Media Gallery */}
        {allMedia.length > 0 && (
          <ScrollReveal className="mt-12">
            {/* Main display */}
            <div className="glass-strong rounded-3xl overflow-hidden mb-4">
              {(activeMedia || allMedia[0]).type === 'image' ? (
                <img
                  src={(activeMedia || allMedia[0]).url}
                  alt={project.title}
                  className="w-full aspect-video object-cover"
                />
              ) : (
                <video
                  src={(activeMedia || allMedia[0]).url}
                  controls
                  className="w-full aspect-video object-cover"
                />
              )}
            </div>

            {/* Thumbnails */}
            {allMedia.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allMedia.map((media, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveMedia(media)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      (activeMedia || allMedia[0]) === media
                        ? 'border-primary scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    {media.type === 'image' ? (
                      <img src={media.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Play className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </ScrollReveal>
        )}

        {/* Tags */}
        {project.tags?.length > 0 && (
          <ScrollReveal className="mt-10">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <span key={i} className="glass px-4 py-2 rounded-xl text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Detailed writeup */}
        {project.long_description && (
          <ScrollReveal className="mt-12">
            <div className="glass-strong rounded-3xl p-8 sm:p-10">
              <h2 className="text-2xl font-bold mb-6">About This Project</h2>
              <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed">
                <ReactMarkdown>{project.long_description}</ReactMarkdown>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* 2. Drop the Comment section wrapper down here */}
        <ScrollReveal className="mt-12">
          <div className="glass-strong rounded-3xl p-8 sm:p-10">
            <h2 className="text-2xl font-bold mb-6">Comments</h2>
            <Giscus
              id="project-comments"
              repo="AaravTheCoder/portfolio"
              repoId="R_kgDOSwmXHQ"
              category="General"
              categoryId="DIC_kwDOSwmXHc4C-jnd"
              mapping="pathname"          // Keeps comments unique to the browser path
              reactionsEnabled="1"
              emitMetadata="0"
              inputPosition="top"
              theme="noborder_light" 
              lang="en"
              loading="lazy"
            />
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}