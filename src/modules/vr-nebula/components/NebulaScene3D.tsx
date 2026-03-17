/**
 * Nebula 3D Scene — Upgraded with unified visual direction
 * Enhanced: more enveloping aurora, deeper atmosphere, volumetric depth
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ImmersiveCanvas } from '@/components/3d/ImmersiveCanvas';
import { ImmersivePostProcessing } from '@/components/3d/ImmersivePostProcessing';
import { CosmicParticleField } from '@/components/3d/CosmicParticleField';
import { InteractiveParticles } from '@/components/3d/InteractiveParticles';
import {
  PALETTE,
  FOG,
  POST_PROCESSING,
  MOTION,
  getParticleCount,
} from '@/components/3d/visualDirection';
import type { NebulaScene } from '../types';

/* ── Scene palettes ──────────────────────────────────────────── */

const PALETTES: Record<string, { primary: string; secondary: string; accent: string; fog: string }> = {
  cosmos: { primary: PALETTE.primary, secondary: '#6366f1', accent: PALETTE.accent, fog: PALETTE.nebulaDark },
  aurora: { primary: '#34d399', secondary: '#06b6d4', accent: '#a7f3d0', fog: PALETTE.auroraBase },
  galaxy: { primary: '#6cb4ee', secondary: PALETTE.warm, accent: PALETTE.gold, fog: PALETTE.deepSpace },
  ocean:  { primary: '#0ea5e9', secondary: PALETTE.secondary, accent: '#67e8f9', fog: PALETTE.oceanDeep },
};

/* ── Aurora ribbons — enhanced with multi-octave wave motion ── */

const RIBBON_COUNT = 6;

const AuroraRibbon = ({ index, color, secondaryColor }: { index: number; color: string; secondaryColor: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  const geoRef = useRef<THREE.PlaneGeometry>(null);

  const basePositions = useMemo(() => {
    const geo = new THREE.PlaneGeometry(14, 2, 100, 8);
    return new Float32Array(geo.attributes.position.array);
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current || !geoRef.current) return;
    const t = clock.elapsedTime;
    const posAttr = geoRef.current.attributes.position as THREE.BufferAttribute;
    const count = posAttr.count;

    for (let i = 0; i < count; i++) {
      const x = basePositions[i * 3];
      const baseY = basePositions[i * 3 + 1];
      // Multi-octave wave for organic undulation
      const wave1 = Math.sin(x * 0.35 + t * 0.25 + index * 1.2) * 1.0;
      const wave2 = Math.sin(x * 0.6 + t * 0.4 + index * 0.8) * 0.5;
      const wave3 = Math.cos(x * 0.15 + t * 0.12) * 0.4;
      const wave4 = Math.sin(x * 1.2 + t * 0.6 + index) * 0.15; // High-frequency detail
      posAttr.setY(i, baseY + wave1 + wave2 + wave3 + wave4);
    }
    posAttr.needsUpdate = true;

    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.opacity = 0.1 + Math.sin(t * 0.35 + index) * 0.04;
    mat.emissiveIntensity = 0.9 + Math.sin(t * 0.5 + index * 0.7) * 0.3;
  });

  const yOffset = (index - RIBBON_COUNT / 2) * 0.5;

  return (
    <mesh ref={ref} position={[0, 2 + yOffset, -3 - index * 0.4]} rotation={[-0.25, 0, 0]}>
      <planeGeometry ref={geoRef} args={[14, 2, 100, 8]} />
      <meshStandardMaterial
        color={index % 2 === 0 ? color : secondaryColor}
        emissive={index % 2 === 0 ? color : secondaryColor}
        emissiveIntensity={0.9}
        transparent
        opacity={0.12}
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

/* ── Nebula cloud layers — volumetric depth ──────────────────── */

const NebulaCloudLayer = ({ palette }: { palette: typeof PALETTES.cosmos }) => {
  const clouds = useMemo(() => {
    const items: { position: [number, number, number]; color: string; scale: number; idx: number }[] = [];
    const colors = [palette.primary, palette.secondary, palette.accent];
    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 2 + Math.random() * 5;
      items.push({
        position: [Math.cos(angle) * dist, (Math.random() - 0.5) * 3 - 1, Math.sin(angle) * dist - 4],
        color: colors[i % colors.length],
        scale: 2 + Math.random() * 4,
        idx: i,
      });
    }
    return items;
  }, [palette]);

  return (
    <>
      {clouds.map((cloud) => (
        <NebulaCloudMesh key={cloud.idx} {...cloud} />
      ))}
    </>
  );
};

const NebulaCloudMesh = ({ position, color, scale, idx }: {
  position: [number, number, number];
  color: string;
  scale: number;
  idx: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.rotation.z = t * 0.01 + idx * 0.5;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.04 + Math.sin(t * 0.25 + idx * 0.6) * 0.02;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.05}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

/* ── Breathing pulse sphere — improved material ──────────────── */

const NebulaBreathingSphere = ({ palette, breathProgress }: { palette: typeof PALETTES.cosmos; breathProgress: number }) => {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const scale = 0.8 + breathProgress * 0.6;

    if (outerRef.current) {
      outerRef.current.scale.setScalar(scale);
      outerRef.current.rotation.y = t * 0.08;
      outerRef.current.rotation.x = Math.sin(t * 0.15) * 0.1;
      const mat = outerRef.current.material as THREE.MeshPhysicalMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(t * 1.2) * 0.2;
    }
    if (innerRef.current) {
      innerRef.current.scale.setScalar(scale * 0.5);
      innerRef.current.rotation.y = -t * 0.12;
      const mat = innerRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.5 + Math.sin(t * 1.8) * 0.5;
    }
    // Halo glow that expands with breath
    if (haloRef.current) {
      haloRef.current.scale.setScalar(scale * 2.2);
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.03 + breathProgress * 0.02 + Math.sin(t * 0.5) * 0.01;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Atmospheric halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color={palette.primary}
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Outer translucent sphere */}
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
      {/* Inner bright core */}
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
  const l3 = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (l1.current) {
      l1.current.position.set(Math.sin(t * 0.18) * 5, 3, Math.cos(t * 0.18) * 5);
      l1.current.intensity = 2.2 + Math.sin(t * 0.6) * 0.4;
    }
    if (l2.current) {
      l2.current.position.set(Math.cos(t * 0.12) * -4, -2, Math.sin(t * 0.12) * 4);
      l2.current.intensity = 1.6 + Math.cos(t * 0.5) * 0.3;
    }
    if (l3.current) {
      // Enveloping fill light from below
      l3.current.intensity = 0.6 + Math.sin(t * 0.3) * 0.15;
    }
  });

  return (
    <>
      <pointLight ref={l1} color={palette.primary} intensity={2.2} distance={22} />
      <pointLight ref={l2} color={palette.secondary} intensity={1.6} distance={20} />
      <pointLight ref={l3} position={[0, -3, -3]} color={palette.accent} intensity={0.6} distance={15} />
    </>
  );
};

