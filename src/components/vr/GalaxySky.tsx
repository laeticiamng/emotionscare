import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface GalaxySkyProps {
  reducedMotion: boolean;
  className?: string;
}

export const GalaxySky: React.FC<GalaxySkyProps> = ({
  reducedMotion
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate star positions
  const starPositions = useMemo(() => {
    const positions = new Float32Array(2000 * 3); // 2000 stars, 3 coordinates each
    
    for (let i = 0; i < 2000; i++) {
      // Distribute stars in a sphere around the user
      const radius = 50 + Math.random() * 200; // Distance from center
      const theta = Math.random() * Math.PI * 2; // Horizontal angle
      const phi = Math.random() * Math.PI; // Vertical angle
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta); // x
      positions[i * 3 + 1] = radius * Math.cos(phi); // y
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta); // z
    }
    
    return positions;
  }, []);

  // Generate star colors (subtle variations)
  const starColors = useMemo(() => {
    const colors = new Float32Array(2000 * 3);
    
    for (let i = 0; i < 2000; i++) {
      const colorVariation = Math.random();
      
      if (colorVariation < 0.7) {
        // White/blue stars (most common)
        colors[i * 3] = 0.8 + Math.random() * 0.2; // r
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1; // g
        colors[i * 3 + 2] = 1.0; // b
      } else if (colorVariation < 0.9) {
        // Slightly warm stars
        colors[i * 3] = 1.0; // r
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2; // g
        colors[i * 3 + 2] = 0.6 + Math.random() * 0.3; // b
      } else {
        // Cool blue stars
        colors[i * 3] = 0.6 + Math.random() * 0.2; // r
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2; // g
        colors[i * 3 + 2] = 1.0; // b
      }
    }
    
    return colors;
  }, []);

  // Generate star sizes
  const starSizes = useMemo(() => {
    const sizes = new Float32Array(2000);
    
    for (let i = 0; i < 2000; i++) {
      sizes[i] = Math.random() * 3 + 0.5; // Size between 0.5 and 3.5
    }
    
    return sizes;
  }, []);

  // Animate stars (gentle drift)
  useFrame((state, delta) => {
    if (reducedMotion || !pointsRef.current) return;
    
    // Very subtle rotation and drift
    pointsRef.current.rotation.y += delta * 0.01; // Slow rotation
    pointsRef.current.rotation.x += delta * 0.005; // Even slower vertical drift
    
    // Subtle breathing effect (scale)
    const breathingScale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    pointsRef.current.scale.setScalar(breathingScale);
  });

  return (
    <Points
      ref={pointsRef}
      positions={starPositions}
      colors={starColors}
      sizes={starSizes}
    >
      <PointMaterial
        transparent
        alphaTest={0.01}
        vertexColors
        size={2}
        sizeAttenuation={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};