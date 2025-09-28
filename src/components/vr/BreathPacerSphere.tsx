import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { type VRBreathPhase } from '@/store/vr.store';

interface BreathPacerSphereProps {
  phase: VRBreathPhase;
  progress: number; // 0-1 for current phase
  reducedMotion: boolean;
}

export const BreathPacerSphere: React.FC<BreathPacerSphereProps> = ({
  phase,
  progress,
  reducedMotion
}) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  
  // Calculate scale based on breathing phase
  const getTargetScale = () => {
    switch (phase) {
      case 'inhale':
        return 1 + (progress * 0.5); // Scale from 1.0 to 1.5
      case 'hold':
        return 1.5; // Stay at maximum size
      case 'exhale':
        return 1.5 - (progress * 0.5); // Scale from 1.5 back to 1.0
      case 'pause':
        return 1; // Normal size
      default:
        return 1;
    }
  };

  // Calculate opacity based on breathing phase
  const getTargetOpacity = () => {
    switch (phase) {
      case 'inhale':
        return 0.3 + (progress * 0.4); // Fade in during inhale
      case 'hold':
        return 0.7; // Bright during hold
      case 'exhale':
        return 0.7 - (progress * 0.3); // Fade out during exhale
      case 'pause':
        return 0.4; // Dim during pause
      default:
        return 0.5;
    }
  };

  // Get color based on phase
  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return new THREE.Color(0.2, 0.6, 1.0); // Blue for inhale
      case 'hold':
        return new THREE.Color(0.8, 0.4, 1.0); // Purple for hold
      case 'exhale':
        return new THREE.Color(0.2, 0.8, 0.6); // Teal for exhale
      case 'pause':
        return new THREE.Color(0.6, 0.6, 0.6); // Gray for pause
      default:
        return new THREE.Color(0.5, 0.5, 1.0);
    }
  };

  // Create sphere geometry with smooth surface
  const sphereGeometry = useMemo(() => {
    return new THREE.SphereGeometry(1, 32, 32);
  }, []);

  // Create material with glow effect
  const sphereMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: getPhaseColor(),
      transparent: true,
      opacity: getTargetOpacity(),
      wireframe: false,
    });
  }, []);

  // Animation loop
  useFrame((state, delta) => {
    if (!sphereRef.current || !materialRef.current) return;

    const targetScale = getTargetScale();
    const targetOpacity = getTargetOpacity();
    const phaseColor = getPhaseColor();

    if (reducedMotion) {
      // Immediate transitions for reduced motion
      sphereRef.current.scale.setScalar(targetScale);
      materialRef.current.opacity = targetOpacity;
      materialRef.current.color.copy(phaseColor);
    } else {
      // Smooth transitions
      const lerpSpeed = 2.0;
      
      // Smoothly scale the sphere
      const currentScale = sphereRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * lerpSpeed);
      sphereRef.current.scale.setScalar(newScale);
      
      // Smoothly change opacity
      materialRef.current.opacity = THREE.MathUtils.lerp(
        materialRef.current.opacity,
        targetOpacity,
        delta * lerpSpeed
      );
      
      // Smoothly change color
      materialRef.current.color.lerp(phaseColor, delta * lerpSpeed);
      
      // Add subtle floating animation
      sphereRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      
      // Gentle rotation
      sphereRef.current.rotation.y += delta * 0.2;
      sphereRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <group position={[0, 0, -2]}> {/* Position sphere in front of user */}
      {/* Main breathing sphere */}
      <Sphere
        ref={sphereRef}
        args={[1, 32, 32]}
        position={[0, 0, 0]}
      >
        <meshBasicMaterial
          ref={materialRef}
          color={getPhaseColor()}
          transparent
          opacity={getTargetOpacity()}
        />
      </Sphere>
      
      {/* Outer glow ring (if not reduced motion) */}
      {!reducedMotion && (
        <Sphere
          args={[1.2, 16, 16]}
          position={[0, 0, 0]}
        >
          <meshBasicMaterial
            color={getPhaseColor()}
            transparent
            opacity={0.1}
            wireframe={true}
          />
        </Sphere>
      )}
      
      {/* Inner core */}
      <Sphere
        args={[0.3, 16, 16]}
        position={[0, 0, 0]}
      >
        <meshBasicMaterial
          color={getPhaseColor()}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </group>
  );
};