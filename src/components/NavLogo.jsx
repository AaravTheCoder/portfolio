import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function Tetra() {
  const mesh = useRef(null);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.elapsedTime;
    // Smooth tumble: slow primary spin + gentle wobble on second axis
    mesh.current.rotation.y = t * 0.6;
    mesh.current.rotation.x = Math.sin(t * 0.4) * 0.5;
    mesh.current.rotation.z = Math.cos(t * 0.25) * 0.3;
  });

  return (
    <mesh ref={mesh}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#3b82f6" wireframe />
    </mesh>
  );
}

export default function NavLogo() {
  return (
    <div style={{ width: 32, height: 32, flexShrink: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 2.6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Tetra />
      </Canvas>
    </div>
  );
}
