
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Torus } from '@react-three/drei';
import { MusicTrack } from '@/types/music';
import * as THREE from 'three';

interface AnimatedSphereProps {
  isPlaying: boolean;
  audioData?: number[];
}

const AnimatedSphere: React.FC<AnimatedSphereProps> = ({ isPlaying, audioData }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(1);

  useFrame((state) => {
    if (meshRef.current && isPlaying) {
      // Animation de rotation basée sur la musique
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      
      // Pulsation basée sur l'audio (simulé)
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      setScale(pulse);
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} scale={[scale, scale, scale]}>
      <meshStandardMaterial
        color="#6366f1"
        wireframe
        transparent
        opacity={0.7}
      />
    </Sphere>
  );
};

const FloatingElements: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const count = 50;
  const positions = useRef<number[]>([]);
  
  // Générer des positions aléatoires
  useEffect(() => {
    positions.current = Array.from({ length: count * 3 }, () => 
      (Math.random() - 0.5) * 20
    );
  }, []);

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <FloatingBox 
          key={i} 
          position={[
            positions.current[i * 3],
            positions.current[i * 3 + 1],
            positions.current[i * 3 + 2]
          ]}
          isPlaying={isPlaying}
        />
      ))}
    </>
  );
};

interface FloatingBoxProps {
  position: [number, number, number];
  isPlaying: boolean;
}

const FloatingBox: React.FC<FloatingBoxProps> = ({ position, isPlaying }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && isPlaying) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.02;
      
      // Mouvement flottant
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
    }
  });

  return (
    <Box 
      ref={meshRef} 
      position={position}
      args={[0.2, 0.2, 0.2]}
    >
      <meshStandardMaterial 
        color={`hsl(${Math.random() * 360}, 70%, 60%)`}
        transparent
        opacity={0.6}
      />
    </Box>
  );
};

interface ThreeDVisualizerProps {
  isPlaying: boolean;
  track?: MusicTrack | null;
  fullscreen?: boolean;
}

const ThreeDVisualizer: React.FC<ThreeDVisualizerProps> = ({ 
  isPlaying, 
  track, 
  fullscreen = false 
}) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#ff6b6b" />
        <pointLight position={[10, -10, 5]} intensity={0.3} color="#4ecdc4" />
        
        <AnimatedSphere isPlaying={isPlaying} />
        <FloatingElements isPlaying={isPlaying} />
        
        {/* Torus en arrière-plan */}
        <Torus args={[3, 0.1, 16, 100]} position={[0, 0, -2]}>
          <meshStandardMaterial 
            color="#8b5cf6" 
            wireframe 
            transparent 
            opacity={0.3}
          />
        </Torus>
        
        {!fullscreen && <OrbitControls enableZoom={false} />}
      </Canvas>
      
      {/* Overlay d'informations */}
      {track && (
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-sm opacity-60">Visualisation 3D</p>
          <p className="text-xs opacity-40">
            {track.emotion && `Ambiance: ${track.emotion}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ThreeDVisualizer;