/* ── Cinematic breathing camera ──────────────────────────────── */

const NebulaCamera = ({ breathProgress }: { breathProgress: number }) => {
  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime;
    // Gentle depth shift with breathing
    camera.position.z = 5 + breathProgress * 0.3 + Math.sin(t * 0.25) * 0.1;
    camera.position.y = Math.sin(t * 0.18) * 0.2;
    camera.position.x = Math.cos(t * 0.12) * 0.15;
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
  const fog = FOG.nebula;
  const pp = POST_PROCESSING.nebula;
  const particleCount = getParticleCount('nebula');
  const interactiveCount = getParticleCount('interactive');

  return (
    <ImmersiveCanvas
      height={height}
      fogColor={palette.fog}
      fogNear={fog.near}
      fogFar={fog.far}
      className={className}
    >
      <NebulaLights palette={palette} />

      {/* Deep enveloping starfield */}
      <Stars radius={90} depth={70} count={2000} factor={3} saturation={0.4} fade speed={0.3} />

      {/* Volumetric nebula cloud layers */}
      <NebulaCloudLayer palette={palette} />

      {/* Aurora borealis ribbons */}
      <AuroraBorealis palette={palette} />

      {/* Central breathing sphere */}
      <NebulaBreathingSphere palette={palette} breathProgress={normalizedBreath} />

      {/* Cosmic particle field with breathing reactivity */}
      <CosmicParticleField
        count={particleCount}
        radius={7}
        color={palette.accent}
        size={0.04}
        breathFactor={1 + normalizedBreath * 0.4}
      />

      {/* Interactive cursor particles */}
      <InteractiveParticles count={interactiveCount} radius={5} color={palette.primary} repelStrength={0.7} repelRadius={1.5} />

      {/* Cinematic camera */}
      <NebulaCamera breathProgress={normalizedBreath} />

      {/* Post-processing */}
      <ImmersivePostProcessing
        bloomIntensity={pp.bloomIntensity}
        bloomThreshold={pp.bloomThreshold}
        bloomRadius={pp.bloomRadius}
        vignetteOffset={pp.vignetteOffset}
        vignetteDarkness={pp.vignetteDarkness}
        chromaticAberration={pp.chromaticAberration}
        chromaticOffset={pp.chromaticOffset}
      />
    </ImmersiveCanvas>
  );
};
