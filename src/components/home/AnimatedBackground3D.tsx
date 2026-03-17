/**
 * Hero 3D immersif pour la page d'accueil
 * Champ de particules interactif + bloom subtil
 */

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { InteractiveParticles } from '@/components/3d/InteractiveParticles';
import { ImmersivePostProcessing } from '@/components/3d/ImmersivePostProcessing';

/* ── Ambient floating orbs (large, soft, slow) ───────────────── */

const FloatingOrb = ({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.3 + scale) * 0.4;
    ref.current.position.x = position[0] + Math.cos(t * 0.2 + scale * 2) * 0.3;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.6 + Math.sin(t * 0.8 + scale) * 0.3;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        transparent
        opacity={0.15}
        roughness={0.3}
      />
    </mesh>
  );
};

const AmbientOrbs = () => {
  const orbs = useMemo(() => [
    { position: [-3, 1, -2] as [number, number, number], color: '#7c3aed', scale: 0.8 },
    { position: [3, -1, -3] as [number, number, number], color: '#3b82f6', scale: 1.1 },
    { position: [-1, 2, -4] as [number, number, number], color: '#ec4899', scale: 0.6 },
    { position: [2, -2, -1] as [number, number, number], color: '#6366f1', scale: 0.9 },
    { position: [0, 0, -5] as [number, number, number], color: '#a78bfa', scale: 1.4 },
  ], []);

  return (
    <>
      {orbs.map((orb, i) => (
        <FloatingOrb key={i} {...orb} />
      ))}
    </>
  );
};

/* ── Gentle camera sway ──────────────────────────────────────── */

const SwayCamera = () => {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.1) * 0.3;
    state.camera.position.y = Math.cos(t * 0.08) * 0.2;
  });
  return null;
};

/* ── Exported component ──────────────────────────────────────── */

const AnimatedBackground3D = () => (
  <div className="absolute inset-0 -z-10">
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      style={{ background: 'transparent' }}
      dpr={[1, 1.5]}
    >
      <fog attach="fog" args={['#0a0a1a', 4, 16]} />
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} color="#7c3aed" intensity={1.5} distance={20} />
      <pointLight position={[-4, -3, 3]} color="#3b82f6" intensity={1} distance={18} />

      <InteractiveParticles count={150} radius={6} color="#a78bfa" repelStrength={0.6} repelRadius={1.5} />
      <AmbientOrbs />
      <SwayCamera />

      <ImmersivePostProcessing
        bloomIntensity={1}
        bloomThreshold={0.25}
        bloomRadius={0.7}
        vignetteDarkness={0.5}
        chromaticAberration={false}
      />
    </Canvas>
  </div>
);

export default AnimatedBackground3D;
