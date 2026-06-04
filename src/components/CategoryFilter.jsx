import { motion } from 'framer-motion';

const categories = ['All', 'Programming', 'Engineering', 'AI', 'Extracurricular', 'Other'];

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`relative px-5 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
            active === cat
              ? 'text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground glass'
          }`}
        >
          {active === cat && (
            <motion.div
              layoutId="category-pill"
              className="absolute inset-0 bg-primary rounded-2xl"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">{cat}</span>
        </button>
      ))}
    </div>
  );
}