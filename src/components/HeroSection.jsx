import { db as realDb } from '@/api/base44Client'; const db = realDb;

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Github, Youtube, Mail, Instagram } from 'lucide-react';

const VERBS = ['creating', 'building', 'compiling', 'producing', 'computing', 'composing'];

function RotatingPhoto({ images }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % images.length);
        setVisible(true);
      }, 350);
    }, 3800);
    return () => clearInterval(id);
  }, [images]);

  if (!images.length) return <div className="w-full h-full" />;
  return (
    <img
      src={images[idx]}
      alt=""
      className="w-full h-full object-cover"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.35s ease' }}
    />
  );
}

function CyclingVerb() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % VERBS.length), 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="inline-block relative" style={{ minWidth: '8ch' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="inline-block font-mono"
          style={{ color: 'hsl(200 80% 60%)' }}
        >
          {VERBS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function TypewriterProjects({ projects }) {
  const [displayed, setDisplayed] = useState('');
  const [projIdx, setProjIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!projects.length) return;
    const current = projects[projIdx % projects.length].title;
    let timeout;
    if (!deleting) {
      if (charIdx < current.length) {
        timeout = setTimeout(() => {
          setDisplayed(current.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        }, 60);
      } else {
        timeout = setTimeout(() => setDeleting(true), 2200);
      }
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => {
          setDisplayed(current.slice(0, charIdx - 1));
          setCharIdx(c => c - 1);
        }, 35);
      } else {
        setDeleting(false);
        setProjIdx(i => (i + 1) % projects.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, projIdx, projects]);

  if (!projects.length) return null;

  return (
    <div className="font-mono text-sm mt-1" style={{ color: 'hsl(220 15% 65%)' }}>
      <span style={{ color: 'hsl(200 80% 60%)' }}>▸ </span>
      {displayed}
      <span
        style={{
          display: 'inline-block',
          width: '0.55em',
          height: '1.1em',
          background: 'hsl(200 80% 60%)',
          marginLeft: '3px',
          verticalAlign: 'text-bottom',
          borderRadius: '1px',
          animation: 'blink 1s step-end infinite',
          opacity: 0.85,
        }}
      />
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}

const HERO_BG = '/back.png';

const socialLinks = [
  { Icon: Instagram, href: 'https://www.instagram.com/ak041610/' },
  { Icon: Github, href: 'https://github.com/AaravTheCoder' },
  { Icon: Youtube, href: 'https://www.youtube.com/@theamazingcoderaarav2156' },
  { Icon: Mail, href: 'mailto:kalaaarav@gmail.com' },
];

export default function HeroSection() {
  const [inProgress, setInProgress] = useState([]);
  const [pastHero, setPastHero] = useState(false);
  const [photoDecks, setPhotoDecks] = useState([[], [], [], []]);

  useEffect(() => {
    db.entities.Project.list('display_order', 100).then(data => {
      setInProgress(data.filter(p => p.status === 'In Progress'));

      // Collect first + second image from every project
      const projectImgs = [];
      data.forEach(p => {
        const imgs = Array.isArray(p.images) ? p.images : [];
        if (imgs[0]) projectImgs.push(imgs[0]);
        if (imgs[1]) projectImgs.push(imgs[1]);
      });

      // Pool: personal photo first, then project images
      const pool = ['/photo1.jpg', ...projectImgs];

      // Split into 4 non-overlapping decks so no two cards ever show the same image
      const decks = [[], [], [], []];
      pool.forEach((img, i) => decks[i % 4].push(img));
      setPhotoDecks(decks);
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.65);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      </div>

      {/* Angled photo cards — left side */}
      <div className="absolute left-[14%] xl:left-[16%] top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 pointer-events-none z-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ rotate: '-7deg' }}
          className="w-52 xl:w-60 h-64 xl:h-72 rounded-2xl border border-border shadow-xl overflow-hidden"
        >
          <RotatingPhoto images={photoDecks[0]} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ rotate: '5deg' }}
          className="w-52 xl:w-60 h-52 xl:h-60 rounded-2xl border border-border shadow-xl overflow-hidden ml-10"
        >
          <RotatingPhoto images={photoDecks[1]} />
        </motion.div>
      </div>

      {/* Angled photo cards — right side */}
      <div className="absolute right-[14%] xl:right-[16%] top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 pointer-events-none z-10">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ rotate: '7deg' }}
          className="w-52 xl:w-60 h-64 xl:h-72 rounded-2xl border border-border shadow-xl overflow-hidden"
        >
          <RotatingPhoto images={photoDecks[2]} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ rotate: '-4deg' }}
          className="w-52 xl:w-60 h-52 xl:h-60 rounded-2xl border border-border shadow-xl overflow-hidden mr-10"
        >
          <RotatingPhoto images={photoDecks[3]} />
        </motion.div>
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
        
        <motion.div
          animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/20 blur-3xl" />
        
        <motion.div
          animate={{ y: [10, -30, 10] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full bg-chart-5/15 blur-3xl" />
        
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="glass inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 text-sm font-medium text-muted-foreground">
            
            <span className="w-2 h-2 rounded-full bg-green-400 animate-glow" />
            Open to opportunities
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6">
          
          <motion.span
            animate={{ opacity: pastHero ? 0 : 1, y: pastHero ? -24 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent"
          >Aarav Kala's</motion.span>
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-chart-5 bg-clip-text text-transparent">Portfolio

          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="glass inline-flex flex-col items-start px-5 py-3 rounded-2xl mb-8 text-sm"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            Currently <CyclingVerb />
          </div>
          <TypewriterProjects projects={inProgress} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          
          A showcase of projects spanning programming, engineering, AI, and beyond.
          Each one crafted with curiosity and passion.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex items-center justify-center gap-4">
          
          <a href="#projects" className="glass-strong px-8 py-3 rounded-2xl font-semibold text-sm hover:scale-105 transition-transform duration-300 flex items-center gap-2">
            Explore Projects
            <ArrowDown className="w-4 h-4" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex items-center justify-center gap-3 mt-10">
          
          {socialLinks.map(({ Icon, href }, i) =>
          <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="glass w-10 h-10 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 text-muted-foreground hover:text-foreground">
              <Icon className="w-4 h-4" />
            </a>
          )}
        </motion.div>
      </div>

    </section>);

}