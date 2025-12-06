import React, { useMemo } from 'react';

interface StarfieldProps {
  reducedMotion: boolean;
}

export const Starfield: React.FC<StarfieldProps> = ({ reducedMotion }) => {
  const stars = useMemo(() => {
    const positions = [];
    for (let i = 0; i < (reducedMotion ? 50 : 200); i++) {
      positions.push(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
    }
    return new Float32Array(positions);
  }, [reducedMotion]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={stars} count={stars.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="white" />
    </points>
  );
};