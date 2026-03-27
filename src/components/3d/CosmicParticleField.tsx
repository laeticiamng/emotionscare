// @ts-nocheck
/**
 * Champ de particules cosmiques paramétrable et réutilisable
 * Uses unified visual direction defaults
 * T4: tab-inactive pause, reduced-motion aware
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE, MOTION, isTabVisible } from './visualDirection';

interface CosmicParticleFieldProps {
  count?: number;
  radius?: number;
  color?: string;
  speed?: number;
  size?: number;
  breathFactor?: number;
}

export const CosmicParticleField = ({
  count = 400,
  radius = 5,
  color = PALETTE.accent,
  speed = MOTION.particleRotation.normal,
  size = 0.04,
  breathFactor = 1,
}: CosmicParticleFieldProps) => {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = (0.5 + Math.random()) * radius;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, radius]);

  useFrame((state) => {
    if (!ref.current || !isTabVisible()) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * speed;
    ref.current.rotation.x = Math.sin(t * speed * 0.5) * 0.08;
    ref.current.scale.setScalar(breathFactor);

    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.45 + Math.sin(t * 1.2) * 0.12;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};
