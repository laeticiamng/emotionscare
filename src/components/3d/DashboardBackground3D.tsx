// @ts-nocheck
/**
 * Arrière-plan 3D subtil pour tableaux de bord
 * Formes géométriques translucides flottantes (cubes, sphères) en rotation lente
 * Conçu pour ne PAS distraire du contenu — très discret
 * Budget de particules bas selon le tier de l'appareil
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { ImmersiveCanvas } from './ImmersiveCanvas';
import { ImmersivePostProcessing } from './ImmersivePostProcessing';
import {
  PALETTE,
  MOTION,
  isTabVisible,
  prefersReducedMotion,
  getDeviceTier,
  shouldEnablePostProcessing,
  POST_PROCESSING,
} from './visualDirection';

interface DashboardBackground3DProps {
  mood?: string;
  className?: string;
}

/* ── Couleur selon l'humeur ─────────────────────────────── */
const MOOD_COLORS: Record<string, string> = {
  calm: '#34d399',
  happy: PALETTE.gold,
  sad: '#60a5fa',
  anxious: '#f97316',
  neutral: PALETTE.accent,
};

const getMoodColor = (mood?: string): string =>
  (mood && MOOD_COLORS[mood]) || PALETTE.accent;

/* ── Formes géométriques flottantes ─────────────────────── */
interface ShapeData {
  position: [number, number, number];
  type: 'cube' | 'sphere' | 'octahedron';
  size: number;
  rotSpeed: number;
}

const FloatingShapes = ({ mood }: { mood?: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  const reduced = prefersReducedMotion();
  const tier = getDeviceTier();
  const color = getMoodColor(mood);

  // Nombre de formes selon le tier — volontairement bas
  const shapeCount = tier === 'high' ? 8 : tier === 'medium' ? 5 : 3;

  // Génération déterministe des formes
  const shapes: ShapeData[] = useMemo(() => {
    const arr: ShapeData[] = [];
    const types: ('cube' | 'sphere' | 'octahedron')[] = ['cube', 'sphere', 'octahedron'];
    for (let i = 0; i < shapeCount; i++) {
      const angle = (i / shapeCount) * Math.PI * 2;
      const r = 2.5 + (i % 3) * 1.2;
      arr.push({
        position: [
          Math.cos(angle) * r,
          (i % 2 === 0 ? 1 : -1) * (0.5 + (i % 3) * 0.8),
          Math.sin(angle) * r - 3,
        ],
        type: types[i % 3],
        size: 0.15 + (i % 4) * 0.08,
        rotSpeed: 0.05 + (i % 3) * 0.03,
      });
    }
    return arr;
  }, [shapeCount]);

  useFrame((state) => {
    if (!groupRef.current || !isTabVisible()) return;
    if (!reduced) {
      groupRef.current.rotation.y = state.clock.elapsedTime * MOTION.particleRotation.slow * 0.3;
    }
  });

  /* Matériau partagé — très translucide pour rester subtil */
  const materialProps = {
    color,
    emissive: color,
    emissiveIntensity: 0.15,
    metalness: 0.3,
    roughness: 0.6,
    transparent: true,
    opacity: 0.12,
  };

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <Float
          key={i}
          speed={reduced ? 0 : 0.5 + shape.rotSpeed}
          rotationIntensity={reduced ? 0 : 0.2}
          floatIntensity={reduced ? 0 : 0.3}
        >
          <ShapeGeometry shape={shape} materialProps={materialProps} reduced={reduced} />
        </Float>
      ))}
    </group>
  );
};

/* ── Rendu de la géométrie individuelle ─────────────────── */
const ShapeGeometry = ({
  shape,
  materialProps,
  reduced,
}: {
  shape: ShapeData;
  materialProps: Record<string, unknown>;
  reduced: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || !isTabVisible() || reduced) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * shape.rotSpeed;
    meshRef.current.rotation.z = state.clock.elapsedTime * shape.rotSpeed * 0.7;
  });

  return (
    <mesh ref={meshRef} position={shape.position}>
      {shape.type === 'cube' && <boxGeometry args={[shape.size, shape.size, shape.size]} />}
      {shape.type === 'sphere' && <sphereGeometry args={[shape.size * 0.6, 16, 16]} />}
      {shape.type === 'octahedron' && <octahedronGeometry args={[shape.size * 0.7, 0]} />}
      <meshStandardMaterial {...materialProps} />
    </mesh>
  );
};

/* ── Éclairage minimal ──────────────────────────────────── */
const DashboardLighting = ({ mood }: { mood?: string }) => {
  const color = getMoodColor(mood);
  return (
    <>
      <pointLight position={[5, 5, 5]} intensity={0.3} color={color} />
      <pointLight position={[-3, -3, 3]} intensity={0.15} color={PALETTE.secondary} />
    </>
  );
};

/* ── Scène complète ─────────────────────────────────────── */
const DashboardScene = ({ mood }: { mood?: string }) => (
  <>
    <DashboardLighting mood={mood} />
    <FloatingShapes mood={mood} />
    <ImmersivePostProcessing
      {...POST_PROCESSING.hero}
      bloomIntensity={0.4}
      vignetteDarkness={0.3}
      chromaticAberration={false}
      enabled={shouldEnablePostProcessing()}
    />
  </>
);

/* ── Export par défaut (compatible React.lazy) ──────────── */
const DashboardBackground3D = ({ mood, className }: DashboardBackground3DProps) => (
  <ImmersiveCanvas
    height="h-full"
    className={className}
    scene="hero"
    fogColor={PALETTE.darkVoid}
    fogNear={4}
    fogFar={16}
    cameraPosition={[0, 0, 6]}
  >
    <DashboardScene mood={mood} />
  </ImmersiveCanvas>
);

export default DashboardBackground3D;
