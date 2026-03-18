/**
 * Sphère 3D émotionnelle — visualise l'état émotionnel via valence et arousal
 * Valence (0→1) : rouge → vert (couleur)
 * Arousal (0→1) : taille & vitesse de pulsation
 * Particules flottantes autour de la sphère
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
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

interface EmotionSphere3DProps {
  valence: number;
  arousal: number;
  emotion?: string;
  className?: string;
}

/* ── Couleurs interpolées selon la valence ──────────────── */
const COLOR_LOW = new THREE.Color('#ef4444');   // Rouge — valence basse
const COLOR_MID = new THREE.Color(PALETTE.gold); // Or — neutre
const COLOR_HIGH = new THREE.Color('#34d399');  // Vert — valence haute

const getEmotionColor = (valence: number): THREE.Color => {
  const v = THREE.MathUtils.clamp(valence, 0, 1);
  if (v < 0.5) return COLOR_LOW.clone().lerp(COLOR_MID, v * 2);
  return COLOR_MID.clone().lerp(COLOR_HIGH, (v - 0.5) * 2);
};

/* ── Sphère intérieure avec pulsation ───────────────────── */
const EmotionCore = ({ valence, arousal }: { valence: number; arousal: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const reduced = prefersReducedMotion();

  const color = useMemo(() => getEmotionColor(valence), [valence]);
  // Taille de base modulée par arousal
  const baseScale = 0.8 + arousal * 0.6;
  // Vitesse de pulsation modulée par arousal
  const pulseSpeed = 0.5 + arousal * 2.5;

  useFrame((state) => {
    if (!meshRef.current || !isTabVisible()) return;
    const t = state.clock.elapsedTime;

    if (!reduced) {
      // Pulsation organique
      const pulse = Math.sin(t * pulseSpeed) * 0.08 * arousal;
      meshRef.current.scale.setScalar(baseScale + pulse);
      meshRef.current.rotation.y = t * MOTION.particleRotation.slow;
    } else {
      meshRef.current.scale.setScalar(baseScale);
    }
  });

  return (
    <Float speed={reduced ? 0 : 1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35 + arousal * 0.3}
          roughness={0.25}
          metalness={0.15}
          distort={reduced ? 0 : 0.15 + arousal * 0.2}
          speed={reduced ? 0 : 1.5 + arousal * 3}
          transparent
          opacity={0.92}
        />
      </mesh>
    </Float>
  );
};

/* ── Éclairage de la scène ──────────────────────────────── */
const EmotionLighting = ({ valence }: { valence: number }) => {
  const color = useMemo(() => '#' + getEmotionColor(valence).getHexString(), [valence]);
  return (
    <>
      <pointLight position={[3, 3, 3]} intensity={0.8} color={color} />
      <pointLight position={[-3, -2, 2]} intensity={0.4} color={PALETTE.accent} />
    </>
  );
};

/* ── Scène complète ─────────────────────────────────────── */
const EmotionScene = ({ valence, arousal }: { valence: number; arousal: number }) => {
  const tier = getDeviceTier();
  const particleCount = tier === 'high' ? 120 : tier === 'medium' ? 70 : 35;
  const color = useMemo(() => '#' + getEmotionColor(valence).getHexString(), [valence]);

  return (
    <>
      <EmotionLighting valence={valence} />
      <EmotionCore valence={valence} arousal={arousal} />
      <CosmicParticleField
        count={particleCount}
        radius={3.5}
        color={color}
        speed={MOTION.particleRotation.slow + arousal * 0.015}
        size={0.035}
      />
      <ImmersivePostProcessing
        {...POST_PROCESSING.hero}
        bloomIntensity={0.8 + arousal * 0.5}
        enabled={shouldEnablePostProcessing()}
      />
    </>
  );
};

/* ── Export par défaut (compatible React.lazy) ──────────── */
const EmotionSphere3D = ({ valence, arousal, className }: EmotionSphere3DProps) => (
  <ImmersiveCanvas
    height="h-[250px] sm:h-[320px] md:h-[380px]"
    className={className}
    scene="nebula"
    cameraPosition={[0, 0, 4.5]}
  >
    <EmotionScene valence={valence} arousal={arousal} />
  </ImmersiveCanvas>
);

export default EmotionSphere3D;
