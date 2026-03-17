/**
 * Sphère 3D immersive multi-couches pour la respiration
 * Orbe lumineux avec glow interne et anneaux concentriques
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { BreathingPhase } from '../types';

interface BreathingSphereProps {
  phase: BreathingPhase;
  progress: number;
}

export const BreathingSphere = ({ phase, progress }: BreathingSphereProps) => {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  const phaseColors = useMemo(() => ({
    inhale: new THREE.Color('#4f9eff'),
    hold: new THREE.Color('#a78bfa'),
    exhale: new THREE.Color('#34d399'),
    rest: new THREE.Color('#fbbf24'),
  }), []);

  const currentColor = useRef(new THREE.Color('#4f9eff'));
  const currentEmissive = useRef(new THREE.Color('#4f9eff'));

  const targetScale = phase === 'inhale' ? 2.2 : phase === 'hold' ? 2.2 : phase === 'exhale' ? 1 : 1;

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const normalizedProgress = progress / 100;
    const scale = 1 + (targetScale - 1) * normalizedProgress;

    // Smooth color lerp
    const targetColor = phaseColors[phase];
    currentColor.current.lerp(targetColor, 0.04);
    currentEmissive.current.lerp(targetColor, 0.04);

    // === Outer sphere (translucent shell) ===
    if (outerRef.current) {
      outerRef.current.scale.setScalar(scale);
      outerRef.current.rotation.y = time * 0.15;
      outerRef.current.rotation.x = Math.sin(time * 0.3) * 0.15;
      const outerMat = outerRef.current.material as THREE.MeshPhysicalMaterial;
      outerMat.color.copy(currentColor.current);
      outerMat.emissive.copy(currentEmissive.current);
      outerMat.emissiveIntensity = 0.4 + Math.sin(time * 1.5) * 0.15;
    }

    // === Inner glow sphere ===
    if (innerRef.current) {
      const innerScale = scale * 0.6;
      innerRef.current.scale.setScalar(innerScale);
      innerRef.current.rotation.y = -time * 0.2;
      const innerMat = innerRef.current.material as THREE.MeshStandardMaterial;
      innerMat.color.copy(currentColor.current);
      innerMat.emissive.copy(currentEmissive.current);
      innerMat.emissiveIntensity = 1.2 + Math.sin(time * 2) * 0.4;
    }

    // === Ripple rings ===
    const rings = [ring1Ref, ring2Ref, ring3Ref];
    rings.forEach((ref, i) => {
      if (!ref.current) return;
      const offset = i * 0.8;
      const ringScale = scale * (1.3 + i * 0.3) + Math.sin(time * 1.2 + offset) * 0.15;
      ref.current.scale.setScalar(ringScale);
      ref.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.5 + offset) * 0.3;
      ref.current.rotation.z = time * (0.1 + i * 0.05);
      const ringMat = ref.current.material as THREE.MeshStandardMaterial;
      ringMat.color.copy(currentColor.current);
      ringMat.emissive.copy(currentEmissive.current);
      ringMat.emissiveIntensity = 0.6 + Math.sin(time * 1.5 + offset) * 0.3;
      ringMat.opacity = 0.15 + Math.sin(time + offset) * 0.1;
    });
  });

  return (
    <group>
      {/* Outer translucent sphere */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color="#4f9eff"
          emissive="#4f9eff"
          emissiveIntensity={0.4}
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.1}
          transmission={0.6}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Inner glow core */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#4f9eff"
          emissive="#4f9eff"
          emissiveIntensity={1.2}
          transparent
          opacity={0.8}
          roughness={0}
          metalness={0}
        />
      </mesh>

      {/* Ripple ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1, 0.015, 16, 100]} />
        <meshStandardMaterial
          color="#4f9eff"
          emissive="#4f9eff"
          emissiveIntensity={0.6}
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Ripple ring 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1, 0.01, 16, 100]} />
        <meshStandardMaterial
          color="#4f9eff"
          emissive="#4f9eff"
          emissiveIntensity={0.6}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Ripple ring 3 */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[1, 0.008, 16, 100]} />
        <meshStandardMaterial
          color="#4f9eff"
          emissive="#4f9eff"
          emissiveIntensity={0.6}
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
};
