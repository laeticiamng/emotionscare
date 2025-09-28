import React from 'react';
import { Text } from '@react-three/drei';

interface HUDControlsProps {
  onStart: () => void;
  onPause: () => void;
  onExit: () => void;
  running: boolean;
}

export const HUDControls: React.FC<HUDControlsProps> = ({ 
  onStart, 
  onPause, 
  onExit, 
  running 
}) => {
  return (
    <group position={[0, -1, -1]}>
      <Text
        position={[0, 0, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {running ? 'En cours...' : 'Appuyez pour commencer'}
      </Text>
    </group>
  );
};