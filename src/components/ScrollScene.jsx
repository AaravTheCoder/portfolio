import { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';

// ── Particle formations ───────────────────────────────────────────
const COUNT = 2800;

function mkScatter() {
  const a = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 3 + Math.random() * 7.5;
    a[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    a[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.65;
    a[i * 3 + 2] = r * Math.cos(phi) * 0.8;
  }
  return a;
}

function mkNeuralSphere() {
  const a = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const u = (i / COUNT) * Math.PI * (3 - Math.sqrt(5));
    const y = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const R = 5.8 + (Math.random() - 0.5) * 0.9;
    a[i * 3] = Math.cos(u) * r * R;
    a[i * 3 + 1] = y * R;
    a[i * 3 + 2] = Math.sin(u) * r * R;
  }
  return a;
}

function mkGalaxy() {
  const a = new Float32Array(COUNT * 3);
  const ARMS = 3;
  for (let i = 0; i < COUNT; i++) {
    const arm = i % ARMS;
    const t = Math.pow(Math.random(), 0.55);
    const angle = t * Math.PI * 5 + (arm / ARMS) * Math.PI * 2;
    const rr = t * 7.5 + (Math.random() - 0.5) * 0.9;
    a[i * 3] = rr * Math.cos(angle);
    a[i * 3 + 1] = (Math.random() - 0.5) * 1.4;
    a[i * 3 + 2] = rr * Math.sin(angle);
  }
  return a;
}

function mkGrid() {
  const a = new Float32Array(COUNT * 3);
  const SIDE = Math.round(Math.cbrt(COUNT));
  for (let i = 0; i < COUNT; i++) {
    const xi = i % SIDE;
    const yi = Math.floor(i / SIDE) % SIDE;
    const zi = Math.floor(i / (SIDE * SIDE));
    a[i * 3] = (xi / (SIDE - 1) - 0.5) * 12;
    a[i * 3 + 1] = (yi / (SIDE - 1) - 0.5) * 12;
    a[i * 3 + 2] = (zi / (SIDE - 1) - 0.5) * 12;
  }
  return a;
}

const SCENE_COLORS = [
  new THREE.Color('#7c3aed'),
  new THREE.Color('#0ea5e9'),
  new THREE.Color('#34d399'),
  new THREE.Color('#f59e0b'),
];

function smoothstep(t) { return t * t * (3 - 2 * t); }

// ── Decorative rings ──────────────────────────────────────────────
function Rings({ scroll }) {
  const r1 = useRef(null);
  const r2 = useRef(null);
  const r3 = useRef(null);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const p = scroll.current;
    if (r1.current) { r1.current.rotation.x = t * 0.14; r1.current.rotation.z = t * 0.07; }
    if (r2.current) { r2.current.rotation.y = t * 0.18; r2.current.rotation.z = t * 0.04; }
    if (r3.current) { r3.current.rotation.x = t * 0.05; r3.current.rotation.y = t * 0.22; }
    const phF = p * 3;
    const phI = Math.min(Math.floor(phF), 2);
    const phT = smoothstep(phF - phI);
    tmp.copy(SCENE_COLORS[phI]).lerp(SCENE_COLORS[phI + 1], phT);
    for (const r of [r1, r2, r3]) {
      if (r.current) r.current.material.color.copy(tmp);
    }
  });

  return (
    <>
      <mesh ref={r1}>
        <torusGeometry args={[4.8, 0.018, 6, 100]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={r2}>
        <torusGeometry args={[6.4, 0.012, 6, 120]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={r3}>
        <torusGeometry args={[3.1, 0.025, 6, 80]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  );
}

// ── Wireframe core shape ──────────────────────────────────────────
function CoreShape({ scroll }) {
  const mesh = useRef(null);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const p = scroll.current;
    if (mesh.current) {
      mesh.current.rotation.x = t * 0.09;
      mesh.current.rotation.y = t * 0.13;
      mesh.current.scale.setScalar(1 + Math.sin(t * 0.6) * 0.08);
      const phF = p * 3;
      const phI = Math.min(Math.floor(phF), 2);
      const phT = smoothstep(phF - phI);
      tmp.copy(SCENE_COLORS[phI]).lerp(SCENE_COLORS[phI + 1], phT);
      mesh.current.material.color.copy(tmp);
    }
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[2.6, 1]} />
      <meshBasicMaterial color="#7c3aed" wireframe transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

// ── Main particle cloud ───────────────────────────────────────────
function ParticleCloud({ scroll }) {
  const pts = useRef(null);
  const formations = useMemo(() => [mkScatter(), mkNeuralSphere(), mkGalaxy(), mkGrid()], []);
  const buf = useMemo(() => new Float32Array(COUNT * 3), []);
  const tmpC = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    const p = scroll.current;
    const raw = p * 3;
    const fromI = Math.min(Math.floor(raw), 3);
    const toI = Math.min(fromI + 1, 3);
    const lt = smoothstep(raw - fromI);
    const from = formations[fromI];
    const to = formations[toI];
    const pos = pts.current.geometry.attributes.position.array;
    for (let i = 0; i < COUNT * 3; i++) {
      pos[i] = from[i] + (to[i] - from[i]) * lt;
    }
    pts.current.geometry.attributes.position.needsUpdate = true;
    tmpC.copy(SCENE_COLORS[fromI]).lerp(SCENE_COLORS[toI], lt);
    pts.current.material.color.copy(tmpC);
    camera.position.x = Math.sin(t * 0.11) * 2.8;
    camera.position.y = Math.cos(t * 0.08) * 1.4;
    camera.position.z = THREE.MathUtils.lerp(15, 7, p) + Math.sin(t * 0.06) * 0.6;
    camera.lookAt(0, 0, 0);
  });

  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[buf, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#7c3aed" transparent opacity={0.85} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// ── Canvas scene ──────────────────────────────────────────────────
function Scene({ scroll }) {
  return (
    <>
      <ambientLight intensity={0.05} />
      <ParticleCloud scroll={scroll} />
      <Rings scroll={scroll} />
      <CoreShape scroll={scroll} />
    </>
  );
}

// ── Chapter headings ──────────────────────────────────────────────
const CHAPTERS = [
  { color: 'hsl(250 70% 65%)', tag: 'Deep Learning',    title: 'Neural networks. Real predictions.' },
  { color: 'hsl(200 80% 60%)', tag: 'Data Science',     title: 'Metrics that actually matter.'      },
  { color: 'hsl(160 65% 55%)', tag: 'Computer Science', title: 'Algorithms built to last.'           },
  { color: 'hsl(45 95% 60%)',  tag: 'Engineering',      title: 'Production-grade systems.'           },
];

function ChapterHeadings({ scrollYProgress }) {
  const windows = [
    [0.06, 0.16, 0.24, 0.32],
    [0.32, 0.42, 0.52, 0.60],
    [0.60, 0.68, 0.77, 0.84],
    [0.84, 0.91, 0.96, 1.00],
  ];

  return (
    <div className="absolute bottom-[9%] left-0 right-0 z-20 pointer-events-none">
      {CHAPTERS.map((ch, i) => {
        const [s0, s1, e0, e1] = windows[i];
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const op = useTransform(scrollYProgress, [s0, s1, e0, e1], [0, 1, 1, 0]);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const y = useTransform(scrollYProgress, [s0, s1, e0, e1], [28, 0, 0, -28]);
        return (
          <motion.div
            key={i}
            style={{ opacity: op, y }}
            className="absolute inset-x-0 flex flex-col items-center text-center px-6"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-2" style={{ color: ch.color }}>
              {ch.tag}
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {ch.title}
            </h2>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Progress dots ─────────────────────────────────────────────────
function ProgressDots({ scrollYProgress }) {
  const ranges = [
    [0.06, 0.14, 0.26, 0.33],
    [0.32, 0.40, 0.53, 0.60],
    [0.60, 0.67, 0.77, 0.84],
    [0.84, 0.91, 0.96, 1.00],
  ];
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
      {ranges.map((r, i) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const op = useTransform(scrollYProgress, r, [0.2, 1, 1, 0.2]);
        return <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-white" style={{ opacity: op }} />;
      })}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────
export default function ScrollScene() {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef(0);
  useEffect(() => { setMounted(true); }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    return scrollYProgress.on('change', (v) => { scrollRef.current = v; });
  }, [scrollYProgress]);

  const scOp = useTransform(scrollYProgress, [0, 0.04, 0.95, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} style={{ height: '600vh', position: 'relative' }}>
      <motion.div
        className="sticky top-0 overflow-hidden"
        style={{ height: '100svh', opacity: scOp }}
      >
        {/* Scroll progress bar */}
        <motion.div
          className="absolute top-0 left-0 z-40 h-[2px] w-full pointer-events-none"
          style={{
            scaleX: scrollYProgress,
            originX: 0,
            background: 'linear-gradient(to right,hsl(250 70% 65%),hsl(200 80% 60%),hsl(330 70% 65%))',
          }}
        />

        {/* Edge fades — match the dark background injected by the parent */}
        <div className="absolute inset-x-0 top-0 z-30 pointer-events-none" style={{ height: 100, background: 'linear-gradient(to bottom,hsl(225 25% 6%),transparent)' }} />
        <div className="absolute inset-x-0 bottom-0 z-30 pointer-events-none" style={{ height: 100, background: 'linear-gradient(to top,hsl(225 25% 6%),transparent)' }} />

        {/* 3-D canvas */}
        {mounted && (
          <Canvas
            camera={{ position: [0, 0, 15], fov: 65 }}
            gl={{ antialias: true, alpha: true }}
            style={{ position: 'absolute', inset: 0, background: 'transparent' }}
            dpr={[1, 1.5]}
          >
            <Suspense fallback={null}>
              <Scene scroll={scrollRef} />
            </Suspense>
          </Canvas>
        )}

        {/* HTML overlays */}
        <ChapterHeadings scrollYProgress={scrollYProgress} />
        <ProgressDots scrollYProgress={scrollYProgress} />
      </motion.div>
    </div>
  );
}
