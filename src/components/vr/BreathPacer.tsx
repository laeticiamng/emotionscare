import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { VRBreathPattern } from '@/store/vrbreath.store';

interface BreathPacerProps {
  pattern: VRBreathPattern;
  running: boolean;
}

export const BreathPacer: React.FC<BreathPacerProps> = ({ pattern, running }) => {
  const meshRef = useRef<any>();

  useFrame((state) => {
    if (!meshRef.current || !running) return;

    const time = state.clock.getElapsedTime();
    const scale = 1 + Math.sin(time * 0.5) * 0.3;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="lightblue" opacity={0.8} transparent />
    </mesh>
  );
};