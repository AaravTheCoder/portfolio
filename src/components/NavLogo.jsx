import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Ico() {
  const mesh = useRef(null);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = clock.elapsedTime * 0.7;
    mesh.current.rotation.y = clock.elapsedTime * 1.1;
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#3b82f6" wireframe />
    </mesh>
  );
}

export default function NavLogo() {
  return (
    <div style={{ width: 32, height: 32, flexShrink: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Ico />
      </Canvas>
    </div>
  );
}
