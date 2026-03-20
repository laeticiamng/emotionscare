/**
 * Badge 3D de réussite — trophée rotatif pour la gamification
 * Aspect métallique avec couleurs basées sur la rareté :
 *   common → bronze, rare → argent, epic → or, legendary → diamant/arc-en-ciel
 * Particules subtiles pour le niveau légendaire
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { ImmersiveCanvas } from './ImmersiveCanvas';
import { ImmersivePostProcessing } from './ImmersivePostProcessing';
import { CosmicParticleField } from './CosmicParticleField';
import {
  PALETTE,
  MOTION,
  isTabVisible,
  prefersReducedMotion,
  shouldEnablePostProcessing,
  POST_PROCESSING,
} from './visualDirection';

/* ── Types ──────────────────────────────────────────────── */
type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

interface AchievementBadge3DProps {
  rarity: Rarity;
  name: string;
  unlocked: boolean;
  className?: string;
}

/* ── Configuration des couleurs par rareté ──────────────── */
const RARITY_CONFIG: Record<Rarity, {
  color: string; emissive: string; metalness: number; roughness: number; particles: boolean;
}> = {
  common:    { color: '#cd7f32', emissive: '#8b5e20', metalness: 0.7, roughness: 0.4, particles: false },
  rare:      { color: '#c0c0c0', emissive: '#8a8a9a', metalness: 0.85, roughness: 0.25, particles: false },
  epic:      { color: '#fbbf24', emissive: '#d4940a', metalness: 0.95, roughness: 0.15, particles: false },
  legendary: { color: '#e0f0ff', emissive: '#a78bfa', metalness: 1.0, roughness: 0.05, particles: true },
};

/* ── Étoile 3D (forme du badge) ─────────────────────────── */
const BadgeStar = ({ rarity, unlocked }: { rarity: Rarity; unlocked: boolean }) => {
  const meshRef = useRef<THREE.Group>(null);
  const reduced = prefersReducedMotion();
  const config = RARITY_CONFIG[rarity];

  // Arc-en-ciel pour légendaire
  const emissiveRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (!meshRef.current || !isTabVisible()) return;
    const t = state.clock.elapsedTime;

    if (!reduced) {
      meshRef.current.rotation.y = t * 0.4;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    }

    // Effet arc-en-ciel pour légendaire
    if (rarity === 'legendary' && emissiveRef.current && !reduced) {
      const hue = (t * 0.08) % 1;
      emissiveRef.current.emissive.setHSL(hue, 0.7, 0.45);
    }
  });

  // Opacité réduite si verrouillé
  const opacity = unlocked ? 1 : 0.35;

  return (
    <Float speed={reduced ? 0 : 1.8} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={meshRef}>
        {/* Médaillon central */}
        <mesh>
          <torusGeometry args={[0.9, 0.15, 16, 48]} />
          <meshStandardMaterial
            ref={emissiveRef}
            color={config.color}
            emissive={config.emissive}
            emissiveIntensity={unlocked ? 0.5 : 0.1}
            metalness={config.metalness}
            roughness={config.roughness}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Centre du badge — boîte arrondie */}
        <RoundedBox args={[1.1, 1.1, 0.15]} radius={0.12} smoothness={4}>
          <meshStandardMaterial
            color={config.color}
            emissive={config.emissive}
            emissiveIntensity={unlocked ? 0.3 : 0.05}
            metalness={config.metalness}
            roughness={config.roughness + 0.1}
            transparent
            opacity={opacity}
          />
        </RoundedBox>

        {/* Étoile décorative au sommet */}
        <mesh position={[0, 1.15, 0]} scale={0.25}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={config.color}
            emissive={config.emissive}
            emissiveIntensity={unlocked ? 0.6 : 0.1}
            metalness={1}
            roughness={0.1}
            transparent
            opacity={opacity}
          />
        </mesh>
      </group>
    </Float>
  );
};

/* ── Éclairage adapté à la rareté ───────────────────────── */
const BadgeLighting = ({ rarity }: { rarity: Rarity }) => {
  const config = RARITY_CONFIG[rarity];
  return (
    <>
      <pointLight position={[3, 3, 4]} intensity={1.0} color={config.color} />
      <pointLight position={[-2, -1, 3]} intensity={0.5} color={PALETTE.accent} />
      <directionalLight position={[0, 5, 5]} intensity={0.6} />
    </>
  );
};

/* ── Scène complète ─────────────────────────────────────── */
const BadgeScene = ({ rarity, unlocked }: { rarity: Rarity; unlocked: boolean }) => {
  const config = RARITY_CONFIG[rarity];
  return (
    <>
      <BadgeLighting rarity={rarity} />
      <BadgeStar rarity={rarity} unlocked={unlocked} />
      {/* Particules uniquement pour légendaire et débloqué */}
      {config.particles && unlocked && (
        <CosmicParticleField count={60} radius={2.5} color={PALETTE.gold} size={0.04} />
      )}
      <ImmersivePostProcessing
        {...POST_PROCESSING.hero}
        bloomIntensity={rarity === 'legendary' ? 1.4 : 0.8}
        enabled={shouldEnablePostProcessing()}
      />
    </>
  );
};

/* ── Export par défaut (compatible React.lazy) ──────────── */
const AchievementBadge3D = ({ rarity, name, unlocked, className }: AchievementBadge3DProps) => (
  <ImmersiveCanvas
    height="h-[200px] sm:h-[250px] md:h-[300px]"
    className={className}
    scene="galaxy"
    cameraPosition={[0, 0, 4]}
  >
    <BadgeScene rarity={rarity} unlocked={unlocked} />
  </ImmersiveCanvas>
);

export default AchievementBadge3D;
