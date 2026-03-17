/**
 * Scène 3D immersive — Nébuleuse avec aurore boréale
 * 4 environnements : cosmos, aurora, galaxy, ocean
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ImmersiveCanvas } from '@/components/3d/ImmersiveCanvas';
import { ImmersivePostProcessing } from '@/components/3d/ImmersivePostProcessing';
import { CosmicParticleField } from '@/components/3d/CosmicParticleField';
import type { NebulaScene } from '../types';

/* ── Scene palettes ──────────────────────────────────────────── */

const PALETTES: Record<string, { primary: string; secondary: string; accent: string; fog: string }> = {
  cosmos: { primary: '#7c3aed', secondary: '#6366f1', accent: '#a78bfa', fog: '#0a0818' },
  aurora: { primary: '#34d399', secondary: '#06b6d4', accent: '#a7f3d0', fog: '#0a1810' },
  galaxy: { primary: '#6cb4ee', secondary: '#ec4899', accent: '#fde68a', fog: '#050510' },
  ocean: { primary: '#0ea5e9', secondary: '#3b82f6', accent: '#67e8f9', fog: '#050d18' },
};

/* ── Aurora ribbons (vertex-displaced planes) ────────────────── */

const RIBBON_COUNT = 5;

const AuroraRibbon = ({ index, color, secondaryColor }: { index: number; color: string; secondaryColor: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  const geoRef = useRef<THREE.PlaneGeometry>(null);

  const basePositions = useMemo(() => {
    const geo = new THREE.PlaneGeometry(12, 1.5, 80, 6);
    return new Float32Array(geo.attributes.position.array);
  }, []);

  useFrame((state) => {
    if (!ref.current || !geoRef.current) return;
    const t = state.clock.elapsedTime;
    const posAttr = geoRef.current.attributes.position as THREE.BufferAttribute;
    const count = posAttr.count;

    for (let i = 0; i < count; i++) {
      const x = basePositions[i * 3];
      const baseY = basePositions[i * 3 + 1];
      const wave1 = Math.sin(x * 0.4 + t * 0.3 + index * 1.2) * 0.8;
      const wave2 = Math.sin(x * 0.7 + t * 0.5 + index * 0.8) * 0.4;
      const wave3 = Math.cos(x * 0.2 + t * 0.15) * 0.3;
      posAttr.setY(i, baseY + wave1 + wave2 + wave3);
    }
    posAttr.needsUpdate = true;

    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.opacity = 0.12 + Math.sin(t * 0.4 + index) * 0.05;
  });

  const yOffset = (index - RIBBON_COUNT / 2) * 0.6;

  return (
    <mesh ref={ref} position={[0, 2 + yOffset, -3 - index * 0.5]} rotation={[-0.3, 0, 0]}>
      <planeGeometry ref={geoRef} args={[12, 1.5, 80, 6]} />
      <meshStandardMaterial
        color={index % 2 === 0 ? color : secondaryColor}
        emissive={index % 2 === 0 ? color : secondaryColor}
        emissiveIntensity={0.8}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

const AuroraBorealis = ({ palette }: { palette: typeof PALETTES.cosmos }) => (
  <>
    {Array.from({ length: RIBBON_COUNT }, (_, i) => (
      <AuroraRibbon key={i} index={i} color={palette.primary} secondaryColor={palette.secondary} />
    ))}
  </>
);

/* ── Breathing pulse sphere ──────────────────────────────────── */

const NebulaBreathingSphere = ({ palette, breathProgress }: { palette: typeof PALETTES.cosmos; breathProgress: number }) => {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const scale = 0.8 + breathProgress * 0.6;

    if (outerRef.current) {
      outerRef.current.scale.setScalar(scale);
      outerRef.current.rotation.y = t * 0.1;
      outerRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
      const mat = outerRef.current.material as THREE.MeshPhysicalMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(t * 1.5) * 0.2;
    }
    if (innerRef.current) {
      innerRef.current.scale.setScalar(scale * 0.5);
      innerRef.current.rotation.y = -t * 0.15;
      const mat = innerRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.5 + Math.sin(t * 2) * 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={outerRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color={palette.primary}
          emissive={palette.primary}
          emissiveIntensity={0.5}
          transparent
          opacity={0.25}
          roughness={0.1}
          transmission={0.5}
          thickness={0.4}
          clearcoat={1}
        />
      </mesh>
      <mesh ref={innerRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={palette.accent}
          emissive={palette.accent}
          emissiveIntensity={1.5}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};

/* ── Dynamic lights ──────────────────────────────────────────── */

const NebulaLights = ({ palette }: { palette: typeof PALETTES.cosmos }) => {
  const l1 = useRef<THREE.PointLight>(null);
  const l2 = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (l1.current) {
      l1.current.position.set(Math.sin(t * 0.2) * 5, 3, Math.cos(t * 0.2) * 5);
      l1.current.intensity = 2 + Math.sin(t * 0.8) * 0.5;
    }
    if (l2.current) {
      l2.current.position.set(Math.cos(t * 0.15) * -4, -2, Math.sin(t * 0.15) * 4);
      l2.current.intensity = 1.5 + Math.cos(t * 0.6) * 0.3;
    }
  });

  return (
    <>
      <pointLight ref={l1} color={palette.primary} intensity={2} distance={20} />
      <pointLight ref={l2} color={palette.secondary} intensity={1.5} distance={18} />
    </>
  );
};

/* ── Breathing camera ────────────────────────────────────────── */

const NebulaCamera = ({ breathProgress }: { breathProgress: number }) => {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.z = 5 + breathProgress * 0.3 + Math.sin(t * 0.3) * 0.1;
    state.camera.position.y = Math.sin(t * 0.2) * 0.2;
    state.camera.position.x = Math.cos(t * 0.15) * 0.15;
  });
  return null;
};

/* ── Exported component ──────────────────────────────────────── */

interface NebulaScene3DProps {
  scene?: NebulaScene;
  breathProgress?: number;
  height?: string;
  className?: string;
}

export const NebulaScene3D = ({
  scene = 'cosmos',
  breathProgress = 0,
  height = 'h-[500px]',
  className,
}: NebulaScene3DProps) => {
  const palette = PALETTES[scene] || PALETTES.cosmos;
  const normalizedBreath = breathProgress / 100;

  return (
    <ImmersiveCanvas
      height={height}
      fogColor={palette.fog}
      fogNear={5}
      fogFar={20}
      className={className}
    >
      <NebulaLights palette={palette} />
      <Stars radius={80} depth={60} count={1800} factor={3} saturation={0.5} fade speed={0.4} />
      <AuroraBorealis palette={palette} />
      <NebulaBreathingSphere palette={palette} breathProgress={normalizedBreath} />
      <CosmicParticleField count={350} radius={6} color={palette.accent} size={0.04} breathFactor={1 + normalizedBreath * 0.4} />
      <NebulaCamera breathProgress={normalizedBreath} />
      <ImmersivePostProcessing bloomIntensity={1.8} bloomThreshold={0.18} bloomRadius={0.85} vignetteDarkness={0.75} />
    </ImmersiveCanvas>
  );
};
