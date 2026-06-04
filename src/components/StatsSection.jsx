import ScrollReveal from './ScrollReveal';

export default function StatsSection({ projects }) {
  const stats = [
    { label: 'Total Projects', value: projects.length },
    { label: 'Programming', value: projects.filter(p => p.category === 'Programming').length },
    { label: 'Engineering', value: projects.filter(p => p.category === 'Engineering').length },
    { label: 'AI Projects', value: projects.filter(p => p.category === 'AI').length },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {stats.map((stat, i) => (
        <ScrollReveal key={stat.label} delay={i * 0.1}>
          <div className="glass-strong rounded-2xl p-6 text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">
              {stat.value}
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}