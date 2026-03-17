/**
 * Scène 3D immersive — Galaxie spirale avec 5000 particules
 * Bras de Fibonacci, nébuleuses volumétriques, fly-through camera
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ImmersiveCanvas } from '@/components/3d/ImmersiveCanvas';
import { ImmersivePostProcessing } from '@/components/3d/ImmersivePostProcessing';
import { CosmicParticleField } from '@/components/3d/CosmicParticleField';

/* ── Spiral galaxy core ─────────────────────────────────────── */

const ARMS = 4;
const STAR_COUNT = 5000;
const NEBULA_COUNT = 60;

const SpiralGalaxy = () => {
  const starsRef = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const col = new Float32Array(STAR_COUNT * 3);
    const sz = new Float32Array(STAR_COUNT);

    const palette = [
      new THREE.Color('#6cb4ee'),
      new THREE.Color('#a78bfa'),
      new THREE.Color('#f9a8d4'),
      new THREE.Color('#fde68a'),
      new THREE.Color('#ffffff'),
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      const arm = i % ARMS;
      const baseAngle = (arm / ARMS) * Math.PI * 2;
      const dist = Math.pow(Math.random(), 0.6) * 8;
      const spiralAngle = baseAngle + dist * 0.7;
      const scatter = (1 - dist / 10) * 0.8;

      pos[i * 3] = Math.cos(spiralAngle) * dist + (Math.random() - 0.5) * scatter;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3 * (1 + scatter);
      pos[i * 3 + 2] = Math.sin(spiralAngle) * dist + (Math.random() - 0.5) * scatter;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      sz[i] = Math.random() * 0.08 + 0.02;
    }
    return { positions: pos, colors: col, sizes: sz };
  }, []);

  useFrame((state) => {
    if (!starsRef.current) return;
    starsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={STAR_COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={STAR_COUNT} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

/* ── Nebula clouds (additive sprite quads) ───────────────────── */

const NebulaCloud = ({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.02;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 0.5 + scale) * 0.04;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const NebulaClouds = () => {
  const clouds = useMemo(() => {
    const c: { position: [number, number, number]; color: string; scale: number }[] = [];
    const palette = ['#7c3aed', '#3b82f6', '#ec4899', '#6366f1'];
    for (let i = 0; i < NEBULA_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 1 + Math.random() * 6;
      c.push({
        position: [
          Math.cos(angle) * dist,
          (Math.random() - 0.5) * 1.5,
          Math.sin(angle) * dist,
        ],
        color: palette[i % palette.length],
        scale: 1 + Math.random() * 3,
      });
    }
    return c;
  }, []);

  return (
    <>
      {clouds.map((cl, i) => (
        <NebulaCloud key={i} {...cl} />
      ))}
    </>
  );
};

/* ── Fly-through camera ──────────────────────────────────────── */

const FlyCamera = () => {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const r = 10 + Math.sin(t * 0.05) * 2;
    state.camera.position.x = Math.cos(t * 0.04) * r;
    state.camera.position.z = Math.sin(t * 0.04) * r;
    state.camera.position.y = 3 + Math.sin(t * 0.08) * 1.5;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

/* ── Galaxy core glow ────────────────────────────────────────── */

const GalaxyCore = () => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 2 + Math.sin(state.clock.elapsedTime * 1.2) * 0.5;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial
        color="#fde68a"
        emissive="#fbbf24"
        emissiveIntensity={2}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};

/* ── Dynamic lights ──────────────────────────────────────────── */

const GalaxyLights = () => {
  const l1 = useRef<THREE.PointLight>(null);
  const l2 = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (l1.current) {
      l1.current.position.set(Math.sin(t * 0.2) * 5, 3, Math.cos(t * 0.2) * 5);
      l1.current.intensity = 2 + Math.sin(t) * 0.5;
    }
    if (l2.current) {
      l2.current.position.set(Math.cos(t * 0.15) * -4, -2, Math.sin(t * 0.15) * 4);
    }
  });

  return (
    <>
      <pointLight ref={l1} color="#6cb4ee" intensity={2} distance={25} />
      <pointLight ref={l2} color="#a78bfa" intensity={1.5} distance={20} />
    </>
  );
};

/* ── Exported scene ──────────────────────────────────────────── */

interface GalaxyScene3DProps {
  height?: string;
  className?: string;
}

export const GalaxyScene3D = ({ height = 'h-[500px]', className }: GalaxyScene3DProps) => (
  <ImmersiveCanvas
    height={height}
    fogColor="#050510"
    fogNear={8}
    fogFar={25}
    cameraPosition={[10, 4, 10]}
    fov={55}
    className={className}
  >
    <GalaxyLights />

    <Stars radius={100} depth={80} count={2000} factor={4} saturation={0.6} fade speed={0.3} />

    <SpiralGalaxy />
    <NebulaClouds />
    <GalaxyCore />
    <CosmicParticleField count={300} radius={10} color="#a78bfa" size={0.03} speed={0.01} />

    <FlyCamera />
    <ImmersivePostProcessing bloomIntensity={2} bloomThreshold={0.15} bloomRadius={0.9} vignetteDarkness={0.8} />
  </ImmersiveCanvas>
);
