// @ts-nocheck
/**
 * Environnement 3D de méditation — scène apaisante avec orbes flottants
 * Thèmes : ocean, forest, cosmos, dawn
 * Animation synchronisée avec la phase de respiration (inhale, hold, exhale)
 * Utilise CosmicParticleField pour la pluie de particules douce
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { ImmersiveCanvas } from './ImmersiveCanvas';
import { ImmersivePostProcessing } from './ImmersivePostProcessing';
import { CosmicParticleField } from './CosmicParticleField';
import {
  PALETTE,
  MOTION,
  isTabVisible,
  prefersReducedMotion,
  getDeviceTier,
  shouldEnablePostProcessing,
  POST_PROCESSING,
} from './visualDirection';

/* ── Types ──────────────────────────────────────────────── */
type Theme = 'ocean' | 'forest' | 'cosmos' | 'dawn';
type BreathPhase = 'inhale' | 'hold' | 'exhale';

interface MeditationEnvironment3DProps {
  theme?: Theme;
  breathPhase?: BreathPhase;
  className?: string;
}

/* ── Palettes par thème ─────────────────────────────────── */
const THEME_PALETTES: Record<Theme, { primary: string; secondary: string; particle: string; fog: string }> = {
  ocean:  { primary: '#0ea5e9', secondary: '#06b6d4', particle: '#67e8f9', fog: PALETTE.oceanDeep },
  forest: { primary: '#22c55e', secondary: '#34d399', particle: '#86efac', fog: PALETTE.auroraBase },
  cosmos: { primary: PALETTE.primary, secondary: PALETTE.accent, particle: '#c4b5fd', fog: PALETTE.deepSpace },
  dawn:   { primary: '#f97316', secondary: '#fbbf24', particle: '#fde68a', fog: '#0f0a05' },
};

/* ── Facteur de respiration par phase ───────────────────── */
const BREATH_FACTORS: Record<BreathPhase, { scale: number; intensity: number }> = {
  inhale: { scale: 1.25, intensity: 0.6 },
  hold:   { scale: 1.15, intensity: 0.45 },
  exhale: { scale: 0.85, intensity: 0.3 },
};

/* ── Orbes flottants de méditation ──────────────────────── */
const MeditationOrbs = ({ theme, breathPhase }: { theme: Theme; breathPhase: BreathPhase }) => {
  const groupRef = useRef<THREE.Group>(null);
  const reduced = prefersReducedMotion();
  const palette = THEME_PALETTES[theme];
  const breathTarget = BREATH_FACTORS[breathPhase];

  // Référence pour interpolation douce
  const currentScale = useRef(1);
  const currentIntensity = useRef(0.4);

  // Positions des orbes — mémorisées pour éviter les recréations
  const orbPositions = useMemo(() => [
    { pos: [0, 0, 0] as const, size: 0.6, color: palette.primary },
    { pos: [-1.8, 1.2, -0.5] as const, size: 0.25, color: palette.secondary },
    { pos: [2, -0.8, -1] as const, size: 0.2, color: palette.particle },
    { pos: [-1, -1.5, 0.5] as const, size: 0.18, color: palette.secondary },
    { pos: [1.5, 1.5, -1.5] as const, size: 0.15, color: palette.primary },
  ], [palette]);

  useFrame((state) => {
    if (!groupRef.current || !isTabVisible()) return;
    const t = state.clock.elapsedTime;

    // Interpolation douce vers la cible de respiration
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, breathTarget.scale, 0.02);
    currentIntensity.current = THREE.MathUtils.lerp(currentIntensity.current, breathTarget.intensity, 0.02);

    if (!reduced) {
      groupRef.current.rotation.y = t * MOTION.particleRotation.slow * 0.5;
      groupRef.current.scale.setScalar(currentScale.current);
    }
  });

  return (
    <group ref={groupRef}>
      {orbPositions.map((orb, i) => (
        <Float
          key={i}
          speed={reduced ? 0 : 0.8 + i * 0.3}
          rotationIntensity={0.15}
          floatIntensity={reduced ? 0 : 0.6}
        >
          <Sphere args={[orb.size, 32, 32]} position={[...orb.pos]}>
            <meshStandardMaterial
              color={orb.color}
              emissive={orb.color}
              emissiveIntensity={currentIntensity.current}
              roughness={0.3}
              metalness={0.1}
              transparent
              opacity={0.8}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
};

/* ── Éclairage ambiant doux ─────────────────────────────── */
const MeditationLighting = ({ theme }: { theme: Theme }) => {
  const palette = THEME_PALETTES[theme];
  return (
    <>
      <pointLight position={[0, 3, 3]} intensity={0.6} color={palette.primary} />
      <pointLight position={[-3, -2, 2]} intensity={0.3} color={palette.secondary} />
      <ambientLight intensity={0.15} />
    </>
  );
};

/* ── Scène complète ─────────────────────────────────────── */
const MeditationScene = ({ theme, breathPhase }: { theme: Theme; breathPhase: BreathPhase }) => {
  const tier = getDeviceTier();
  const palette = THEME_PALETTES[theme];
  const particleCount = tier === 'high' ? 250 : tier === 'medium' ? 150 : 80;
  const breathFactor = BREATH_FACTORS[breathPhase].scale;

  return (
    <>
      <MeditationLighting theme={theme} />
      <MeditationOrbs theme={theme} breathPhase={breathPhase} />
      {/* Pluie de particules douce — synchronisée avec la respiration */}
      <CosmicParticleField
        count={particleCount}
        radius={6}
        color={palette.particle}
        speed={MOTION.particleRotation.slow}
        size={0.03}
        breathFactor={breathFactor}
      />
      <ImmersivePostProcessing
        {...POST_PROCESSING.breathing}
        enabled={shouldEnablePostProcessing()}
      />
    </>
  );
};

/* ── Export par défaut (compatible React.lazy) ──────────── */
const MeditationEnvironment3D = ({
  theme = 'cosmos',
  breathPhase = 'hold',
  className,
}: MeditationEnvironment3DProps) => {
  const palette = THEME_PALETTES[theme];

  return (
    <ImmersiveCanvas
      height="h-[300px] sm:h-[400px] md:h-[500px]"
      className={className}
      scene="breathing"
      fogColor={palette.fog}
      cameraPosition={[0, 0, 5]}
    >
      <MeditationScene theme={theme} breathPhase={breathPhase} />
    </ImmersiveCanvas>
  );
};

export default MeditationEnvironment3D;
