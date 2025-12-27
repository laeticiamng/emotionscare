import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MusicTrack } from '@/types/music';
import * as THREE from 'three';

interface AnimatedSphereProps {
  isPlaying: boolean;
  audioData?: number[];
}

const AnimatedSphere: React.FC<AnimatedSphereProps> = ({ isPlaying }) => {
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
    <mesh ref={meshRef} scale={[scale, scale, scale]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#6366f1"
        wireframe
        transparent
        opacity={0.7}
      />
    </mesh>
  );
};

const FloatingElements: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const positions = useRef<number[]>([]);
  const count = 20; // Réduire le nombre pour éviter les problèmes de performance
  
  // Générer des positions aléatoires
  useEffect(() => {
    positions.current = Array.from({ length: count * 3 }, () => 
      (Math.random() - 0.5) * 10
    );
  }, [count]);

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <FloatingBox 
          key={i} 
          position={[
            positions.current[i * 3] || 0,
            positions.current[i * 3 + 1] || 0,
            positions.current[i * 3 + 2] || 0
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
      const baseY = position[1] || 0;
      const offsetX = position[0] || 0;
      meshRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime + offsetX) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial 
        color={`hsl(${Math.random() * 360}, 70%, 60%)`}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

const TorusBackground: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <torusGeometry args={[3, 0.1, 16, 100]} />
      <meshStandardMaterial 
        color="#8b5cf6" 
        wireframe 
        transparent 
        opacity={0.3}
      />
    </mesh>
  );
};

const Scene: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#ff6b6b" />
      <pointLight position={[10, -10, 5]} intensity={0.3} color="#4ecdc4" />
      
      <AnimatedSphere isPlaying={isPlaying} />
      <FloatingElements isPlaying={isPlaying} />
      <TorusBackground />
    </>
  );
};

const LoadingFallback: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
    <div className="text-white text-center">
      <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
      <p className="text-sm">Chargement de la visualisation 3D...</p>
    </div>
  </div>
);

const ErrorFallback: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
    <div className="text-white text-center">
      <p className="text-sm">Visualisation 3D non disponible</p>
      <p className="text-xs opacity-60 mt-1">Mode audio seulement</p>
    </div>
  </div>
);

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
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <ErrorFallback />;
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 60 }}
          onError={() => setHasError(true)}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
        >
          <Scene isPlaying={isPlaying} />
        </Canvas>
      </Suspense>
      
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
