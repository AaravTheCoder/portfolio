import { useEffect, useRef } from 'react';

const COUNT = 800;
// Same palette as the 3D scene but slightly darkened for white background
const COLORS = ['#6d28d9', '#0369a1', '#047857', '#b45309'];

export default function FallingParticles({ sceneRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const s = {
      particles: [],
      scrollVel: 0,
      lastScroll: window.scrollY,
      opacity: 0,
      active: false,
      wasActive: false,
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnParticles = () => {
      s.particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * window.innerWidth,
        y: -Math.random() * window.innerHeight * 1.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: Math.random() * 0.8 + 0.4,
        r: Math.random() * 1.3 + 0.6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.35 + 0.2,
        mass: Math.random() * 0.5 + 0.75,
      }));
    };
    spawnParticles();

    const onScroll = () => {
      const dy = window.scrollY - s.lastScroll;
      s.scrollVel += dy * 0.1;
      s.lastScroll = window.scrollY;

      if (!sceneRef.current) return;
      const el = sceneRef.current;
      const sceneTop = el.offsetTop;
      const sceneHeight = el.offsetHeight;
      const newActive = window.scrollY >= sceneTop + sceneHeight * 0.88;

      // Reset particles when transitioning from inactive → active
      if (newActive && !s.wasActive) spawnParticles();
      s.wasActive = newActive;
      s.active = newActive;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let raf;
    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const targetOpacity = s.active ? 1 : 0;
      s.opacity += (targetOpacity - s.opacity) * 0.04;
      s.scrollVel *= 0.88;

      if (s.opacity > 0.005) {
        for (const p of s.particles) {
          const scrollBoost = Math.max(0, s.scrollVel) * 0.018 * p.mass;
          p.vy += 0.03 * p.mass + scrollBoost;
          p.vy = Math.min(p.vy, 7);
          p.vx *= 0.996;
          p.vy *= 0.987;
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < p.r) { p.x = p.r; p.vx = Math.abs(p.vx) * 0.4; }
          if (p.x > W - p.r) { p.x = W - p.r; p.vx = -Math.abs(p.vx) * 0.4; }

          if (p.y > H - p.r) {
            p.y = H - p.r;
            p.vy *= -0.06;
            p.vx *= 0.93;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * s.opacity;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}
    />
  );
}
