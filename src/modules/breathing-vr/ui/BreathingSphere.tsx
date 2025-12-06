/**
 * Sphère 3D animée pour la respiration
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { BreathingPhase } from '../types';

interface BreathingSphereProps {
  phase: BreathingPhase;
  progress: number;
}

export const BreathingSphere = ({ phase, progress }: BreathingSphereProps) => {
  const meshRef = useRef<any>(null);

  const phaseColors: Record<BreathingPhase, string> = {
    inhale: '#3b82f6',
    hold: '#8b5cf6',
    exhale: '#10b981',
    rest: '#f59e0b'
  };

  const targetScale = phase === 'inhale' ? 2.5 : phase === 'hold' ? 2.5 : 1;

  useFrame((state) => {
    if (!meshRef.current) return;

    // Smooth scale animation based on progress
    const currentProgress = progress / 100;
    const scale = 1 + (targetScale - 1) * currentProgress;
    meshRef.current.scale.setScalar(scale);

    // Gentle rotation
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        color={phaseColors[phase]}
        emissive={phaseColors[phase]}
        emissiveIntensity={0.3}
        roughness={0.3}
        metalness={0.8}
      />
    </mesh>
  );
};
