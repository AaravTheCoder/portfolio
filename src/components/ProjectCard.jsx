import { motion } from 'framer-motion';
import { ExternalLink, Play, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const categoryColors = {
  Programming: 'from-blue-500/20 to-cyan-500/20 text-blue-400',
  Engineering: 'from-orange-500/20 to-amber-500/20 text-orange-400',
  AI: 'from-purple-500/20 to-pink-500/20 text-purple-400',
  Extracurricular: 'from-green-500/20 to-emerald-500/20 text-green-400',
  Other: 'from-gray-500/20 to-slate-500/20 text-gray-400',
};

export default function ProjectCard({ project, index = 0 }) {
  const hasMedia = (project.images?.length > 0) || (project.videos?.length > 0);
  const thumbnail = project.images?.[0] || null;
  const colorClass = categoryColors[project.category] || categoryColors.Other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group"
    >
      <Link to={`/project/${project.id}`}>
        <div className="glass-strong rounded-3xl overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/10">
          {/* Media preview */}
          <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
              </div>
            )}
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Media count badges */}
            {hasMedia && (
              <div className="absolute top-3 right-3 flex gap-2">
                {project.images?.length > 0 && (
                  <div className="glass-subtle rounded-lg px-2 py-1 text-xs font-medium text-white flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    {project.images.length}
                  </div>
                )}
                {project.videos?.length > 0 && (
                  <div className="glass-subtle rounded-lg px-2 py-1 text-xs font-medium text-white flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    {project.videos.length}
                  </div>
                )}
              </div>
            )}

            {/* Featured badge */}
            {project.featured && (
              <div className="absolute top-3 left-3 glass-subtle rounded-lg px-3 py-1 text-xs font-bold text-white">
                ★ Featured
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${colorClass} mb-2`}>
                  {project.category}
                </span>
                <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>
              </div>
              {project.link && (
                <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
              )}
            </div>

            {project.description && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                {project.description}
              </p>
            )}

            {project.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.tags.slice(0, 4).map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-muted/60 text-xs font-medium text-muted-foreground">
                    {tag}
                  </span>
                ))}
                {project.tags.length > 4 && (
                  <span className="px-2.5 py-1 rounded-lg bg-muted/60 text-xs font-medium text-muted-foreground">
                    +{project.tags.length - 4}
                  </span>
                )}
              </div>
            )}

            {project.status && project.status !== 'Completed' && (
              <div className="mt-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span className={`w-2 h-2 rounded-full ${project.status === 'In Progress' ? 'bg-yellow-400' : 'bg-gray-400'}`} />
                {project.status}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}