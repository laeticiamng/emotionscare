/**
 * Scène 3D complète pour la respiration
 */

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { BreathingSphere } from './BreathingSphere';
import type { BreathingPhase } from '../types';

interface BreathingSceneProps {
  phase: BreathingPhase;
  progress: number;
}

export const BreathingScene = ({ phase, progress }: BreathingSceneProps) => {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-background to-muted">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        
        <BreathingSphere phase={phase} progress={progress} />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
};
