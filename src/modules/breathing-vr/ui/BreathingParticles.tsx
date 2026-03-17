/**
 * Champ de particules immersif pour la respiration
 * Les particules s'étendent à l'inspiration et se contractent à l'expiration
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE, isTabVisible } from '@/components/3d/visualDirection';
import type { BreathingPhase } from '../types';

interface BreathingParticlesProps {
  phase: BreathingPhase;
  progress: number;
  count?: number;
}

export const BreathingParticles = ({ phase, progress, count = 300 }: BreathingParticlesProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  const phaseColors: Record<BreathingPhase, THREE.Color> = useMemo(() => ({
    inhale: new THREE.Color(PALETTE.breathing.inhale),
    hold: new THREE.Color(PALETTE.breathing.hold),
    exhale: new THREE.Color(PALETTE.breathing.exhale),
    rest: new THREE.Color(PALETTE.breathing.rest),
  }), []);

  // Generate initial particle positions in a sphere distribution
  const { positions, velocities, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 2;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      sz[i] = Math.random() * 3 + 1;
    }

    return { positions: pos, velocities: vel, sizes: sz };
  }, [count]);

  const currentColor = useRef(new THREE.Color('#4f9eff'));

  useFrame((state) => {
    if (!pointsRef.current || !isTabVisible()) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
    const time = state.clock.elapsedTime;
    const normalizedProgress = progress / 100;

    // Breathing expansion factor
    const breathFactor = phase === 'inhale'
      ? 1 + normalizedProgress * 0.8
      : phase === 'hold'
        ? 1.8
        : phase === 'exhale'
          ? 1.8 - normalizedProgress * 0.8
          : 1;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Base position with drift
      const x = positions[ix] + Math.sin(time * 0.3 + i) * 0.1;
      const y = positions[iy] + Math.cos(time * 0.2 + i * 0.5) * 0.1;
      const z = positions[iz] + Math.sin(time * 0.4 + i * 0.3) * 0.1;

      // Apply breathing scale
      posAttr.setXYZ(i, x * breathFactor, y * breathFactor, z * breathFactor);
    }

    posAttr.needsUpdate = true;

    // Smooth color transition
    const targetColor = phaseColors[phase];
    currentColor.current.lerp(targetColor, 0.05);
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.color.copy(currentColor.current);

    // Pulsing opacity
    mat.opacity = 0.4 + Math.sin(time * 2) * 0.15 + normalizedProgress * 0.2;

    // Slow rotation
    pointsRef.current.rotation.y = time * 0.05;
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};
