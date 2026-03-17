/**
 * Sphère de respiration VR multi-couches (cohérence visuelle 2026)
 * Physical material + inner glow + anneaux concentriques
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isTabVisible } from '@/components/3d/visualDirection';
import { type VRBreathPhase } from '@/store/vr.store';

interface BreathPacerSphereProps {
  phase: VRBreathPhase;
  progress: number;
  reducedMotion: boolean;
}

const PHASE_COLORS: Record<string, THREE.Color> = {
  inhale: new THREE.Color('#4f9eff'),
  hold: new THREE.Color('#a78bfa'),
  exhale: new THREE.Color('#34d399'),
  pause: new THREE.Color('#fbbf24'),
};

export const BreathPacerSphere: React.FC<BreathPacerSphereProps> = ({
  phase,
  progress,
  reducedMotion,
}) => {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const currentColor = useRef(new THREE.Color('#4f9eff'));

  useFrame((state, delta) => {
    if (!isTabVisible()) return;
    const t = state.clock.elapsedTime;
    const targetColor = PHASE_COLORS[phase] || PHASE_COLORS.pause;
    const lerpSpeed = reducedMotion ? 1 : 0.04;
    currentColor.current.lerp(targetColor, lerpSpeed);

    // Calculate scale
    let targetScale = 1;
    switch (phase) {
      case 'inhale': targetScale = 1 + progress * 0.5; break;
      case 'hold': targetScale = 1.5; break;
      case 'exhale': targetScale = 1.5 - progress * 0.5; break;
      default: targetScale = 1;
    }

    // Outer sphere
    if (outerRef.current) {
      const s = reducedMotion ? targetScale : THREE.MathUtils.lerp(outerRef.current.scale.x, targetScale, delta * 2);
      outerRef.current.scale.setScalar(s);
      if (!reducedMotion) {
        outerRef.current.rotation.y = t * 0.15;
        outerRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
      }
      const mat = outerRef.current.material as THREE.MeshPhysicalMaterial;
      mat.color.copy(currentColor.current);
      mat.emissive.copy(currentColor.current);
      mat.emissiveIntensity = 0.4 + Math.sin(t * 1.5) * 0.15;
    }

    // Inner glow
    if (innerRef.current) {
      const innerScale = (reducedMotion ? targetScale : outerRef.current?.scale.x || 1) * 0.5;
      innerRef.current.scale.setScalar(innerScale);
      if (!reducedMotion) innerRef.current.rotation.y = -t * 0.2;
      const mat = innerRef.current.material as THREE.MeshStandardMaterial;
      mat.color.copy(currentColor.current);
      mat.emissive.copy(currentColor.current);
      mat.emissiveIntensity = 1.2 + Math.sin(t * 2) * 0.4;
    }

    // Rings
    [ring1Ref, ring2Ref].forEach((ref, i) => {
      if (!ref.current || reducedMotion) return;
      const offset = i * 0.8;
      const baseScale = (outerRef.current?.scale.x || 1) * (1.3 + i * 0.3);
      const ringScale = baseScale + Math.sin(t * 1.2 + offset) * 0.1;
      ref.current.scale.setScalar(ringScale);
      ref.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5 + offset) * 0.3;
      ref.current.rotation.z = t * (0.1 + i * 0.05);
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.color.copy(currentColor.current);
      mat.emissive.copy(currentColor.current);
      mat.opacity = 0.15 + Math.sin(t + offset) * 0.08;
    });

    // Floating animation
    if (!reducedMotion && outerRef.current) {
      outerRef.current.position.y = Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <group position={[0, 0, -2]}>
      {/* Outer translucent sphere */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color="#4f9eff"
          emissive="#4f9eff"
          emissiveIntensity={0.4}
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
          transmission={0.5}
          thickness={0.4}
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
          opacity={0.7}
          roughness={0}
        />
      </mesh>

      {/* Ripple rings */}
      {!reducedMotion && (
        <>
          <mesh ref={ring1Ref}>
            <torusGeometry args={[1, 0.012, 16, 80]} />
            <meshStandardMaterial color="#4f9eff" emissive="#4f9eff" emissiveIntensity={0.5} transparent opacity={0.2} />
          </mesh>
          <mesh ref={ring2Ref}>
            <torusGeometry args={[1, 0.008, 16, 80]} />
            <meshStandardMaterial color="#4f9eff" emissive="#4f9eff" emissiveIntensity={0.5} transparent opacity={0.15} />
          </mesh>
        </>
      )}
    </group>
  );
};
